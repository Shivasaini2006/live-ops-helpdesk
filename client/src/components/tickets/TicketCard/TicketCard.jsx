/**
 * @file TicketCard.jsx
 * @description Card item displaying ticket preview.
 * @responsibility Renders ticket data in a grid item format, highlighting active edit locks.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import StatusChip from '../StatusChip/StatusChip';
import Badge from '../../common/Badge/Badge';
import LockIndicator from '../LockIndicator/LockIndicator';
import styles from './TicketCard.module.css';

const TicketCard = ({ ticket, lockDetails }) => {
  const isLocked = !!lockDetails;

  return (
    <div className={`${styles.card} ${isLocked ? styles.locked : ''}`}>
      <div className={styles.header}>
        <StatusChip status={ticket.status} />
        <Badge variant={ticket.priority === 'critical' ? 'red' : ticket.priority === 'high' ? 'orange' : ticket.priority === 'medium' ? 'yellow' : 'gray'}>
          {ticket.priority}
        </Badge>
      </div>

      <h3 className={styles.title}>{ticket.title}</h3>
      <p className={styles.description}>
        {ticket.description.length > 100
          ? `${ticket.description.substring(0, 100)}...`
          : ticket.description}
      </p>

      {isLocked && (
        <div className={styles.lockWrapper}>
          <LockIndicator
            lockedByUsername={lockDetails.lockedByUsername}
            lockExpiresAt={lockDetails.lockExpiresAt}
          />
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.creator}>
          By: {ticket.createdBy?.name || 'Agent'}
        </span>
        <Link to={`/tickets/${ticket._id}`} className={styles.viewBtn}>
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;
