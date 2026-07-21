/**
 * @file Header.jsx
 * @description Standard page sub-header component.
 * @responsibility Renders title, subtitle, and action controls on top of page content templates.
 */

import React from 'react';
import styles from './Header.module.css';

const Header = ({ title, subtitle, actions }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.meta}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

export default Header;
