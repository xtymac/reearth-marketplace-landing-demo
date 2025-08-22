import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import '../DeveloperPortal.css';

function DeveloperPluginUpload() {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState('file');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '',
    readme: '',
    file: null,
    githubUrl: '',
    workspace: 'workspace-1',
    visibility: 'draft'
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const pluginData = {
      ...formData,
      uploadType,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Submitting plugin:', pluginData);
    
    // Navigate to success page with plugin data
    navigate('/plugin/new/success', { 
      state: { pluginData } 
    });
  };

  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.dataTransfer.files[0]
      }));
    }
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
            value={formData.workspace}
            onChange={handleInputChange}
            name="workspace"
            className="workspace-select"
            required
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
            <a href="#" className="nav-item">Documentation</a>
            <a href="#" className="nav-item active">Submit plugin</a>
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
            <h1 className="page-title">Upload a new plugin</h1>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
          {/* Workspace Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Workspace <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#2A2A2A',
              border: '1px solid #404040',
              borderRadius: '8px',
              color: '#9CA3AF',
              fontSize: '14px',
              fontFamily: 'Outfit'
            }}>
              Select a workspace
            </div>
            <p style={{
              color: '#9CA3AF',
              fontSize: '12px',
              fontFamily: 'Outfit',
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>
              Uploaded plugin will appear under this workspace and be listed as its creator.
            </p>
          </div>

          {/* Plugin Name */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Plugin Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter plugin name"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#2A2A2A',
                border: '1px solid #404040',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Outfit',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Plugin Image */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Plugin Image <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 16px',
              backgroundColor: '#2A2A2A',
              border: '1px solid #404040',
              borderRadius: '6px',
              color: '#9CA3AF',
              fontSize: '14px',
              fontFamily: 'Outfit',
              cursor: 'pointer',
              marginBottom: '8px'
            }}>
              Choose File
              <span style={{ marginLeft: '12px', color: '#6B7280' }}>No file chosen</span>
            </div>
            <p style={{
              color: '#9CA3AF',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 8px 0'
            }}>
              Upload at least one plugin screenshot or cover image (Recommended: 1280×800 pixels)
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4].map((num, index) => (
                <div key={num} style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: index === 0 ? '#404040' : '#2A2A2A',
                  border: '1px solid #404040',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {index === 0 && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                  )}
                  {index === 3 && (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px dashed #6B7280',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: '#6B7280', fontSize: '12px', lineHeight: 1 }}>+</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Type your message"
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#2A2A2A',
                border: '1px solid #404040',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Outfit',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              color: '#9CA3AF',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 0 0'
            }}>
              Provide a detailed description of what your plugin does and its key features.
            </p>
          </div>

          {/* Plugin File */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Plugin File <span style={{ color: '#EF4444' }}>*</span>
            </label>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setUploadType('file')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: uploadType === 'file' ? '#2CC3FF' : 'transparent',
                  border: `1px solid ${uploadType === 'file' ? '#2CC3FF' : '#404040'}`,
                  borderRadius: '6px',
                  color: uploadType === 'file' ? 'white' : '#9CA3AF',
                  fontSize: '14px',
                  fontFamily: 'Outfit',
                  cursor: 'pointer'
                }}
              >
                Upload from local
              </button>
              <button
                type="button"
                onClick={() => setUploadType('github')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: uploadType === 'github' ? '#2CC3FF' : 'transparent',
                  border: `1px solid ${uploadType === 'github' ? '#2CC3FF' : '#404040'}`,
                  borderRadius: '6px',
                  color: uploadType === 'github' ? 'white' : '#9CA3AF',
                  fontSize: '14px',
                  fontFamily: 'Outfit',
                  cursor: 'pointer'
                }}
              >
                GitHub
              </button>
            </div>

            {uploadType === 'file' ? (
              <>
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragActive ? '#2CC3FF' : '#404040'}`,
                    borderRadius: '8px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    backgroundColor: dragActive ? 'rgba(44, 195, 255, 0.05)' : 'transparent'
                  }}
                >
                  <Upload size={24} color="#9CA3AF" style={{ marginBottom: '12px' }} />
                  <p style={{
                    color: '#9CA3AF',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    margin: '0 0 4px 0'
                  }}>
                    Click or drag file to this area to upload
                  </p>
                  <p style={{
                    color: '#6B7280',
                    fontSize: '12px',
                    fontFamily: 'Outfit',
                    margin: 0
                  }}>
                    ZIP file up to 50MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required={uploadType === 'file'}
                />
                {formData.file && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#2A2A2A',
                    border: '1px solid #404040',
                    borderRadius: '6px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Outfit' }}>
                      {formData.file.name}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repository"
                required={uploadType === 'github'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#2A2A2A',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'Outfit',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            )}
          </div>

          {/* Version */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Version
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleInputChange}
              placeholder="V 0.01"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#2A2A2A',
                border: '1px solid #404040',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Outfit',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              color: '#9CA3AF',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 0 0'
            }}>
              Version numbers are automatically loaded from the plugin's YML file — see{' '}
              <a href="#" style={{ color: '#0089D4', textDecoration: 'none' }}>documentation</a> for details.
            </p>
          </div>

          {/* Release Notes */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Release Notes
            </label>
            <textarea
              name="readme"
              value={formData.readme}
              onChange={handleInputChange}
              placeholder="Type your message"
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#2A2A2A',
                border: '1px solid #404040',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Outfit',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              color: '#9CA3AF',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 0 0'
            }}>
              Describe what changed in this version for users
            </p>
          </div>

          {/* Version Labels */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Version Labels
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {['Bug Fix', 'New Feature', 'Doc Update', 'UI Update'].map((label, index) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: index === 0 ? '#EF4444' : index === 1 ? '#10B981' : index === 2 ? '#3B82F6' : '#8B5CF6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'Outfit',
                    cursor: 'pointer',
                    opacity: index > 0 ? 0.5 : 1
                  }}
                >
                  {label} {index > 0 && '×'}
                </button>
              ))}
            </div>
            <p style={{
              color: '#9CA3AF',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 0 0'
            }}>
              Choose labels to describe this update (e.g., bug fix, new feature). Separate multiple tags with commas.
            </p>
          </div>

          {/* Function Tag */}
          <div style={{ marginBottom: '48px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Function Tag
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {['3D', 'Data', 'Image'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                    backgroundColor: '#2A2A2A',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '12px',
                    fontFamily: 'Outfit'
                  }}
                >
                  {tag}
                  <span style={{ marginLeft: '4px', cursor: 'pointer' }}>×</span>
                </span>
              ))}
              <button
                type="button"
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  border: '1px dashed #404040',
                  borderRadius: '4px',
                  color: '#9CA3AF',
                  fontSize: '12px',
                  fontFamily: 'Outfit',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
            <p style={{
              color: '#9CA3AF',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 0 0'
            }}>
              Add function tags to help users discover your plugin. Separate multiple tags with commas.
            </p>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/developer')}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                border: '1px solid #404040',
                borderRadius: '6px',
                color: '#9CA3AF',
                fontSize: '14px',
                fontFamily: 'Outfit',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#0EA5E9',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Outfit',
                cursor: 'pointer'
              }}
            >
              Submit Plugin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeveloperPluginUpload;