/**
 * @file socketHandler.js
 * @description Direct controller handling real-time Socket.io socket channels.
 * @responsibility Sets up event listeners for newly connected agents, handles ticket subscription rooms, maps events, and ensures locks are released on disconnect.
 */

const lockManager = require('../services/lockManager');

/**
 * Socket listener mapping handler.
 * @param {object} io - Global Socket.io server instance.
 * @param {object} socket - Connected client's socket instance.
 */
const socketHandler = (io, socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Join global dashboard updates channel
  socket.on('join:dashboard', () => {
    socket.join('dashboard');
    console.log(`Socket ${socket.id} joined dashboard room`);
  });

  // Leave global dashboard updates channel
  socket.on('leave:dashboard', () => {
    socket.leave('dashboard');
    console.log(`Socket ${socket.id} left dashboard room`);
  });

  // Join a specific ticket room for collaborative editing updates
  socket.on('join:ticket', (ticketId) => {
    socket.join(`ticket:${ticketId}`);
    console.log(`Socket ${socket.id} joined ticket room: ${ticketId}`);
  });

  // Leave a specific ticket room
  socket.on('leave:ticket', (ticketId) => {
    socket.leave(`ticket:${ticketId}`);
    console.log(`Socket ${socket.id} left ticket room: ${ticketId}`);
  });

  // Handle client disconnection
  socket.on('disconnect', async () => {
    console.log(`Socket client disconnected: ${socket.id}`);
    
    try {
      // Automatically release any locks held by the disconnected client's socket ID
      const releasedTicketIds = await lockManager.releaseLocksBySocket(socket.id);
      
      if (releasedTicketIds.length > 0) {
        console.log(`Auto-released ${releasedTicketIds.length} locks on disconnect for socket: ${socket.id}`);
        
        // Notify other clients about lock releases
        releasedTicketIds.forEach((ticketId) => {
          // Broadcast to dashboard room
          io.to('dashboard').emit('ticket:lock:released', { ticketId });
          // Broadcast to specific ticket room
          io.to(`ticket:${ticketId}`).emit('ticket:lock:released', { ticketId });
        });
      }
    } catch (error) {
      console.error(`Error auto-releasing locks on disconnect: ${error.message}`);
    }
  });
};

module.exports = socketHandler;
