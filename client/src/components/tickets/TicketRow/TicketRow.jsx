/**
 * @file TicketRow.jsx
 * @description Single row inside TicketTable.
 * @responsibility Renders ticket field columns and interactive buttons, applying custom states for active locks.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import StatusChip from '../StatusChip/StatusChip';
import Badge from '../../common/Badge/Badge';
import styles from './TicketRow.module.css';

const TicketRow = ({ ticket, lockDetails }) => {
  const isLocked = !!lockDetails;

  return (
    <tr className={`${styles.row} ${isLocked ? styles.lockedRow : ''}`}>
      <td className={styles.td}>
        <div className={styles.titleWrapper}>
          <span className={styles.title}>{ticket.title}</span>
        </div>
      </td>
      <td className={styles.td}>{ticket.createdBy?.name || 'Agent'}</td>
      <td className={styles.td}>
        <StatusChip status={ticket.status} />
      </td>
      <td className={styles.td}>
        <Badge variant={ticket.priority === 'critical' ? 'red' : ticket.priority === 'high' ? 'orange' : ticket.priority === 'medium' ? 'yellow' : 'gray'}>
          {ticket.priority}
        </Badge>
      </td>
      <td className={styles.td}>
        {isLocked ? (
          <span className={styles.lockBadge}>
            🔒 Locked by {lockDetails.lockedByUsername}
          </span>
        ) : (
          <span className={styles.unlockedBadge}>🔓 Open</span>
        )}
      </td>
      <td className={styles.td}>
        <Link to={`/tickets/${ticket._id}`} className={styles.actionBtn}>
          View
        </Link>
      </td>
    </tr>
  );
};

export default TicketRow;
