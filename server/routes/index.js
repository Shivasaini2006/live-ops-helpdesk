/**
 * @file index.js
 * @description API router entry point routing traffic to domain routes.
 * @responsibility Consolidates auth and ticket endpoints under standard endpoint structures.
 */

const express = require('express');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.use('/auth', authRoutes);

// TODO: Mount ticket routes once implemented
// const ticketRoutes = require('./ticket.routes');
// router.use('/tickets', ticketRoutes);

module.exports = router;
