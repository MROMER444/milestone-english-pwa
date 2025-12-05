const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { calculateXP, calculateNextReview, updateMasteryLevel } = require('../utils/gamification');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get user's overall progress
router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total_questions_answered,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
        AVG(time_taken) as avg_time_taken,
        COUNT(DISTINCT question_id) as unique_questions_answered
      FROM user_progress
      WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({ progress: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get detailed statistics
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    // Overall stats
    const overallStats = await db.query(
      `SELECT 
        COUNT(*) as total_answered,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct,
        AVG(time_taken) as avg_time
      FROM user_progress
      WHERE user_id = $1`,
      [req.user.id]
    );

    // Stats by level
    const byLevel = await db.query(
      `SELECT 
        q.level,
        COUNT(*) as answered,
        SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct
      FROM user_progress up
      JOIN questions q ON up.question_id = q.id
      WHERE up.user_id = $1
      GROUP BY q.level
      ORDER BY q.level`,
      [req.user.id]
    );

    // Stats by topic
    const byTopic = await db.query(
      `SELECT 
        q.topic,
        COUNT(*) as answered,
        SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct
      FROM user_progress up
      JOIN questions q ON up.question_id = q.id
      WHERE up.user_id = $1
      GROUP BY q.topic
      ORDER BY q.topic`,
      [req.user.id]
    );

    res.json({
      overall: overallStats.rows[0],
      byLevel: byLevel.rows,
      byTopic: byTopic.rows
    });
  } catch (error) {
    next(error);
  }
});

// Submit answer
router.post('/answer', authenticate, async (req, res, next) => {
  try {
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
    masteryLevel = updateMasteryLevel(masteryLevel, isCorrect);
    const nextReviewAt = calculateNextReview(masteryLevel);

    // Calculate XP
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

// Get weak areas
router.get('/weak-areas', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT 
        q.topic,
        q.level,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct_attempts,
        (SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END)::float / COUNT(*)::float * 100) as accuracy
      FROM user_progress up
      JOIN questions q ON up.question_id = q.id
      WHERE up.user_id = $1
      GROUP BY q.topic, q.level
      HAVING (SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END)::float / COUNT(*)::float * 100) < 70
      ORDER BY accuracy ASC`,
      [req.user.id]
    );

    res.json({ weakAreas: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get review queue (spaced repetition)
router.get('/review-queue', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT q.*, up.mastery_level, up.next_review_at
       FROM user_progress up
       JOIN questions q ON up.question_id = q.id
       WHERE up.user_id = $1 
         AND up.next_review_at <= NOW()
         AND up.mastery_level < 5
       ORDER BY up.next_review_at ASC
       LIMIT 20`,
      [req.user.id]
    );

    res.json({ questions: result.rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
