/**
 * @file user.model.js
 * @description Mongoose schema definition for the User model.
 * @responsibility Defines the structure, fields, and constraints of User documents in MongoDB, including pre-save password hashing and verification methods.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Avoid returning the password hash by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['agent', 'admin'],
        message: '{VALUE} is not a supported role'
      },
      default: 'agent'
    },
    activeConnection: {
      type: String,
      default: null // Tracks active Socket.io socket ID for real-time locks
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save middleware hook to hash the password before saving to the database.
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare an incoming plain text password with the hashed password.
 * @param {string} candidatePassword - The plain text password to compare.
 * @returns {Promise<boolean>} Resolves to true if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
