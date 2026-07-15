/**
 * @file validation.js
 * @description Runs express-validator assertion lists against incoming request objects.
 * @responsibility Evaluates validation results; if violations exist, it halts execution and replies with standard validation failure messages.
 */

const { validationResult } = require('express-validator');
const Response = require('../utils/response');

/**
 * Middleware function that runs validation rules and checks if any errors occurred.
 * @param {object} req - Express Request object.
 * @param {object} res - Express Response object.
 * @param {function} next - Express next function.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Response.error(
      res,
      'Validation failed',
      errors.array().map((err) => ({ field: err.path, message: err.msg })),
      400
    );
  }
  next();
};

module.exports = validate;
