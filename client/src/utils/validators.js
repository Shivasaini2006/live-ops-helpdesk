/**
 * @file validators.js
 * @description Frontend validation logic for client-side forms.
 * @responsibility Validates ticket forms or authentication fields before dispatching network requests to reduce unnecessary backend payloads.
 */

/**
 * Checks email validation rules.
 * @param {string} email - Email value to check.
 * @returns {boolean} True if email format matches validation regex.
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Checks ticket input fields.
 * @param {object} ticketData - Form attributes payload.
 * @returns {object} Errors object mapping field keys to warning messages (if any).
 */
export const validateTicketForm = (ticketData) => {
  const errors = {};
  // TODO: Run checks on ticketData.title and ticketData.description
  return errors;
};
