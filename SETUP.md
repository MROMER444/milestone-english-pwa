# Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher)
3. **npm** or **yarn**

## Installation Steps

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project
- Frontend (React + Vite)
- Backend (Express.js)

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE milestone_english;

# Exit psql
\q
```

#### Configure Environment Variables

Copy the example environment file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and update:
- `DB_NAME=milestone_english`
- `DB_USER=your_postgres_user`
- `DB_PASSWORD=your_postgres_password`
- `JWT_SECRET=your-random-secret-key-here`
- `JWT_REFRESH_SECRET=your-random-refresh-secret-key-here`

#### Run Migrations

```bash
cd backend
npm run db:migrate
```

This creates all necessary database tables.

#### Seed Sample Questions

```bash
npm run db:seed
```

This adds initial sample questions to get you started.

### 3. Start Development Servers

From the root directory:

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

Or start them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## First Steps

1. Open http://localhost:5173 in your browser
2. Register a new account
3. Start practicing!

## Project Structure

```
PWA_MILESTONE/
├── frontend/              # React PWA frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management (Zustand)
│   │   └── utils/         # Utilities (API client, etc.)
│   └── public/            # Static assets & PWA icons
├── backend/               # Express.js API backend
│   ├── routes/            # API routes
│   ├── config/            # Configuration (database, etc.)
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── scripts/           # Database migration & seeding
└── DEVELOPER_SPECIFICATION.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Questions
- `GET /api/questions` - Get questions (with filters)
- `GET /api/questions/random/practice` - Get random question
- `GET /api/questions/by-level/:level` - Get by CEFR level
- `GET /api/questions/by-topic/:topic` - Get by topic

### Progress
- `GET /api/progress/stats` - Get progress statistics
- `POST /api/progress/answer` - Submit answer
- `GET /api/progress/weak-areas` - Get weak areas
- `GET /api/progress/review-queue` - Get review queue

### Gamification
- `GET /api/gamification/stats` - Get XP, level, streak
- `GET /api/gamification/leaderboard` - Get leaderboard
- `POST /api/gamification/claim-reward` - Claim daily reward

### Sessions
- `POST /api/sessions/start` - Start practice session
- `POST /api/sessions/:id/complete` - Complete session
- `GET /api/sessions/history/list` - Get session history

## Adding More Questions

You can add questions via:

1. **API** (POST `/api/questions`)
2. **Database directly** (insert into `questions` table)
3. **Admin panel** (to be implemented)

Question format:
```json
{
  "question_text": "Your question here",
  "question_type": "multiple_choice",
  "level": "A1",
  "topic": "grammar",
  "difficulty": 5,
  "options": ["option1", "option2", "option3", "option4"],
  "correct_answer": "option1",
  "explanation": "Why this is correct",
  "grammar_rule": "Grammar rule explanation",
  "example_sentences": ["Example 1", "Example 2"],
  "xp_reward": 10
}
```

## PWA Features

The app is configured as a Progressive Web App:

- **Installable**: Users can install it on their devices
- **Offline Support**: Service worker caches assets and API responses
- **App-like Experience**: Standalone display mode

To test PWA features:
1. Build the app: `npm run build` (in frontend directory)
2. Serve the build: `npm run preview` (in frontend directory)
3. Open in browser and check "Add to Home Screen" option

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `backend/.env`
- Ensure database exists: `psql -U postgres -l`

### Port Already in Use
- Change ports in:
  - Frontend: `frontend/vite.config.js` (server.port)
  - Backend: `backend/.env` (PORT)

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL

### PWA Not Working
- Ensure you're using HTTPS (or localhost)
- Check browser console for service worker errors
- Clear browser cache and reload

## Next Steps

1. Add more questions (target: 500+)
2. Implement admin panel for question management
3. Add audio pronunciation questions
4. Implement social features (friends, sharing)
5. Add push notifications
6. Deploy to production

## Production Deployment

### Frontend
- Build: `cd frontend && npm run build`
- Deploy `dist/` folder to:
  - Vercel
  - Netlify
  - AWS S3 + CloudFront

### Backend
- Set `NODE_ENV=production` in `.env`
- Use process manager (PM2, Forever)
- Deploy to:
  - Heroku
  - Railway
  - AWS EC2
  - DigitalOcean

### Database
- Use managed PostgreSQL:
  - AWS RDS
  - Supabase
  - MongoDB Atlas (if switching to MongoDB)

## Support

For issues or questions, refer to `DEVELOPER_SPECIFICATION.md` for detailed requirements.
