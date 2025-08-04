import { generateStableEngagement } from '../utils/randomGenerator';

// Plugin data with stable random likes and downloads
const basePluginData = [
  {
    id: 1,
    title: "3D Building Visualization",
    image: "/images/visualizer/6e82e5cb4f3ab9225ed72467ef0e69d44c5d7ae5df84bd6fb057bd551da4bbb1.png",
    description: "3D Building Visualization provides high-precision 3D modeling tools tailored for architects, city planners, and disaster response teams. Users can visualize buildings in realistic urban environments, simulate infrastructure development, and analyze potential disaster impacts. The plugin supports integration with geospatial data and offers interactive visual outputs ideal for public presentations and stakeholder engagement.",
    fullDescription: "3D Building Visualization provides high-precision 3D modeling tools tailored for architects, city planners, and disaster response teams. Users can visualize buildings in realistic urban environments, simulate infrastructure development, and analyze potential disaster impacts. The plugin supports integration with geospatial data and offers interactive visual outputs ideal for public presentations and stakeholder engagement.",
    company: "株式会社出山コンサルタント",
    tags: ["Urban Planning", "Architecture", "Urban Planning"],
    version: "v2.1.3",
    updatedDate: "2024/08/22",
    size: "4.2MB",
    category: "visualizer",
    gallery: [
      "/images/visualizer/6e82e5cb4f3ab9225ed72467ef0e69d44c5d7ae5df84bd6fb057bd551da4bbb1.png",
      "/images/visualizer/Advanced GIS Mapping.png",
      "/images/visualizer/Smart Mobility Hub.png",
      "/images/visualizer/Green Energy Monitor.png"
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
    gallery: [
      "/images/visualizer/Weather API Integration.png",
      "/images/visualizer/IoT Sensor Network.png",
      "/images/visualizer/Real-Time Sensor Overlay.png"
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
    gallery: [
      "/images/visualizer/IoT Sensor Network.png",
      "/images/visualizer/9cf6efff-9011-4b92-a874-2f0dedea4050.png",
      "/images/visualizer/Advanced GIS Mapping.png"
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
    gallery: [
      "/images/visualizer/Advanced GIS Mapping.png",
      "/images/visualizer/Land Use Classifier.png",
      "/images/visualizer/Smart Mobility Hub.png"
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
    gallery: [
      "/images/visualizer/Smart Mobility Hub.png",
      "/images/visualizer/Advanced GIS Mapping.png",
      "/images/visualizer/IoT Sensor Network.png"
    ]
  },
  {
    id: 6,
    title: "Green Energy Monitor",
    image: "/images/visualizer/Green Energy Monitor.png",
    description: "The IoT Sensor Network plugin enables seamless integration of distributed sensor nodes to collect, transmit, and visualize real-time environmental and operational data. Ideal for smart cities, industrial automation, agriculture, and building management, this plugin supports various sensor types and offers robust communication protocols for reliable, scalable monitoring solutions.",
    fullDescription: "The IoT Sensor Network plugin enables seamless integration of distributed sensor nodes to collect, transmit, and visualize real-time environmental and operational data. Ideal for smart cities, industrial automation, agriculture, and building management, this plugin supports various sensor types and offers robust communication protocols for reliable, scalable monitoring solutions.",
    company: "環境テクノロジー株式会社",
    tags: ["Renewable Energy", "Carbon Reduction", "Monitoring"],
    version: "v1.2.1",
    updatedDate: "2024/06/12",
    size: "3.9MB",
    category: "visualizer",
    gallery: [
      "/images/visualizer/Green Energy Monitor.png",
      "/images/visualizer/IoT Sensor Network.png",
      "/images/visualizer/Real-Time Sensor Overlay.png"
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
    gallery: [
      "/images/visualizer/Land Use Classifier.png",
      "/images/visualizer/Advanced GIS Mapping.png",
      "/images/visualizer/Green Energy Monitor.png"
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
    gallery: [
      "/images/visualizer/9cf6efff-9011-4b92-a874-2f0dedea4050.png",
      "/images/visualizer/IoT Sensor Network.png",
      "/images/visualizer/Weather API Integration.png"
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
    gallery: [
      "/images/visualizer/Real-Time Sensor Overlay.png",
      "/images/visualizer/Land Use Classifier.png",
      "/images/visualizer/Advanced GIS Mapping.png"
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