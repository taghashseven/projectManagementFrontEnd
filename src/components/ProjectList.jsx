export default function ProjectList({ projects, onSelectProject }) {
    const getStatusColor = (status) => {
      switch (status) {
        case 'not-started': return 'bg-gray-200 text-gray-800';
        case 'in-progress': return 'bg-yellow-100 text-yellow-800';
        case 'on-hold': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectProject(project.id)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
              <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                {project.status.replace('-', ' ')}
              </span>
            </div>
            <p className="text-gray-600 mt-2 line-clamp-2">{project.description}</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <span>Start Date: {new Date(project.startDate).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{project.team.length} team members</span>
            </div>
          </div>
        ))}
      </div>
    );
  }