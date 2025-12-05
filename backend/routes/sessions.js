const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Start new practice session
router.post('/start', authenticate, async (req, res, next) => {
  try {
    const { session_type = 'practice' } = req.body;
    const sessionId = uuidv4();

    const result = await db.query(
      `INSERT INTO user_sessions (id, user_id, session_type, started_at, questions_answered, correct_answers, xp_earned, duration)
       VALUES ($1, $2, $3, NOW(), 0, 0, 0, 0)
       RETURNING *`,
      [sessionId, req.user.id, session_type]
    );

    res.status(201).json({ session: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Submit answer in session (simplified - use progress endpoint directly)
router.post('/:id/answer', authenticate, async (req, res, next) => {
  try {
    // Verify session belongs to user
    const sessionResult = await db.query(
      'SELECT * FROM user_sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Process answer - call progress endpoint logic inline
    const { question_id, answer, time_taken } = req.body;
    
    // Get question
    const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [question_id]);
    if (questionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const question = questionResult.rows[0];
    
    // Parse correct_answer - PostgreSQL JSONB can be returned as string or already parsed
    let correctAnswer = question.correct_answer;
    
    // If it's a string, try to parse it (might be JSON-encoded)
    if (typeof correctAnswer === 'string') {
      // Check if it looks like a JSON string (starts and ends with quotes)
      if (correctAnswer.startsWith('"') && correctAnswer.endsWith('"')) {
        try {
          correctAnswer = JSON.parse(correctAnswer);
        } catch (e) {
          // If parsing fails, remove surrounding quotes if present
          correctAnswer = correctAnswer.replace(/^"|"$/g, '');
        }
      }
      // If it's a JSON array string, try to parse it
      else if (correctAnswer.startsWith('[') || correctAnswer.startsWith('{')) {
        try {
          correctAnswer = JSON.parse(correctAnswer);
        } catch (e) {
          // Keep as-is if parsing fails
        }
      }
    }

    // Check if answer is correct - handle both string and array answers
    let isCorrect;
    if (Array.isArray(correctAnswer)) {
      isCorrect = Array.isArray(answer) && JSON.stringify(answer.sort()) === JSON.stringify(correctAnswer.sort());
    } else {
      // Normalize strings for comparison (trim and lowercase)
      const normalizedAnswer = String(answer).toLowerCase().trim();
      const normalizedCorrect = String(correctAnswer).toLowerCase().trim();
      isCorrect = normalizedAnswer === normalizedCorrect;
    }

    // Get existing progress
    const existingProgress = await db.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND question_id = $2',
      [req.user.id, question_id]
    );

    let masteryLevel = 0;
    let attempts = 1;

    if (existingProgress.rows.length > 0) {
      const existing = existingProgress.rows[0];
      masteryLevel = existing.mastery_level || 0;
      attempts = existing.attempts + 1;
    }

    // Update mastery level
    const { calculateNextReview, updateMasteryLevel: updateMastery } = require('../utils/gamification');
    masteryLevel = updateMastery(masteryLevel, isCorrect);
    const nextReviewAt = calculateNextReview(masteryLevel);

    // Calculate XP
    const { calculateXP } = require('../utils/gamification');
    const xpEarned = calculateXP(question, isCorrect, time_taken || 0, req.user.current_streak || 0);

    // Update or insert progress
    if (existingProgress.rows.length > 0) {
      await db.query(
        `UPDATE user_progress 
         SET is_correct = $1, time_taken = $2, attempts = $3, 
             last_attempted_at = NOW(), next_review_at = $4, mastery_level = $5
         WHERE user_id = $6 AND question_id = $7`,
        [isCorrect, time_taken, attempts, nextReviewAt, masteryLevel, req.user.id, question_id]
      );
    } else {
      await db.query(
        `INSERT INTO user_progress 
         (id, user_id, question_id, is_correct, time_taken, attempts, last_attempted_at, next_review_at, mastery_level, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, NOW())`,
        [uuidv4(), req.user.id, question_id, isCorrect, time_taken, attempts, nextReviewAt, masteryLevel]
      );
    }

    // Update user XP and level
    const newTotalXP = (req.user.total_xp || 0) + xpEarned;
    const { calculateLevel } = require('../utils/gamification');
    const levelInfo = calculateLevel(newTotalXP);

    await db.query(
      'UPDATE users SET total_xp = $1, level_number = $2, updated_at = NOW() WHERE id = $3',
      [newTotalXP, levelInfo.level, req.user.id]
    );

    // Update session stats
    await db.query(
      `UPDATE user_sessions 
       SET questions_answered = questions_answered + 1,
           correct_answers = correct_answers + CASE WHEN $1 THEN 1 ELSE 0 END,
           xp_earned = xp_earned + $2
       WHERE id = $3`,
      [isCorrect, xpEarned, req.params.id]
    );

    res.json({
      isCorrect,
      xpEarned,
      masteryLevel,
      nextReviewAt,
      explanation: question.explanation,
      correctAnswer: correctAnswer
    });
  } catch (error) {
    next(error);
  }
});

// Complete session
router.post('/:id/complete', authenticate, async (req, res, next) => {
  try {
    const { duration } = req.body;

    const result = await db.query(
      `UPDATE user_sessions 
       SET completed_at = NOW(), duration = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [duration, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update daily activity
    const today = new Date().toISOString().split('T')[0];
    await db.query(
      `INSERT INTO daily_activity (id, user_id, date, xp_earned, questions_answered, correct_answers, streak_maintained)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       ON CONFLICT (user_id, date) 
       DO UPDATE SET 
         xp_earned = daily_activity.xp_earned + $4,
         questions_answered = daily_activity.questions_answered + $5,
         correct_answers = daily_activity.correct_answers + $6,
         streak_maintained = true`,
      [
        uuidv4(),
        req.user.id,
        today,
        result.rows[0].xp_earned,
        result.rows[0].questions_answered,
        result.rows[0].correct_answers
      ]
    );

    // Update streak
    await db.query(
      `UPDATE users 
       SET current_streak = current_streak + 1,
           longest_streak = GREATEST(longest_streak, current_streak + 1),
           last_active_at = NOW()
       WHERE id = $1`,
      [req.user.id]
    );

    res.json({ session: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get session details
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM user_sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get session history
router.get('/history/list', authenticate, async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const result = await db.query(
      `SELECT * FROM user_sessions 
       WHERE user_id = $1 
       ORDER BY started_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    res.json({ sessions: result.rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
