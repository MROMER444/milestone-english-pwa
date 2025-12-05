const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { generateTokens } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('username').isLength({ min: 3 }).trim(),
  body('full_name').optional().trim(),
  body('language_preference').optional().isIn(['en', 'ar'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username, full_name, language_preference = 'en' } = req.body;

    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const result = await db.query(
      `INSERT INTO users (id, email, password_hash, username, full_name, language_preference, created_at, updated_at, last_active_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
       RETURNING id, email, username, full_name, avatar_url, language_preference, current_level, total_xp, current_streak, longest_streak, gems, hearts, level_number, email_verified`,
      [userId, email, password_hash, username, full_name || null, language_preference]
    );

    const user = result.rows[0];
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const result = await db.query(
      'SELECT id, email, password_hash, username, full_name, avatar_url, language_preference, current_level, total_xp, current_streak, longest_streak, gems, hearts, level_number, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last active
    await db.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [user.id]);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Remove password_hash from response
    delete user.password_hash;

    res.json({
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// Update profile
router.put('/profile', authenticate, [
  body('full_name').optional().trim(),
  body('username').optional().isLength({ min: 3 }).trim(),
  body('language_preference').optional().isIn(['en', 'ar'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, username, language_preference } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (full_name !== undefined) {
      updates.push(`full_name = $${paramCount++}`);
      values.push(full_name);
    }
    if (username !== undefined) {
      // Check username uniqueness
      const existing = await db.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, req.user.id]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updates.push(`username = $${paramCount++}`);
      values.push(username);
    }
    if (language_preference !== undefined) {
      updates.push(`language_preference = $${paramCount++}`);
      values.push(language_preference);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user.id);

    const result = await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, username, full_name, avatar_url, language_preference, current_level, total_xp, current_streak, longest_streak, gems, hearts, level_number, email_verified`,
      values
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(refreshToken, true);

    const result = await db.query('SELECT id FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticate, async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
