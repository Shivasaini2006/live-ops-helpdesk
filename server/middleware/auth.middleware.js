/**
 * @file auth.middleware.js
 * @description Authentication and authorization gateway middleware.
 * @responsibility Extracts JWT token from incoming Request headers, verifies its signature, and appends the decoded user context to req.user. Blocks unauthorized requests.
 */

// Placeholder for verification helper
// const { verifyToken } = require('../helpers/token.helper');

/**
 * Middleware that guards routes by validating JWT from request headers (Authorization: Bearer <token>).
 * @param {object} req - Express Request object.
 * @param {object} res - Express Response object.
 * @param {function} next - Express next middleware function.
 */
const authenticate = async (req, res, next) => {
  // TODO: Retrieve token, verify it, attach req.user, call next() or respond with 401/403
  next();
};

/**
 * Middleware factory that restricts route access to specific roles.
 * @param {Array<string>} roles - List of allowed roles (e.g., ['admin']).
 * @returns {function} Express middleware function.
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    // TODO: Verify req.user.role exists in roles array, else respond with 403
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
