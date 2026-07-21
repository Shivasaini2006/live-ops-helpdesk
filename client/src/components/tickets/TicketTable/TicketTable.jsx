/**
 * @file TicketTable.jsx
 * @description Tabular data presentation frame for tickets list.
 * @responsibility Sets up table headers and body structure, rendering ticket rows.
 */

import React from 'react';
import TicketRow from '../TicketRow/TicketRow';
import styles from './TicketTable.module.css';

const TicketTable = ({ tickets = [], locks = {} }) => {
  if (tickets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No Tickets Found</h3>
        <p>There are no tickets available in this view.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Title</th>
            <th className={styles.th}>Created By</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Priority</th>
            <th className={styles.th}>Lock State</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket._id}
              ticket={ticket}
              lockDetails={locks[ticket._id]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
