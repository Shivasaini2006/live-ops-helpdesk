/**
 * @file Badge.jsx
 * @description Small text pill indicating status or category.
 * @responsibility Displays generic badges with custom context-based colors.
 */

import React from 'react';
import styles from './Badge.module.css';

/**
 * Custom Badge component.
 * @param {object} props - Component properties.
 */
const Badge = ({ children, variant = 'gray', className = '', ...props }) => {
  const badgeClass = `${styles.badge} ${styles[variant]} ${className}`;

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
};

export default Badge;
