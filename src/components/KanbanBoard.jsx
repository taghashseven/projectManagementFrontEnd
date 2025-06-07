export default function KanbanBoard({ tasks }) {
    const columns = [
      { id: 'todo', title: 'To Do' },
      { id: 'in-progress', title: 'In Progress' },
      { id: 'review', title: 'Review' },
      { id: 'done', title: 'Done' },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(column => (
          <div key={column.id} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-4">{column.title}</h3>
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div key={task.id} className="bg-white rounded-lg shadow-sm p-3 border">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  }