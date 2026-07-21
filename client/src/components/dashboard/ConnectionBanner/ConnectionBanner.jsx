/**
 * @file ConnectionBanner.jsx
 * @description Top alert banner notifying client socket connection issues.
 * @responsibility Displays alert dialog when socket server is disconnected, prompting reconnection attempts.
 */

import React from 'react';
import useSocket from '../../../hooks/useSocket';
import styles from './ConnectionBanner.module.css';

const ConnectionBanner = () => {
  const socketContext = useSocket();
  const isConnected = socketContext ? socketContext.isConnected : true;

  if (isConnected) return null;

  return (
    <div className={styles.banner}>
      <span className={styles.warningIcon}>⚠️</span>
      <span>Connection lost. Attempting to reconnect to live updates server...</span>
    </div>
  );
};

export default ConnectionBanner;
