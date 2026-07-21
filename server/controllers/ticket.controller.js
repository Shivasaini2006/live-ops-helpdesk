/**
 * @file ticket.controller.js
 * @description Controllers managing ticket operations (CRUD) and lock lifecycle triggers.
 * @responsibility Coordinates reading, creating, modifying, deleting tickets, and acquiring/releasing locks.
 */

const Ticket = require('../models/ticket.model');
const lockManager = require('../services/lockManager');
const { getSocketIO } = require('../config/socket');
const Response = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Retrieves all tickets with pagination and filtering.
 * @route GET /api/tickets
 */
const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find()
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('lockedBy', 'name email')
    .sort({ createdAt: -1 });

  return Response.success(res, 'Tickets retrieved successfully', { tickets });
});

/**
 * Retrieves a single ticket by its ID.
 * @route GET /api/tickets/:id
 */
const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('lockedBy', 'name email');

  if (!ticket) {
    return Response.error(res, 'Ticket not found', null, 404);
  }

  return Response.success(res, 'Ticket retrieved successfully', { ticket });
});

/**
 * Creates a new ticket.
 * @route POST /api/tickets
 */
const createTicket = asyncHandler(async (req, res) => {
  const { title, description, status, priority, assignedTo } = req.body;

  const ticket = new Ticket({
    title,
    description,
    status,
    priority,
    assignedTo,
    createdBy: req.user._id
  });

  await ticket.save();

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  // Broadcast ticket creation to all dashboard subscribers
  try {
    const io = getSocketIO();
    io.to('dashboard').emit('ticket:created', { ticket: populatedTicket });
  } catch (err) {
    console.warn(`Socket broadcast failed on ticket creation: ${err.message}`);
  }

  return Response.success(res, 'Ticket created successfully', { ticket: populatedTicket }, 201);
});

/**
 * Updates a ticket. Checks lock state to avoid race conditions.
 * @route PUT /api/tickets/:id
 */
const updateTicket = asyncHandler(async (req, res) => {
  const { title, description, status, priority, assignedTo } = req.body;

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return Response.error(res, 'Ticket not found', null, 404);
  }

  // Verify the requester owns the edit lock
  const hasLock = await lockManager.isLocked(ticket._id.toString());
  if (hasLock) {
    const activeLock = ticket.lockedBy;
    if (activeLock && activeLock.toString() !== req.user._id.toString()) {
      return Response.error(
        res,
        'This ticket is currently locked by another agent for editing.',
        null,
        423 // Locked status code
      );
    }
  }

  // Apply updates
  ticket.title = title || ticket.title;
  ticket.description = description || ticket.description;
  ticket.status = status || ticket.status;
  ticket.priority = priority || ticket.priority;
  ticket.assignedTo = assignedTo !== undefined ? assignedTo : ticket.assignedTo;

  // Release the lock upon successful saving
  ticket.lockedBy = null;
  ticket.lockedAt = null;
  ticket.lockExpiresAt = null;

  await ticket.save();

  // Clear in-memory lock
  try {
    await lockManager.releaseLock(ticket._id.toString(), req.user._id.toString());
  } catch (err) {
    // If lock didn't exist in memory (already expired), log and continue
    console.log(`Lock release ignored on save: ${err.message}`);
  }

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  // Broadcast update to dashboard and specific ticket rooms
  try {
    const io = getSocketIO();
    io.to('dashboard').emit('ticket:updated', { ticket: populatedTicket });
    io.to(`ticket:${ticket._id}`).emit('ticket:updated', { ticket: populatedTicket });
    
    // Also notify lock release
    io.to('dashboard').emit('ticket:lock:released', { ticketId: ticket._id });
    io.to(`ticket:${ticket._id}`).emit('ticket:lock:released', { ticketId: ticket._id });
  } catch (err) {
    console.warn(`Socket broadcast failed on ticket update: ${err.message}`);
  }

  return Response.success(res, 'Ticket updated successfully', { ticket: populatedTicket });
});

/**
 * Deletes a ticket.
 * @route DELETE /api/tickets/:id
 */
const deleteTicket = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    return Response.error(res, 'Ticket not found', null, 404);
  }

  await Ticket.deleteOne({ _id: ticketId });

  // Clear any active locks associated with deleted ticket
  try {
    await lockManager.releaseLock(ticketId, req.user._id.toString());
  } catch (err) {
    // Ignore
  }

  // Broadcast deletion to all rooms
  try {
    const io = getSocketIO();
    io.to('dashboard').emit('ticket:deleted', { ticketId });
    io.to(`ticket:${ticketId}`).emit('ticket:deleted', { ticketId });
  } catch (err) {
    console.warn(`Socket broadcast failed on ticket deletion: ${err.message}`);
  }

  return Response.success(res, 'Ticket deleted successfully', { id: ticketId });
});

/**
 * Acquires a collaborative edit lock on a ticket.
 * @route POST /api/tickets/:id/lock
 */
const acquireTicketLock = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const { socketId } = req.body;

  if (!socketId) {
    return Response.error(res, 'Socket ID is required to acquire editing lock.', null, 400);
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return Response.error(res, 'Ticket not found', null, 404);
  }

  try {
    // Delegate to lockManager service
    const lockDetails = await lockManager.acquireLock(ticketId, req.user._id.toString(), socketId);

    // Broadcast lock acquisition event to all clients
    try {
      const io = getSocketIO();
      const broadcastPayload = {
        ticketId,
        lockedBy: req.user._id,
        lockedByUsername: req.user.name,
        lockExpiresAt: lockDetails.expiresAt
      };
      io.to('dashboard').emit('ticket:lock:acquired', broadcastPayload);
      io.to(`ticket:${ticketId}`).emit('ticket:lock:acquired', broadcastPayload);
    } catch (err) {
      console.warn(`Socket broadcast failed on lock acquisition: ${err.message}`);
    }

    return Response.success(res, 'Ticket locked successfully', {
      lockedBy: req.user._id,
      lockExpiresAt: lockDetails.expiresAt
    });
  } catch (error) {
    return Response.error(res, error.message, null, 423);
  }
});

/**
 * Releases a collaborative edit lock on a ticket.
 * @route POST /api/tickets/:id/unlock
 */
const releaseTicketLock = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return Response.error(res, 'Ticket not found', null, 404);
  }

  try {
    // Delegate to lockManager service
    await lockManager.releaseLock(ticketId, req.user._id.toString());

    // Broadcast lock release event to all clients
    try {
      const io = getSocketIO();
      io.to('dashboard').emit('ticket:lock:released', { ticketId });
      io.to(`ticket:${ticketId}`).emit('ticket:lock:released', { ticketId });
    } catch (err) {
      console.warn(`Socket broadcast failed on lock release: ${err.message}`);
    }

    return Response.success(res, 'Ticket unlocked successfully');
  } catch (error) {
    return Response.error(res, error.message, null, 400);
  }
});

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  acquireTicketLock,
  releaseTicketLock
};
