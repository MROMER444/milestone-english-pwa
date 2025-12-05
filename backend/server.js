const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const progressRoutes = require('./routes/progress');
const sessionRoutes = require('./routes/sessions');
const gamificationRoutes = require('./routes/gamification');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check endpoint (must be before database init for Railway)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Milestone English API is running',
    timestamp: new Date().toISOString() 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Milestone English API is running',
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server first (for health checks), then initialize database
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize database after server starts (non-blocking)
  db.init()
    .then(() => {
      console.log('✅ Database connection established');
    })
    .catch((error) => {
      console.error('❌ Failed to initialize database:', error);
      console.error('⚠️  Server is running but database connection failed');
      // Don't exit - let server run and retry connection
    });
});

module.exports = app;
