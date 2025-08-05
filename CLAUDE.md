# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive Re:Earth Marketplace implementation featuring both static HTML prototypes and a fully functional React application. The project showcases plugins, integrations, and nodes for the Re:Earth geospatial platform, demonstrating a modern marketplace interface where users can discover community-made extensions.

## File Structure

### Static HTML Prototype
- `index.html` - Main marketplace landing page with navigation, search, featured items, and product categories
- `search-results.html` - Search results page template
- `plugin-detail.html` - Individual plugin detail page template with comprehensive documentation and change log sections
- `plugin-detail.css` - Dedicated CSS file for plugin detail page styling with advanced change log functionality
- `plugin-edit.html` - Plugin editing interface with advanced features
- `style.css` - Main CSS file with responsive design and modern styling
- `script.js` - JavaScript functionality for interactions, search, filtering, and animations
- Additional CSS and JS files for specific pages

### React Application
- `src/App.js` - Main React application with routing including Dashboard route
- `src/components/Marketplace.jsx` - Main marketplace component with responsive navigation and card grid
- `src/components/PluginCard.jsx` - Individual plugin card component with consistent height layout
- `src/components/PluginDetail.jsx` - Plugin detail view component with comprehensive documentation, change log sections, and Edit plugin button
- `src/components/Dashboard.jsx` - User dashboard with three-column layout, workspace management, and project tabs
- `src/components/Login.jsx` - User authentication and login component
- `src/components/PluginUpload.jsx` - Plugin upload and management interface with integrated navbar and footer
- `src/components/ProtectedRoute.jsx` - Route protection wrapper for authenticated pages
- `src/data/pluginData.js` - Plugin data with comprehensive descriptions and metadata
- `src/services/pluginService.js` - Plugin data management services
- `src/services/authService.js` - Authentication and user management services with user data storage
- `src/utils/randomGenerator.js` - Utility functions for stable random data generation
- `public/` - Static assets including images and HTML template
- `package.json` - React dependencies and build scripts

## Architecture

### Core Components
- **Navigation System**: Responsive header with proper Re:Earth branding, dropdown menus, consistent typography, and user avatar dropdown
- **Dashboard System**: Three-column layout with workspace management, project tabs, and user-friendly interface
- **Authentication System**: Login functionality with protected routes, user session management, and avatar dropdown
- **Search & Filter**: Real-time search functionality with comprehensive plugin filtering
- **Plugin Grid**: CSS Grid layout with uniform card heights across all breakpoints
- **Card Components**: Flex-based cards with 16:9 aspect ratio thumbnails and consistent content distribution
- **Plugin Management**: Upload interface for plugin developers with form validation and integrated UI components
- **Interactive Elements**: Hover effects, search functionality, responsive behavior, and edit functionality

### Key Features
- **Consistent Typography**: Outfit font for English text, Noto Sans JP for Japanese text
- **Uniform Card Heights**: CSS Grid with align-items: stretch ensures consistent row heights
- **Responsive Design**: 1/2/3 column layouts based on screen size with maintained card consistency
- **Professional Content**: Comprehensive plugin descriptions with detailed functionality explanations
- **React Routing**: Single-page application with routing between marketplace, plugin detail, dashboard, login, and upload views
- **State Management**: React hooks for search, filtering, authentication, workspace management, and plugin data management
- **User Authentication**: Secure login system with protected routes, user data storage, and avatar dropdown functionality
- **Dashboard Interface**: Comprehensive user dashboard with workspace selection, project tabs, and activity tracking
- **Plugin Upload**: Complete plugin submission workflow with form validation, file handling, and integrated UI
- **Plugin Management**: Edit plugin functionality with placeholder implementation for future features

### Latest Updates (Current Commit)
- **Dashboard Implementation**: Complete user dashboard with professional interface
  - Three-column responsive layout with workspace management, content area, and shortcuts
  - Workspace selection with Personal and Team groups, including Japanese workspace names
  - Project tabs (CMS Project, Visualizer Project, Plugins) with default Plugins tab
  - Plugin list with table-like grid layout showing workspace/plugin names and platform tags
  - Welcome card with community information and shortcut cards for Visualizer/CMS editors
  - Integrated logged-in navbar and footer for consistent user experience
- **Enhanced Authentication & Navigation**: Improved user experience across components
  - Avatar dropdown with user information header showing username and email with fallback logic
  - Navigation handlers for Dashboard, Settings, and Logout functionality
  - Login redirect improvements to return users to original page after authentication
  - New tab functionality for plugin submission links throughout the application
- **Plugin Upload Enhancements**: Integrated UI components and improved navigation
  - Reused logged-in navbar component for consistent header experience
  - Added standard site footer to maintain design consistency
  - Updated breadcrumb navigation with Dashboard link for better user flow
  - Maintained all form functionality while integrating shared UI components
- **Plugin Detail Improvements**: Enhanced functionality and user interactions
  - Added "Edit plugin" button with proper styling between Download ZIP and Like buttons
  - Fixed "Submit Plugin" CTA button to properly link to New Plugin page
  - Maintained comprehensive documentation and change log sections
  - Improved button layout and interaction patterns
- **UI/UX Optimizations**: Refined layouts and responsive behavior
  - Optimized plugin list grid with better column proportions (2fr_120px_60px)
  - Enhanced title display with workspace/plugin name format and platform tags
  - Improved mobile responsive design with vertical stacking on small screens
  - Table-style headers positioned outside individual cards for cleaner presentation

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