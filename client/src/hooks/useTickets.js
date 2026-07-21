/**
 * @file useTickets.js
 * @description Custom hook to easily consume the tickets state and real-time locking context.
 * @responsibility Wraps React's useContext hook for TicketContext to expose the tickets array and lock helpers to consumer views.
 */

import { useContext } from 'react';
import { TicketContext } from '../context/TicketContext';

/**
 * Returns tickets list and synchronization helper actions.
 * @returns {object} TicketContext values ({ tickets, activeLocks, loading, error, loadTickets }).
 */
const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export default useTickets;
