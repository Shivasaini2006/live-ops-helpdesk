/**
 * @file NotFound.jsx
 * @description 404 error page.
 * @responsibility Displays error instructions when users navigate to invalid routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import Button from '../../components/common/Button/Button';

const NotFound = () => {
  return (
    <div className={styles.notFoundWrapper}>
      <span className={styles.errorIcon}>🕵️‍♂️</span>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.description}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="medium">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
