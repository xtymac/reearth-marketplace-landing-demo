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
- `developer-portal-login.html` - Standalone Developer Portal login page with tabbed interface (Login/Sign Up)
- `markdown-editor.html` - Standalone markdown editor with tabbed interface
- `markdown-editor.css` - Dedicated CSS for markdown editor styling
- `markdown-editor.js` - JavaScript functionality for markdown editing and preview
- `style.css` - Main CSS file with responsive design and modern styling
- `script.js` - JavaScript functionality for interactions, search, filtering, and animations
- Additional CSS and JS files for specific pages

### React Application
- `src/App.js` - Main React application with routing including Dashboard, Workspace, and authentication routes
- `src/components/Marketplace.jsx` - Main marketplace component with responsive navigation and card grid
- `src/components/PluginCard.jsx` - Individual plugin card component with consistent height layout
- `src/components/PluginDetail.jsx` - Plugin detail view component with comprehensive documentation, change log sections, and conditional Edit plugin button
- `src/components/Dashboard.jsx` - User dashboard with full-width layout, workspace management, and project tabs using DashboardNav
- `src/components/Workspace.jsx` - Individual workspace view with tabbed interface, plugin management, and company-specific branding
- `src/components/DashboardNav.jsx` - Specialized navigation component for dashboard pages with logo and user avatar dropdown
- `src/components/Login.jsx` - User authentication and login component
- `src/components/PluginUpload.jsx` - Plugin upload and management interface with DashboardNav integration and GitHub repository upload option
- `src/components/PluginEdit.jsx` - Plugin editing interface using DashboardNav with form controls, Plugin Status toggle (Draft/Public), and settings
- `src/components/DeveloperPortal.jsx` - Developer Portal main interface with workspace management and plugin overview
- `src/components/DeveloperPortalEntry.jsx` - Workspace selection modal for Developer Portal entry
- `src/components/DeveloperPluginEdit.jsx` - Developer-specific plugin editing interface
- `src/components/DeveloperPluginUpload.jsx` - Developer-specific plugin upload interface
- `src/components/ProtectedRoute.jsx` - Route protection wrapper for authenticated pages
- `src/data/pluginData.js` - Plugin data with comprehensive descriptions and metadata
- `src/services/pluginService.js` - Plugin data management services
- `src/services/authService.js` - Authentication and user management services with user data storage
- `src/utils/randomGenerator.js` - Utility functions for stable random data generation
- `public/` - Static assets including images and HTML template
- `package.json` - React dependencies and build scripts

## Architecture

### Core Components
- **Navigation System**: Responsive header with proper Re:Earth branding, dropdown menus, consistent typography, and user avatar dropdown with Developer Portal access
- **Dashboard Navigation**: Specialized DashboardNav component for dashboard-specific pages with dashboard logo and simplified layout
- **Dashboard System**: Full-width layout with sidebar workspace management, project tabs, and user-friendly interface
- **Workspace Management**: Individual workspace views with company-specific branding, tabbed interfaces, and plugin organization
- **Developer Portal System**: Comprehensive developer interface with embedded plugin editing, workspace selection, plugin management, and developer-specific tools
  - In-place plugin editing with single-column layout
  - Direct card-click navigation to editing interface
  - Full plugin management capabilities within portal context
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
- **React Routing**: Single-page application with routing between marketplace, plugin detail, dashboard, workspace, developer portal, login, and upload views
- **State Management**: React hooks for search, filtering, authentication, workspace management, developer portal state, and plugin data management
- **User Authentication**: Secure login system with protected routes, user data storage, and avatar dropdown functionality with Developer Portal access
- **Dashboard Interface**: Comprehensive user dashboard with workspace selection, project tabs, and activity tracking
- **Developer Portal Interface**: Dedicated developer workspace with plugin management, visibility controls, and multi-workspace support
- **Plugin Upload**: Complete plugin submission workflow with form validation, file handling, and integrated UI
- **Plugin Management**: Advanced plugin editing with multiple management modes
  - In-portal editing across Developer Portal and workspace interfaces
  - Plugin Status toggle (Draft/Public states)
  - Single-column embedded editing workflow
  - GitHub repository upload support
  - Markdown-based README editing
  - Comprehensive version and tag management

### Latest Updates (August 20, 2025)
- **Developer Portal UI/UX Enhancements**: Comprehensive interface improvements for better user experience
  - **Avatar Dropdown System**: Implemented clickable avatar with comprehensive dropdown menu
    - Menu options: Marketplace, Dashboard, Setting, and Logout with proper navigation
    - Consistent 36px height for all dropdown items with smooth hover transitions
    - Click-outside detection for improved user interaction patterns
    - Perfect vertical and horizontal alignment with consistent spacing (6px 8px 6px 32px)
  - **Workspace Selection Enhancement**: Upgraded from basic select to custom dropdown component
    - Custom dropdown styling matching main interface design language
    - ChevronDown icon with smooth 180-degree rotation animation on state changes
    - Enhanced accessibility and visual hierarchy for workspace selection
    - Hover states with background color transitions for better user feedback
  - **Sidebar Navigation Optimization**:
    - Logo and title now clickable with navigation to /developer-portal/manage
    - Removed unnecessary border/separator below logo for cleaner visual design
    - Extended sidebar to full viewport height with fixed positioning for better space utilization
    - Enhanced Documentation menu item with NewTab icon linking to visualizer.developer.reearth.io
    - Improved hover effects and click interactions throughout sidebar elements
  - **Search Interface Improvements**:
    - Expanded search bar width range (500px-900px) for optimal usability across screen sizes
    - Repositioned sort dropdown directly adjacent to search bar for logical UI grouping
    - Maintained readable minimum width constraints for search input field
    - Enhanced responsive behavior for search and filter controls
  - **Table Layout Refinements**:
    - Fixed Action column header alignment for perfect visual consistency
    - Standardized all dropdown menu items to consistent 36px height
    - Achieved precise icon and text alignment throughout table interface
    - Improved hover states and interaction feedback for table elements
- **Developer Portal Login Page**: Standalone authentication interface for developer access
  - Created `developer-portal-login.html` with modern card-based design
  - Tabbed interface supporting both Login and Sign Up modes
  - Professional styling with grey input fields (#F5F5F5) and focus states (#EBEBEB)
  - Teal login button (#4A9B9B) with hover and active states for enhanced user feedback
  - Responsive design that adapts to mobile devices (max-width: 480px)
  - Form validation and password confirmation for sign-up workflow
  - JavaScript functionality for seamless tab switching between Login and Sign Up forms
  - Integration with Developer Portal workflow through form submission handling
  - Consistent typography using Outfit font family matching the project design system
  - Card layout with rounded corners (16px), shadow effects, and proper visual hierarchy
  - Interactive elements including "Don't remember your password?" and "Already have an account?" links
  - Loading state management for both login and signup processes with user feedback

### Previous Updates (August 18, 2025)
- **Developer Portal Plugin Editing**: Enhanced In-Place Plugin Management
  - Implemented embedded plugin editing directly within the Developer Portal interface
  - Clickable plugin cards open single-column edit interface
  - Seamless navigation between plugin list and edit views
  - Integrated comprehensive editing capabilities including:
    - General plugin information editing
    - README markdown editor with Edit/Preview modes
    - Version management with tag selection
    - Plugin Status toggle (Draft/Public)
    - Danger Zone for plugin deletion
  - State management for smooth view transitions
  - Maintained existing Developer Portal design and interaction patterns
  - Reused components from PluginEdit.jsx for consistent editing experience
- **Developer Portal Implementation**: Comprehensive developer workspace with multi-workspace support
  - Added Developer Portal link to avatar dropdown menus across all components (DashboardNav, Marketplace, PluginDetail)
  - Created DeveloperPortalEntry component for workspace selection with modal interface
  - Implemented 5 workspace options including personal and team types with member counts
  - Added routing for /developer-portal path with protected route authentication
  - Professional workspace selection interface with Japanese typography support for company names
  - Integrated workspace selection modal with close functionality and "Enter portal" button
  - Enhanced user experience with workspace context passing to Developer Portal
  - Improved workspace selection modal design
    - Increased gap between header text and workspace cards with 24px margin-top
    - Fixed workspace card selection visual inconsistency by changing unselected card background to #FFFFFF
    - Updated page background to use var(--tailwind-neutra-900, #171717) for better visual hierarchy
- **Developer Portal Main Interface**: Full-featured plugin management dashboard
  - Comprehensive plugin management with visibility filtering (All, Public, Private, Draft)
  - Real-time search functionality across plugin titles and descriptions
  - Multiple sorting options (Recently Updated, Name, Downloads) with dynamic plugin lists
  - Workspace selector dropdown with 8 different company workspaces
  - Plugin cards with visibility badges, download/like statistics, and update timestamps
  - Embedded plugin editing functionality with single-column layout
  - Direct, in-place plugin editing triggered by card clicks
  - Contextual edit mode with full plugin management capabilities
  - Enhanced user workflow with minimal navigation overhead
  - Empty state handling with "Create your first plugin" call-to-action
- **Enhanced Avatar Dropdown Navigation**: Universal Developer Portal access
  - Added Developer Portal menu item to avatar dropdowns in DashboardNav, Marketplace, and PluginDetail
  - Consistent navigation experience across all application components
  - Proper integration with existing user authentication and session management
  - Seamless transition from marketplace/dashboard to developer-focused workflow

### Previous Updates (August 6, 2025)
- **Footer Background Optimization**: Removed white backgrounds from footer elements across the entire project
  - Removed `bg-white` class from footer elements in all React components (Dashboard, PluginEdit, PluginUpload, Marketplace, PluginDetail, marketplace.jsx)
  - Static HTML files already use proper `.footer` CSS class with black background (#000000)
  - Improved visual consistency with transparent footer backgrounds that inherit from parent containers
  - Enhanced user experience with cleaner, more consistent footer styling throughout the application
- **Multi-Workspace System**: Comprehensive workspace management across multiple companies
  - Enhanced Workspace component with support for 8 different company workspaces
  - Dynamic workspace data loading based on URL parameters (workspaceId)
  - Company-specific avatars with gradient fallbacks for consistent branding
  - Individual workspace interfaces with company-specific Japanese typography support
  - Real plugin data integration showing actual plugins filtered by company
  - Professional workspace cards with detailed plugin information and status badges
- **Enhanced Dashboard Integration**: Real-time data and workspace connectivity
  - Dashboard component now integrates live plugin data from pluginData.js
  - Dynamic plugin list generation with relative time calculations
  - Enhanced workspace management with 8 different company workspaces
  - Plugin cards open in new tabs for better user workflow
  - Improved workspace navigation with dynamic workspaceId routing
  - Consistent company-to-workspace mapping across all components
- **Plugin Detail Enhancements**: Seamless workspace navigation integration
  - Dynamic company-to-workspace mapping for all supported companies
  - Clickable company names that navigate to respective workspace pages
  - Support for Japanese companies (株式会社福山コンサルタント, 気象データ株式会社, etc.)
  - Enhanced breadcrumb navigation with hover effects and proper styling
  - Improved user experience with consistent navigation patterns
- **Plugin Edit Interface**: Dynamic data loading and workspace integration
  - Plugin editing now loads actual plugin data based on URL parameters
  - Dynamic company-to-workspace breadcrumb navigation
  - Enhanced form initialization with real plugin data (title, description, tags, images)
  - Improved Japanese typography support with font family detection
  - Clickable company breadcrumbs that navigate to workspace pages
  - Form data management updated to use actual plugin information
- **Standalone Markdown Editor**: Independent editing interface
  - Created standalone HTML/CSS/JS markdown editor (markdown-editor.html/css/js)
  - Tab-based editing interface with Edit and Preview modes
  - Integration with marked.js library for markdown rendering
  - Professional styling matching the main application design
  - Reusable component for external markdown editing workflows
- **Version Management System**: Complete version changelog editing interface
  - Implemented Version tab with professional version cards matching Plugin detail page design
  - Multi-tag selection system with four status labels: Bug Fix, New Feature, Doc Update, UI Update
  - Custom tag dimensions: Bug Fix (62px), New Feature (96px), Doc Update (91px), UI Update (79px)
  - Show more/less functionality with 2-line content truncation
  - Edit mode with tag selection, content editing, and Save/Cancel functionality
  - Version cards with proper styling: white background, subtle shadow, rounded corners
  - Real-time tag toggle with visual feedback (opacity and border changes)
- **Danger Zone Implementation**: Plugin deletion interface with safety warnings
  - Added Danger Zone tab with Delete Plugin functionality
  - Removed subtitle for cleaner layout
  - Delete button with destructive styling (#F47579 background)
  - Comprehensive warning text with proper neutral gray color (#737373)
  - Support contact link with function link color (#0089D4)
  - Multi-paragraph warning about irreversible actions and data loss
- **Enhanced Plugin Edit Interface**: Improved navigation and user experience
  - New version button positioned at top right of Version title
  - Consistent dividers under all tab subtitles
  - Updated header layout with conditional button placement
  - Professional version history with expandable content
- **Markdown Editor Implementation**: Advanced README editing functionality in PluginEdit component
  - Implemented tabbed Markdown editor with Edit and Preview modes
  - Fixed content area height at 526px with scrollable overflow
  - Integrated marked.js library for proper Markdown rendering
  - Added comprehensive CSS styling for all Markdown elements in preview mode
  - Clean tab interface with active state indicators and blue underline
  - Auto-save functionality when switching between Edit and Preview tabs
  - Save and Cancel buttons below the editor for both tabs
  - Monospace font for edit mode, styled preview with proper typography
- **Updated Color Scheme**: Consistent branding across edit interface
  - Active sidebar items now use #2CC3FF (light blue) background
  - Plugin Status toggle uses #2CC3FF when active/Public
  - All Save buttons updated to #00A2EA (darker blue)
  - Hover effects use opacity changes to maintain color consistency
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

- **Primary Colors**: 
  - Blue accent: #0089D4 (general links and accents)
  - Light blue: #2CC3FF (active states, toggles)
  - Dark blue: #00A2EA (primary actions, Save buttons)
  - Teal accent: #4A9B9B (Developer Portal login button)
  - Background: #FEFAF0 (main), #8B8B92 (Developer Portal login)
- **Typography**: 
  - English text: Outfit font family (16px, 400 weight, 140% line-height for navigation)
  - Japanese text: "Noto Sans JP" font family
  - Headings: Outfit font with various sizes (56px for main title, 24px for subtitles)
  - Code/Markdown editor: SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New (monospace)
- **Form Elements**:
  - Input fields: Grey background (#F5F5F5) with focus state (#EBEBEB)
  - Input padding: 16px with 8px border radius
  - Placeholder text: #9CA3AF with 400 font weight
- **Layout**: CSS Grid with responsive breakpoints (1/2/3 columns)
- **Card Design**: Consistent heights using flexbox with 16:9 aspect ratio images, rounded corners (16px)
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