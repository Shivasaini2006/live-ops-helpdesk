/**
 * @file StatusChip.jsx
 * @description Small pill chip to display ticket status.
 * @responsibility Maps status values to status-specific colors.
 */

import React from 'react';
import styles from './StatusChip.module.css';

const StatusChip = ({ status = 'open' }) => {
  const normalizedStatus = status.toLowerCase();
  const statusClass = `${styles.chip} ${styles[normalizedStatus] || ''}`;

  return <span className={statusClass}>{status}</span>;
};

export default StatusChip;
