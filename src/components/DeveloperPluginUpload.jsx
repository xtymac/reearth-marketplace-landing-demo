import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import DeveloperPortalSidebar from './DeveloperPortalSidebar';
import '../DeveloperPortal.css';

const DeveloperPluginUpload = () => {
  const navigate = useNavigate();

  // Workspace data - consistent with Developer Portal
  const workspaces = [
    { id: 'workspace-1', name: 'Eukarya Inc.', company: 'Eukarya' },
    { id: 'workspace-2', name: 'Fukuyama Consultants', company: 'Fukuyama Consultants' },
    { id: 'workspace-3', name: 'MIERUNE Inc.', company: 'MIERUNE' },
    { id: 'workspace-4', name: 'AERO ASAHI', company: 'AERO ASAHI' },
    { id: 'workspace-5', name: 'C DESIGN', company: 'C DESIGN' },
    { id: 'workspace-6', name: 'Geolonia', company: 'Geolonia' },
    { id: 'workspace-7', name: 'Weather Data Co.', company: '気象データ株式会社' },
    { id: 'workspace-8', name: 'USIC Inc.', company: 'USIC' }
  ];

  const [formData, setFormData] = useState({
    workspace: workspaces[0]?.name || 'Eukarya Inc.',
    name: '',
    images: [],
    description: '',
    file: { name: 'reearth_visualizer_plugin_basemap_swicher-1.0.0.zip' },
    githubUrl: '',
    version: 'V 0.01',
    releaseNotes: '',
    versionLabels: [],
    functionTags: []
  });
  const [uploadMethod, setUploadMethod] = useState('local'); // 'local' or 'github'
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [, setUploadedPluginId] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('workspace-1');
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const functionTagInputRef = useRef(null);
  const avatarDropdownRef = useRef(null);

  // Authentication check
  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target)) {
        setShowAvatarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    navigate('/developer-portal/workspace');
  };

  const handleWorkspaceChange = (workspaceId) => {
    setSelectedWorkspace(workspaceId);
    const selectedWorkspaceData = workspaces.find(w => w.id === workspaceId);
    if (selectedWorkspaceData) {
      setFormData(prev => ({
        ...prev,
        workspace: selectedWorkspaceData.name
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFunctionTag = () => {
    if (currentTag.trim() && !formData.functionTags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        functionTags: [...prev.functionTags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeFunctionTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      functionTags: prev.functionTags.filter(t => t !== tag)
    }));
  };

  const toggleVersionLabel = (label) => {
    setFormData(prev => ({
      ...prev,
      versionLabels: prev.versionLabels.includes(label)
        ? prev.versionLabels.filter(l => l !== label)
        : [...prev.versionLabels, label]
    }));
  };

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
      const file = e.dataTransfer.files[0];
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.workspace.trim()) {
      newErrors.workspace = 'Workspace is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Plugin name is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one plugin image is required';
    }

    if (uploadMethod === 'local') {
      if (!formData.file) {
        newErrors.file = 'Plugin file is required';
      }
    } else {
      if (!formData.githubUrl.trim()) {
        newErrors.githubUrl = 'GitHub repository URL is required';
      } else {
        const githubUrlPattern = /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+\/?$/;
        if (!githubUrlPattern.test(formData.githubUrl.trim())) {
          newErrors.githubUrl = 'Please enter a valid GitHub repository URL (e.g., github.com/username/plugin-name)';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form validation helper (unused but kept for potential future use)
  // const isFormValid = () => {
  //   const hasFileOrGithub = uploadMethod === 'local' 
  //     ? formData.file 
  //     : formData.githubUrl.trim();
  //   
  //   return formData.workspace && formData.name.trim() && hasFileOrGithub;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show notification immediately when Submit Plugin is clicked
    const pluginName = formData.name.trim() || 'Untitled Plugin';
    const pluginId = `plugin-${Date.now()}`;
    
    setNotificationData({
      pluginName,
      pluginId
    });
    setShowNotification(true);

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
      setNotificationData(null);
    }, 5000);

    // Continue with existing validation logic
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setUploadedPluginId(pluginId);
    setIsSuccess(true);
    setIsLoading(false);
  };

  const handleUploadAnother = () => {
    setFormData({
      workspace: 'Eukarya Inc.',
      name: '',
      images: [],
      description: '',
      file: { name: 'reearth_visualizer_plugin_basemap_swicher-1.0.0.zip' },
      githubUrl: '',
      version: 'V 0.01',
      releaseNotes: '',
      versionLabels: [],
      functionTags: []
    });
    setUploadMethod('local');
    setIsSuccess(false);
    setUploadedPluginId(null);
    setErrors({});
    setCurrentTag('');
  };

  const handleViewDetails = () => {
    navigate('/developer-portal/workspace');
  };

  const handleNotificationView = () => {
    if (notificationData?.pluginId) {
      navigate(`/plugin/${notificationData.pluginId}`);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    setNotificationData(null);
  };

  // Success page component
  const renderSuccessPage = () => {
    return (
      <div className="dev-portal-container">
        {/* Sidebar */}
        <DeveloperPortalSidebar
          activeItem="submit"
          selectedWorkspace={selectedWorkspace}
          workspaces={workspaces}
          onWorkspaceChange={handleWorkspaceChange}
          onLogoClick={handleLogoClick}
        />

        {/* Main Content */}
        <div className="dev-portal-main">
          {/* Top bar with avatar */}
          <div 
            className="avatar-dropdown-container"
            style={{ 
              position: 'absolute',
              top: '40px',
              right: '40px',
              zIndex: 10
            }}
            ref={avatarDropdownRef}
          >
            <img 
              src="/Image/Avatar/Avatar.png" 
              alt="User Avatar" 
              onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
            
            {/* Avatar Dropdown */}
            {showAvatarDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '56px',
                  right: '0',
                  borderRadius: '6px',
                  border: '1px solid var(--slate-300, #CBD5E1)',
                  background: '#FFF',
                  boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.09)',
                  minWidth: '200px',
                  overflow: 'hidden',
                  zIndex: 20
                }}
              >
                <button
                  onClick={() => {
                    setShowAvatarDropdown(false);
                    navigate('/');
                  }}
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
                    background: 'none',
                    fontSize: '16px',
                    fontFamily: 'Outfit',
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Marketplace
                </button>
                
                <button
                  onClick={() => {
                    setShowAvatarDropdown(false);
                    navigate('/dashboard');
                  }}
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
                    background: 'none',
                    fontSize: '16px',
                    fontFamily: 'Outfit',
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Dashboard
                </button>
                
                <button
                  onClick={() => {
                    setShowAvatarDropdown(false);
                    navigate('/settings');
                  }}
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
                    background: 'none',
                    fontSize: '16px',
                    fontFamily: 'Outfit',
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Setting
                </button>
                
                <button
                  onClick={() => {
                    setShowAvatarDropdown(false);
                    authService.logout();
                    navigate('/');
                  }}
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
                    background: 'none',
                    fontSize: '16px',
                    fontFamily: 'Outfit',
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="success-content">
            <div className="success-icon">
              <CheckCircle size={64} color="#10B981" />
            </div>
            <h1 className="success-title">Plugin Submitted Successfully!</h1>
            <p className="success-description">
              Your plugin "{formData.name}" has been submitted and is now under review.
              You'll receive an email notification once it's approved.
            </p>
            <div className="success-actions">
              <button onClick={handleViewDetails} className="btn-primary">
                View in Portal
              </button>
              <button onClick={handleUploadAnother} className="btn-secondary">
                Submit Another Plugin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return renderSuccessPage();
  }

  return (
    <div className="dev-portal-container">
      {/* Sidebar */}
      <DeveloperPortalSidebar
        activeItem="submit"
        selectedWorkspace={selectedWorkspace}
        workspaces={workspaces}
        onWorkspaceChange={handleWorkspaceChange}
        onLogoClick={handleLogoClick}
      />

      {/* Main Content */}
      <div className="dev-portal-main">
        {/* Top bar with avatar */}
        <div 
          className="avatar-dropdown-container"
          style={{ 
            position: 'absolute',
            top: '40px',
            right: '40px',
            zIndex: 10
          }}
          ref={avatarDropdownRef}
        >
          <img 
            src="/Image/Avatar/Avatar.png" 
            alt="User Avatar" 
            onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          />
          
          {/* Avatar Dropdown */}
          {showAvatarDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '56px',
                right: '0',
                borderRadius: '6px',
                border: '1px solid var(--slate-300, #CBD5E1)',
                background: '#FFF',
                boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.09)',
                minWidth: '200px',
                overflow: 'hidden',
                zIndex: 20
              }}
            >
              <button
                onClick={() => {
                  setShowAvatarDropdown(false);
                  navigate('/');
                }}
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
                  background: 'none',
                  fontSize: '16px',
                  fontFamily: 'Outfit',
                  color: '#111827',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Marketplace
              </button>
              
              <button
                onClick={() => {
                  setShowAvatarDropdown(false);
                  navigate('/dashboard');
                }}
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
                  background: 'none',
                  fontSize: '16px',
                  fontFamily: 'Outfit',
                  color: '#111827',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => {
                  setShowAvatarDropdown(false);
                  navigate('/settings');
                }}
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
                  background: 'none',
                  fontSize: '16px',
                  fontFamily: 'Outfit',
                  color: '#111827',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Setting
              </button>
              
              <button
                onClick={() => {
                  setShowAvatarDropdown(false);
                  authService.logout();
                  navigate('/');
                }}
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
                  background: 'none',
                  fontSize: '16px',
                  fontFamily: 'Outfit',
                  color: '#111827',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--slate-100, #F1F5F9)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="main-header">
          {/* First row: Back link */}
          <div style={{ marginBottom: '24px' }}>
            <Link 
              to="/developer-portal/workspace" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--black, #000)',
                textDecoration: 'none',
                fontSize: '24px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '140%',
                fontFamily: 'Outfit',
                padding: '4px'
              }}
            >
              <ArrowLeft size={16} />
              Manage plugin
            </Link>
          </div>
          
          {/* Second row: Title aligned with avatar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{
              color: 'var(--black, #000)',
              fontFamily: 'Outfit',
              fontSize: '24px',
              fontWeight: 400,
              lineHeight: '140%',
              margin: 0
            }}>
              Upload a new plugin
            </h1>
            
            {/* Spacer to maintain alignment - avatar is positioned absolutely */}
            <div style={{ width: '48px', height: '48px' }}></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
          {/* Workspace Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Workspace <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              color: '#374151',
              fontSize: '14px',
              fontFamily: 'Outfit'
            }}>
              {formData.workspace}
            </div>
            <p style={{
              color: '#6B7280',
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
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Plugin Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter plugin name"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#FFFFFF',
                border: `1px solid ${errors.name ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                color: '#000000',
                fontSize: '14px',
                fontFamily: 'Outfit',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.name && (
              <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Plugin Image */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Plugin Image <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                color: '#374151',
                fontSize: '14px',
                fontFamily: 'Outfit',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              Choose File
              <span style={{ marginLeft: '12px', color: '#6B7280' }}>
                {formData.images.length === 0 ? 'No file chosen' : `${formData.images.length} files selected`}
              </span>
            </button>
            <p style={{
              color: '#6B7280',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 8px 0'
            }}>
              Upload at least one plugin screenshot or cover image (Recommended: 1280×800 pixels)
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {formData.images.map((image, index) => (
                <div key={index} style={{
                  position: 'relative',
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Add more placeholders to show total of 4 slots */}
              {Array.from({ length: Math.max(0, 4 - formData.images.length) }).map((_, index) => (
                <div key={`placeholder-${index}`} style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {index === 0 && formData.images.length === 0 && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                  )}
                  {index === Math.max(0, 4 - formData.images.length) - 1 && formData.images.length < 4 && (
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
            {errors.images && (
              <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.images}
              </p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
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
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '14px',
                fontFamily: 'Outfit',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              color: '#6B7280',
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
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Plugin File <span style={{ color: '#EF4444' }}>*</span>
            </label>
            
            <div style={{ 
              display: 'flex', 
              borderRadius: '6px',
              background: '#EFF6FF',
              padding: '4px',
              marginBottom: '16px',
              width: 'fit-content'
            }}>
              <button
                type="button"
                onClick={() => setUploadMethod('local')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: uploadMethod === 'local' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: uploadMethod === 'local' ? '#374151' : '#6B7280',
                  fontSize: '14px',
                  fontFamily: 'Outfit',
                  cursor: 'pointer',
                  fontWeight: uploadMethod === 'local' ? 500 : 400,
                  boxShadow: uploadMethod === 'local' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Upload from local
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('github')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: uploadMethod === 'github' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: uploadMethod === 'github' ? '#374151' : '#6B7280',
                  fontSize: '14px',
                  fontFamily: 'Outfit',
                  cursor: 'pointer',
                  fontWeight: uploadMethod === 'github' ? 500 : 400,
                  boxShadow: uploadMethod === 'github' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                GitHub repository
              </button>
            </div>

            {uploadMethod === 'local' ? (
              <>
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragActive ? '#3B82F6' : '#D1D5DB'}`,
                    borderRadius: '8px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    backgroundColor: dragActive ? '#EFF6FF' : '#FAFAFA',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Upload size={24} color="#6B7280" style={{ marginBottom: '12px' }} />
                  <p style={{
                    color: '#374151',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    margin: '0 0 4px 0',
                    fontWeight: 500
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
                  accept=".zip,.js"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required={uploadMethod === 'local'}
                />
                {formData.file && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#6B7280">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <span style={{ color: '#374151', fontSize: '14px', fontFamily: 'Outfit' }}>
                      {formData.file.name}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repository"
                  required={uploadMethod === 'github'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${errors.githubUrl ? '#EF4444' : '#D1D5DB'}`,
                    borderRadius: '8px',
                    color: '#000000',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{
                  color: '#6B7280',
                  fontSize: '12px',
                  fontFamily: 'Outfit',
                  margin: '4px 0 0 0'
                }}>
                  Note: Repository must be public and contain plugin files in the main branch.
                </p>
              </div>
            )}
            {(errors.file || errors.githubUrl) && (
              <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.file || errors.githubUrl}
              </p>
            )}
          </div>

          {/* Version */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
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
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '14px',
                fontFamily: 'Outfit',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              color: '#6B7280',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 0 0'
            }}>
              Version numbers are automatically loaded from the plugin's YML file — see{' '}
              <a href="https://visualizer.developer.reearth.io" style={{ color: '#0089D4', textDecoration: 'none' }}>documentation</a> for details.
            </p>
          </div>

          {/* Release Notes */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Release Notes
            </label>
            <textarea
              name="releaseNotes"
              value={formData.releaseNotes}
              onChange={handleInputChange}
              placeholder="Type your message"
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '14px',
                fontFamily: 'Outfit',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              color: '#6B7280',
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
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Version Labels
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {['Bug Fix', 'New Feature', 'Doc Update', 'UI Update'].map((label) => {
                const isSelected = formData.versionLabels.includes(label);
                const getColor = (label) => {
                  switch(label) {
                    case 'Bug Fix': return { bg: '#FEE2E2', text: '#DC2626', bgSelected: '#DC2626' };
                    case 'New Feature': return { bg: '#D1FAE5', text: '#059669', bgSelected: '#059669' };
                    case 'Doc Update': return { bg: '#DBEAFE', text: '#2563EB', bgSelected: '#2563EB' };
                    case 'UI Update': return { bg: '#F3E8FF', text: '#8B5CF6', bgSelected: '#8B5CF6' };
                    default: return { bg: '#F3F4F6', text: '#374151', bgSelected: '#374151' };
                  }
                };
                const colors = getColor(label);
                
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleVersionLabel(label)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: isSelected ? colors.bgSelected : colors.bg,
                      color: isSelected ? 'white' : colors.text,
                      border: isSelected ? `1px solid ${colors.bgSelected}` : `1px solid transparent`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'Outfit',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: isSelected ? 500 : 400,
                      opacity: isSelected ? 1 : 0.8
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p style={{
              color: '#6B7280',
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
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Function Tag
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {formData.functionTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    color: '#374151',
                    fontSize: '12px',
                    fontFamily: 'Outfit'
                  }}
                >
                  {tag}
                  <span 
                    onClick={() => removeFunctionTag(tag)}
                    style={{ marginLeft: '4px', cursor: 'pointer', color: '#6B7280' }}
                  >
                    ×
                  </span>
                </span>
              ))}
              <input
                ref={functionTagInputRef}
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFunctionTag();
                  }
                }}
                placeholder="Add tag..."
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px dashed #D1D5DB',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '12px',
                  fontFamily: 'Outfit',
                  outline: 'none',
                  width: '80px',
                  minWidth: '80px'
                }}
              />
            </div>
            <p style={{
              color: '#6B7280',
              fontSize: '12px',
              fontFamily: 'Outfit',
              margin: '4px 0 0 0'
            }}>
              Add function tags to help users discover your plugin. Press Enter to add a tag.
            </p>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: 'flex',
                padding: '12px 20px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '6px',
                background: isLoading ? '#9CA3AF' : '#116993',
                color: 'white',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Outfit',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading && (
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}>
                </div>
              )}
              {isLoading ? 'Submitting...' : 'Submit Plugin'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/developer-portal/workspace')}
              style={{
                display: 'flex',
                width: '96px',
                height: '46px',
                padding: '8px 16px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                background: '#FFF',
                color: '#374151',
                fontSize: '14px',
                fontFamily: 'Outfit',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Notification */}
      {showNotification && notificationData && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#2D3748',
          color: 'white',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          maxWidth: '300px',
          fontFamily: 'Outfit'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#48BB78',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <CheckCircle size={12} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                New submission
              </div>
              <div style={{ fontSize: '13px', color: '#E2E8F0', marginBottom: '8px' }}>
                {notificationData.pluginName} submitted successfully
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleNotificationView}
                  style={{
                    background: 'transparent',
                    border: '1px solid #4A5568',
                    color: '#E2E8F0',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  View
                </button>
                <button
                  onClick={handleNotificationClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#A0AEC0',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading animation styles */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default DeveloperPluginUpload;