# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Re:Earth Marketplace implementation with static HTML prototypes and React application for plugin discovery and developer management.

## File Structure

### Static HTML Files
Core files: `index.html`, `search-results.html`, `plugin-detail.html`, `plugin-edit.html`, `developer-console-login.html`, `markdown-editor.html`, `style.css`, `script.js`

### React Components
- **Core**: `App.js`, `Marketplace.jsx`, `PluginCard.jsx`, `PluginDetail.jsx`, `Dashboard.jsx`
- **Developer Console**: `DeveloperConsole.jsx`, `DeveloperConsoleEntry.jsx`, `DeveloperPluginEdit.jsx`
- **Navigation**: `DashboardNav.jsx`, `Login.jsx`, `ProtectedRoute.jsx`
- **Management**: `PluginUpload.jsx`, `PluginEdit.jsx`, `Workspace.jsx`
- **Data**: `src/data/pluginData.js`, `src/services/`, `src/utils/`

## Architecture

### Core Systems
- **Navigation**: Responsive header with Re:Earth branding, avatar dropdown, Developer Console access
- **Workspace Management**: Multi-company workspaces with Japanese typography support
- **Developer Console**: Embedded plugin editing, workspace selection, in-place management
- **Authentication**: Protected routes, user sessions, secure login system
- **Plugin Management**: Upload/edit workflows, GitHub integration, Draft/Public states
- **Image Editing**: Canvas-based editor with crop/rotate/scale, 16:10 aspect ratio constraints

### Key Features
- **Typography**: Outfit (English), Noto Sans JP (Japanese)
- **Layout**: CSS Grid responsive (1/2/3 columns), uniform card heights
- **React Architecture**: SPA routing, hooks-based state management
- **Plugin Workflow**: Form validation, notification system, markdown editing
- **Advanced Image Processing**: Dual-resolution output, real-time preview, hover interface

### Latest Updates (September 1, 2025)
- **Developer Console Header Redesign**: Read-only workspace display, enhanced Switch styling (#00A2EA brand color), improved navigation flow
- **Layout Optimization**: Reduced content padding (16px→8px), updated sidebar background (#FCFAF4), improved space utilization
- **Code Cleanup**: Removed unused dropdown state management, simplified component props, cleaner imports

### Previous Updates (August 22, 2025)
- **Image Editing System**: Canvas-based editor with crop/rotate/scale controls, 16:10 aspect ratio, dual-resolution output (640×400 preview, 1280×800 final)
- **Upload Interface Redesign**: Tab-style source selection, GitHub/local file toggle, professional styling (#EFF6FF background)
- **Notification System**: Bottom-right notifications, auto-dismiss (5s), dual context support, dynamic plugin name insertion
- **Routing Optimization**: Simplified `/developer-console` structure, removed redundant layers, enhanced navigation flow
- **UX Improvements**: Always-clickable submit buttons, removed default version label selection, standardized sidebar navigation

### Previous Updates (August 21, 2025)
- **Plugin Editor Scrollspy**: IntersectionObserver implementation with proper thresholds, bidirectional navigation reliability
- **Version Management**: Expandable inline editor, YML parsing, tag selection (Bug Fix/New Feature/Doc Update/UI Update)
- **Navigation Improvements**: Fixed breadcrumb routing, enhanced save/delete workflows
- **Layout Optimization**: Reduced spacing (header 32px→24px, container 24px→16px), improved visual hierarchy

### Technical Implementation

#### Key Systems
- **Notifications**: React hooks, setTimeout auto-dismissal, context-aware navigation
- **Tabs**: Dynamic styling, smooth transitions, keyboard accessibility
- **Routing**: Simplified structure, context preservation, error handling
- **Image Editing**: Canvas API, dual-resolution processing, state management hooks (`showImageEditor`, `editingImage`, `imageEditorData`)

### Previous Updates (August 20, 2025)
- **Developer Console UI Enhancements**: Avatar dropdown system, custom workspace selector, improved sidebar navigation
- **Interface Improvements**: Enhanced search bar (500px-900px width), repositioned sort dropdown, standardized table layouts
- **Login Page**: Standalone `developer-console-login.html` with tabbed interface, responsive design, form validation

### Previous Updates (August 18, 2025)
- **Developer Console Implementation**: In-place plugin editing, workspace selection modal, multi-workspace support
- **Plugin Management Dashboard**: Visibility filtering, real-time search, sorting options, embedded editing
- **Navigation Integration**: Universal Developer Console access via avatar dropdowns across all components

### Previous Updates (August 6, 2025)
- **Multi-Workspace System**: 8-company workspace support, dynamic data loading, Japanese typography
- **Plugin Management**: Version control with tag system, Danger Zone deletion, markdown editing (Edit/Preview modes)
- **Interface Enhancements**: Footer background optimization, color scheme updates (#2CC3FF active states, #00A2EA buttons)
- **Upload Improvements**: GitHub repository integration, DashboardNav component, flexible submission methods

## Development Commands

- **HTML Prototype**: Open `index.html` in browser or use local server (`python -m http.server`)
- **React App**: `npm start` (dev), `npm run build` (production), `npm test`

## Deployment

- **Netlify**: Build command `npm run build`, publish directory `build`, CI=false for warnings
- **Local Testing**: `npm run build && serve -s build`

## Design System

- **Colors**: #0089D4 (links), #2CC3FF (active), #00A2EA (buttons), #4A9B9B (teal), #FEFAF0 (background)
- **Typography**: Outfit (English), Noto Sans JP (Japanese), SF Mono (code)
- **Layout**: CSS Grid responsive (1/2/3 columns), 16:9 aspect ratio images
- **Forms**: #F5F5F5 inputs, 16px padding, 8px border radius

## Plugin Data

Structure: ID, title, company, version, descriptions, thumbnails, tags, metrics, gallery images

## Browser Support

Modern browsers with CSS Grid, Flexbox, ES6+, React 18+