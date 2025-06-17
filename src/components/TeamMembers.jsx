import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { 
  addTeamMember, 
  removeTeamMember,
  fetchAllUsers,
  fetchProject
} from '../features/projects/projectSlice';

export default function TeamMembers() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.projects.allUsers);
  const currentProject = useSelector((state) => state.projects.currentProject);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode } = useDarkMode(); // Get dark mode from context

  useEffect(() => {
    dispatch(fetchProject(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, allUsers.length]);

  // Filter out users already in the team
  const availableUsers = allUsers.filter(
    (user) => !currentProject?.team?.some((member) => member.email === user.email)
  );

  // Filter users based on search term
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    setIsAdding(true);
    setSelectedUserId("");
    setSearchTerm("");
  };

  const handleCancel = () => {
    setIsAdding(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }

    const selectedUser = availableUsers.find(
      (user) => user._id === selectedUserId
    );
    if (!selectedUser) return;

    dispatch(
      addTeamMember({
        projectId,
        memberData: {
          name: selectedUser.name,
          email: selectedUser.email,
        },
      })
    );

    handleCancel();
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      dispatch(removeTeamMember({ projectId, memberId }));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6 transition-colors duration-200`}>
      <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Team Members
          </h2>
          {!isAdding && currentProject?.team?.length > 0 && (
            <button
              onClick={handleAddMember}
              className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'
              }`}
              disabled={availableUsers.length === 0}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Member
            </button>
          )}
        </div>

        {/* Add Member Section */}
        {isAdding && (
          <div className={`rounded-lg p-4 mb-6 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
              Add New Team Member
            </h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-2 border rounded-lg ${
                  darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
            </div>

            {searchTerm && (
              <div className={`mb-4 max-h-60 overflow-y-auto border rounded-lg ${
                darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
              }`}>
                {filteredUsers.length > 0 ? (
                  <ul className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                    {filteredUsers.map((user) => (
                      <li
                        key={user._id}
                        className={`p-3 hover:${darkMode ? 'bg-gray-600' : 'bg-gray-100'} cursor-pointer ${
                          selectedUserId === user._id ? (darkMode ? 'bg-blue-900' : 'bg-blue-50') : ''
                        }`}
                        onClick={() => handleSelectUser(user._id)}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium flex-shrink-0 mr-3 ${
                            darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {user.name}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No users found matching your search
                  </div>
                )}
              </div>
            )}

            {selectedUserId && (
              <form onSubmit={handleSubmit}>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`px-4 py-2 border rounded-md ${
                      darkMode ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 ${
                      darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'
                    }`}
                  >
                    Add Member
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Team Members List */}
        {currentProject?.team?.length === 0 && !isAdding ? (
          <div className={`text-center py-8 rounded-lg ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'
          }`}>
            <svg
              className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No team members
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get started by adding a new team member.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddMember}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'
                }`}
                disabled={availableUsers.length === 0}
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Member
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProject?.team?.map((member) => (
              <div
                key={member.id}
                className={`rounded-lg p-4 flex items-center border hover:border-blue-200 transition-colors relative group shadow-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 hover:border-blue-400' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center flex-grow">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium flex-shrink-0 ${
                    darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {member?.name?.charAt(0)}
                  </div>
                  <div className="ml-3 min-w-0">
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                      {member.name}
                    </h3>
                    {member.email && (
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'} truncate`}>
                        {member.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className={`p-1 rounded-full transition-colors ${
                      darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900' : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                    }`}
                    title="Remove"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}