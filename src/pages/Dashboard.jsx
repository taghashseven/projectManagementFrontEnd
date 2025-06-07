import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCreateForm from '../components/ProjectCreateForm';
import { useEffect } from 'react';
import apiFetch from "../utils/api.js"
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../features/projects/projectSlice';

export default function Dashboard() {

  const dispatch = useDispatch();
  const { items: projects, loading, error } = useSelector((state) => state.projects);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const projectCounts = {
    all: projects.length,
    'not-started': projects.filter(p => p.status === 'not-started').length,
    'in-progress': projects.filter(p => p.status === 'in-progress').length,
    'on-hold': projects.filter(p => p.status === 'on-hold').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };



  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage all your projects in one place
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Create New Project
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard 
            title="Total Projects" 
            value={projectCounts.all} 
            icon={<ProjectIcon />}
            color="bg-blue-100 text-blue-800"
          />
          <StatCard 
            title="Not Started" 
            value={projectCounts['not-started']} 
            icon={<ClockIcon />}
            color="bg-gray-100 text-gray-800"
          />
          <StatCard 
            title="In Progress" 
            value={projectCounts['in-progress']} 
            icon={<ProgressIcon />}
            color="bg-yellow-100 text-yellow-800"
          />
          <StatCard 
            title="On Hold" 
            value={projectCounts['on-hold']} 
            icon={<PauseIcon />}
            color="bg-red-100 text-red-800"
          />
          <StatCard 
            title="Completed" 
            value={projectCounts.completed} 
            icon={<CheckIcon />}
            color="bg-green-100 text-green-800"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0">
              {['all', 'not-started', 'in-progress', 'on-hold', 'completed'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {filter === 'all' ? 'All Projects' : filter.replace('-', ' ')}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              {activeFilter === 'all' ? 'All Projects' : `${activeFilter.replace('-', ' ')} Projects`}
              <span className="ml-2 text-sm text-gray-500">
                ({filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'})
              </span>
            </h2>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FolderIcon />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery 
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Get started by creating a new project.'}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                    setShowCreateForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  New Project
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block hover:bg-gray-50 transition duration-150"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'not-started' ? 'bg-gray-100 text-gray-800' :
                          project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status.replace('-', ' ')}
                        </span>
                        <p className="ml-2 text-sm text-gray-500">
                          Started on {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <div className="flex -space-x-1 overflow-hidden">
                          {project.team.slice(0, 3).map((member) => (
                            <div
                              key={member._id}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium"
                            >
                              {member.name.charAt(0)}
                            </div>
                          ))}
                          {project.team.length > 3 && (
                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium">
                              +{project.team.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>
                          {project?.resources?.length} {project?.resources?.length === 1 ? 'resource' : 'resources'}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ChatBubbleLeftIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>View discussion</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Create Project Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <ProjectCreateForm 
                  onCreateProject={() => {
                    onCreateProject(newProject);
                    setShowCreateForm(false);
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-12 w-12 rounded-full ${color.split(' ')[0]} flex items-center justify-center`}>
            <div className={`h-6 w-6 ${color.split(' ')[1]}`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons (You can replace these with actual icon components from your library)
function ProjectIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

function DocumentTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChatBubbleLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}