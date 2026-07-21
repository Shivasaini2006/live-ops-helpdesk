/**
 * @file Dashboard.jsx
 * @description Main dashboard page showing live overview of all support tickets.
 * @responsibility Coordinates fetching active tickets list, subscribing to live dashboard socket events, and rendering grid/table ticket lists.
 */

import React, { useEffect, useState } from 'react';
import useTickets from '../../hooks/useTickets';
import useSocket from '../../hooks/useSocket';
import Header from '../../components/layout/Header/Header';
import ConnectionBanner from '../../components/dashboard/ConnectionBanner/ConnectionBanner';
import TicketList from '../../components/tickets/TicketList/TicketList';
import TicketTable from '../../components/tickets/TicketTable/TicketTable';
import Button from '../../components/common/Button/Button';
import Loader from '../../components/common/Loader/Loader';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { tickets, activeLocks, loading, loadTickets } = useTickets();
  const socketContext = useSocket();
  const socket = socketContext?.socket;
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    // Initial fetch
    loadTickets();

    if (!socket) return;

    // Join the live updates room on mount
    socket.emit('join:dashboard');

    return () => {
      // Leave room on unmount
      socket.emit('leave:dashboard');
    };
  }, [socket, loadTickets]);

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in-progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  const headerActions = (
    <>
      <Button
        variant="secondary"
        size="small"
        onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
      >
        {viewMode === 'grid' ? 'Table View' : 'Grid View'}
      </Button>
      <Button variant="secondary" size="small" onClick={loadTickets} disabled={loading}>
        🔄 Refresh
      </Button>
    </>
  );

  return (
    <div className={styles.dashboardPage}>
      <ConnectionBanner />
      
      <Header
        title="Live Support Dashboard"
        subtitle="Real-time collaborative support ticket overview"
        actions={headerActions}
      />

      {/* Metrics Panel */}
      <div className={styles.metricsGrid}>
        <div className={`${styles.metricCard} ${styles.open}`}>
          <h3>{openCount}</h3>
          <p>Open Tickets</p>
        </div>
        <div className={`${styles.metricCard} ${styles.progress}`}>
          <h3>{inProgressCount}</h3>
          <p>In Progress</p>
        </div>
        <div className={`${styles.metricCard} ${styles.resolved}`}>
          <h3>{resolvedCount}</h3>
          <p>Resolved</p>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader size="large" />
          <p>Loading active tickets...</p>
        </div>
      ) : (
        <div className={styles.contentWrapper}>
          {viewMode === 'grid' ? (
            <TicketList tickets={tickets} locks={activeLocks} />
          ) : (
            <TicketTable tickets={tickets} locks={activeLocks} />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
