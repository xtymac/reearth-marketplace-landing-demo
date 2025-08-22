import React, { useState } from 'react';
import FileListCard from './FileListCard';

const MeetingFileList = () => {
  const [files, setFiles] = useState([
    {
      id: 'file-1',
      name: 'Weekly Team Standup - March 15, 2024',
      type: 'video',
      status: 'ready',
      thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1280&h=720&fit=crop&crop=center',
      duration: '1:23:45'
    },
    {
      id: 'file-2', 
      name: 'Client Strategy Meeting with Eukarya Team',
      type: 'video',
      status: 'ready',
      thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1280&h=720&fit=crop&crop=center',
      duration: '45:22'
    },
    {
      id: 'file-3',
      name: 'Product Demo Recording Q1 2024',
      type: 'video', 
      status: 'processing',
      thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1280&h=720&fit=crop&crop=center',
      duration: '32:18'
    },
    {
      id: 'file-4',
      name: 'Audio Conference Call - Project Kickoff',
      type: 'audio',
      status: 'ready',
      duration: '1:05:33'
    },
    {
      id: 'file-5',
      name: 'Board Meeting February 2024',
      type: 'video',
      status: 'failed',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1280&h=720&fit=crop&crop=center',
      duration: '2:15:44'
    },
    {
      id: 'file-6',
      name: 'Marketing Strategy Session',
      type: 'video',
      status: 'ready', 
      thumbnail: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=1280&h=720&fit=crop&crop=center',
      duration: '1:10:22'
    },
    {
      id: 'file-7',
      name: 'Daily Scrum - Development Team',
      type: 'audio',
      status: 'processing',
      duration: '25:15'
    },
    {
      id: 'file-8',
      name: 'Quarterly Review Meeting',
      type: 'video',
      status: 'ready',
      thumbnail: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1280&h=720&fit=crop&crop=center', 
      duration: '1:45:30'
    },
    {
      id: 'file-9',
      name: 'User Interview Session #3',
      type: 'video',
      status: 'failed',
      thumbnail: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=1280&h=720&fit=crop&crop=center',
      duration: '42:18'
    }
  ]);

  // Handle retry for failed files
  const handleRetry = (fileId) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId 
          ? { ...file, status: 'processing' }
          : file
      )
    );
    
    // Simulate processing delay
    setTimeout(() => {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileId 
            ? { ...file, status: 'ready' }
            : file
        )
      );
    }, 3000);
  };

  // Get status counts for summary
  const getStatusCounts = () => {
    const counts = files.reduce((acc, file) => {
      acc[file.status] = (acc[file.status] || 0) + 1;
      return acc;
    }, {});
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Analysis</h1>
          <p className="text-gray-600 mb-4">
            Review and analyze your uploaded meeting recordings
          </p>
          
          {/* Status summary */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Ready ({statusCounts.ready || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Processing ({statusCounts.processing || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Failed ({statusCounts.failed || 0})</span>
            </div>
          </div>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {files.map((file) => (
            <FileListCard
              key={file.id}
              file={file}
              onRetry={handleRetry}
            />
          ))}
        </div>

        {/* Empty state (if no files) */}
        {files.length === 0 && (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting files uploaded</h3>
            <p className="text-gray-500 mb-6">Upload your first meeting recording to get started with analysis.</p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Upload Meeting
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Supported formats: MP4, MOV, AVI, MP3, WAV, M4A</p>
          <p className="mt-1">Maximum file size: 2GB</p>
        </div>
      </div>
    </div>
  );
};

export default MeetingFileList;