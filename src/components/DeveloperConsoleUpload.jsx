import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { PluginService } from '../services/pluginService';
import DeveloperConsoleSidebar from './DeveloperConsoleSidebar';
import '../DeveloperConsole.css';

const DeveloperConsoleUpload = () => {
  const navigate = useNavigate();

  // Workspace data - consistent with Developer Console
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
    file: null, // Changed from mock object to null
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
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Submission failed — please complete all required fields');
  const [initError, setInitError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const functionTagInputRef = useRef(null);
  const avatarDropdownRef = useRef(null);
  
  // Field refs for validation and scroll-to functionality
  const fieldRefs = useRef({
    workspace: null,
    name: null,
    images: null,
    file: null,
    githubUrl: null
  });

  // Initialize component and check authentication
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check authentication
        const isAuthenticated = authService.isAuthenticated();
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        // Ensure form data is properly initialized
        if (!formData.workspace) {
          setFormData(prev => ({
            ...prev,
            workspace: workspaces[0]?.name || 'Eukarya Inc.'
          }));
        }

        setIsInitialized(true);
        console.log('DeveloperPluginUpload initialized successfully');
      } catch (error) {
        console.error('Initialization error:', error);
        setInitError(`Failed to initialize page: ${error.message}`);
      }
    };

    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    navigate('/developer-console/workspace');
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
    console.log(`handleInputChange: field=${name}, value="${value}"`);
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('Updated formData:', newData);
      return newData;
    });
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
    console.log('handleImageChange: Processing', files.length, 'files');
    
    files.forEach((file, index) => {
      console.log(`Processing file ${index + 1}:`, file.name, file.size, 'bytes');
      
      // Check file size (limit to 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        console.error('File too large:', file.name, file.size);
        alert(`Image "${file.name}" is too large. Please use images under 5MB.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        console.log(`Image ${index + 1} loaded, data URL length:`, dataUrl.length);
        
        setFormData(prev => {
          const newImages = [...prev.images, dataUrl];
          console.log('Updated images array length:', newImages.length);
          return {
            ...prev,
            images: newImages
          };
        });
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', file.name, error);
        alert(`Error reading image "${file.name}". Please try again.`);
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
    let firstErrorField = null;

    console.log('validateForm called with formData:', formData);
    console.log('formData.name value:', `"${formData.name}"`);
    console.log('typeof formData.name:', typeof formData.name);
    
    // Handle case where formData.name might be undefined or null
    const nameValue = formData.name || '';
    console.log('nameValue after null check:', `"${nameValue}"`);
    console.log('nameValue.trim():', `"${nameValue.trim()}"`);
    console.log('!nameValue.trim():', !nameValue.trim());

    // Field validation order (determines scroll-to priority)
    const fieldValidations = [
      {
        key: 'name',
        condition: !nameValue.trim(),
        message: 'Plugin name is required'
      }
    ];

    console.log('fieldValidations:', fieldValidations);

    // Check each validation and record first error
    fieldValidations.forEach(({ key, condition, message }) => {
      console.log(`Checking field ${key}: condition=${condition}, message=${message}`);
      if (condition) {
        newErrors[key] = message;
        if (!firstErrorField) {
          firstErrorField = key;
        }
      }
    });

    console.log('newErrors:', newErrors);
    console.log('validation result:', {
      isValid: Object.keys(newErrors).length === 0,
      firstErrorField,
      errors: newErrors
    });

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      firstErrorField,
      errors: newErrors
    };
  };

  // Scroll to first error field with shake animation
  const scrollToErrorField = (fieldKey) => {
    const fieldElement = fieldRefs.current[fieldKey];
    if (fieldElement) {
      // Scroll to field with offset for better visibility
      const elementTop = fieldElement.offsetTop;
      const offset = 120; // Account for header and spacing
      
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });

      // Add shake animation and error highlighting
      fieldElement.classList.add('shake-animation', 'field-error');
      
      // Remove animations after completion but keep error styling briefly
      setTimeout(() => {
        if (fieldElement) {
          fieldElement.classList.remove('shake-animation');
        }
      }, 600);

      // Remove error highlighting after longer delay
      setTimeout(() => {
        if (fieldElement) {
          fieldElement.classList.remove('field-error');
        }
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submit button clicked - handleSubmit called');
    console.log('Current form data:', formData);
    console.log('Upload method:', uploadMethod);

    // Reset error message
    setErrorMessage('Submission failed — please complete all required fields');

    try {
      // Run validation
      const validation = validateForm();
      console.log('Validation result:', validation);
      
      if (!validation.isValid) {
        console.log('Validation failed, showing error notification');
        console.log('DEBUGGING: Current form data when validation failed:', formData);
        console.log('DEBUGGING: Validation errors:', validation.errors);
        
        // TEMPORARY: Allow submission even if validation fails for debugging
        if (formData.name && formData.name.trim()) {
          console.log('DEBUGGING: Name exists, bypassing validation failure');
          // Skip the validation failure and continue with submission
        } else {
          console.log('DEBUGGING: No name provided, showing error');
          
          // Show error notification with validation error message
          setErrorMessage('Submission failed — please complete all required fields');
          setShowErrorNotification(true);
          
          // Auto-hide error notification after 5 seconds
          setTimeout(() => {
            setShowErrorNotification(false);
          }, 5000);

          // Scroll to first error field with shake animation
          if (validation.firstErrorField) {
            console.log('Scrolling to error field:', validation.firstErrorField);
            scrollToErrorField(validation.firstErrorField);
          }
          
          return;
        }
      }
    } catch (error) {
      console.error('Error in validation:', error);
      setErrorMessage('Validation error — please try again');
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 5000);
      return;
    }

    setIsLoading(true);

    try {
      // Get current user data
      const currentUser = authService.getUserData();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Prepare plugin data for database insertion
      console.log('Preparing plugin submission data...');
      console.log('Form data images:', formData.images?.length || 0, 'images');
      
      // Calculate total size of images
      let totalImageSize = 0;
      if (formData.images && formData.images.length > 0) {
        totalImageSize = formData.images.reduce((total, img) => total + img.length, 0);
        console.log('Total image data size:', totalImageSize, 'characters');
      }
      
      // If images are too large, skip them with warning
      let imagesToSubmit = formData.images || [];
      if (totalImageSize > 1.5 * 1024 * 1024) { // 1.5MB limit
        console.warn('Images too large, submitting without images to avoid storage issues');
        imagesToSubmit = [];
        alert('Images are too large and will be skipped. Plugin will be submitted without images. Please use smaller images (under 1MB each) in future submissions.');
      }
      
      const pluginSubmissionData = {
        title: formData.name.trim(),
        workspaceId: selectedWorkspace,
        ownerUserId: currentUser.email || 'anonymous',
        readme: formData.description.trim() || `# ${formData.name.trim()}\n\nPlugin description coming soon...`,
        description: formData.description.trim() || 'Plugin description coming soon...',
        thumbnailUrl: imagesToSubmit.length > 0 ? imagesToSubmit[0] : null,
        images: imagesToSubmit,
        version: formData.version || '1.0.0',
        tags: formData.functionTags || [],
        functionTags: formData.functionTags || [],
        versionLabels: formData.versionLabels || [],
        githubUrl: uploadMethod === 'github' && formData.githubUrl.trim() ? formData.githubUrl.trim() : null,
        fileInfo: uploadMethod === 'local' && formData.file ? {
          name: formData.file?.name,
          size: formData.file?.size,
          type: formData.file?.type
        } : null
      };

      // Submit plugin to database
      console.log('Calling PluginService.submitPlugin with data:', pluginSubmissionData);
      const result = await PluginService.submitPlugin(pluginSubmissionData);
      console.log('PluginService returned:', result);
      
      if (result && result.success) {
        console.log('Success! Plugin submitted successfully');
        
        // Show success notification with plugin details
        setNotificationData({
          pluginName: result.plugin.title,
          pluginId: result.pluginId,
          marketplaceSlug: result.marketplaceSlug
        });
        setShowNotification(true);

        // Auto-hide success notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
          setNotificationData(null);
        }, 5000);

        setUploadedPluginId(result.pluginId);
        setIsSuccess(true);

        // Redirect to developer portal manage page after success
        setTimeout(() => {
          navigate('/developer-console');
        }, 2000);
      } else {
        console.error('Plugin submission failed: Invalid result', result);
        throw new Error('Plugin submission failed - invalid response');
      }
    } catch (error) {
      console.error('Plugin submission error:', error);
      
      // Set specific error message based on error type
      let errorMessage = 'Submission failed — please try again';
      if (error.message.includes('Missing required field')) {
        errorMessage = 'Submission failed — please complete all required fields';
        const fieldName = error.message.split(': ')[1];
        scrollToErrorField(fieldName);
      } else if (error.message.includes('User not authenticated')) {
        errorMessage = 'Authentication required — please log in again';
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.message.includes('Database')) {
        errorMessage = 'Database error — please try again later';
      }
      
      // Store error message for display
      setErrorMessage(errorMessage);
      
      // Show error notification
      setShowErrorNotification(true);
      
      // Auto-hide error notification after 5 seconds
      setTimeout(() => {
        setShowErrorNotification(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAnother = () => {
    setFormData({
      workspace: 'Eukarya Inc.',
      name: '',
      images: [],
      description: '',
      file: null, // Changed from mock object to null
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
    navigate('/developer-console/workspace');
  };

  const handleNotificationView = () => {
    if (notificationData?.marketplaceSlug) {
      // For Draft status plugins, navigate to a preview mode
      // You could also navigate to the marketplace page with a preview parameter
      navigate(`/plugin/preview/${notificationData.marketplaceSlug}`);
    } else if (notificationData?.pluginId) {
      // Fallback to plugin ID
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
        <DeveloperConsoleSidebar
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

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 120px)',
            padding: '40px',
            textAlign: 'center'
          }}>
            {/* Success Icon */}
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#D1FAE5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px'
            }}>
              <CheckCircle size={64} color="#10B981" />
            </div>
            
            {/* Main Heading */}
            <h1 style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#111827',
              fontFamily: 'Outfit',
              margin: '0 0 24px 0',
              lineHeight: 1.2
            }}>
              Your plugin has been submitted!
            </h1>
            
            {/* Description */}
            <p style={{
              fontSize: '18px',
              color: '#6B7280',
              fontFamily: 'Outfit',
              margin: '0 0 40px 0',
              maxWidth: '600px',
              lineHeight: 1.5
            }}>
              Thanks for submitting your plugin! Our team will review it soon, and we'll notify you once it's approved and live in the marketplace.
            </p>
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button 
                onClick={handleViewDetails}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: 500,
                  fontFamily: 'Outfit',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
              >
                Manage plugin
              </button>
              
              <button 
                onClick={handleUploadAnother}
                style={{
                  backgroundColor: 'transparent',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: 500,
                  fontFamily: 'Outfit',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F3F4F6';
                  e.target.style.borderColor = '#9CA3AF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#D1D5DB';
                }}
              >
                Submit another one
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show initialization error if failed to load
  if (initError) {
    return (
      <div className="dev-portal-container">
        <DeveloperConsoleSidebar activeItem="new" />
        <div style={{
          marginLeft: '288px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #F87171',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{
              color: '#DC2626',
              fontFamily: 'Outfit',
              fontSize: '18px',
              marginBottom: '12px'
            }}>
              Page Initialization Error
            </h2>
            <p style={{
              color: '#7F1D1D',
              fontFamily: 'Outfit',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {initError}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontFamily: 'Outfit',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <div className="dev-portal-container">
        <DeveloperConsoleSidebar activeItem="new" />
        <div style={{
          marginLeft: '288px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            fontFamily: 'Outfit',
            fontSize: '16px',
            color: '#6B7280'
          }}>
            Loading upload form...
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return renderSuccessPage();
  }

  return (
    <div className="dev-portal-container">
      {/* Sidebar */}
      <DeveloperConsoleSidebar
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
              to="/developer-console/workspace" 
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
          {/* Form Instructions */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '14px',
              fontFamily: 'Outfit',
              color: '#1E40AF'
            }}>
              <strong>Quick Start:</strong> Only the Plugin Name is required to submit. Fill in other fields as needed.
            </p>
          </div>
          {/* Workspace Selection */}
          <div 
            ref={(el) => fieldRefs.current.workspace = el}
            style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Workspace
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
          <div 
            ref={(el) => fieldRefs.current.name = el}
            style={{ marginBottom: '32px' }}>
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
          <div 
            ref={(el) => fieldRefs.current.images = el}
            style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Plugin Image
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
          <div 
            ref={(el) => {
              fieldRefs.current.file = el;
              fieldRefs.current.githubUrl = el;
            }}
            style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
              fontFamily: 'Outfit',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Plugin File
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
              onClick={(e) => {
                // Fallback in case form submit isn't working
                console.log('Submit button clicked - fallback onClick');
                if (!isLoading) {
                  handleSubmit(e);
                }
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = '#0A4F6F';
                  e.target.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = '#116993';
                  e.target.style.transform = 'scale(1)';
                }
              }}
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
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                position: 'relative',
                zIndex: 1
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
              onClick={() => navigate('/developer-console/workspace')}
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

      {/* Error Tooltip Notification */}
      {showErrorNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--black, #000)',
          color: 'white',
          borderRadius: 'var(--spacing-pc-2, 8px)',
          opacity: 0.9,
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          maxWidth: '320px',
          fontFamily: 'Outfit'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ 
                color: 'white', 
                fontSize: '10px', 
                fontWeight: 'bold',
                lineHeight: 1
              }}>
                ✕
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 500,
                color: 'white'
              }}>
                {errorMessage}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setShowErrorNotification(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                  fontFamily: 'Outfit'
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Tooltip Notification */}
      {showNotification && notificationData && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--black, #000)',
          color: 'white',
          borderRadius: 'var(--spacing-pc-2, 8px)',
          opacity: 0.9,
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          maxWidth: '320px',
          fontFamily: 'Outfit'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#48BB78',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle size={10} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px' }}>
                <div style={{ 
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: '2px'
                }}>
                  New submission
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px'
                }}>
                  {notificationData.pluginName} submitted successfully
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={handleNotificationView}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  fontFamily: 'Outfit'
                }}
              >
                View
              </button>
              <button
                onClick={handleNotificationClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                  fontFamily: 'Outfit'
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading animation and shake styles */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          .shake-animation {
            animation: shake 0.6s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default DeveloperConsoleUpload;