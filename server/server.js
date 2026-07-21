/**
 * @file server.js
 * @description Root setup file launching the Node HTTP Server and starting Socket.io.
 * @responsibility Loads env variables, kicks off database connections, wraps the Express application in an HTTP server, hooks Socket.io, and starts listening on the designated PORT.
 */

require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const socketHandler = require('./sockets/socketHandler');

// Run Database Connection
connectDB();

// Build HTTP Server
const server = http.createServer(app);

// Initialize socket.io on HTTP Server
const io = initSocket(server);

// Bind connection handler
io.on('connection', (socket) => {
  socketHandler(io, socket);
});

// Start listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
