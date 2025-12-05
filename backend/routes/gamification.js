const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { calculateLevel } = require('../utils/gamification');

const router = express.Router();

// Get gamification stats
router.get('/stats', authenticate, async (req, res) => {
  const levelInfo = calculateLevel(req.user.total_xp || 0);
  
  res.json({
    totalXP: req.user.total_xp || 0,
    level: levelInfo.level,
    levelProgress: levelInfo.progress,
    xpInLevel: levelInfo.xpInLevel,
    xpForNextLevel: levelInfo.xpForNextLevel,
    currentStreak: req.user.current_streak || 0,
    longestStreak: req.user.longest_streak || 0,
    gems: req.user.gems || 0,
    hearts: req.user.hearts || 5,
    currentLevel: req.user.current_level || 'A1'
  });
});

// Get user achievements
router.get('/achievements', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM user_achievements WHERE user_id = $1 ORDER BY unlocked_at DESC',
      [req.user.id]
    );

    res.json({ achievements: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard
router.get('/leaderboard', authenticate, async (req, res, next) => {
  try {
    const { period = 'weekly' } = req.query;
    
    let dateFilter = '';
    if (period === 'daily') {
      dateFilter = "AND DATE(created_at) = CURRENT_DATE";
    } else if (period === 'weekly') {
      dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === 'monthly') {
      dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
    }

    const result = await db.query(
      `SELECT 
        u.id,
        u.username,
        u.avatar_url,
        u.total_xp,
        u.current_streak,
        u.level_number,
        ROW_NUMBER() OVER (ORDER BY u.total_xp DESC) as rank
      FROM users u
      WHERE u.total_xp > 0 ${dateFilter}
      ORDER BY u.total_xp DESC
      LIMIT 100`
    );

    // Find current user's rank
    const userRankResult = await db.query(
      `SELECT COUNT(*) + 1 as rank
       FROM users
       WHERE total_xp > $1`,
      [req.user.total_xp || 0]
    );

    res.json({
      leaderboard: result.rows,
      userRank: parseInt(userRankResult.rows[0].rank)
    });
  } catch (error) {
    next(error);
  }
});

// Claim daily reward
router.post('/claim-reward', authenticate, async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already claimed today
    const activityResult = await db.query(
      'SELECT * FROM daily_activity WHERE user_id = $1 AND date = $2',
      [req.user.id, today]
    );

    if (activityResult.rows.length > 0 && activityResult.rows[0].goals_completed > 0) {
      return res.status(400).json({ error: 'Daily reward already claimed' });
    }

    // Award gems
    const gemsReward = 10;
    await db.query(
      'UPDATE users SET gems = gems + $1 WHERE id = $2',
      [gemsReward, req.user.id]
    );

    // Update daily activity
    await db.query(
      `INSERT INTO daily_activity (id, user_id, date, goals_completed)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (user_id, date) 
       DO UPDATE SET goals_completed = daily_activity.goals_completed + 1`,
      [require('uuid').v4(), req.user.id, today]
    );

    res.json({ gemsReward, message: 'Daily reward claimed!' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
