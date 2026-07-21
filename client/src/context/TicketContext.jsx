/**
 * @file TicketContext.jsx
 * @description Provides the React context state wrapper for the Tickets collection and active locks state.
 * @responsibility Coordinates local tickets state array, CRUD operations triggers, and applies real-time ticket modifications and lock acquisitions/releases notified by Sockets.
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getTickets as fetchTicketsApi } from '../api/ticketApi';
import useSocket from '../hooks/useSocket';

export const TicketContext = createContext(null);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [activeLocks, setActiveLocks] = useState({}); // ticketId -> { lockedBy, lockedByUsername, lockExpiresAt }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const socketContext = useSocket();
  const socket = socketContext?.socket;

  // Fetch all tickets from backend API
  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTicketsApi();
      if (response.success) {
        setTickets(response.data.tickets);
        
        // Sync active locks state from backend model attributes
        const locksMap = {};
        const now = new Date();
        response.data.tickets.forEach((ticket) => {
          if (ticket.lockedBy && ticket.lockExpiresAt && new Date(ticket.lockExpiresAt) > now) {
            locksMap[ticket._id] = {
              lockedBy: ticket.lockedBy._id || ticket.lockedBy,
              lockedByUsername: ticket.lockedBy.name || 'Another Agent',
              lockExpiresAt: new Date(ticket.lockExpiresAt)
            };
          }
        });
        setActiveLocks(locksMap);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const onTicketCreated = ({ ticket }) => {
      setTickets((prevTickets) => [ticket, ...prevTickets]);
    };

    const onTicketUpdated = ({ ticket }) => {
      setTickets((prevTickets) =>
        prevTickets.map((t) => (t._id === ticket._id ? ticket : t))
      );
    };

    const onTicketDeleted = ({ ticketId }) => {
      setTickets((prevTickets) => prevTickets.filter((t) => t._id !== ticketId));
      setActiveLocks((prevLocks) => {
        const updated = { ...prevLocks };
        delete updated[ticketId];
        return updated;
      });
    };

    const onLockAcquired = ({ ticketId, lockedBy, lockedByUsername, lockExpiresAt }) => {
      setActiveLocks((prevLocks) => ({
        ...prevLocks,
        [ticketId]: {
          lockedBy,
          lockedByUsername,
          lockExpiresAt: new Date(lockExpiresAt)
        }
      }));
    };

    const onLockReleased = ({ ticketId }) => {
      setActiveLocks((prevLocks) => {
        const updated = { ...prevLocks };
        delete updated[ticketId];
        return updated;
      });
    };

    socket.on('ticket:created', onTicketCreated);
    socket.on('ticket:updated', onTicketUpdated);
    socket.on('ticket:deleted', onTicketDeleted);
    socket.on('ticket:lock:acquired', onLockAcquired);
    socket.on('ticket:lock:released', onLockReleased);

    return () => {
      socket.off('ticket:created', onTicketCreated);
      socket.off('ticket:updated', onTicketUpdated);
      socket.off('ticket:deleted', onTicketDeleted);
      socket.off('ticket:lock:acquired', onLockAcquired);
      socket.off('ticket:lock:released', onLockReleased);
    };
  }, [socket]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        activeLocks,
        loading,
        error,
        loadTickets,
        setTickets,
        setActiveLocks
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
