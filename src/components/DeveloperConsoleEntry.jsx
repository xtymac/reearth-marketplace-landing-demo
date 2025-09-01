import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { authService } from '../services/authService';

const DeveloperConsoleEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Workspace data - simplified to one Personal Workspace
  const workspaces = React.useMemo(() => [
    // Personal workspace
    {
      id: 'personal-workspace',
      name: 'Personal Workspace',
      type: 'Personal',
      members: null,
      workspaceId: null
    },
    // Team workspaces
    {
      id: 'fukuyama-consultant',
      name: '株式会社福山コンサルタント',
      type: 'Team',
      members: 8,
      workspaceId: 'fukuyama-consultant'
    },
    {
      id: 'weather-data',
      name: '気象データ株式会社',
      type: 'Team',
      members: 12,
      workspaceId: 'weather-data'
    },
    {
      id: 'sensor-tech',
      name: 'センサー技術株式会社',
      type: 'Team',
      members: 15,
      workspaceId: 'sensor-tech'
    },
    {
      id: 'geovision-labs',
      name: 'GeoVision Labs',
      type: 'Team',
      members: 6,
      workspaceId: 'geovision-labs'
    },
    {
      id: 'mobili-solution',
      name: 'モビリソリューション',
      type: 'Team',
      members: 9,
      workspaceId: 'mobili-solution'
    },
    {
      id: 'enviro-tech',
      name: '環境テクノロジー株式会社',
      type: 'Team',
      members: 11,
      workspaceId: 'enviro-tech'
    },
    {
      id: 'enviro-node',
      name: 'EnviroNode',
      type: 'Team',
      members: 4,
      workspaceId: 'enviro-node'
    },
    {
      id: 'chrono-maps',
      name: 'ChronoMaps Studio',
      type: 'Team',
      members: 7,
      workspaceId: 'chrono-maps'
    }
  ], []);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);

    // Check if user explicitly clicked "Switch" - if so, bypass auto-redirect
    const searchParams = new URLSearchParams(location.search);
    const isExplicitSwitch = searchParams.get('switch') === 'true';

    // Check for saved workspace and auto-redirect if found (but only if not explicitly switching)
    if (authenticated && !isExplicitSwitch) {
      const savedWorkspace = localStorage.getItem('developerPortal_selectedWorkspace');
      if (savedWorkspace) {
        try {
          const workspaceData = JSON.parse(savedWorkspace);
          // Find the workspace in our workspaces array
          const workspace = workspaces.find(w => w.id === workspaceData.id);
          if (workspace) {
            // Auto-redirect to the saved workspace
            navigate('/developer-console/workspace', { 
              state: { 
                selectedWorkspace: workspace,
                workspaceId: workspace.id 
              } 
            });
            return;
          }
        } catch (error) {
          // Clear invalid saved data
          localStorage.removeItem('developerPortal_selectedWorkspace');
        }
      }
    }
    
    // Set loading to false after checking for auto-redirect
    setIsLoading(false);
  }, [navigate, workspaces, location.search]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleWorkspaceClick = (workspace) => {
    setSelectedWorkspace(workspace.id);
  };

  const handleEnterPortal = () => {
    if (selectedWorkspace) {
      const workspace = workspaces.find(w => w.id === selectedWorkspace);
      if (workspace) {
        // Save workspace to localStorage for future visits
        localStorage.setItem('developerPortal_selectedWorkspace', JSON.stringify({
          id: workspace.id,
          name: workspace.name,
          type: workspace.type,
          members: workspace.members,
          workspaceId: workspace.workspaceId
        }));

        // Navigate to the Developer Console with the selected workspace context
        // Pass the workspace information via state so the Developer Console can use it
        navigate('/developer-console/workspace', { 
          state: { 
            selectedWorkspace: workspace,
            workspaceId: workspace.id 
          } 
        });
      }
    }
  };

  // Welcome page for non-authenticated users
  const WelcomePage = () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--gray-500, #6B7280)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        minWidth: '190px',
        padding: 'var(--spacing-pc-8, 44px)',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-pc-7, 28px)',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Logo and Title */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center'
        }}>
          <img 
            src="/Image/Logo/Developer_Console.svg" 
            alt="Developer Console" 
            style={{
              height: '48px',
              width: 'auto'
            }}
          />
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            fontFamily: 'Outfit',
            lineHeight: '1.5',
            margin: 0
          }}>
            Build, manage, and distribute plugins for the Re:Earth platform
          </p>
        </div>

        {/* Feature Highlights */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#E6F0FF',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <img 
                src="/Image/Icon/icon/file-text.svg" 
                alt="Plugin Management" 
                style={{ width: '14px', height: '14px' }}
              />
            </div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'Outfit',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                Plugin Management
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                fontFamily: 'Outfit',
                lineHeight: '1.4',
                margin: 0
              }}>
                Upload, edit, and manage plugins with version control and documentation tools.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#FFE6F5',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <img 
                src="/Image/Icon/icon/history.svg" 
                alt="Version Control" 
                style={{ width: '14px', height: '14px' }}
              />
            </div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'Outfit',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                Version Control
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                fontFamily: 'Outfit',
                lineHeight: '1.4',
                margin: 0
              }}>
                Track changes, manage releases, and maintain changelogs.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#FFF3E0',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <img 
                src="/Image/Icon/icon/git-compare.svg" 
                alt="Marketplace Integration" 
                style={{ width: '14px', height: '14px' }}
              />
            </div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'Outfit',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                Marketplace Integration
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                fontFamily: 'Outfit',
                lineHeight: '1.4',
                margin: 0
              }}>
                Publish plugins to the marketplace and reach users worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 24px',
            background: 'var(--reearth-sky-700, #116993)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-pc-md, 6px)',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'Outfit',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Get Started
        </button>

        {/* Footer Documentation Link */}
        <p style={{
          fontSize: '13px',
          color: '#9CA3AF',
          fontFamily: 'Outfit',
          lineHeight: '1.4',
          margin: 0,
          textAlign: 'center'
        }}>
          New to Re:Earth? Learn more about building plugins in our{' '}
          <a 
            href="/documentation" 
            style={{ 
              color: '#00A2EA', 
              textDecoration: 'none' 
            }}
          >
            documentation
          </a>
          .
        </p>
      </div>
    </div>
  );

  // Show welcome page for non-authenticated users
  if (!isAuthenticated) {
    return <WelcomePage />;
  }

  // Show loading state while checking for auto-redirect
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--tailwind-neutra-900, #171717)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#FFF',
          fontFamily: 'Outfit',
          fontSize: '16px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #374151',
            borderTop: '2px solid #FFF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading...
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--tailwind-neutra-900, #171717)' }}>
      <div 
        className="relative mx-4"
        style={{
          display: 'flex',
          width: '504px',
          minWidth: '190px',
          padding: '24px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          flexShrink: 0,
          borderRadius: '8px',
          border: '1px solid #E4E4E7',
          background: '#FFF',
          boxShadow: '1px 1px 2px 0 rgba(82, 90, 102, 0.05), 2px 2px 8px 0 rgba(82, 90, 102, 0.08)'
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            height: '47px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            alignSelf: 'stretch'
          }}
        >
          <h2 
            style={{
              color: 'var(--base-card-foreground, #09090B)',
              fontFamily: 'Outfit',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '140%'
            }}
          >
            Choose your workspace
          </h2>
          <p 
            style={{
              color: 'var(--text-default, #0A0A0A)',
              fontFamily: 'Outfit',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%'
            }}
          >
            Select a workspace to enter the Developer Console. You can switch later from the sidebar.
          </p>
        </div>

        {/* Workspace list */}
        <div className="max-h-80 overflow-y-auto" style={{ width: '100%', marginTop: '24px' }}>
          {workspaces.map((workspace, index) => {
            const isFirst = index === 0;
            const isLast = index === workspaces.length - 1;
            const isMiddle = !isFirst && !isLast;
            
            let cardStyle = {
              display: 'flex',
              padding: 'var(--spacing-pc-4, 16px) var(--spacing-pc-5, 20px)',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'var(--spacing-pc-2, 8px)',
              alignSelf: 'stretch'
            };

            if (isFirst) {
              cardStyle = {
                ...cardStyle,
                borderRadius: 'var(--radius-pc-md, 6px) var(--radius-pc-md, 6px) 0 0',
                borderTop: '1px solid var(--outline-main, #E5E7EB)',
                borderRight: '1px solid var(--outline-main, #E5E7EB)',
                borderLeft: '1px solid var(--outline-main, #E5E7EB)',
                background: selectedWorkspace === workspace.id ? 'var(--tailwind-slate-100, #F1F5F9)' : '#FFFFFF'
              };
            } else if (isMiddle) {
              cardStyle = {
                ...cardStyle,
                borderTop: '1px solid var(--outline-main, #E5E7EB)',
                borderRight: '1px solid var(--outline-main, #E5E7EB)',
                borderLeft: '1px solid var(--outline-main, #E5E7EB)',
                background: selectedWorkspace === workspace.id ? 'var(--tailwind-slate-100, #F1F5F9)' : '#FFFFFF'
              };
            } else if (isLast) {
              cardStyle = {
                ...cardStyle,
                borderRadius: '0 0 var(--radius-pc-md, 6px) var(--radius-pc-md, 6px)',
                borderTop: '1px solid var(--outline-main, #E5E7EB)',
                borderRight: '1px solid var(--outline-main, #E5E7EB)',
                borderLeft: '1px solid var(--outline-main, #E5E7EB)',
                borderBottom: '1px solid var(--outline-main, #E5E7EB)',
                background: selectedWorkspace === workspace.id ? 'var(--tailwind-slate-100, #F1F5F9)' : '#FFFFFF'
              };
            }

            return (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceClick(workspace)}
                className="w-full text-left transition-all duration-200"
                style={cardStyle}
              >
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'stretch'
                  }}
                >
                  <div>
                    <div 
                      className="font-medium"
                      style={{
                        fontFamily: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(workspace.name) ? '"Noto Sans JP", sans-serif' : 'Outfit, sans-serif',
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: '140%',
                        color: '#0A0A0A'
                      }}
                    >
                      {workspace.name}
                    </div>
                    <div 
                      className="text-gray-500"
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '140%'
                      }}
                    >
                      {workspace.type}
                    </div>
                  </div>
                {workspace.members && (
                  <div 
                    className="text-gray-500"
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '140%'
                    }}
                  >
                    {workspace.members} members
                  </div>
                )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action buttons - right aligned */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '12px',
            alignSelf: 'stretch'
          }}
        >
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="transition-all duration-200 hover:bg-gray-50"
              style={{
                display: 'flex',
                padding: 'var(--spacing-pc-2, 8px) var(--spacing-pc-4, 16px)',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 'var(--radius-pc-md, 6px)',
                border: '1px solid var(--outline-main, #E5E7EB)',
                background: '#FFF',
                color: '#212121',
                fontFamily: 'Outfit',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '140%'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleEnterPortal}
              disabled={!selectedWorkspace}
              className="transition-all duration-200"
              style={{
                display: 'flex',
                padding: 'var(--spacing-pc-2, 8px) var(--spacing-pc-4, 16px)',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 'var(--radius-pc-md, 6px)',
                border: 'none',
                background: selectedWorkspace ? 'var(--reearth-sky-700, #116993)' : '#9CA3AF',
                color: '#FFF',
                fontFamily: 'Outfit',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '140%',
                cursor: selectedWorkspace ? 'pointer' : 'not-allowed'
              }}
            >
              Enter portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperConsoleEntry;