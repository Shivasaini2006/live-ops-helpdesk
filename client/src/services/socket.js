/**
 * @file socket.js
 * @description Instantiates and exports the client Socket.io instance.
 * @responsibility Connects the client to the backend Socket.io server and holds parameters for connections.
 */

import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || '/';
const socket = io(socketUrl, {
  autoConnect: false,
  transports: ['websocket']
});

export default socket;
