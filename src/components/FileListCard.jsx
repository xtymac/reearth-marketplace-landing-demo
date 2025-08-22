import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Volume2, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const FileListCard = ({ file, onRetry }) => {
  const { id, name, type, status, thumbnail, duration } = file;
  
  // Status colors and icons
  const getStatusConfig = (status) => {
    switch (status) {
      case 'ready':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-3 h-3" />,
          text: 'Ready'
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          text: 'Processing'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="w-3 h-3" />,
          text: 'Failed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FileText className="w-3 h-3" />,
          text: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && status === 'ready') {
      e.preventDefault();
      // Navigate programmatically
      window.location.href = `/meeting-analysis/${id}`;
    }
  };

  // Handle retry click
  const handleRetryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRetry(id);
  };

  // Render media area based on file type
  const renderMediaArea = () => {
    if (type === 'audio') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <Volume2 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <span className="text-sm text-blue-600 font-medium">Audio File</span>
            {duration && (
              <div className="text-xs text-blue-500 mt-1">{duration}</div>
            )}
          </div>
        </div>
      );
    }

    // For video files with thumbnails
    return (
      <img
        src={thumbnail || '/placeholder-thumbnail.jpg'}
        alt={`${name} thumbnail`}
        className="w-full h-full object-cover"
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NzIgMzI4TDcwNCAzNjBMNjcyIDM5Mkw2NDAgMzYwTDY3MiAzMjhaIiBmaWxsPSIjOUNBM0FGIi8+CjwvZz4KPC9zdmc+';
        }}
      />
    );
  };

  // Render based on status
  if (status === 'ready') {
    return (
      <Link
        to={`/meeting-analysis/${id}`}
        className="group block w-full h-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg outline-none"
        onKeyDown={handleKeyDown}
        role="link"
        tabIndex={0}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-all duration-200 w-full h-full flex flex-col">
          {/* Media Area - 16:9 aspect ratio */}
          <div className="aspect-[16/9] relative overflow-hidden">
            {renderMediaArea()}
            
            {/* Status chip */}
            <div className="absolute top-3 right-3">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.text}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
              <span className="capitalize">{type} file</span>
              {duration && <span>{duration}</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // For non-ready status (processing/failed)
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full h-full flex flex-col">
      {/* Media Area - 16:9 aspect ratio */}
      <div className="aspect-[16/9] relative overflow-hidden">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          {renderMediaArea()}
        </div>
        
        {/* Status chip */}
        <div className="absolute top-3 right-3">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.icon}
            {statusConfig.text}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
          {name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-500 capitalize">{type} file</span>
          
          {/* Retry button for failed status */}
          {status === 'failed' && (
            <button
              onClick={handleRetryClick}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              aria-label={`Retry processing ${name}`}
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileListCard;