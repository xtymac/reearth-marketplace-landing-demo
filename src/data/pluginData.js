import { generateStableEngagement } from '../utils/randomGenerator';

// Plugin data with stable random likes and downloads
const basePluginData = [
  {
    id: 1,
    title: "3D Building Visualization",
    image: "/images/visualizer/6e82e5cb4f3ab9225ed72467ef0e69d44c5d7ae5df84bd6fb057bd551da4bbb1.png",
    description: "3D Building Visualization provides high-precision 3D modeling tools tailored for architects, city planners, and disaster response teams. Users can visualize buildings in realistic urban environments, simulate infrastructure development, and analyze potential disaster impacts. The plugin supports integration with geospatial data and offers interactive visual outputs ideal for public presentations and stakeholder engagement.",
    fullDescription: "3D Building Visualization provides high-precision 3D modeling tools tailored for architects, city planners, and disaster response teams. Users can visualize buildings in realistic urban environments, simulate infrastructure development, and analyze potential disaster impacts. The plugin supports integration with geospatial data and offers interactive visual outputs ideal for public presentations and stakeholder engagement.",
    company: "株式会社福山コンサルタント",
    tags: ["Urban Planning", "Architecture", "Urban Planning"],
    version: "v2.1.3",
    updatedDate: "2024/08/22",
    size: "4.2MB",
    category: "visualizer",
    readme: `# 🏙️ 3D Building Visualization

**3D Building Visualization** is a powerful plugin designed to enhance urban planning workflows through immersive 3D representations of buildings and cityscapes. Perfect for architects, city planners, and disaster management teams, it provides real-time visualization of infrastructure within your Visualizer project.

---

## ✨ Features

- 🏗️ Render realistic 3D building models from geospatial data  
- 📊 Integrate zoning, demographic, or utility data overlays  
- 🔄 Real-time updates for planning simulations and stakeholder presentations  
- 🚧 Use in conjunction with disaster planning or development analysis tools  

---

## 📦 Use Cases

- City development and zoning meetings  
- Urban resilience planning and simulation  
- Architectural concept visualization  
- Interactive presentations for public and governmental review  

---

## 🏷️ Tags

\`Urban Planning\` \`防災\` \`データビジュアライザー\`

---

## 🚀 Getting Started

1. Add the plugin to your Visualizer workspace  
2. Upload or connect to your 3D building dataset (e.g., CityGML, GeoJSON)  
3. Configure layers and styling from the plugin settings  
4. Start exploring your city in 3D!

---

## 📄 License

MIT License © 2025 YourCompanyName

---

## 📬 Support

Have questions or feature requests?  
Contact us at: [support@yourdomain.com](mailto:support@yourdomain.com)`,
    gallery: [
      "/images/visualizer/6e82e5cb4f3ab9225ed72467ef0e69d44c5d7ae5df84bd6fb057bd551da4bbb1.png",
      "/images/visualizer/Advanced GIS Mapping.png",
      "/images/visualizer/Smart Mobility Hub.png",
      "/images/visualizer/Green Energy Monitor.png"
    ],
    changelog: [
      {
        version: "2.1.3",
        date: "December 15, 2024",
        tags: ["Bug Fix", "Doc Update", "UI Update"],
        content: "Performance improvements and bug fixes to enhance user experience. Fixed memory leaks, improved rendering performance by 25%, and resolved browser compatibility issues for smoother visualization workflows. Updated documentation with new API examples and enhanced user interface with better accessibility features.",
        expanded: false
      },
      {
        version: "2.1.0",
        date: "December 1, 2024", 
        tags: ["New Feature", "UI Update"],
        content: "Major update introducing comprehensive material library with 50+ realistic building materials and dynamic lighting system. Features include sun position simulation, shadow casting, and real-time atmospheric effects for enhanced realism.",
        expanded: false
      },
      {
        version: "1.9.2",
        date: "October 20, 2024",
        tags: ["Bug Fix", "New Feature", "Doc Update"],
        content: "Comprehensive user interface improvements focusing on usability and accessibility. Redesigned control panels, added keyboard shortcuts, enhanced mobile responsiveness, and improved screen reader support for better inclusive design.",
        expanded: false
      },
      {
        version: "1.9.0",
        date: "November 10, 2024",
        tags: ["Bug Fix"],
        content: "Enhanced data handling capabilities with support for BIM file formats (IFC, RVT), automatic Level of Detail generation, improved GeoJSON parsing, and batch processing capabilities for handling large-scale architectural datasets efficiently.",
        expanded: false
      }
    ]
  },
  {
    id: 2,
    title: "Weather API Integration",
    image: "/images/visualizer/Weather API Integration.png",
    description: "Easily integrate real-time weather data into your application using this flexible Weather API Integration plugin. Customize location queries, units (Celsius/Fahrenheit), and refresh intervals to suit your needs. Ideal for dashboards, outdoor service apps, travel platforms, or any project that benefits from up-to-date weather info. Supports multiple data providers and includes failover mechanisms to ensure reliability.",
    fullDescription: "Easily integrate real-time weather data into your application using this flexible Weather API Integration plugin. Customize location queries, units (Celsius/Fahrenheit), and refresh intervals to suit your needs. Ideal for dashboards, outdoor service apps, travel platforms, or any project that benefits from up-to-date weather info. Supports multiple data providers and includes failover mechanisms to ensure reliability.",
    company: "気象データ株式会社",
    tags: ["Weather", "Weather Forecast", "Real-Time", "Temp"],
    version: "v1.4.2",
    updatedDate: "2024/07/15",
    size: "2.8MB",
    category: "visualizer",
    readme: `# 🌤️ Weather API Integration

**Weather API Integration** seamlessly connects your application with real-time meteorological data from trusted weather providers. Perfect for dashboards, outdoor services, travel platforms, and any project requiring current weather information with customizable parameters and reliable data delivery.

---

## ✨ Features

- 🌡️ Real-time weather data with multiple provider support
- 📍 Location-based queries (coordinates, cities, regions)
- 🔄 Configurable refresh intervals (1 minute to 24 hours)
- 🌐 Multiple units support (Celsius, Fahrenheit, Kelvin)
- 📊 Historical weather data access for trend analysis

---

## 📦 Use Cases

- Weather dashboards and monitoring systems
- Outdoor service planning and logistics
- Travel and tourism applications
- Agricultural and environmental monitoring
- Emergency preparedness and response

---

## 🏷️ Tags

\`Weather\` \`Real-Time Data\` \`API Integration\` \`Forecasting\`

---

## 🚀 Getting Started

1. Install the plugin from the Re:Earth Marketplace
2. Obtain API keys from supported weather providers
3. Configure API credentials in plugin settings
4. Set refresh intervals and location parameters
5. Start receiving live weather data!

---

## ⚙️ Configuration

- **API Providers**: OpenWeatherMap, WeatherAPI, AccuWeather
- **Rate Limiting**: Automatic throttling and quota management
- **Cache Duration**: 5 minutes to 24 hours optimization
- **Failover**: Automatic provider switching for reliability

---

## 📄 License

MIT License © 2024 Weather Data Corporation

---

## 📬 Support

Need assistance with weather data integration?  
Contact us at: [weather-support@weatherdata.co.jp](mailto:weather-support@weatherdata.co.jp)`,
    gallery: [
      "/images/visualizer/Weather API Integration.png",
      "/images/visualizer/IoT Sensor Network.png",
      "/images/visualizer/Real-Time Sensor Overlay.png"
    ],
    changelog: [
      {
        version: "1.4.2",
        date: "December 10, 2024",
        tags: ["Bug Fix", "UI Update"],
        content: "Fixed API rate limiting issues and improved error handling for weather data providers. Enhanced user interface with better status indicators and streamlined configuration panel for easier setup and monitoring.",
        expanded: false
      },
      {
        version: "1.4.0",
        date: "November 25, 2024",
        tags: ["New Feature", "Doc Update"],
        content: "Added support for multiple weather providers including AccuWeather and Weather Underground. Implemented automatic failover system and enhanced caching mechanisms for improved reliability and performance.",
        expanded: false
      },
      {
        version: "1.3.5",
        date: "October 15, 2024",
        tags: ["Bug Fix", "New Feature"],
        content: "Introduced historical weather data access and improved location-based queries. Fixed timezone handling issues and added support for custom refresh intervals with intelligent rate limiting.",
        expanded: false
      }
    ]
  },
  {
    id: 3,
    title: "IoT Sensor Network",
    image: "/images/visualizer/IoT Sensor Network.png",
    description: "The IoT Sensor Network plugin enables seamless integration of distributed sensor nodes to collect, transmit, and visualize real-time environmental and operational data. Ideal for smart cities, industrial automation, agriculture, and building management, this plugin supports various sensor types and offers robust communication protocols for reliable, scalable monitoring solutions.",
    fullDescription: "The IoT Sensor Network plugin enables seamless integration of distributed sensor nodes to collect, transmit, and visualize real-time environmental and operational data. Ideal for smart cities, industrial automation, agriculture, and building management, this plugin supports various sensor types and offers robust communication protocols for reliable, scalable monitoring solutions.",
    company: "センサー技術株式会社",
    tags: ["Real-Time", "Monitoring", "Industry 4.0", "Sensor"],
    version: "v3.0.1",
    updatedDate: "2024/08/10",
    size: "5.7MB",
    category: "visualizer",
    readme: `# 📡 IoT Sensor Network

**IoT Sensor Network** enables seamless integration of distributed sensor nodes to collect, transmit, and visualize real-time environmental and operational data. Perfect for smart cities, industrial automation, agriculture, and building management systems requiring scalable, reliable monitoring solutions.

---

## ✨ Features

- 📡 Multi-protocol support (MQTT, HTTP, WebSocket, LoRaWAN)
- ⚡ Real-time streaming with millisecond latency
- 🔧 Comprehensive device management and remote configuration
- 📈 Built-in analytics with anomaly detection algorithms
- 🚨 Configurable alerts and notification system

---

## 📦 Use Cases

- Smart city environmental monitoring
- Industrial automation and predictive maintenance  
- Agricultural sensor networks and precision farming
- Building management systems and energy optimization
- Infrastructure monitoring and asset tracking

---

## 🏷️ Tags

\`IoT\` \`Sensors\` \`Real-Time Monitoring\` \`Industry 4.0\`

---

## 🚀 Getting Started

1. Install the IoT Sensor Network plugin from the marketplace
2. Configure network settings and protocol parameters
3. Add sensor devices using auto-discovery or manual setup
4. Set up data collection intervals and visualization
5. Configure alerts and monitor network health

---

## ⚙️ Configuration

- **Protocols**: MQTT, HTTP, WebSocket, LoRaWAN support
- **Device Management**: Remote configuration and firmware updates
- **Data Analytics**: Trend analysis and predictive maintenance
- **Alert System**: Threshold-based and pattern-based notifications

---

## 📄 License

MIT License © 2024 Sensor Technology Corporation

---

## 📬 Support

Need help with sensor integration?  
Contact us at: [support@sensor-tech.co.jp](mailto:support@sensor-tech.co.jp)`,
    gallery: [
      "/images/visualizer/IoT Sensor Network.png",
      "/images/visualizer/9cf6efff-9011-4b92-a874-2f0dedea4050.png",
      "/images/visualizer/Advanced GIS Mapping.png"
    ],
    changelog: [
      {
        version: "3.0.1",
        date: "December 8, 2024",
        tags: ["Bug Fix", "UI Update"],
        content: "Resolved connectivity issues with LoRaWAN sensors and improved device management interface. Enhanced real-time data streaming performance and fixed memory leaks in long-running monitoring sessions.",
        expanded: false
      },
      {
        version: "3.0.0",
        date: "November 20, 2024",
        tags: ["New Feature", "UI Update", "Doc Update"],
        content: "Major release introducing multi-protocol support for MQTT, HTTP, and WebSocket connections. Added comprehensive device management dashboard with remote configuration capabilities and predictive maintenance alerts.",
        expanded: false
      },
      {
        version: "2.8.3",
        date: "September 30, 2024",
        tags: ["Bug Fix", "New Feature"],
        content: "Implemented advanced analytics tools for sensor data with anomaly detection algorithms. Fixed data synchronization issues and added batch processing capabilities for high-volume sensor networks.",
        expanded: false
      }
    ]
  },
  {
    id: 4,
    title: "Advanced GIS Mapping",
    image: "/images/visualizer/Advanced GIS Mapping.png",
    description: "Advanced GIS Mapping empowers users to visualize, analyze, and interpret spatial data with high precision. It supports multi-layer mapping, real-time geospatial updates, and customizable map styles for land use planning, urban development, and environmental monitoring. With built-in tools for data filtering, heatmaps, and spatial queries, it's ideal for professionals in geography, infrastructure, and smart city initiatives.",
    fullDescription: "Advanced GIS Mapping empowers users to visualize, analyze, and interpret spatial data with high precision. It supports multi-layer mapping, real-time geospatial updates, and customizable map styles for land use planning, urban development, and environmental monitoring. With built-in tools for data filtering, heatmaps, and spatial queries, it's ideal for professionals in geography, infrastructure, and smart city initiatives.",
    company: "GeoVision Labs",
    tags: ["Location", "Visualization", "Real-Time", "GIS"],
    version: "v2.8.0",
    updatedDate: "2024/08/18",
    size: "8.1MB",
    category: "visualizer",
    readme: `# 🗺️ Advanced GIS Mapping

**Advanced GIS Mapping** empowers users to visualize, analyze, and interpret spatial data with high precision. Perfect for professionals in geography, infrastructure, and smart city initiatives requiring sophisticated geospatial analysis and visualization capabilities.

---

## ✨ Features

- 🗺️ Multi-layer mapping with real-time geospatial updates
- 📊 Advanced spatial queries and data filtering tools
- 🎨 Customizable map styles and visualization themes
- 🔥 Interactive heatmaps and density analysis
- 📐 Precision measurement and area calculation tools

---

## 📦 Use Cases

- Land use planning and zoning analysis
- Urban development and infrastructure planning
- Environmental monitoring and conservation
- Emergency response and disaster management
- Transportation and logistics optimization

---

## 🏷️ Tags

\`GIS\` \`Mapping\` \`Geospatial Analysis\` \`Visualization\`

---

## 🚀 Getting Started

1. Install Advanced GIS Mapping from the marketplace
2. Import your geospatial datasets (Shapefile, GeoJSON, KML)
3. Configure map layers and styling preferences
4. Apply spatial filters and analysis tools
5. Export results and share interactive maps

---

## ⚙️ Configuration

- **Data Formats**: Shapefile, GeoJSON, KML, WMS, WFS support
- **Projection Systems**: Multiple coordinate reference systems
- **Analysis Tools**: Buffer, intersection, union, spatial join
- **Export Options**: PNG, PDF, interactive web maps

---

## 📄 License

MIT License © 2024 GeoVision Labs

---

## 📬 Support

Need GIS mapping assistance?  
Contact us at: [gis-support@geovisionlabs.com](mailto:gis-support@geovisionlabs.com)`,
    gallery: [
      "/images/visualizer/Advanced GIS Mapping.png",
      "/images/visualizer/Land Use Classifier.png",
      "/images/visualizer/Smart Mobility Hub.png"
    ],
    changelog: [
      {
        version: "2.8.0",
        date: "December 5, 2024",
        tags: ["New Feature", "UI Update"],
        content: "Introduced advanced spatial analysis tools including buffer operations, spatial joins, and intersection analysis. Enhanced user interface with improved layer management and streamlined workflow for complex geospatial operations.",
        expanded: false
      },
      {
        version: "2.7.2",
        date: "November 12, 2024",
        tags: ["Bug Fix", "Doc Update"],
        content: "Fixed projection system compatibility issues and improved coordinate transformation accuracy. Updated documentation with comprehensive tutorials for advanced mapping workflows and best practices.",
        expanded: false
      },
      {
        version: "2.7.0",
        date: "October 8, 2024",
        tags: ["New Feature", "UI Update"],
        content: "Added support for real-time data streaming and dynamic layer updates. Implemented new heatmap visualization engine with improved performance and customizable color schemes for better data representation.",
        expanded: false
      }
    ]
  },
  {
    id: 5,
    title: "Smart Mobility Hub",
    image: "/images/visualizer/Smart Mobility Hub.png",
    description: "Smart Mobility Hub unifies multiple transportation modes—public transit, shared vehicles, bikes, and more—into a single digital platform. It enables real-time route planning, intermodal connections, and API integrations with mapping, traffic, and weather data. Ideal for urban mobility apps, city planners, and sustainable transport systems seeking to streamline and optimize the commuting experience.",
    fullDescription: "Smart Mobility Hub unifies multiple transportation modes—public transit, shared vehicles, bikes, and more—into a single digital platform. It enables real-time route planning, intermodal connections, and API integrations with mapping, traffic, and weather data. Ideal for urban mobility apps, city planners, and sustainable transport systems seeking to streamline and optimize the commuting experience.",
    company: "モビリソリューション",
    tags: ["Mobility", "Transportation", "Smart City", "Urban"],
    version: "v1.9.3",
    updatedDate: "2024/07/28",
    size: "6.4MB",
    category: "visualizer",
    readme: `# 🚍 Smart Mobility Hub

**Smart Mobility Hub** unifies multiple transportation modes into a single digital platform, enabling seamless intermodal connections and real-time route optimization. Perfect for urban mobility applications, city planning initiatives, and sustainable transport systems.

---

## ✨ Features

- 🚌 Multi-modal transportation integration (buses, trains, bikes, cars)
- 🗺️ Real-time route planning with traffic optimization
- 🔄 Seamless intermodal connection planning
- 🌤️ Weather and traffic data integration
- 📊 Analytics dashboard for mobility patterns

---

## 📦 Use Cases

- Urban mobility applications and journey planners
- City planning and transportation optimization
- Sustainable transport system management
- Corporate mobility solutions and fleet management
- Public transit integration and scheduling

---

## 🏷️ Tags

\`Mobility\` \`Transportation\` \`Smart City\` \`Route Planning\`

---

## 🚀 Getting Started

1. Install Smart Mobility Hub from the marketplace
2. Configure transportation data sources and APIs
3. Set up route planning algorithms and preferences
4. Integrate with mapping and traffic services
5. Deploy mobility solutions and monitor usage

---

## ⚙️ Configuration

- **Transport Modes**: Bus, train, bike, car, walking, scooter
- **APIs**: Google Maps, OpenStreetMap, GTFS feeds
- **Real-time Data**: Traffic, weather, service disruptions
- **Route Optimization**: Fastest, shortest, eco-friendly options

---

## 📄 License

MIT License © 2024 Mobility Solutions Inc.

---

## 📬 Support

Need mobility integration help?  
Contact us at: [support@mobility-solutions.jp](mailto:support@mobility-solutions.jp)`,
    gallery: [
      "/images/visualizer/Smart Mobility Hub.png",
      "/images/visualizer/Advanced GIS Mapping.png",
      "/images/visualizer/IoT Sensor Network.png"
    ],
    changelog: [
      {
        version: "1.9.3",
        date: "December 3, 2024",
        tags: ["Bug Fix", "UI Update"],
        content: "Fixed route calculation issues with multi-modal transfers and improved user interface for better accessibility. Enhanced real-time data synchronization and resolved memory leaks in long-running sessions.",
        expanded: false
      },
      {
        version: "1.9.0",
        date: "November 8, 2024",
        tags: ["New Feature", "Doc Update"],
        content: "Added support for micro-mobility options including e-scooters and bike-sharing services. Implemented weather-aware routing and enhanced API documentation with comprehensive integration examples.",
        expanded: false
      },
      {
        version: "1.8.5",
        date: "September 25, 2024",
        tags: ["New Feature", "UI Update"],
        content: "Introduced corporate mobility dashboard with fleet management capabilities. Added CO2 footprint tracking and sustainable route suggestions to promote eco-friendly transportation choices.",
        expanded: false
      }
    ]
  },
  {
    id: 6,
    title: "Green Energy Monitor",
    image: "/images/visualizer/Green Energy Monitor.png",
    description: "Green Energy Monitor tracks renewable energy generation, consumption patterns, and carbon footprint reduction across solar, wind, and other sustainable energy sources. Perfect for environmental monitoring, energy management systems, and sustainability reporting with real-time analytics and comprehensive environmental impact tracking.",
    fullDescription: "Green Energy Monitor tracks renewable energy generation, consumption patterns, and carbon footprint reduction across solar, wind, and other sustainable energy sources. Perfect for environmental monitoring, energy management systems, and sustainability reporting with real-time analytics and comprehensive environmental impact tracking.",
    company: "環境テクノロジー株式会社",
    tags: ["Renewable Energy", "Carbon Reduction", "Monitoring"],
    version: "v1.2.1",
    updatedDate: "2024/06/12",
    size: "3.9MB",
    category: "visualizer",
    readme: `# 🌱 Green Energy Monitor

**Green Energy Monitor** tracks renewable energy generation, consumption patterns, and carbon footprint reduction across multiple sustainable energy sources. Essential for environmental monitoring, energy management systems, and comprehensive sustainability reporting.

---

## ✨ Features

- 🌞 Solar and wind energy generation tracking
- 📊 Real-time consumption analytics and forecasting
- 🌍 Carbon footprint calculation and reduction metrics
- ⚡ Energy efficiency optimization recommendations
- 📈 Comprehensive sustainability reporting dashboard

---

## 📦 Use Cases

- Renewable energy facility monitoring
- Corporate sustainability reporting
- Environmental impact assessment
- Energy efficiency optimization
- Carbon credit tracking and verification

---

## 🏷️ Tags

\`Renewable Energy\` \`Sustainability\` \`Carbon Tracking\` \`Energy Efficiency\`

---

## 🚀 Getting Started

1. Install Green Energy Monitor from the marketplace
2. Connect to renewable energy data sources
3. Configure monitoring parameters and thresholds
4. Set up automated reporting schedules
5. Monitor environmental impact and optimization opportunities

---

## ⚙️ Configuration

- **Energy Sources**: Solar, wind, hydro, geothermal, biomass
- **Data Integration**: Smart meters, SCADA systems, IoT sensors
- **Reporting**: PDF, Excel, web dashboard exports
- **Alerts**: Efficiency drops, maintenance schedules, anomalies

---

## 📄 License

MIT License © 2024 Environmental Technology Corporation

---

## 📬 Support

Need green energy monitoring assistance?  
Contact us at: [support@enviro-tech.co.jp](mailto:support@enviro-tech.co.jp)`,
    gallery: [
      "/images/visualizer/Green Energy Monitor.png",
      "/images/visualizer/IoT Sensor Network.png",
      "/images/visualizer/Real-Time Sensor Overlay.png"
    ],
    changelog: [
      {
        version: "1.2.1",
        date: "December 2, 2024",
        tags: ["Bug Fix", "UI Update"],
        content: "Fixed data synchronization issues with smart meter integrations and improved dashboard responsiveness. Enhanced user interface with better accessibility features and streamlined navigation for sustainability reporting.",
        expanded: false
      },
      {
        version: "1.2.0",
        date: "November 5, 2024",
        tags: ["New Feature", "Doc Update"],
        content: "Added carbon credit tracking and verification system with automated reporting capabilities. Implemented advanced analytics for energy efficiency optimization and updated documentation with comprehensive setup guides.",
        expanded: false
      },
      {
        version: "1.1.3",
        date: "September 20, 2024",
        tags: ["New Feature", "UI Update"],
        content: "Introduced predictive analytics for renewable energy generation forecasting. Enhanced dashboard with customizable widgets and improved data visualization for better environmental impact tracking.",
        expanded: false
      }
    ]
  },
  {
    id: 7,
    title: "Land Use Classifier",
    image: "/images/visualizer/Land Use Classifier.png",
    description: "Automatically classifies land types (e.g., urban, forest, water) using satellite imagery and machine learning. Ideal for environmental monitoring and urban planning.",
    fullDescription: "Automatically classifies land types (e.g., urban, forest, water) using satellite imagery and machine learning. Ideal for environmental monitoring and urban planning.",
    company: "GeoVision Labs",
    tags: ["Visualization", "Environment", "Land", "ML"],
    version: "v2.3.4",
    updatedDate: "2024/08/05",
    size: "12.3MB",
    category: "visualizer",
    readme: `# 🌳 Land Use Classifier

**Land Use Classifier** automatically identifies and categorizes different land types using advanced satellite imagery analysis and machine learning algorithms. Perfect for environmental monitoring, urban planning, and land management applications.

---

## ✨ Features

- 🗺️ Automated land type classification (urban, forest, water, agriculture)
- 📈 Machine learning-powered satellite image analysis
- 🌍 Multi-temporal change detection and trend analysis
- 🎨 Customizable classification schemes and categories
- 📊 Accuracy metrics and validation reporting

---

## 📦 Use Cases

- Environmental impact assessment and monitoring
- Urban planning and development analysis
- Agricultural land management and optimization
- Deforestation tracking and conservation planning
- Climate change research and documentation

---

## 🏷️ Tags

\`Land Classification\` \`Machine Learning\` \`Satellite Imagery\` \`Environmental Monitoring\`

---

## 🚀 Getting Started

1. Install Land Use Classifier from the marketplace
2. Import satellite imagery datasets (Landsat, Sentinel, etc.)
3. Configure classification parameters and training data
4. Run automated classification algorithms
5. Validate results and export classified maps

---

## ⚙️ Configuration

- **Image Sources**: Landsat, Sentinel-2, MODIS, custom imagery
- **Classification**: Supervised and unsupervised learning methods
- **Accuracy Assessment**: Confusion matrices, kappa statistics
- **Export Formats**: GeoTIFF, Shapefile, KML, web services

---

## 📄 License

MIT License © 2024 GeoVision Labs

---

## 📬 Support

Need land classification assistance?  
Contact us at: [landuse-support@geovisionlabs.com](mailto:landuse-support@geovisionlabs.com)`,
    gallery: [
      "/images/visualizer/Land Use Classifier.png",
      "/images/visualizer/Advanced GIS Mapping.png",
      "/images/visualizer/Green Energy Monitor.png"
    ],
    changelog: [
      {
        version: "2.3.4",
        date: "November 28, 2024",
        tags: ["New Feature", "Bug Fix"],
        content: "Introduced deep learning classification models with improved accuracy for complex land cover types. Fixed memory optimization issues for large satellite image processing and enhanced performance for real-time analysis.",
        expanded: false
      },
      {
        version: "2.3.0",
        date: "October 15, 2024",
        tags: ["New Feature", "UI Update"],
        content: "Added multi-temporal change detection capabilities with time-series analysis. Implemented new user interface for training data management and classification workflow optimization with visual progress indicators.",
        expanded: false
      },
      {
        version: "2.2.1",
        date: "August 30, 2024",
        tags: ["Bug Fix", "Doc Update"],
        content: "Resolved classification accuracy issues with edge cases and improved algorithm stability. Updated comprehensive documentation with machine learning best practices and troubleshooting guides for better user experience.",
        expanded: false
      }
    ]
  },
  {
    id: 8,
    title: "Real-Time Sensor Overlay",
    image: "/images/visualizer/9cf6efff-9011-4b92-a874-2f0dedea4050.png",
    description: "Displays real-time environmental data (e.g., air quality, temperature, humidity) from IoT sensors directly on the map, with dynamic visual indicators.",
    fullDescription: "Displays real-time environmental data (e.g., air quality, temperature, humidity) from IoT sensors directly on the map, with dynamic visual indicators.",
    company: "EnviroNode",
    tags: ["Overlay", "Environmental Data", "Real-Time", "IoT"],
    version: "v1.7.2",
    updatedDate: "2024/07/22",
    size: "4.6MB",
    category: "visualizer",
    readme: `# 🌡️ Real-Time Sensor Overlay

**Real-Time Sensor Overlay** displays live environmental data from IoT sensors directly on interactive maps with dynamic visual indicators. Essential for environmental monitoring, smart city applications, and real-time data visualization.

---

## ✨ Features

- 🌡️ Real-time environmental data visualization (temperature, humidity, air quality)
- 🗺️ Interactive map overlays with customizable indicators
- 📊 Dynamic color-coded sensors based on data thresholds
- ⚠️ Alert system for environmental threshold breaches
- 📈 Historical data trends and pattern analysis

---

## 📦 Use Cases

- Environmental monitoring and air quality tracking
- Smart city infrastructure management
- Industrial facility environmental compliance
- Agricultural microclimate monitoring
- Emergency response and hazard detection

---

## 🏷️ Tags

\`Real-Time Data\` \`Environmental Monitoring\` \`IoT Sensors\` \`Map Overlay\`

---

## 🚀 Getting Started

1. Install Real-Time Sensor Overlay from the marketplace
2. Connect to IoT sensor networks and data streams
3. Configure sensor locations and data parameters
4. Set up visual indicators and alert thresholds
5. Monitor real-time environmental conditions

---

## ⚙️ Configuration

- **Sensor Types**: Temperature, humidity, air quality, noise, radiation
- **Data Protocols**: MQTT, HTTP REST, WebSocket, LoRaWAN
- **Visualization**: Heat maps, point indicators, contour lines
- **Alerts**: Email, SMS, dashboard notifications, API webhooks

---

## 📄 License

MIT License © 2024 EnviroNode

---

## 📬 Support

Need sensor overlay assistance?  
Contact us at: [support@environode.com](mailto:support@environode.com)`,
    gallery: [
      "/images/visualizer/9cf6efff-9011-4b92-a874-2f0dedea4050.png",
      "/images/visualizer/IoT Sensor Network.png",
      "/images/visualizer/Weather API Integration.png"
    ],
    changelog: [
      {
        version: "1.7.2",
        date: "November 20, 2024",
        tags: ["Bug Fix", "UI Update"],
        content: "Fixed real-time data synchronization issues and improved overlay rendering performance. Enhanced user interface with better sensor status indicators and streamlined configuration panel for easier sensor management.",
        expanded: false
      },
      {
        version: "1.7.0",
        date: "October 10, 2024",
        tags: ["New Feature", "Doc Update"],
        content: "Added support for additional sensor types including noise and radiation monitoring. Implemented advanced alert system with customizable thresholds and updated documentation with comprehensive integration examples.",
        expanded: false
      },
      {
        version: "1.6.5",
        date: "August 25, 2024",
        tags: ["New Feature", "UI Update"],
        content: "Introduced heat map visualization for environmental data patterns. Enhanced map interaction with hover tooltips and improved mobile responsiveness for better user experience across all devices.",
        expanded: false
      }
    ]
  },
  {
    id: 9,
    title: "Time-Lapse Terrain Viewer",
    image: "/images/visualizer/Real-Time Sensor Overlay.png",
    description: "Visualize terrain changes over time with animated map layers. Supports import of historical elevation, satellite, or weather data.",
    fullDescription: "Visualize terrain changes over time with animated map layers. Supports import of historical elevation, satellite, or weather data.",
    company: "ChronoMaps Studio",
    tags: ["Satellite", "Animation", "Historical", "Terrain"],
    version: "v1.5.8",
    updatedDate: "2024/08/01",
    size: "7.2MB",
    category: "visualizer",
    readme: `# ⏰ Time-Lapse Terrain Viewer

**Time-Lapse Terrain Viewer** creates stunning animated visualizations of terrain changes over time using historical elevation, satellite, and weather data. Perfect for geological research, environmental studies, and educational presentations.

---

## ✨ Features

- 🎥 Smooth time-lapse animations of terrain evolution
- 🌍 Historical data integration (elevation, satellite, weather)
- ⏱️ Customizable playback speed and time intervals
- 🗺️ Multi-layer support for complex visualizations
- 📁 Export capabilities for presentations and research

---

## 📦 Use Cases

- Geological research and terrain evolution studies
- Climate change visualization and impact assessment
- Urban development and infrastructure planning
- Educational content for geography and earth sciences
- Environmental monitoring and conservation planning

---

## 🏷️ Tags

\`Time-Lapse\` \`Terrain Analysis\` \`Historical Data\` \`Animation\`

---

## 🚀 Getting Started

1. Install Time-Lapse Terrain Viewer from the marketplace
2. Import historical datasets (elevation models, satellite imagery)
3. Configure time intervals and animation parameters
4. Set up visualization layers and styling
5. Generate and export time-lapse animations

---

## ⚙️ Configuration

- **Data Sources**: DEM files, Landsat, Sentinel, MODIS, weather stations
- **Time Ranges**: Daily, monthly, yearly, custom intervals
- **Animation**: Speed control, loop options, transition effects
- **Export**: MP4, GIF, image sequences, interactive web maps

---

## 📄 License

MIT License © 2024 ChronoMaps Studio

---

## 📬 Support

Need time-lapse visualization help?  
Contact us at: [support@chronomaps.studio](mailto:support@chronomaps.studio)`,
    gallery: [
      "/images/visualizer/Real-Time Sensor Overlay.png",
      "/images/visualizer/Land Use Classifier.png",
      "/images/visualizer/Advanced GIS Mapping.png"
    ],
    changelog: [
      {
        version: "1.5.8",
        date: "November 15, 2024",
        tags: ["New Feature", "Bug Fix"],
        content: "Added support for 4D visualization with elevation changes over time. Fixed animation rendering issues for large datasets and improved memory management for smoother playback of complex time-lapse sequences.",
        expanded: false
      },
      {
        version: "1.5.5",
        date: "September 28, 2024",
        tags: ["UI Update", "Doc Update"],
        content: "Enhanced animation controls with frame-by-frame navigation and improved timeline interface. Updated documentation with comprehensive tutorials for creating professional time-lapse visualizations and best practices.",
        expanded: false
      },
      {
        version: "1.5.0",
        date: "July 20, 2024",
        tags: ["New Feature", "UI Update"],
        content: "Introduced multi-layer animation support with synchronized playback controls. Implemented new export options for high-resolution video formats and enhanced user interface for better workflow management.",
        expanded: false
      }
    ]
  }
];

// Generate and attach stable random likes and downloads to each plugin
export const pluginData = basePluginData.map(plugin => {
  const engagement = generateStableEngagement(plugin.id);
  return {
    ...plugin,
    likes: engagement.likes,
    downloads: engagement.downloads
  };
});