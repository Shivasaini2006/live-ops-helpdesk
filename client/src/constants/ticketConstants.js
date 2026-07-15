/**
 * @file ticketConstants.js
 * @description Frontend status, category, and priority definitions for tickets UI.
 * @responsibility Stores UI labels, status options lists, priority colors metadata mapping, and default config configurations.
 */

export const TICKET_STATUSES = [
  { value: 'open', label: 'Open', color: 'blue' },
  { value: 'in-progress', label: 'In Progress', color: 'orange' },
  { value: 'resolved', label: 'Resolved', color: 'green' },
  { value: 'closed', label: 'Closed', color: 'gray' }
];

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' }
];

export const TICKET_CATEGORIES = [
  'Technical',
  'Billing',
  'Account Access',
  'Feature Request',
  'Other'
];
