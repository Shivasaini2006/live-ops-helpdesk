/**
 * @file Footer.jsx
 * @description Standard layout footer panel.
 * @responsibility Renders copyright guidelines and versioning details.
 */

import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Live Ops Helpdesk. Real-Time Collaboration Desk.</p>
    </footer>
  );
};

export default Footer;
