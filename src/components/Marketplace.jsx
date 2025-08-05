import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, X, SearchX, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import PluginCard from './PluginCard';
import { pluginData } from '../data/pluginData';
import { authService } from '../services/authService';

const Marketplace = () => {
  const [sortBy, setSortBy] = useState('date uploaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const userData = authService.getUserData();
  const userDropdownRef = useRef(null);


  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate('/plugins/new');
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
                <a href="#" className="text-blue-600" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Marketplace</a>
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
              Have something to share? <a 
                href="/plugins/new"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline cursor-pointer"
                style={{
                  color: '#0089D4',
                  fontFamily: 'Outfit',
                  fontSize: '24px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '140%',
                  letterSpacing: '-0.24px'
                }}
                aria-label="Submit your plugin"
              >
                Submit your plugin
              </a>
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
        <div className="text-left relative overflow-hidden" style={{ marginTop: '80px', paddingTop: '80px', paddingBottom: '0' }}>
          {/* Background image on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end opacity-30 z-0">
            <img
              src="/images/submission.png"
              alt="Submit Plugin"
              className="h-full w-auto object-contain"
            />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Build something great? Share
              </h2>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                your plugin with the community
              </h2>
            </div>
            
            <div className="space-y-4" style={{ marginBottom: '0' }}>
              <a 
                href="/plugins/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg no-underline"
                style={{ backgroundColor: '#0089D4', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
                aria-label="Submit plugin to marketplace"
              >
                Submit Plugin
              </a>
              <div style={{ marginBottom: '0' }}>
                <a href="#" className="text-blue-600 hover:underline font-semibold">
                  View documentation
                </a>
              </div>
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

export default Marketplace;