/**
 * @file Sidebar.jsx
 * @description Vertical left sidebar navigation panel.
 * @responsibility Holds navigation links (Dashboard, Create Ticket) for routing context.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <span className={styles.icon}>📋</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/tickets/create"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <span className={styles.icon}>➕</span>
          <span>Create Ticket</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
