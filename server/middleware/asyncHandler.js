/**
 * @file asyncHandler.js
 * @description Express controller wrapper utility to handle asynchronous route handlers.
 * @responsibility Wraps async Express middleware/controllers to automatically pass any rejected promises or errors to next(), eliminating boilerplate try-catch blocks.
 */

/**
 * Wraps an async route handler to catch errors.
 * @param {function} fn - The asynchronous handler function.
 * @returns {function} Express route handler with catch block mapped to next().
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
