import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDarkMode } from '../context/DarkModeContext';
import {
  fetchAllUsers,
  deleteUser,
  updateUserDetails,
  resetUserPassword,
} from "../features/auth/authSlice";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import DarkModeButton from '../components/DarkMode';

export default function UserManagement() {
  const dispatch = useDispatch();
  const { darkMode } = useDarkMode();
  const { allUsers, loading, error } = useSelector((state) => state.auth);
  const currentUser = useSelector((state) => state.auth.user);

  // State for inline editing
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });

  // State for password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle double click for inline editing
  const handleDoubleClick = (userId, field) => {
    console.log("Double clicked userId:", userId, "field:", field);
    // if (currentUser?.role !== 'admin' || currentUser?._id === userId) return;
    
    setEditingId(userId);
    setEditingField(field);
    
    const user = allUsers.find(u => u._id === userId);
    setEditedUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
  };

  const handleSaveEdit = async (userId) => {
    try {
      if (editingField === 'password') {
        await dispatch(resetUserPassword({
          userId,
          newPassword: editedUser.password
        }));
      } else {
        await dispatch(updateUserDetails({
          userId,
          updates: {
            name: editedUser.name,
            email: editedUser.email,
            role: editedUser.role
          }
        }));
      }
      
      setEditingId(null);
      setEditingField(null);
      dispatch(fetchAllUsers()); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (selectedUser) {
      await dispatch(deleteUser(selectedUser._id));
      setShowDeleteModal(false);
      dispatch(fetchAllUsers()); // Refresh the list
    }
  };

  // Handle password reset via modal
  const handlePasswordReset = async () => {
    if (selectedUser && newPassword) {
      await dispatch(resetUserPassword({
        userId: selectedUser._id,
        newPassword
      }));
      setShowPasswordModal(false);
      setNewPassword("");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6 transition-colors duration-200`}>
      <DarkModeButton />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              User Management
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage all system users and permissions
            </p>
          </div>
        </div>

        {/* Search */}
        <div className={`rounded-lg shadow-sm p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Name
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Email
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Password
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Role
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Created At
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`px-6 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      {/* Name Column */}
                      <td 
                        className="px-6 py-4 whitespace-nowrap"
                        onDoubleClick={() => handleDoubleClick(user._id, 'name')}
                      >
                        {editingId === user._id && editingField === 'name' ? (
                          <input
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleInputChange}
                            className={`w-full p-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {user.name}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Email Column */}
                      <td 
                        className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                        onDoubleClick={() => handleDoubleClick(user._id, 'email')}
                      >
                        {editingId === user._id && editingField === 'email' ? (
                          <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            className={`w-full p-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                            autoFocus
                          />
                        ) : (
                          user.email
                        )}
                      </td>

                      {/* Password Column */}
                      <td 
                        className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                        onDoubleClick={() => handleDoubleClick(user._id, 'password')}
                      >
                        {editingId === user._id && editingField === 'password' ? (
                          <input
                            type="password"
                            name="password"
                            value={editedUser.password}
                            onChange={handleInputChange}
                            className={`w-full p-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                            placeholder="Enter new password"
                            autoFocus
                          />
                        ) : (
                          '••••••••'
                        )}
                      </td>

                      {/* Role Column */}
                      <td 
                        className="px-6 py-4 whitespace-nowrap"
                        onDoubleClick={() => handleDoubleClick(user._id, 'role')}
                      >
                        {editingId === user._id && editingField === 'role' ? (
                          <select
                            name="role"
                            value={editedUser.role}
                            onChange={handleInputChange}
                            className={`p-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                            autoFocus
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? darkMode ? 'bg-purple-700 text-purple-100' : 'bg-purple-200 text-purple-800'
                                : darkMode ? 'bg-blue-700 text-blue-100' : 'bg-blue-200 text-blue-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        )}
                      </td>

                      {/* Created At Column */}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === user._id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleCancelEdit}
                              className={`px-3 py-1 rounded-md text-sm ${
                                darkMode 
                                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(user._id)}
                              disabled={
                                (editingField === 'name' && !editedUser.name) ||
                                (editingField === 'email' && !editedUser.email) ||
                                (editingField === 'password' && !editedUser.password)
                              }
                              className={`px-3 py-1 rounded-md text-sm ${
                                darkMode 
                                  ? 'text-green-400 hover:text-green-300 hover:bg-gray-700' 
                                  : 'text-green-600 hover:text-green-800 hover:bg-gray-100'
                              }`}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            {currentUser?.role === 'admin' && currentUser?._id !== user._id && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                                className={`px-3 py-1 rounded-md text-sm ${
                                  darkMode 
                                    ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                                    : 'text-red-600 hover:text-red-800 hover:bg-gray-100'
                                }`}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
       
      </div>
    </div>
  );
}