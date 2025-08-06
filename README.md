# Re:Earth Marketplace

A comprehensive marketplace implementation for the Re:Earth geospatial platform, featuring both static HTML prototypes and a fully functional React application. This project showcases plugins, integrations, and nodes for the Re:Earth ecosystem, demonstrating a modern marketplace interface where users can discover and manage community-made extensions.

## 🚀 Features

### Core Marketplace Features
- **Plugin Discovery**: Browse and search through a comprehensive plugin catalog
- **User Authentication**: Secure login system with protected routes and session management
- **Plugin Management**: Upload, edit, and manage plugins with status controls (Draft/Public)
- **Dashboard Interface**: Professional user dashboard with workspace management and project organization
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### Advanced Functionality
- **GitHub Integration**: Upload plugins directly from GitHub repositories
- **Plugin Status Toggle**: Switch between Draft and Public states for plugin visibility
- **Real-time Search**: Dynamic filtering and search functionality across the plugin catalog
- **Workspace Management**: Organize plugins across personal and team workspaces with individual workspace views
- **Company Branding**: Individual workspace interfaces with company-specific avatars and branding
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
│   │   └── ProtectedRoute.jsx       # Route protection wrapper
│   ├── data/
│   │   └── pluginData.js            # Plugin catalog data
│   ├── services/
│   │   ├── authService.js           # Authentication management
│   │   └── pluginService.js         # Plugin data services
│   ├── utils/
│   │   └── randomGenerator.js       # Utility functions
│   └── App.js                       # Main application component
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

### Plugin Management
- **Upload**: Support for local files and GitHub repositories
- **Edit**: Comprehensive editing interface with status controls
- **Status Toggle**: Draft/Public visibility states
- **Validation**: Form validation for both upload methods

### Navigation System
- **Main Navigation**: Full marketplace header with user authentication
- **Dashboard Navigation**: Specialized nav for dashboard pages with logo
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

## 🚀 Recent Updates (August 2025)

- **Workspace Component**: Created individual workspace management interface with company-specific branding
  - Multi-tab interface (Overview, CMS Project, Visualizer Project, Plugins)
  - Company avatar integration with fallback designs
  - Advanced search and sort functionality
  - Direct plugin management and navigation
- **Enhanced Dashboard Layout**: Updated to full-width design with improved workspace organization
- **Expanded Routing**: Added `/workspace/:workspaceId` route with protected access
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