import React, { useState } from 'react';
import { Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PluginUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedPluginId, setUploadedPluginId] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Plugin name is required';
    }
    
    if (!formData.file) {
      newErrors.file = 'Plugin file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      name: '',
      description: '',
      file: null
    });
    setIsSuccess(false);
    setUploadedPluginId(null);
    setErrors({});
  };

  const handleViewDetails = () => {
    navigate(`/plugin/${uploadedPluginId}`);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 py-12">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            aria-label="Back to marketplace"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Marketplace
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Upload Plugin</h1>
          <p className="text-gray-600 mt-2">Share your plugin with the Re:Earth community</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter plugin name"
                disabled={isLoading}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your plugin's features and functionality"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Plugin File <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.file ? 'border-red-300' : 'border-gray-300'
              }`}>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <label
                    htmlFor="file"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".zip,.js,.json"
                    disabled={isLoading}
                    aria-describedby={errors.file ? 'file-error' : undefined}
                  />
                  <p className="text-sm text-gray-500">
                    {formData.file ? formData.file.name : 'Supported formats: .zip, .js, .json'}
                  </p>
                </div>
              </div>
              {errors.file && (
                <p id="file-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.file}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label={isLoading ? 'Uploading plugin...' : 'Upload plugin'}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Plugin'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                aria-label="Cancel upload"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PluginUpload;