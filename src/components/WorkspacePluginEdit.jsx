import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, FileText, GitBranch, AlertTriangle, Plus, Eye } from 'lucide-react';
import DashboardNav from './DashboardNav';
import { pluginData } from '../data/pluginData';

const WorkspacePluginEdit = () => {
  const { workspaceId, pluginId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('General');

  // Map workspace IDs to company info
  const workspaceMap = {
    'fukuyama-consultant': {
      name: '株式会社福山コンサルタント',
      subtitle: 'Eukarya, Inc',
      avatar: '/Avatar/株式会社福山コンサルタント.png',
      badge: '株'
    },
    'weather-data': {
      name: '気象データ株式会社',
      subtitle: 'Weather Solutions Provider',
      avatar: '/Avatar/気象データ株式会社.png',
      badge: '気'
    },
    'sensor-tech': {
      name: 'センサー技術株式会社',
      subtitle: 'IoT Technology Solutions',
      avatar: '/Avatar/センサー技術株式会社.png',
      badge: 'セ'
    },
    'geovision-labs': {
      name: 'GeoVision Labs',
      subtitle: 'Geospatial Technology',
      avatar: '/Avatar/GeoVision Labs.png',
      badge: 'GV'
    },
    'mobili-solution': {
      name: 'モビリソリューション',
      subtitle: 'Smart Mobility Solutions',
      avatar: '/Avatar/モビリソリューション.png',
      badge: 'モ'
    },
    'enviro-tech': {
      name: '環境テクノロジー株式会社',
      subtitle: 'Environmental Technology',
      avatar: '/Avatar/環境テクノロジー株式会社.png',
      badge: '環'
    },
    'enviro-node': {
      name: 'EnviroNode',
      subtitle: 'Environmental Monitoring',
      avatar: '/Avatar/EnviroNode.png',
      badge: 'EN'
    },
    'chrono-maps': {
      name: 'ChronoMaps Studio',
      subtitle: 'Time-based Visualization',
      avatar: '/Avatar/ChronoMaps Studio.png',
      badge: 'CM'
    }
  };

  const currentWorkspace = workspaceMap[workspaceId] || workspaceMap['fukuyama-consultant'];
  
  // Find the plugin data based on the ID from URL params
  const currentPlugin = pluginData.find(p => p.id.toString() === pluginId) || pluginData[0];

  const [pluginFormData, setPluginFormData] = useState({
    name: currentPlugin.title,
    status: 'Public',
    description: currentPlugin.description,
    functionTags: currentPlugin.tags.slice(0, 3),
    images: [
      currentPlugin.image,
      ...(currentPlugin.gallery ? currentPlugin.gallery.slice(1, 3) : [])
    ],
    readme: currentPlugin.readme || `# ${currentPlugin.title}\n\nNo README available for this plugin.`
  });

  const [readmeMode, setReadmeMode] = useState('preview');
  const [tempReadme, setTempReadme] = useState('');
  const [tempTag, setTempTag] = useState('');
  const [versions] = useState(() => {
    const changelog = currentPlugin.changelog || [];
    return changelog.map((entry, index) => ({
      id: index + 1,
      version: entry.version,
      content: entry.content,
      tags: entry.tags,
      isEditing: false,
      isExpanded: entry.expanded || false
    }));
  });

  const fileInputRef = useRef(null);

  const sidebarItems = [
    { id: 'General', label: 'General', icon: FileText },
    { id: 'README', label: 'README', icon: FileText },
    { id: 'Version', label: 'Version', icon: GitBranch },
    { id: 'Danger Zone', label: 'Danger Zone', icon: AlertTriangle }
  ];

  // Initialize tempReadme when switching to edit mode or when component mounts
  useEffect(() => {
    if (readmeMode === 'edit' && tempReadme === '') {
      setTempReadme(pluginFormData.readme);
    }
  }, [readmeMode, pluginFormData.readme, tempReadme]);


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

  const handleReadmeModeChange = (mode) => {
    if (mode === 'preview' && readmeMode === 'edit') {
      setPluginFormData(prev => ({ ...prev, readme: tempReadme }));
    }
    setReadmeMode(mode);
  };

  const handleReadmeSave = () => {
    setPluginFormData(prev => ({ ...prev, readme: tempReadme }));
    console.log('README saved:', tempReadme);
  };

  const handleReadmeCancel = () => {
    setTempReadme(pluginFormData.readme);
    setReadmeMode('preview');
  };

  const handleBackToWorkspace = () => {
    navigate(`/workspace/${workspaceId}`);
  };

  const handlePreview = () => {
    navigate(`/plugin/${pluginId}?preview=1`);
  };

  const handleSave = () => {
    console.log('Saving plugin:', pluginFormData);
    // Here you would typically save the plugin data
    navigate(`/workspace/${workspaceId}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) {
      console.log('Deleting plugin:', pluginId);
      navigate(`/workspace/${workspaceId}`);
    }
  };

  const renderMarkdown = (content) => {
    if (typeof window !== 'undefined' && window.marked) {
      return window.marked.parse(content);
    }
    return content.replace(/\n/g, '<br>');
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FCFAF4' }}>
      {/* Header */}
      <DashboardNav />

      {/* Workspace Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center space-x-4">
            {/* Workspace Avatar */}
            <img
              src={currentWorkspace.avatar}
              alt={currentWorkspace.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
              style={{ 
                display: 'none',
                background: 'linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%)'
              }}
            >
              {currentWorkspace.badge}
            </div>

            {/* Workspace Info */}
            <div>
              <h1 
                className="text-gray-900"
                style={{
                  fontFamily: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(currentWorkspace.name) ? '"Noto Sans JP", sans-serif' : 'Outfit',
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                {currentWorkspace.name}
              </h1>
              <p 
                className="text-gray-500"
                style={{
                  fontFamily: 'Outfit',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                {currentWorkspace.subtitle} • Editing: {currentPlugin.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleBackToWorkspace}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                style={{ fontFamily: 'Outfit' }}
              >
                {currentWorkspace.name}
              </button>
              <span className="text-gray-400">/</span>
              <span 
                className="text-gray-900 font-medium"
                style={{ fontFamily: 'Outfit' }}
              >
                Edit Plugin
              </span>
            </nav>

            {/* Empty space for potential future actions */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: '1px solid #e5e5e5' }}>
                <h3 
                  className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Editing
                </h3>
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: 'Outfit' }}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>

              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8" style={{ border: '1px solid #e5e5e5' }}>
                {/* General Section */}
                {activeSection === 'General' && (
                  <div className="space-y-8">
                    <div>
                      <h2 
                        className="text-2xl font-bold text-gray-900 mb-6"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        General Settings
                      </h2>
                      
                      {/* Plugin Status */}
                      <div className="mb-6">
                        <label 
                          className="block text-sm font-medium text-gray-700 mb-3"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Plugin Status <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <div className="relative inline-block w-16 h-8">
                            <input
                              type="checkbox"
                              id="plugin-status-toggle"
                              checked={pluginFormData.status === 'Public'}
                              onChange={(e) => setPluginFormData(prev => ({ 
                                ...prev, 
                                status: e.target.checked ? 'Public' : 'Draft' 
                              }))}
                              className="sr-only"
                            />
                            <label
                              htmlFor="plugin-status-toggle"
                              className={`block w-16 h-8 rounded-full cursor-pointer transition-colors duration-200 ${
                                pluginFormData.status === 'Public' ? 'bg-blue-500' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ${
                                  pluginFormData.status === 'Public' ? 'translate-x-9' : 'translate-x-1'
                                } mt-1`}
                              />
                            </label>
                          </div>
                          <span 
                            className="ml-3 text-lg font-medium text-gray-900"
                            style={{ fontFamily: 'Outfit' }}
                          >
                            {pluginFormData.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Plugin Name */}
                      <div className="mb-6">
                        <label 
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Plugin Name
                        </label>
                        <input
                          type="text"
                          value={pluginFormData.name}
                          onChange={(e) => setPluginFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{ fontFamily: 'Outfit' }}
                        />
                      </div>

                      {/* Plugin Image */}
                      <div className="mb-6">
                        <label 
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Plugin Image
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {pluginFormData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Plugin ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
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
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Images
                        </button>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <label 
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Description
                        </label>
                        <textarea
                          value={pluginFormData.description}
                          onChange={(e) => setPluginFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{ fontFamily: 'Outfit' }}
                        />
                      </div>

                      {/* Function Tag */}
                      <div className="mb-6">
                        <label 
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Function Tag
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {pluginFormData.functionTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              style={{ fontFamily: 'Outfit' }}
                            >
                              {tag}
                              <button
                                onClick={() => {
                                  setPluginFormData(prev => ({
                                    ...prev,
                                    functionTags: prev.functionTags.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tempTag}
                            onChange={(e) => setTempTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && tempTag.trim()) {
                                e.preventDefault();
                                if (!pluginFormData.functionTags.includes(tempTag.trim())) {
                                  setPluginFormData(prev => ({
                                    ...prev,
                                    functionTags: [...prev.functionTags, tempTag.trim()]
                                  }));
                                }
                                setTempTag('');
                              }
                            }}
                            placeholder="Add function tags to help users discover your plugin. Separate multiple tags with commas."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ fontFamily: 'Outfit' }}
                          />
                          <button
                            onClick={() => {
                              if (tempTag.trim() && !pluginFormData.functionTags.includes(tempTag.trim())) {
                                setPluginFormData(prev => ({
                                  ...prev,
                                  functionTags: [...prev.functionTags, tempTag.trim()]
                                }));
                                setTempTag('');
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            style={{ fontFamily: 'Outfit', fontSize: '14px', fontWeight: 500 }}
                          >
                            Add
                          </button>
                        </div>
                        <p 
                          className="text-xs text-gray-500 mt-2"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Add function tags to help users discover your plugin. Separate multiple tags with commas.
                        </p>
                      </div>

                      {/* Save, Preview, and Cancel Buttons */}
                      <div className="flex gap-4 pt-6">
                        <button
                          onClick={handleSave}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handlePreview}
                          className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={handleBackToWorkspace}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Cancel
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* README Section */}
                {activeSection === 'README' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 
                        className="text-2xl font-bold text-gray-900"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        README Documentation
                      </h2>
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => handleReadmeModeChange('edit')}
                          className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                            readmeMode === 'edit' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                          }`}
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleReadmeModeChange('preview')}
                          className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                            readmeMode === 'preview' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                          }`}
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Preview
                        </button>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
                      {readmeMode === 'edit' ? (
                        <textarea
                          value={tempReadme}
                          onChange={(e) => setTempReadme(e.target.value)}
                          className="w-full h-full p-4 border-none resize-none focus:outline-none"
                          style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                          placeholder="Write your plugin documentation in Markdown..."
                        />
                      ) : (
                        <div className="p-4 overflow-auto h-full">
                          <div 
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(pluginFormData.readme) }}
                          />
                        </div>
                      )}
                    </div>

                    {readmeMode === 'edit' && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleReadmeSave}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleReadmeCancel}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Version Section */}
                {activeSection === 'Version' && (
                  <div className="space-y-6">
                    <h2 
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: 'Outfit' }}
                    >
                      Version History
                    </h2>
                    <div className="space-y-4">
                      {versions.map((version, index) => (
                        <div 
                          key={version.id}
                          className="border rounded-lg p-6 bg-white shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 
                              className="text-lg font-semibold text-gray-900"
                              style={{ fontFamily: 'Outfit' }}
                            >
                              Version {version.version}
                            </h3>
                          </div>
                          {version.tags && version.tags.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {version.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                                  style={{ fontFamily: 'Outfit' }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <p 
                            className="text-gray-700"
                            style={{ fontFamily: 'Outfit' }}
                          >
                            {version.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danger Zone Section */}
                {activeSection === 'Danger Zone' && (
                  <div className="space-y-6">
                    <h2 
                      className="text-2xl font-bold text-red-600"
                      style={{ fontFamily: 'Outfit' }}
                    >
                      Danger Zone
                    </h2>
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <h3 
                        className="text-lg font-semibold text-gray-900 mb-3"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        Delete Plugin
                      </h3>
                      <p 
                        className="text-gray-700 mb-4"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        This action cannot be undone. This will permanently delete the plugin,
                        remove all associated data, and revoke access for all users.
                      </p>
                      <button
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        Delete Plugin
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkspacePluginEdit;