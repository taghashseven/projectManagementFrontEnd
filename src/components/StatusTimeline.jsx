export default function StatusTimeline({ status }) {
    const statuses = [
      { id: 'not-started', label: 'Not Started' },
      { id: 'in-progress', label: 'In Progress' },
      { id: 'on-hold', label: 'On Hold' },
      { id: 'completed', label: 'Completed' },
    ];
  
    const currentIndex = statuses.findIndex(s => s.id === status);
  
    return (
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800">Project Status</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          
          {statuses.map((item, index) => (
            <div key={item.id} className="relative pl-10 pb-6">
              <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentIndex ? 'bg-green-500 text-white' :
                index === currentIndex ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <h4 className={`font-medium ${
                index <= currentIndex ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {item.label}
              </h4>
              {index === currentIndex && (
                <p className="text-sm text-gray-600 mt-1">
                  Current project status
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }