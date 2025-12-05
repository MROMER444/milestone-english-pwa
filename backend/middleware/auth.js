const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await db.query(
      'SELECT id, email, username, full_name, avatar_url, language_preference, current_level, total_xp, current_streak, longest_streak, gems, hearts, level_number, email_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await db.query(
      'SELECT id, email, username, full_name, avatar_url, language_preference, current_level, total_xp, current_streak, longest_streak, gems, hearts, level_number, email_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    req.user = result.rows.length > 0 ? result.rows[0] : null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = { authenticate, optionalAuth };
