import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const DeveloperPortalSidebar = ({ 
  activeItem = 'manage', // 'submit' | 'manage'
  selectedWorkspace,
  workspaces = [],
  onWorkspaceChange,
  onLogoClick
}) => {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const workspaceDropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showWorkspaceDropdown && workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setShowWorkspaceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWorkspaceDropdown]);

  const handleWorkspaceClick = () => {
    setShowWorkspaceDropdown(!showWorkspaceDropdown);
  };

  const handleWorkspaceSelect = (workspaceId) => {
    if (onWorkspaceChange) {
      onWorkspaceChange(workspaceId);
    }
    setShowWorkspaceDropdown(false);
  };

  const handleLogoClickInternal = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <div className="dev-portal-sidebar">
      <div className="sidebar-header">
        <div 
          className="logo"
          onClick={handleLogoClickInternal}
          style={{
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img 
            src="/Image/Logo/Developer_Portal_w.svg" 
            alt="Developer Portal"
            className="logo-image"
          />
          <span className="logo-text">Developer Portal</span>
        </div>
      </div>
      
      <div className="workspace-section">
        <div className="workspace-label">Workspace</div>
        <div 
          className="workspace-dropdown-container"
          style={{ position: 'relative' }}
          ref={workspaceDropdownRef}
        >
          <button
            onClick={handleWorkspaceClick}
            className="workspace-select"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{workspaces.find(w => w.id === selectedWorkspace)?.name || 'Select Workspace'}</span>
            <ChevronDown 
              size={16} 
              style={{ 
                transform: showWorkspaceDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </button>
          
          {/* Workspace Dropdown */}
          {showWorkspaceDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                marginTop: '4px',
                borderRadius: '6px',
                border: '1px solid var(--slate-300, #CBD5E1)',
                background: '#FFF',
                boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.09)',
                overflow: 'hidden',
                zIndex: 1000
              }}
            >
              {workspaces.map(workspace => (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceSelect(workspace.id)}
                  style={{
                    width: '100%',
                    height: '36px',
                    display: 'flex',
                    padding: '6px 8px 6px 32px',
                    alignItems: 'center',
                    gap: '8px',
                    alignSelf: 'stretch',
                    borderRadius: '6px',
                    border: 'none',
                    background: selectedWorkspace === workspace.id ? 'var(--slate-100, #F1F5F9)' : 'none',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    textAlign: 'left',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedWorkspace !== workspace.id) {
                      e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedWorkspace !== workspace.id) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {workspace.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-title">Get Started</div>
          <a 
            href="https://visualizer.developer.reearth.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-item"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>Documentation</span>
            <img 
              src="/Image/Icon/NewTab.svg" 
              alt="Open in new tab"
              style={{ width: '16px', height: '16px' }}
            />
          </a>
          <Link 
            to="/developer-portal/new" 
            className={`nav-item ${activeItem === 'submit' ? 'active' : ''}`}
          >
            Submit plugin
          </Link>
          <Link 
            to="/developer-portal/workspace" 
            className={`nav-item ${activeItem === 'manage' ? 'active' : ''}`}
          >
            Manage plugin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortalSidebar;