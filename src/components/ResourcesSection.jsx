export default function ResourcesSection({ resources }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Project Resources</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add Resource
          </button>
        </div>
  
        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No resources added yet
          </div>
        ) : (
          <div className="space-y-4">
            {resources.map(resource => (
              <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{resource.name}</h3>
                    <p className="text-sm text-gray-500">{resource.type}</p>
                  </div>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </a>
                </div>
                {resource.description && (
                  <p className="text-gray-600 mt-2 text-sm">{resource.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }