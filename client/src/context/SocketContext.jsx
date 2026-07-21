/**
 * @file SocketContext.jsx
 * @description Provides the React context state wrapper for the client Socket.io-client connection status.
 * @responsibility Manages connection/disconnection notifications, listener registry, and triggers socket connect/disconnect on login state changes.
 */

import React, { createContext, useEffect, useState } from 'react';
import socket from '../services/socket';
import useAuth from '../hooks/useAuth';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket.connected) {
        socket.disconnect();
      }
      return;
    }

    // Connect socket on user authentication
    socket.connect();

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Socket connected successfully');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    const handleConnectError = (error) => {
      setIsConnected(false);
      console.error('Socket connection error:', error);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Initial check
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
