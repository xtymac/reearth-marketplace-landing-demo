import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown, Package, Play, Pause, Eye, Download, Trash2 } from 'lucide-react';
import DashboardNav from './DashboardNav';
import { pluginData } from '../data/pluginData';
import { authService } from '../services/authService';

// Sample project data - in a real app, this would come from API
const projectsData = [
  {
    id: 'cms-project-1',
    name: 'Urban Planning Dashboard',
    type: 'CMS Project',
    workspaceId: 'fukuyama-consultant'
  },
  {
    id: 'visualizer-project-1', 
    name: 'City Infrastructure 3D',
    type: 'Visualizer Project',
    workspaceId: 'fukuyama-consultant'
  },
  {
    id: 'weather-project-1',
    name: 'Climate Monitoring System',
    type: 'CMS Project',
    workspaceId: 'weather-data'
  },
  {
    id: 'sensor-project-1',
    name: 'IoT Sensor Network',
    type: 'Visualizer Project',
    workspaceId: 'sensor-tech'
  },
  {
    id: 'gis-project-1',
    name: 'Advanced GIS Analysis',
    type: 'CMS Project',
    workspaceId: 'geovision-labs'
  },
  {
    id: 'mobility-project-1',
    name: 'Smart Transportation Hub',
    type: 'Visualizer Project',
    workspaceId: 'mobili-solution'
  },
  {
    id: 'energy-project-1',
    name: 'Green Energy Monitoring',
    type: 'CMS Project',
    workspaceId: 'enviro-tech'
  },
  {
    id: 'landuse-project-1',
    name: 'Land Use Classification',
    type: 'Visualizer Project',
    workspaceId: 'enviro-node'
  }
];

// Plugin status mapping
const generatePluginInstallations = (workspaceId) => {
  const workspacePlugins = pluginData.filter(plugin => {
    const workspaceMapping = {
      'fukuyama-consultant': '株式会社福山コンサルタント',
      'weather-data': '気象データ株式会社',
      'sensor-tech': 'センサー技術株式会社',
      'geovision-labs': 'GeoVision Labs',
      'mobili-solution': 'モビリソリューション',
      'enviro-tech': '環境テクノロジー株式会社',
      'enviro-node': 'EnviroNode',
      'chrono-maps': 'ChronoMaps Studio'
    };
    return plugin.company === workspaceMapping[workspaceId];
  });

  const workspaceProjects = projectsData.filter(project => project.workspaceId === workspaceId);
  
  return workspacePlugins.map((plugin, index) => ({
    id: `install-${plugin.id}`,
    pluginId: plugin.id,
    pluginName: plugin.title,
    shortDescription: plugin.description,
    version: plugin.version,
    status: index % 3 === 0 ? 'inactive' : 'active',
    projectId: workspaceProjects[index % workspaceProjects.length]?.id || workspaceProjects[0]?.id,
    projectName: workspaceProjects[index % workspaceProjects.length]?.name || workspaceProjects[0]?.name,
    installedDate: plugin.updatedDate,
    lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
};

const PluginCard = ({ plugin, onView, onUpdate, onToggleStatus, onUninstall }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action, pluginId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      switch (action) {
        case 'view':
          onView(pluginId);
          break;
        case 'update':
          onUpdate(pluginId);
          break;
        case 'toggle':
          onToggleStatus(pluginId);
          break;
        case 'uninstall':
          onUninstall(pluginId);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error ${action}ing plugin:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 
                className="font-semibold text-gray-900"
                style={{
                  fontFamily: 'Outfit',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                {plugin.pluginName}
              </h3>
              <div className="flex items-center space-x-2">
                <span 
                  className="text-gray-500"
                  style={{
                    fontFamily: 'Outfit',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '140%'
                  }}
                >
                  v{plugin.version}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  plugin.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {plugin.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          
          <p 
            className="text-gray-600 mb-4"
            style={{
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '140%'
            }}
          >
            {plugin.shortDescription}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>Last used: {plugin.lastUsed}</span>
            <span>Installed: {plugin.installedDate}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => handleAction('view', plugin.pluginId)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleAction('update', plugin.pluginId)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Update plugin"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleAction('toggle', plugin.id)}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-colors ${
              plugin.status === 'active'
                ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'
                : 'text-green-500 hover:text-green-600 hover:bg-green-50'
            }`}
            title={plugin.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {plugin.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => handleAction('uninstall', plugin.id)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Uninstall plugin"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectSection = ({ project, plugins, onView, onUpdate, onToggleStatus, onUninstall }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-8">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${!isExpanded ? '-rotate-90' : ''}`} />
          <h2 
            className="text-gray-900 font-semibold"
            style={{
              fontFamily: 'Outfit',
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '140%'
            }}
          >
            {project.name}
          </h2>
          <span className="text-sm text-gray-500">({project.type})</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {plugins.length} plugin{plugins.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-4">
          {plugins.length > 0 ? (
            plugins.map(plugin => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                onView={onView}
                onUpdate={onUpdate}
                onToggleStatus={onToggleStatus}
                onUninstall={onUninstall}
              />
            ))
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No plugins installed in this project.</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Browse Marketplace
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PluginFilters = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, projectFilter, setProjectFilter, projects }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const ManagePlugins = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [pluginInstallations, setPluginInstallations] = useState([]);

  // Workspace mapping
  const workspaceMapping = {
    'fukuyama-consultant': '株式会社福山コンサルタント',
    'weather-data': '気象データ株式会社',
    'sensor-tech': 'センサー技術株式会社',
    'geovision-labs': 'GeoVision Labs',
    'mobili-solution': 'モビリソリューション',
    'enviro-tech': '環境テクノロジー株式会社',
    'enviro-node': 'EnviroNode',
    'chrono-maps': 'ChronoMaps Studio'
  };

  const currentWorkspace = workspaceMapping[workspaceId];
  const workspaceProjects = projectsData.filter(project => project.workspaceId === workspaceId);

  useEffect(() => {
    const loadPlugins = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const installations = generatePluginInstallations(workspaceId);
        setPluginInstallations(installations);
      } catch (err) {
        setError('Failed to load plugins');
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId && authService.isAuthenticated()) {
      loadPlugins();
    }
  }, [workspaceId]);

  // Filter plugins
  const filteredPlugins = pluginInstallations.filter(plugin => {
    const matchesSearch = plugin.pluginName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plugin.status === statusFilter;
    const matchesProject = projectFilter === 'all' || plugin.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  // Group plugins by project
  const pluginsByProject = workspaceProjects.reduce((acc, project) => {
    const projectPlugins = filteredPlugins.filter(plugin => plugin.projectId === project.id);
    acc[project.id] = {
      project,
      plugins: projectPlugins
    };
    return acc;
  }, {});

  // Plugin action handlers
  const handleViewPlugin = (pluginId) => {
    navigate(`/plugin/${pluginId}`);
  };

  const handleUpdatePlugin = (pluginId) => {
    console.log('Update plugin:', pluginId);
    // TODO: Implement plugin update logic
  };

  const handleToggleStatus = (installationId) => {
    setPluginInstallations(prev => 
      prev.map(plugin => 
        plugin.id === installationId 
          ? { ...plugin, status: plugin.status === 'active' ? 'inactive' : 'active' }
          : plugin
      )
    );
  };

  const handleUninstallPlugin = (installationId) => {
    if (window.confirm('Are you sure you want to uninstall this plugin?')) {
      setPluginInstallations(prev => prev.filter(plugin => plugin.id !== installationId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
        <DashboardNav />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="h-10 bg-gray-300 rounded mb-4"></div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-4">
                    {[1, 2].map(j => (
                      <div key={j} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
        <DashboardNav />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
      <DashboardNav />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-2">
            <span>{currentWorkspace}</span> / <span className="text-gray-900 font-medium">Manage Plugins</span>
          </nav>
          <h1 
            className="text-gray-900"
            style={{
              fontFamily: 'Outfit',
              fontSize: '32px',
              fontWeight: 600,
              lineHeight: '140%'
            }}
          >
            Manage Plugins
          </h1>
          <p 
            className="text-gray-600 mt-2"
            style={{
              fontFamily: 'Outfit',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '140%'
            }}
          >
            Manage plugins installed across your workspace projects
          </p>
        </div>

        {/* Filters */}
        <PluginFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          projects={workspaceProjects}
        />

        {/* Content */}
        {workspaceProjects.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects in this workspace yet.</h3>
            <p className="text-gray-600 mb-6">Create a project to start installing plugins.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Create Project
            </button>
          </div>
        ) : (
          <div>
            {Object.values(pluginsByProject).map(({ project, plugins }) => (
              <ProjectSection
                key={project.id}
                project={project}
                plugins={plugins}
                onView={handleViewPlugin}
                onUpdate={handleUpdatePlugin}
                onToggleStatus={handleToggleStatus}
                onUninstall={handleUninstallPlugin}
              />
            ))}
            
            {filteredPlugins.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No plugins found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== 'all' || projectFilter !== 'all' 
                    ? 'Try adjusting your filters to see more results.' 
                    : 'No plugins have been installed in this workspace yet.'}
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePlugins;