const db = require('../config/database');
require('dotenv').config();

const createTables = async () => {
  try {
    console.log('🔄 Creating database tables...');

    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        avatar_url VARCHAR(500),
        language_preference VARCHAR(2) DEFAULT 'en' CHECK (language_preference IN ('en', 'ar')),
        current_level VARCHAR(2) DEFAULT 'A1' CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
        total_xp INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        gems INTEGER DEFAULT 0,
        hearts INTEGER DEFAULT 5,
        level_number INTEGER DEFAULT 1,
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_active_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Questions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple_choice', 'fill_blank', 'sentence_order', 'audio', 'image')),
        level VARCHAR(2) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
        topic VARCHAR(100) NOT NULL,
        difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 10),
        options JSONB,
        correct_answer JSONB NOT NULL,
        explanation TEXT,
        grammar_rule TEXT,
        example_sentences JSONB,
        audio_url VARCHAR(500),
        image_url VARCHAR(500),
        related_question_ids JSONB,
        xp_reward INTEGER DEFAULT 10,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // User progress table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        is_correct BOOLEAN NOT NULL,
        time_taken INTEGER,
        attempts INTEGER DEFAULT 1,
        last_attempted_at TIMESTAMP DEFAULT NOW(),
        next_review_at TIMESTAMP,
        mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, question_id)
      );
    `);

    // User sessions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_type VARCHAR(50) DEFAULT 'practice' CHECK (session_type IN ('practice', 'test', 'review')),
        questions_answered INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        xp_earned INTEGER DEFAULT 0,
        duration INTEGER DEFAULT 0,
        started_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      );
    `);

    // User achievements table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_type VARCHAR(100) NOT NULL,
        achievement_data JSONB,
        unlocked_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, achievement_type)
      );
    `);

    // Daily activity table
    await db.query(`
      CREATE TABLE IF NOT EXISTS daily_activity (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        xp_earned INTEGER DEFAULT 0,
        questions_answered INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        streak_maintained BOOLEAN DEFAULT false,
        goals_completed INTEGER DEFAULT 0,
        UNIQUE(user_id, date)
      );
    `);

    // Create indexes
    await db.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_user_progress_question_id ON user_progress(question_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON user_progress(next_review_at);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, date);`);

    console.log('✅ Database tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
};

createTables();
