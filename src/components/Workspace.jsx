import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, ChevronDown } from 'lucide-react';
import DashboardNav from './DashboardNav';
import { pluginData } from '../data/pluginData';

const Workspace = () => {
  const [activeTab, setActiveTab] = useState('Plugins');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  // Map workspace IDs to company info
  const workspaceMap = {
    'fukuyama-consultant': {
      name: '株式会社福山コンサルタント',
      subtitle: 'Eukarya, Inc',
      avatar: '/Avatar/株式会社福山コンサルタント.png',
      badge: '株'
    },
    'weather-data': {
      name: '気象データ株式会社',
      subtitle: 'Weather Solutions Provider',
      avatar: '/Avatar/気象データ株式会社.png',
      badge: '気'
    },
    'sensor-tech': {
      name: 'センサー技術株式会社',
      subtitle: 'IoT Technology Solutions',
      avatar: '/Avatar/センサー技術株式会社.png',
      badge: 'セ'
    },
    'geovision-labs': {
      name: 'GeoVision Labs',
      subtitle: 'Geospatial Technology',
      avatar: '/Avatar/GeoVision Labs.png',
      badge: 'GV'
    },
    'mobili-solution': {
      name: 'モビリソリューション',
      subtitle: 'Smart Mobility Solutions',
      avatar: '/Avatar/モビリソリューション.png',
      badge: 'モ'
    },
    'enviro-tech': {
      name: '環境テクノロジー株式会社',
      subtitle: 'Environmental Technology',
      avatar: '/Avatar/環境テクノロジー株式会社.png',
      badge: '環'
    },
    'enviro-node': {
      name: 'EnviroNode',
      subtitle: 'Environmental Monitoring',
      avatar: '/Avatar/EnviroNode.png',
      badge: 'EN'
    },
    'chrono-maps': {
      name: 'ChronoMaps Studio',
      subtitle: 'Time-based Visualization',
      avatar: '/Avatar/ChronoMaps Studio.png',
      badge: 'CM'
    }
  };

  const currentWorkspace = workspaceMap[workspaceId] || workspaceMap['fukuyama-consultant'];
  
  // Get plugins for this specific workspace based on company name
  const workspacePlugins = pluginData.filter(plugin => plugin.company === currentWorkspace.name);

  const tabs = ['Overview', 'CMS Project', 'Visualizer Project', 'Plugins'];

  const handlePluginClick = (pluginId) => {
    navigate(`/plugin/${pluginId}`);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FCFAF4' }}>
      {/* Header */}
      <DashboardNav />

      {/* Workspace Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center space-x-4">
            {/* Workspace Avatar */}
            <img
              src={currentWorkspace.avatar}
              alt={currentWorkspace.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                // Fallback to gradient if image fails
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
              style={{ 
                display: 'none',
                background: 'linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%)'
              }}
            >
              {currentWorkspace.badge}
            </div>

            {/* Workspace Info */}
            <div>
              <h1 
                className="text-gray-900"
                style={{
                  fontFamily: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(currentWorkspace.name) ? '"Noto Sans JP", sans-serif' : 'Outfit',
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                {currentWorkspace.name}
              </h1>
              <p 
                className="text-gray-500"
                style={{
                  fontFamily: 'Outfit',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                {currentWorkspace.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Actions Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm transition-colors relative ${
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

            {/* Actions */}
            {activeTab === 'Plugins' && (
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, function and description"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    style={{
                      width: '320px',
                      fontFamily: 'Outfit',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Sort Dropdown */}
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <span style={{ fontFamily: 'Outfit', fontSize: '14px' }}>Sort by date uploaded</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* New Plugin Button */}
                <button 
                  onClick={() => navigate('/plugins/new')}
                  className="text-white hover:opacity-90 transition-opacity"
                  style={{ 
                    display: 'flex',
                    padding: '8px 16px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '6px',
                    background: '#00BFFF',
                    fontFamily: 'Outfit', 
                    fontSize: '14px', 
                    fontWeight: 500 
                  }}
                >
                  <Plus className="w-4 h-4" />
                  New Plugin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8">
        <div style={{
          display: 'flex',
          maxWidth: '1280px',
          padding: '0 24px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          alignSelf: 'stretch',
          width: '100%'
        }}>
          {activeTab === 'Plugins' && (
            <>
              {workspacePlugins.map((plugin) => (
                <div 
                  key={plugin.id}
                  className="rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePluginClick(plugin.id)}
                  style={{
                    display: 'flex',
                    width: '604px',
                    height: '244px',
                    paddingRight: '24px',
                    alignItems: 'center',
                    gap: '24px',
                    background: '#FFF'
                  }}
                >
                  {/* Plugin Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={plugin.image}
                      alt={plugin.title}
                      className="object-cover"
                      style={{ width: '192px', height: '244px' }}
                    />
                  </div>

                  {/* Plugin Content */}
                  <div className="flex-1 py-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 
                          className="text-blue-600 hover:text-blue-700 mb-2"
                          style={{
                            fontFamily: 'Outfit',
                            fontSize: '20px',
                            fontWeight: 600,
                            lineHeight: '140%'
                          }}
                        >
                          {plugin.title}
                        </h3>
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Public
                        </span>
                      </div>
                    </div>

                    <p 
                      className="text-gray-600 mt-3 mb-4"
                      style={{
                        fontFamily: 'Outfit',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '140%'
                      }}
                    >
                      {plugin.description.substring(0, 150)}...
                    </p>

                    <div className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
                      {plugin.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded bg-gray-100 mb-1"
                          style={{ fontFamily: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(tag) ? '"Noto Sans JP"' : 'Outfit' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'Overview' && (
            <div className="text-center py-12 text-gray-500">
              <p style={{ fontFamily: 'Outfit' }}>Workspace overview coming soon</p>
            </div>
          )}

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
        </div>
      </main>
    </div>
  );
};

export default Workspace;