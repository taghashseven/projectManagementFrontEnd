import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addResource, deleteResource } from '../features/projects/projectSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentProject } from '../features/projects/projectSlice';
import { useDarkMode } from '../context/DarkModeContext';

export default function ResourcesSection({ currentUser }) {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const currentProject = useSelector(selectCurrentProject);
  const [isAdding, setIsAdding] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'document',
    url: '',
    description: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const { darkMode } = useDarkMode();

  const resourceTypes = [
    { value: 'drive', label: 'Google Drive' },
    { value: 'folder', label: 'Folder' },
    { value: 'document', label: 'Document' },
    { value: 'link', label: 'Web Link' },
    { value: 'other', label: 'Other' }
  ];

  const typeColors = {
    'drive': darkMode ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-100 text-blue-800',
    'folder': darkMode ? 'bg-green-900/20 text-green-200' : 'bg-green-100 text-green-800',
    'document': darkMode ? 'bg-purple-900/20 text-purple-200' : 'bg-purple-100 text-purple-800',
    'link': darkMode ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
    'other': darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
  };

  const handleAddResource = () => {
    if (!newResource.name || !newResource.url) return;
    
    const resource = {
      ...newResource,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: currentUser?._id
    };
    
    dispatch(addResource({
      projectId: projectId,
      resourceData: resource
    }));

    setIsAdding(false);
    setNewResource({
      name: '',
      type: 'document',
      url: '',
      description: ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingResource.name || !editingResource.url) return;
    setEditingResource(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteResource({
      projectId: projectId, 
      resourceId: id
    }));
  };

  const renderResourceForm = () => (
    <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>
        {editingResource ? 'Edit Resource' : 'Add New Resource'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Name*
          </label>
          <input
            type="text"
            value={editingResource ? editingResource.name : newResource.name}
            onChange={(e) => editingResource 
              ? setEditingResource({...editingResource, name: e.target.value})
              : setNewResource({...newResource, name: e.target.value})
            }
            className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            placeholder="Resource name"
            required
            autoFocus
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Type*
          </label>
          <select
            value={editingResource ? editingResource.type : newResource.type}
            onChange={(e) => editingResource
              ? setEditingResource({...editingResource, type: e.target.value})
              : setNewResource({...newResource, type: e.target.value})
            }
            className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          >
            {resourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            URL*
          </label>
          <input
            type="url"
            value={editingResource ? editingResource.url : newResource.url}
            onChange={(e) => editingResource
              ? setEditingResource({...editingResource, url: e.target.value})
              : setNewResource({...newResource, url: e.target.value})
            }
            className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            required
            placeholder="https://..."
            pattern="https?://.+"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Description
          </label>
          <textarea
            value={editingResource ? editingResource.description || '' : newResource.description}
            onChange={(e) => editingResource
              ? setEditingResource({...editingResource, description: e.target.value})
              : setNewResource({...newResource, description: e.target.value})
            }
            className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            rows="2"
            placeholder="Optional description"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        {editingResource && (
          <button
            onClick={() => handleDelete(editingResource._id)}
            className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700`}
          >
            Delete Resource
          </button>
        )}
        <div className="flex space-x-3 ml-auto">
          <button
            onClick={() => editingResource ? setEditingResource(null) : setIsAdding(false)}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${
              darkMode ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={editingResource ? handleSaveEdit : handleAddResource}
            disabled={editingResource 
              ? !editingResource.name || !editingResource.url
              : !newResource.name || !newResource.url
            }
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              (editingResource 
                ? !editingResource.name || !editingResource.url
                : !newResource.name || !newResource.url)
                ? darkMode ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {editingResource ? 'Save Changes' : 'Add Resource'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCardView = () => (
    <div className="space-y-4 p-4">
      {isAdding && renderResourceForm()}
      
      {currentProject?.resources?.map(resource => (
        resource._id === editingResource?._id ? (
          renderResourceForm()
        ) : (
          <div 
            key={resource._id} 
            className={`rounded-lg shadow-sm p-4 border ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {resource.name}
                  </a>
                </h3>
                <span className={`mt-1 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColors[resource.type]}`}>
                  {resourceTypes.find(t => t.value === resource.type)?.label}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingResource(resource)}
                  className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resource._id)}
                  className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                >
                  Delete
                </button>
              </div>
            </div>

            {resource.description && (
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {resource.description}
              </p>
            )}

            <div className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Added on {new Date(resource.createdAt).toLocaleDateString()} by {resource.createdBy?.name || 'Unknown'}
            </div>
          </div>
        )
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto p-4">
      <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Name
            </th>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Type
            </th>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Description
            </th>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Created
            </th>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}>
          {isAdding && (
            <tr>
              <td colSpan="5" className="px-6 py-4">
                {renderResourceForm()}
              </td>
            </tr>
          )}
          
          {currentProject?.resources?.map(resource => (
            resource._id === editingResource?._id ? (
              <tr key={resource._id}>
                <td colSpan="5" className="px-6 py-4">
                  {renderResourceForm()}
                </td>
              </tr>
            ) : (
              <tr key={resource._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${typeColors[resource.type]}`}>
                        {resource.type.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}
                        >
                          {resource.name}
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColors[resource.type]}`}>
                    {resourceTypes.find(t => t.value === resource.type)?.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} line-clamp-2 max-w-xs`}>
                    {resource.description || '—'}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setEditingResource(resource)}
                    className={darkMode ? 'text-blue-400 hover:text-blue-300 mr-4' : 'text-blue-600 hover:text-blue-900 mr-4'}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resource._id)}
                    className={darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Project Resources
        </h2>
        <div className="flex items-center space-x-4">
          <div className={`inline-flex rounded-md shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'cards' 
                  ? darkMode 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'table' 
                  ? darkMode 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table View
            </button>
          </div>
          {!isAdding && !editingResource && (
            <button 
              onClick={() => setIsAdding(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Add Resource
            </button>
          )}
        </div>
      </div>

      {currentProject?.resources?.length === 0 && !isAdding ? (
        <div className={`rounded-lg shadow-sm p-8 text-center ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'}`}>
          <div className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No resources added yet</h3>
          <p className="mt-1 text-sm">Get started by adding a new resource.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsAdding(true)}
              className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'
              }`}
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Resource
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        renderCardView()
      ) : (
        renderTableView()
      )}
    </div>
  );
}