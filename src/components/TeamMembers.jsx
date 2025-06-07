export default function TeamMembers({ team }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add Member
          </button>
        </div>
  
        {team.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No team members added yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map(member => (
              <div key={member.id} className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {member.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }