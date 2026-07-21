/**
 * @file Navbar.jsx
 * @description Horizontal top-bar layout header.
 * @responsibility Displays logo, notifications indicators, connection state indicator, and current logged-in user profile controls.
 */

import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useSocket from '../../../hooks/useSocket';
import Button from '../../common/Button/Button';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket() || {};

  if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.brand}>Live Ops Desk</span>
        <div className={styles.indicatorWrapper}>
          <span className={`${styles.statusDot} ${isConnected ? styles.online : styles.offline}`} />
          <span className={styles.statusText}>{isConnected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.username}>{user.name}</span>
          <span className={styles.role}>{user.role}</span>
        </div>
        <Button variant="outline" size="small" onClick={logout}>
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
