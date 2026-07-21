/**
 * @file Loader.jsx
 * @description Standardized loading spinner component.
 * @responsibility Renders visual indicator to indicate fetching/saving operations are in progress.
 */

import React from 'react';
import styles from './Loader.module.css';

/**
 * Custom Loader component.
 * @param {object} props - Component properties.
 */
const Loader = ({ size = 'medium', className = '', ...props }) => {
  const loaderClass = `${styles.spinner} ${styles[size]} ${className}`;

  return <div className={loaderClass} {...props} />;
};

export default Loader;
