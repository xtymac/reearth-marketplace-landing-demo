import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Download, Users, Clock, FileText, TrendingUp } from 'lucide-react';

const MeetingAnalysis = () => {
  const { fileId } = useParams();
  
  // Mock meeting data - in a real app, this would come from an API
  const getMeetingData = (id) => {
    const meetings = {
      'file-1': {
        name: 'Weekly Team Standup - March 15, 2024',
        type: 'video',
        duration: '1:23:45',
        thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1280&h=720&fit=crop&crop=center',
        participants: 8,
        date: '2024-03-15',
        summary: 'Team discussed project milestones, upcoming deadlines, and resource allocation for Q2.',
        keyTopics: ['Project Timeline', 'Resource Allocation', 'Q2 Planning', 'Milestone Review'],
        actionItems: [
          'Update project timeline by March 20th',
          'Allocate additional developers to feature X',
          'Schedule Q2 planning meeting',
          'Review milestone deliverables'
        ]
      },
      'file-2': {
        name: 'Client Strategy Meeting with Eukarya Team',
        type: 'video',
        duration: '45:22',
        thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1280&h=720&fit=crop&crop=center',
        participants: 5,
        date: '2024-03-14',
        summary: 'Strategic discussion about client requirements and project scope adjustments.',
        keyTopics: ['Client Requirements', 'Scope Changes', 'Budget Review', 'Timeline Adjustment'],
        actionItems: [
          'Prepare revised project proposal',
          'Schedule follow-up with client',
          'Update budget estimates',
          'Review resource requirements'
        ]
      }
    };
    
    return meetings[id] || {
      name: 'Meeting Analysis',
      type: 'video',
      duration: 'N/A',
      participants: 0,
      date: 'N/A',
      summary: 'Analysis data not available for this meeting.',
      keyTopics: [],
      actionItems: []
    };
  };

  const meeting = getMeetingData(fileId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/meeting-files"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Files
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{meeting.name}</h1>
                <p className="text-sm text-gray-600 mt-1">Analyzed on {meeting.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video/Audio Player */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                {meeting.thumbnail ? (
                  <>
                    <img 
                      src={meeting.thumbnail} 
                      alt="Meeting thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <button className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all">
                        <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-12 h-12 mx-auto mb-2" />
                      <p>Audio Recording</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Duration: {meeting.duration}</span>
                  <span>{meeting.participants} participants</span>
                </div>
              </div>
            </div>

            {/* Meeting Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Meeting Summary</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{meeting.summary}</p>
            </div>

            {/* Key Topics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Key Topics Discussed</h2>
              </div>
              <div className="space-y-2">
                {meeting.keyTopics.map((topic, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meeting Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Details</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">{meeting.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Participants</p>
                    <p className="text-sm text-gray-600">{meeting.participants} attendees</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">File Type</p>
                    <p className="text-sm text-gray-600 capitalize">{meeting.type} recording</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
              <div className="space-y-3">
                {meeting.actionItems.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 mt-0.5 mr-3"></div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Generate full transcript
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Export to PDF
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Share analysis
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Schedule follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingAnalysis;