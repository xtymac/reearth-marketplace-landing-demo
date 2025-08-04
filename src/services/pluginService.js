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
}

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