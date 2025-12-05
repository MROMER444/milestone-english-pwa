const express = require('express');
const db = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, username, full_name, avatar_url, current_level, total_xp, 
              current_streak, longest_streak, level_number, created_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get user statistics
router.get('/:id/stats', optionalAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT 
        COUNT(DISTINCT up.question_id) as questions_answered,
        SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct_answers,
        COUNT(DISTINCT us.id) as sessions_completed,
        SUM(us.xp_earned) as total_xp_earned
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      LEFT JOIN user_sessions us ON u.id = us.user_id
      WHERE u.id = $1
      GROUP BY u.id`,
      [req.params.id]
    );

    res.json({ stats: result.rows[0] || {} });
  } catch (error) {
    next(error);
  }
});

// Search users (for friends feature)
router.get('/search/list', authenticate, async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const result = await db.query(
      `SELECT id, username, full_name, avatar_url, current_level, total_xp, level_number
       FROM users
       WHERE (username ILIKE $1 OR full_name ILIKE $1)
         AND id != $2
       LIMIT $3`,
      [`%${q}%`, req.user.id, parseInt(limit)]
    );

    res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
