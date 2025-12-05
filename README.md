# Milestone English Learning PWA

A Progressive Web App for English learning with gamification features similar to Duolingo.

## Features

- ✅ Progressive Web App (PWA) with offline support
- ✅ User authentication and accounts
- ✅ 500+ question bank with multiple question types
- ✅ Gamification (XP, levels, streaks, achievements)
- ✅ Adaptive learning algorithm
- ✅ Spaced repetition system
- ✅ Daily goals and practice sessions
- ✅ Bilingual support (English/Arabic)

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Zustand (state management)
- Axios
- Workbox (PWA)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
- Copy `backend/.env.example` to `backend/.env` and configure
- Copy `frontend/.env.example` to `frontend/.env` if needed

3. Set up database:
```bash
cd backend
npm run db:migrate
npm run db:seed
```

4. Start development servers:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend API on http://localhost:3000

## Project Structure

```
PWA_MILESTONE/
├── frontend/          # React PWA frontend
├── backend/           # Express.js API backend
├── DEVELOPER_SPECIFICATION.md
└── README.md
```

## Development

- Frontend: `npm run dev:frontend`
- Backend: `npm run dev:backend`
- Both: `npm run dev`

## Build

```bash
npm run build
```

## License

MIT
