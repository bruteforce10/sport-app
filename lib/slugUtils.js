/**
 * Utility functions for handling slugs
 */

/**
 * Generate a slug from a string (title, name, etc.)
 * @param {string} text - The text to convert to slug
 * @returns {string} - The generated slug
 */
export function generateSlug(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Generate a unique slug by appending a number if the slug already exists
 * @param {string} text - The text to convert to slug
 * @param {Array} existingSlugs - Array of existing slugs to check against
 * @returns {string} - The unique slug
 */
export function generateUniqueSlug(text, existingSlugs = []) {
  let slug = generateSlug(text);
  let counter = 1;
  let uniqueSlug = slug;
  
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

/**
 * Validate if a slug is valid
 * @param {string} slug - The slug to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidSlug(slug) {
  if (!slug) return false;
  
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  // Should not contain consecutive hyphens
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Extract the original text from a slug (reverse of generateSlug)
 * Note: This is not perfect as some information is lost during slug generation
 * @param {string} slug - The slug to convert back
 * @returns {string} - The approximated original text
 */
export function slugToText(slug) {
  if (!slug) return '';
  
  return slug
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
}
