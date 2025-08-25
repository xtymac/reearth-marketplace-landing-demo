// Utility for generating unique slugs from plugin titles
export class SlugGenerator {
  /**
   * Generate a URL-friendly slug from a title
   * @param {string} title - The plugin title
   * @returns {string} - URL-friendly slug
   */
  static generateSlug(title) {
    if (!title || typeof title !== 'string') {
      return 'untitled-plugin';
    }

    return title
      .toLowerCase()
      .trim()
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      // Remove special characters except hyphens
      .replace(/[^a-z0-9-]/g, '')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Ensure not empty
      || 'untitled-plugin';
  }

  /**
   * Generate a unique slug by checking against existing plugins
   * @param {string} title - The plugin title
   * @param {Array} existingPlugins - Array of existing plugins with slug property
   * @returns {string} - Unique slug
   */
  static generateUniqueSlug(title, existingPlugins = []) {
    const baseSlug = this.generateSlug(title);
    const existingSlugs = existingPlugins.map(plugin => plugin.marketplaceSlug || plugin.slug).filter(Boolean);
    
    // If base slug is not taken, return it
    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug;
    }

    // If taken, append numbers until we find a unique one
    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;
    
    while (existingSlugs.includes(uniqueSlug)) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    return uniqueSlug;
  }

  /**
   * Generate a slug with timestamp for guaranteed uniqueness
   * @param {string} title - The plugin title
   * @returns {string} - Unique slug with timestamp
   */
  static generateSlugWithTimestamp(title) {
    const baseSlug = this.generateSlug(title);
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    return `${baseSlug}-${timestamp}`;
  }
}

// Convenience exports
export const generateSlug = (title) => SlugGenerator.generateSlug(title);
export const generateUniqueSlug = (title, existingPlugins) => SlugGenerator.generateUniqueSlug(title, existingPlugins);
export const generateSlugWithTimestamp = (title) => SlugGenerator.generateSlugWithTimestamp(title);