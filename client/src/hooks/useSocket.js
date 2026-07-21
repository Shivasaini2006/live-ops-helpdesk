/**
 * @file useSocket.js
 * @description Custom hook to easily consume the socket connection context.
 * @responsibility Wraps React's useContext hook for SocketContext to make the active socket instance available globally.
 */

import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

/**
 * Returns active socket client state.
 * @returns {object} SocketContext values ({ socket, isConnected }).
 */
const useSocket = () => {
  const context = useContext(SocketContext);
  return context; // Can return null if wrapped outside SocketProvider (optional fallback handled gracefully)
};

export default useSocket;
