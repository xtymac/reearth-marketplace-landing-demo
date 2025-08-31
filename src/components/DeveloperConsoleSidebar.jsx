import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, FileText, GitBranch, AlertTriangle } from 'lucide-react';

const DeveloperConsoleSidebar = ({ 
  selectedWorkspace,
  workspaces = [],
  onWorkspaceChange,
  onLogoClick,
  // Editor-specific props
  isEditMode = false,
  selectedPlugin = null,
  activeSection = 'General',
  onSectionChange
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

  // Editor navigation items
  const sidebarItems = [
    { id: 'General', label: 'General', icon: FileText },
    { id: 'README', label: 'README', icon: FileText },
    { id: 'Version', label: 'Version', icon: GitBranch },
    { id: 'Danger Zone', label: 'Danger Zone', icon: AlertTriangle }
  ];

  const handleSectionClick = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <div className="dev-portal-sidebar-new">
      <div className="sidebar-header-new">
        <div 
          className="logo-new"
          onClick={handleLogoClickInternal}
          style={{
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img 
            src="/Image/Logo/Developer_Console.svg" 
            alt="Developer Console"
            style={{
              width: '32px',
              height: '32px'
            }}
          />
          <span style={{
            color: '#111827',
            fontFamily: 'Outfit',
            fontSize: '20px',
            fontWeight: '600',
            lineHeight: '140%'
          }}>Developer Console</span>
        </div>
      </div>
      
      <div className="workspace-section-new">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <div style={{
            color: '#6B7280',
            fontFamily: 'Outfit',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '140%'
          }}>Workspace</div>
          <Link 
            to="/developer-console" 
            style={{
              color: '#6B7280',
              fontFamily: 'Outfit',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#111827'}
            onMouseLeave={(e) => e.target.style.color = '#6B7280'}
          >
            Switch
          </Link>
        </div>
        <div 
          className="workspace-dropdown-container"
          style={{ position: 'relative' }}
          ref={workspaceDropdownRef}
        >
          <button
            onClick={handleWorkspaceClick}
            style={{
              display: 'flex',
              width: '100%',
              height: '40px',
              padding: '8px 12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              background: '#FFF',
              color: '#111827',
              fontFamily: 'Outfit',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            <span>{workspaces.find(w => w.id === selectedWorkspace)?.name || 'Select Workspace'}</span>
            <ChevronDown 
              size={16} 
              style={{ 
                transform: showWorkspaceDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                color: '#6B7280'
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
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                background: '#FFF',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
                    height: '40px',
                    display: 'flex',
                    padding: '8px 12px',
                    alignItems: 'center',
                    border: 'none',
                    background: selectedWorkspace === workspace.id ? '#F3F4F6' : 'transparent',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedWorkspace !== workspace.id) {
                      e.target.style.backgroundColor = '#F9FAFB';
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
      
      {/* Plugin Title and Editor Navigation - Show when in edit mode */}
      {isEditMode && selectedPlugin && (
        <>
          {/* Plugin Title */}
          <div style={{
            marginTop: '24px',
            marginBottom: '12px'
          }}>
            <h3 style={{
              color: '#737373',
              fontFamily: 'Outfit',
              fontSize: '16px',
              fontWeight: '500',
              lineHeight: '140%',
              margin: '0'
            }}>
              {selectedPlugin.title || selectedPlugin.name}
            </h3>
          </div>
          
          {/* Editor Navigation Items */}
          <div style={{ marginBottom: '24px' }}>
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.id === activeSection;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 8px',
                    border: 'none',
                    borderRadius: '6px',
                    background: isActive ? '#00A2EA' : 'transparent',
                    color: isActive ? 'white' : '#0A0A0A',
                    fontSize: '14px',
                    fontWeight: '400',
                    fontFamily: 'Outfit',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <IconComponent size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DeveloperConsoleSidebar;