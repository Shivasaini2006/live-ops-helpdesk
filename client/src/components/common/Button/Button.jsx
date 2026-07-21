/**
 * @file Button.jsx
 * @description Reusable generic UI Button component.
 * @responsibility Renders standardized, theme-compliant button controls with loading states, sizes, and styling variants.
 */

import React from 'react';
import styles from './Button.module.css';
import Loader from '../Loader/Loader';

/**
 * Standard button component.
 * @param {object} props - Component properties.
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const buttonClass = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? <Loader size="small" /> : children}
    </button>
  );
};

export default Button;
