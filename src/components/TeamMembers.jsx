import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  addTeamMember, 
  removeTeamMember,
  fetchAllUsers 
} from '../features/projects/projectSlice';

export default function TeamMembers({ team }) {
  const { projectId} = useParams();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.projects.allUsers);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, allUsers.length]);

  // Filter out users already in the team
  const availableUsers = allUsers.filter(
    (user) => !team?.some((member) => member.email === user.email)
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

    // add team 
    team.push(selectedUser);

    handleCancel();
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      console.log(projectId , memberId , "detalis");
      dispatch(removeTeamMember({ projectId, memberId }));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
        {!isAdding && team.length > 0 && (
          <button
            onClick={handleAddMember}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3">
            Add New Team Member
          </h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {searchTerm && (
            <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredUsers.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      className={`p-3 hover:bg-gray-100 cursor-pointer ${
                        selectedUserId === user._id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectUser(user._id)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium flex-shrink-0 mr-3">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Team Members List */}
      {team.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No team members
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new team member.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddMember}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg p-4 flex items-center border border-gray-200 hover:border-blue-200 transition-colors relative group shadow-sm"
            >
              <div className="flex items-center flex-grow">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div className="ml-3 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">
                    {member.name}
                  </h3>
                  {member.email && (
                    <p className="text-xs text-gray-400 truncate">
                      {member.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <button
                  onClick={() => {
                    console.log(member , "member id");
                    handleRemoveMember(member._id)
                  }}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
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
  );
}