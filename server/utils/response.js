/**
 * @file response.js
 * @description Standard response utility class and helpers for API endpoints.
 * @responsibility Formats API responses consistently (success/error, data payload, status code, metadata).
 */

class Response {
  /**
   * Generates a standardized API response.
   * @param {boolean} success - Flag indicating operation outcome.
   * @param {number} statusCode - HTTP status code.
   * @param {string} message - Response description text.
   * @param {object|null} [data] - Return payload.
   * @param {object|null} [error] - Error details (if any).
   */
  constructor(success, statusCode, message, data = null, error = null) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  /**
   * Helper to return standard success payload.
   */
  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json(new Response(true, statusCode, message, data));
  }

  /**
   * Helper to return standard error payload.
   */
  static error(res, message = 'An error occurred', error = null, statusCode = 500) {
    return res.status(statusCode).json(new Response(false, statusCode, message, null, error));
  }
}

module.exports = Response;
