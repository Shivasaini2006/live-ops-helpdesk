/**
 * @file ticket.validator.js
 * @description Request validation definitions for ticket operations using express-validator.
 * @responsibility Specifies constraints, required fields, and sanitization for ticket creation, updates, and lock requests.
 */

const { body, param } = require('express-validator');

/**
 * Validation rules for ticket creation.
 */
const createTicketRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid ticket status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid ticket priority level')
];

/**
 * Validation rules for ticket updates.
 */
const updateTicketRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ticket identifier format'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid ticket status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid ticket priority level')
];

/**
 * Validation rules for ticket lock requests.
 */
const lockTicketRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ticket identifier format')
];

module.exports = {
  createTicketRules,
  updateTicketRules,
  lockTicketRules
};
