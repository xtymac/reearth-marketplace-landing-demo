import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Download, Search, ChevronDown, Image as ImageIcon, Loader } from 'lucide-react';
import DashboardNav from './DashboardNav';
import { getUserLikedPlugins, unlikePlugin } from '../services/pluginService';

const CompactPluginCard = ({ plugin, onUnlike }) => {
  const [imageError, setImageError] = useState(false);
  const [isUnliking, setIsUnliking] = useState(false);

  const handleUnlike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsUnliking(true);
    try {
      await unlikePlugin(plugin.id);
      onUnlike(plugin.id);
    } catch (error) {
      console.error('Error unliking plugin:', error);
    } finally {
      setIsUnliking(false);
    }
  };

  return (
    <Link to={`/plugin/${plugin.id}`} className="block w-full">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
        <div className="flex items-center p-4 space-x-4">
          {/* Small Thumbnail */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
            {imageError ? (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-6 h-6" />
              </div>
            ) : (
              <img
                src={plugin.image}
                alt={plugin.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Plugin Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-semibold text-blue-600 truncate mb-1"
                  style={{
                    fontFamily: 'Outfit',
                    fontWeight: 600
                  }}
                >
                  {plugin.title}
                </h3>
                <p 
                  className="text-gray-600 text-sm truncate mb-2"
                  style={{
                    fontFamily: 'Outfit',
                    fontWeight: 400
                  }}
                >
                  {plugin.company}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Download className="w-3 h-3" />
                    <span>{plugin.downloads}</span>
                  </div>
                  {plugin.likedAt && (
                    <span>
                      Liked {new Date(plugin.likedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Unlike Button */}
              <button
                onClick={handleUnlike}
                disabled={isUnliking}
                className="ml-4 p-2 rounded-full hover:bg-red-50 transition-colors duration-200 flex-shrink-0"
                title="Unlike plugin"
              >
                {isUnliking ? (
                  <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const EmptyState = ({ onExploreMarketplace }) => (
  <div className="text-center py-16">
    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
    <h3 
      className="text-xl font-semibold text-gray-900 mb-4"
      style={{
        fontFamily: 'Outfit',
        fontWeight: 600
      }}
    >
      No liked plugins yet
    </h3>
    <p 
      className="text-gray-600 mb-8 max-w-md mx-auto"
      style={{
        fontFamily: 'Outfit',
        fontWeight: 400
      }}
    >
      Start exploring the marketplace and like the plugins you find interesting. They'll appear here for easy access.
    </p>
    <button
      onClick={onExploreMarketplace}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      style={{
        fontFamily: 'Outfit',
        fontWeight: 500
      }}
    >
      Explore Marketplace
    </button>
  </div>
);

const LikedPlugins = () => {
  const [likedPlugins, setLikedPlugins] = useState([]);
  const [filteredPlugins, setFilteredPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('most recent liked');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const sortOptions = [
    'Most recent liked',
    'A-Z',
    'Z-A'
  ];

  const filterAndSortPlugins = useCallback(() => {
    let filtered = [...likedPlugins];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(plugin =>
        plugin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort plugins
    switch (sortBy.toLowerCase()) {
      case 'a-z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'most recent liked':
      default:
        // Already sorted by likedAt in service
        break;
    }

    setFilteredPlugins(filtered);
  }, [likedPlugins, searchTerm, sortBy]);

  useEffect(() => {
    loadLikedPlugins();
  }, []);

  useEffect(() => {
    filterAndSortPlugins();
  }, [filterAndSortPlugins]);

  const loadLikedPlugins = async () => {
    try {
      setLoading(true);
      const plugins = await getUserLikedPlugins();
      setLikedPlugins(plugins);
    } catch (error) {
      console.error('Error loading liked plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = (pluginId) => {
    setLikedPlugins(prev => prev.filter(plugin => plugin.id !== pluginId));
  };

  const handleExploreMarketplace = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600" style={{ fontFamily: 'Outfit' }}>
              Loading liked plugins...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{
              fontFamily: 'Outfit',
              fontWeight: 700
            }}
          >
            Liked Plugins
          </h1>
          <p 
            className="text-gray-600"
            style={{
              fontFamily: 'Outfit',
              fontWeight: 400
            }}
          >
            {likedPlugins.length} plugin{likedPlugins.length !== 1 ? 's' : ''} you've liked
          </p>
        </div>

        {likedPlugins.length === 0 ? (
          <EmptyState onExploreMarketplace={handleExploreMarketplace} />
        ) : (
          <>
            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search liked plugins..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Outfit' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center justify-between w-full sm:w-48 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Outfit' }}
                >
                  <span>{sortBy}</span>
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setSortDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results Count */}
            {searchTerm && (
              <div className="mb-4">
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: 'Outfit' }}
                >
                  {filteredPlugins.length} result{filteredPlugins.length !== 1 ? 's' : ''} for "{searchTerm}"
                </p>
              </div>
            )}

            {/* Plugins List */}
            {filteredPlugins.length === 0 && searchTerm ? (
              <div className="text-center py-12">
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'Outfit' }}
                >
                  No plugins found matching "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPlugins.map((plugin) => (
                  <CompactPluginCard
                    key={plugin.id}
                    plugin={plugin}
                    onUnlike={handleUnlike}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LikedPlugins;