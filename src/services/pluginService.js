import { pluginData } from '../data/pluginData';

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