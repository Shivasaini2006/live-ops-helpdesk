/**
 * @file auth.routes.js
 * @description Authentication endpoint routes mapping.
 * @responsibility Maps paths to auth controllers, injecting validator rule arrays and runner middleware.
 */

const express = require('express');
const { login, register, getMe } = require('../controllers/auth.controller');
const { loginRules, registerRules } = require('../validators/auth.validator');
const validate = require('../middleware/validation');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Route definitions:
router.post('/login', loginRules, validate, login);
router.post('/register', registerRules, validate, register);
router.get('/me', authenticate, getMe);

module.exports = router;
