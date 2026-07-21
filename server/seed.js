/**
 * @file seed.js
 * @description Database seeding script to create a default agent account.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/user.model');

const seedUser = async () => {
  console.log('Starting database seeding...');
  await connectDB();

  const defaultEmail = process.env.SEED_EMAIL || 'agent@liveops.com';
  const defaultPassword = process.env.SEED_PASSWORD || 'Password123';

  try {
    // Remove existing user with same email
    await User.deleteOne({ email: defaultEmail });
    console.log('Removed old default user.');

    // Instantiate and save default user
    const newUser = new User({
      name: 'Default Agent',
      email: defaultEmail,
      password: defaultPassword,
      role: 'agent'
    });

    await newUser.save();
    console.log('=========================================');
    console.log('SUCCESS: Default agent user seeded.');
    console.log(`Email:    ${defaultEmail}`);
    console.log(`Password: ${defaultPassword}`);
    console.log('=========================================');
  } catch (error) {
    console.error('Failed seeding user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedUser();
