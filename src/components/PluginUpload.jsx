import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, ArrowLeft, X, Github, FolderOpen, Plus, ChevronDown, Search, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import DashboardNav from './DashboardNav';

const PluginUpload = () => {
  const [formData, setFormData] = useState({
    workspace: '',
    name: '',
    images: [],
    description: '',
    file: null,
    version: 'v0.01',
    releaseNotes: '',
    versionLabels: [],
    functionTags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedPluginId, setUploadedPluginId] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const dropdownRef = useRef(null);

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

  const versionLabelOptions = [
    { id: 'bug-fix', label: 'Bug Fix', color: 'bg-red-100 text-red-800' },
    { id: 'new-feature', label: 'New Feature', color: 'bg-green-100 text-green-800' },
    { id: 'doc-update', label: 'Doc Update', color: 'bg-blue-100 text-blue-800' },
    { id: 'ui-update', label: 'UI Update', color: 'bg-pink-100 text-pink-800' }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setWorkspaceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    
    if (!formData.file) {
      newErrors.file = 'Plugin file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return formData.workspace && formData.name.trim() && formData.images.length > 0 && formData.file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate fake plugin ID
    const pluginId = `plugin-${Date.now()}`;
    setUploadedPluginId(pluginId);
    setIsSuccess(true);
    setIsLoading(false);
  };

  const handleUploadAnother = () => {
    setFormData({
      workspace: '',
      name: '',
      images: [],
      description: '',
      file: null,
      version: 'v0.01',
      releaseNotes: '',
      versionLabels: [],
      functionTags: []
    });
    setIsSuccess(false);
    setUploadedPluginId(null);
    setErrors({});
    setCurrentTag('');
  };

  const handleViewDetails = () => {
    navigate(`/plugin/${uploadedPluginId}`);
  };


  if (isSuccess) {
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
  }

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
                {/* Upload Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none"
                  >
                    Upload from local
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 focus:outline-none"
                  >
                    GitHub
                  </button>
                </div>

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
              </div>
              {errors.file && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.file}
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
                disabled={isLoading || !isFormValid()}
                className="w-full bg-gray-400 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ 
                  backgroundColor: isFormValid() ? '#3B82F6' : '#9CA3AF'
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

export default PluginUpload;