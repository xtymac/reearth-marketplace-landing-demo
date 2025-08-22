import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Search, ExternalLink, Plus, X, FileText, GitBranch, AlertTriangle, Upload } from 'lucide-react';
import { authService } from '../services/authService';
import { PluginService } from '../services/pluginService';
import { pluginData } from '../data/pluginData';
import DeveloperPortalSidebar from './DeveloperPortalSidebar';
import '../DeveloperPortal.css';

function DeveloperPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pluginId } = useParams();
  const [plugins, setPlugins] = useState([]);
  const [filteredPlugins, setFilteredPlugins] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState('workspace-1');
  const [sortBy, setSortBy] = useState('updated');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Plugin edit state
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('General');
  const [markedLoaded, setMarkedLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  
  // New version state
  const [showNewVersionEditor, setShowNewVersionEditor] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('local');
  const [newVersionData, setNewVersionData] = useState({
    file: null,
    githubUrl: '',
    version: '',
    releaseNotes: '',
    labels: []
  });

  // Plugin form state
  const [pluginFormData, setPluginFormData] = useState({
    name: '',
    status: 'Public',
    description: '',
    functionTags: [],
    images: [],
    readme: ''
  });
  const [tempReadme, setTempReadme] = useState('');
  const [readmeMode, setReadmeMode] = useState('edit');
  const [versions, setVersions] = useState([]);
  
  // Image editing state
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [imageEditorData, setImageEditorData] = useState({
    src: '',
    crop: { x: 0, y: 0, width: 100, height: 62.5 },
    rotation: 0,
    scale: 1
  });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Storage functions for state persistence
  const saveFormDataToStorage = (pluginId) => {
    if (!pluginId) return;
    
    const stateToSave = {
      pluginFormData,
      tempReadme,
      readmeMode,
      activeSection,
      versions,
      timestamp: Date.now()
    };
    
    try {
      sessionStorage.setItem(`developerPortal_edit_${pluginId}`, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save form data to sessionStorage:', error);
    }
  };

  const loadFormDataFromStorage = (pluginId) => {
    if (!pluginId) return null;
    
    try {
      const saved = sessionStorage.getItem(`developerPortal_edit_${pluginId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load form data from sessionStorage:', error);
      return null;
    }
  };

  const clearFormDataFromStorage = (pluginId) => {
    if (!pluginId) return;
    
    try {
      sessionStorage.removeItem(`developerPortal_edit_${pluginId}`);
    } catch (error) {
      console.warn('Failed to clear form data from sessionStorage:', error);
    }
  };

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (!authenticated) {
      // Don't redirect, show welcome page instead
      return;
    }

    // Check if we have workspace data from the portal entry
    if (location.state?.selectedWorkspace) {
      const workspace = location.state.selectedWorkspace;
      // Map the portal entry workspace to our internal workspace IDs
      const workspaceMapping = {
        'personal-workspace': 'workspace-1',
        'fukuyama-consultant': 'workspace-2',
        'weather-data': 'workspace-7',
        'sensor-tech': 'workspace-3',
        'geovision-labs': 'workspace-4',
        'mobili-solution': 'workspace-5',
        'enviro-tech': 'workspace-6',
        'enviro-node': 'workspace-6',
        'chrono-maps': 'workspace-8'
      };
      const mappedWorkspace = workspaceMapping[workspace.id] || 'workspace-1';
      setSelectedWorkspace(mappedWorkspace);
    } else {
      // Try to load from localStorage if no location state
      const savedWorkspace = localStorage.getItem('developerPortal_selectedWorkspace');
      if (savedWorkspace) {
        try {
          const workspaceData = JSON.parse(savedWorkspace);
          const workspaceMapping = {
            'personal-workspace': 'workspace-1',
            'fukuyama-consultant': 'workspace-2',
            'weather-data': 'workspace-7',
            'sensor-tech': 'workspace-3',
            'geovision-labs': 'workspace-4',
            'mobili-solution': 'workspace-5',
            'enviro-tech': 'workspace-6',
            'enviro-node': 'workspace-6',
            'chrono-maps': 'workspace-8'
          };
          const mappedWorkspace = workspaceMapping[workspaceData.id] || 'workspace-1';
          setSelectedWorkspace(mappedWorkspace);
        } catch (error) {
          // Clear invalid saved data
          localStorage.removeItem('developerPortal_selectedWorkspace');
        }
      }
    }

    // Use pluginData directly since it's synchronous
    const workspacePlugins = pluginData.map(plugin => ({
      ...plugin,
      visibility: plugin.visibility || 'public',
      workspace: plugin.workspace || 'workspace-1'
    }));
    setPlugins(workspacePlugins);
  }, [navigate, location.state]);

  useEffect(() => {
    let filtered = plugins.filter(plugin => 
      plugin.workspace === selectedWorkspace
    );

    if (searchTerm) {
      filtered = filtered.filter(plugin =>
        plugin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'updated') {
      filtered.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'downloads') {
      filtered.sort((a, b) => b.downloads - a.downloads);
    }

    setFilteredPlugins(filtered);
  }, [plugins, selectedWorkspace, sortBy, searchTerm]);

  const getTimeAgo = (dateString) => {
    // For demo purposes, always return "3 month ago" to match the reference design
    return '3 month ago';
  };

  // Plugin edit state and handlers
  const [newTag, setNewTag] = useState('');
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  
  // Version editing state
  const [editingVersionIndex, setEditingVersionIndex] = useState(null);
  const [editingVersionData, setEditingVersionData] = useState({
    version: '',
    releaseNotes: '',
    labels: []
  });
  
  // Scrollspy refs
  const generalRef = useRef(null);
  const readmeRef = useRef(null);
  const versionRef = useRef(null);
  const dangerZoneRef = useRef(null);

  const sidebarItems = [
    { id: 'General', label: 'General', icon: FileText, ref: generalRef },
    { id: 'README', label: 'README', icon: FileText, ref: readmeRef },
    { id: 'Version', label: 'Version', icon: GitBranch, ref: versionRef },
    { id: 'Danger Zone', label: 'Danger Zone', icon: AlertTriangle, ref: dangerZoneRef }
  ];

  // Load marked library for markdown rendering
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.async = true;
    script.onload = () => setMarkedLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAvatarDropdown && !event.target.closest('.avatar-dropdown-container')) {
        setShowAvatarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAvatarDropdown]);

  // Improved Scrollspy functionality using Intersection Observer
  useEffect(() => {
    if (!isEditMode) return;

    // Get the scrollable container
    const scrollContainer = document.querySelector('.plugin-edit-container .scrollable-content');
    if (!scrollContainer) return;

    let isUserScrolling = true;
    let scrollTimeout;
    let isInitialized = false;

    // Debounced scroll handler to detect user vs programmatic scrolling
    const handleScroll = () => {
      const isProgrammaticScroll = scrollContainer.getAttribute('data-programmatic-scroll') === 'true';
      if (!isProgrammaticScroll) {
        isUserScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isUserScrolling = false;
        }, 150);
      }
    };

    // Initialize after a small delay to prevent immediate activation
    setTimeout(() => {
      isInitialized = true;
    }, 200);

    scrollContainer.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        // Only update active section during user scrolling, not programmatic scrolling, and after initialization
        const isProgrammaticScroll = scrollContainer.getAttribute('data-programmatic-scroll') === 'true';
        if (isProgrammaticScroll || !isInitialized) return;

        // Find the section that's most in view
        let visibleSection = null;
        let maxRatio = 0;
        let closestToTop = null;
        let minDistanceFromTop = Infinity;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            const ratio = entry.intersectionRatio;
            const rect = entry.boundingClientRect;
            const distanceFromTop = Math.abs(rect.top - 24); // 24px offset for header

            // Prefer section closest to the top when multiple sections are visible
            if (ratio > 0.1 && distanceFromTop < minDistanceFromTop) {
              minDistanceFromTop = distanceFromTop;
              closestToTop = sectionId;
            }

            // Also track the section with maximum visibility
            if (ratio > maxRatio) {
              maxRatio = ratio;
              visibleSection = sectionId;
            }
          }
        });

        // Use the section closest to top if it exists, otherwise use most visible
        const targetSection = closestToTop || visibleSection;

        // Special handling for the last section (Danger Zone) when scrolled to bottom
        if (!targetSection || maxRatio < 0.1) {
          const scrollTop = scrollContainer.scrollTop;
          const scrollHeight = scrollContainer.scrollHeight;
          const clientHeight = scrollContainer.clientHeight;
          
          // Only activate Danger Zone if really at the bottom (within 10px) and content is scrollable
          if (scrollHeight > clientHeight && scrollHeight - scrollTop - clientHeight < 10) {
            setActiveSection('Danger Zone');
            const hash = 'danger-zone';
            if (window.location.hash !== `#${hash}`) {
              window.history.replaceState(null, '', `#${hash}`);
            }
            return;
          }
        }

        if (targetSection && targetSection !== activeSection) {
          setActiveSection(targetSection);
          // Update URL hash without triggering navigation
          const hash = targetSection.toLowerCase().replace(' ', '-');
          if (window.location.hash !== `#${hash}`) {
            window.history.replaceState(null, '', `#${hash}`);
          }
        }
      },
      {
        root: scrollContainer,
        rootMargin: '-24px 0px -40% 0px', // Account for header offset, reduced bottom margin
        threshold: [0, 0.1, 0.4, 0.7, 1.0] // Better threshold values
      }
    );

    // Observe all sections
    const sections = [generalRef, readmeRef, versionRef, dangerZoneRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [isEditMode, activeSection]);

  // Ensure page starts at top when entering edit mode
  useEffect(() => {
    if (isEditMode) {
      const scrollContainer = document.querySelector('.plugin-edit-container .scrollable-content');
      if (scrollContainer) {
        // Only scroll to top if there's no hash in URL
        const hash = window.location.hash.slice(1);
        if (!hash) {
          scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
    }
  }, [isEditMode]);

  // Handle direct plugin edit URL and load saved form data
  useEffect(() => {
    if (pluginId && plugins.length > 0) {
      const plugin = plugins.find(p => p.id.toString() === pluginId);
      if (plugin) {
        setSelectedPlugin(plugin);
        setIsEditMode(true);
        
        // Try to load saved form data from sessionStorage
        const savedData = loadFormDataFromStorage(pluginId);
        if (savedData) {
          // Restore form data
          setPluginFormData(savedData.pluginFormData);
          setTempReadme(savedData.tempReadme || '');
          setReadmeMode(savedData.readmeMode || 'preview');
          setActiveSection(savedData.activeSection || 'General');
          if (savedData.versions) {
            setVersions(savedData.versions);
          }
        } else {
          // Initialize with plugin data if no saved data exists
          setPluginFormData({
            name: plugin.title,
            status: plugin.visibility === 'draft' ? 'Draft' : 'Public',
            description: plugin.description,
            functionTags: plugin.tags.slice(0, 3),
            images: [
              plugin.image,
              ...(plugin.gallery ? plugin.gallery.slice(1, 3) : [])
            ],
            readme: plugin.readme || `# ${plugin.title}\n\nNo README available for this plugin.`
          });
          
          // Check for URL hash and set active section accordingly
          const hash = window.location.hash.slice(1);
          if (hash && ['General', 'README', 'Version', 'Danger-Zone'].includes(hash)) {
            setActiveSection(hash);
          } else {
            setActiveSection('General');
          }
        }
      }
    }
  }, [pluginId, plugins]);

  // Auto-save form data when it changes (debounced)
  useEffect(() => {
    if (selectedPlugin && isEditMode) {
      const timeoutId = setTimeout(() => {
        saveFormDataToStorage(selectedPlugin.id);
      }, 1000); // Save after 1 second of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [pluginFormData, tempReadme, readmeMode, activeSection, versions, selectedPlugin, isEditMode]);

  // Update canvas when image editor data changes
  useEffect(() => {
    if (showImageEditor && imageRef.current && canvasRef.current) {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const updateCanvas = () => {
        // Set canvas size to 640x400 for preview (16:10 aspect ratio)
        canvas.width = 640;
        canvas.height = 400;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context
        ctx.save();

        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((imageEditorData.rotation * Math.PI) / 180);
        ctx.scale(imageEditorData.scale, imageEditorData.scale);

        // Calculate crop dimensions
        const cropX = (imageEditorData.crop.x / 100) * img.naturalWidth;
        const cropY = (imageEditorData.crop.y / 100) * img.naturalHeight;
        const cropWidth = (imageEditorData.crop.width / 100) * img.naturalWidth;
        const cropHeight = (imageEditorData.crop.height / 100) * img.naturalHeight;

        // Draw the cropped image
        ctx.drawImage(
          img,
          cropX, cropY, cropWidth, cropHeight,
          -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height
        );

        // Restore context
        ctx.restore();
      };

      if (img.complete) {
        updateCanvas();
      } else {
        img.onload = updateCanvas;
      }
    }
  }, [showImageEditor, imageEditorData, editingImage]);

  const handlePluginClick = (plugin) => {
    setSelectedPlugin(plugin);
    setIsEditMode(true);
    
    // Try to load saved form data from sessionStorage first
    const savedData = loadFormDataFromStorage(plugin.id);
    if (savedData) {
      // Restore form data
      setPluginFormData(savedData.pluginFormData);
      setTempReadme(savedData.tempReadme || '');
      setReadmeMode(savedData.readmeMode || 'preview');
      setActiveSection(savedData.activeSection || 'General');
      if (savedData.versions) {
        setVersions(savedData.versions);
      }
    } else {
      // Check for URL hash and set active section accordingly
      const hash = window.location.hash.slice(1); // Remove # from hash
      let initialSection = 'General';
      
      // Only change section if there's an explicit hash in the URL
      if (hash) {
        switch (hash) {
          case 'readme':
            initialSection = 'README';
            break;
          case 'version':
            initialSection = 'Version';
            break;
          case 'danger-zone':
            initialSection = 'Danger Zone';
            break;
          default:
            initialSection = 'General';
        }
      }
      
      setActiveSection(initialSection);
      
      // Initialize plugin form data
      setPluginFormData({
        name: plugin.title,
        status: plugin.visibility === 'draft' ? 'Draft' : 'Public',
        description: plugin.description,
        functionTags: plugin.tags.slice(0, 3),
        images: [
          plugin.image,
          ...(plugin.gallery ? plugin.gallery.slice(1, 3) : [])
        ],
        readme: `# 🏙️ ${plugin.title}

**${plugin.title}** is a powerful plugin designed to enhance your workflow.

---

## ✨ Features

- Feature 1
- Feature 2
- Feature 3

---

## 📦 Use Cases

- Use case 1
- Use case 2
- Use case 3`
      });
      
      // Clear any existing hash if no specific section was requested
      if (!hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      
      // Only scroll to specific section if there's an explicit hash
      setTimeout(() => {
        if (hash && hash !== 'general') {
          handleSidebarItemClick(initialSection);
        } else {
          // Ensure we start at the top of the page
          const scrollContainer = document.querySelector('.plugin-edit-container .scrollable-content');
          if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
          }
        }
      }, 100);
    }
  };

  const handleBackToList = () => {
    setIsEditMode(false);
    setSelectedPlugin(null);
    // Note: We don't clear sessionStorage here because this might be called
    // when returning from preview, and we want to preserve the edited state
  };

  // Plugin edit handlers
  const handleStatusToggle = () => {
    setPluginFormData(prev => ({
      ...prev,
      status: prev.status === 'Public' ? 'Draft' : 'Public'
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setPluginFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setPluginFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Image editing functions
  const openImageEditor = (imageSrc, index) => {
    setEditingImage(imageSrc);
    setEditingImageIndex(index);
    setImageEditorData({
      src: imageSrc,
      crop: { x: 0, y: 0, width: 100, height: 62.5 },
      rotation: 0,
      scale: 1
    });
    setShowImageEditor(true);
  };

  const closeImageEditor = () => {
    setShowImageEditor(false);
    setEditingImage(null);
    setEditingImageIndex(null);
  };

  const handleCropChange = (newCrop) => {
    setImageEditorData(prev => ({ ...prev, crop: newCrop }));
  };

  const handleRotationChange = (rotation) => {
    setImageEditorData(prev => ({ ...prev, rotation }));
  };

  const handleScaleChange = (scale) => {
    setImageEditorData(prev => ({ ...prev, scale }));
  };

  const applyImageEdit = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Set canvas size to 1280x800 (16:10 aspect ratio)
    canvas.width = 1280;
    canvas.height = 800;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((imageEditorData.rotation * Math.PI) / 180);
    ctx.scale(imageEditorData.scale, imageEditorData.scale);

    // Calculate crop dimensions
    const cropX = (imageEditorData.crop.x / 100) * img.naturalWidth;
    const cropY = (imageEditorData.crop.y / 100) * img.naturalHeight;
    const cropWidth = (imageEditorData.crop.width / 100) * img.naturalWidth;
    const cropHeight = (imageEditorData.crop.height / 100) * img.naturalHeight;

    // Draw the cropped image
    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight,
      -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height
    );

    // Restore context
    ctx.restore();

    // Convert canvas to blob and update the image
    canvas.toBlob((blob) => {
      const editedImageUrl = URL.createObjectURL(blob);
      setPluginFormData(prev => {
        const newImages = [...prev.images];
        newImages[editingImageIndex] = editedImageUrl;
        return { ...prev, images: newImages };
      });
      closeImageEditor();
    }, 'image/png');
  };

  const addTag = () => {
    if (newTag.trim() && !pluginFormData.functionTags.includes(newTag.trim())) {
      setPluginFormData(prev => ({
        ...prev,
        functionTags: [...prev.functionTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPluginFormData(prev => ({
      ...prev,
      functionTags: prev.functionTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = () => {
    console.log('Saving plugin data:', pluginFormData);
    
    // Clear saved data since we're officially saving
    if (selectedPlugin) {
      clearFormDataFromStorage(selectedPlugin.id);
    }
    
    handleBackToList();
  };

  const handlePreview = () => {
    if (selectedPlugin) {
      // Save current form state before navigating to preview
      saveFormDataToStorage(selectedPlugin.id);
      
      // Navigate to plugin detail page with preview mode parameter in the same tab
      navigate(`/plugin/${selectedPlugin.id}?preview=1`);
    }
  };

  const handleCancel = () => {
    // Clear saved data on cancel
    if (selectedPlugin) {
      clearFormDataFromStorage(selectedPlugin.id);
    }
    
    handleBackToList();
  };

  // Version editing handlers
  const handleVersionEdit = (index, version) => {
    setEditingVersionIndex(index);
    setEditingVersionData({
      version: version.version,
      releaseNotes: version.content || '',
      labels: version.tags || []
    });
  };

  const handleVersionSave = () => {
    // Save the edited version data
    console.log('Saving version:', editingVersionData);
    setEditingVersionIndex(null);
    setEditingVersionData({ version: '', releaseNotes: '', labels: [] });
  };

  const handleVersionCancel = () => {
    setEditingVersionIndex(null);
    setEditingVersionData({ version: '', releaseNotes: '', labels: [] });
  };

  const handleVersionLabelToggle = (label) => {
    setEditingVersionData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  // New version handlers
  const handleNewVersionClick = () => {
    setShowNewVersionEditor(!showNewVersionEditor);
  };

  const handleNewVersionInputChange = (e) => {
    const { name, value } = e.target;
    setNewVersionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setNewVersionData(prev => ({
      ...prev,
      file: file
    }));
  };

  const toggleVersionLabel = (label) => {
    setNewVersionData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  const handleSaveNewVersion = () => {
    // Basic form validation
    const isLocalUpload = uploadMethod === 'local';
    const hasFile = isLocalUpload ? newVersionData.file : newVersionData.githubUrl.trim();
    
    if (!hasFile) {
      alert(isLocalUpload ? 'Please select a file to upload.' : 'Please enter a GitHub repository URL.');
      return;
    }
    
    if (uploadMethod === 'github' && !newVersionData.githubUrl.match(/^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/)) {
      alert('Please enter a valid GitHub repository URL.');
      return;
    }
    
    if (!newVersionData.releaseNotes.trim()) {
      alert('Please enter release notes describing what changed in this version.');
      return;
    }
    
    console.log('Saving new version:', newVersionData);
    alert('New version saved successfully!');
    
    // Reset and hide form
    setShowNewVersionEditor(false);
    setNewVersionData({
      file: null,
      githubUrl: '',
      version: '',
      releaseNotes: '',
      labels: []
    });
  };

  const handleCancelNewVersion = () => {
    setShowNewVersionEditor(false);
    setNewVersionData({
      file: null,
      githubUrl: '',
      version: '',
      releaseNotes: '',
      labels: []
    });
  };

  const handleDeleteNewVersion = () => {
    if (window.confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
      console.log('Deleting version');
      setShowNewVersionEditor(false);
    }
  };

  const handleAvatarClick = () => {
    setShowAvatarDropdown(!showAvatarDropdown);
  };

  const handleWorkspaceChange = (workspaceId) => {
    setSelectedWorkspace(workspaceId);

    // Save the workspace selection to localStorage
    // Create reverse mapping from internal workspace IDs to external format
    const reverseWorkspaceMapping = {
      'workspace-1': { id: 'personal-workspace', name: 'Personal Workspace', type: 'Personal', members: null, workspaceId: null },
      'workspace-2': { id: 'fukuyama-consultant', name: '株式会社福山コンサルタント', type: 'Team', members: 8, workspaceId: 'fukuyama-consultant' },
      'workspace-7': { id: 'weather-data', name: '気象データ株式会社', type: 'Team', members: 12, workspaceId: 'weather-data' },
      'workspace-3': { id: 'sensor-tech', name: 'センサー技術株式会社', type: 'Team', members: 15, workspaceId: 'sensor-tech' },
      'workspace-4': { id: 'geovision-labs', name: 'GeoVision Labs', type: 'Team', members: 6, workspaceId: 'geovision-labs' },
      'workspace-5': { id: 'mobili-solution', name: 'モビリソリューション', type: 'Team', members: 9, workspaceId: 'mobili-solution' },
      'workspace-6': { id: 'enviro-tech', name: '環境テクノロジー株式会社', type: 'Team', members: 11, workspaceId: 'enviro-tech' },
      'workspace-8': { id: 'chrono-maps', name: 'ChronoMaps Studio', type: 'Team', members: 7, workspaceId: 'chrono-maps' }
    };
    
    const externalWorkspace = reverseWorkspaceMapping[workspaceId];
    if (externalWorkspace) {
      localStorage.setItem('developerPortal_selectedWorkspace', JSON.stringify(externalWorkspace));
    }
  };

  const handleLogoClick = () => {
    // Exit edit mode if currently editing
    if (isEditMode) {
      setIsEditMode(false);
      setSelectedPlugin(null);
    }
    navigate('/developer-portal');
  };

  const handleSidebarItemClick = (sectionId) => {
    const sectionRef = sidebarItems.find(item => item.id === sectionId)?.ref;
    const scrollContainer = document.querySelector('.plugin-edit-container .scrollable-content');
    
    if (sectionRef?.current && scrollContainer) {
      // Set active state immediately for responsive feedback
      setActiveSection(sectionId);
      
      // Update URL hash
      const hash = sectionId.toLowerCase().replace(' ', '-');
      window.history.pushState(null, '', `#${hash}`);
      
      // Find the section title (h2) within the section
      const sectionTitle = sectionRef.current.querySelector('h2');
      const targetElement = sectionTitle || sectionRef.current;
      
      // Mark as programmatic scroll to prevent scroll-spy interference
      scrollContainer.setAttribute('data-programmatic-scroll', 'true');
      
      // Calculate proper scroll position to align title at top with header offset
      const elementTop = targetElement.offsetTop;
      const headerOffset = 24; // Account for sticky header
      
      scrollContainer.scrollTo({
        top: elementTop - headerOffset,
        behavior: 'smooth'
      });
      
      // Clear programmatic scroll flag after scroll completes
      setTimeout(() => {
        scrollContainer.removeAttribute('data-programmatic-scroll');
        // Focus the section heading after scroll completes
        if (targetElement && targetElement.focus) {
          targetElement.focus();
        }
      }, 500); // Wait for smooth scroll to complete
    }
  };

  const handleDropdownItemClick = (action) => {
    setShowAvatarDropdown(false);
    
    switch (action) {
      case 'marketplace':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'setting':
        // Navigate to settings page when implemented
        console.log('Navigate to settings');
        break;
      case 'logout':
        authService.logout();
        navigate('/');
        break;
      default:
        break;
    }
  };

  const renderMarkdown = (text) => {
    if (markedLoaded && window.marked) {
      return window.marked.parse(text);
    }

    let html = text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      .replace(/^---$/gm, '<hr class="border-gray-300 my-4">')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$1. $2</li>')
      .replace(/\n/g, '<br>');

    return html;
  };

  // Welcome page for non-authenticated users
  const WelcomePage = () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FEFAF0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '60px 40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#2CC3FF"/>
              <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="white"/>
            </svg>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              fontFamily: 'Outfit',
              color: '#111827',
              margin: 0
            }}>
              Developer Portal
            </h1>
          </div>
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

        {/* Features */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            textAlign: 'left'
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
                <FileText size={14} color="#1976D2" />
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
                  Upload, edit, and manage your plugins with comprehensive version control and documentation tools.
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
                <GitBranch size={14} color="#C2185B" />
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
                  Track changes, manage releases, and maintain comprehensive changelogs for your plugins.
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
                <ExternalLink size={14} color="#F57C00" />
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
                  Publish your plugins to the Re:Earth marketplace and reach thousands of users worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#00A2EA',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'Outfit',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '120px'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login')} // You might want to create a separate signup page
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#00A2EA',
              border: '2px solid #00A2EA',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'Outfit',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '120px'
            }}
          >
            Get Started
          </button>
        </div>

        {/* Additional Info */}
        <div style={{ marginTop: '32px' }}>
          <p style={{
            fontSize: '13px',
            color: '#9CA3AF',
            fontFamily: 'Outfit',
            lineHeight: '1.4',
            margin: 0
          }}>
            New to Re:Earth? Learn more about building plugins in our{' '}
            <a 
              href="#" 
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
    </div>
  );

  // Show welcome page for non-authenticated users
  if (!isAuthenticated) {
    return <WelcomePage />;
  }

  return (
    <div className="dev-portal-container">
      {/* Sidebar */}
      <DeveloperPortalSidebar
        activeItem="manage"
        selectedWorkspace={selectedWorkspace}
        workspaces={workspaces}
        onWorkspaceChange={handleWorkspaceChange}
        onLogoClick={handleLogoClick}
      />

      {/* Main Content */}
      <div className="dev-portal-main">
        {!isEditMode ? (
          <>
            {/* Top bar with avatar */}
            <div 
              className="avatar-dropdown-container"
              style={{ 
                position: 'absolute',
                top: '40px',
                right: '40px',
                zIndex: 10
              }}
            >
              <img 
                src="/Image/Avatar/Avatar.png" 
                alt="User Avatar" 
                onClick={handleAvatarClick}
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
                    onClick={() => handleDropdownItemClick('marketplace')}
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
                    onClick={() => handleDropdownItemClick('dashboard')}
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
                    onClick={() => handleDropdownItemClick('setting')}
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
                    onClick={() => handleDropdownItemClick('logout')}
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
              <h1 className="page-title">Manage plugin</h1>
              
              <div className="header-controls" style={{ marginTop: '32px', width: '100%' }}>
                {/* Left group: Search bar and Sort dropdown */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                  {/* Search bar */}
                  <div className="search-container">
                    <Search className="search-icon" size={16} />
                    <input
                      type="text"
                      placeholder="Search by title, function and description"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  
                  {/* Sort dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="updated">Sort by date uploaded</option>
                    <option value="name">Sort by name</option>
                    <option value="downloads">Sort by downloads</option>
                  </select>
                </div>
                
                {/* New Plugin button - stays on the far right */}
                <Link to="/developer-portal/new" className="new-plugin-button">
                  <Plus size={16} />
                  New Plugin
                </Link>
              </div>
            </div>
            
            {/* Plugin Table */}
            <div className="plugin-cards-container">
              {filteredPlugins.length === 0 ? (
                <div className="empty-state">
                  <p>No plugins found.</p>
                </div>
              ) : (
                <table className="plugin-table">
                  <thead className="plugin-table-header">
                    <tr>
                      <th>Last edit</th>
                      <th></th>
                      <th>Last edit</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlugins.map(plugin => (
                      <tr 
                        key={plugin.id} 
                        className="plugin-table-row"
                        onClick={() => handlePluginClick(plugin)}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="plugin-name">{plugin.title}</div>
                            <span className={`plugin-badge ${plugin.visibility || 'public'}`}>
                              {plugin.visibility === 'draft' ? 'Draft' : 
                               plugin.visibility === 'private' ? 'Private' : 'Public'}
                            </span>
                          </div>
                        </td>
                        <td></td>
                        <td>
                          <span className="plugin-time">
                            {getTimeAgo(plugin.updateDate)}
                          </span>
                        </td>
                        <td>
                          <Link 
                            to={`/plugin/${plugin.id}`}
                            className="plugin-action"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          /* Plugin Edit View */
          <div className="plugin-edit-container" style={{ 
            padding: '0',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Edit Header */}
            <div className="edit-header" style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '24px 0 16px 0',
              borderBottom: '1px solid #E5E7EB',
              zIndex: 100,
              flexShrink: 0,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  onClick={handleBackToList}
                  style={{
                    color: 'var(--black, #000)',
                    fontFamily: 'Outfit',
                    fontSize: '24px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '140%',
                    cursor: 'pointer'
                  }}
                >
                  ↼ Manage plugin
                </span>
                <div style={{
                  color: 'var(--text-default, #0A0A0A)',
                  fontFamily: 'Outfit',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}>
                  {selectedPlugin?.title}
                </div>
              </div>
              
              {/* Avatar with Dropdown */}
              <div className="avatar-dropdown-container" style={{ position: 'relative' }}>
                <img 
                  src="/Image/Avatar/Avatar.png" 
                  alt="User Avatar" 
                  onClick={handleAvatarClick}
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
                      onClick={() => handleDropdownItemClick('marketplace')}
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
                      onClick={() => handleDropdownItemClick('dashboard')}
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
                      onClick={() => handleDropdownItemClick('setting')}
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
                      onClick={() => handleDropdownItemClick('logout')}
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
            </div>

            {/* Edit Content - Fixed Layout */}
            <div style={{ 
              display: 'flex', 
              gap: '24px',
              flex: 1,
              overflow: 'hidden'
            }}>
              {/* Left Sidebar */}
              <div style={{ width: '200px', flexShrink: 0, paddingTop: '24px' }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  overflow: 'hidden',
                  height: 'fit-content'
                }}>
                  {sidebarItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = item.id === activeSection;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSidebarItemClick(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSidebarItemClick(item.id);
                          }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-current={isActive ? 'page' : 'false'}
                        aria-label={`Navigate to ${item.label} section`}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          background: isActive ? 'var(--reearth-sky-600, #1483B5)' : 'transparent',
                          color: isActive ? 'white' : '#374151',
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily: 'Outfit',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease, color 0.2s ease',
                          outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = '#F9FAFB';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        onFocus={(e) => {
                          // Remove focus styling - only keep active state
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.outline = 'none';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.outline = 'none';
                        }}
                      >
                        <IconComponent size={16} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Main Edit Content */}
              <div style={{ 
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '24px'
              }}>
                <div 
                  className="scrollable-content"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '0 32px 32px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '64px',
                    overflow: 'auto',
                    flex: 1
                  }}>
                  
                  {/* General Section */}
                  <div ref={generalRef} data-section="General" style={{ scrollMarginTop: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <h2 
                        id="general"
                        tabIndex="-1"
                        style={{
                          fontSize: '20px',
                          fontWeight: 600,
                          fontFamily: 'Outfit',
                          color: '#111827',
                          marginBottom: '8px',
                          scrollMarginTop: '24px',
                          outline: 'none'
                        }}
                      >
                        General
                      </h2>
                      <p 
                        style={{
                          color: '#6B7280',
                          fontFamily: 'Outfit',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          margin: 0
                        }}
                      >
                        General and Basic Settings of the Project
                      </p>
                      <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginTop: '16px' }}></div>
                    </div>

                    {/* General Section Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      {/* Plugin Status */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily: 'Outfit',
                          color: '#111827',
                          marginBottom: '12px'
                        }}>
                          Plugin Status <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={handleStatusToggle}
                            style={{
                              position: 'relative',
                              display: 'inline-flex',
                              height: '24px',
                              width: '44px',
                              alignItems: 'center',
                              borderRadius: 'var(--border-radius-full, 9999px)',
                              border: '2px solid rgba(255, 255, 255, 0.00)',
                              backgroundColor: pluginFormData.status === 'Public' ? 'var(--reearth-sky-600, #1483B5)' : '#D1D5DB',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                height: '16px',
                                width: '16px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                transform: pluginFormData.status === 'Public' ? 'translateX(24px)' : 'translateX(4px)',
                                transition: 'transform 0.2s'
                              }}
                            />
                          </button>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: 'Outfit',
                            color: '#111827'
                          }}>
                            {pluginFormData.status}
                          </span>
                        </div>
                      </div>

                      {/* Plugin Name */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily: 'Outfit',
                          color: '#111827',
                          marginBottom: '12px'
                        }}>
                          Plugin Name <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={pluginFormData.name}
                          onChange={(e) => setPluginFormData(prev => ({ ...prev, name: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'Outfit',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily: 'Outfit',
                          color: '#111827',
                          marginBottom: '12px'
                        }}>
                          Description
                        </label>
                        <textarea
                          value={pluginFormData.description}
                          onChange={(e) => setPluginFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'Outfit',
                            outline: 'none',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                        <p style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          color: '#6B7280',
                          fontFamily: 'Outfit'
                        }}>
                          Provide a detailed description of what your plugin does and its key features.
                        </p>
                      </div>

                      {/* Function Tags */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily: 'Outfit',
                          color: '#111827',
                          marginBottom: '12px'
                        }}>
                          Function Tags
                        </label>
                        
                        {/* Existing Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                          {pluginFormData.functionTags.map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '4px 8px',
                                backgroundColor: '#F3F4F6',
                                color: '#374151',
                                fontSize: '12px',
                                borderRadius: '4px',
                                fontFamily: 'Outfit'
                              }}
                            >
                              {tag}
                              <button
                                onClick={() => removeTag(tag)}
                                style={{
                                  marginLeft: '8px',
                                  background: 'none',
                                  border: 'none',
                                  color: '#6B7280',
                                  cursor: 'pointer',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Add New Tag */}
                        <div>
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={handleTagKeyPress}
                            placeholder="Add a tag"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: 'Outfit',
                              outline: 'none'
                            }}
                          />
                          <p style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            fontFamily: 'Outfit',
                            margin: '8px 0 0 0'
                          }}>
                            Add function tags to help users discover your plugin. Separate multiple tags with commas.
                          </p>
                        </div>
                      </div>

                      {/* Plugin Gallery */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily: 'Outfit',
                          color: '#111827',
                          marginBottom: '12px'
                        }}>
                          Plugin Gallery
                        </label>
                        
                        {/* Image Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px',
                          marginBottom: '16px'
                        }}>
                          {pluginFormData.images.map((image, index) => (
                            <div
                              key={index}
                              style={{
                                position: 'relative',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                backgroundColor: '#F9FAFB',
                                aspectRatio: '16/10',
                                border: '1px solid #E5E7EB',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                const editBtn = e.currentTarget.querySelector('.edit-btn');
                                if (editBtn) editBtn.style.opacity = '1';
                              }}
                              onMouseLeave={(e) => {
                                const editBtn = e.currentTarget.querySelector('.edit-btn');
                                if (editBtn) editBtn.style.opacity = '0';
                              }}
                            >
                              <img
                                src={image}
                                alt={`Plugin image ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                              
                              {/* Edit Button */}
                              <button
                                className="edit-btn"
                                onClick={() => openImageEditor(image, index)}
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  background: 'rgba(0, 0, 0, 0.7)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '6px',
                                  cursor: 'pointer',
                                  opacity: '0',
                                  transition: 'opacity 0.2s ease',
                                  fontSize: '12px',
                                  fontFamily: 'Outfit'
                                }}
                              >
                                Edit
                              </button>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => removeImage(index)}
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  left: '8px',
                                  background: 'rgba(255, 0, 0, 0.7)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '16px',
                                  lineHeight: '1'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          
                          {/* Add Image Button */}
                          <label
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              aspectRatio: '16/10',
                              border: '2px dashed #D1D5DB',
                              borderRadius: '8px',
                              backgroundColor: '#F9FAFB',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontFamily: 'Outfit',
                              fontSize: '14px',
                              color: '#6B7280'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#9CA3AF';
                              e.currentTarget.style.backgroundColor = '#F3F4F6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#D1D5DB';
                              e.currentTarget.style.backgroundColor = '#F9FAFB';
                            }}
                          >
                            <Plus size={24} style={{ marginBottom: '8px' }} />
                            Add Image
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                        
                        <p style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          fontFamily: 'Outfit',
                          margin: 0
                        }}>
                          Add high-quality images to showcase your plugin. Images will be optimized to 1280×800px (16:10 aspect ratio).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* README Section */}
                  <div ref={readmeRef} data-section="README" style={{ scrollMarginTop: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <h2 
                        id="readme"
                        tabIndex="-1"
                        style={{
                          fontSize: '20px',
                          fontWeight: 600,
                          fontFamily: 'Outfit',
                          color: '#111827',
                          marginBottom: '8px',
                          scrollMarginTop: '24px',
                          outline: 'none'
                        }}
                      >
                        README
                      </h2>
                      <p 
                        style={{
                          color: '#6B7280',
                          fontFamily: 'Outfit',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          margin: 0
                        }}
                      >
                        This will be shown as the plugin's Overview—describe what it does and how to use it.
                      </p>
                      <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginTop: '16px' }}></div>
                    </div>

                    <div>
                      <div style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        {/* Edit/Preview Tabs */}
                        <div style={{
                          display: 'flex',
                          borderBottom: '1px solid #D1D5DB',
                          backgroundColor: '#F9FAFB'
                        }}>
                          <button
                            onClick={() => {
                              if (readmeMode === 'preview') {
                                setTempReadme(pluginFormData.readme);
                              }
                              setReadmeMode('edit');
                            }}
                            style={{
                              padding: '12px 24px',
                              border: 'none',
                              background: readmeMode === 'edit' ? 'white' : 'transparent',
                              color: readmeMode === 'edit' ? '#111827' : '#6B7280',
                              fontSize: '14px',
                              fontWeight: 500,
                              fontFamily: 'Outfit',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                          >
                            Edit
                            {readmeMode === 'edit' && (
                              <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                backgroundColor: '#3B82F6'
                              }}></div>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              if (readmeMode === 'edit' && tempReadme) {
                                setPluginFormData(prev => ({ ...prev, readme: tempReadme }));
                              }
                              setReadmeMode('preview');
                            }}
                            style={{
                              padding: '12px 24px',
                              border: 'none',
                              background: readmeMode === 'preview' ? 'white' : 'transparent',
                              color: readmeMode === 'preview' ? '#111827' : '#6B7280',
                              fontSize: '14px',
                              fontWeight: 500,
                              fontFamily: 'Outfit',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                          >
                            Preview
                            {readmeMode === 'preview' && (
                              <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                backgroundColor: '#3B82F6'
                              }}></div>
                            )}
                          </button>
                        </div>

                        {/* Content Area */}
                        <div style={{ height: '400px', overflow: 'hidden', backgroundColor: 'white' }}>
                          {readmeMode === 'edit' ? (
                            <textarea
                              value={tempReadme || pluginFormData.readme}
                              onChange={(e) => setTempReadme(e.target.value)}
                              style={{
                                width: '100%',
                                height: '100%',
                                padding: '16px',
                                border: 'none',
                                resize: 'none',
                                outline: 'none',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                                boxSizing: 'border-box'
                              }}
                              placeholder="Type your markdown here..."
                            />
                          ) : (
                            <div 
                              style={{
                                height: '100%',
                                overflowY: 'auto',
                                padding: '16px',
                                fontFamily: 'Outfit',
                                fontSize: '14px',
                                lineHeight: '1.6'
                              }}
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(pluginFormData.readme) }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Version Section */}
                  <div ref={versionRef} data-section="Version" style={{ scrollMarginTop: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h2 
                          id="version"
                          tabIndex="-1"
                          style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            fontFamily: 'Outfit',
                            color: '#111827',
                            margin: 0,
                            scrollMarginTop: '24px',
                            outline: 'none'
                          }}
                        >
                          Version
                        </h2>
                        <button
                          onClick={handleNewVersionClick}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-pc-md, 6px)',
                            background: 'var(--reearth-sky-600, #1483B5)',
                            color: 'white',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: 'Outfit',
                            cursor: 'pointer'
                          }}
                        >
                          New version
                        </button>
                      </div>
                      <p 
                        style={{
                          color: '#6B7280',
                          fontFamily: 'Outfit',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          margin: 0
                        }}
                      >
                        Edit the changelog for each version. Version numbers are automatically loaded from the plugin's YML file.
                      </p>
                      <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginTop: '16px' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* New Version Card - appears at top when editing */}
                      {showNewVersionEditor && (
                        <div style={{
                          backgroundColor: 'white',
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          padding: '24px',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            fontFamily: 'Outfit',
                            color: '#111827',
                            margin: '0 0 20px 0'
                          }}>
                            Upload a new version
                          </h3>
                          
                          {/* Plugin File Upload */}
                          <div style={{ marginBottom: '24px' }}>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#333',
                              marginBottom: '8px',
                              fontFamily: 'Outfit'
                            }}>
                              Plugin File <span style={{ color: '#F47579' }}>*</span>
                            </label>
                            
                            <div style={{ display: 'flex', gap: 0, marginBottom: '20px', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden', width: 'fit-content' }}>
                              <button 
                                onClick={() => setUploadMethod('local')}
                                style={{
                                  padding: '10px 20px',
                                  background: uploadMethod === 'local' ? '#0089D4' : 'white',
                                  color: uploadMethod === 'local' ? 'white' : '#666',
                                  border: 'none',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  borderRight: '1px solid #ddd',
                                  fontFamily: 'Outfit'
                                }}
                              >
                                Upload from local
                              </button>
                              <button 
                                onClick={() => setUploadMethod('github')}
                                style={{
                                  padding: '10px 20px',
                                  background: uploadMethod === 'github' ? '#0089D4' : 'white',
                                  color: uploadMethod === 'github' ? 'white' : '#666',
                                  border: 'none',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  fontFamily: 'Outfit'
                                }}
                              >
                                GitHub
                              </button>
                            </div>
                            
                            {uploadMethod === 'local' ? (
                              <div style={{ marginBottom: '16px' }}>
                                <input
                                  type="file"
                                  id="plugin-file"
                                  accept=".zip"
                                  onChange={handleFileUpload}
                                  style={{ display: 'none' }}
                                />
                                <label htmlFor="plugin-file" style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight: '140px',
                                  border: '2px dashed #d4d4d4',
                                  borderRadius: '8px',
                                  background: '#fafafa',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  textAlign: 'center',
                                  padding: '24px'
                                }}>
                                  <div style={{ fontSize: '48px', marginBottom: '12px', color: '#666' }}>📁</div>
                                  <div style={{ fontSize: '16px', color: '#333', marginBottom: '8px', fontWeight: 400, fontFamily: 'Outfit' }}>
                                    {newVersionData.file ? newVersionData.file.name : 'Click or drag file to this area to upload'}
                                  </div>
                                  <div style={{ fontSize: '14px', color: '#999', fontFamily: 'Outfit' }}>ZIP file up to 50MB</div>
                                </label>
                                {newVersionData.file && (
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '12px',
                                    padding: '12px 16px',
                                    background: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    color: '#333',
                                    fontWeight: 500,
                                    fontFamily: 'Outfit'
                                  }}>
                                    📎 {newVersionData.file.name}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div style={{ marginBottom: '16px' }}>
                                <input
                                  type="url"
                                  name="githubUrl"
                                  value={newVersionData.githubUrl}
                                  onChange={handleNewVersionInputChange}
                                  placeholder="https://github.com/username/repository"
                                  style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontFamily: 'Outfit'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          
                          {/* Version */}
                          <div style={{ marginBottom: '24px' }}>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#333',
                              marginBottom: '8px',
                              fontFamily: 'Outfit'
                            }}>Version</label>
                            <input
                              type="text"
                              name="version"
                              value={newVersionData.version || 'Version 1.0.0'}
                              onChange={handleNewVersionInputChange}
                              placeholder="Version 1.0.0"
                              readOnly
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #e5e5e5',
                                borderRadius: '4px',
                                fontSize: '14px',
                                background: '#f5f5f5',
                                color: '#666',
                                fontFamily: 'Outfit'
                              }}
                            />
                            <p style={{
                              fontSize: '13px',
                              color: '#666',
                              margin: '8px 0 0 0',
                              lineHeight: 1.4,
                              fontFamily: 'Outfit'
                            }}>
                              Version numbers are automatically loaded from the plugin's YML file — see <span style={{ color: '#0089D4', textDecoration: 'none', cursor: 'pointer' }}>documentation</span> for details.
                            </p>
                          </div>
                          
                          {/* Release Notes */}
                          <div style={{ marginBottom: '24px' }}>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#333',
                              marginBottom: '8px',
                              fontFamily: 'Outfit'
                            }}>Release Notes</label>
                            <textarea
                              name="releaseNotes"
                              value={newVersionData.releaseNotes}
                              onChange={handleNewVersionInputChange}
                              placeholder="Type your message"
                              rows="4"
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                resize: 'vertical',
                                fontFamily: 'Outfit'
                              }}
                            />
                            <p style={{
                              fontSize: '13px',
                              color: '#666',
                              margin: '8px 0 0 0',
                              fontFamily: 'Outfit'
                            }}>
                              Describe what changed in this version for users
                            </p>
                          </div>
                          
                          {/* Version Labels */}
                          <div style={{ marginBottom: '32px' }}>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#333',
                              marginBottom: '8px',
                              fontFamily: 'Outfit'
                            }}>Version Labels</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                              {[
                                { name: 'Bug Fix', color: '#FFE6E6', textColor: '#D32F2F', width: '62px' },
                                { name: 'New Feature', color: '#FFF3E0', textColor: '#F57C00', width: '96px' },
                                { name: 'Doc Update', color: '#E6F0FF', textColor: '#1976D2', width: '91px' },
                                { name: 'UI Update', color: '#FFE6F5', textColor: '#C2185B', width: '79px' }
                              ].map(label => (
                                <button
                                  key={label.name}
                                  onClick={() => toggleVersionLabel(label.name)}
                                  style={{
                                    display: 'flex',
                                    height: '28px',
                                    width: label.width,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexShrink: 0,
                                    borderRadius: '14px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    fontFamily: 'Outfit',
                                    cursor: 'pointer',
                                    border: newVersionData.labels.includes(label.name) ? '2px solid currentColor' : '2px solid transparent',
                                    backgroundColor: label.color,
                                    color: label.textColor,
                                    opacity: newVersionData.labels.includes(label.name) ? 1 : 0.5,
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {label.name}
                                </button>
                              ))}
                            </div>
                            <p style={{
                              fontSize: '13px',
                              color: '#666',
                              margin: 0,
                              fontFamily: 'Outfit'
                            }}>
                              Choose labels to describe this update (e.g., bug fix, new feature).
                            </p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center'
                          }}>
                            <button
                              onClick={handleSaveNewVersion}
                              style={{
                                padding: '12px 24px',
                                background: '#0DA7D4',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                fontFamily: 'Outfit'
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelNewVersion}
                              style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#666',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontFamily: 'Outfit'
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDeleteNewVersion}
                              style={{
                                padding: '12px 24px',
                                background: '#F47579',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                marginLeft: 'auto',
                                fontFamily: 'Outfit'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {selectedPlugin?.changelog?.map((version, index) => {
                        const isEditing = editingVersionIndex === index;
                        
                        return (
                          <div 
                            key={index}
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              padding: '24px',
                              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {!isEditing ? (
                              // Display Mode
                              <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                  <div>
                                    <h3 style={{
                                      fontSize: '18px',
                                      fontWeight: 600,
                                      fontFamily: 'Outfit',
                                      color: '#111827',
                                      margin: '0 0 4px 0'
                                    }}>
                                      Version {version.version}
                                    </h3>
                                    <p style={{
                                      fontSize: '14px',
                                      color: '#6B7280',
                                      fontFamily: 'Outfit',
                                      margin: 0
                                    }}>
                                      {version.date}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleVersionEdit(index, version)}
                                    style={{
                                      padding: '8px 16px',
                                      borderRadius: 'var(--radius-pc-md, 6px)',
                                      background: 'var(--Secondary-main, #F5F5F5)',
                                      color: '#374151',
                                      border: 'none',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      fontFamily: 'Outfit',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Edit
                                  </button>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                  {version.tags.map((tag, tagIndex) => {
                                    const getTagWidth = (tag) => {
                                      switch(tag) {
                                        case 'Bug Fix': return '62px';
                                        case 'New Feature': return '96px';
                                        case 'Doc Update': return '91px';
                                        case 'UI Update': return '79px';
                                        default: return 'auto';
                                      }
                                    };

                                    return (
                                      <span 
                                        key={tagIndex}
                                        style={{
                                          display: 'inline-block',
                                          padding: '4px 8px',
                                          backgroundColor: '#F3F4F6',
                                          color: '#374151',
                                          fontSize: '12px',
                                          borderRadius: '4px',
                                          fontFamily: 'Outfit',
                                          fontWeight: 500,
                                          width: getTagWidth(tag),
                                          textAlign: 'center'
                                        }}
                                      >
                                        {tag}
                                      </span>
                                    );
                                  })}
                                </div>

                                <div style={{
                                  fontSize: '14px',
                                  lineHeight: '1.6',
                                  fontFamily: 'Outfit',
                                  color: '#374151',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: version.expanded ? 'none' : 2
                                }}>
                                  {version.content}
                                </div>

                                {version.content.length > 150 && (
                                  <button
                                    onClick={() => {
                                      // Toggle expanded state
                                      const updatedPlugin = {
                                        ...selectedPlugin,
                                        changelog: selectedPlugin.changelog.map((v, i) => 
                                          i === index ? { ...v, expanded: !v.expanded } : v
                                        )
                                      };
                                      setSelectedPlugin(updatedPlugin);
                                    }}
                                    style={{
                                      marginTop: '12px',
                                      padding: '4px 0',
                                      backgroundColor: 'transparent',
                                      color: 'var(--reearth-sky-600, #1483B5)',
                                      border: 'none',
                                      fontFamily: 'Outfit',
                                      fontSize: '14px',
                                      fontStyle: 'normal',
                                      fontWeight: 400,
                                      lineHeight: '140%',
                                      cursor: 'pointer',
                                      textDecoration: 'underline'
                                    }}
                                  >
                                    {version.expanded ? 'Show less' : 'Show more'}
                                  </button>
                                )}

                              </>
                            ) : (
                              // Edit Mode
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {/* Header */}
                                <div style={{ marginBottom: '14px' }}>
                                  <h2 style={{
                                    color: 'var(--background-4, #404040)',
                                    fontFamily: 'Outfit',
                                    fontSize: '20px',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    lineHeight: '140%',
                                    margin: '0'
                                  }}>
                                    Edit Version {editingVersionData.version}
                                  </h2>
                                </div>

                                {/* Version Input */}
                                <div style={{ marginBottom: '24px' }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    fontFamily: 'Outfit',
                                    color: '#111827',
                                    marginBottom: '8px'
                                  }}>
                                    Version
                                  </label>
                                  <input
                                    type="text"
                                    value={editingVersionData.version}
                                    onChange={(e) => setEditingVersionData(prev => ({ ...prev, version: e.target.value }))}
                                    disabled
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      border: '1px solid #E5E7EB',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      fontFamily: 'Outfit',
                                      backgroundColor: '#F9FAFB',
                                      color: '#9CA3AF'
                                    }}
                                    placeholder="Version 2.1.3"
                                  />
                                  <p style={{
                                    fontSize: '14px',
                                    color: '#6B7280',
                                    fontFamily: 'Outfit',
                                    margin: '8px 0 0 0'
                                  }}>
                                    Version numbers are automatically loaded from the plugin's YML file — see <a href="#" style={{ color: '#0089D4', textDecoration: 'none' }}>documentation</a> for details.
                                  </p>
                                </div>

                                {/* Release Notes */}
                                <div style={{ marginBottom: '24px' }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    fontFamily: 'Outfit',
                                    color: '#111827',
                                    marginBottom: '8px'
                                  }}>
                                    Release Notes
                                  </label>
                                  <textarea
                                    value={editingVersionData.releaseNotes}
                                    onChange={(e) => setEditingVersionData(prev => ({ ...prev, releaseNotes: e.target.value }))}
                                    style={{
                                      width: '100%',
                                      minHeight: '120px',
                                      padding: '12px 16px',
                                      border: '1px solid #E5E7EB',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      fontFamily: 'Outfit',
                                      resize: 'vertical',
                                      backgroundColor: '#F9FAFB'
                                    }}
                                    placeholder="What's New&#10;- Major update introducing a comprehensive&#10;material library with 50+ high-quality, physically&#10;accurate building materials&#10;- New dynamic lighting system with support for&#10;real-time lighting adjustments..."
                                  />
                                  <p style={{
                                    fontSize: '14px',
                                    color: '#6B7280',
                                    fontFamily: 'Outfit',
                                    margin: '8px 0 0 0'
                                  }}>
                                    Describe what changed in this version for users
                                  </p>
                                </div>

                                {/* Version Labels */}
                                <div style={{ marginBottom: '24px' }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    fontFamily: 'Outfit',
                                    color: '#111827',
                                    marginBottom: '8px'
                                  }}>
                                    Version Labels
                                  </label>
                                  <div style={{ 
                                    display: 'flex', 
                                    gap: '12px', 
                                    flexWrap: 'wrap',
                                    padding: '16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '6px',
                                    backgroundColor: '#F9FAFB'
                                  }}>
                                    {['Bug Fix', 'New Feature', 'Doc Update', 'UI Update'].map((label) => {
                                      const isSelected = editingVersionData.labels.includes(label);
                                      const getLabelColor = (label) => {
                                        switch(label) {
                                          case 'Bug Fix': return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' };
                                          case 'New Feature': return { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' };
                                          case 'Doc Update': return { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' };
                                          case 'UI Update': return { bg: '#FCE7F3', text: '#DB2777', border: '#F9A8D4' };
                                          default: return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
                                        }
                                      };
                                      
                                      const colors = getLabelColor(label);
                                      
                                      return (
                                        <button
                                          key={label}
                                          onClick={() => handleVersionLabelToggle(label)}
                                          style={{
                                            padding: '8px 14px',
                                            backgroundColor: isSelected ? colors.bg : '#FFFFFF',
                                            color: isSelected ? colors.text : '#6B7280',
                                            border: `1px solid ${isSelected ? colors.border : '#E5E7EB'}`,
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            fontFamily: 'Outfit',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            minHeight: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                          }}
                                        >
                                          {label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <p style={{
                                    fontSize: '14px',
                                    color: '#6B7280',
                                    fontFamily: 'Outfit',
                                    margin: '8px 0 0 0'
                                  }}>
                                    Choose labels to describe this update (e.g., bug fix, new feature).
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '12px',
                                  justifyContent: 'flex-start'
                                }}>
                                  <button
                                    onClick={handleVersionSave}
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
                                    Save
                                  </button>
                                  <button
                                    onClick={handleVersionCancel}
                                    style={{
                                      padding: '12px 24px',
                                      backgroundColor: '#F3F4F6',
                                      color: '#374151',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      fontFamily: 'Outfit',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Danger Zone Section */}
                  <div ref={dangerZoneRef} data-section="Danger Zone" style={{ scrollMarginTop: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <h2 
                        id="danger-zone"
                        tabIndex="-1"
                        style={{
                          fontSize: '20px',
                          fontWeight: 600,
                          fontFamily: 'Outfit',
                          color: '#111827',
                          marginBottom: '8px',
                          scrollMarginTop: '24px',
                          outline: 'none'
                        }}
                      >
                        Danger Zone
                      </h2>
                      <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginTop: '16px' }}></div>
                    </div>

                    <div style={{
                      display: 'flex',
                      width: '704px',
                      padding: '20px 24px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '14px',
                      borderRadius: '8px',
                      border: '1px solid #F47579',
                      background: '#FFF',
                      boxShadow: '2px 2px 2px rgba(0,0,0,0.05)'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        fontFamily: 'Outfit',
                        color: '#111827',
                        margin: 0
                      }}>
                        Delete this plugin
                      </h3>
                      
                      <button
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#F47579',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily: 'Outfit',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>

                      <div style={{
                        color: '#737373',
                        fontFamily: 'Outfit',
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}>
                        <p style={{ margin: '0 0 12px 0' }}>
                          You are about to delete this plugin. This action is irreversible and will immediately remove the plugin from the marketplace and all workspaces.
                        </p>
                        <p style={{ margin: '0 0 12px 0' }}>
                          All associated data will be permanently deleted and cannot be recovered.
                        </p>
                        <p style={{ margin: '0 0 12px 0' }}>
                          If you're only taking a break, consider setting the plugin to draft instead.
                        </p>
                        <p style={{ margin: 0 }}>
                          For assistance, please contact{' '}
                          <a 
                            href="mailto:support@reearth.io"
                            style={{
                              color: '#0089D4',
                              textDecoration: 'none'
                            }}
                          >
                            support@reearth.io
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Moved to end of form */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    paddingTop: '20px',
                    marginTop: '0px',
                    borderTop: '1px solid #E5E7EB',
                    justifyContent: 'flex-start'
                  }}>
                    <button
                      onClick={handleSave}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#1483B5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'Outfit',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handlePreview}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: 'white',
                        color: '#1483B5',
                        border: '1px solid #1483B5',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'Outfit',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#1483B5';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#1483B5';
                      }}
                    >
                      Preview
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'Outfit',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Editor Modal */}
      {showImageEditor && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeImageEditor}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'Outfit',
                color: '#111827',
                margin: 0
              }}>
                Edit Image
              </h3>
              <button
                onClick={closeImageEditor}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Image Preview and Canvas */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              {/* Hidden original image for reference */}
              <img
                ref={imageRef}
                src={editingImage}
                alt="Original"
                style={{ display: 'none' }}
                crossOrigin="anonymous"
              />

              {/* Canvas for preview */}
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: '640px',
                  maxHeight: '400px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />

              {/* Controls */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
                maxWidth: '400px'
              }}>
                {/* Crop Controls */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Outfit',
                    color: '#111827',
                    marginBottom: '8px'
                  }}>
                    Crop Area (16:10 aspect ratio)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Outfit' }}>X Position (%)</label>
                      <input
                        type="range"
                        min="0"
                        max={100 - imageEditorData.crop.width}
                        value={imageEditorData.crop.x}
                        onChange={(e) => handleCropChange({
                          ...imageEditorData.crop,
                          x: parseFloat(e.target.value)
                        })}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Outfit' }}>Y Position (%)</label>
                      <input
                        type="range"
                        min="0"
                        max={100 - imageEditorData.crop.height}
                        value={imageEditorData.crop.y}
                        onChange={(e) => handleCropChange({
                          ...imageEditorData.crop,
                          y: parseFloat(e.target.value)
                        })}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Outfit' }}>Width (%)</label>
                      <input
                        type="range"
                        min="10"
                        max={100 - imageEditorData.crop.x}
                        value={imageEditorData.crop.width}
                        onChange={(e) => {
                          const width = parseFloat(e.target.value);
                          handleCropChange({
                            ...imageEditorData.crop,
                            width,
                            height: width * 0.625 // Maintain 16:10 aspect ratio
                          });
                        }}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Outfit' }}>Height (%)</label>
                      <input
                        type="range"
                        min="6.25"
                        max={100 - imageEditorData.crop.y}
                        value={imageEditorData.crop.height}
                        onChange={(e) => {
                          const height = parseFloat(e.target.value);
                          handleCropChange({
                            ...imageEditorData.crop,
                            height,
                            width: height * 1.6 // Maintain 16:10 aspect ratio
                          });
                        }}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Rotation Control */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Outfit',
                    color: '#111827',
                    marginBottom: '8px'
                  }}>
                    Rotation: {imageEditorData.rotation}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={imageEditorData.rotation}
                    onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Scale Control */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Outfit',
                    color: '#111827',
                    marginBottom: '8px'
                  }}>
                    Scale: {Math.round(imageEditorData.scale * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={imageEditorData.scale}
                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={closeImageEditor}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={applyImageEdit}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#00A2EA',
                    color: 'white',
                    fontSize: '14px',
                    fontFamily: 'Outfit',
                    cursor: 'pointer'
                  }}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeveloperPortal;