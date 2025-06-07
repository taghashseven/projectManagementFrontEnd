import { useState } from 'react';
import TeamMembers from './TeamMembers';
import ResourcesSection from './ResourcesSection';
import ProjectChat from './ProjectChat';
import StatusTimeline from './StatusTimeline';

export default function ProjectDetail({ project, onUpdateProject }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'team', label: 'Team' },
    { id: 'resources', label: 'Resources' },
    { id: 'chat', label: 'Discussion' },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <div className="flex items-center mt-2">
              <span className={`text-xs px-3 py-1 rounded-full ${
                project.status === 'not-started' ? 'bg-gray-200 text-gray-800' :
                project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {project.status.replace('-', ' ')}
              </span>
              <span className="ml-3 text-sm text-gray-600">
                Started on {new Date(project.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Edit Project
          </button>
        </div>
      </div>

      <div className="border-b">
        <nav className="flex -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Project Overview</h2>
            <p className="text-gray-700 mb-6">{project.description}</p>
            <StatusTimeline status={project.status} />
          </div>
        )}


        {activeTab === 'team' && <TeamMembers team={project.team} />}
        {activeTab === 'resources' && <ResourcesSection resources={project.resources} />}
        {activeTab === 'chat' && <ProjectChat projectId={project.id} />}
        {activeTab === 'timeline' && <div>Timeline Content</div>}
      </div>
    </div>
  );
}