/**
 * @file socketEvents.js
 * @description Mappings of real-time socket events/messages shared with backend.
 * @responsibility Aligns strings for socket channels (join room, lock updates, ticket update transmissions) to avoid spelling mistakes.
 */

export const SOCKET_EVENTS = {
  // Connection Events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Room Subscription Actions
  JOIN_DASHBOARD: 'join:dashboard',
  LEAVE_DASHBOARD: 'leave:dashboard',
  JOIN_TICKET: 'join:ticket',
  LEAVE_TICKET: 'leave:ticket',

  // Ticket Operations Broadcasts
  TICKET_CREATED: 'ticket:created',
  TICKET_UPDATED: 'ticket:updated',
  TICKET_DELETED: 'ticket:deleted',

  // Edit Lock Mappings
  TICKET_LOCK_ACQUIRED: 'ticket:lock:acquired',
  TICKET_LOCK_RELEASED: 'ticket:lock:released',
  TICKET_LOCK_EXPIRED: 'ticket:lock:expired'
};
