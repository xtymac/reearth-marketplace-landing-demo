import React, { useState } from 'react';
import { Search, Heart, Download, ChevronDown } from 'lucide-react';

const Marketplace = () => {
  const [sortBy, setSortBy] = useState('date uploaded');
  
  // Sample plugin data based on the wireframe
  const plugins = [
    {
      id: 1,
      title: "3D Building Visualization",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "3D Building Visualization provides high-precision 3D modeling tools tailored for architects, city planners, and disaster response teams. Users can visualize buildings in realistic urban environments, simulate infrastructure development, and analyze spatial relationships with enhanced detail and accuracy.",
      tags: ["Urban Planning", "Architecture", "Urban Design", "Visualization", "Weather/Historical", "Real-Time", "Tools"],
      author: "株式会社設計事務所"
    },
    {
      id: 2,
      title: "Weather API Integration",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "Easily integrate real-time weather data into your application using this flexible Weather API Integration plugin. Customize display, location settings, and visualizations to show current conditions, forecasts, and historical weather data to your needs. Ideal for dashboards, outdoor event planning, and environmental monitoring.",
      tags: ["Weather API", "Integration", "Visualization", "Weather Festival", "Real-Time", "Tools"],
      author: "気象データ株式会社"
    },
    {
      id: 3,
      title: "IoT Sensor Network",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "The IoT Sensor Network plugin enables seamless integration of distributed sensor nodes to collect, transmit, and visualize real-time environmental and operational data. Ideal for smart cities, industrial automation, agriculture, and building management systems.",
      tags: ["IoT", "Sensor", "Network", "Real-Time", "Monitoring", "Industry 4.0", "Smart City"],
      author: "センサーテック株式会社"
    },
    {
      id: 4,
      title: "Advanced GIS Mapping",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "Advanced GIS Mapping empowers users to visualize, analyze, and interpret spatial data with precision. Features include multi-layer mapping, real-time geospatial updates, and customizable map styles for land use planning, urban development, and environmental management.",
      tags: ["GIS", "Mapping", "Geospatial", "Urban", "Real-Time", "GIS"],
      author: "GeoVision Labs"
    },
    {
      id: 5,
      title: "Smart Mobility Hub",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "Smart Mobility Hub unifies multiple transportation modes - public transit, shared vehicles, bikes, and pedestrian pathways into a comprehensive real-time route planning, intermodal connections, and AR integrations for trip mapping, traffic, and seamless urban mobility solutions.",
      tags: ["Mobility", "Transportation", "Smart City", "Urban"],
      author: "モビリティソリューション"
    },
    {
      id: 6,
      title: "Green Energy Monitor",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "The IoT Sensor Network plugin enables seamless integration of distributed sensor nodes to collect, transmit, and visualize real-time environmental and operational data. Ideal for smart cities, industrial automation, agriculture, and building management systems.",
      tags: ["Renewable Energy", "Carbon Reduction", "Monitoring"],
      author: "環境エナジー株式会社"
    },
    {
      id: 7,
      title: "Land Use Classifier",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "Automatically classifies land types (e.g., urban, forest, water) using satellite imagery and machine learning. Ideal for environmental monitoring and urban planning.",
      tags: ["Visualization", "Environment", "Land Use", "ML"],
      author: "GeoVision Labs"
    },
    {
      id: 8,
      title: "Real-Time Sensor Overlay",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "Displays real-time environmental data (e.g., air quality, temperature, humidity) from IoT sensors directly on the map, with dynamic visual indicators.",
      tags: ["Overlay", "Environmental Data", "Real-Time", "IoT"],
      author: "Envirodata"
    },
    {
      id: 9,
      title: "Time-Lapse Terrain Viewer",
      image: "/api/placeholder/300/200",
      likes: 0,
      downloads: 0,
      description: "Visualize terrain changes over time with animated map layers. Supports import of historical elevation, satellite, or weather data.",
      tags: ["Satellite", "Animation", "Historical", "Terrain"],
      author: "ChronoMaps Studio"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
                <span className="text-xl font-semibold text-gray-900">Re:Earth</span>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-gray-900">About Re:Earth</a>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-gray-900">
                    Product <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                </div>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-gray-900">
                    Use Cases <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                </div>
                <a href="#" className="text-gray-700 hover:text-gray-900">Pricing</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Community</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Learn</a>
                <a href="#" className="text-blue-600 font-medium">Marketplace</a>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-900">日本語</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Sign up</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Start
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketplace</h1>
          <div className="space-y-2">
            <p className="text-lg text-gray-600">
              Discover community-made Plugin for visualizer
            </p>
            <p className="text-gray-600">
              Have something to share? <a href="#" className="text-blue-600 hover:underline">Submit your plugin</a>
            </p>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search plugins..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date uploaded">date uploaded</option>
              <option value="popularity">popularity</option>
              <option value="name">name</option>
            </select>
          </div>
        </div>

        {/* Plugin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plugins.map((plugin) => (
            <div key={plugin.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Plugin Image */}
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={plugin.image}
                  alt={plugin.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Plugin Content */}
              <div className="p-4">
                {/* Title and Actions */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{plugin.title}</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Heart className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm text-gray-500">{plugin.likes}</span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm text-gray-500">{plugin.downloads}</span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {plugin.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {plugin.tags.slice(0, 6).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Author */}
                <p className="text-xs text-gray-500">{plugin.author}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Build something great? Share
            </h2>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              your plugin with the community
            </h2>
          </div>
          
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
              Submit Plugin
            </button>
            <div>
              <a href="#" className="text-blue-600 hover:underline">
                View documentation
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <span>© 2024 Re:Earth contributors</span>
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Cookies</a>
            <a href="#" className="hover:text-gray-700">Cookie Settings</a>
            <a href="#" className="hover:text-gray-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;