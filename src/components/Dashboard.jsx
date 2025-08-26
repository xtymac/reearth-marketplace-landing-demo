import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Search, ExternalLink } from 'lucide-react';
import DashboardNav from './DashboardNav';
import { pluginData } from '../data/pluginData';
import '../DeveloperPortal.css';

const Dashboard = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('Default personal workspace');
  const [activeTab, setActiveTab] = useState('CMS Project');
  const [pluginSearch, setPluginSearch] = useState('');
  const [pluginSort, setPluginSort] = useState('Last updated');
  const navigate = useNavigate();

  const workspaceGroups = {
    personal: {
      label: 'Personal',
      options: [
        { name: 'Default personal workspace', badge: 'De', type: 'circle', workspaceId: null },
        { name: 'My playground', badge: 'My', type: 'circle', workspaceId: null }
      ]
    },
    team: {
      label: 'Team',
      options: [
        { name: '株式会社福山コンサルタント', badge: '株', type: 'square', workspaceId: 'fukuyama-consultant' },
        { name: '気象データ株式会社', badge: '気', type: 'square', workspaceId: 'weather-data' },
        { name: 'センサー技術株式会社', badge: 'セ', type: 'square', workspaceId: 'sensor-tech' },
        { name: 'GeoVision Labs', badge: 'GV', type: 'square', workspaceId: 'geovision-labs' },
        { name: 'モビリソリューション', badge: 'モ', type: 'square', workspaceId: 'mobili-solution' },
        { name: '環境テクノロジー株式会社', badge: '環', type: 'square', workspaceId: 'enviro-tech' },
        { name: 'EnviroNode', badge: 'EN', type: 'square', workspaceId: 'enviro-node' },
        { name: 'ChronoMaps Studio', badge: 'CM', type: 'square', workspaceId: 'chrono-maps' }
      ]
    }
  };

  const tabs = ['CMS Project', 'Visualizer Project', 'Plugins'];

  // Helper function to convert date to relative time (matching Developer Portal)
  function getTimeAgo(dateStr) {
    const date = new Date(dateStr.replace(/\//g, '-'));
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 30) return `${diffInDays}d ago`;
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${Math.floor(diffInMonths / 12)}y ago`;
  }

  // Company to workspace mapping (for navigation)
  const companyToWorkspace = {
    '株式会社福山コンサルタント': 'fukuyama-consultant',
    '気象データ株式会社': 'weather-data',
    'センサー技術株式会社': 'sensor-tech',
    'GeoVision Labs': 'geovision-labs',
    'モビリソリューション': 'mobili-solution',
    '環境テクノロジー株式会社': 'enviro-tech',
    'EnviroNode': 'enviro-node',
    'ChronoMaps Studio': 'chrono-maps'
  };

  // Transform plugin data for dashboard display
  const pluginsList = pluginData.map(plugin => ({
    id: plugin.id,
    workspace: plugin.company,
    title: plugin.title,
    lastEdit: getTimeAgo(plugin.updatedDate),
    status: 'Public',
    platform: 'Visualizer'
  }));


  // Filter and sort plugins
  const filteredAndSortedPlugins = pluginsList
    .filter(plugin => 
      plugin.title.toLowerCase().includes(pluginSearch.toLowerCase()) ||
      plugin.workspace.toLowerCase().includes(pluginSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (pluginSort === 'Name') {
        return a.title.localeCompare(b.title);
      } else {
        // Sort by lastEdit (newest first)
        return b.lastEdit.localeCompare(a.lastEdit);
      }
    });


  const handlePluginClick = (pluginId) => {
    window.open(`/plugin/${pluginId}`, '_blank');
  };


  const handleWorkspaceClick = (companyName) => {
    const workspaceId = companyToWorkspace[companyName];
    if (workspaceId) {
      navigate(`/workspace/${workspaceId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FCFAF4' }}>
      {/* Header */}
      <DashboardNav />

      {/* Main Content Wrapper */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="flex-shrink-0" style={{
          display: 'flex',
          width: '320px',
          padding: '24px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '32px',
          background: '#FCFAF4',
          boxShadow: '2px 2px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ width: '100%' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 
                style={{
                  width: '90px',
                  height: '18px',
                  overflow: 'hidden',
                  color: '#404040',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Outfit',
                  fontSize: '12.8px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                Your workspace
              </h2>
              <button 
                className="hover:text-blue-700"
                style={{ 
                  color: '#00A2EA',
                  fontFamily: 'Outfit',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                New Workspace
              </button>
            </div>

            {/* Workspace Groups */}
            <div className="space-y-6">
              {Object.entries(workspaceGroups).map(([groupKey, group]) => (
                <div key={groupKey}>
                  {/* Group Header */}
                  <h3 
                    className="mb-3"
                    style={{
                      width: '90px',
                      height: '18px',
                      overflow: 'hidden',
                      color: '#404040',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: 'Outfit',
                      fontSize: '12.8px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '140%'
                    }}
                  >
                    {group.label}
                  </h3>
                  
                  {/* Group Items */}
                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(option.name);
                      const isSelected = selectedWorkspace === option.name;
                      
                      return (
                        <button
                          key={option.name}
                          onClick={() => {
                            setSelectedWorkspace(option.name);
                            if (option.workspaceId) {
                              navigate(`/workspace/${option.workspaceId}`);
                            }
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {/* Badge */}
                          <div 
                            className={`flex items-center justify-center text-white text-xs font-medium ${
                              option.type === 'circle' 
                                ? 'w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500' 
                                : 'w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600'
                            }`}
                          >
                            {option.badge}
                          </div>
                          
                          {/* Name */}
                          <span 
                            className="flex-1 truncate"
                            style={{
                              color: '#0A0A0A',
                              fontFamily: isJapanese ? '"Noto Sans JP"' : 'Outfit',
                              fontSize: '14px',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              lineHeight: '140%'
                            }}
                          >
                            {option.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Center Content */}
            <div className="flex-1">
              <div className="">
                {/* Header */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 
                      className="text-gray-900"
                      style={{
                        fontFamily: 'Outfit',
                        fontSize: '24px',
                        fontWeight: 600,
                        lineHeight: '140%'
                      }}
                    >
                      Recently Edited
                    </h2>
                    <button 
                      onClick={() => {
                        // Placeholder for New Project - no functionality yet
                        console.log('New Project functionality not implemented yet');
                      }}
                      className="text-white hover:opacity-90 transition-opacity"
                      style={{ 
                        display: 'flex',
                        padding: '12px 20px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '6px',
                        background: '#00A2EA',
                        fontFamily: 'Outfit', 
                        fontSize: '14px', 
                        fontWeight: 500 
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      New Project
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-6 pb-0">
                  <div className="flex space-x-8">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 text-sm transition-colors relative ${
                          activeTab === tab 
                            ? 'text-blue-600 font-semibold' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        style={{ fontFamily: 'Outfit' }}
                      >
                        {tab}
                        {activeTab === tab && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  {activeTab === 'CMS Project' && (
                    <div className="text-center py-12 text-gray-500">
                      <p style={{ fontFamily: 'Outfit' }}>No CMS projects found</p>
                    </div>
                  )}
                  
                  {activeTab === 'Visualizer Project' && (
                    <div className="text-center py-12 text-gray-500">
                      <p style={{ fontFamily: 'Outfit' }}>No Visualizer projects found</p>
                    </div>
                  )}

                  {activeTab === 'Plugins' && (
                    <div>
                      {/* Search and Sort Controls */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search plugins..."
                              value={pluginSearch}
                              onChange={(e) => setPluginSearch(e.target.value)}
                              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                              style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                            />
                          </div>
                          <select
                            value={pluginSort}
                            onChange={(e) => setPluginSort(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                          >
                            <option value="Last updated">Sort by Last updated</option>
                            <option value="Name">Sort by Name</option>
                          </select>
                        </div>
                      </div>

                      {/* Table Headers - No background */}
                      <div className="hidden md:grid md:grid-cols-[2fr_120px_60px] gap-6 px-4 py-2 mb-3">
                        <span 
                          className="text-gray-500 text-sm"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Plugin name
                        </span>
                        <span 
                          className="text-gray-500 text-sm"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Last edit
                        </span>
                        <span 
                          className="text-gray-500 text-sm text-right"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Action
                        </span>
                      </div>

                      {filteredAndSortedPlugins.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <p style={{ fontFamily: 'Outfit' }}>
                            {pluginSearch ? 'No plugins found matching your search.' : 'No plugins available.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredAndSortedPlugins.map((plugin) => {
                            const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(plugin.workspace);

                            return (
                              <div
                                key={plugin.id}
                                className="flex flex-col md:grid md:grid-cols-[2fr_120px_60px] gap-3 md:gap-6 p-4 bg-white hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group shadow-sm"
                                aria-label={`Workspace ${plugin.workspace}, Plugin ${plugin.title}, Platform ${plugin.platform}`}
                                onClick={() => handlePluginClick(plugin.id)}
                              >
                                {/* Column 1: Title with Pills */}
                                <div className="flex flex-wrap items-center gap-2 md:gap-3 min-w-0">
                                  <h3 
                                    className="text-blue-600 font-medium group-hover:text-blue-700 flex-shrink-0"
                                    style={{
                                      fontFamily: 'Outfit',
                                      fontSize: '16px',
                                      lineHeight: '140%'
                                    }}
                                    title={`${plugin.workspace} / ${plugin.title}`}
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleWorkspaceClick(plugin.workspace);
                                      }}
                                      className="hover:text-blue-800 transition-colors"
                                      style={{ fontFamily: isJapanese ? '"Noto Sans JP"' : 'Outfit' }}
                                    >
                                      {plugin.workspace}
                                    </button>
                                    <span className="mx-2">/</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePluginClick(plugin.id);
                                      }}
                                      className="hover:text-blue-800 transition-colors"
                                    >
                                      {plugin.title}
                                    </button>
                                  </h3>
                                  <span 
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0"
                                    style={{ fontFamily: 'Outfit' }}
                                  >
                                    {plugin.platform}
                                  </span>
                                  <span 
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0"
                                    style={{ fontFamily: 'Outfit' }}
                                  >
                                    {plugin.status}
                                  </span>
                                </div>

                                {/* Column 2: Last Edit Value */}
                                <div className="flex items-center md:justify-start">
                                  <span className="text-gray-500 text-sm mr-2 md:hidden" style={{ fontFamily: 'Outfit' }}>
                                    Last edit:
                                  </span>
                                  <span 
                                    className="text-gray-900 text-sm font-medium"
                                    style={{ fontFamily: 'Outfit' }}
                                  >
                                    {plugin.lastEdit}
                                  </span>
                                </div>

                                {/* Column 3: Action Button */}
                                <div className="flex items-center md:justify-end">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePluginClick(plugin.id);
                                    }}
                                    className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    title="View plugin"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-64 flex-shrink-0 space-y-6">
              {/* Welcome Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 
                  className="text-gray-900 mb-4 flex items-center"
                  style={{
                    fontFamily: 'Outfit',
                    fontSize: '18px',
                    fontWeight: 600,
                    lineHeight: '140%'
                  }}
                >
                  Welcome 👋
                </h3>
                <div className="space-y-3 text-sm text-gray-600" style={{ fontFamily: 'Outfit' }}>
                  <p>Welcome to Re:Earth! We invite you to join our user community.</p>
                  <p>If you have any questions, please don't hesitate to ask on <a href="https://discord.com/invite/reearth" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Discord</a>. There's a lot of valuable content and conversation to explore!</p>
                  <p>Searching for open data with compelling topics? Looking for inspiration for your project? Visit the <a href="https://reearth.io/topics" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Topics</a> page and explore curated datasets and ideas!</p>
                </div>
              </div>

              {/* Shortcuts */}
              <div className="space-y-3">
                <button 
                  className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group"
                  onClick={() => window.open('https://reearth.io/visualizer', '_blank')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                    </div>
                    <span 
                      className="font-medium text-gray-900"
                      style={{ fontFamily: 'Outfit', fontSize: '16px' }}
                    >
                      Visualizer Editor
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>

                <button 
                  className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group"
                  onClick={() => window.open('https://reearth.io/cms', '_blank')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded" />
                    </div>
                    <span 
                      className="font-medium text-gray-900"
                      style={{ fontFamily: 'Outfit', fontSize: '16px' }}
                    >
                      CMS Editor
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>

                <button 
                  className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group"
                  onClick={() => navigate('/developer-portal')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-500 rounded" />
                    </div>
                    <span 
                      className="font-medium text-gray-900"
                      style={{ fontFamily: 'Outfit', fontSize: '16px' }}
                    >
                      Developer Portal
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <span>© 2024 Re:Earth contributors</span>
            <a href="https://reearth.io/terms" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Terms</a>
            <a href="https://reearth.io/privacy" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Privacy</a>
            <a href="https://reearth.io/cookies" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Cookies</a>
            <a href="https://reearth.io/cookie-settings" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Cookie Settings</a>
            <a href="https://reearth.io/contact" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;