import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  updateProject,
  deleteProject,
  setCurrentProject,
  clearCurrentProject,
  selectProjects,
  selectCurrentProject,
  selectProjectLoading,
  selectProjectError,
  addOrUpdateTask,
} from "../features/projects/projectSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";

// Components
import ProjectDetail from "../components/ProjectDetail";
import TeamMembers from "../components/TeamMembers";
import ResourcesSection from "../components/ResourcesSection";
import ProjectChat from "../components/ProjectChat";
import StatusTimeline from "../components/StatusTimeline";
import KanbanBoard from "../components/KanbanBoard";
import ProjectCalendar from "../components/ProjectCalendar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import UserCard from "../components/UserCard";
// Icons
import {
  ClipboardIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const OverviewIcon = ClipboardIcon;
const TeamIcon = UsersIcon;
const TasksIcon = ClipboardIcon;
const ResourcesIcon = DocumentTextIcon;
const ChatIcon = UsersIcon;
const CalendarIcon = CalendarDaysIcon;

const StatItem = ({
  label,
  value,
  icon,
  trend,
  trendColor = "text-gray-500",
}) => (
  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
    <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-900">{value}</p>
        {trend && (
          <span className={`text-xs ${trendColor} flex items-center`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

const ProgressBar = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const projects = useSelector(selectProjects);
  const project = useSelector(selectCurrentProject);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [isAuthenticated, navigate, dispatch, projects.length]);

  useEffect(() => {
    if (projects.length > 0) {
      const foundProject = projects.find((p) => p._id === projectId);
      if (foundProject) {
        dispatch(setCurrentProject(foundProject));
        setEditedProject({ ...foundProject });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [projects, projectId, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch]);

  const handleUpdateProject = async (updatedData) => {
    try {
      await dispatch(
        updateProject({
          projectId: project._id,
          projectData: updatedData,
        })
      ).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject(project._id)).unwrap();
        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  // Calculate project completion percentage
  const completionPercentage =
    project?.tasks?.length > 0
      ? Math.round(
          (project.tasks.filter((t) => t.status === "completed").length /
            project.tasks.length) *
            100
        )
      : 0;

  // Calculate days remaining
  const daysRemaining = project?.endDate
    ? Math.ceil(
        (new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // Calculate days active
  const daysActive = project?.startDate
    ? Math.floor(new Date() - new Date(project.startDate)) /
      (1000 * 60 * 60 * 24)
    : 0;

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <OverviewIcon className="w-5 h-5" />,
    },
    { id: "team", label: "Team", icon: <TeamIcon className="w-5 h-5" /> },
    { id: "tasks", label: "Tasks", icon: <TasksIcon className="w-5 h-5" /> },
    {
      id: "resources",
      label: "Resources",
      icon: <ResourcesIcon className="w-5 h-5" />,
    },
    { id: "chat", label: "Discussion", icon: <ChatIcon className="w-5 h-5" /> },
    {
      id: "calendar",
      label: "Calendar",
      icon: <CalendarIcon className="w-5 h-5" />,
    },
  ];

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorAlert message={error} fullPage />;
  if (!project)
    return <div className="p-6 text-gray-500">Loading project...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-gray-500 mr-4"
                aria-label="Back to dashboard"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {project.name}
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="w-5 h-5" />
                <span className="ml-2">
                  {isEditing ? "Cancel" : "Edit Project"}
                </span>
              </button>
              <button
                onClick={handleDeleteProject}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="w-5 h-5" />
                <span className="ml-2">Delete</span>
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <ShareIcon className="w-5 h-5" />
                <span className="ml-2">Share</span>
              </button>
              <UserCard />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isEditing && editedProject ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Edit Project
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProject(editedProject);
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={editedProject.name}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={editedProject.status}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editedProject.startDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editedProject.description || ""}
                  onChange={(e) =>
                    setEditedProject({
                      ...editedProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24"
                  rows="4"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white text-gray-700 py-2 px-6 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium flex items-center whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {activeTab === "overview" && (
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Project Overview
                      </h2>
                      <p className="text-gray-700 whitespace-pre-line">
                        {project.description || "No description provided."}
                      </p>
                    </div>

                    {/* Project Progress Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Project Progress
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Overall Completion
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {completionPercentage}%
                            </span>
                          </div>
                          <ProgressBar percentage={completionPercentage} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Timeline
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  Start Date
                                </span>
                                <span className="text-xs font-medium">
                                  {new Date(
                                    project.startDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                  End Date
                                </span>
                                <span className="text-xs font-medium">
                                  {project.endDate
                                    ? new Date(
                                        project.endDate
                                      ).toLocaleDateString()
                                    : "Not set"}
                                </span>
                              </div>
                              {daysRemaining !== null && (
                                <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">
                                    Days Remaining
                                  </span>
                                  <span
                                    className={`text-xs font-medium ${
                                      daysRemaining < 0
                                        ? "text-red-600"
                                        : daysRemaining < 7
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {daysRemaining > 0
                                      ? daysRemaining
                                      : "Overdue"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Task Status
                            </h4>
                            <div className="space-y-2">
                              {project.tasks?.length > 0 ? (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">
                                      Total Tasks
                                    </span>
                                    <span className="text-xs font-medium">
                                      {project.tasks.length}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">
                                      Completed
                                    </span>
                                    <span className="text-xs font-medium text-green-600">
                                      {
                                        project.tasks.filter(
                                          (t) => t.status === "completed"
                                        ).length
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">
                                      In Progress
                                    </span>
                                    <span className="text-xs font-medium text-blue-600">
                                      {
                                        project.tasks.filter(
                                          (t) => t.status === "in-progress"
                                        ).length
                                      }
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <p className="text-xs text-gray-500">
                                  No tasks yet
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <StatusTimeline status={project.status} />

                    <div className="grid grid-cols-2 gap-3">
                      <StatItem
                        label="Team Members"
                        value={project.team?.length || 0}
                        icon={<UsersIcon className="w-5 h-5" />}
                      />
                      <StatItem
                        label="Resources"
                        value={project.resources?.length || 0}
                        icon={<DocumentTextIcon className="w-5 h-5" />}
                      />
                      <StatItem
                        label="Open Tasks"
                        value={
                          project.tasks?.filter((t) => t.status !== "completed")
                            .length || 0
                        }
                        icon={<ClipboardIcon className="w-5 h-5" />}
                      />
                      <StatItem
                        label="Days Active"
                        value={Math.floor(daysActive)}
                        icon={<CalendarDaysIcon className="w-5 h-5" />}
                      />
                      <StatItem
                        label="High Priority Tasks"
                        value={
                          project.tasks?.filter((t) => t.priority === "high")
                            .length || 0
                        }
                        icon={
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                        }
                      />
                      <StatItem
                        label="Completion Rate"
                        value={`${completionPercentage}%`}
                        icon={
                          <ChartBarIcon className="w-5 h-5 text-blue-500" />
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <TeamMembers
                  team={project.team || []}
                  projectId={project._id}
                />
              )}

              {activeTab === "tasks" && (
                <KanbanBoard projectId={project._id} tasks={project.tasks} />
              )}

              {activeTab === "resources" && (
                <ResourcesSection initialResources={project.resources || []} />
              )}

              {activeTab === "chat" && <ProjectChat projectId={project._id} />}

              {activeTab === "calendar" && (
                <ProjectCalendar projectId={project._id} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
