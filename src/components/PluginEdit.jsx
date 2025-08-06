import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, FileText, GitBranch, AlertTriangle, Plus, Upload } from 'lucide-react';
import DashboardNav from './DashboardNav';
import { pluginData } from '../data/pluginData';

const PluginEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('General');

  // Find the plugin data based on the ID from URL params
  const currentPlugin = pluginData.find(p => p.id.toString() === id) || pluginData[0];
  
  // Company to workspace mapping
  const companyToWorkspace = {
    '株式会社福山コンサルタント': 'fukuyama-consultant',
    '気象データ株式会社': 'weather-data',
    'センサー技術株式会社': 'sensor-tech',
    'GeoVision Labs': 'geovision-labs',
    'モビリソリューション': 'mobili-solution',
    '環境テクノロジー株式会社': 'enviro-tech',
    'EnviroNode': 'enviro-node',
    'ChronoMaps Studio': 'chrono-maps'
  };

  const [pluginFormData, setPluginFormData] = useState({
    name: currentPlugin.title,
    status: 'Public',
    description: currentPlugin.description,
    functionTags: currentPlugin.tags.slice(0, 3),
    images: [
      currentPlugin.image,
      ...(currentPlugin.gallery ? currentPlugin.gallery.slice(1, 3) : [])
    ],
    readme: `# 🏙️ 3D Building Visualization

**3D Building Visualization** is a powerful plugin designed to enhance urban planning workflows through immersive 3D representations of buildings and cityscapes. Perfect for architects, city planners, and disaster management teams, it provides real-time visualization of infrastructure within your Visualizer project.

---

## ✨ Features

- 🏗️ Render realistic 3D building models from geospatial data  
- 📊 Integrate zoning, demographic, or utility data overlays  
- 🔄 Real-time updates for planning simulations and stakeholder presentations  
- 🚧 Use in conjunction with disaster planning or development analysis tools  

---

## 📦 Use Cases

- City development and zoning meetings  
- Urban resilience planning and simulation  
- Architectural concept visualization  
- Interactive presentations for public and governmental review  

---

## 🏷️ Tags

\`Urban Planning\` \`防災\` \`データビジュアライザー\`

---

## 🚀 Getting Started

1. Add the plugin to your Visualizer workspace  
2. Upload or connect to your 3D building dataset (e.g., CityGML, GeoJSON)  
3. Configure layers and styling from the plugin settings  
4. Start exploring your city in 3D!

---

## 📄 License

MIT License © 2025 YourCompanyName

---

## 📬 Support

Have questions or feature requests?  
Contact us at: [support@yourdomain.com](mailto:support@yourdomain.com)`
  });
  const [newTag, setNewTag] = useState('');
  const [readmeMode, setReadmeMode] = useState('preview'); // 'edit' or 'preview'
  const [tempReadme, setTempReadme] = useState('');
  const [versions, setVersions] = useState([
    {
      id: 1,
      version: '2.1.3',
      content: 'Performance improvements and bug fixes to enhance user experience. Fixed memory leaks, improved rendering performance by 25%, and resolved browser compatibility issues for smoother visualization workflows. Updated documentation with new API examples and enhanced user interface with better accessibility features.',
      tags: ['Bug Fix', 'Doc Update', 'UI Update'],
      isEditing: false,
      isExpanded: false
    },
    {
      id: 2,
      version: '2.1.0',
      content: 'Major update introducing comprehensive material library with 50+ realistic building materials and dynamic lighting system. Features include sun position simulation, shadow casting, and real-time atmospheric effects for enhanced realism.',
      tags: ['New Feature'],
      isEditing: false,
      isExpanded: false
    },
    {
      id: 3,
      version: '1.9.2',
      content: 'Comprehensive user interface improvements focusing on usability and accessibility. Redesigned control panels, added keyboard shortcuts, enhanced mobile responsiveness, and improved screen reader support for better inclusive design.',
      tags: ['UI Update'],
      isEditing: false,
      isExpanded: false
    },
    {
      id: 4,
      version: '1.9.0',
      content: 'Enhanced data handling capabilities with support for BIM file formats (IFC, RVT), automatic Level of Detail generation, improved GeoJSON parsing, and batch processing capabilities for handling large-scale architectural datasets efficiently.',
      tags: ['New Feature', 'Doc Update'],
      isEditing: false,
      isExpanded: false
    }
  ]);
  const fileInputRef = useRef(null);
  const newVersionFileInputRef = useRef(null);
  const [newVersionData, setNewVersionData] = useState({
    file: null,
    githubUrl: '',
    uploadMethod: 'local',
    releaseNotes: '',
    versionLabels: []
  });
  const [dragActive, setDragActive] = useState(false);

  const sidebarItems = [
    { id: 'General', label: 'General', icon: FileText, active: true },
    { id: 'README', label: 'README', icon: FileText, active: false },
    { id: 'Version', label: 'Version', icon: GitBranch, active: false },
    { id: 'Danger Zone', label: 'Danger Zone', icon: AlertTriangle, active: false }
  ];


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
    console.log('Saving plugin data:', pluginData);
    // Add save logic here
    navigate(`/plugin/${id}`);
  };

  const handleCancel = () => {
    navigate(`/plugin/${id}`);
  };


  const handleReadmeSave = () => {
    setPluginFormData(prev => ({ ...prev, readme: tempReadme }));
    setReadmeMode('preview');
  };

  const handleReadmeCancel = () => {
    setTempReadme('');
    setReadmeMode('preview');
  };

  const handleVersionEdit = (versionId) => {
    setVersions(prev => prev.map(v => 
      v.id === versionId ? { ...v, isEditing: true, tempContent: v.content, tempTags: [...v.tags] } : v
    ));
  };

  const handleVersionSave = (versionId) => {
    setVersions(prev => prev.map(v => {
      if (v.id === versionId) {
        if (v.isNewVersion) {
          // For new versions, use data from newVersionData
          return {
            ...v, 
            isEditing: false, 
            isNewVersion: false, // Remove new version flag
            content: newVersionData.releaseNotes, 
            tags: newVersionData.versionLabels,
            tempContent: undefined,
            tempTags: undefined
          };
        } else {
          // For existing versions, use temp data
          return { 
            ...v, 
            isEditing: false, 
            content: v.tempContent, 
            tags: v.tempTags,
            tempContent: undefined,
            tempTags: undefined
          };
        }
      }
      return v;
    }));
  };

  const handleVersionCancel = (versionId) => {
    setVersions(prev => prev.map(v => 
      v.id === versionId ? { 
        ...v, 
        isEditing: false, 
        tempContent: undefined,
        tempTags: undefined
      } : v
    ).filter(v => !(v.id === versionId && v.isNewVersion)));
    // Reset new version data if canceling a new version
    const cancelingVersion = versions.find(v => v.id === versionId);
    if (cancelingVersion?.isNewVersion) {
      setNewVersionData({
        file: null,
        githubUrl: '',
        uploadMethod: 'local',
        releaseNotes: '',
        versionLabels: []
      });
    }
  };

  const handleVersionChange = (versionId, newContent) => {
    setVersions(prev => prev.map(v => 
      v.id === versionId ? { ...v, tempContent: newContent } : v
    ));
  };

  const handleNewVersion = () => {
    const newVersion = {
      id: Math.max(...versions.map(v => v.id)) + 1,
      version: '2.2.0', // This would be generated from YML file
      content: '',
      tags: [],
      isEditing: true,
      tempContent: '',
      tempTags: [],
      isExpanded: false,
      isNewVersion: true // Mark as new version to show upload form
    };
    setVersions([newVersion, ...versions]);
    // Reset new version data
    setNewVersionData({
      file: null,
      githubUrl: '',
      uploadMethod: 'local',
      releaseNotes: '',
      versionLabels: []
    });
  };

  const handleTagToggle = (versionId, tag) => {
    setVersions(prev => prev.map(v => {
      if (v.id === versionId) {
        const currentTags = v.tempTags || v.tags;
        const newTags = currentTags.includes(tag)
          ? currentTags.filter(t => t !== tag)
          : [...currentTags, tag];
        return { ...v, tempTags: newTags };
      }
      return v;
    }));
  };

  const getTagStyle = (tag) => {
    const baseStyle = {
      display: 'flex',
      height: '28px',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      borderRadius: '14px',
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: 'Outfit',
      cursor: 'pointer',
      border: 'none'
    };

    switch (tag) {
      case 'Bug Fix':
        return {
          ...baseStyle,
          width: '62px',
          backgroundColor: '#FFE6E6',
          color: '#D32F2F'
        };
      case 'New Feature':
        return {
          ...baseStyle,
          width: '96px',
          backgroundColor: '#FFF3E0',
          color: '#F57C00'
        };
      case 'Doc Update':
        return {
          ...baseStyle,
          width: '91px',
          backgroundColor: '#E6F0FF',
          color: '#1976D2'
        };
      case 'UI Update':
        return {
          ...baseStyle,
          width: '79px',
          backgroundColor: '#FFE6F5',
          color: '#C2185B'
        };
      default:
        return {
          ...baseStyle,
          width: '62px',
          backgroundColor: '#F5F5F5',
          color: '#666666'
        };
    }
  };

  const toggleVersionExpanded = (versionId) => {
    setVersions(prev => prev.map(v => 
      v.id === versionId ? { ...v, isExpanded: !v.isExpanded } : v
    ));
  };

  // New version upload handlers
  const handleNewVersionFileChange = (e) => {
    const file = e.target.files[0];
    setNewVersionData(prev => ({
      ...prev,
      file
    }));
  };

  const handleNewVersionDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleNewVersionDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleNewVersionDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleNewVersionDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setNewVersionData(prev => ({
          ...prev,
          file
        }));
      }
    }
  };

  const handleNewVersionLabelToggle = (label) => {
    setNewVersionData(prev => ({
      ...prev,
      versionLabels: prev.versionLabels.includes(label)
        ? prev.versionLabels.filter(l => l !== label)
        : [...prev.versionLabels, label]
    }));
  };

  const [markedLoaded, setMarkedLoaded] = useState(false);

  useEffect(() => {
    // Load marked library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.async = true;
    script.onload = () => setMarkedLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const renderMarkdown = (text) => {
    // If marked is loaded, use it for better rendering
    if (markedLoaded && window.marked) {
      return window.marked.parse(text);
    }

    // Fallback to simple markdown rendering
    let html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-gray-300 my-4">')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$1. $2</li>')
      // Line breaks
      .replace(/\n/g, '<br>');

    return html;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
      {/* Header */}
      <DashboardNav />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="text-sm" style={{ fontFamily: 'Outfit' }}>
            <button
              onClick={() => navigate(`/workspace/${companyToWorkspace[currentPlugin.company]}`)}
              className="hover:underline"
              style={{ 
                color: 'var(--function-link, #0089D4)',
                fontFamily: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(currentPlugin.company) ? '"Noto Sans JP"' : 'Outfit',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '140%',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              {currentPlugin.company}
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{currentPlugin.title}</span>
          </div>
        </nav>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = item.id === activeSection;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${item.id === 'General' ? 'rounded-t-lg' : ''} ${item.id === 'Danger Zone' ? 'rounded-b-lg' : ''}`}
                    style={{ 
                      fontFamily: 'Outfit', 
                      fontSize: '14px', 
                      fontWeight: 500,
                      backgroundColor: isActive ? '#2CC3FF' : 'transparent'
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h1 
                    className="text-2xl font-semibold text-gray-900"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    {activeSection}
                  </h1>
                  {activeSection === 'Version' && (
                    <button
                      onClick={handleNewVersion}
                      className="text-white rounded-md hover:opacity-90 focus:outline-none"
                      style={{
                        display: 'flex',
                        padding: '8px 16px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '6px',
                        backgroundColor: '#00A2EA',
                        fontFamily: 'Outfit',
                        fontSize: '14px',
                        fontWeight: 500
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      New version
                    </button>
                  )}
                </div>
                <p 
                  style={{ 
                    color: 'var(--text-default, #0A0A0A)',
                    fontFamily: 'Outfit',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '140%'
                  }}
                >
                  {activeSection === 'General' && 'General and Basic Settings of the Project'}
                  {activeSection === 'README' && 'This will be shown as the plugin\'s Overview—describe what it does and how to use it.'}
                  {activeSection === 'Version' && 'Edit the changelog for each version. Version numbers are automatically loaded from the plugin\'s YML file.'}
                  {activeSection === 'Danger Zone' && ''}
                </p>
                <div className="mt-4 border-b border-gray-200"></div>
              </div>

              {/* Content based on active section */}
              {activeSection === 'General' && (
                <div className="space-y-8">
                {/* Plugin Status */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-900 mb-3"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Plugin Status <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={handleStatusToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    style={{
                      backgroundColor: pluginFormData.status === 'Public' ? '#2CC3FF' : '#E5E7EB'
                    }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pluginFormData.status === 'Public' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span 
                    className="ml-3 text-sm font-medium text-gray-900"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    {pluginFormData.status}
                  </span>
                </div>

                {/* Plugin Name */}
                <div>
                  <label 
                    htmlFor="pluginName"
                    className="block text-sm font-medium text-gray-900 mb-3"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Plugin Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pluginName"
                    value={pluginFormData.name}
                    onChange={(e) => setPluginFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                  />
                </div>

                {/* Plugin Image */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-900 mb-3"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Plugin Image <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="mb-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                      style={{ fontFamily: 'Outfit' }}
                    >
                      Choose File
                    </button>
                    <span 
                      className="ml-3 text-sm text-gray-500"
                      style={{ fontFamily: 'Outfit' }}
                    >
                      No file chosen
                    </span>
                  </div>

                  <p 
                    className="text-sm text-gray-500 mb-4"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Upload at least one plugin screenshot or cover image (Recommended: 1280×800 pixels)
                  </p>

                  {/* Image Preview */}
                  <div className="flex gap-3">
                    {pluginFormData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Plugin ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label 
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-900 mb-3"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={pluginFormData.description}
                    onChange={(e) => setPluginFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                  />
                  <p 
                    className="mt-2 text-sm text-gray-500"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Provide a detailed description of what your plugin does and its key features.
                  </p>
                </div>

                {/* Function Tag */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-900 mb-3"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Function Tag
                  </label>
                  
                  {/* Existing Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pluginFormData.functionTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add New Tag */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 text-white rounded-md hover:opacity-90 focus:outline-none"
                      style={{ fontFamily: 'Outfit', fontSize: '14px', backgroundColor: '#00A2EA' }}
                    >
                      Add
                    </button>
                  </div>
                  
                  <p 
                    className="mt-2 text-sm text-gray-500"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    Add function tags to help users discover your plugin. Separate multiple tags with commas.
                  </p>
                </div>
              </div>
              )}

              {/* README Section */}
              {activeSection === 'README' && (
                <div>
                  {/* Markdown Editor Container */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Edit/Preview Tabs */}
                    <div className="flex border-b border-gray-300 bg-gray-50">
                      <button
                        onClick={() => {
                          if (readmeMode === 'preview') {
                            setTempReadme(pluginFormData.readme);
                          }
                          setReadmeMode('edit');
                        }}
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                          readmeMode === 'edit'
                            ? 'text-gray-900 bg-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        style={{ fontFamily: 'Outfit' }}
                      >
                        Edit
                        {readmeMode === 'edit' && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (readmeMode === 'edit' && tempReadme) {
                            setPluginFormData(prev => ({ ...prev, readme: tempReadme }));
                          }
                          setReadmeMode('preview');
                        }}
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                          readmeMode === 'preview'
                            ? 'text-gray-900 bg-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        style={{ fontFamily: 'Outfit' }}
                      >
                        Preview
                        {readmeMode === 'preview' && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                        )}
                      </button>
                    </div>

                    {/* Content Area */}
                    <div style={{ height: '526px', overflow: 'hidden', backgroundColor: 'white' }}>
                      {/* Edit Mode */}
                      {readmeMode === 'edit' && (
                        <textarea
                          value={tempReadme || pluginFormData.readme}
                          onChange={(e) => setTempReadme(e.target.value)}
                          className="w-full h-full p-4 border-0 resize-none focus:outline-none font-mono"
                          style={{ 
                            fontSize: '14px', 
                            lineHeight: '1.6',
                            fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
                          }}
                          placeholder="Type your markdown here..."
                        />
                      )}

                      {/* Preview Mode */}
                      {readmeMode === 'preview' && (
                        <div 
                          className="h-full overflow-y-auto p-4 markdown-preview"
                          style={{ fontFamily: 'Outfit', fontSize: '14px', lineHeight: '1.6' }}
                        >
                          <style jsx>{`
                            .markdown-preview h1 {
                              font-size: 28px;
                              font-weight: 600;
                              margin-bottom: 16px;
                              padding-bottom: 8px;
                              border-bottom: 1px solid #eee;
                            }
                            .markdown-preview h2 {
                              font-size: 22px;
                              font-weight: 600;
                              margin-top: 24px;
                              margin-bottom: 12px;
                            }
                            .markdown-preview h3 {
                              font-size: 18px;
                              font-weight: 600;
                              margin-top: 20px;
                              margin-bottom: 10px;
                            }
                            .markdown-preview p {
                              margin-bottom: 12px;
                            }
                            .markdown-preview ul,
                            .markdown-preview ol {
                              margin-bottom: 12px;
                              padding-left: 24px;
                            }
                            .markdown-preview li {
                              margin-bottom: 4px;
                            }
                            .markdown-preview code {
                              background-color: #f6f8fa;
                              padding: 2px 4px;
                              border-radius: 3px;
                              font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                              font-size: 85%;
                            }
                            .markdown-preview pre {
                              background-color: #f6f8fa;
                              padding: 12px;
                              border-radius: 6px;
                              overflow-x: auto;
                              margin-bottom: 12px;
                            }
                            .markdown-preview pre code {
                              background-color: transparent;
                              padding: 0;
                            }
                            .markdown-preview blockquote {
                              border-left: 4px solid #dfe2e5;
                              padding-left: 16px;
                              color: #6a737d;
                              margin-bottom: 12px;
                            }
                            .markdown-preview hr {
                              border: 0;
                              height: 1px;
                              background-color: #e1e4e8;
                              margin: 24px 0;
                            }
                            .markdown-preview strong {
                              font-weight: 600;
                            }
                            .markdown-preview em {
                              font-style: italic;
                            }
                            .markdown-preview a {
                              color: #0066cc;
                              text-decoration: none;
                            }
                            .markdown-preview a:hover {
                              text-decoration: underline;
                            }
                          `}</style>
                          <div 
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(pluginFormData.readme) }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons for README */}
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleReadmeSave}
                      className="text-white px-6 py-2 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      style={{ fontFamily: 'Outfit', backgroundColor: '#00A2EA' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleReadmeCancel}
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      style={{ fontFamily: 'Outfit' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Version Section */}
              {activeSection === 'Version' && (
                <div className="space-y-4">
                    {versions.map((version) => (
                      <div 
                        key={version.id} 
                        style={{
                          display: 'flex',
                          padding: '20px 24px',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '14px',
                          alignSelf: 'stretch',
                          borderRadius: '8px',
                          border: '1px solid #D4D4D4',
                          background: '#FFF',
                          boxShadow: '2px 2px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="flex items-center gap-3">
                            <h3 
                              className="text-lg font-semibold text-gray-900"
                              style={{ fontFamily: 'Outfit' }}
                            >
                              Version {version.version}
                            </h3>
                            {!version.isEditing && version.tags && version.tags.length > 0 && (
                              <div className="flex gap-2">
                                {version.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    style={getTagStyle(tag)}
                                  >
                                    {tag === 'Bug Fix' ? 'Bug Fix' : 
                                     tag === 'New Feature' ? 'New Feature' : 
                                     tag === 'Doc Update' ? 'Doc Update' : 
                                     'UI Update'}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {!version.isEditing && (
                            <button
                              onClick={() => handleVersionEdit(version.id)}
                              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                              style={{ fontFamily: 'Outfit' }}
                            >
                              Edit
                            </button>
                          )}
                        </div>

                        {version.isEditing ? (
                          <div className="w-full space-y-6">
                            {/* Upload section for new versions */}
                            {version.isNewVersion && (
                              <div className="space-y-6">
                                {/* Plugin File Upload */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Outfit' }}>
                                    Plugin File <span className="text-red-500">*</span>
                                  </label>
                                  <div className="space-y-4">
                                    {/* Upload Method Selection */}
                                    <div className="flex gap-3">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setNewVersionData(prev => ({ ...prev, uploadMethod: 'local', githubUrl: '' }));
                                        }}
                                        className={`px-4 py-2 rounded-md text-sm focus:outline-none transition-colors ${
                                          newVersionData.uploadMethod === 'local'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                        style={{ fontFamily: 'Outfit' }}
                                      >
                                        Upload from local
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setNewVersionData(prev => ({ ...prev, uploadMethod: 'github', file: null }));
                                        }}
                                        className={`px-4 py-2 rounded-md text-sm focus:outline-none transition-colors ${
                                          newVersionData.uploadMethod === 'github'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                        style={{ fontFamily: 'Outfit' }}
                                      >
                                        GitHub
                                      </button>
                                    </div>

                                    {newVersionData.uploadMethod === 'local' ? (
                                      <>
                                        {/* Drag and Drop Zone */}
                                        <div 
                                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                                            dragActive 
                                              ? 'border-blue-400 bg-blue-50' 
                                              : 'border-blue-300'
                                          }`}
                                          onDragEnter={handleNewVersionDragEnter}
                                          onDragLeave={handleNewVersionDragLeave}
                                          onDragOver={handleNewVersionDragOver}
                                          onDrop={handleNewVersionDrop}
                                          onClick={() => newVersionFileInputRef.current?.click()}
                                        >
                                          <input
                                            ref={newVersionFileInputRef}
                                            type="file"
                                            onChange={handleNewVersionFileChange}
                                            className="hidden"
                                            accept=".zip"
                                          />
                                          <div className="flex justify-center mb-4">
                                            <div className="w-12 h-12 border-2 border-gray-400 rounded flex items-center justify-center">
                                              <Upload className="h-6 w-6 text-gray-400" />
                                            </div>
                                          </div>
                                          <p className="text-base text-gray-600 mb-1" style={{ fontFamily: 'Outfit' }}>
                                            Click or drag file to this area to upload
                                          </p>
                                          <p className="text-sm text-gray-500" style={{ fontFamily: 'Outfit' }}>
                                            ZIP file up to 50MB
                                          </p>
                                        </div>

                                        {/* Selected File Display */}
                                        {newVersionData.file && (
                                          <div className="flex items-center text-sm text-gray-600">
                                            <Upload className="h-4 w-4 mr-2" />
                                            <span style={{ fontFamily: 'Outfit' }}>{newVersionData.file.name}</span>
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
                                            value={newVersionData.githubUrl}
                                            onChange={(e) => setNewVersionData(prev => ({ ...prev, githubUrl: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{ fontFamily: 'Outfit' }}
                                          />
                                          
                                          {/* GitHub Notes */}
                                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                            <p className="text-sm text-blue-800 font-medium mb-1" style={{ fontFamily: 'Outfit' }}>📌 Notes:</p>
                                            <ul className="text-sm text-blue-700 space-y-1" style={{ fontFamily: 'Outfit' }}>
                                              <li>• Set your repository to public</li>
                                              <li>• Only the main branch is used</li>
                                            </ul>
                                          </div>
                                        </div>

                                        {/* GitHub URL Display */}
                                        {newVersionData.githubUrl && (
                                          <div className="flex items-center text-sm text-gray-600">
                                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 0a10 10 0 00-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.13-1.1-1.43-1.1-1.43-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0010 0z" clipRule="evenodd" />
                                            </svg>
                                            <span style={{ fontFamily: 'Outfit' }}>{newVersionData.githubUrl}</span>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Version */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Outfit' }}>
                                    Version
                                  </label>
                                  <input
                                    type="text"
                                    value="Version 1.0.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                    style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                                    disabled
                                    readOnly
                                  />
                                  <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: 'Outfit' }}>
                                    Version numbers are automatically loaded from the plugin's YML file — see{' '}
                                    <span className="text-blue-600 underline cursor-pointer">documentation</span> for details.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Release Notes */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Outfit' }}>
                                Release Notes
                              </label>
                              <textarea
                                value={version.isNewVersion ? newVersionData.releaseNotes : (version.tempContent || version.content)}
                                onChange={(e) => {
                                  if (version.isNewVersion) {
                                    setNewVersionData(prev => ({ ...prev, releaseNotes: e.target.value }));
                                  } else {
                                    handleVersionChange(version.id, e.target.value);
                                  }
                                }}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                                placeholder={version.isNewVersion ? "Type your message" : "Enter version description..."}
                              />
                              <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: 'Outfit' }}>
                                Describe what changed in this version for users
                              </p>
                            </div>

                            {/* Version Labels */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Outfit' }}>
                                Version Labels
                              </label>
                              <div className="flex gap-2 flex-wrap">
                                {['Bug Fix', 'New Feature', 'Doc Update', 'UI Update'].map((tag) => {
                                  const isSelected = version.isNewVersion 
                                    ? newVersionData.versionLabels.includes(tag)
                                    : (version.tempTags || version.tags).includes(tag);
                                  
                                  return (
                                    <button
                                      key={tag}
                                      onClick={() => {
                                        if (version.isNewVersion) {
                                          handleNewVersionLabelToggle(tag);
                                        } else {
                                          handleTagToggle(version.id, tag);
                                        }
                                      }}
                                      style={{
                                        ...getTagStyle(tag),
                                        opacity: isSelected ? 1 : 0.5,
                                        border: isSelected ? '2px solid currentColor' : '2px solid transparent'
                                      }}
                                    >
                                      {tag === 'Bug Fix' ? 'Bug Fix' : 
                                       tag === 'New Feature' ? 'New Feature' : 
                                       tag === 'Doc Update' ? 'Doc Update' : 
                                       'UI Update'}
                                    </button>
                                  );
                                })}
                              </div>
                              <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: 'Outfit' }}>
                                Choose labels to describe this update (e.g., bug fix, new feature).
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleVersionSave(version.id)}
                                className="px-4 py-2 text-white rounded-md hover:opacity-90 focus:outline-none"
                                style={{ 
                                  fontFamily: 'Outfit', 
                                  fontSize: '14px',
                                  backgroundColor: '#00A2EA'
                                }}
                              >
                                {version.isNewVersion ? 'Save' : 'Save'}
                              </button>
                              <button
                                onClick={() => handleVersionCancel(version.id)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                                style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                              >
                                Cancel
                              </button>
                              {version.isNewVersion && (
                                <button
                                  onClick={() => handleVersionCancel(version.id)}
                                  className="px-4 py-2 text-white rounded-md hover:opacity-90 focus:outline-none ml-auto"
                                  style={{ 
                                    fontFamily: 'Outfit', 
                                    fontSize: '14px',
                                    backgroundColor: '#F47579'
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full">
                            <p 
                              className="text-gray-700"
                              style={{ 
                                fontFamily: 'Outfit', 
                                fontSize: '16px', 
                                lineHeight: '1.6',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: version.isExpanded ? 'unset' : 2,
                                overflow: version.isExpanded ? 'visible' : 'hidden'
                              }}
                            >
                              {version.content}
                            </p>
                            <button
                              onClick={() => toggleVersionExpanded(version.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                              style={{ fontFamily: 'Outfit' }}
                            >
                              {version.isExpanded ? 'Show less' : 'Show more'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Danger Zone Section */}
              {activeSection === 'Danger Zone' && (
                <div className="space-y-6">
                  {/* Delete Plugin Section */}
                  <div>
                    <h2 
                      className="text-lg font-semibold text-gray-900 mb-4"
                      style={{ fontFamily: 'Outfit' }}
                    >
                      Delete Plugin
                    </h2>
                    
                    <button
                      onClick={() => {
                        // Handle delete plugin logic here
                        console.log('Delete plugin clicked');
                      }}
                      className="text-white rounded-md hover:opacity-90 focus:outline-none mb-4"
                      style={{
                        display: 'flex',
                        padding: '8px 16px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '6px',
                        background: '#F47579',
                        fontFamily: 'Outfit',
                        fontSize: '14px',
                        fontWeight: 500
                      }}
                    >
                      Delete
                    </button>

                    <div 
                      style={{
                        color: '#737373',
                        fontFamily: 'Outfit',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '140%'
                      }}
                    >
                      <p className="mb-3">
                        You are about to delete this plugin. This action is irreversible and will immediately remove the plugin from the marketplace and all workspaces.
                      </p>
                      <p className="mb-3">
                        All associated data will be permanently deleted and cannot be recovered.
                      </p>
                      <p className="mb-3">
                        If you're only taking a break, consider setting the plugin to draft instead.
                      </p>
                      <p>
                        For assistance, please contact{' '}
                        <a 
                          href="mailto:support@reearth.io" 
                          style={{
                            color: '#0089D4',
                            fontFamily: 'Outfit',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '140%',
                            textDecoration: 'none'
                          }}
                          className="hover:underline"
                        >
                          support@reearth.io
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons - only show for General section */}
              {activeSection === 'General' && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="text-white px-6 py-2 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{ fontFamily: 'Outfit', backgroundColor: '#00A2EA' }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Cancel
                </button>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200" style={{ marginTop: '24px' }}>
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

export default PluginEdit;