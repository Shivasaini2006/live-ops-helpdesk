/**
 * @file socket.js
 * @description Instantiates and exports the client Socket.io instance.
 * @responsibility Connects the client to the backend Socket.io server and holds parameters for connections.
 */

import { io } from 'socket.io-client';

// Establish connection setup with autoConnect disabled
// It will be manually triggered when user logs in
const socket = io('/', {
  autoConnect: false,
  transports: ['websocket']
});

export default socket;
