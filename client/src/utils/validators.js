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
 * @returns {object} Errors object mapping field keys to warning messages.
 */
export const validateTicketForm = (ticketData) => {
  const errors = {};
  
  if (!ticketData.title || ticketData.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (ticketData.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (!ticketData.description || ticketData.description.trim() === '') {
    errors.description = 'Description is required';
  }

  return errors;
};
