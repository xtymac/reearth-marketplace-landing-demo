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
- `src/components/PluginDetail.jsx` - Plugin detail view component with comprehensive documentation, change log sections, and conditional Edit plugin button
- `src/components/Dashboard.jsx` - User dashboard with three-column layout, workspace management, and project tabs using DashboardNav
- `src/components/DashboardNav.jsx` - Specialized navigation component for dashboard pages with logo and user avatar dropdown
- `src/components/Login.jsx` - User authentication and login component
- `src/components/PluginUpload.jsx` - Plugin upload and management interface with DashboardNav integration and GitHub repository upload option
- `src/components/PluginEdit.jsx` - Plugin editing interface using DashboardNav with form controls, Plugin Status toggle (Draft/Public), and settings
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
- **Dashboard Navigation**: Specialized DashboardNav component for dashboard-specific pages with dashboard logo and simplified layout
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
- **Plugin Management**: Edit plugin functionality with Plugin Status toggle (Draft/Public states) and GitHub repository upload support

### Latest Updates (Current Commit)
- **Plugin Management Enhancements**: Enhanced plugin editing and upload capabilities
  - Added Plugin Status toggle in PluginEdit component with Draft/Public states
  - Implemented GitHub repository upload option as alternative to local file upload
  - Enhanced form validation to handle both local file and GitHub URL inputs
  - Added toggle UI with proper state management and visual feedback
  - GitHub URL validation with regex pattern for repository format validation
- **Dashboard Navigation Implementation**: Centralized navigation for dashboard pages
  - Created DashboardNav component for /dashboard, /plugin/new, /plugin/[id]/edit pages
  - Integrated dashboard logo functionality with clickable navigation back to dashboard
  - Reduced code duplication by centralizing dashboard-specific navigation logic
  - Maintained consistent user experience across authenticated dashboard pages
- **Upload Workflow Improvements**: Flexible plugin submission methods
  - Toggle between local file upload and GitHub repository options
  - GitHub repository input with placeholder and validation
  - Notes section explaining repository requirements (public, main branch only)
  - Updated form handling to accommodate both upload methods with proper error handling

## Development Commands

### Static HTML Prototype
- Open `index.html` in a web browser to view the main page
- Use a local development server for testing (e.g., `python -m http.server` or Live Server extension)

### React Application
- `npm start` - Start development server at http://localhost:3000
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (one-way operation)

## Deployment

### Netlify Deployment
The project is configured for seamless Netlify deployment with the following optimizations:
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Environment Variables**: Configured via `.env` file to prevent CI warnings from failing builds
- **Asset Optimization**: Proper image handling and static asset management
- **Error Handling**: ESLint warnings configured to not break production builds

### Local Production Testing
```bash
npm run build
npm install -g serve
serve -s build
```

### Deployment Troubleshooting
- **Build Warnings**: Configured with CI=false to prevent warnings from breaking deployment
- **Asset Paths**: All assets use absolute paths from public directory
- **Bundle Size**: Optimized imports to reduce bundle size and improve loading times

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