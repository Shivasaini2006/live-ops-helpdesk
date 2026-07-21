/**
 * @file CreateTicket.jsx
 * @description Form page to create new tickets.
 * @responsibility Coordinates rendering new ticket form, validating inputs, dispatching API submission requests, and redirecting user on success.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../api/ticketApi';
import Header from '../../components/layout/Header/Header';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './CreateTicket.module.css';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createTicket({
        title,
        description,
        priority
      });

      if (response.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.createPage}>
      <Header
        title="Create New Ticket"
        subtitle="Open a new client assistance ticket"
      />

      <form onSubmit={handleSubmit} className={styles.formCard}>
        {error && <div className={styles.errorAlert}>{error}</div>}

        <Input
          label="Ticket Title"
          type="text"
          id="title"
          placeholder="Summarize the issue..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          required
        />

        <div className={styles.fieldGroup}>
          <label htmlFor="description" className={styles.label}>
            Detailed Description
          </label>
          <textarea
            id="description"
            rows="5"
            placeholder="Provide all details, environment steps, and error logs..."
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="priority" className={styles.label}>
            Priority Level
          </label>
          <select
            id="priority"
            className={styles.select}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={submitting}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Create Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
