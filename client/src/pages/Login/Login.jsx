/**
 * @file Login.jsx
 * @description Login page for agents and administrators.
 * @responsibility Renders credentials form, handles login submissions, displays error alerts, and saves credentials tokens.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.logoTitle}>Live Ops</h1>
          <p className={styles.logoSubtitle}>Support Ticket desk</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {formError && <div className={styles.errorAlert}>{formError}</div>}

          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="agent@liveops.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <Button type="submit" variant="primary" size="large" isLoading={loading} style={{ width: '100%', marginTop: '12px' }}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
