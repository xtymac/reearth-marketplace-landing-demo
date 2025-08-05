import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut, Settings, LayoutDashboard, ExternalLink, ChevronRight, Plus } from 'lucide-react';
import { authService } from '../services/authService';

const Dashboard = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('Default personal workspace');
  const [activeTab, setActiveTab] = useState('Plugins');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userDropdownRef = useRef(null);
  const isAuthenticated = authService.isAuthenticated();
  const userData = authService.getUserData();

  const workspaceGroups = {
    personal: {
      label: 'Personal',
      options: [
        { name: 'Default personal workspace', badge: 'De', type: 'circle' },
        { name: 'My playground', badge: 'My', type: 'circle' }
      ]
    },
    team: {
      label: 'Team',
      options: [
        { name: 'UC-12地区防災計画', badge: 'UC', type: 'square' },
        { name: '株式会社福山コンサルタント', badge: '株', type: 'square' },
        { name: 'Plugin Team', badge: 'PT', type: 'square' }
      ]
    }
  };

  const tabs = ['CMS Project', 'Visualizer Project', 'Plugins'];

  const pluginsList = [
    {
      id: 1,
      workspace: '株式会社福山コンサルタント',
      title: '3D Building Visualization',
      lastEdit: '3 month ago',
      status: 'Public',
      platform: 'Visualizer'
    }
  ];

  // Close user dropdown when clicking outside or on escape/tab
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (userDropdownOpen && (event.key === 'Escape' || event.key === 'Tab')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen]);

  const handleLogout = () => {
    authService.logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleDashboard = () => {
    setUserDropdownOpen(false);
    navigate('/dashboard');
  };

  const handleSettings = () => {
    setUserDropdownOpen(false);
    navigate('/settings');
  };

  const handlePluginClick = (pluginId) => {
    navigate(`/plugin/${pluginId}`);
  };

  const getBadgeInitials = (name) => {
    if (name === 'Default personal workspace') return 'De';
    if (name === 'My playground') return 'My';
    if (name === 'UC-12地区防災計画') return 'UC';
    if (name === '株式会社福山コンサルタント') return '株';
    if (name === 'Plugin Team') return 'PT';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFAF4' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <a href="https://reearth.io/home" className="flex items-center space-x-3">
                  <img
                    src="/Logo.png"
                    alt="Re:Earth Logo"
                    className="h-8"
                  />
                </a>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="https://reearth.io/about" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>About Re:Earth</a>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>
                    Product <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <a href="https://reearth.io/product/cms" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>CMS</a>
                      <a href="https://reearth.io/product/visualizer" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Visualizer</a>
                    </div>
                  </div>
                </div>
                <a href="https://reearth.io/pricing" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Pricing</a>
                <a href="https://reearth.io/community" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Community</a>
                <a href="https://reearth.io/learn" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Learn</a>
                <a href="/" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Marketplace</a>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                // User avatar dropdown when logged in
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-expanded={userDropdownOpen}
                    aria-haspopup="menu"
                    aria-label="User menu"
                  >
                    <img 
                      src="/Image/Avatar.png" 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient avatar if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </button>
                  
                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 bg-white z-50"
                      role="menu"
                      style={{
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        padding: '8px 6px',
                        minWidth: '180px',
                        width: 'fit-content'
                      }}
                    >
                      {/* Header Section */}
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <div 
                          className="font-medium"
                          style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '14px',
                            lineHeight: '140%',
                            fontWeight: 500,
                            color: 'var(--text-default, #0A0A0A)'
                          }}
                        >
                          {authService.getDisplayName(userData)}
                        </div>
                        {userData?.email && (
                          <div 
                            className="text-gray-500"
                            style={{
                              fontFamily: 'Outfit, sans-serif',
                              fontSize: '12px',
                              lineHeight: '140%',
                              fontWeight: 400,
                              marginTop: '2px'
                            }}
                          >
                            {userData.email}
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <button
                        onClick={handleDashboard}
                        role="menuitem"
                        className="flex items-center w-full text-left transition-colors hover:bg-gray-50"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          fontWeight: 400,
                          color: 'var(--text-default, #0A0A0A)',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleSettings}
                        role="menuitem"
                        className="flex items-center w-full text-left transition-colors hover:bg-gray-50"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          fontWeight: 400,
                          color: 'var(--text-default, #0A0A0A)',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Setting
                      </button>
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex items-center w-full text-left transition-colors hover:bg-gray-50"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          fontWeight: 400,
                          color: 'var(--text-default, #0A0A0A)',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Original content when not logged in
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-900 font-medium" style={{ fontFamily: '"Noto Sans JP"' }}>日本語</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600" style={{ fontFamily: 'Outfit' }}>Sign up</span>
                  </div>
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
                    style={{ backgroundColor: '#0089D4', fontFamily: 'Outfit' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
                    aria-label="Start plugin submission"
                  >
                    Start
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-gray-900"
                  style={{
                    fontFamily: 'Outfit',
                    fontSize: '18px',
                    fontWeight: 600,
                    lineHeight: '140%'
                  }}
                >
                  Your workspace
                </h2>
                <button 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  style={{ fontFamily: 'Outfit' }}
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
                      className="text-gray-500 mb-3"
                      style={{
                        fontFamily: 'Outfit',
                        fontSize: '14px',
                        fontWeight: 500,
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
                            onClick={() => setSelectedWorkspace(option.name)}
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
                                fontFamily: isJapanese ? '"Noto Sans JP"' : 'Outfit',
                                fontSize: '14px',
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

          {/* Center Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
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
                    onClick={() => navigate('/plugins/new')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    style={{ fontFamily: 'Outfit', fontSize: '14px', fontWeight: 500 }}
                  >
                    <Plus className="w-4 h-4" />
                    New Project
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 py-4 border-b border-gray-200">
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
              <div className="p-6">
                {activeTab === 'Plugins' && (
                  <div>
                    {/* Table Headers */}
                    <div className="hidden md:grid md:grid-cols-[2fr_120px_60px] gap-6 px-4 py-2 mb-3">
                      <div></div> {/* Empty for title column */}
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

                    {/* Plugin Rows */}
                    <div className="space-y-3">
                      {pluginsList.map((plugin) => (
                        <div
                          key={plugin.id}
                          onClick={() => handlePluginClick(plugin.id)}
                          className="flex flex-col md:grid md:grid-cols-[2fr_120px_60px] gap-3 md:gap-6 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
                          aria-label={`Workspace ${plugin.workspace}, Plugin ${plugin.title}, Platform ${plugin.platform}`}
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
                              <span style={{ fontFamily: '"Noto Sans JP"' }}>{plugin.workspace}</span>
                              <span className="mx-2">/</span>
                              {plugin.title}
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

                          {/* Column 3: Action Icon */}
                          <div className="flex items-center justify-between md:justify-end">
                            <span className="text-gray-500 text-sm md:hidden" style={{ fontFamily: 'Outfit' }}>
                              Action:
                            </span>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                          </div>
                        </div>
                      ))}
                    </div>
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
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6">
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
                <p>If you have any questions, please don't hesitate to ask on <a href="#" className="text-blue-600 hover:underline">Discord</a>. There's a lot of valuable content and conversation to explore!</p>
                <p>Searching for open data with compelling topics? Looking for inspiration for your project? Visit the <a href="#" className="text-blue-600 hover:underline">Topics</a> page and explore curated datasets and ideas!</p>
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
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200" style={{ marginTop: '24px' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <span>© 2024 Re:Earth contributors</span>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Cookies</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Cookie Settings</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;