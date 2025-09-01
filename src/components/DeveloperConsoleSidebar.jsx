import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, GitBranch, AlertTriangle, Building2 } from 'lucide-react';

const DeveloperConsoleSidebar = ({ 
  selectedWorkspace,
  workspaces = [],
  onLogoClick,
  // Editor-specific props
  isEditMode = false,
  selectedPlugin = null,
  activeSection = 'General',
  onSectionChange
}) => {


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
            to="/developer-console?switch=true" 
            style={{
              color: '#00A2EA',
              fontFamily: 'Outfit',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0080C7'}
            onMouseLeave={(e) => e.target.style.color = '#00A2EA'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
              }
            }}
            tabIndex={0}
          >
            Switch
          </Link>
        </div>
        <div 
          className="workspace-display-container"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            background: '#FFF',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          <Building2 
            size={20} 
            color="#6B7280"
            style={{ flexShrink: 0 }}
          />
          <span style={{
            color: '#111827',
            fontFamily: 'Outfit',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '140%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}>
            {workspaces.find(w => w.id === selectedWorkspace)?.name || 'No workspace selected'}
          </span>
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