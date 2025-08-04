import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Download, Image as ImageIcon } from 'lucide-react';

const PluginCard = ({ plugin }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/plugin/${plugin.id}`} className="block w-full h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full h-full flex flex-col">
        {/* Plugin Image */}
        <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {imageError ? (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span className="text-sm">Image not found</span>
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
      
      {/* Plugin Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xl font-semibold text-blue-600 mb-3 leading-tight">
          {plugin.title}
        </h3>
        
        {/* Actions */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">{plugin.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">{plugin.downloads}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
          {plugin.description}
        </p>
        
        {/* Company Name */}
        <p className="text-gray-600 text-sm font-medium mb-4">{plugin.company}</p>
        
        {/* Tags */}
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '64px' }}>
            {plugin.tags && plugin.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};

export default PluginCard;