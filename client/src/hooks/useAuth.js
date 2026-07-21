/**
 * @file useAuth.js
 * @description Custom hook to easily consume the user authentication context.
 * @responsibility Wraps React's useContext hook for AuthContext to prevent repetitive import boilerplate in pages and components.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Returns user session state and authentication helpers.
 * @returns {object} AuthContext values ({ user, login, logout, loading, error }).
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
