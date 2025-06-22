import { useState } from 'react';
import Avatar from './Avatar';
import { addOrUpdateTask, deleteTask } from '../features/projects/projectSlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentProject } from '../features/projects/projectSlice';
import { useDarkMode } from '../context/DarkModeContext';

export default function KanbanBoard({ tasks: initialTasks, users }) {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState(initialTasks);
  const currentProject = useSelector(selectCurrentProject);
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
  const { projectId } = useParams();
  const { darkMode } = useDarkMode();
  const [originalTaskValues, setOriginalTaskValues] = useState({});

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
  ];

  const priorityColors = {
    low: darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800',
    medium: darkMode ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-100 text-blue-800',
    high: darkMode ? 'bg-orange-900/20 text-orange-200' : 'bg-orange-100 text-orange-800',
    critical: darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
  };

  const getUserById = (id) => users?.find(user => user._id === id);

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find(task => task._id === taskId);
    setOriginalTaskValues({
      ...taskToEdit,
      assignedTo: [...taskToEdit.assignedTo] // Create a copy of the array
    });
    setEditingTaskId(taskId);
  };

  const handleSaveTask = (taskId) => {
    const taskToSave = tasks.find(task => task._id === taskId);
    if (!taskToSave?.title) return;
    dispatch(addOrUpdateTask({ projectId: projectId, taskData: taskToSave }));
    setEditingTaskId(null);
    setOriginalTaskValues({});
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    const updatedTasks = [...tasks, { 
      ...newTask, 
      _id: Date.now().toString() 
    }];
    
    setTasks(updatedTasks);
    dispatch(addOrUpdateTask({ projectId: projectId, taskData: newTask }));
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

  const handleMarkAsDone = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task._id === taskId) {
        return { ...task, status: 'done' };
      }
      return task;
    });
    setTasks(updatedTasks);
    const taskToUpdate = updatedTasks.find(task => task._id === taskId);
    dispatch(addOrUpdateTask({ projectId: projectId, taskData: taskToUpdate }));
  };

  const hasChanges = (taskId) => {
    if (!editingTaskId || editingTaskId !== taskId) return false;
    
    const currentTask = tasks.find(task => task._id === taskId);
    if (!currentTask || !originalTaskValues) return false;
    
    // Check if any field has changed
    return (
      currentTask.title !== originalTaskValues.title ||
      currentTask.description !== originalTaskValues.description ||
      currentTask.status !== originalTaskValues.status ||
      currentTask.priority !== originalTaskValues.priority ||
      currentTask.dueDate !== originalTaskValues.dueDate ||
      currentTask.weight !== originalTaskValues.weight ||
      JSON.stringify(currentTask.assignedTo) !== JSON.stringify(originalTaskValues.assignedTo)
    );
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tasks
        </h2>
        <button 
          onClick={() => setIsAddingTask(true)}
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          Add New Task
        </button>
      </div>
      
      {/* Add Task Form */}
      {isAddingTask && (
        <div className={`p-4 rounded-lg mb-4 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Add New Task
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Title*"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
                required
              />
            </div>

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
                required
              />
            </div>
            
            <div>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
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
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
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
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
              />
            </div>

       
           
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddTask}
                className={`px-3 py-2 rounded-md ${
                  darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                Save
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className={`px-3 py-2 rounded-md ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                } ${darkMode ? 'text-white' : 'text-gray-700'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <table className={`min-w-full rounded-lg overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Done</span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Title</span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Status</span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Priority</span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Due Date</span>
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Assigned To</span>
            </th> */}
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Weight</span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className={darkMode ? 'divide-gray-700' : 'divide-gray-200'}>
          {tasks?.map(task => (
            <tr 
              key={task._id} 
              className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} group`}
              onDoubleClick={() => handleEditTask(task._id)}
            >
              {/* Done Checkbox */}
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => handleMarkAsDone(task._id)}
                  className={`h-4 w-4 rounded ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600' 
                      : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                  }`}
                />
              </td>
              
              {/* Title */}
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleTaskChange(task._id, 'title', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                    autoFocus
                  />
                ) : (
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {task.title}
                  </div>
                )}
                {task.description && (
                  <div className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {task.description}
                  </div>
                )}
              </td>
              
              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskChange(task._id, 'status', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    {columns.map(column => (
                      <option key={column.id} value={column.id}>{column.title}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.status === 'todo' ? 
                      darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800' :
                    task.status === 'in-progress' ? 
                      darkMode ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-100 text-blue-800' :
                    task.status === 'review' ? 
                      darkMode ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800' :
                      darkMode ? 'bg-green-900/20 text-green-200' : 'bg-green-100 text-green-800'
                  }`}>
                    {columns.find(c => c.id === task.status)?.title}
                  </span>
                )}
              </td>
              
              {/* Priority */}
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <select
                    value={task.priority}
                    onChange={(e) => handleTaskChange(task._id, 'priority', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
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
              
              {/* Due Date */}
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => handleTaskChange(task._id, 'dueDate', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  />
                ) : task.dueDate ? (
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      new Date(task.dueDate) < new Date() ? 'bg-red-500' : darkMode ? 'bg-gray-500' : 'bg-gray-400'
                    }`}></span>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                ) : '-'}
              </td>
              
              {/* Assigned To */}
              {/* <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <div className="space-y-2">
                    {users?.map(user => (
                      <div key={user._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`assign-${task._id}-${user._id}`}
                          checked={task.assignedTo.includes(user._id)}
                          onChange={(e) => handleAssignUser(task._id, user._id, !e.target.checked)}
                          className={`h-4 w-4 rounded ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600' 
                              : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                          }`}
                        />
                        <label htmlFor={`assign-${task._id}-${user._id}`} className={`ml-2 block text-sm ${
                          darkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
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
                          className={`border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}
                        />
                      ) : null;
                    })}
                  </div>
                )}
              </td> */}
              
              {/* Weight */}
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTaskId === task._id ? (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={task.weight}
                    onChange={(e) => handleTaskChange(task._id, 'weight', parseInt(e.target.value) || 1)}
                    className={`w-full px-2 py-1 border rounded ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {task.weight}/10
                  </span>
                )}
              </td>
              
              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  {editingTaskId === task._id && hasChanges(task._id) && (
                    <button 
                      onClick={() => handleSaveTask(task._id)}
                      className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'}`}
                    >
                      Save
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const updatedTasks = tasks.filter(t => t._id !== task._id);
                      setTasks(updatedTasks);
                      dispatch(deleteTask({projectId: projectId, taskId: task._id}))
                    }}
                    className={darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}