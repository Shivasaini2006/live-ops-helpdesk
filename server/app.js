/**
 * @file app.js
 * @description Configures core application framework settings for Express.js.
 * @responsibility Sets up security middlewares (Helmet), API call logger (Morgan), request parsers, CORS settings, maps base API routes, and mounts the central error handler.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Body parser
app.use(express.json());

// Request logger for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes mapping
app.use('/api', routes);

// Base health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Central error handler mounting
app.use(errorHandler);

module.exports = app;
