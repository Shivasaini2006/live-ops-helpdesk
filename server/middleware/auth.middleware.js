/**
 * @file auth.middleware.js
 * @description Authentication and authorization gateway middleware.
 * @responsibility Extracts JWT token from incoming Request headers, verifies its signature, and appends the decoded user context to req.user. Blocks unauthorized requests.
 */

const { verifyToken } = require('../helpers/token.helper');
const User = require('../models/user.model');
const Response = require('../utils/response');

/**
 * Middleware that guards routes by validating JWT from request headers (Authorization: Bearer <token>).
 * @param {object} req - Express Request object.
 * @param {object} res - Express Response object.
 * @param {function} next - Express next middleware function.
 */
const authenticate = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return Response.error(res, 'Authentication token required.', null, 401);
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Fetch user and attach to request context, excluding password
    const user = await User.findById(decoded.id);

    if (!user) {
      return Response.error(res, 'User no longer exists.', null, 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return Response.error(res, 'Invalid or expired authentication token.', error.message, 401);
  }
};

/**
 * Middleware factory that restricts route access to specific roles.
 * @param {Array<string>} roles - List of allowed roles (e.g., ['admin']).
 * @returns {function} Express middleware function.
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return Response.error(res, 'Authentication context missing.', null, 401);
    }

    if (!roles.includes(req.user.role)) {
      return Response.error(
        res,
        `Role '${req.user.role}' is not authorized to access this resource.`,
        null,
        403
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
