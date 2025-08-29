import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, X, SearchX, User, LogOut, Settings, LayoutDashboard, Building2, Package, Heart } from 'lucide-react';
import PluginCard from './PluginCard';
import { pluginData } from '../data/pluginData';
import { authService } from '../services/authService';

const Marketplace = () => {
  const [sortBy, setSortBy] = useState('date uploaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('My Workspace');
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const userData = authService.getUserData();
  const userDropdownRef = useRef(null);
  const workspaceDropdownRef = useRef(null);

  // Workspace data from Dashboard/Workspace components
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


  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate('/developer-portal/new');
    } else {
      navigate('/login');
    }
  };

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

  const handleDeveloperPortal = () => {
    setUserDropdownOpen(false);
    navigate('/developer-portal');
  };

  const handleManagePlugins = () => {
    setUserDropdownOpen(false);
    const defaultWorkspaceId = 'fukuyama-consultant';
    navigate(`/workspace/${defaultWorkspaceId}/plugins`);
  };

  const handleLikedPlugins = () => {
    setUserDropdownOpen(false);
    navigate('/liked-plugins');
  };

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace.name);
    setWorkspaceDropdownOpen(false);
    if (workspace.workspaceId) {
      navigate(`/workspace/${workspace.workspaceId}`);
    }
  };

  // Close dropdowns when clicking outside or on escape/tab
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setWorkspaceDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if ((userDropdownOpen || workspaceDropdownOpen) && (event.key === 'Escape' || event.key === 'Tab')) {
        setUserDropdownOpen(false);
        setWorkspaceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen, workspaceDropdownOpen]);

  // Clear all filters and reset to default state
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setSortBy('date uploaded');
    // Update URL to remove search params
    if (window.history.pushState) {
      const newUrl = window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  };

  // Sorting and filtering logic
  const filteredAndSortedPlugins = useMemo(() => {
    let filtered = pluginData;
    
    // Debug: Log plugin data on first load
    if (pluginData.length > 0 && !searchTerm) {
      console.log('Plugin data loaded:', pluginData.length, 'plugins');
      console.log('First plugin:', pluginData[0]);
    }

    // Filter by search term (comprehensive search)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      console.log('Searching for:', searchLower);
      filtered = filtered.filter(plugin => {
        // Basic field searches
        const titleMatch = plugin.title && plugin.title.toLowerCase().includes(searchLower);
        const descMatch = plugin.description && plugin.description.toLowerCase().includes(searchLower);
        const fullDescMatch = plugin.fullDescription && plugin.fullDescription.toLowerCase().includes(searchLower);
        const companyMatch = plugin.company && plugin.company.toLowerCase().includes(searchLower);
        const tagMatch = plugin.tags && plugin.tags.some(tag => tag && tag.toLowerCase().includes(searchLower));
        
        // Word-based search for partial matches
        const words = searchLower.split(' ').filter(word => word.length > 1);
        const wordMatch = words.length > 0 && words.some(word => 
          (plugin.title && plugin.title.toLowerCase().includes(word)) ||
          (plugin.description && plugin.description.toLowerCase().includes(word)) ||
          (plugin.fullDescription && plugin.fullDescription.toLowerCase().includes(word)) ||
          (plugin.tags && plugin.tags.some(tag => tag && tag.toLowerCase().includes(word)))
        );
        
        return titleMatch || descMatch || fullDescMatch || companyMatch || tagMatch || wordMatch;
      });
      console.log('Filtered results:', filtered.length);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(plugin => plugin.category === categoryFilter);
    }

    // Sort plugins
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date uploaded':
        default:
          // Sort by updatedDate (newest first)
          return new Date(b.updatedDate) - new Date(a.updatedDate);
      }
    });

    return sorted;
  }, [searchTerm, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
      {/* Header */}
      <header className="shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Workspace */}
            <div className="flex items-center">
              <a href="https://reearth.io/home" className="flex items-center">
                <img
                  src="/Image/Logo/Marketplace(auth).svg"
                  alt="Re:Earth Marketplace"
                  className="h-12"
                />
              </a>
              
              {/* Separator and Workspace Selector - Only show when logged in */}
              {isAuthenticated && (
                <>
                  <div className="h-8 w-px bg-gray-300 mx-4"></div>
                  
                  <div className="relative" ref={workspaceDropdownRef}>
                    <button 
                      onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                      aria-expanded={workspaceDropdownOpen}
                      aria-haspopup="menu"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {selectedWorkspace === 'My Workspace' ? 'M' : selectedWorkspace.charAt(0)}
                        </span>
                      </div>
                      <span 
                        className="text-gray-700 font-medium"
                        style={{
                          fontFamily: 'Outfit',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '140%'
                        }}
                      >
                        {selectedWorkspace}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {/* Workspace Dropdown */}
                    {workspaceDropdownOpen && (
                      <div 
                        className="absolute left-0 mt-2 bg-white z-50"
                        role="menu"
                        style={{
                          borderRadius: '10px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          padding: '8px 6px',
                          minWidth: '250px',
                          width: 'fit-content'
                        }}
                      >
                        {/* Personal Section */}
                        <div className="px-3 py-2">
                          <div 
                            className="text-gray-500 font-medium mb-2"
                            style={{
                              fontFamily: 'Outfit, sans-serif',
                              fontSize: '12px',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}
                          >
                            {workspaceGroups.personal.label}
                          </div>
                          {workspaceGroups.personal.options.map((workspace, index) => (
                            <button
                              key={index}
                              onClick={() => handleWorkspaceSelect(workspace)}
                              role="menuitem"
                              className="flex items-center w-full text-left transition-colors hover:bg-gray-50 mb-1"
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
                              <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-semibold">{workspace.badge}</span>
                              </div>
                              {workspace.name}
                            </button>
                          ))}
                        </div>

                        {/* Separator */}
                        <div className="border-b border-gray-100 mx-3 my-2"></div>

                        {/* Team Section */}
                        <div className="px-3 py-2">
                          <div 
                            className="text-gray-500 font-medium mb-2"
                            style={{
                              fontFamily: 'Outfit, sans-serif',
                              fontSize: '12px',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}
                          >
                            {workspaceGroups.team.label}
                          </div>
                          {workspaceGroups.team.options.map((workspace, index) => (
                            <button
                              key={index}
                              onClick={() => handleWorkspaceSelect(workspace)}
                              role="menuitem"
                              className="flex items-center w-full text-left transition-colors hover:bg-gray-50 mb-1"
                              style={{
                                fontFamily: workspace.name.match(/[ひらがなカタカナ漢字]/) ? '"Noto Sans JP", sans-serif' : 'Outfit, sans-serif',
                                fontSize: '14px',
                                lineHeight: '140%',
                                fontWeight: 400,
                                color: 'var(--text-default, #0A0A0A)',
                                padding: '8px 12px',
                                borderRadius: '8px'
                              }}
                            >
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-semibold">{workspace.badge}</span>
                              </div>
                              {workspace.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
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
                        onClick={handleDeveloperPortal}
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
                        <Building2 className="w-4 h-4 mr-3" />
                        Developer Portal
                      </button>
                      <button
                        onClick={handleManagePlugins}
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
                        <Package className="w-4 h-4 mr-3" />
                        Manage Plugins
                      </button>
                      <button
                        onClick={handleLikedPlugins}
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
                        <Heart className="w-4 h-4 mr-3" />
                        Liked Plugins
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
                    onClick={handleStartClick}
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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-left mb-12">
          <h1 
            className="mb-6"
            style={{
              color: '#000',
              fontFamily: 'Outfit',
              fontSize: '56px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%'
            }}
          >
            Marketplace
          </h1>
          <div className="space-y-2">
            <p 
              style={{
                color: '#000',
                fontFamily: 'Outfit',
                fontSize: '24px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '140%',
                letterSpacing: '-0.24px'
              }}
            >
              Discover community-made plugins for visualizer
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mt-8">
            <div 
              className="relative"
              style={{
                display: 'flex',
                width: '904px',
                height: '40px',
                paddingRight: '224px',
                alignItems: 'center'
              }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, function and description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    clearFilters();
                    e.target.blur();
                  }
                }}
                className="w-full pl-10 pr-10 h-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearFilters}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            {searchTerm && (
              <p className="text-gray-600 text-sm">
                {filteredAndSortedPlugins.length} results found for "{searchTerm}"
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="date uploaded">Sort by date uploaded</option>
              <option value="likes">Sort by likes</option>
              <option value="downloads">Sort by downloads</option>
              <option value="title">Sort by title</option>
            </select>
          </div>
        </div>

        {/* Plugin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ alignItems: 'stretch' }}>
          {filteredAndSortedPlugins.length > 0 ? (
            filteredAndSortedPlugins.map((plugin) => (
              <PluginCard key={plugin.id} plugin={plugin} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              {/* Magnifying Glass Icon */}
              <div className="flex justify-center mb-6">
                <SearchX className="w-16 h-16 text-gray-300" />
              </div>
              
              {/* No Results Headline */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No results found
              </h2>
              
              {/* Subtext */}
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your platform filters or search term to see more results.
              </p>
              
              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ backgroundColor: '#0089D4' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
                aria-label="Clear all filters and search terms"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Clear Filters Button - shown when there are results and filters are active */}
        {filteredAndSortedPlugins.length > 0 && (searchTerm || categoryFilter !== 'all' || sortBy !== 'date uploaded') && (
          <div className="text-center mt-12 mb-8">
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ backgroundColor: '#0089D4' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
              aria-label="Clear all filters and search terms"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="relative overflow-hidden" style={{ marginTop: '80px', backgroundColor: '#F8F9FA', borderRadius: '16px', padding: '80px 0' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            {/* Left side - Text Content */}
            <div className="flex-1 max-w-lg">
              <h2 
                className="mb-6"
                style={{
                  color: '#000',
                  fontFamily: 'Outfit',
                  fontSize: '36px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%',
                  marginBottom: '24px'
                }}
              >
                Build something great? Share<br />
                your <span style={{ fontWeight: 700 }}>plugin</span> with the community
              </h2>
              
              <a 
                href="/developer-portal"
                className="inline-flex items-center space-x-2 text-white px-6 py-3 rounded-lg font-semibold transition-colors no-underline"
                style={{ 
                  backgroundColor: '#0089D4', 
                  textDecoration: 'none',
                  fontFamily: 'Outfit',
                  fontSize: '16px',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
                aria-label="Go to Developer Portal"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path 
                    d="M21.4274 2.5783C20.9274 2.0673 20.1874 1.8783 19.4974 2.0783L3.40742 6.7273C2.67142 6.9383 2.53742 7.9483 3.19342 8.3283L8.49742 11.2073L15.0974 5.0083C15.5864 4.5593 16.3654 4.5853 16.8244 5.0633C17.2734 5.5313 17.2484 6.2993 16.7694 6.7483L10.1694 12.9473L13.0484 18.2513C13.4384 18.9073 14.4274 18.7683 14.6484 18.0323L19.2974 1.9423C19.4874 1.2623 19.2874 0.5123 18.7674 0.0123C18.2574 -0.4877 17.5074 -0.6877 16.8274 -0.4977L21.4274 2.5783Z" 
                    fill="currentColor"
                  />
                </svg>
                Go to Develop Portal
              </a>
            </div>
            
            {/* Right side - Rocket Illustration */}
            <div className="flex-1 flex justify-center items-center">
              <svg 
                width="400" 
                height="300" 
                viewBox="0 0 400 300" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                {/* Background stars */}
                <circle cx="50" cy="40" r="2" fill="#E2E8F0" />
                <circle cx="350" cy="60" r="1.5" fill="#E2E8F0" />
                <circle cx="80" cy="80" r="1" fill="#E2E8F0" />
                <circle cx="320" cy="100" r="2" fill="#E2E8F0" />
                <circle cx="30" cy="120" r="1.5" fill="#E2E8F0" />
                <circle cx="370" cy="140" r="1" fill="#E2E8F0" />
                
                {/* Large background circles/planets */}
                <circle cx="70" cy="50" r="25" fill="none" stroke="#E2E8F0" strokeWidth="2" opacity="0.5" />
                <circle cx="330" cy="70" r="15" fill="#F1F5F9" opacity="0.6" />
                <circle cx="350" cy="200" r="20" fill="none" stroke="#E2E8F0" strokeWidth="1.5" opacity="0.4" />
                
                {/* Clouds */}
                <ellipse cx="60" cy="220" rx="25" ry="8" fill="#F1F5F9" opacity="0.7" />
                <ellipse cx="45" cy="215" rx="18" ry="6" fill="#F1F5F9" opacity="0.7" />
                <ellipse cx="320" cy="240" rx="30" ry="10" fill="#F1F5F9" opacity="0.6" />
                <ellipse cx="300" cy="235" rx="20" ry="7" fill="#F1F5F9" opacity="0.6" />
                
                {/* Launch clouds at bottom */}
                <ellipse cx="200" cy="280" rx="40" ry="12" fill="#F1F5F9" opacity="0.8" />
                <ellipse cx="180" cy="275" rx="25" ry="8" fill="#E2E8F0" opacity="0.6" />
                <ellipse cx="220" cy="275" rx="30" ry="10" fill="#E2E8F0" opacity="0.6" />
                
                {/* Rocket body */}
                <path 
                  d="M185 250 L215 250 L215 150 L205 130 L195 130 Z" 
                  fill="#E2E8F0" 
                  stroke="#94A3B8" 
                  strokeWidth="2"
                />
                
                {/* Rocket nose cone */}
                <path 
                  d="M195 130 L205 130 L200 110 Z" 
                  fill="#CBD5E1" 
                  stroke="#94A3B8" 
                  strokeWidth="2"
                />
                
                {/* Rocket window */}
                <circle cx="200" cy="160" r="12" fill="#3B82F6" opacity="0.3" stroke="#2563EB" strokeWidth="2" />
                <circle cx="200" cy="160" r="6" fill="#1D4ED8" opacity="0.5" />
                
                {/* Rocket fins */}
                <path d="M185 250 L175 270 L185 270 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
                <path d="M215 250 L225 270 L215 270 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
                
                {/* Rocket flames */}
                <path 
                  d="M190 250 L190 290 L195 285 L200 295 L205 285 L210 290 L210 250" 
                  fill="#F59E0B" 
                  opacity="0.7"
                />
                <path 
                  d="M195 250 L195 285 L200 280 L205 285 L205 250" 
                  fill="#EF4444" 
                  opacity="0.6"
                />
                
                {/* Motion lines */}
                <line x1="150" y1="180" x2="170" y2="180" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                <line x1="155" y1="200" x2="175" y2="200" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                <line x1="145" y1="220" x2="170" y2="220" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                
                <line x1="230" y1="185" x2="250" y2="185" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                <line x1="225" y1="205" x2="245" y2="205" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                <line x1="235" y1="225" x2="260" y2="225" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200" style={{ marginTop: '24px' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

export default Marketplace;