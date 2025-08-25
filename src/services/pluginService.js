import { pluginData } from '../data/pluginData';
import { SlugGenerator } from '../utils/slugGenerator';

// Plugin service to abstract data access
// This makes it easy to swap from local JSON to API later
export class PluginService {
  // Get all plugins
  static async getAllPlugins() {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(pluginData);
      }, 100);
    });
  }

  // Get plugin by ID
  static async getPluginById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plugin = pluginData.find(p => p.id === parseInt(id));
        resolve(plugin);
      }, 100);
    });
  }

  // Search plugins (for future implementation)
  static async searchPlugins(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = pluginData.filter(plugin => 
          plugin.title.toLowerCase().includes(query.toLowerCase()) ||
          plugin.description.toLowerCase().includes(query.toLowerCase()) ||
          plugin.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(filtered);
      }, 100);
    });
  }

  // Sort plugins (for future implementation)
  static async sortPlugins(sortBy) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let sorted = [...pluginData];
        switch (sortBy) {
          case 'likes':
            sorted.sort((a, b) => b.likes - a.likes);
            break;
          case 'downloads':
            sorted.sort((a, b) => b.downloads - a.downloads);
            break;
          case 'date uploaded':
          default:
            // Keep default order for now
            break;
        }
        resolve(sorted);
      }, 100);
    });
  }

  // Plugin installation tracking
  static getInstallationData() {
    const stored = localStorage.getItem('plugin-installations');
    return stored ? JSON.parse(stored) : {};
  }

  static saveInstallationData(data) {
    localStorage.setItem('plugin-installations', JSON.stringify(data));
  }

  // Install plugin to a workspace/project
  static async installPlugin(pluginId, workspaceId, projectId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const installations = this.getInstallationData();
          
          // Initialize workspace if it doesn't exist
          if (!installations[workspaceId]) {
            installations[workspaceId] = {};
          }
          
          // Initialize project if it doesn't exist
          if (!installations[workspaceId][projectId]) {
            installations[workspaceId][projectId] = [];
          }
          
          // Check if plugin is already installed
          if (installations[workspaceId][projectId].includes(pluginId)) {
            reject(new Error('Plugin already installed in this project'));
            return;
          }
          
          // Add plugin to project
          installations[workspaceId][projectId].push(pluginId);
          
          this.saveInstallationData(installations);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Check if plugin is installed in a specific project
  static isPluginInstalled(pluginId, workspaceId, projectId) {
    const installations = this.getInstallationData();
    return installations[workspaceId]?.[projectId]?.includes(pluginId) || false;
  }

  // Get all installations for a plugin
  static getPluginInstallations(pluginId) {
    const installations = this.getInstallationData();
    const pluginInstallations = [];
    
    Object.keys(installations).forEach(workspaceId => {
      Object.keys(installations[workspaceId]).forEach(projectId => {
        if (installations[workspaceId][projectId].includes(pluginId)) {
          pluginInstallations.push({ workspaceId, projectId });
        }
      });
    });
    
    return pluginInstallations;
  }

  // Remove plugin from project
  static async uninstallPlugin(pluginId, workspaceId, projectId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const installations = this.getInstallationData();
          
          if (installations[workspaceId]?.[projectId]) {
            const index = installations[workspaceId][projectId].indexOf(pluginId);
            if (index > -1) {
              installations[workspaceId][projectId].splice(index, 1);
              this.saveInstallationData(installations);
            }
          }
          
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Plugin submission and database operations
  static getSubmittedPlugins() {
    const stored = localStorage.getItem('submitted-plugins');
    return stored ? JSON.parse(stored) : [];
  }

  static saveSubmittedPlugins(plugins) {
    localStorage.setItem('submitted-plugins', JSON.stringify(plugins));
  }

  // Submit new plugin to database
  static async submitPlugin(pluginData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('PluginService.submitPlugin called with data keys:', Object.keys(pluginData));
          console.log('PluginService: Images count:', pluginData.images?.length || 0);
          
          // Log data sizes for debugging
          if (pluginData.images && pluginData.images.length > 0) {
            const imageSizes = pluginData.images.map(img => img.length);
            console.log('PluginService: Image data sizes:', imageSizes);
            const totalImageSize = imageSizes.reduce((a, b) => a + b, 0);
            console.log('PluginService: Total image data size:', totalImageSize, 'characters');
            
            // Check if images are too large for localStorage
            if (totalImageSize > 2 * 1024 * 1024) { // 2MB limit for localStorage
              console.warn('PluginService: Large image data detected, may cause storage issues');
            }
          }
          
          // Validate required fields - only title is required now
          const requiredFields = ['title', 'workspaceId', 'ownerUserId'];
          for (const field of requiredFields) {
            if (!pluginData[field]) {
              console.error(`PluginService: Missing required field: ${field}`);
              reject(new Error(`Missing required field: ${field}`));
              return;
            }
          }
          
          console.log('PluginService: All required fields present');

          // Get existing plugins for unique slug generation
          const existingPlugins = this.getSubmittedPlugins();
          const allPlugins = [...existingPlugins]; // pluginData is a single object, not an array

          // Generate unique slug
          const marketplaceSlug = SlugGenerator.generateUniqueSlug(pluginData.title, allPlugins);

          // Generate unique plugin ID
          const pluginId = `plugin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          // Create the plugin record
          const newPlugin = {
            id: pluginId,
            title: pluginData.title,
            workspaceId: pluginData.workspaceId,
            status: 'Draft', // Always starts as Draft
            thumbnailUrl: pluginData.thumbnailUrl || (pluginData.images && pluginData.images[0]) || null,
            readme: pluginData.readme,
            description: pluginData.description || pluginData.readme.substring(0, 200) + '...',
            marketplaceSlug,
            ownerUserId: pluginData.ownerUserId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Additional fields that may be provided
            images: pluginData.images || [],
            version: pluginData.version || '1.0.0',
            tags: pluginData.tags || [],
            functionTags: pluginData.functionTags || [],
            versionLabels: pluginData.versionLabels || [],
            githubUrl: pluginData.githubUrl || null,
            fileInfo: pluginData.fileInfo || null,
            likes: 0,
            downloads: 0,
            // Workspace information for display
            company: this.getWorkspaceCompanyName(pluginData.workspaceId)
          };

          // Add to submitted plugins list
          const submittedPlugins = this.getSubmittedPlugins();
          console.log('PluginService: Current submitted plugins count:', submittedPlugins.length);
          submittedPlugins.push(newPlugin);
          
          // Try to save with error handling for quota exceeded
          try {
            this.saveSubmittedPlugins(submittedPlugins);
            console.log('PluginService: Plugin saved successfully, new count:', submittedPlugins.length);
          } catch (saveError) {
            console.error('PluginService: Error saving to localStorage:', saveError);
            if (saveError.name === 'QuotaExceededError') {
              reject(new Error('Storage quota exceeded. Please use smaller images or clear browser data.'));
              return;
            }
            throw saveError;
          }

          const result = {
            success: true,
            plugin: newPlugin,
            pluginId,
            marketplaceSlug
          };
          console.log('PluginService: Resolving with result:', result);
          resolve(result);
        } catch (error) {
          console.error('PluginService: Error in submitPlugin:', error);
          reject(error);
        }
      }, 500); // Simulate database insert delay
    });
  }

  // Get workspace company name from workspace ID
  static getWorkspaceCompanyName(workspaceId) {
    const workspaceMapping = {
      'workspace-1': 'Eukarya',
      'workspace-2': 'Fukuyama Consultants',
      'workspace-3': 'MIERUNE',
      'workspace-4': 'AERO ASAHI',
      'workspace-5': 'C DESIGN',
      'workspace-6': 'Geolonia',
      'workspace-7': '気象データ株式会社',
      'workspace-8': 'USIC'
    };
    return workspaceMapping[workspaceId] || 'Unknown Company';
  }

  // Get plugin by slug (for marketplace viewing)
  static async getPluginBySlug(slug) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check submitted plugins first
        const submittedPlugins = this.getSubmittedPlugins();
        const submittedPlugin = submittedPlugins.find(p => p.marketplaceSlug === slug);
        
        if (submittedPlugin) {
          resolve(submittedPlugin);
          return;
        }

        // Then check original plugin data (would need to add slugs to original data)
        // For now, return null if not found in submitted plugins
        resolve(null);
      }, 100);
    });
  }

  // Update plugin status (Draft -> Public, etc.)
  static async updatePluginStatus(pluginId, newStatus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const submittedPlugins = this.getSubmittedPlugins();
          const pluginIndex = submittedPlugins.findIndex(p => p.id === pluginId);
          
          if (pluginIndex === -1) {
            reject(new Error('Plugin not found'));
            return;
          }

          submittedPlugins[pluginIndex].status = newStatus;
          submittedPlugins[pluginIndex].updatedAt = new Date().toISOString();
          
          this.saveSubmittedPlugins(submittedPlugins);
          resolve(submittedPlugins[pluginIndex]);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Get all plugins for a workspace (for developer portal)
  static async getPluginsByWorkspace(workspaceId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const submittedPlugins = this.getSubmittedPlugins();
        const workspacePlugins = submittedPlugins.filter(p => p.workspaceId === workspaceId);
        resolve(workspacePlugins);
      }, 100);
    });
  }
}

// Convenience exports for common functions
export const getAllPlugins = () => PluginService.getAllPlugins();
export const getPluginById = (id) => PluginService.getPluginById(id);
export const searchPlugins = (query) => PluginService.searchPlugins(query);
export const sortPlugins = (sortBy) => PluginService.sortPlugins(sortBy);

// For easier transition to API, these functions can be easily replaced:
// 
// Example API implementation:
// static async getAllPlugins() {
//   const response = await fetch('/api/plugins');
//   return response.json();
// }
//
// static async getPluginById(id) {
//   const response = await fetch(`/api/plugins/${id}`);
//   return response.json();
// }