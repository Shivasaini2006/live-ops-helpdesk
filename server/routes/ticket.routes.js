/**
 * @file ticket.routes.js
 * @description Ticket REST API endpoint route mapping.
 * @responsibility Binds HTTP actions on tickets to their controllers, passing authorization, validations, and async wrap handlers.
 */

const express = require('express');
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  acquireTicketLock,
  releaseTicketLock
} = require('../controllers/ticket.controller');
const {
  createTicketRules,
  updateTicketRules,
  lockTicketRules
} = require('../validators/ticket.validator');
const validate = require('../middleware/validation');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authenticate to all ticket routes
router.use(authenticate);

// CRUD routes
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicketRules, validate, createTicket);
router.put('/:id', updateTicketRules, validate, updateTicket);
router.delete('/:id', deleteTicket);

// Lock management routes
router.post('/:id/lock', lockTicketRules, validate, acquireTicketLock);
router.post('/:id/unlock', lockTicketRules, validate, releaseTicketLock);

module.exports = router;
