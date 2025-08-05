import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, FileText, GitBranch, AlertTriangle } from 'lucide-react';
import DashboardNav from './DashboardNav';

const PluginEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('General');
  const [pluginData, setPluginData] = useState({
    name: '3D Building Visualization',
    status: 'Public',
    description: 'Transform urban planning workflows with interactive 3D building visualization. This plugin enables real-time rendering of cityscapes, block-level simulations, and detailed building models—ideal for stakeholder presentations, zoning studies, and disaster resilience planning.',
    functionTags: ['3D', 'Data', 'Image'],
    images: [
      '/Image/Geospatial Data Analytics.png',
      '/Image/Detail/e22b4d43-6527-4018-bcfd-32f1f654c69c.png',
      '/Image/Detail/3aef1042-83fe-439e-b376-fa9aca050dd8.png'
    ]
  });
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef(null);

  const sidebarItems = [
    { id: 'General', label: 'General', icon: FileText, active: true },
    { id: 'README', label: 'README', icon: FileText, active: false },
    { id: 'Version', label: 'Version', icon: GitBranch, active: false },
    { id: 'Danger Zone', label: 'Danger Zone', icon: AlertTriangle, active: false }
  ];


  const handleStatusToggle = () => {
    setPluginData(prev => ({
      ...prev,
      status: prev.status === 'Public' ? 'Private' : 'Public'
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setPluginData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setPluginData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !pluginData.functionTags.includes(newTag.trim())) {
      setPluginData(prev => ({
        ...prev,
        functionTags: [...prev.functionTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPluginData(prev => ({
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
      {/* Header */}
      <DashboardNav />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="text-sm" style={{ fontFamily: 'Outfit' }}>
            <span style={{ 
              color: 'var(--function-link, #0089D4)',
              fontFamily: '"Noto Sans JP"',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%'
            }}>株式会社福山コンサルタント</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">3D Building Visualization</span>
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
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${item.id === 'General' ? 'rounded-t-lg' : ''} ${item.id === 'Danger Zone' ? 'rounded-b-lg' : ''}`}
                    style={{ fontFamily: 'Outfit', fontSize: '14px', fontWeight: 500 }}
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
              <div className="mb-8">
                <h1 
                  className="text-2xl font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: 'Outfit' }}
                >
                  General
                </h1>
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'Outfit', fontSize: '14px' }}
                >
                  General and Basic Settings of the Project
                </p>
              </div>

              {/* Form Fields */}
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
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      pluginData.status === 'Public' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pluginData.status === 'Public' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span 
                    className="ml-3 text-sm font-medium text-gray-900"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    {pluginData.status}
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
                    value={pluginData.name}
                    onChange={(e) => setPluginData(prev => ({ ...prev, name: e.target.value }))}
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
                    {pluginData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Plugin image ${index + 1}`}
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
                    value={pluginData.description}
                    onChange={(e) => setPluginData(prev => ({ ...prev, description: e.target.value }))}
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
                    {pluginData.functionTags.map((tag, index) => (
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
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                      style={{ fontFamily: 'Outfit', fontSize: '14px' }}
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

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{ fontFamily: 'Outfit' }}
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
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200" style={{ marginTop: '24px' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <span>© 2024 Re:Earth contributors</span>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Cookies</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Cookie Settings</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PluginEdit;