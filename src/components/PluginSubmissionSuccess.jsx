import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import '../DeveloperPortal.css';

function PluginSubmissionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get plugin data from navigation state
  const pluginData = location.state?.pluginData;

  const workspaces = [
    { id: 'workspace-1', name: 'Eukarya Inc.' },
    { id: 'workspace-2', name: 'Fukuyama Consultants' },
    { id: 'workspace-3', name: 'MIERUNE Inc.' },
    { id: 'workspace-4', name: 'AERO ASAHI' },
    { id: 'workspace-5', name: 'C DESIGN' },
    { id: 'workspace-6', name: 'Geolonia' },
    { id: 'workspace-7', name: 'Weather Data Co.' },
    { id: 'workspace-8', name: 'USIC Inc.' }
  ];

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const getWorkspaceName = (workspaceId) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    return workspace ? workspace.name : 'Unknown Workspace';
  };

  return (
    <div className="dev-portal-container">
      {/* Sidebar */}
      <div className="dev-portal-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="white"/>
              <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="#2C3E50"/>
            </svg>
            <span className="logo-text">Developer Portal</span>
          </div>
          {/* User avatar - positioned at top right */}
          <div className="user-avatar">
            <img src="/Image/Avatar.png" alt="User" className="avatar-img" />
          </div>
        </div>
        
        <div className="workspace-section">
          <div className="workspace-label">Workspace</div>
          <select 
            value={pluginData?.workspace || 'workspace-1'}
            disabled
            className="workspace-select"
          >
            {workspaces.map(workspace => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-title">Get Started</div>
            <a href="/documentation" className="nav-item">Documentation</a>
            <Link to="/developer-portal/new" className="nav-item">Submit plugin</Link>
            <Link to="/edit" className="nav-item">Manage plugin</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dev-portal-main">
        <div className="main-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link 
              to="/edit" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#9CA3AF',
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: 'Outfit',
                padding: '4px'
              }}
            >
              <ArrowLeft size={16} />
              Manage plugin
            </Link>
            <h1 className="page-title">Plugin submitted successfully</h1>
          </div>
        </div>
        
        {/* Success Content */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '48px 24px'
        }}>
          {/* Success Icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={48} color="#10B981" />
            </div>
          </div>

          {/* Success Message */}
          <h2 style={{
            color: 'white',
            fontFamily: 'Outfit',
            fontSize: '28px',
            fontWeight: 600,
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Your plugin has been submitted!
          </h2>

          <p style={{
            color: '#9CA3AF',
            fontFamily: 'Outfit',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '32px'
          }}>
            We've received your plugin submission and our team will review it shortly. 
            You'll be notified once your plugin is approved and published to the marketplace.
          </p>

          {/* Plugin Details Card */}
          {pluginData && (
            <div style={{
              backgroundColor: '#2A2A2A',
              border: '1px solid #404040',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h3 style={{
                color: 'white',
                fontFamily: 'Outfit',
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                Submission Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF', fontFamily: 'Outfit', fontSize: '14px' }}>
                    Plugin Name:
                  </span>
                  <span style={{ color: 'white', fontFamily: 'Outfit', fontSize: '14px', fontWeight: 500 }}>
                    {pluginData.title || 'Untitled Plugin'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF', fontFamily: 'Outfit', fontSize: '14px' }}>
                    Workspace:
                  </span>
                  <span style={{ color: 'white', fontFamily: 'Outfit', fontSize: '14px', fontWeight: 500 }}>
                    {getWorkspaceName(pluginData.workspace)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF', fontFamily: 'Outfit', fontSize: '14px' }}>
                    Version:
                  </span>
                  <span style={{ color: 'white', fontFamily: 'Outfit', fontSize: '14px', fontWeight: 500 }}>
                    {pluginData.version || 'V 0.01'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF', fontFamily: 'Outfit', fontSize: '14px' }}>
                    Upload Method:
                  </span>
                  <span style={{ color: 'white', fontFamily: 'Outfit', fontSize: '14px', fontWeight: 500 }}>
                    {pluginData.uploadType === 'github' ? 'GitHub Repository' : 'Local File'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF', fontFamily: 'Outfit', fontSize: '14px' }}>
                    Submitted:
                  </span>
                  <span style={{ color: 'white', fontFamily: 'Outfit', fontSize: '14px', fontWeight: 500 }}>
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next Section */}
          <div style={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <h3 style={{
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              What happens next?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  fontSize: '12px',
                  fontFamily: 'Outfit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  1
                </div>
                <div>
                  <p style={{
                    color: 'white',
                    fontFamily: 'Outfit',
                    fontSize: '14px',
                    fontWeight: 500,
                    margin: '0 0 4px 0'
                  }}>
                    Review Process
                  </p>
                  <p style={{
                    color: '#9CA3AF',
                    fontFamily: 'Outfit',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    Our team will review your plugin for compatibility, security, and functionality.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  fontSize: '12px',
                  fontFamily: 'Outfit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  2
                </div>
                <div>
                  <p style={{
                    color: 'white',
                    fontFamily: 'Outfit',
                    fontSize: '14px',
                    fontWeight: 500,
                    margin: '0 0 4px 0'
                  }}>
                    Testing & Approval
                  </p>
                  <p style={{
                    color: '#9CA3AF',
                    fontFamily: 'Outfit',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    We'll test your plugin across different scenarios and approve it for publication.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: 'white',
                  fontSize: '12px',
                  fontFamily: 'Outfit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  3
                </div>
                <div>
                  <p style={{
                    color: 'white',
                    fontFamily: 'Outfit',
                    fontSize: '14px',
                    fontWeight: 500,
                    margin: '0 0 4px 0'
                  }}>
                    Marketplace Publication
                  </p>
                  <p style={{
                    color: '#9CA3AF',
                    fontFamily: 'Outfit',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    Once approved, your plugin will be published to the Re:Earth marketplace.
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #374151'
            }}>
              <p style={{
                color: '#9CA3AF',
                fontFamily: 'Outfit',
                fontSize: '12px',
                lineHeight: '1.4',
                margin: 0
              }}>
                <strong style={{ color: 'white' }}>Estimated review time:</strong> 2-5 business days
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              to="/edit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#0EA5E9',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Outfit',
                transition: 'background-color 0.2s'
              }}
            >
              Back to Developer Portal
            </Link>

            <Link
              to="/developer-portal/new"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#9CA3AF',
                textDecoration: 'none',
                border: '1px solid #404040',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Outfit',
                transition: 'all 0.2s'
              }}
            >
              Submit Another Plugin
            </Link>

            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#9CA3AF',
                textDecoration: 'none',
                border: '1px solid #404040',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Outfit',
                transition: 'all 0.2s'
              }}
            >
              <ExternalLink size={16} />
              View Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PluginSubmissionSuccess;