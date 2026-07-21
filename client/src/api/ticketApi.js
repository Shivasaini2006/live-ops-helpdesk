/**
 * @file ticketApi.js
 * @description API service calls mapper for ticket endpoints.
 * @responsibility Wraps Axios requests to /tickets endpoints into clean, async helper functions.
 */

import axiosInstance from './axios';

/**
 * Fetches all tickets list.
 */
export const getTickets = async () => {
  const response = await axiosInstance.get('/tickets');
  return response.data;
};

/**
 * Fetches a single ticket details.
 */
export const getTicketById = async (id) => {
  const response = await axiosInstance.get(`/tickets/${id}`);
  return response.data;
};

/**
 * Submits a new ticket payload.
 */
export const createTicket = async (ticketData) => {
  const response = await axiosInstance.post('/tickets', ticketData);
  return response.data;
};

/**
 * Saves modifications to an existing ticket.
 */
export const updateTicket = async (id, ticketData) => {
  const response = await axiosInstance.put(`/tickets/${id}`, ticketData);
  return response.data;
};

/**
 * Triggers deletion for a single ticket.
 */
export const deleteTicket = async (id) => {
  const response = await axiosInstance.delete(`/tickets/${id}`);
  return response.data;
};

/**
 * Requests an editing lock on a ticket.
 * @param {string} id - Ticket ID
 * @param {string} socketId - Client socket ID
 */
export const lockTicket = async (id, socketId) => {
  const response = await axiosInstance.post(`/tickets/${id}/lock`, { socketId });
  return response.data;
};

/**
 * Releases an editing lock on a ticket.
 */
export const unlockTicket = async (id) => {
  const response = await axiosInstance.post(`/tickets/${id}/unlock`);
  return response.data;
};
