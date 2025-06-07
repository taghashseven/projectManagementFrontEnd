import { useState } from 'react';

export default function ResourcesSection({ initialResources, currentUser }) {
  const [resources, setResources] = useState(initialResources || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'document',
    url: '',
    description: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const resourceTypes = [
    { value: 'drive', label: 'Google Drive' },
    { value: 'folder', label: 'Folder' },
    { value: 'document', label: 'Document' },
    { value: 'link', label: 'Web Link' },
    { value: 'other', label: 'Other' }
  ];

  const typeColors = {
    'drive': 'bg-blue-100 text-blue-800',
    'folder': 'bg-green-100 text-green-800',
    'document': 'bg-purple-100 text-purple-800',
    'link': 'bg-yellow-100 text-yellow-800',
    'other': 'bg-gray-100 text-gray-800'
  };

  const handleAddResource = () => {
    if (!newResource.name || !newResource.url) return;
    
    const resource = {
      ...newResource,
      _id: Date.now().toString(), // Temporary ID until saved to database
      createdAt: new Date().toISOString(),
      createdBy: currentUser._id // Using _id to match Mongoose schema
    };
    
    setResources([...resources, resource]);
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
    
    setResources(resources.map(r => 
      r._id === editingResource._id ? editingResource : r
    ));
    setEditingResource(null);
  };

  const handleDelete = (id) => {
    setResources(resources.filter(r => r._id !== id));
  };

  const renderResourceForm = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-3">Add New Resource</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            value={newResource.name}
            onChange={(e) => setNewResource({...newResource, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Resource name"
            required
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
          <select
            value={newResource.type}
            onChange={(e) => setNewResource({...newResource, type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {resourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">URL*</label>
          <input
            type="url"
            value={newResource.url}
            onChange={(e) => setNewResource({...newResource, url: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
            placeholder="https://..."
            pattern="https?://.+"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={newResource.description}
            onChange={(e) => setNewResource({...newResource, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="2"
            placeholder="Optional description"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => setIsAdding(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleAddResource}
          disabled={!newResource.name || !newResource.url}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !newResource.name || !newResource.url ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Add Resource
        </button>
      </div>
    </div>
  );

  const renderEditForm = (resource) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-3">Edit Resource</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            value={resource.name}
            onChange={(e) => setEditingResource({...editingResource, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
          <select
            value={resource.type}
            onChange={(e) => setEditingResource({...editingResource, type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {resourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">URL*</label>
          <input
            type="url"
            value={resource.url}
            onChange={(e) => setEditingResource({...editingResource, url: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
            placeholder="https://..."
            pattern="https?://.+"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={resource.description || ''}
            onChange={(e) => setEditingResource({...editingResource, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="2"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handleDelete(resource._id)}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Delete Resource
        </button>
        <div className="flex space-x-3">
          <button
            onClick={() => setEditingResource(null)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={!editingResource.name || !editingResource.url}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              !editingResource.name || !editingResource.url ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const CardView = () => (
    <div className="space-y-4">
      {isAdding && renderResourceForm()}
      
      {resources.map(resource => (
        resource._id === editingResource?._id ? (
          renderEditForm(resource)
        ) : (
          <div key={resource._id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{resource.name}</h3>
                <p className="text-sm text-gray-500">
                  {resourceTypes.find(t => t.value === resource.type)?.label}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingResource(resource)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resource._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </a>
              </div>
            </div>
            {resource.description && (
              <p className="text-gray-600 mt-2 text-sm">{resource.description}</p>
            )}
            <div className="mt-2 text-xs text-gray-400">
              Added on {new Date(resource.createdAt).toLocaleDateString()} by {resource.createdBy?.name || 'Unknown'}
            </div>
          </div>
        )
      ))}
    </div>
  );

  const TableView = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isAdding && (
              <tr>
                <td colSpan="5" className="px-6 py-4">
                  {renderResourceForm()}
                </td>
              </tr>
            )}
            
            {resources.map(resource => (
              resource._id === editingResource?._id ? (
                <tr key={resource._id}>
                  <td colSpan="5" className="px-6 py-4">
                    {renderEditForm(resource)}
                  </td>
                </tr>
              ) : (
                <tr key={resource._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${typeColors[resource.type]}`}>
                          {resource.type.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
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
                    <p className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                      {resource.description || '—'}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setEditingResource(resource)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className="text-red-600 hover:text-red-900"
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
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Project Resources</h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                viewMode === 'cards' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                viewMode === 'table' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Table View
            </button>
          </div>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Add Resource
            </button>
          )}
        </div>
      </div>

      {resources.length === 0 && !isAdding ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resources added yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new resource.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Resource
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <CardView />
      ) : (
        <TableView />
      )}
    </div>
  );
}