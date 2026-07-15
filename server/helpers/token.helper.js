/**
 * @file token.helper.js
 * @description Helper functions for JWT (JSON Web Token) operations.
 * @responsibility Decouples token creation and verification logic from routes, controllers, and middleware.
 */

const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT payload for the user session.
 * @param {object} user - User details containing ID, role, etc.
 * @returns {string} The signed JWT.
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }

  // Generate token containing userId and role
  return jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn: '24h' } // Token expires in 24 hours
  );
};

/**
 * Verifies a JWT token signature and decodes the user payload.
 * @param {string} token - The raw JWT token string.
 * @returns {object} The decoded token payload.
 * @throws {Error} If token is invalid or expired.
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }

  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
