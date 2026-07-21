/**
 * @file TicketDetails.jsx
 * @description Detail view of a ticket, featuring collaborative editing and real-time edit locks.
 * @responsibility Coordinates fetching ticket detail, attempting lock acquisition, warning user if ticket is locked by someone else, releasing locks, and saving changes.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';
import useTickets from '../../hooks/useTickets';
import { getTicketById, updateTicket, deleteTicket, lockTicket, unlockTicket } from '../../api/ticketApi';
import Header from '../../components/layout/Header/Header';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import StatusChip from '../../components/tickets/StatusChip/StatusChip';
import LockIndicator from '../../components/tickets/LockIndicator/LockIndicator';
import Loader from '../../components/common/Loader/Loader';
import styles from './TicketDetails.module.css';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { activeLocks } = useTickets();
  const socketContext = useSocket();
  const socket = socketContext?.socket;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Edit Form Fields
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('low');

  const lockDetails = activeLocks[id];
  const isLockedByOther = lockDetails && lockDetails.lockedBy !== user._id;
  const isLockedByMe = lockDetails && lockDetails.lockedBy === user._id;

  // Fetch ticket details
  const fetchTicket = async () => {
    try {
      const response = await getTicketById(id);
      if (response.success) {
        const t = response.data.ticket;
        setTicket(t);
        setTitle(t.title);
        setDescription(t.description);
        setStatus(t.status);
        setPriority(t.priority);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();

    if (!socket) return;

    // Join specific ticket updates room
    socket.emit('join:ticket', id);

    // Sync state dynamically if another agent saves updates
    const onTicketUpdated = ({ ticket: updatedTicket }) => {
      if (updatedTicket._id === id) {
        setTicket(updatedTicket);
        if (!isEditing) {
          setTitle(updatedTicket.title);
          setDescription(updatedTicket.description);
          setStatus(updatedTicket.status);
          setPriority(updatedTicket.priority);
        }
      }
    };

    socket.on('ticket:updated', onTicketUpdated);

    return () => {
      socket.emit('leave:ticket', id);
      socket.off('ticket:updated', onTicketUpdated);
    };
  }, [id, socket]);

  // Clean up lock if user leaves the page while editing
  useEffect(() => {
    return () => {
      if (isEditing) {
        // Silent unlock on navigation unmount
        unlockTicket(id).catch(() => {});
      }
    };
  }, [id, isEditing]);

  const handleEditClick = async () => {
    setError('');
    try {
      // Attempt to acquire edit lock
      const response = await lockTicket(id, socket?.id);
      if (response.success) {
        setIsEditing(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to acquire lock. Ticket might be in use.');
    }
  };

  const handleCancelClick = async () => {
    setError('');
    setIsEditing(false);
    // Reset values to match server
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description);
      setStatus(ticket.status);
      setPriority(ticket.priority);
    }
    // Release editing lock
    try {
      await unlockTicket(id);
    } catch (err) {
      console.warn('Unlock request failed:', err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await updateTicket(id, {
        title,
        description,
        status,
        priority
      });

      if (response.success) {
        setTicket(response.data.ticket);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save updates.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action is irreversible.')) {
      return;
    }

    try {
      const response = await deleteTicket(id);
      if (response.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete ticket.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="large" />
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className={styles.errorContainer}>
        <h3>Ticket Not Found</h3>
        <p>{error || 'The requested ticket could not be loaded.'}</p>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className={styles.detailsPage}>
      <Header
        title={`Ticket #${ticket._id.substring(ticket._id.length - 6).toUpperCase()}`}
        subtitle={`Opened by ${ticket.createdBy?.name || 'Agent'} on ${new Date(ticket.createdAt).toLocaleDateString()}`}
      />

      {error && <div className={styles.errorAlert}>{error}</div>}

      {/* Real-time lock warnings */}
      {lockDetails && (
        <div className={styles.lockNotice}>
          <LockIndicator
            lockedByUsername={lockDetails.lockedByUsername}
            lockExpiresAt={lockDetails.lockExpiresAt}
          />
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSave}>
          <div className={styles.fieldGroup}>
            {isEditing ? (
              <Input
                label="Ticket Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            ) : (
              <div className={styles.readField}>
                <label className={styles.fieldLabel}>Title</label>
                <h2 className={styles.readTitle}>{ticket.title}</h2>
              </div>
            )}
          </div>

          <div className={styles.metaRow}>
            <div className={styles.metaField}>
              <label className={styles.fieldLabel}>Status</label>
              {isEditing ? (
                <select
                  className={styles.select}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              ) : (
                <div>
                  <StatusChip status={ticket.status} />
                </div>
              )}
            </div>

            <div className={styles.metaField}>
              <label className={styles.fieldLabel}>Priority</label>
              {isEditing ? (
                <select
                  className={styles.select}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              ) : (
                <div>
                  <Badge variant={ticket.priority === 'critical' ? 'red' : ticket.priority === 'high' ? 'orange' : ticket.priority === 'medium' ? 'yellow' : 'gray'}>
                    {ticket.priority}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            {isEditing ? (
              <div className={styles.textareaWrapper}>
                <label className={styles.fieldLabel}>Description</label>
                <textarea
                  className={styles.textarea}
                  rows="8"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className={styles.readField}>
                <label className={styles.fieldLabel}>Description</label>
                <p className={styles.readDesc}>{ticket.description}</p>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className={styles.actionsRow}>
            {isEditing ? (
              <div className={styles.editActions}>
                <Button variant="secondary" onClick={handleCancelClick} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={saving}>
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className={styles.viewActions}>
                <Button variant="secondary" onClick={() => navigate('/')}>
                  Back
                </Button>
                <div className={styles.controlButtons}>
                  {user.role === 'admin' && (
                    <Button variant="danger" onClick={handleDelete}>
                      Delete Ticket
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleEditClick}
                    disabled={isLockedByOther}
                  >
                    {isLockedByOther ? 'Locked for Editing' : 'Edit Ticket'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;
