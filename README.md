# Re:Earth Marketplace

A comprehensive marketplace implementation for the Re:Earth geospatial platform, featuring both static HTML prototypes and a fully functional React application. This project showcases plugins, integrations, and nodes for the Re:Earth ecosystem, demonstrating a modern marketplace interface where users can discover and manage community-made extensions.

## 🚀 Features

### Core Marketplace Features
- **Plugin Discovery**: Browse and search through a comprehensive plugin catalog
- **User Authentication**: Secure login system with protected routes and session management
- **Plugin Management**: Upload, edit, and manage plugins with status controls (Draft/Public)
- **Dashboard Interface**: Professional user dashboard with workspace management and project organization
- **Developer Portal**: Dedicated developer workspace with embedded plugin editing, multi-workspace support, and comprehensive plugin management
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### Advanced Functionality
- **GitHub Integration**: Upload plugins directly from GitHub repositories
- **Plugin Status Toggle**: Switch between Draft and Public states for plugin visibility
- **Real-time Search**: Dynamic filtering and search functionality across the plugin catalog
- **Workspace Management**: Organize plugins across personal and team workspaces with individual workspace views
- **Developer Portal Access**: Universal access to developer tools through avatar dropdown navigation
- **Multi-Workspace Support**: Switch between personal and team workspaces with member count display
- **Plugin Visibility Controls**: Comprehensive filtering by visibility status (All, Public, Private, Draft)
- **Company Branding**: Individual workspace interfaces with company-specific avatars and branding
- **Plugin Installation Flow**: Modal-based plugin installation with user-friendly interfaces
- **Submission Success Feedback**: Comprehensive success confirmation for plugin submissions
- **Professional UI**: Consistent design system with Re:Earth branding and typography

## 🏗️ Architecture

### Static HTML Prototype
- Complete marketplace interface with navigation, search, and plugin details
- Advanced styling with responsive CSS Grid layouts
- JavaScript-powered interactions and animations

### React Application
- Single-page application built with React 18+
- React Router for seamless navigation
- Component-based architecture with reusable UI elements
- Professional dashboard with three-column layout
- Authentication system with protected routes

## 📁 Project Structure

```
Re:Earth Marketplace/
├── public/                          # Static assets and images
│   ├── Image/                       # Plugin images and screenshots
│   ├── _redirects                   # Netlify SPA routing configuration
│   └── index.html                   # HTML template
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx            # User dashboard with workspace management
│   │   ├── DashboardNav.jsx         # Specialized navigation for dashboard pages
│   │   ├── Login.jsx                # Authentication component
│   │   ├── Marketplace.jsx          # Main marketplace interface
│   │   ├── PluginCard.jsx           # Individual plugin card component
│   │   ├── PluginDetail.jsx         # Plugin detail view with documentation
│   │   ├── PluginEdit.jsx           # Plugin editing with status toggle
│   │   ├── PluginUpload.jsx         # Plugin upload with GitHub integration
│   │   ├── Workspace.jsx            # Individual workspace interface with company branding
│   │   ├── DeveloperPortal.jsx      # Developer Portal main interface with embedded plugin editing
│   │   ├── DeveloperPortalEntry.jsx # Workspace selection modal for Developer Portal entry
│   │   ├── DeveloperPluginEdit.jsx  # Developer-specific plugin editing interface
│   │   ├── DeveloperPluginUpload.jsx# Developer-specific plugin upload interface
│   │   ├── PluginInstallModal.jsx   # Plugin installation modal interface
│   │   ├── PluginSubmissionSuccess.jsx # Plugin submission success confirmation
│   │   └── ProtectedRoute.jsx       # Route protection wrapper
│   ├── data/
│   │   └── pluginData.js            # Plugin catalog data
│   ├── services/
│   │   ├── authService.js           # Authentication management
│   │   └── pluginService.js         # Plugin data services
│   ├── utils/
│   │   └── randomGenerator.js       # Utility functions
│   ├── Dashboard.css                # Dashboard-specific styling
│   ├── DeveloperPortal.css          # Developer Portal styling
│   ├── PluginEdit.css              # Plugin editing interface styling
│   ├── PluginUpload.css            # Plugin upload interface styling
│   └── App.js                       # Main application component
├── markdown-editor.html             # Standalone markdown editor interface
├── markdown-editor.css              # Markdown editor styling
├── markdown-editor.js               # Markdown editor functionality
├── .env                             # Environment configuration
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── CLAUDE.md                        # Development documentation
└── README.md                        # This file
```

## 🛠️ Development Commands

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm start

# Access the application at http://localhost:3000
```

### Production Build
```bash
# Create optimized production build
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

### Testing
```bash
# Run test suite
npm test
```

## 🌐 Deployment

### Netlify Deployment
The project is optimized for Netlify deployment with:
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Environment Variables**: Configured to prevent CI warnings from failing builds
- **SPA Routing**: `_redirects` file for proper client-side routing support

### Manual Deployment
1. Run `npm run build` to create the production build
2. Deploy the `build` folder to any static hosting service
3. Ensure proper routing configuration for single-page application

## 🎨 Design System

### Typography
- **English Text**: Outfit font family with various weights and sizes
- **Japanese Text**: Noto Sans JP for proper Japanese character support
- **Headings**: Outfit font with responsive sizing (56px main title, 24px subtitles)

### Color Palette
- **Primary Blue**: #0089D4 for accents and interactive elements
- **Background**: #FEFAF0 for main page background
- **Cards**: White backgrounds with subtle shadows
- **Text**: Various gray shades for hierarchy and readability

### Layout System
- **CSS Grid**: Responsive grid layouts with 1/2/3 column breakpoints
- **Flexbox**: Card components with consistent heights and aspect ratios
- **Mobile-First**: Progressive enhancement from mobile to desktop

## 🔧 Key Components

### Authentication System
- Secure login with user session management
- Protected routes for authenticated features
- Avatar dropdown with user information and navigation

### Dashboard Interface
- Full-width responsive layout with sidebar navigation
- Workspace management (Personal/Team groups)
- Project tabs with plugin organization
- Activity tracking and shortcuts
- Individual workspace views with company branding

### Developer Portal System
- **Workspace Selection**: Modal interface with 5 workspace options (personal and team types)
- **Plugin Management Dashboard**: Comprehensive plugin overview with visibility controls
- **Multi-Workspace Support**: Switch between 8 different company workspaces
- **Advanced Filtering**: Filter plugins by visibility status (All, Public, Private, Draft)
- **Search & Sort**: Real-time search with multiple sorting options (Recently Updated, Name, Downloads)
- **Plugin Statistics**: Display download counts, like counts, and update timestamps
- **Navigation Integration**: Direct access from avatar dropdown menus across all components
- **Embedded Plugin Editing**: In-place editing triggered by plugin card clicks with full management capabilities
- **Single-Column Edit Interface**: Streamlined editing experience within Developer Portal context
- **State-Driven Navigation**: Seamless transitions between list and edit views without route changes

### Plugin Management
- **Upload**: Support for local files and GitHub repositories
- **Edit**: Comprehensive editing interface with status controls
- **Status Toggle**: Draft/Public visibility states
- **Validation**: Form validation for both upload methods

### Navigation System
- **Main Navigation**: Full marketplace header with user authentication
- **Dashboard Navigation**: Specialized nav for dashboard pages with logo
- **Developer Portal Access**: Universal access through avatar dropdown menus
- **Consistent UX**: Unified experience across all application sections

## 🔗 Integration Features

### GitHub Repository Support
- Direct plugin upload from GitHub repositories
- URL validation with proper format checking
- Repository requirements documentation (public, main branch)
- Seamless integration with existing upload workflow

### Plugin Status Management
- Toggle between Draft and Public states
- Visual feedback with styled toggle switches
- State persistence across editing sessions
- Conditional visibility based on plugin status

## 📱 Browser Compatibility

Supports all modern browsers:
- Chrome (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Edge (latest versions)

## 🚀 Recent Updates (August 20, 2025)

### Developer Portal Enhanced Plugin Editing
- **Embedded Plugin Editing**: Implemented in-place plugin editing directly within the Developer Portal interface
- **Single-Click Edit Access**: Plugin cards in Developer Portal now open comprehensive editing interface with single click
- **Seamless Navigation**: Smooth transitions between plugin list and edit views without leaving Developer Portal context
- **Integrated Editing Capabilities**: Full plugin management including:
  - General plugin information editing
  - README markdown editor with Edit/Preview modes
  - Version management with tag selection
  - Plugin Status toggle (Draft/Public)
  - Danger Zone for plugin deletion
- **State Management**: Sophisticated view state handling for smooth user experience
- **Consistent UI**: Maintains existing Developer Portal design patterns and interaction flows

### Developer Portal Implementation (August 18, 2025)
- **Comprehensive Developer Workspace**: Full-featured Developer Portal with multi-workspace support and advanced plugin management
- **Workspace Selection Interface**: Modal workspace selector with 5 workspace options including personal and team types with member counts
- **Universal Portal Access**: Developer Portal links added to avatar dropdown menus across all components (DashboardNav, Marketplace, PluginDetail)
- **Advanced Plugin Management**: Real-time search, visibility filtering (All, Public, Private, Draft), and multiple sorting options
- **Multi-Workspace Support**: Switch between 8 different company workspaces with dynamic plugin lists
- **Enhanced User Experience**: Professional interface with Japanese typography support and seamless navigation integration

### Enhanced Navigation & UX
- **Avatar Dropdown Enhancement**: Consistent Developer Portal access across all application components
- **Protected Route Integration**: Secure authentication for Developer Portal with proper route protection
- **Workspace Context Passing**: Seamless transition from workspace selection to portal interface
- **Professional UI Components**: Modal interfaces with close functionality and proper state management

## Previous Updates (August 6, 2025)

### Multi-Workspace System
- **Enhanced Workspace Management**: Support for 8 different company workspaces with dynamic data loading
- **Company-Specific Branding**: Individual workspace interfaces with company avatars and Japanese typography
- **Real Plugin Integration**: Workspace displays actual plugins filtered by company affiliation
- **Dynamic Navigation**: Seamless navigation between dashboard, workspace, and plugin detail views

### Dashboard & Data Integration
- **Live Plugin Data**: Dashboard now integrates real plugin data with relative time calculations
- **Enhanced Workspace Navigation**: Dynamic routing to 8 different company workspaces
- **Improved User Experience**: Plugin cards open in new tabs for better workflow management
- **Consistent Mapping**: Company-to-workspace mapping across all application components

### Plugin Management Enhancements
- **Dynamic Data Loading**: Plugin editing loads actual plugin data based on URL parameters
- **Enhanced Breadcrumbs**: Clickable company names navigate to respective workspace pages
- **Japanese Typography Support**: Improved font handling for Japanese company names
- **Form Integration**: Plugin forms now initialize with real plugin data (title, description, tags, images)

### Standalone Tools
- **Markdown Editor**: Independent HTML/CSS/JS markdown editor with tab-based interface
- **Professional Styling**: Consistent design matching the main application aesthetic
- **Reusable Component**: Standalone editor for external markdown editing workflows

### Previous Updates
- **Plugin Status Toggle**: Added Draft/Public state management in plugin editing
- **GitHub Integration**: Implemented repository upload as alternative to local files
- **Dashboard Navigation**: Created centralized navigation component for dashboard pages
- **Enhanced UX**: Improved form validation and user feedback across all interfaces
- **Deployment Optimization**: Configured for reliable Netlify deployments with CI/CD support

## 🤝 Contributing

This project serves as a comprehensive reference implementation for the Re:Earth Marketplace. The codebase demonstrates modern React development practices, responsive design principles, and professional UI/UX patterns suitable for geospatial platform ecosystems.

## 📄 License

This project is part of the Re:Earth ecosystem. Please refer to the Re:Earth project licensing terms.

---

**Re:Earth Marketplace** - Empowering the geospatial community with extensible platform solutions.