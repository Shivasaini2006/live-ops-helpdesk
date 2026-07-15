/**
 * @file errorHandler.js
 * @description Centralized error-handling middleware.
 * @responsibility Captures all thrown errors during request processing, formats a standard API response, hides stack traces in production, and outputs logs.
 */

const Response = require('../utils/response');

/**
 * Express error handler middleware.
 * @param {Error} err - Captured error instance.
 * @param {object} req - Express Request object.
 * @param {object} res - Express Response object.
 * @param {function} next - Express next function.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // Handle specific database errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
  }

  // Log error stack for debugging in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack || err);
  } else {
    console.error(err.message || err);
  }

  return Response.error(
    res,
    message,
    process.env.NODE_ENV === 'development' ? err.stack : null,
    statusCode
  );
};

module.exports = errorHandler;
