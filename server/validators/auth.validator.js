/**
 * @file auth.validator.js
 * @description Request validation definitions for authentication endpoints using express-validator.
 * @responsibility Specifies rules and sanitization parameters for login and register requests.
 */

const { body } = require('express-validator');

/**
 * Validation rules for user login requests.
 */
const loginRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for user registration requests.
 */
const registerRules = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['agent', 'admin'])
    .withMessage('Role must be either agent or admin')
];

module.exports = {
  loginRules,
  registerRules
};
