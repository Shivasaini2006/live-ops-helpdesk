/**
 * @file ticket.constants.js
 * @description Holds system-wide static parameters and shared definitions for Tickets.
 * @responsibility Consolidates magic strings, enum arrays, lock timeouts, and priority standards to prevent hardcoding across files.
 */

const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

const USER_ROLES = {
  AGENT: 'agent',
  ADMIN: 'admin'
};

// Lock lease duration in milliseconds (e.g., 5 minutes = 300000ms)
const TICKET_LOCK_DURATION_MS = 300000;

module.exports = {
  TICKET_STATUS,
  TICKET_PRIORITY,
  USER_ROLES,
  TICKET_LOCK_DURATION_MS
};
