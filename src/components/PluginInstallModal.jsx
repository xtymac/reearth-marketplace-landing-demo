import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import { PluginService } from '../services/pluginService';

const PluginInstallModal = ({ isOpen, onClose, plugin, onInstall }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [refreshProjects, setRefreshProjects] = useState(0);

  // Mock workspace data based on the existing workspace structure
  const workspaces = [
    {
      id: 'fukuyama-consultant',
      name: '株式会社福山コンサルタント',
      avatar: '/Avatar/株式会社福山コンサルタント.png',
      badge: '株'
    },
    {
      id: 'weather-data', 
      name: '気象データ株式会社',
      avatar: '/Avatar/気象データ株式会社.png',
      badge: '気'
    },
    {
      id: 'sensor-tech',
      name: 'センサー技術株式会社', 
      avatar: '/Avatar/センサー技術株式会社.png',
      badge: 'セ'
    },
    {
      id: 'geovision-labs',
      name: 'GeoVision Labs',
      avatar: '/Avatar/GeoVision Labs.png', 
      badge: 'GV'
    },
    {
      id: 'mobili-solution',
      name: 'モビリソリューション',
      avatar: '/Avatar/モビリソリューション.png',
      badge: 'モ'
    }
  ];

  // Base project data for each workspace
  const baseProjectsByWorkspace = {
    'fukuyama-consultant': [
      { id: 'project-1', name: 'Urban Planning Dashboard', type: 'Visualizer' },
      { id: 'project-2', name: 'Infrastructure Analysis', type: 'CMS' },
      { id: 'project-3', name: 'Disaster Response Mapping', type: 'Visualizer' }
    ],
    'weather-data': [
      { id: 'project-4', name: 'Weather Monitoring System', type: 'Visualizer' },
      { id: 'project-5', name: 'Climate Data Portal', type: 'CMS' },
      { id: 'project-6', name: 'Forecast Visualization', type: 'Visualizer' }
    ],
    'sensor-tech': [
      { id: 'project-7', name: 'IoT Network Dashboard', type: 'Visualizer' },
      { id: 'project-8', name: 'Sensor Data Management', type: 'CMS' }
    ],
    'geovision-labs': [
      { id: 'project-9', name: 'Geospatial Analysis Tool', type: 'Visualizer' },
      { id: 'project-10', name: 'Mapping Data Hub', type: 'CMS' },
      { id: 'project-11', name: 'GIS Visualization Platform', type: 'Visualizer' }
    ],
    'mobili-solution': [
      { id: 'project-12', name: 'Smart City Dashboard', type: 'Visualizer' },
      { id: 'project-13', name: 'Transport Data Analysis', type: 'CMS' }
    ]
  };

  // Get projects with real installation status (refreshProjects forces re-evaluation)
  const currentProjects = useMemo(() => {
    return selectedWorkspace && plugin ? 
      (baseProjectsByWorkspace[selectedWorkspace] || []).map(project => ({
        ...project,
        hasPlugin: PluginService.isPluginInstalled(plugin.id, selectedWorkspace, project.id)
      })) : [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace, plugin, refreshProjects, baseProjectsByWorkspace]);
  
  const selectedProjectData = currentProjects.find(p => p.id === selectedProject);

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedWorkspace('');
      setSelectedProject('');
      setWorkspaceDropdownOpen(false);
      setProjectDropdownOpen(false);
      setIsInstalling(false);
    }
  }, [isOpen]);

  // Reset project selection when workspace changes
  useEffect(() => {
    setSelectedProject('');
    setProjectDropdownOpen(false);
  }, [selectedWorkspace]);

  const handleInstall = async () => {
    if (!selectedWorkspace || !selectedProject || selectedProjectData?.hasPlugin) {
      return;
    }

    setIsInstalling(true);
    
    // Simulate installation process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onInstall(selectedWorkspace, selectedProject);
      setRefreshProjects(prev => prev + 1); // Force refresh of project status
      onClose();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const isInstallDisabled = !selectedWorkspace || !selectedProject || selectedProjectData?.hasPlugin || isInstalling;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: 'Outfit' }}
          >
            Install Plugin
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plugin Info */}
          <div className="flex items-center space-x-3">
            <img
              src={plugin?.image}
              alt={plugin?.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <h3 
                className="font-medium text-gray-900"
                style={{ fontFamily: 'Outfit' }}
              >
                {plugin?.title}
              </h3>
              <p 
                className="text-sm text-gray-500"
                style={{ fontFamily: 'Outfit' }}
              >
                by {plugin?.company}
              </p>
            </div>
          </div>

          {/* Workspace Selection */}
          <div>
            <label 
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: 'Outfit' }}
            >
              Select Workspace
            </label>
            <div className="relative">
              <button
                onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left hover:border-gray-400 focus:outline-none focus:border-blue-500"
              >
                {selectedWorkspace ? (
                  <div className="flex items-center space-x-2">
                    <img
                      src={workspaces.find(w => w.id === selectedWorkspace)?.avatar}
                      alt=""
                      className="w-6 h-6 rounded object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ 
                        display: 'none',
                        background: 'linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%)'
                      }}
                    >
                      {workspaces.find(w => w.id === selectedWorkspace)?.badge}
                    </div>
                    <span 
                      style={{ 
                        fontFamily: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(workspaces.find(w => w.id === selectedWorkspace)?.name) ? '"Noto Sans JP"' : 'Outfit',
                        fontSize: '14px'
                      }}
                    >
                      {workspaces.find(w => w.id === selectedWorkspace)?.name}
                    </span>
                  </div>
                ) : (
                  <span 
                    className="text-gray-500"
                    style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                  >
                    Choose workspace...
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {workspaceDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => {
                        setSelectedWorkspace(workspace.id);
                        setWorkspaceDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <img
                        src={workspace.avatar}
                        alt=""
                        className="w-6 h-6 rounded object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ 
                          display: 'none',
                          background: 'linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%)'
                        }}
                      >
                        {workspace.badge}
                      </div>
                      <span 
                        style={{ 
                          fontFamily: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(workspace.name) ? '"Noto Sans JP"' : 'Outfit',
                          fontSize: '14px'
                        }}
                      >
                        {workspace.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Selection */}
          <div>
            <label 
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: 'Outfit' }}
            >
              Select Project
            </label>
            <div className="relative">
              <button
                onClick={() => selectedWorkspace && setProjectDropdownOpen(!projectDropdownOpen)}
                disabled={!selectedWorkspace}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded-md text-left focus:outline-none ${
                  selectedWorkspace 
                    ? 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedProject ? (
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span 
                        className="text-gray-900"
                        style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                      >
                        {selectedProjectData?.name}
                      </span>
                      <span 
                        className="ml-2 text-xs text-gray-500"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        ({selectedProjectData?.type})
                      </span>
                    </div>
                    {selectedProjectData?.hasPlugin && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Check className="w-4 h-4" />
                        <span 
                          className="text-xs"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Already Installed
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span 
                    className="text-gray-500"
                    style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                  >
                    {selectedWorkspace ? 'Choose project...' : 'Select workspace first'}
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {projectDropdownOpen && currentProjects.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {currentProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setSelectedProject(project.id);
                        setProjectDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <div>
                        <span 
                          className="text-gray-900"
                          style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                        >
                          {project.name}
                        </span>
                        <span 
                          className="ml-2 text-xs text-gray-500"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          ({project.type})
                        </span>
                      </div>
                      {project.hasPlugin && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span 
                            className="text-xs"
                            style={{ fontFamily: 'Outfit' }}
                          >
                            Installed
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Installation Status Message */}
          {selectedProjectData?.hasPlugin && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-md border border-green-200">
              <Check className="w-5 h-5 text-green-600" />
              <span 
                className="text-sm text-green-800"
                style={{ fontFamily: 'Outfit' }}
              >
                This plugin is already installed in the selected project.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ fontFamily: 'Outfit' }}
          >
            Cancel
          </button>
          <button
            onClick={handleInstall}
            disabled={isInstallDisabled}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isInstallDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            style={{ fontFamily: 'Outfit' }}
          >
            {isInstalling ? 'Installing...' : 'Install Plugin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PluginInstallModal;