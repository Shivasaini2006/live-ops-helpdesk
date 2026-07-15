/**
 * @file socketConstants.js
 * @description General configurations related to client websocket protocols.
 * @responsibility Holds reconnection timeouts, ping intervals, paths, and local storage keys for sockets tracking.
 */

export const SOCKET_RECONNECT_ATTEMPTS = 5;
export const SOCKET_RECONNECT_DELAY_MS = 3000;
export const SOCKET_PING_TIMEOUT_MS = 20000;
export const SOCKET_STORAGE_KEY = 'helpdesk_socket_status';
