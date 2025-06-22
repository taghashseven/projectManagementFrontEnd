import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import ProjectCreateForm from "../components/ProjectCreateForm";
import { useSelector, useDispatch } from "react-redux";
import { useDarkMode } from '../context/DarkModeContext';
import DarkModeButton from '../components/DarkMode';
import { useNavigate } from "react-router-dom";
import {
  fetchProjects,
  createProject,
  fetchAllUsers,
} from "../features/projects/projectSlice";
import User from "../components/UserCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const {
    items: projects,
    loading,
    error,
  } = useSelector((state) => state.projects);

  //navigate to login if not authenticated

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'cards' or 'table'

  // Check for user's preferred color scheme
  const {darkMode} = useDarkMode();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const onCreateProject = async (projectData) => {
    try {
      await dispatch(createProject(projectData)).unwrap();
      setShowCreateForm(false);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === "all" || project.status === activeFilter;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const projectCounts = {
    all: projects.length,
    "not-started": projects.filter((p) => p.status === "not-started").length,
    "in-progress": projects.filter((p) => p.status === "in-progress").length,
    "on-hold": projects.filter((p) => p.status === "on-hold").length,
    completed: projects.filter((p) => p.status === "completed").length,
    // due this week
    "due this week": projects.filter((p) => {
      const today = new Date();
      const dueDate = new Date(p.dueDate);
      return dueDate >= today && dueDate <= today + 7 * 24 * 60 * 60 * 1000;
    }).length,
  };

  // Enhanced contrast colors
  const statusColors = {
    "not-started": darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-900",
    "in-progress": darkMode ? "bg-yellow-700 text-yellow-50" : "bg-yellow-200 text-yellow-900",
    "on-hold": darkMode ? "bg-red-700 text-red-50" : "bg-red-200 text-red-900",
    completed: darkMode ? "bg-green-700 text-green-50" : "bg-green-200 text-green-900",
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6 transition-colors duration-200 relative`}>
      {/* Dark mode toggle button */}
      <DarkModeButton />

      {/* Blur overlay when modal is open */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"></div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Project Dashboard
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage all your projects in one place
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className={`flex rounded-lg shadow-sm p-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === "cards"
                    ? darkMode 
                      ? 'bg-blue-700 text-blue-50' 
                      : 'bg-blue-200 text-blue-900'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Card View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === "table"
                    ? darkMode 
                      ? 'bg-blue-700 text-blue-50' 
                      : 'bg-blue-200 text-blue-900'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Table View
              </button>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md"
            >
              Create New Project
            </button>
            <User darkMode={darkMode} />
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-lg shadow-sm p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0">
              {[
                "all",
                "not-started",
                "in-progress",
                "on-hold",
                "completed",
                
              ].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeFilter === filter
                      ? darkMode 
                        ? 'bg-blue-700 text-blue-50' 
                        : 'bg-blue-200 text-blue-900'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{projectCounts[filter]}</p>
                    {filter === "all" ? "All Projects" : filter.replace("-", " ")}
                  </div>
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          <div className={`rounded-lg shadow-sm p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <FolderIcon />
            </div>
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No projects found
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Get started by creating a new project."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                  setShowCreateForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Project
              </button>
            </div>
          </div>
        ) : viewMode === "cards" ? (
          <CardView projects={filteredProjects} statusColors={statusColors} darkMode={darkMode} />
        ) : (
          <TableView projects={filteredProjects} statusColors={statusColors} darkMode={darkMode} />
        )}

        {/* Create Project Modal */}
        {showCreateForm && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowCreateForm(false)}
          >
            <div
              className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
                darkMode ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-white border border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Create New Project
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className={`rounded-full p-1 ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-600'}`}
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <ProjectCreateForm
                  onSubmit={(projectData) => {
                    onCreateProject(projectData);
                    setShowCreateForm(false);
                  }}
                  onCancel={() => setShowCreateForm(false)}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Card View Component with enhanced contrast
function CardView({ projects, statusColors, darkMode }) {
  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
      <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className={`block transition duration-150 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
          >
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[project.status]
                    }`}
                  >
                    {project.status.replace("-", " ")}
                  </span>
                  <p className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Started on {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <div className="flex -space-x-1 overflow-hidden">
                    {project.team.slice(0, 3).map((member) => (
                      <div
                        key={member._id}
                        className={`inline-block h-6 w-6 rounded-full ring-2 ${
                          darkMode ? 'ring-gray-800' : 'ring-white'
                        } bg-blue-200 text-blue-900 flex items-center justify-center text-xs font-medium`}
                      >
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div
                        className={`inline-block h-6 w-6 rounded-full ring-2 ${
                          darkMode ? 'ring-gray-800' : 'ring-white'
                        } ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'} flex items-center justify-center text-xs font-medium`}
                      >
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {project.name}
                </h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                  {project.description}
                </p>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <DocumentTextIcon className={`flex-shrink-0 mr-1.5 h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p>
                    {project?.resources?.length}{" "}
                    {project?.resources?.length === 1 ? "resource" : "resources"}
                  </p>
                </div>
                <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <ChatBubbleLeftIcon className={`flex-shrink-0 mr-1.5 h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p>View discussion</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Table View Component with enhanced contrast
function TableView({ projects, statusColors, darkMode }) {
  const navigate = useNavigate();
  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Project Name
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Description
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Status
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Start Date
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Team
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Resources
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
              {projects.map((project) => (
                <tr 
                  key={project._id} 
                  className={darkMode ? 'hover:bg-gray-700 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'}
                  onClick={() =>  navigate(`/projects/${project._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                    <Link
                      to={`/projects/${project._id}`}
                      className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} truncate`}
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {project.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[project.status]
                      }`}
                    >
                      {project.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {new Date(project.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex -space-x-1 overflow-hidden">
                      {project.team.slice(0, 3).map((member) => (
                        <div
                          key={member._id}
                          className={`inline-block h-6 w-6 rounded-full ring-2 ${
                            darkMode ? 'ring-gray-800' : 'ring-white'
                          } bg-blue-200 text-blue-900 flex items-center justify-center text-xs font-medium`}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div
                          className={`inline-block h-6 w-6 rounded-full ring-2 ${
                            darkMode ? 'ring-gray-800' : 'ring-white'
                          } ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'} flex items-center justify-center text-xs font-medium`}
                        >
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {project?.resources?.length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Icon components remain the same
// ...
// Keep all your existing icon components as they were
function ProjectIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
}

function DocumentTextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function ChatBubbleLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}