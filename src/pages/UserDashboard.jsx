import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
//   fetchUserProjects,
//   updateProjectStatus,
} from "../features/projects/projectSlice";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    items: allProjects,
    userProjects,
    loading,
    error,
  } = useSelector((state) => state.projects);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'

  useEffect(() => {
    if (user) {
    //   dispatch(fetchUserProjects(user._id));
    }
  }, [dispatch, user]);

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      await dispatch(
        updateProjectStatus({ projectId, status: newStatus })
      ).unwrap();
    } catch (err) {
      console.error("Failed to update project status:", err);
    }
  };

  const filteredProjects = userProjects.filter((project) => {
    const matchesFilter =
      activeFilter === "all" || project.status === activeFilter;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const projectCounts = {
    all: userProjects.length,
    "not-started": userProjects.filter((p) => p.status === "not-started").length,
    "in-progress": userProjects.filter((p) => p.status === "in-progress").length,
    "on-hold": userProjects.filter((p) => p.status === "on-hold").length,
    completed: userProjects.filter((p) => p.status === "completed").length,
  };

  const statusColors = {
    "not-started": "bg-gray-100 text-gray-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    "on-hold": "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
  };

  const statusOptions = [
    { value: "not-started", label: "Not Started", icon: <ClockIcon /> },
    { value: "in-progress", label: "In Progress", icon: <ProgressIcon /> },
    { value: "on-hold", label: "On Hold", icon: <PauseIcon /> },
    { value: "completed", label: "Completed", icon: <CheckIcon /> },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your dashboard
          </h2>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Here are the projects you're involved in
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === "cards"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Card View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === "table"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Table View
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <ProjectIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{userProjects.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <ProgressIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projectCounts["in-progress"]}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <PauseIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">On Hold</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projectCounts["on-hold"]}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projectCounts["completed"]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {filter === "all"
                    ? "All Projects"
                    : filter.replace("-", " ")}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search your projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FolderIcon />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No projects found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search or filter to find what you're looking for."
                : "You're not currently assigned to any projects."}
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <UserCardView 
            projects={filteredProjects} 
            statusColors={statusColors} 
            statusOptions={statusOptions}
            onStatusUpdate={handleStatusUpdate}
            userId={user._id}
          />
        ) : (
          <UserTableView 
            projects={filteredProjects} 
            statusColors={statusColors} 
            statusOptions={statusOptions}
            onStatusUpdate={handleStatusUpdate}
            userId={user._id}
          />
        )}
      </div>
    </div>
  );
}

// User Card View Component with status update capability
function UserCardView({ projects, statusColors, statusOptions, onStatusUpdate, userId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-blue-300 transition duration-150">
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[project.status]
                  }`}
                >
                  {project.status.replace("-", " ")}
                </span>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  <Link to={`/projects/${project._id}`} className="hover:text-blue-600">
                    {project.name}
                  </Link>
                </h3>
              </div>
              {project.manager._id === userId && (
                <div className="relative">
                  <select
                    value={project.status}
                    onChange={(e) => onStatusUpdate(project._id, e.target.value)}
                    className="block appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {project.description}
            </p>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2 overflow-hidden">
                  {project.team.slice(0, 3).map((member) => (
                    <div
                      key={member._id}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium"
                      title={member.name}
                    >
                      {member.name.charAt(0)}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div 
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium"
                      title={`${project.team.length - 3} more team members`}
                    >
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Due: {new Date(project.endDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                <span>
                  {project.resources?.length || 0} resources
                </span>
              </div>
              <Link
                to={`/projects/${project._id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// User Table View Component with status update capability
function UserTableView({ projects, statusColors, statusOptions, onStatusUpdate, userId }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Your Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => {
              const userRole = project.team.find(member => member._id === userId)?.role || "Member";
              const isManager = project.manager._id === userId;
              
              return (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                        {project.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/projects/${project._id}`} className="hover:text-blue-600">
                            {project.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isManager ? (
                      <select
                        value={project.status}
                        onChange={(e) => onStatusUpdate(project._id, e.target.value)}
                        className={`text-xs font-medium rounded-md px-2 py-1 ${
                          statusColors[project.status]
                        } border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[project.status]
                        }`}
                      >
                        {project.status.replace("-", " ")}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.team.slice(0, 3).map((member) => (
                        <div
                          key={member._id}
                          className={`inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-xs font-medium ${
                            member._id === userId 
                              ? "bg-blue-600 text-white" 
                              : "bg-blue-100 text-blue-800"
                          }`}
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div 
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium"
                          title={`${project.team.length - 3} more team members`}
                        >
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isManager ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {isManager ? "Manager" : userRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/projects/${project._id}/tasks`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Tasks
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Reuse your existing icon components from the original file
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