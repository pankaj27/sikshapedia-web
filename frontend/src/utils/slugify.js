/**
 * Convert a string to a URL-friendly slug
 * @param {string} text - The text to convert to slug
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate a unique slug by adding a suffix if needed
 * @param {string} baseSlug - The base slug
 * @param {number} suffix - Optional suffix number
 * @returns {string} - Unique slug
 */
export const generateUniqueSlug = (baseSlug, suffix = null) => {
  if (suffix) {
    return `${baseSlug}-${suffix}`;
  }
  return baseSlug;
};
