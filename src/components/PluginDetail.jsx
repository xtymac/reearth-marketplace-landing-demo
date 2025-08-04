import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, Heart } from 'lucide-react';
import { pluginData } from '../data/pluginData';

const PluginDetail = () => {
  const { id } = useParams();
  const plugin = pluginData.find(p => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);

  if (!plugin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plugin not found</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img
                  src="https://pub-07161d4651ef432c8a297e634cc3ee97.r2.dev/Logo.svg"
                  alt="Re:Earth Logo"
                  className="h-8 w-8"
                />
                <span className="text-xl font-semibold text-gray-900">Re:Earth</span>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">About Re:Earth</a>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                    Product <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                </div>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                    Use Cases <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                </div>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Pricing</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Community</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Learn</a>
                <Link to="/" className="text-blue-600 font-semibold">Marketplace</Link>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-900 font-medium">日本語</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Sign up</span>
              </div>
              <button 
                className="text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#0089D4' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
              >
                Start
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Marketplace</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">{plugin.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <img
                src={plugin.gallery ? plugin.gallery[selectedImage] : plugin.image}
                alt={plugin.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {plugin.gallery && plugin.gallery.length > 1 && (
              <div className="flex space-x-2">
                {plugin.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${plugin.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{plugin.title}</h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                {plugin.fullDescription || plugin.description}
              </p>
            </div>

            <div className="text-gray-600">
              <p className="font-medium">{plugin.company}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                className="text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                style={{ backgroundColor: '#0089D4' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
              >
                Install Plugin
              </button>
              <button 
                className="text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                style={{ backgroundColor: '#0089D4' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
              >
                Download ZIP
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <Heart className="w-5 h-5" />
                <span className="font-medium">{plugin.likes}</span>
              </div>
            </div>

            {/* Plugin Details Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <div className="mb-4">
                  <span className="text-gray-600 font-medium">Version:</span>
                  <span className="ml-8 text-gray-900">{plugin.version || 'v1.0.0'}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Updated Date</span>
                  <span className="ml-4 text-gray-900">{plugin.updatedDate || '2024/08/01'}</span>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <span className="text-gray-600 font-medium">Downloads:</span>
                  <span className="ml-8 text-gray-900">{plugin.downloads}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Size:</span>
                  <span className="ml-16 text-gray-900">{plugin.size || '2.1MB'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
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

export default PluginDetail;