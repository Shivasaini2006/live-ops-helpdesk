/**
 * @file ticket.model.js
 * @description Mongoose schema definition for the Ticket model.
 * @responsibility Defines the fields, constraints, and data structure of Tickets, including status, priority, description, and collaborative lock indicators.
 */

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in-progress', 'resolved', 'closed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'open'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: '{VALUE} is not a valid priority level'
      },
      default: 'low'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creating agent context is required']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Tracks which agent currently holds edit lock
    },
    lockedAt: {
      type: Date,
      default: null
    },
    lockExpiresAt: {
      type: Date,
      default: null // Real-time lock lease expiration time
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
