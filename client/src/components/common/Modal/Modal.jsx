/**
 * @file Modal.jsx
 * @description Centralized Modal backdrop overlay container.
 * @responsibility Renders content inside a focused modal view overlay, blocking interaction with underlying screens, and handles escape key close triggers.
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

/**
 * Custom Modal component using React Portals.
 * @param {object} props - Component properties.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    // Block scrolling of the underlying page when modal is active
    document.body.style.overflow = 'hidden';

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render modal to portal container in index.html (or defaults to body if container missing)
  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside it
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
