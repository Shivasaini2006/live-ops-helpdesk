/**
 * @file LockIndicator.jsx
 * @description Real-time lock indicator label component.
 * @responsibility Displays status alert informing which agent is currently holding an editing lock on a ticket.
 */

import React, { useEffect, useState } from 'react';
import styles from './LockIndicator.module.css';

const LockIndicator = ({ lockedByUsername, lockExpiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!lockExpiresAt) return;

    const updateTimer = () => {
      const difference = new Date(lockExpiresAt) - new Date();
      if (difference <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor(difference / 1000 / 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      setTimeLeft(`${minutes}:${paddedSeconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lockExpiresAt]);

  return (
    <div className={styles.indicator}>
      <span className={styles.lockIcon}>🔒</span>
      <span>
        Locked by <strong>{lockedByUsername}</strong> {timeLeft && `(${timeLeft})`}
      </span>
    </div>
  );
};

export default LockIndicator;
