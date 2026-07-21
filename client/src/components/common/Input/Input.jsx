/**
 * @file Input.jsx
 * @description Reusable generic form input wrapper.
 * @responsibility Standardizes textual user inputs, providing labels, error boundary styling, focus highlights, and form alignment.
 */

import React from 'react';
import styles from './Input.module.css';

/**
 * Custom Input component.
 * @param {object} props - Component properties.
 */
const Input = ({
  label,
  error,
  type = 'text',
  id,
  className = '',
  ...props
}) => {
  const inputClass = `${styles.inputField} ${error ? styles.inputError : ''} ${className}`;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={inputClass}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
