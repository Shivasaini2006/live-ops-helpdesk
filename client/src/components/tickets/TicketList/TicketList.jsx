/**
 * @file TicketList.jsx
 * @description Flex container iterating through ticket cards.
 * @responsibility Renders list wrapper or grid view containers and displays loading or empty states.
 */

import React from 'react';
import TicketCard from '../TicketCard/TicketCard';
import styles from './TicketList.module.css';

const TicketList = ({ tickets = [], locks = {} }) => {
  if (tickets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>📂</span>
        <h3>No Tickets Found</h3>
        <p>All clear! There are no pending support tickets currently active.</p>
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          lockDetails={locks[ticket._id]}
        />
      ))}
    </div>
  );
};

export default TicketList;
