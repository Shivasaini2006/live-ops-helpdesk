/**
 * @file statusHelpers.js
 * @description Helper functions for resolving ticket states.
 * @responsibility Provides convenience helpers to map statuses and priorities to color variables or labels.
 */

/**
 * Resolves priority color variables mapping.
 * @param {string} priority - Priority value ('low', 'medium', 'high', 'critical').
 * @returns {string} CSS custom property color value.
 */
export const getPriorityColor = (priority) => {
  const p = priority ? priority.toLowerCase() : 'low';
  switch (p) {
    case 'critical':
      return 'var(--priority-critical)';
    case 'high':
      return 'var(--priority-high)';
    case 'medium':
      return 'var(--priority-medium)';
    case 'low':
    default:
      return 'var(--priority-low)';
  }
};

/**
 * Resolves status display values.
 * @param {string} status - Ticket status value ('open', 'in-progress', 'resolved', 'closed').
 * @returns {string} Human-readable representation label.
 */
export const getStatusLabel = (status) => {
  const s = status ? status.toLowerCase() : 'open';
  switch (s) {
    case 'in-progress':
      return 'In Progress';
    case 'open':
    case 'resolved':
    case 'closed':
    default:
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
};
