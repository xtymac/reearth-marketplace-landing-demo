# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive Re:Earth Marketplace implementation featuring both static HTML prototypes and a fully functional React application. The project showcases plugins, integrations, and nodes for the Re:Earth geospatial platform, demonstrating a modern marketplace interface where users can discover community-made extensions.

## File Structure

### Static HTML Prototype
- `index.html` - Main marketplace landing page with navigation, search, featured items, and product categories
- `search-results.html` - Search results page template
- `plugin-detail.html` - Individual plugin detail page template
- `plugin-edit.html` - Plugin editing interface with advanced features
- `style.css` - Main CSS file with responsive design and modern styling
- `script.js` - JavaScript functionality for interactions, search, filtering, and animations
- Additional CSS and JS files for specific pages

### React Application
- `src/App.js` - Main React application with routing
- `src/components/Marketplace.jsx` - Main marketplace component with responsive navigation and card grid
- `src/components/PluginCard.jsx` - Individual plugin card component with consistent height layout
- `src/components/PluginDetail.jsx` - Plugin detail view component
- `src/data/pluginData.js` - Plugin data with comprehensive descriptions and metadata
- `src/services/pluginService.js` - Plugin data management services
- `src/utils/randomGenerator.js` - Utility functions for stable random data generation
- `public/` - Static assets including images and HTML template
- `package.json` - React dependencies and build scripts

## Architecture

### Core Components
- **Navigation System**: Responsive header with proper Re:Earth branding, dropdown menus, and consistent typography
- **Search & Filter**: Real-time search functionality with comprehensive plugin filtering
- **Plugin Grid**: CSS Grid layout with uniform card heights across all breakpoints
- **Card Components**: Flex-based cards with 16:9 aspect ratio thumbnails and consistent content distribution
- **Interactive Elements**: Hover effects, search functionality, and responsive behavior

### Key Features
- **Consistent Typography**: Outfit font for English text, Noto Sans JP for Japanese text
- **Uniform Card Heights**: CSS Grid with align-items: stretch ensures consistent row heights
- **Responsive Design**: 1/2/3 column layouts based on screen size with maintained card consistency
- **Professional Content**: Comprehensive plugin descriptions with detailed functionality explanations
- **React Routing**: Single-page application with routing between marketplace and plugin detail views
- **State Management**: React hooks for search, filtering, and plugin data management

### Latest Updates (Current Commit)
- **Plugin Detail Page Enhancement**: Major overhaul of the plugin detail page with comprehensive documentation
- **Documentation Section**: Added complete documentation section with realistic content for all 9 plugins
  - Overview with plugin-specific descriptions tailored to each plugin's functionality
  - Key Features with icons and detailed descriptions
  - Installation and usage step-by-step guides
  - Configuration settings and technical notes
  - Screenshot placeholders with proper alt text
- **Change Log Section**: Implemented comprehensive change log functionality
  - Realistic version history for all 9 plugins with 3-4 entries each
  - Four status tag types: Bug Fix (red), New Feature (green), Doc Update (blue), UI Update (pink)
  - Smart "Show more/Show less" functionality that only appears when text exceeds two lines
  - Proper text truncation using CSS line-clamp with dynamic height detection
- **Layout Structure**: Restructured plugin detail page layout
  - Hero section with image gallery and plugin metadata
  - 28px gap between sections for proper visual separation
  - Documentation section positioned below hero
  - Change log section positioned below documentation
  - All sections use consistent styling (max-width 1280px, 24px padding, white background)
- **Content Generation**: Created comprehensive, realistic content for all plugins
  - 3D Building Visualization: Architecture and urban planning focus
  - Weather API Integration: Real-time weather data integration
  - IoT Sensor Network: Distributed sensor monitoring
  - Advanced GIS Mapping: Professional geospatial analysis
  - Smart Mobility Hub: Urban transportation planning
  - Green Energy Monitor: Renewable energy tracking
  - Land Use Classifier: ML-based satellite imagery analysis
  - Real-Time Sensor Overlay: Environmental data visualization
  - Time-Lapse Terrain Viewer: Historical terrain analysis
- **Responsive Design**: Maintained responsive behavior across all new sections
- **React Architecture**: Enhanced component structure with proper state management and hooks

## Development Commands

### Static HTML Prototype
- Open `index.html` in a web browser to view the main page
- Use a local development server for testing (e.g., `python -m http.server` or Live Server extension)

### React Application
- `npm start` - Start development server at http://localhost:3000
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (one-way operation)

## Design System

- **Primary Colors**: Blue accent (#0089D4), background (#FEFAF0)
- **Typography**: 
  - English text: Outfit font family (16px, 400 weight, 140% line-height for navigation)
  - Japanese text: "Noto Sans JP" font family
  - Headings: Outfit font with various sizes (56px for main title, 24px for subtitles)
- **Layout**: CSS Grid with responsive breakpoints (1/2/3 columns)
- **Card Design**: Consistent heights using flexbox with 16:9 aspect ratio images
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Assets**: Local logo files and plugin images in public directory

## Plugin Data Structure

Each plugin includes:
- **Basic Info**: ID, title, company, version, update date, file size
- **Content**: Enhanced descriptions with detailed functionality explanations
- **Visual**: High-quality thumbnail images with consistent aspect ratios
- **Metadata**: Tags, category, engagement metrics (likes, downloads)
- **Gallery**: Multiple images for plugin detail views

## Browser Compatibility

Supports modern browsers (Chrome, Firefox, Safari, Edge latest versions) with:
- CSS Grid and Flexbox layouts
- ES6+ JavaScript features
- React 18+ functionality
- Responsive design principles