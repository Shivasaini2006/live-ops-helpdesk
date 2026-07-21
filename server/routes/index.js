/**
 * @file index.js
 * @description API router entry point routing traffic to domain routes.
 * @responsibility Consolidates auth and ticket endpoints under standard endpoint structures.
 */

const express = require('express');
const authRoutes = require('./auth.routes');
const ticketRoutes = require('./ticket.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
