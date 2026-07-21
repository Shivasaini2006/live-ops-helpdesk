/**
 * @file socket.js
 * @description Socket.io server configuration and initialization module.
 * @responsibility Sets up Socket.io options, configures CORS for the socket server, and integrates the socket instance with the Node.js HTTP server.
 */

const { Server } = require('socket.io');

let ioInstance = null;

/**
 * Initializes and configures Socket.io on top of the provided HTTP server.
 * Defines CORS policies, transport protocols, and socket connection options.
 * @param {object} httpServer - Node.js HTTP/HTTPS server instance.
 * @returns {object} The configured Socket.io server instance.
 */
const initSocket = (httpServer) => {
  if (ioInstance) {
    return ioInstance;
  }

  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    pingTimeout: 60000, // Timeout after 60 seconds of inactivity
    transports: ['websocket', 'polling']
  });

  return ioInstance;
};

/**
 * Retrieves the active Socket.io instance.
 * @returns {object} The active Socket.io instance.
 * @throws {Error} If socket server is not initialized yet.
 */
const getSocketIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io has not been initialized. Please call initSocket first.');
  }
  return ioInstance;
};

module.exports = {
  initSocket,
  getSocketIO
};
