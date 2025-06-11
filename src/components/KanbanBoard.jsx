import { useState } from 'react';
import Avatar from './Avatar';
import { addOrUpdateTask  , deleteTask} from '../features/projects/projectSlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentProject } from '../features/projects/projectSlice';

export default function KanbanBoard({ tasks: initialTasks, users, }) {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);
  const currentProject = useSelector(selectCurrentProject)
  const [viewMode, setViewMode] = useState('table');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: [],
    weight: 5
  });
  // get the project id from the url
  const { projectId } = useParams();

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'review', title: 'Review', color: 'bg-yellow-50' },
    { id: 'done', title: 'Done', color: 'bg-green-50' },
  ];

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = (status) => {
    if (draggedTask) {
      const updatedTasks = tasks.map((task) =>
        task._id === draggedTask._id ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      setDraggedTask(null);
    }
  };

  const getUserById = (id) => users?.find(user => user._id === id);

  const handleEditTask = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleSaveTask = (taskId) => {
    const taskToSave = tasks.find(task => task._id === taskId);
    if (!taskToSave?.title) return;
    console.log(taskToSave, "task to save");
    dispatch(addOrUpdateTask( {projectId : projectId, taskData: taskToSave}))
    setEditingTaskId(null);
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    const updatedTasks = [...tasks, { 
      ...newTask, 
      _id: Date.now().toString() 
    }];
    
    setTasks(updatedTasks);
    dispatch(addOrUpdateTask( {projectId : projectId, taskData: newTask}))
    setIsAddingTask(false);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      assignedTo: [],
      weight: 5
    });
  };

  const handleAssignUser = (taskId, userId, isAssigned) => {
    const updatedTasks = tasks.map(task => {
      if (task._id === taskId) {
        return {
          ...task,
          assignedTo: isAssigned 
            ? task.assignedTo.filter(id => id !== userId)
            : [...task.assignedTo, userId]
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleTaskChange = (taskId, field, value) => {
    const updatedTasks = tasks.map(task => {
      if (task._id === taskId) {
        return { ...task, [field]: value };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const renderKanbanView = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {columns.map(column => (
        <div 
          key={column.id} 
          className={`${column.color} rounded-lg p-4 min-h-[500px]`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(column.id)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">
              {column.title} 
              <span className="ml-2 text-sm text-gray-500">
                ({tasks?.filter(t => t?.status === column.id).length})
              </span>
            </h3>
            {column.id === 'todo' && (
              <button 
                onClick={() => setIsAddingTask(true)}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Add Task
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {tasks?.filter(task => task?.status === column.id)
              .map(task => (
                <div 
                  key={task?._id} 
                  className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onDoubleClick={() => handleEditTask(task._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.dueDate && (
                    <div className="mt-2 flex items-center text-sm">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        new Date(task.dueDate) < new Date() ? 'bg-red-500' : 'bg-gray-400'
                      }`}></span>
                      <span className="text-gray-600">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {task.assignedTo?.map(userId => {
                        const user = getUserById(userId);
                        return user ? (
                          <Avatar 
                            key={userId} 
                            name={user.name} 
                            size="sm" 
                            className="border-2 border-white"
                          />
                        ) : null;
                      })}
                    </div>
                    
                    <div className="text-xs font-medium text-gray-500">
                      Weight: {task.weight}/10
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button 
          onClick={() => setIsAddingTask(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Task
        </button>
      </div>
      
      {/* Add Task Form */}
      {isAddingTask && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-3">Add New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Title*"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {columns.map(column => (
                  <option key={column.id} value={column.id}>{column.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddTask}
                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save1
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks?.map(task => (
            <tr 
              key={task._id} 
              className="hover:bg-gray-50"
              onDoubleClick={() => handleEditTask(task._id)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleTaskChange(task._id, 'title', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    autoFocus
                  />
                ) : (
                  <div className="font-medium">{task.title}</div>
                )}
                {task.description && (
                  <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskChange(task._id, 'status', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    {columns.map(column => (
                      <option key={column.id} value={column.id}>{column.title}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    columns.find(c => c.id === task.status)?.color.replace('bg-', 'bg-').replace('-50', '-100')
                  }`}>
                    {columns.find(c => c.id === task.status)?.title}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <select
                    value={task.priority}
                    onChange={(e) => handleTaskChange(task._id, 'priority', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => handleTaskChange(task._id, 'dueDate', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : task.dueDate ? (
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      new Date(task.dueDate) < new Date() ? 'bg-red-500' : 'bg-gray-400'
                    }`}></span>
                    <span className="text-sm text-gray-600">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                ) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <div className="space-y-2">
                    {users?.map(user => (
                      <div key={user._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`assign-${task._id}-${user._id}`}
                          checked={task.assignedTo.includes(user._id)}
                          onChange={(e) => handleAssignUser(task._id, user._id, !e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`assign-${task._id}-${user._id}`} className="ml-2 block text-sm text-gray-900">
                          {user.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex -space-x-2">
                    {task.assignedTo?.map(userId => {
                      const user = getUserById(userId);
                      return user ? (
                        <Avatar 
                          key={userId} 
                          name={user.name} 
                          size="sm" 
                          className="border-2 border-white"
                        />
                      ) : null;
                    })}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={task.weight}
                    onChange={(e) => handleTaskChange(task._id, 'weight', parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span className="text-sm text-gray-500">
                    {task.weight}/10
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingTaskId === task._id ? (
                  <>
                    <button 
                      onClick={() => handleSaveTask(task._id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingTaskId(null)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        const updatedTasks = tasks.filter(t => t._id !== task._id);
                        setTasks(updatedTasks);
                        console.log(projectId , task._id , "dtata ----------")
                        dispatch(deleteTask({projectId: projectId , taskId: task._id}))
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex justify-end p-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'kanban' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Kanban View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'table' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Table View
          </button>
        </div>
      </div>
      
      {viewMode === 'kanban' ? renderKanbanView() : renderTableView()}
    </div>
  );
}