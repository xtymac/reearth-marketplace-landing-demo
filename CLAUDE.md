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
- `src/App.js` - Main React application with routing
- `src/components/Marketplace.jsx` - Main marketplace component with responsive navigation and card grid
- `src/components/PluginCard.jsx` - Individual plugin card component with consistent height layout
- `src/components/PluginDetail.jsx` - Plugin detail view component with comprehensive documentation and change log sections
- `src/components/Login.jsx` - User authentication and login component
- `src/components/PluginUpload.jsx` - Plugin upload and management interface
- `src/components/ProtectedRoute.jsx` - Route protection wrapper for authenticated pages
- `src/data/pluginData.js` - Plugin data with comprehensive descriptions and metadata
- `src/services/pluginService.js` - Plugin data management services
- `src/services/authService.js` - Authentication and user management services
- `src/utils/randomGenerator.js` - Utility functions for stable random data generation
- `public/` - Static assets including images and HTML template
- `package.json` - React dependencies and build scripts

## Architecture

### Core Components
- **Navigation System**: Responsive header with proper Re:Earth branding, dropdown menus, and consistent typography
- **Authentication System**: Login functionality with protected routes and user session management
- **Search & Filter**: Real-time search functionality with comprehensive plugin filtering
- **Plugin Grid**: CSS Grid layout with uniform card heights across all breakpoints
- **Card Components**: Flex-based cards with 16:9 aspect ratio thumbnails and consistent content distribution
- **Plugin Management**: Upload interface for plugin developers with form validation
- **Interactive Elements**: Hover effects, search functionality, and responsive behavior

### Key Features
- **Consistent Typography**: Outfit font for English text, Noto Sans JP for Japanese text
- **Uniform Card Heights**: CSS Grid with align-items: stretch ensures consistent row heights
- **Responsive Design**: 1/2/3 column layouts based on screen size with maintained card consistency
- **Professional Content**: Comprehensive plugin descriptions with detailed functionality explanations
- **React Routing**: Single-page application with routing between marketplace, plugin detail, login, and upload views
- **State Management**: React hooks for search, filtering, authentication, and plugin data management
- **User Authentication**: Secure login system with protected routes for plugin management
- **Plugin Upload**: Complete plugin submission workflow with form validation and file handling

### Latest Updates (Current Commit)
- **Authentication System**: Implemented comprehensive user authentication
  - Login component with form validation and user session management
  - Protected routes wrapper to secure plugin management pages
  - Authentication service with login/logout functionality and token management
  - Integration with React Router for seamless navigation flow
- **Plugin Upload System**: Complete plugin submission workflow
  - Plugin upload component with comprehensive form validation
  - File upload handling with drag-and-drop interface
  - Multi-step form with plugin details, categories, and metadata
  - Form validation with real-time feedback and error handling
- **Enhanced Styling**: Dedicated CSS architecture
  - plugin-detail.css with comprehensive styling for plugin detail pages
  - Advanced change log styling with expandable sections and status tags
  - Responsive design enhancements for all new components
  - Consistent design language across authentication and upload interfaces
- **Plugin Detail Enhancements**: Extended functionality for both HTML and React versions
  - Comprehensive documentation sections with realistic content for all 9 plugins
  - Change log functionality with version history and categorized updates
  - Interactive elements with hover effects and smooth transitions
  - Professional content tailored to each plugin's specific functionality
- **Build System Updates**: Enhanced development workflow
  - Updated package.json with new dependencies for authentication and routing
  - Build artifacts updated to reflect latest component additions
  - Maintained backward compatibility with existing static HTML prototype

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