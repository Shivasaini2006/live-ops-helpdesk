/**
 * @file dateFormatter.js
 * @description Date formatting utilities.
 * @responsibility Provides functions to format raw ISO dates into human-readable strings.
 */

/**
 * Formats a Date object or ISO date string into a standard format.
 * @param {Date|string} date - Date to format.
 * @returns {string} Formatted output string (e.g. "Jul 15, 2026, 2:40 PM").
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Returns a relative time string (e.g., "3 minutes ago").
 * @param {Date|string} date - Date to format.
 * @returns {string} Relative time string.
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};
