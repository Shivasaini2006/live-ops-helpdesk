/**
 * @file lockManager.js
 * @description In-memory ticket lock manager service to prevent race conditions during ticket edits.
 * @responsibility Tracks which tickets are locked by which agents, issues/releases locks, and handles automatic release triggers.
 */

const Ticket = require('../models/ticket.model');
const { TICKET_LOCK_DURATION_MS } = require('../constants/ticket.constants');

// In-memory registry of locks: ticketId -> { userId, socketId, expiresAt }
const activeLocks = new Map();

/**
 * Attempts to acquire a lock on a ticket for a specific agent.
 * @param {string} ticketId - ID of the ticket.
 * @param {string} userId - ID of the agent requesting the lock.
 * @param {string} socketId - Socket connection ID of the agent.
 * @returns {Promise<object>} Lock details if successful.
 * @throws {Error} If already locked by someone else.
 */
const acquireLock = async (ticketId, userId, socketId) => {
  const now = new Date();
  const existingLock = activeLocks.get(ticketId);

  // Check if lock exists in memory and is still active (not expired)
  if (existingLock && existingLock.userId !== userId && existingLock.expiresAt > now) {
    throw new Error('Ticket is already locked by another agent.');
  }

  const expiresAt = new Date(now.getTime() + TICKET_LOCK_DURATION_MS);
  const lockDetails = { userId, socketId, expiresAt };

  // Set in-memory lock
  activeLocks.set(ticketId, lockDetails);

  // Sync to database for fallback persistence
  await Ticket.findByIdAndUpdate(ticketId, {
    lockedBy: userId,
    lockedAt: now,
    lockExpiresAt: expiresAt
  });

  return lockDetails;
};

/**
 * Explicitly releases a lock on a ticket.
 * @param {string} ticketId - ID of the ticket.
 * @param {string} userId - ID of the agent requesting release.
 * @returns {Promise<boolean>} True if release was successful.
 */
const releaseLock = async (ticketId, userId) => {
  const existingLock = activeLocks.get(ticketId);

  // If no lock or owned by someone else, prevent release
  if (existingLock && existingLock.userId !== userId) {
    throw new Error('You do not own the lock on this ticket.');
  }

  // Clear in-memory
  activeLocks.delete(ticketId);

  // Clear database
  await Ticket.findByIdAndUpdate(ticketId, {
    lockedBy: null,
    lockedAt: null,
    lockExpiresAt: null
  });

  return true;
};

/**
 * Automatically releases all locks held by a specific socket ID.
 * Triggered when a socket connection disconnects.
 * @param {string} socketId - Disconnected socket instance ID.
 * @returns {Promise<Array<string>>} List of released ticket IDs.
 */
const releaseLocksBySocket = async (socketId) => {
  const releasedTickets = [];
  const now = new Date();

  for (const [ticketId, lockDetails] of activeLocks.entries()) {
    if (lockDetails.socketId === socketId) {
      activeLocks.delete(ticketId);
      releasedTickets.push(ticketId);

      // Sync release to DB
      await Ticket.findByIdAndUpdate(ticketId, {
        lockedBy: null,
        lockedAt: null,
        lockExpiresAt: null
      });
    }
  }

  return releasedTickets;
};

/**
 * Checks if a ticket is currently locked.
 * @param {string} ticketId - ID of the ticket to check.
 * @returns {Promise<boolean>} True if locked.
 */
const isLocked = async (ticketId) => {
  const lock = activeLocks.get(ticketId);
  if (!lock) return false;

  const now = new Date();
  if (lock.expiresAt < now) {
    activeLocks.delete(ticketId);
    return false;
  }

  return true;
};

module.exports = {
  acquireLock,
  releaseLock,
  releaseLocksBySocket,
  isLocked
};
