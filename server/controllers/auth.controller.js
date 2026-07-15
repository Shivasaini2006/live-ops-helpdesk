/**
 * @file auth.controller.js
 * @description Controllers managing agent/admin authentication workflows.
 * @responsibility Orchestrates login processing, validation parsing, user mapping, password verification, and token dispensing.
 */

const User = require('../models/user.model');
const { generateToken } = require('../helpers/token.helper');
const Response = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Logs in a user by verifying their credentials and returning a token.
 * @route POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return Response.error(res, 'Invalid credentials', null, 401);
  }

  // Verify password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return Response.error(res, 'Invalid credentials', null, 401);
  }

  // Generate JWT token
  const token = generateToken(user);

  // Exclude password from response user object
  const userResponse = user.toObject();
  delete userResponse.password;

  return Response.success(res, 'Login successful', {
    user: userResponse,
    token
  });
});

/**
 * Registers a new agent (restricted to admin or during initial setup).
 * @route POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return Response.error(res, 'User with this email already exists', null, 400);
  }

  // Create new user document
  const user = new User({
    name,
    email,
    password,
    role
  });

  await user.save();

  // Generate JWT token
  const token = generateToken(user);

  // Exclude password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  return Response.success(res, 'Registration successful', {
    user: userResponse,
    token
  }, 201);
});

/**
 * Fetches current authenticated user's details.
 * @route GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  return Response.success(res, 'User session verified', { user: req.user });
});

module.exports = {
  login,
  register,
  getMe
};
