const express = require('express');
const db = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get questions with filters
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { level, topic, difficulty, type, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM questions WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (level) {
      query += ` AND level = $${paramCount++}`;
      params.push(level);
    }
    if (topic) {
      query += ` AND topic = $${paramCount++}`;
      params.push(topic);
    }
    if (difficulty) {
      query += ` AND difficulty = $${paramCount++}`;
      params.push(parseInt(difficulty));
    }
    if (type) {
      query += ` AND question_type = $${paramCount++}`;
      params.push(type);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);
    res.json({ questions: result.rows, count: result.rows.length });
  } catch (error) {
    next(error);
  }
});

// Get single question
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ question: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get random question for practice
router.get('/random/practice', authenticate, async (req, res, next) => {
  try {
    const { level, topic } = req.query;
    const userLevel = req.user.current_level || 'A1';

    let query = `
      SELECT q.* FROM questions q
      WHERE q.level = $1
    `;
    const params = [level || userLevel];

    if (topic) {
      query += ` AND q.topic = $2`;
      params.push(topic);
    }

    // Exclude questions user has mastered (optional - can be enhanced with user_progress join)
    query += ` ORDER BY RANDOM() LIMIT 1`;

    const result = await db.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }

    res.json({ question: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get questions by level
router.get('/by-level/:level', optionalAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM questions WHERE level = $1 ORDER BY difficulty, created_at',
      [req.params.level]
    );
    res.json({ questions: result.rows, count: result.rows.length });
  } catch (error) {
    next(error);
  }
});

// Get questions by topic
router.get('/by-topic/:topic', optionalAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM questions WHERE topic = $1 ORDER BY level, difficulty',
      [req.params.topic]
    );
    res.json({ questions: result.rows, count: result.rows.length });
  } catch (error) {
    next(error);
  }
});

// Create question (admin - simplified for now)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const {
      question_text,
      question_type,
      level,
      topic,
      difficulty = 5,
      options,
      correct_answer,
      explanation,
      grammar_rule,
      example_sentences,
      audio_url,
      image_url,
      related_question_ids,
      xp_reward = 10
    } = req.body;

    const questionId = uuidv4();
    const result = await db.query(
      `INSERT INTO questions (
        id, question_text, question_type, level, topic, difficulty, options, 
        correct_answer, explanation, grammar_rule, example_sentences, 
        audio_url, image_url, related_question_ids, xp_reward, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *`,
      [
        questionId, question_text, question_type, level, topic, difficulty,
        JSON.stringify(options || []), JSON.stringify(correct_answer),
        explanation, grammar_rule, JSON.stringify(example_sentences || []),
        audio_url, image_url, JSON.stringify(related_question_ids || []), xp_reward
      ]
    );

    res.status(201).json({ question: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
