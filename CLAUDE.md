# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML prototype for the Re:Earth Marketplace landing page - a modern, responsive website showcasing plugins, integrations, and nodes for the Re:Earth geospatial platform. The prototype demonstrates the marketplace interface where users can discover community-made extensions.

## File Structure

- `index.html` - Main marketplace landing page with navigation, search, featured items, and product categories
- `search-results.html` - Search results page template
- `plugin-detail.html` - Individual plugin detail page template
- `style.css` - Main CSS file with responsive design and modern styling
- `script.js` - JavaScript functionality for interactions, search, filtering, and animations
- `search-results.js` - Search results page functionality
- `plugin-detail.js` - Plugin detail page functionality
- Additional CSS files for specific pages (search-results.css, plugin-detail.css)

## Architecture

### Core Components
- **Navigation System**: Fixed header with dropdown menus, language toggle (EN/Japanese), and brand integration
- **Search & Filter**: Real-time search with platform filtering (CMS, Visualizer, Flow categories)
- **Product Categories**: Three main sections - Plugins, Integrations, and Nodes
- **Card-based Layout**: Responsive grid system for displaying marketplace items
- **Interactive Elements**: Hover effects, smooth scrolling, animated dropdowns, and like functionality

### Key Features
- Platform filtering system using `data-platforms` attributes
- Search highlighting with border and shadow effects
- Horizontal scrolling for featured cards with scroll indicators
- Empty state handling for filtered results
- Heart icon toggle for likes functionality
- Language switching framework (currently displays toggle only)

## Development Commands

Since this is a static HTML prototype, development involves:
- Open `index.html` in a web browser to view the main page
- Use a local development server for testing (e.g., `python -m http.server` or Live Server extension)
- No build process or package management required

## Design System

- **Primary Colors**: Blue accent (#007bff), background (#FEFAF0)
- **Typography**: Noto Sans JP for Japanese text, system fonts for performance
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **External Assets**: Logo and images hosted on R2 CDN (pub-07161d4651ef432c8a297e634cc3ee97.r2.dev)

## Browser Compatibility

Supports modern browsers (Chrome, Firefox, Safari, Edge latest versions) with CSS Grid, Flexbox, and ES6+ JavaScript features.