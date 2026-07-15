/**
 * @file db.js
 * @description Database configuration and connection runner for MongoDB using Mongoose.
 * @responsibility Initializes the connection to the database, manages connection events, and handles connection-related errors.
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using parameters specified in environment variables.
 * Sets up listeners for connection events (connected, error, disconnected).
 * @returns {Promise<void>} Resolves when connection is established.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('Error: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  // Set up connection event listeners for robustness
  mongoose.connection.on('connected', () => {
    console.log('MongoDB successfully connected.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Attempting reconnection...');
  });

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });
  } catch (error) {
    console.error(`Failed to connect to MongoDB on startup: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
