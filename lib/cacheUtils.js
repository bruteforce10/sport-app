import { CACHE_DURATION } from './types';

/**
 * Check if cache is still valid
 * @param {number} timestamp - Cache timestamp
 * @returns {boolean} - True if cache is valid
 */
export const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  const now = Date.now();
  return (now - timestamp) < CACHE_DURATION;
};

/**
 * Get cache age in minutes
 * @param {number} timestamp - Cache timestamp
 * @returns {number} - Cache age in minutes
 */
export const getCacheAge = (timestamp) => {
  if (!timestamp) return Infinity;
  const now = Date.now();
  return Math.floor((now - timestamp) / (1000 * 60));
};

/**
 * Check if cache should be refreshed
 * @param {number} timestamp - Cache timestamp
 * @param {number} threshold - Threshold in minutes (default: 4 minutes)
 * @returns {boolean} - True if cache should be refreshed
 */
export const shouldRefreshCache = (timestamp, threshold = 4) => {
  if (!timestamp) return true;
  const age = getCacheAge(timestamp);
  return age >= threshold;
};

/**
 * Format cache age for display
 * @param {number} timestamp - Cache timestamp
 * @returns {string} - Formatted cache age
 */
export const formatCacheAge = (timestamp) => {
  if (!timestamp) return 'No cache';
  
  const age = getCacheAge(timestamp);
  if (age < 1) return 'Just now';
  if (age === 1) return '1 minute ago';
  if (age < 60) return `${age} minutes ago`;
  
  const hours = Math.floor(age / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};
