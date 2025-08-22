import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, ChevronDown, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import DashboardNav from './DashboardNav';
import { authService } from '../services/authService';
import '../DeveloperPortal.css';

const PluginUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detect if we're in Developer Portal context
  const isDeveloperPortal = location.pathname.startsWith('/developer-portal');

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
    workspace: isDeveloperPortal ? workspaces[0]?.name || 'Eukarya Inc.' : '',
    name: '',
    images: [],
    description: '',
    file: isDeveloperPortal ? { name: 'reearth_visualizer_plugin_basemap_swicher-1.0.0.zip' } : null,
    githubUrl: '',
    version: 'V 0.01',
    releaseNotes: '',
    versionLabels: [],
    functionTags: []
  });
  const [uploadMethod, setUploadMethod] = useState('local'); // 'local' or 'github'
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedPluginId, setUploadedPluginId] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [selectedWorkspace, setSelectedWorkspace] = useState('workspace-1');

  const workspaceGroups = {
    personal: {
      label: 'Personal workspace',
      options: [
        'Default personal workspace',
        'My playground'
      ]
    },
    team: {
      label: 'Team workspace',
      options: [
        'UC-12地区防災計画',
        '株式会社福山コンサルタント',
        'Plugin Team'
      ]
    }
  };

  // const versionLabelOptions = [
  //   { id: 'bug-fix', label: 'Bug Fix', color: 'bg-red-100 text-red-800' },
  //   { id: 'new-feature', label: 'New Feature', color: 'bg-green-100 text-green-800' },
  //   { id: 'doc-update', label: 'Doc Update', color: 'bg-blue-100 text-blue-800' },
  //   { id: 'ui-update', label: 'UI Update', color: 'bg-pink-100 text-pink-800' }
  // ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setWorkspaceOpen(false);
      }
      if (showAvatarDropdown && !event.target.closest('.avatar-dropdown-container')) {
        setShowAvatarDropdown(false);
      }
      if (showWorkspaceDropdown && !event.target.closest('.workspace-dropdown-container')) {
        setShowWorkspaceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAvatarDropdown, showWorkspaceDropdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleWorkspaceSelect = (workspace) => {
    setFormData(prev => ({
      ...prev,
      workspace
    }));
    setWorkspaceOpen(false);
    setShowWorkspaceDropdown(false);
    if (errors.workspace) {
      setErrors(prev => ({
        ...prev,
        workspace: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleVersionLabelToggle = (labelId) => {
    setFormData(prev => ({
      ...prev,
      versionLabels: prev.versionLabels.includes(labelId)
        ? prev.versionLabels.filter(id => id !== labelId)
        : [...prev.versionLabels, labelId]
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.functionTags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        functionTags: [...prev.functionTags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      functionTags: prev.functionTags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Developer Portal workspace handlers
  const handleWorkspaceClick = () => {
    setShowWorkspaceDropdown(!showWorkspaceDropdown);
  };

  const handleWorkspaceChange = (workspaceId) => {
    setSelectedWorkspace(workspaceId);
    const selectedWorkspaceData = workspaces.find(w => w.id === workspaceId);
    setFormData(prev => ({
      ...prev,
      workspace: selectedWorkspaceData?.name || ''
    }));
    setShowWorkspaceDropdown(false);
  };

  const handleLogoClick = () => {
    navigate('/developer-portal');
  };

  const handleNotificationView = () => {
    if (notificationData?.pluginId) {
      // Navigate to plugin detail page
      navigate(`/plugin/${notificationData.pluginId}`);
      setShowNotification(false);
      setNotificationData(null);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    setNotificationData(null);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setFormData(prev => ({
          ...prev,
          file
        }));
        if (errors.file) {
          setErrors(prev => ({
            ...prev,
            file: ''
          }));
        }
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file
    }));
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.workspace) {
      newErrors.workspace = 'Workspace is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Plugin name is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one plugin image is required';
    }
    
    // Validate file or GitHub URL based on upload method
    if (uploadMethod === 'local') {
      if (!formData.file) {
        newErrors.file = 'Plugin file is required';
      }
    } else if (uploadMethod === 'github') {
      if (!formData.githubUrl.trim()) {
        newErrors.githubUrl = 'GitHub repository URL is required';
      } else {
        // Basic GitHub URL validation
        const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w\-.]+\/[\w\-.]+\/?$/;
        if (!githubUrlPattern.test(formData.githubUrl.trim())) {
          newErrors.githubUrl = 'Please enter a valid GitHub repository URL (e.g., github.com/username/plugin-name)';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    const hasFileOrGithub = uploadMethod === 'local' 
      ? formData.file 
      : formData.githubUrl.trim();
    
    // For Developer Portal, images are optional in validation (but still required for submission)
    if (isDeveloperPortal) {
      return formData.workspace && formData.name.trim() && hasFileOrGithub;
    }
    
    return formData.workspace && formData.name.trim() && formData.images.length > 0 && hasFileOrGithub;
  };

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
      workspace: isDeveloperPortal ? 'Personal workspace' : '',
      name: '',
      images: [],
      description: '',
      file: isDeveloperPortal ? { name: 'reearth_visualizer_plugin_basemap_swicher-1.0.0.zip' } : null,
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
    if (isDeveloperPortal) {
      navigate('/developer-portal');
    } else {
      navigate(`/plugin/${uploadedPluginId}`);
    }
  };


  // Success page component
  const renderSuccessPage = () => {
    if (isDeveloperPortal) {
      return (
        <div className="dev-portal-container">
          {/* Sidebar */}
          <div className="dev-portal-sidebar">
            <div className="sidebar-header">
              <div 
                className="logo"
                onClick={handleLogoClick}
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
                      background: 'white',
                      border: '1px solid #E5E5E5',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {workspaces.map((workspace) => (
                      <button
                        key={workspace.id}
                        onClick={() => handleWorkspaceChange(workspace.id)}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          color: '#111827',
                          fontSize: '14px',
                          fontFamily: 'Outfit',
                          background: selectedWorkspace === workspace.id ? '#F3F4F6' : 'transparent',
                          border: 'none',
                          cursor: 'pointer'
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
                <Link to="/developer-portal/new" className="nav-item active">Submit plugin</Link>
                <Link to="/developer-portal" className="nav-item">Manage plugin</Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="dev-portal-main" style={{ background: '#FFFFFF' }}>
            <div className="main-header">
              <h1 className="page-title" style={{ color: '#000000', fontSize: '32px' }}>Upload Successful!</h1>
            </div>
            
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              maxWidth: '600px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <CheckCircle size={64} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <p style={{
                color: '#374151',
                fontSize: '16px',
                fontFamily: 'Outfit',
                marginBottom: '24px'
              }}>
                Your plugin has been uploaded successfully with ID: <code style={{
                  background: '#F3F4F6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: '#1F2937',
                  fontSize: '14px',
                  border: '1px solid #D1D5DB'
                }}>{uploadedPluginId}</code>
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={handleViewDetails}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    cursor: 'pointer'
                  }}
                >
                  Go to Plugin List
                </button>
                <button
                  onClick={handleUploadAnother}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    cursor: 'pointer'
                  }}
                >
                  Upload Another
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Dashboard success page (existing)
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
        {/* Header */}
        <DashboardNav />

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Upload Successful!</h1>
              <p className="text-gray-600 mb-6">
                Your plugin has been uploaded successfully with ID: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{uploadedPluginId}</code>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleViewDetails}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="View plugin details"
                >
                  View Details
                </button>
                <button
                  onClick={handleUploadAnother}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Upload another plugin"
                >
                  Upload Another
                </button>
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

  if (isSuccess) {
    return renderSuccessPage();
  }

  // Main form render based on context
  if (isDeveloperPortal) {
    return (
      <div className="dev-portal-container">
        {/* Sidebar */}
        <div className="dev-portal-sidebar">
          <div className="sidebar-header">
            <div 
              className="logo"
              onClick={handleLogoClick}
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
                    background: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => handleWorkspaceChange(workspace.id)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        color: '#111827',
                        fontSize: '14px',
                        fontFamily: 'Outfit',
                        background: selectedWorkspace === workspace.id ? '#F3F4F6' : 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedWorkspace !== workspace.id) {
                          e.target.style.background = '#F9FAFB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedWorkspace !== workspace.id) {
                          e.target.style.background = 'transparent';
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
              <Link to="/developer-portal/new" className="nav-item active">Submit plugin</Link>
              <Link to="/developer-portal" className="nav-item">Manage plugin</Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dev-portal-main" style={{ background: '#FFFFFF' }}>
          {/* Top bar with avatar */}
          <div 
            className="avatar-dropdown-container"
            style={{
              position: 'absolute',
              top: '16px',
              right: '40px',
              zIndex: 1000
            }}
          >
            <img 
              src="/Image/Avatar.png" 
              alt="User" 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                cursor: 'pointer',
                objectFit: 'cover'
              }}
              onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
            />
            {showAvatarDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                background: 'white',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                minWidth: '160px'
              }}>
                <Link
                  to="/"
                  style={{
                    display: 'block',
                    padding: '6px 8px 6px 32px',
                    color: '#0A0A0A',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    textDecoration: 'none',
                    borderBottom: '1px solid #F3F4F6'
                  }}
                >
                  Marketplace
                </Link>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'block',
                    padding: '6px 8px 6px 32px',
                    color: '#0A0A0A',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    textDecoration: 'none',
                    borderBottom: '1px solid #F3F4F6'
                  }}
                >
                  Dashboard
                </Link>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  href="#"
                  style={{
                    display: 'block',
                    padding: '6px 8px 6px 32px',
                    color: '#0A0A0A',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    textDecoration: 'none',
                    borderBottom: '1px solid #F3F4F6'
                  }}
                >
                  Setting
                </a>
                <button
                  onClick={() => authService.logout()}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 8px 6px 32px',
                    color: '#0A0A0A',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="main-header">
            <h1 className="page-title" style={{ color: '#000000' }}>Upload a new plugin</h1>
          </div>
          
          {/* Developer Portal Form */}
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
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '14px',
                fontFamily: 'Outfit'
              }}>
                {formData.workspace || 'Select a workspace'}
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
              {errors.workspace && (
                <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.workspace}
                </p>
              )}
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
              <div style={{
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
              onClick={() => imageInputRef.current?.click()}
              >
                Choose File
                <span style={{ marginLeft: '12px', color: '#6B7280' }}>
                  {formData.images.length > 0 ? `${formData.images.length} file(s) chosen` : 'No file chosen'}
                </span>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={isLoading}
              />
              <p style={{
                color: '#6B7280',
                fontSize: '12px',
                fontFamily: 'Outfit',
                margin: '4px 0 8px 0'
              }}>
                Upload at least one plugin screenshot or cover image (Recommended: 1280×800 pixels)
              </p>
              
              {/* Image Preview Grid */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {formData.images.map((image, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#404040',
                    border: '1px solid #404040',
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
                    {index === 3 - formData.images.length && (
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

            {/* Plugin File Upload */}
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
                    fontWeight: uploadMethod === 'local' ? '500' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: uploadMethod === 'local' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
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
                    fontWeight: uploadMethod === 'github' ? '500' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: uploadMethod === 'github' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                  }}
                >
                  GitHub
                </button>
              </div>

              {uploadMethod === 'local' ? (
                <>
                  <div 
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragActive ? '#2563EB' : errors.file ? '#EF4444' : '#D1D5DB'}`,
                      borderRadius: '8px',
                      padding: '48px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginBottom: '12px',
                      backgroundColor: dragActive ? 'rgba(37, 99, 235, 0.05)' : '#FAFAFA'
                    }}
                  >
                    <Upload size={24} color="#6B7280" style={{ marginBottom: '12px' }} />
                    <p style={{
                      color: '#374151',
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
                    required={uploadMethod === 'local'}
                  />
                  {formData.file && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '12px'
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
                <a href="#" style={{ color: '#2563EB', textDecoration: 'none' }}>documentation</a> for details.
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
                {['Bug Fix', 'New Feature', 'Doc Update', 'UI Update'].map((label, index) => {
                  const isSelected = formData.versionLabels.includes(label.toLowerCase().replace(' ', '-'));
                  const colors = ['#EF4444', '#10B981', '#3B82F6', '#8B5CF6'];
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleVersionLabelToggle(label.toLowerCase().replace(' ', '-'))}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: isSelected ? colors[index] : '#FFFFFF',
                        color: isSelected ? 'white' : '#374151',
                        border: `1px solid ${isSelected ? colors[index] : '#D1D5DB'}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'Outfit',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {label}
                      {isSelected && <span>×</span>}
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
                {/* Default tags */}
                {['3D', 'Data', 'Image'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      backgroundColor: '#F3F4F6',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      color: '#374151',
                      fontSize: '12px',
                      fontFamily: 'Outfit',
                      gap: '4px'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6B7280',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {/* Custom tags */}
                {formData.functionTags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      backgroundColor: '#F3F4F6',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      color: '#374151',
                      fontSize: '12px',
                      fontFamily: 'Outfit',
                      gap: '4px'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6B7280',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {/* Add button */}
                <button
                  type="button"
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px dashed #D1D5DB',
                    borderRadius: '4px',
                    color: '#6B7280',
                    fontSize: '12px',
                    fontFamily: 'Outfit',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
              <p style={{
                color: '#6B7280',
                fontSize: '12px',
                fontFamily: 'Outfit',
                margin: '4px 0 0 0'
              }}>
                Add function tags to help users discover your plugin. Separate multiple tags with commas.
              </p>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isLoading ? '#D1D5DB' : '#2563EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Outfit',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Submitting...' : 'Submit Plugin'}
              </button>
            </div>
          </form>
        </div>

        {/* Notification */}
        {showNotification && notificationData && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#2D3748',
            color: 'white',
            borderRadius: '8px',
            padding: '16px 20px',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '400px',
            zIndex: 1000,
            animation: 'slideInFromRight 0.3s ease-out'
          }}>
            {/* Success Icon */}
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#48BB78',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Outfit',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '2px'
              }}>
                New submission
              </div>
              <div style={{
                fontFamily: 'Outfit',
                fontSize: '13px',
                opacity: 0.9
              }}>
                {notificationData.pluginName} submitted successfully
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handleNotificationView}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontFamily: 'Outfit',
                  fontSize: '13px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                View
              </button>
              <button
                onClick={handleNotificationClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px',
                  marginLeft: '4px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard layout (existing)
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
      {/* Header */}
      <DashboardNav />

      {/* Main Content */}
      <main className="py-8">
      <div 
        style={{
          display: 'flex',
          width: '1280px',
          maxWidth: '1280px',
          padding: 'var(--spacing-pc-6, 24px)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 'var(--spacing-pc-6, 24px)',
          borderRadius: 'var(--radius-pc-md, 6px)',
          background: 'var(--background-white, #FFF)',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Breadcrumb */}
        <nav>
          <div className="text-sm">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Dashboard
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Submit plugin</span>
          </div>
        </nav>

        {/* Page Title */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Upload a new plugin</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Workspace Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setWorkspaceOpen(!workspaceOpen)}
                  className={`w-full px-4 py-3 text-left border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.workspace ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <span className={formData.workspace ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.workspace || 'Select a workspace'}
                  </span>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </button>
                {workspaceOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden pb-2">
                    {Object.entries(workspaceGroups).map(([groupKey, group], groupIndex) => (
                      <div key={groupKey}>
                        {/* Group Header */}
                        <div 
                          style={{
                            color: 'var(--text-weak, #404040)',
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '500',
                            lineHeight: '140%',
                            padding: '12px 16px',
                            background: 'transparent'
                          }}
                        >
                          {group.label}
                        </div>
                        
                        {/* Group Options */}
                        {group.options.map((option, optionIndex) => {
                          // Check if option contains Japanese characters
                          const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(option);
                          
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleWorkspaceSelect(option)}
                              className="w-full text-left focus:outline-none transition-colors"
                              style={{
                                color: 'var(--text-default, #0A0A0A)',
                                fontFamily: isJapanese ? '"Noto Sans JP"' : 'Outfit, sans-serif',
                                fontSize: '14px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '140%',
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                background: formData.workspace === option ? '#EEF3F7' : 'transparent'
                              }}
                              onMouseEnter={(e) => {
                                if (formData.workspace !== option) {
                                  e.target.style.background = 'rgba(10, 10, 10, 0.04)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (formData.workspace !== option) {
                                  e.target.style.background = 'transparent';
                                }
                              }}
                            >
                              {option}
                            </button>
                          );
                        })}
                        
                        {/* Divider between groups */}
                        {groupIndex < Object.keys(workspaceGroups).length - 1 && (
                          <div 
                            style={{
                              height: '1px',
                              background: 'rgba(10, 10, 10, 0.1)',
                              margin: '8px 0'
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Uploaded plugin will appear under this workspace and be listed as its creator.
              </p>
              {errors.workspace && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.workspace}
                </p>
              )}
            </div>

            {/* Plugin Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Plugin Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter plugin name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Plugin Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plugin Image <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {/* File Upload Button */}
                <div className="flex items-center">
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Choose File
                  </button>
                  <span className="ml-3 text-sm text-gray-500">
                    {formData.images.length > 0 ? `${formData.images.length} file(s) chosen` : 'No file chosen'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Upload at least one plugin screenshot or cover image (Recommended: 1280×800 pixels)
                </p>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="flex gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.images}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your message"
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide a detailed description of what your plugin does and its key features.
              </p>
            </div>

            {/* Plugin File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plugin File <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {/* Upload Method Selection */}
                <div style={{ 
                  display: 'flex', 
                  borderRadius: '6px',
                  background: '#EFF6FF',
                  padding: '4px',
                  width: 'fit-content'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMethod('local');
                      setFormData(prev => ({ ...prev, githubUrl: '' }));
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: uploadMethod === 'local' ? '#FFFFFF' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: uploadMethod === 'local' ? '#374151' : '#6B7280',
                      fontSize: '14px',
                      fontFamily: 'Outfit',
                      fontWeight: uploadMethod === 'local' ? '500' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: uploadMethod === 'local' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                    }}
                  >
                    Upload from local
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMethod('github');
                      setFormData(prev => ({ ...prev, file: null }));
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: uploadMethod === 'github' ? '#FFFFFF' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: uploadMethod === 'github' ? '#374151' : '#6B7280',
                      fontSize: '14px',
                      fontFamily: 'Outfit',
                      fontWeight: uploadMethod === 'github' ? '500' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: uploadMethod === 'github' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                    }}
                  >
                    GitHub
                  </button>
                </div>

                {uploadMethod === 'local' ? (
                  <>
                    {/* Drag and Drop Zone */}
                    <div 
                      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                        dragActive 
                          ? 'border-blue-400 bg-blue-50' 
                          : errors.file 
                            ? 'border-red-300' 
                            : 'border-blue-300'
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".zip"
                        disabled={isLoading}
                      />
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 border-2 border-gray-400 rounded flex items-center justify-center">
                          <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-base text-gray-600 mb-1">
                        Click or drag file to this area to upload
                      </p>
                      <p className="text-sm text-gray-500">
                        ZIP file up to 50MB
                      </p>
                    </div>

                    {/* Selected File Display */}
                    {formData.file && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Upload className="h-4 w-4 mr-2" />
                        <span>{formData.file.name}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* GitHub Repository Input */}
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="github.com/username/plugin-name"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.githubUrl ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                      
                      {/* GitHub Notes */}
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-800 font-medium mb-1">📌 Notes:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Set your repository to public</li>
                          <li>• Only the main branch is used</li>
                        </ul>
                      </div>
                    </div>

                    {/* GitHub URL Display */}
                    {formData.githubUrl && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0a10 10 0 00-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.13-1.1-1.43-1.1-1.43-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0010 0z" clipRule="evenodd" />
                        </svg>
                        <span>{formData.githubUrl}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              {(errors.file || errors.githubUrl) && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.file || errors.githubUrl}
                </p>
              )}
            </div>

            {/* Version */}
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
                Version
              </label>
              <input
                type="text"
                id="version"
                name="version"
                value={formData.version}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                disabled
                readOnly
              />
              <p className="mt-1 text-sm text-gray-500">
                Version numbers are automatically loaded from the plugin's YAML file — see <span className="text-blue-600 underline cursor-pointer">documentation</span> for details.
              </p>
            </div>

            {/* Release Notes */}
            <div>
              <label htmlFor="releaseNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Release Notes
              </label>
              <textarea
                id="releaseNotes"
                name="releaseNotes"
                value={formData.releaseNotes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your message"
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Describe what changed in this version for users
              </p>
            </div>

            {/* Version Labels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version Labels
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleVersionLabelToggle('bug-fix')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    formData.versionLabels.includes('bug-fix')
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Bug Fix ×
                </button>
                <button
                  type="button"
                  onClick={() => handleVersionLabelToggle('new-feature')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    formData.versionLabels.includes('new-feature')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  New Feature
                </button>
                <button
                  type="button"
                  onClick={() => handleVersionLabelToggle('doc-update')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    formData.versionLabels.includes('doc-update')
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Doc Update
                </button>
                <button
                  type="button"
                  onClick={() => handleVersionLabelToggle('ui-update')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    formData.versionLabels.includes('ui-update')
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  UI Update
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Choose labels to describe this update (e.g., bug fix, new feature).
              </p>
            </div>

            {/* Function Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Function Tag
              </label>
              <div className="space-y-3">
                {/* Existing Tags */}
                {formData.functionTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                      3D ×
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                      Data ×
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                      Image ×
                    </span>
                    {formData.functionTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder=""
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Add function tags to help users discover your plugin. Separate multiple tags with commas.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3 px-6 rounded-md font-medium flex items-center justify-center"
                style={{ 
                  backgroundColor: isLoading ? '#9CA3AF' : '#3B82F6',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Plugin'
                )}
              </button>
            </div>
        </form>
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

      {/* Notification */}
      {showNotification && notificationData && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#2D3748',
          color: 'white',
          borderRadius: '8px',
          padding: '16px 20px',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '400px',
          zIndex: 1000,
          animation: 'slideInFromRight 0.3s ease-out'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#48BB78',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '2px'
            }}>
              New submission
            </div>
            <div style={{
              fontFamily: 'Outfit',
              fontSize: '13px',
              opacity: 0.9
            }}>
              {notificationData.pluginName} submitted successfully
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handleNotificationView}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontFamily: 'Outfit',
                fontSize: '13px',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: '0'
              }}
            >
              View
            </button>
            <button
              onClick={handleNotificationClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
                marginLeft: '4px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginUpload;