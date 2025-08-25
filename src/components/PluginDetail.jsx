import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, User, LogOut, Settings, LayoutDashboard, Building2, ArrowLeft, Edit } from 'lucide-react';
import { pluginData } from '../data/pluginData';
import { authService } from '../services/authService';
import { PluginService } from '../services/pluginService';
import PluginInstallModal from './PluginInstallModal';

// Plugin documentation content generator
const getDocumentationContent = (pluginId, pluginTitle) => {
  const contentMap = {
    1: { // 3D Building Visualization
      overview: "Transform your architectural and urban planning projects with advanced 3D visualization capabilities. This plugin provides high-precision 3D modeling tools specifically designed for architects, city planners, and disaster response teams. Create stunning building visualizations with realistic materials, lighting, and environmental effects.",
      features: [
        { icon: "🏗️", title: "Advanced 3D Rendering", description: "High-quality building visualization with realistic materials, shadows, and lighting effects for professional presentations." },
        { icon: "📐", title: "Multi-format Support", description: "Import from CAD, BIM, GeoJSON, and other popular architectural data formats with automatic optimization." },
        { icon: "🎮", title: "Interactive Navigation", description: "Smooth camera controls with fly-through capabilities and predefined viewpoints for immersive exploration." },
        { icon: "📏", title: "Height Extrusion", description: "Automatically generate 3D buildings from 2D footprints using height data with customizable algorithms." },
        { icon: "🎨", title: "Material Library", description: "Extensive collection of realistic building materials including glass, concrete, steel, and natural textures." }
      ],
      images: [
        { src: "/images/visualizer/6e82e5cb4f3ab9225ed72467ef0e69d44c5d7ae5df84bd6fb057bd551da4bbb1.png", alt: "3D building rendering example" },
        { src: "/images/visualizer/Advanced GIS Mapping.png", alt: "Urban planning visualization" }
      ],
      addSteps: [
        "Navigate to your Re:Earth workspace and access the Plugin Manager",
        "Click 'Install Plugin' and confirm the installation permissions",
        "The plugin will be automatically added to your visualization toolbar",
        "Restart Re:Earth to complete the installation process"
      ],
      useSteps: [
        "Import your building data using the File → Import menu",
        "Select the 3D Building Visualization tool from the toolbar",
        "Configure height extrusion settings and material preferences",
        "Apply lighting and environmental effects as needed",
        "Use camera controls to navigate and create viewpoints"
      ],
      configImage: { src: "/images/visualizer/Smart Mobility Hub.png", alt: "Configuration panel screenshot" },
      settings: [
        { title: "Rendering Quality", description: "Adjust rendering quality from Draft to Ultra-High for optimal performance vs. visual quality balance." },
        { title: "Shadow Resolution", description: "Configure shadow map resolution (512px to 4096px) based on your hardware capabilities." },
        { title: "Material Cache", description: "Enable material caching to improve loading times for frequently used textures and materials." }
      ],
      notes: "For optimal performance with large datasets, consider using Level of Detail (LOD) settings and enable GPU acceleration in your browser. WebGL 2.0 support is recommended for advanced features."
    },
    2: { // Weather API Integration
      overview: "Seamlessly integrate real-time weather data into your geospatial visualizations with this comprehensive weather API plugin. Perfect for dashboards, outdoor service applications, and environmental monitoring projects requiring up-to-date meteorological information.",
      features: [
        { icon: "🌤️", title: "Real-time Data", description: "Access live weather data from multiple providers with automatic failover mechanisms for reliability." },
        { icon: "🌡️", title: "Multiple Units", description: "Support for Celsius, Fahrenheit, and Kelvin temperature units with automatic conversion capabilities." },
        { icon: "📍", title: "Location-based", description: "Query weather data for specific coordinates, cities, or regions with high precision geolocation." },
        { icon: "🔄", title: "Auto-refresh", description: "Configurable refresh intervals from 1 minute to 24 hours to maintain current data without overwhelming APIs." },
        { icon: "📊", title: "Historical Data", description: "Access historical weather data for trend analysis and comparison with current conditions." }
      ],
      images: [
        { src: "/images/visualizer/Weather API Integration.png", alt: "Weather data visualization" },
        { src: "/images/visualizer/IoT Sensor Network.png", alt: "Weather dashboard interface" }
      ],
      addSteps: [
        "Install the plugin from the Re:Earth Marketplace",
        "Obtain API keys from supported weather providers (OpenWeatherMap, WeatherAPI, etc.)",
        "Configure API credentials in the plugin settings panel",
        "Test the connection and verify data retrieval"
      ],
      useSteps: [
        "Add a weather layer to your map or visualization",
        "Configure location parameters (coordinates, city name, or region)",
        "Set refresh intervals and data parameters (temperature, humidity, wind, etc.)",
        "Customize visualization styles and data display formats",
        "Monitor API usage and manage rate limits through the dashboard"
      ],
      configImage: { src: "/images/visualizer/Real-Time Sensor Overlay.png", alt: "Weather API configuration" },
      settings: [
        { title: "API Provider", description: "Select from OpenWeatherMap, WeatherAPI, AccuWeather, or custom endpoints with authentication support." },
        { title: "Rate Limiting", description: "Configure request throttling to stay within API quotas and prevent service interruptions." },
        { title: "Cache Duration", description: "Set data caching duration (5 minutes to 24 hours) to optimize API usage and improve response times." }
      ],
      notes: "Ensure you have valid API keys and sufficient quota limits for your weather data providers. Some features may require premium API subscriptions for full functionality."
    },
    3: { // IoT Sensor Network
      overview: "Connect and visualize data from distributed IoT sensor networks with this powerful integration plugin. Ideal for smart cities, industrial automation, agriculture, and building management systems requiring real-time environmental monitoring.",
      features: [
        { icon: "📡", title: "Multi-protocol Support", description: "Connect to sensors via MQTT, HTTP, WebSocket, and LoRaWAN protocols with automatic discovery." },
        { icon: "⚡", title: "Real-time Streaming", description: "Live data streaming with millisecond latency for critical monitoring applications." },
        { icon: "🔧", title: "Device Management", description: "Comprehensive device management with remote configuration and firmware update capabilities." },
        { icon: "📈", title: "Data Analytics", description: "Built-in analytics tools for trend analysis, anomaly detection, and predictive maintenance." },
        { icon: "🚨", title: "Alert System", description: "Configurable alerts and notifications based on sensor thresholds and data patterns." }
      ],
      images: [
        { src: "/images/visualizer/IoT Sensor Network.png", alt: "IoT sensor dashboard" },
        { src: "/images/visualizer/9cf6efff-9011-4b92-a874-2f0dedea4050.png", alt: "Sensor network topology" }
      ],
      addSteps: [
        "Install the IoT Sensor Network plugin from the marketplace",
        "Configure network settings and protocol parameters",
        "Add sensor devices using auto-discovery or manual configuration",
        "Verify sensor connectivity and data transmission"
      ],
      useSteps: [
        "Access the IoT dashboard from the Re:Earth interface",
        "Add new sensors using the device discovery wizard",
        "Configure data collection intervals and visualization preferences",
        "Set up alerts and notification rules for critical sensors",
        "Monitor network health and sensor status in real-time"
      ],
      configImage: { src: "/images/visualizer/Advanced GIS Mapping.png", alt: "IoT network configuration" },
      settings: [
        { title: "Connection Timeout", description: "Set connection timeout values (5-300 seconds) for reliable sensor communication and error handling." },
        { title: "Data Retention", description: "Configure how long sensor data is stored locally (1 day to 1 year) before archiving or deletion." },
        { title: "Batch Processing", description: "Enable batch data processing for high-volume sensors to optimize performance and reduce network overhead." }
      ],
      notes: "Ensure your network supports the required protocols and ports for sensor communication. Some enterprise networks may require firewall configuration for optimal performance."
    },
    4: { // Advanced GIS Mapping
      overview: "Unlock the full potential of geospatial data with advanced GIS mapping capabilities. This plugin provides professional-grade tools for spatial analysis, multi-layer mapping, and customizable cartographic visualization for geography and infrastructure projects.",
      features: [
        { icon: "🗺️", title: "Layer Management", description: "Advanced multi-layer mapping with support for vector, raster, and tile layers with dynamic styling." },
        { icon: "🔍", title: "Spatial Analysis", description: "Comprehensive spatial analysis tools including buffer zones, proximity analysis, and geometric calculations." },
        { icon: "🎨", title: "Custom Styling", description: "Professional cartographic styling with custom symbology, color schemes, and labeling options." },
        { icon: "📊", title: "Data Filtering", description: "Advanced filtering and querying capabilities with SQL-like expressions and attribute-based selections." },
        { icon: "🌡️", title: "Heatmaps", description: "Dynamic heatmap generation with customizable intensity gradients and clustering algorithms." }
      ],
      images: [
        { src: "/images/visualizer/Advanced GIS Mapping.png", alt: "GIS mapping interface" },
        { src: "/images/visualizer/Land Use Classifier.png", alt: "Spatial analysis tools" }
      ],
      addSteps: [
        "Download and install the Advanced GIS Mapping plugin",
        "Configure coordinate reference systems and projection settings",
        "Import base layers and reference datasets",
        "Set up user preferences and default styling options"
      ],
      useSteps: [
        "Create a new GIS project and add data layers",
        "Apply styling and symbology to enhance visualization",
        "Use spatial analysis tools to perform calculations and queries",
        "Generate heatmaps and statistical visualizations as needed",
        "Export results in various formats (GeoJSON, Shapefile, KML)"
      ],
      configImage: { src: "/images/visualizer/Smart Mobility Hub.png", alt: "GIS analysis workflow" },
      settings: [
        { title: "Coordinate System", description: "Select appropriate coordinate reference system (WGS84, UTM zones, local projections) for your project area." },
        { title: "Rendering Engine", description: "Choose between Canvas and WebGL rendering for optimal performance based on data complexity." },
        { title: "Memory Management", description: "Configure memory allocation for large datasets and enable disk caching for improved performance." }
      ],
      notes: "For large datasets, consider using tiled services or simplified geometries to maintain optimal performance. Coordinate system selection is crucial for accurate spatial analysis."
    },
    5: { // Smart Mobility Hub
      overview: "Revolutionize urban transportation planning with integrated mobility analytics. This plugin unifies multiple transportation modes into a comprehensive platform for route optimization, traffic analysis, and sustainable mobility solutions.",
      features: [
        { icon: "🚌", title: "Multi-modal Integration", description: "Seamlessly integrate public transit, shared vehicles, bicycles, and pedestrian routes in unified planning." },
        { icon: "🛣️", title: "Route Optimization", description: "Advanced algorithms for optimal route planning considering traffic, weather, and real-time conditions." },
        { icon: "📱", title: "API Integration", description: "Connect with mapping services, traffic data, and mobility providers through standardized APIs." },
        { icon: "♻️", title: "Sustainability Metrics", description: "Calculate carbon footprint, energy consumption, and environmental impact of transportation choices." },
        { icon: "👥", title: "Collaborative Planning", description: "Multi-user collaboration tools for urban planners and transportation authorities." }
      ],
      images: [
        { src: "/images/visualizer/Smart Mobility Hub.png", alt: "Mobility planning interface" },
        { src: "/images/visualizer/Advanced GIS Mapping.png", alt: "Route optimization tools" }
      ],
      addSteps: [
        "Install Smart Mobility Hub from the plugin marketplace",
        "Configure API connections for mapping and traffic services",
        "Import transportation network data and transit schedules",
        "Set up user roles and collaboration permissions"
      ],
      useSteps: [
        "Create a new mobility project and define planning area",
        "Import or create transportation network layers",
        "Configure routing parameters and optimization criteria",
        "Run analysis and generate mobility scenarios",
        "Share results with stakeholders and export reports"
      ],
      configImage: { src: "/images/visualizer/IoT Sensor Network.png", alt: "Mobility configuration panel" },
      settings: [
        { title: "Routing Engine", description: "Select from OSRM, GraphHopper, or custom routing engines based on your specific requirements." },
        { title: "Real-time Updates", description: "Configure frequency of traffic and transit updates (1-60 minutes) for accurate route planning." },
        { title: "Accessibility Options", description: "Enable accessibility features for wheelchair-accessible routes and barrier-free navigation." }
      ],
      notes: "Optimal performance requires access to current traffic data and transit schedules. Consider API rate limits when planning large-scale analysis projects."
    },
    6: { // Green Energy Monitor
      overview: "Monitor and analyze renewable energy systems with comprehensive environmental data integration. Track solar, wind, and other renewable energy sources while calculating carbon reduction impact and sustainability metrics.",
      features: [
        { icon: "☀️", title: "Solar Analytics", description: "Monitor solar panel performance, irradiance levels, and energy production with weather correlation." },
        { icon: "💨", title: "Wind Monitoring", description: "Track wind speed, direction, and turbine performance with predictive maintenance alerts." },
        { icon: "📉", title: "Carbon Tracking", description: "Calculate carbon footprint reduction and environmental impact metrics with reporting tools." },
        { icon: "⚡", title: "Grid Integration", description: "Monitor grid connection status, energy flow, and power quality measurements." },
        { icon: "📊", title: "Performance Analytics", description: "Detailed performance analytics with efficiency calculations and optimization recommendations." }
      ],
      images: [
        { src: "/images/visualizer/Green Energy Monitor.png", alt: "Energy monitoring dashboard" },
        { src: "/images/visualizer/IoT Sensor Network.png", alt: "Renewable energy visualization" }
      ],
      addSteps: [
        "Install the Green Energy Monitor plugin",
        "Connect to energy monitoring systems and sensors",
        "Configure energy source types and capacity parameters",
        "Set up environmental data connections for weather correlation"
      ],
      useSteps: [
        "Add energy sources to your monitoring dashboard",
        "Configure performance thresholds and alert parameters",
        "Monitor real-time energy production and consumption",
        "Generate performance reports and sustainability metrics",
        "Analyze trends and optimize system performance"
      ],
      configImage: { src: "/images/visualizer/Real-Time Sensor Overlay.png", alt: "Energy system configuration" },
      settings: [
        { title: "Data Sources", description: "Configure connections to inverters, smart meters, and environmental sensors for comprehensive monitoring." },
        { title: "Calculation Methods", description: "Select carbon offset calculation methods and regional grid emission factors for accurate reporting." },
        { title: "Alert Thresholds", description: "Set performance thresholds and maintenance alerts based on efficiency and output parameters." }
      ],
      notes: "Accurate monitoring requires proper sensor calibration and reliable network connectivity. Regular maintenance of monitoring equipment ensures data quality."
    },
    7: { // Land Use Classifier
      overview: "Automatically classify and analyze land use patterns using advanced machine learning algorithms and satellite imagery. Perfect for environmental monitoring, urban planning, and land management applications.",
      features: [
        { icon: "🛰️", title: "Satellite Integration", description: "Process high-resolution satellite imagery from multiple providers with automated preprocessing." },
        { icon: "🤖", title: "ML Classification", description: "Advanced machine learning models for accurate land use classification with continuous learning." },
        { icon: "🌳", title: "Multi-class Detection", description: "Identify urban areas, forests, water bodies, agriculture, and industrial zones automatically." },
        { icon: "📈", title: "Change Detection", description: "Track land use changes over time with temporal analysis and trend identification." },
        { icon: "🎯", title: "Accuracy Assessment", description: "Built-in validation tools and accuracy metrics for classification quality assurance." }
      ],
      images: [
        { src: "/images/visualizer/Land Use Classifier.png", alt: "Land classification results" },
        { src: "/images/visualizer/Advanced GIS Mapping.png", alt: "Classification workflow" }
      ],
      addSteps: [
        "Install the Land Use Classifier plugin from the marketplace",
        "Configure satellite imagery sources and API credentials",
        "Download or import training data for classification models",
        "Set up processing parameters and output formats"
      ],
      useSteps: [
        "Define your area of interest using drawing tools",
        "Select satellite imagery date range and resolution",
        "Choose classification scheme and training parameters",
        "Run classification algorithm and review results",
        "Export classified data and generate analysis reports"
      ],
      configImage: { src: "/images/visualizer/Green Energy Monitor.png", alt: "Classification parameters" },
      settings: [
        { title: "Model Selection", description: "Choose from Random Forest, Support Vector Machine, or Neural Network classification algorithms." },
        { title: "Image Resolution", description: "Configure processing resolution (10m to 1m) balancing accuracy needs with processing time." },
        { title: "Training Data", description: "Manage training datasets and enable active learning for improved classification accuracy." }
      ],
      notes: "Classification accuracy depends on training data quality and imagery resolution. Consider seasonal variations when analyzing agricultural and vegetation areas."
    },
    8: { // Real-Time Sensor Overlay
      overview: "Visualize real-time environmental data directly on your maps with dynamic sensor overlays. Display air quality, temperature, humidity, and other environmental parameters with interactive visual indicators.",
      features: [
        { icon: "🌡️", title: "Multi-parameter Display", description: "Simultaneously display temperature, humidity, air quality, and other environmental parameters." },
        { icon: "🎨", title: "Dynamic Visualization", description: "Real-time visual indicators with color-coded overlays and animated data updates." },
        { icon: "📍", title: "Spatial Interpolation", description: "Generate smooth data surfaces between sensor points using advanced interpolation algorithms." },
        { icon: "⚠️", title: "Threshold Alerts", description: "Visual and audio alerts when environmental parameters exceed configured thresholds." },
        { icon: "📊", title: "Historical Comparison", description: "Compare current readings with historical data and identify trends and patterns." }
      ],
      images: [
        { src: "/images/visualizer/9cf6efff-9011-4b92-a874-2f0dedea4050.png", alt: "Sensor overlay interface" },
        { src: "/images/visualizer/IoT Sensor Network.png", alt: "Environmental data visualization" }
      ],
      addSteps: [
        "Install Real-Time Sensor Overlay from the plugin library",
        "Connect to environmental sensor networks and databases",
        "Configure sensor types and measurement parameters",
        "Set up visualization styles and overlay preferences"
      ],
      useSteps: [
        "Add sensor overlay layer to your map visualization",
        "Configure display parameters and color schemes",
        "Set threshold values for alert notifications",
        "Monitor real-time data updates and sensor status",
        "Generate reports and export data for further analysis"
      ],
      configImage: { src: "/images/visualizer/Weather API Integration.png", alt: "Sensor configuration interface" },
      settings: [
        { title: "Update Frequency", description: "Configure data refresh intervals from 10 seconds to 1 hour based on sensor capabilities." },
        { title: "Interpolation Method", description: "Select from IDW, Kriging, or Spline interpolation methods for spatial data visualization." },
        { title: "Data Quality", description: "Set data validation rules and quality thresholds to filter unreliable sensor readings." }
      ],
      notes: "Ensure sensor network connectivity and data quality for accurate visualization. High-frequency updates may impact system performance with large sensor networks."
    },
    9: { // Time-Lapse Terrain Viewer
      overview: "Create compelling time-lapse visualizations of terrain and landscape changes using historical satellite data. Perfect for monitoring environmental changes, urban development, and geological processes over time.",
      features: [
        { icon: "⏰", title: "Temporal Animation", description: "Create smooth time-lapse animations with customizable playback speed and transition effects." },
        { icon: "🏔️", title: "Terrain Analysis", description: "Analyze elevation changes, erosion patterns, and geological processes over time periods." },
        { icon: "🛰️", title: "Multi-source Data", description: "Import historical elevation data, satellite imagery, and weather data from various sources." },
        { icon: "🎬", title: "Export Options", description: "Export time-lapse videos in multiple formats with custom annotations and overlays." },
        { icon: "📐", title: "Measurement Tools", description: "Measure changes in area, volume, and elevation between different time periods." }
      ],
      images: [
        { src: "/images/visualizer/Real-Time Sensor Overlay.png", alt: "Time-lapse interface" },
        { src: "/images/visualizer/Land Use Classifier.png", alt: "Terrain change visualization" }
      ],
      addSteps: [
        "Install Time-Lapse Terrain Viewer from the marketplace",
        "Import historical terrain and satellite data sources",
        "Configure temporal parameters and data alignment",
        "Set up visualization preferences and animation settings"
      ],
      useSteps: [
        "Load historical terrain datasets for your area of interest",
        "Align temporal data and configure time intervals",
        "Apply visualization styles and animation parameters",
        "Generate time-lapse animation and preview results",
        "Export video or interactive presentation for sharing"
      ],
      configImage: { src: "/images/visualizer/Advanced GIS Mapping.png", alt: "Time-lapse configuration" },
      settings: [
        { title: "Frame Rate", description: "Configure animation frame rate (1-30 fps) balancing smooth playback with file size considerations." },
        { title: "Data Interpolation", description: "Enable temporal interpolation to create smooth transitions between data points in sparse datasets." },
        { title: "Quality Settings", description: "Select rendering quality from draft to ultra-high for preview and final output respectively." }
      ],
      notes: "Large datasets may require significant processing time and storage space. Consider using cloud processing for complex time-lapse projects with high-resolution data."
    }
  };

  return contentMap[pluginId] || {
    overview: `Comprehensive ${pluginTitle} plugin for Re:Earth platform integration.`,
    features: [
      { icon: "⚡", title: "High Performance", description: "Optimized for speed and efficiency." },
      { icon: "🔧", title: "Easy Configuration", description: "Simple setup and customization options." }
    ],
    images: [
      { src: "/images/placeholder.png", alt: "Plugin interface" }
    ],
    addSteps: [
      "Install the plugin from Re:Earth Marketplace",
      "Configure settings in the plugin panel",
      "Apply to your visualization project"
    ],
    useSteps: [
      "Access the plugin from the toolbar",
      "Configure parameters as needed",
      "Apply to your data visualization"
    ],
    settings: [
      { title: "General Settings", description: "Basic configuration options for the plugin." }
    ],
    notes: "For optimal performance, ensure your system meets the minimum requirements."
  };
};

const getPluginDocumentation = (plugin) => {
  const docContent = getDocumentationContent(plugin.id, plugin.title);
  
  return (
    <>
      {/* Overview Section */}
      <div className="w-full">
        {/* Overview Title + Divider + Content Group - isolated from parent gap */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ margin: 0 }}>Overview</h2>
          
          {/* Horizontal Divider */}
          <div 
            style={{
              width: '1232px',
              maxWidth: '100%',
              height: '1px',
              background: 'var(--background-2, #D4D4D4)',
              margin: '18px auto 18px auto'
            }}
          />
          
          <p className="text-gray-700 leading-relaxed" style={{ margin: 0 }}>
            {docContent.overview}
          </p>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
        <div className="space-y-4">
          {docContent.features.map((feature, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-blue-600 font-semibold">{feature.icon}</span>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-700 text-sm ml-6">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshots/Demo Images */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docContent.images.map((img, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={img.src} 
                alt={img.alt}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* How to Add Plugin Section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Add the Plugin</h2>
        <ol className="list-decimal list-inside space-y-2">
          {docContent.addSteps.map((step, index) => (
            <li key={index} className="text-gray-700">{step}</li>
          ))}
        </ol>
      </div>

      {/* How to Use Plugin Section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to use the Plugin</h2>
        <ol className="list-decimal list-inside space-y-2">
          {docContent.useSteps.map((step, index) => (
            <li key={index} className="text-gray-700">{step}</li>
          ))}
        </ol>
        {docContent.configImage && (
          <div className="mt-4 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={docContent.configImage.src} 
              alt={docContent.configImage.alt}
              className="w-full h-64 object-cover"
            />
          </div>
        )}
      </div>

      {/* Other Settings Section */}
      {docContent.settings && (
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Settings</h2>
          <div className="space-y-3">
            {docContent.settings.map((setting, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-1">{setting.title}</h3>
                <p className="text-gray-700 text-sm">{setting.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {docContent.notes && (
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-700 leading-relaxed">
            {docContent.notes}
          </p>
        </div>
      )}
    </>
  );
};

// Change Log Entry Component
const ChangeLogEntry = ({ entry }) => {
  const [showMore, setShowMore] = useState(false);
  const [needsShowMore, setNeedsShowMore] = useState(false);
  const textRef = useRef(null);
  
  const getTagStyle = (tag) => {
    const styles = {
      'Bug Fix': { backgroundColor: '#FEE2E2', color: '#DC2626' },
      'New Feature': { backgroundColor: '#D1FAE5', color: '#059669' },
      'Doc Update': { backgroundColor: '#DBEAFE', color: '#2563EB' },
      'UI Update': { backgroundColor: '#FCE7F3', color: '#C2185B' }
    };
    return styles[tag] || { backgroundColor: '#F3F4F6', color: '#374151' };
  };

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      // Temporarily show full text to measure
      element.style.webkitLineClamp = 'unset';
      element.style.display = 'block';
      
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const actualHeight = element.scrollHeight;
      const twoLineHeight = lineHeight * 2;
      
      // Reset to clamped state
      element.style.webkitLineClamp = '2';
      element.style.display = '-webkit-box';
      
      setNeedsShowMore(actualHeight > twoLineHeight);
    }
  }, [entry.description]);

  return (
    <div className="w-full border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{entry.version}</h3>
        <span className="text-sm text-gray-500">{entry.date}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {entry.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={getTagStyle(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="text-gray-700">
        <p 
          ref={textRef}
          className={showMore ? '' : 'overflow-hidden'} 
          style={showMore ? {} : { 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {entry.description}
        </p>
        {needsShowMore && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 font-medium"
          >
            {showMore ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};

// Generate change log entries for each plugin
const getChangeLogEntries = (pluginId) => {
  const changeLogData = {
    1: [ // 3D Building Visualization
      {
        version: 'Version 2.1.3',
        date: 'December 15, 2024',
        tags: ['Bug Fix', 'Doc Update', 'UI Update'],
        description: 'Performance improvements and bug fixes to enhance user experience. Fixed memory leaks, improved rendering performance by 25%, and resolved browser compatibility issues for smoother visualization workflows. Updated documentation with new API examples and enhanced user interface with better accessibility features.'
      },
      {
        version: 'Version 2.1.0',
        date: 'December 1, 2024',
        tags: ['New Feature', 'UI Update'],
        description: 'Major update introducing comprehensive material library with 50+ realistic building materials and dynamic lighting system. Features include sun position simulation, shadow casting, and real-time atmospheric effects for enhanced realism.'
      },
      {
        version: 'Version 1.9.2',
        date: 'October 20, 2024',
        tags: ['Bug Fix', 'New Feature', 'Doc Update'],
        description: 'Comprehensive user interface improvements focusing on usability and accessibility. Redesigned control panels, added keyboard shortcuts, enhanced mobile responsiveness, and improved screen reader support for better inclusive design.'
      },
      {
        version: 'Version 1.9.0',
        date: 'November 10, 2024',
        tags: ['Bug Fix'],
        description: 'Enhanced data handling capabilities with support for BIM file formats (IFC, RVT), automatic Level of Detail generation, improved GeoJSON parsing, and batch processing capabilities for handling large-scale architectural datasets efficiently.'
      }
    ],
    2: [ // Weather API Integration
      {
        version: 'Version 1.4.2',
        date: 'December 10, 2024',
        tags: ['Bug Fix', 'UI Update'],
        description: 'Fixed API rate limiting issues and improved error handling for weather data providers. Enhanced user interface with better status indicators and streamlined configuration panel for easier setup and monitoring.'
      },
      {
        version: 'Version 1.4.0',
        date: 'November 25, 2024',
        tags: ['New Feature', 'Doc Update'],
        description: 'Added support for multiple weather providers including AccuWeather and Weather Underground. Implemented automatic failover system and enhanced caching mechanisms for improved reliability and performance.'
      },
      {
        version: 'Version 1.3.5',
        date: 'October 15, 2024',
        tags: ['Bug Fix', 'New Feature'],
        description: 'Introduced historical weather data access and improved location-based queries. Fixed timezone handling issues and added support for custom refresh intervals with intelligent rate limiting.'
      }
    ],
    3: [ // IoT Sensor Network
      {
        version: 'Version 3.0.1',
        date: 'December 8, 2024',
        tags: ['Bug Fix', 'UI Update'],
        description: 'Resolved connectivity issues with LoRaWAN sensors and improved device management interface. Enhanced real-time data streaming performance and fixed memory leaks in long-running monitoring sessions.'
      },
      {
        version: 'Version 3.0.0',
        date: 'November 20, 2024',
        tags: ['New Feature', 'UI Update', 'Doc Update'],
        description: 'Major release introducing multi-protocol support for MQTT, HTTP, and WebSocket connections. Added comprehensive device management dashboard with remote configuration capabilities and predictive maintenance alerts.'
      },
      {
        version: 'Version 2.8.3',
        date: 'September 30, 2024',
        tags: ['Bug Fix', 'New Feature'],
        description: 'Implemented advanced analytics tools for sensor data with anomaly detection algorithms. Fixed data synchronization issues and added batch processing capabilities for high-volume sensor networks.'
      }
    ],
    4: [ // Advanced GIS Mapping
      {
        version: 'Version 2.8.0',
        date: 'December 5, 2024',
        tags: ['New Feature', 'UI Update'],
        description: 'Enhanced spatial analysis tools with new buffer zone calculations and proximity analysis features. Improved cartographic styling options with custom symbology and professional color schemes for better map presentations.'
      },
      {
        version: 'Version 2.7.2',
        date: 'November 15, 2024',
        tags: ['Bug Fix', 'Doc Update'],
        description: 'Fixed coordinate system transformation issues and improved performance with large vector datasets. Updated documentation with comprehensive tutorials for spatial analysis workflows and projection management.'
      },
      {
        version: 'Version 2.7.0',
        date: 'October 8, 2024',
        tags: ['New Feature', 'UI Update', 'Bug Fix'],
        description: 'Added dynamic heatmap generation with customizable intensity gradients and clustering algorithms. Redesigned layer management interface with drag-and-drop functionality and improved data filtering capabilities.'
      }
    ],
    5: [ // Smart Mobility Hub
      {
        version: 'Version 1.9.3',
        date: 'December 12, 2024',
        tags: ['Bug Fix', 'UI Update'],
        description: 'Improved route optimization algorithms for better multi-modal transportation planning. Fixed API integration issues with traffic data providers and enhanced user interface for better collaboration features.'
      },
      {
        version: 'Version 1.9.0',
        date: 'November 28, 2024',
        tags: ['New Feature', 'Doc Update'],
        description: 'Introduced sustainability metrics calculation for carbon footprint and energy consumption analysis. Added collaborative planning tools for urban transportation authorities with real-time sharing capabilities.'
      },
      {
        version: 'Version 1.8.5',
        date: 'October 22, 2024',
        tags: ['Bug Fix', 'New Feature', 'UI Update'],
        description: 'Enhanced accessibility features for wheelchair-accessible route planning. Fixed routing engine performance issues and added support for custom transportation modes with specialized routing parameters.'
      }
    ],
    6: [ // Green Energy Monitor
      {
        version: 'Version 1.2.1',
        date: 'December 3, 2024',
        tags: ['Bug Fix', 'UI Update'],
        description: 'Fixed solar panel performance calculation algorithms and improved wind monitoring accuracy. Enhanced dashboard interface with better visualization of energy production trends and carbon offset metrics.'
      },
      {
        version: 'Version 1.2.0',
        date: 'November 18, 2024',
        tags: ['New Feature', 'Doc Update'],
        description: 'Added grid integration monitoring with power quality measurements and energy flow analysis. Implemented predictive maintenance alerts for wind turbines and comprehensive reporting tools for sustainability metrics.'
      },
      {
        version: 'Version 1.1.8',
        date: 'September 25, 2024',
        tags: ['Bug Fix', 'New Feature'],
        description: 'Introduced weather correlation features for solar and wind energy production analysis. Fixed sensor calibration issues and added batch processing for historical energy data analysis.'
      }
    ],
    7: [ // Land Use Classifier
      {
        version: 'Version 2.3.4',
        date: 'December 7, 2024',
        tags: ['Bug Fix', 'UI Update'],
        description: 'Improved machine learning model accuracy for urban area classification and fixed preprocessing issues with high-resolution satellite imagery. Enhanced user interface with better progress indicators and result visualization.'
      },
      {
        version: 'Version 2.3.0',
        date: 'November 22, 2024',
        tags: ['New Feature', 'Doc Update'],
        description: 'Added temporal change detection capabilities for monitoring land use changes over time. Implemented active learning features for continuous model improvement and comprehensive accuracy assessment tools.'
      },
      {
        version: 'Version 2.2.6',
        date: 'October 12, 2024',
        tags: ['Bug Fix', 'New Feature', 'UI Update'],
        description: 'Enhanced multi-class detection algorithms for better identification of agricultural and industrial zones. Fixed memory management issues with large satellite datasets and improved batch processing capabilities.'
      }
    ],
    8: [ // Real-Time Sensor Overlay
      {
        version: 'Version 1.7.2',
        date: 'December 9, 2024',
        tags: ['Bug Fix', 'UI Update'],
        description: 'Fixed spatial interpolation accuracy issues and improved real-time data visualization performance. Enhanced color-coded overlay system with better threshold alert notifications and historical data comparison features.'
      },
      {
        version: 'Version 1.7.0',
        date: 'November 30, 2024',
        tags: ['New Feature', 'Doc Update'],
        description: 'Introduced advanced interpolation methods including Kriging and Spline algorithms for better spatial data visualization. Added multi-parameter display capabilities for simultaneous environmental monitoring.'
      },
      {
        version: 'Version 1.6.8',
        date: 'October 18, 2024',
        tags: ['Bug Fix', 'New Feature'],
        description: 'Implemented data quality validation rules and filtering for unreliable sensor readings. Fixed high-frequency update performance issues and added customizable visualization styles for different environmental parameters.'
      }
    ],
    9: [ // Time-Lapse Terrain Viewer
      {
        version: 'Version 1.5.8',
        date: 'December 11, 2024',
        tags: ['Bug Fix', 'UI Update'],
        description: 'Improved temporal data alignment algorithms and fixed animation rendering issues with large datasets. Enhanced export options with custom annotations and overlay capabilities for better presentation quality.'
      },
      {
        version: 'Version 1.5.5',
        date: 'November 26, 2024',
        tags: ['New Feature', 'Doc Update'],
        description: 'Added measurement tools for tracking area, volume, and elevation changes between time periods. Implemented cloud processing support for complex time-lapse projects with high-resolution historical data.'
      },
      {
        version: 'Version 1.5.0',
        date: 'October 5, 2024',
        tags: ['New Feature', 'UI Update', 'Bug Fix'],
        description: 'Introduced multi-source data support for historical elevation and satellite imagery. Enhanced animation controls with customizable playback speed and transition effects for smoother terrain visualization.'
      }
    ]
  };

  return changeLogData[pluginId] || [
    {
      version: 'Version 1.0.0',
      date: 'January 1, 2024',
      tags: ['New Feature'],
      description: 'Initial release with core functionality and basic features.'
    }
  ];
};

const PluginDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const plugin = pluginData.find(p => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const isAuthenticated = authService.isAuthenticated();
  const userData = authService.getUserData();
  const userDropdownRef = useRef(null);
  
  // Always show preview mode on plugin detail pages
  const isPreviewMode = true;
  
  // Like functionality state
  const [likeState, setLikeState] = useState(() => {
    // Initialize from localStorage
    const savedLikes = localStorage.getItem('plugin-likes');
    const likes = savedLikes ? JSON.parse(savedLikes) : {};
    return {
      isLiked: likes[id] || false,
      count: plugin ? plugin.likes + (likes[id] ? 1 : 0) : 0
    };
  });
  
  const [isClickDebounced, setIsClickDebounced] = useState(false);

  // Like toggle handler with debouncing and persistence
  const handleLikeToggle = () => {
    if (isClickDebounced) return;
    
    setIsClickDebounced(true);
    setTimeout(() => setIsClickDebounced(false), 200);
    
    const newIsLiked = !likeState.isLiked;
    const newCount = newIsLiked 
      ? likeState.count + 1
      : Math.max(plugin.likes, likeState.count - 1); // Prevent going below base value
    
    // Update state optimistically
    setLikeState({
      isLiked: newIsLiked,
      count: newCount
    });
    
    // Persist to localStorage
    const savedLikes = localStorage.getItem('plugin-likes');
    const likes = savedLikes ? JSON.parse(savedLikes) : {};
    likes[id] = newIsLiked;
    localStorage.setItem('plugin-likes', JSON.stringify(likes));
  };

  // Handle keyboard interactions
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLikeToggle();
    }
  };

  // User dropdown handlers
  const handleLogout = () => {
    authService.logout();
    setUserDropdownOpen(false);
    navigateWithoutPreview('/');
  };

  const handleDashboard = () => {
    setUserDropdownOpen(false);
    navigateWithoutPreview('/dashboard');
  };

  const handleSettings = () => {
    setUserDropdownOpen(false);
    navigateWithoutPreview('/settings');
  };

  const handleDeveloperPortal = () => {
    setUserDropdownOpen(false);
    navigateWithoutPreview('/developer-portal');
  };

  // Helper function to navigate without preview parameter
  const navigateWithoutPreview = (path) => {
    navigate(path);
  };

  // Helper function to handle Link clicks that should exit preview mode
  const handleLinkClick = (path) => {
    navigateWithoutPreview(path);
  };

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigateWithoutPreview('/developer-portal/new');
    } else {
      navigateWithoutPreview('/login');
    }
  };

  const handleInstallClick = () => {
    if (isAuthenticated) {
      setInstallModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleInstallPlugin = async (workspaceId, projectId) => {
    try {
      await PluginService.installPlugin(plugin.id, workspaceId, projectId);
      // You could show a success message here
      console.log('Plugin installed successfully');
    } catch (error) {
      console.error('Installation failed:', error);
      // You could show an error message here
    }
  };

  // Close user dropdown when clicking outside or on escape/tab
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (userDropdownOpen && (event.key === 'Escape' || event.key === 'Tab')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen]);

  if (!plugin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plugin not found</h1>
          <button onClick={() => handleLinkClick('/')} className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer">
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFAF0' }}>
      {/* CSS Animation for Pulse Effect */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
      
      {/* Preview Mode Bar */}
      <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '60px',
          backgroundColor: '#6B7280',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <img 
                src="/Image/Icon/Green.svg" 
                alt="Preview icon"
                style={{ width: '28px', height: '28px' }}
              />
              <span style={{
                color: '#FFF',
                fontFamily: 'Outfit',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '140%'
              }}>
                Preview mode
              </span>
            </div>
            <button
              onClick={() => {
                navigateWithoutPreview(`/developer-portal/workspace/${id}`);
              }}
              style={{
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                background: '#FFF',
                color: '#374151',
                padding: '6px 12px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Return to Edit
            </button>
          </div>
        </div>
      
      
      {/* Header */}
      <header className="bg-white shadow-sm" style={{ marginTop: '60px' }}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <a href="https://reearth.io/home" className="flex items-center space-x-3">
                  <img
                    src="/Logo.png"
                    alt="Re:Earth Logo"
                    className="h-8"
                  />
                </a>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="https://reearth.io/about" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>About Re:Earth</a>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>
                    Product <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <a href="https://reearth.io/product/cms" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>CMS</a>
                      <a href="https://reearth.io/product/visualizer" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Visualizer</a>
                    </div>
                  </div>
                </div>
                <a href="https://reearth.io/pricing" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Pricing</a>
                <a href="https://reearth.io/community" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Community</a>
                <a href="https://reearth.io/learn" className="text-gray-700 hover:text-gray-900" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Learn</a>
                <button onClick={() => handleLinkClick('/')} className="text-blue-600 bg-transparent border-none cursor-pointer" style={{ fontFamily: 'Outfit', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%' }}>Marketplace</button>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                // User avatar dropdown when logged in
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-expanded={userDropdownOpen}
                    aria-haspopup="menu"
                    aria-label="User menu"
                  >
                    <img 
                      src="/Image/Avatar.png" 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient avatar if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </button>
                  
                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 bg-white z-50"
                      role="menu"
                      style={{
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        padding: '8px 6px',
                        minWidth: '180px',
                        width: 'fit-content'
                      }}
                    >
                      {/* Header Section */}
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <div 
                          className="font-medium"
                          style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '14px',
                            lineHeight: '140%',
                            fontWeight: 500,
                            color: 'var(--text-default, #0A0A0A)'
                          }}
                        >
                          {authService.getDisplayName(userData)}
                        </div>
                        {userData?.email && (
                          <div 
                            className="text-gray-500"
                            style={{
                              fontFamily: 'Outfit, sans-serif',
                              fontSize: '12px',
                              lineHeight: '140%',
                              fontWeight: 400,
                              marginTop: '2px'
                            }}
                          >
                            {userData.email}
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <button
                        onClick={handleDashboard}
                        role="menuitem"
                        className="flex items-center w-full text-left transition-colors hover:bg-gray-50"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          fontWeight: 400,
                          color: 'var(--text-default, #0A0A0A)',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleDeveloperPortal}
                        role="menuitem"
                        className="flex items-center w-full text-left transition-colors hover:bg-gray-50"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          fontWeight: 400,
                          color: 'var(--text-default, #0A0A0A)',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      >
                        <Building2 className="w-4 h-4 mr-3" />
                        Developer Portal
                      </button>
                      <button
                        onClick={handleSettings}
                        role="menuitem"
                        className="flex items-center w-full text-left transition-colors hover:bg-gray-50"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          fontWeight: 400,
                          color: 'var(--text-default, #0A0A0A)',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Setting
                      </button>
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex items-center w-full text-left transition-colors hover:bg-gray-50"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          fontWeight: 400,
                          color: 'var(--text-default, #0A0A0A)',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Original content when not logged in
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-900 font-medium" style={{ fontFamily: '"Noto Sans JP"' }}>日本語</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600" style={{ fontFamily: 'Outfit' }}>Sign up</span>
                  </div>
                  <button 
                    onClick={handleStartClick}
                    className="text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
                    style={{ backgroundColor: '#0089D4', fontFamily: 'Outfit' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
                    aria-label="Start plugin submission"
                  >
                    Start
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto bg-white rounded-lg" style={{ maxWidth: '1280px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        {/* Breadcrumb + Divider + Content Group - isolated from parent */}
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm" style={{ margin: 0 }}>
            <button onClick={() => handleLinkClick('/')} className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer">Marketplace</button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">{plugin.title}</span>
          </nav>

          {/* Horizontal Divider */}
          <div 
            style={{
              width: '1232px',
              maxWidth: '100%',
              height: '1px',
              background: 'var(--background-2, #D4D4D4)',
              borderRadius: '1px',
              margin: '18px auto 18px auto'
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" style={{ margin: 0 }}>
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
              {(() => {
                const companyMap = {
                  '株式会社福山コンサルタント': 'fukuyama-consultant',
                  '気象データ株式会社': 'weather-data',
                  'センサー技術株式会社': 'sensor-tech',
                  'GeoVision Labs': 'geovision-labs',
                  'モビリソリューション': 'mobili-solution',
                  '環境テクノロジー株式会社': 'enviro-tech',
                  'EnviroNode': 'enviro-node',
                  'ChronoMaps Studio': 'chrono-maps'
                };
                const workspaceId = companyMap[plugin.company];
                
                return workspaceId ? (
                  <button 
                    onClick={() => navigateWithoutPreview(`/workspace/${workspaceId}`)}
                    className="font-medium hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {plugin.company}
                  </button>
                ) : (
                  <p className="font-medium">{plugin.company}</p>
                );
              })()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleInstallClick}
                className="text-white font-semibold transition-colors"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '44px',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  gap: '8px',
                  backgroundColor: '#0089D4'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
              >
                Install Plugin
              </button>
              <button 
                className="text-white font-semibold transition-colors"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '44px',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  gap: '8px',
                  backgroundColor: '#2CC3FF'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1EAADB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2CC3FF'}
              >
                Download ZIP
              </button>
              {isAuthenticated && (
                <button 
                  className="text-gray-700 font-medium transition-colors hover:bg-gray-300"
                  style={{ 
                    display: 'flex',
                    padding: 'var(--spacing-pc-3, 12px) var(--spacing-pc-5, 20px)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 'var(--spacing-pc-2, 8px)',
                    borderRadius: 'var(--radius-pc-md, 6px)',
                    background: 'var(--text-weakest, #E5E5E5)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigateWithoutPreview(`/developer-portal/workspace/${id}`)}
                  aria-label="Edit plugin"
                >
                  Edit plugin
                </button>
              )}
              <button 
                className={`flex items-center transition-all duration-150 ${likeState.isLiked ? 'text-red-500' : 'text-gray-600'} hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '44px',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  gap: '8px',
                  backgroundColor: '#F5F5F5',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={handleLikeToggle}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                aria-pressed={likeState.isLiked}
                aria-label={likeState.isLiked ? "Unlike this plugin" : "Like this plugin"}
              >
                {likeState.isLiked ? (
                  <Heart className="w-4 h-4 fill-current" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                <span className="text-sm font-medium" style={{ minWidth: '24px', textAlign: 'left' }}>
                  {likeState.count}
                </span>
              </button>
            </div>

            {/* Plugin Details Grid */}
            <div 
              style={{ 
                width: '100%',
                background: '#F5F5F5',
                borderRadius: '6px',
                padding: '20px 24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                rowGap: '12px',
                columnGap: '48px',
                alignItems: 'center'
              }}
            >
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Version</span>
                <span style={{ fontSize: '14px', color: '#2F2F2F', fontWeight: 600 }}>{plugin.version || 'v1.0.0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Downloads</span>
                <span style={{ fontSize: '14px', color: '#2F2F2F', fontWeight: 600 }}>{plugin.downloads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Updated Date</span>
                <span style={{ fontSize: '14px', color: '#2F2F2F', fontWeight: 600 }}>{plugin.updatedDate || '2024/08/01'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Size</span>
                <span style={{ fontSize: '14px', color: '#2F2F2F', fontWeight: 600 }}>{plugin.size || '2.1MB'}</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Documentation Section */}
      <div 
        className="mx-auto bg-white rounded-lg"
        style={{ 
          maxWidth: '1280px', 
          margin: '28px auto 0 auto', 
          padding: '24px', 
          background: '#FFF', 
          borderRadius: '6px' 
        }}
      >
        <div className="flex flex-col" style={{ gap: '24px' }}>
          {getPluginDocumentation(plugin)}
        </div>
      </div>

      {/* Change Log Section */}
      <div 
        className="mx-auto bg-white rounded-lg"
        style={{ 
          maxWidth: '1280px', 
          margin: '28px auto 0 auto', 
          padding: '24px', 
          background: '#FFF', 
          borderRadius: '6px' 
        }}
      >
        <div className="flex flex-col">
          {/* Change Log Title + Divider + Content Group - isolated from parent gap */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ margin: 0 }}>Change Log</h2>
            
            {/* Horizontal Divider */}
            <div 
              style={{
                width: '1232px',
                maxWidth: '100%',
                height: '1px',
                background: 'var(--background-2, #D4D4D4)',
                margin: '18px auto 18px auto'
              }}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', margin: 0 }}>
              {(plugin.changelog ? plugin.changelog.map(entry => ({
                ...entry,
                description: entry.content, // Map content to description for compatibility
                version: entry.version.replace(/^v/, 'Version ') // Ensure version has "Version" prefix
              })) : getChangeLogEntries(plugin.id)).map((entry, index) => (
                <ChangeLogEntry key={index} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div 
        className="mx-auto"
        style={{ 
          maxWidth: '1280px', 
          margin: '28px auto 0 auto',
          padding: '0'
        }}
      >
        <div className="relative overflow-hidden" style={{ marginTop: '80px', backgroundColor: '#F8F9FA', borderRadius: '16px', padding: '80px 0' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            {/* Left side - Text Content */}
            <div className="flex-1 max-w-lg">
              <h2 
                className="mb-6"
                style={{
                  color: '#000',
                  fontFamily: 'Outfit',
                  fontSize: '36px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%',
                  marginBottom: '24px'
                }}
              >
                Build something great? Share<br />
                your <span style={{ fontWeight: 700 }}>plugin</span> with the community
              </h2>
              
              <a 
                href="/developer-portal"
                className="inline-flex items-center space-x-2 text-white px-6 py-3 rounded-lg font-semibold transition-colors no-underline"
                style={{ 
                  backgroundColor: '#0089D4', 
                  textDecoration: 'none',
                  fontFamily: 'Outfit',
                  fontSize: '16px',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#007BB8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0089D4'}
                aria-label="Go to Developer Portal"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path 
                    d="M21.4274 2.5783C20.9274 2.0673 20.1874 1.8783 19.4974 2.0783L3.40742 6.7273C2.67142 6.9383 2.53742 7.9483 3.19342 8.3283L8.49742 11.2073L15.0974 5.0083C15.5864 4.5593 16.3654 4.5853 16.8244 5.0633C17.2734 5.5313 17.2484 6.2993 16.7694 6.7483L10.1694 12.9473L13.0484 18.2513C13.4384 18.9073 14.4274 18.7683 14.6484 18.0323L19.2974 1.9423C19.4874 1.2623 19.2874 0.5123 18.7674 0.0123C18.2574 -0.4877 17.5074 -0.6877 16.8274 -0.4977L21.4274 2.5783Z" 
                    fill="currentColor"
                  />
                </svg>
                Go to Develop Portal
              </a>
            </div>
            
            {/* Right side - Rocket Illustration */}
            <div className="flex-1 flex justify-center items-center">
              <svg 
                width="400" 
                height="300" 
                viewBox="0 0 400 300" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                {/* Background stars */}
                <circle cx="50" cy="40" r="2" fill="#E2E8F0" />
                <circle cx="350" cy="60" r="1.5" fill="#E2E8F0" />
                <circle cx="80" cy="80" r="1" fill="#E2E8F0" />
                <circle cx="320" cy="100" r="2" fill="#E2E8F0" />
                <circle cx="30" cy="120" r="1.5" fill="#E2E8F0" />
                <circle cx="370" cy="140" r="1" fill="#E2E8F0" />
                
                {/* Large background circles/planets */}
                <circle cx="70" cy="50" r="25" fill="none" stroke="#E2E8F0" strokeWidth="2" opacity="0.5" />
                <circle cx="330" cy="70" r="15" fill="#F1F5F9" opacity="0.6" />
                <circle cx="350" cy="200" r="20" fill="none" stroke="#E2E8F0" strokeWidth="1.5" opacity="0.4" />
                
                {/* Clouds */}
                <ellipse cx="60" cy="220" rx="25" ry="8" fill="#F1F5F9" opacity="0.7" />
                <ellipse cx="45" cy="215" rx="18" ry="6" fill="#F1F5F9" opacity="0.7" />
                <ellipse cx="320" cy="240" rx="30" ry="10" fill="#F1F5F9" opacity="0.6" />
                <ellipse cx="300" cy="235" rx="20" ry="7" fill="#F1F5F9" opacity="0.6" />
                
                {/* Launch clouds at bottom */}
                <ellipse cx="200" cy="280" rx="40" ry="12" fill="#F1F5F9" opacity="0.8" />
                <ellipse cx="180" cy="275" rx="25" ry="8" fill="#E2E8F0" opacity="0.6" />
                <ellipse cx="220" cy="275" rx="30" ry="10" fill="#E2E8F0" opacity="0.6" />
                
                {/* Rocket body */}
                <path 
                  d="M185 250 L215 250 L215 150 L205 130 L195 130 Z" 
                  fill="#E2E8F0" 
                  stroke="#94A3B8" 
                  strokeWidth="2"
                />
                
                {/* Rocket nose cone */}
                <path 
                  d="M195 130 L205 130 L200 110 Z" 
                  fill="#CBD5E1" 
                  stroke="#94A3B8" 
                  strokeWidth="2"
                />
                
                {/* Rocket window */}
                <circle cx="200" cy="160" r="12" fill="#3B82F6" opacity="0.3" stroke="#2563EB" strokeWidth="2" />
                <circle cx="200" cy="160" r="6" fill="#1D4ED8" opacity="0.5" />
                
                {/* Rocket fins */}
                <path d="M185 250 L175 270 L185 270 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
                <path d="M215 250 L225 270 L215 270 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
                
                {/* Rocket flames */}
                <path 
                  d="M190 250 L190 290 L195 285 L200 295 L205 285 L210 290 L210 250" 
                  fill="#F59E0B" 
                  opacity="0.7"
                />
                <path 
                  d="M195 250 L195 285 L200 280 L205 285 L205 250" 
                  fill="#EF4444" 
                  opacity="0.6"
                />
                
                {/* Motion lines */}
                <line x1="150" y1="180" x2="170" y2="180" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                <line x1="155" y1="200" x2="175" y2="200" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                <line x1="145" y1="220" x2="170" y2="220" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                
                <line x1="230" y1="185" x2="250" y2="185" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                <line x1="225" y1="205" x2="245" y2="205" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                <line x1="235" y1="225" x2="260" y2="225" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200" style={{ marginTop: '24px' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <span>© 2024 Re:Earth contributors</span>
            <a href="https://reearth.io/terms" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Terms</a>
            <a href="https://reearth.io/privacy" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Privacy</a>
            <a href="https://reearth.io/cookies" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Cookies</a>
            <a href="https://reearth.io/cookie-settings" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Cookie Settings</a>
            <a href="https://reearth.io/contact" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">Contact</a>
          </div>
        </div>
      </footer>

      {/* Plugin Install Modal */}
      <PluginInstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        plugin={plugin}
        onInstall={handleInstallPlugin}
      />
    </div>
  );
};

export default PluginDetail;