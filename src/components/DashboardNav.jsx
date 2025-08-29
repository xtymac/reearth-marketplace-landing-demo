import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, LayoutDashboard, Building2, Package, Heart } from 'lucide-react';
import { authService } from '../services/authService';

const DashboardNav = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userDropdownRef = useRef(null);
  const isAuthenticated = authService.isAuthenticated();
  const userData = authService.getUserData();

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

  const handleDeveloperPortal = () => {
    setUserDropdownOpen(false);
    navigate('/developer-portal');
  };

  const handleManagePlugins = () => {
    setUserDropdownOpen(false);
    // Navigate to manage plugins for the first available workspace
    // In a real app, this would use the current user's default workspace
    const defaultWorkspaceId = 'fukuyama-consultant'; // This should come from user context
    navigate(`/workspace/${defaultWorkspaceId}/plugins`);
  };

  const handleLikedPlugins = () => {
    setUserDropdownOpen(false);
    navigate('/liked-plugins');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Dashboard logo and title */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/Image/Dashboard_logo.png"
                alt="Dashboard"
                className="h-8 w-8"
              />
              <h1 
                className="text-gray-900"
                style={{
                  fontFamily: 'Outfit',
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                Dashboard
              </h1>
            </button>
          </div>

          {/* Right side - User avatar dropdown */}
          <div className="flex items-center">
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
              // Fallback when not logged in (though this component is for logged-in dashboard pages)
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-900 font-medium" style={{ fontFamily: '"Noto Sans JP"' }}>日本語</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600" style={{ fontFamily: 'Outfit' }}>Sign up</span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardNav;