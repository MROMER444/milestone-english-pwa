# Deployment Guide

This guide will help you deploy your Milestone English PWA to production.

## Recommended Hosting

- **Frontend**: Vercel (Best for React/Vite PWAs)
- **Backend**: Render (Free Express hosting)
- **Database**: NeonDB (Free serverless PostgreSQL)

All are **100% free** and perfect for this project!

---

## Part 1: Setup Database on NeonDB

### Step 1: Create NeonDB Account

1. Go to https://neon.tech and sign up (use GitHub for easy setup)
2. Click **"Create Project"**

### Step 2: Create Database

1. **Project Name**: `milestone-english`
2. **Region**: Choose closest to you
3. **PostgreSQL Version**: 15 or 16 (latest)
4. Click **"Create Project"**

### Step 3: Get Connection String

1. After project is created, you'll see a connection string
2. It looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
3. **Copy this connection string** - you'll need it!

### Step 4: Extract Connection Details

From your connection string, extract:
- **DB_HOST**: The hostname (e.g., `ep-xxx-xxx.us-east-2.aws.neon.tech`)
- **DB_PORT**: Usually `5432`
- **DB_NAME**: The database name
- **DB_USER**: The username
- **DB_PASSWORD**: The password

Or you can use the connection string directly in your backend!

---

## Part 2: Deploy Backend to Render

### Step 1: Prepare Backend for Deployment

The backend is already configured to use environment variables! ✅

### Step 2: Deploy to Render

1. Go to https://render.com and sign up/login (use GitHub)

2. Click **"New +"** → **"Web Service"**

3. Connect your GitHub repository:
   - Select `milestone-english-pwa`
   - Branch: `master`

4. Configure the service:
   - **Name**: `milestone-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   DB_HOST=<from-neondb-connection>
   DB_PORT=5432
   DB_NAME=<from-neondb-connection>
   DB_USER=<from-neondb-connection>
   DB_PASSWORD=<from-neondb-connection>
   JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-min-32-chars
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

   **OR** use NeonDB connection string directly:
   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```

6. Click **"Create Web Service"**

7. Once deployed, copy your backend URL (e.g., `https://milestone-backend.onrender.com`)

### Step 3: Update Backend to Use NeonDB Connection String (Optional)

If you want to use the connection string directly, update `backend/config/database.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  // ... rest of config
});
```

### Step 4: Run Database Migrations

After backend is deployed:

**Option A: Using Render Shell**
1. Go to your Render service → "Shell" tab
2. Run:
   ```bash
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   ```

**Option B: Run Locally**
1. Update `backend/.env` with NeonDB credentials
2. Run:
   ```bash
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   ```

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

Frontend is already configured! ✅

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign up/login (use GitHub)

2. Click **"Add New Project"**

3. Import your GitHub repository:
   - Select `milestone-english-pwa`
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

5. Click **"Deploy"**

6. Wait for deployment (usually 2-3 minutes)

7. Your app will be live at: `https://milestone-english-pwa.vercel.app`

---

## Part 4: Update Backend CORS

After frontend is deployed, update backend CORS:

1. Go to Render dashboard → Your backend service → Environment
2. Add/Update:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. The backend will auto-redeploy

---

## Why NeonDB?

✅ **Free Tier**: 0.5GB storage, unlimited projects
✅ **Serverless**: Auto-scales, no cold starts
✅ **Always On**: No sleep/wake delays
✅ **Better Performance**: Faster than Render's PostgreSQL
✅ **Easy Setup**: Simple connection string

---

## Post-Deployment Checklist

- [ ] NeonDB database created and connected
- [ ] Backend deployed to Render
- [ ] Database migrations run successfully
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Test login/register functionality
- [ ] Test PWA installation on mobile
- [ ] Update README with live URLs

---

## Troubleshooting

### Database Connection Issues:
- **Check SSL**: NeonDB requires SSL, make sure `sslmode=require` in connection string
- **Check credentials**: Verify all DB environment variables are correct
- **Test connection**: Use NeonDB dashboard to test connection

### Backend Issues:
- **Port errors**: Backend uses `process.env.PORT` ✅ (no changes needed)
- **CORS errors**: Update FRONTEND_URL in backend environment variables
- **Database errors**: Check NeonDB connection string format

### Frontend Issues:
- **API errors**: Check VITE_API_URL includes `/api` at the end
- **Build errors**: Check Node version (should be 18+)
- **PWA not working**: Ensure HTTPS (Vercel provides this automatically)

---

## Cost

- **Vercel**: Free (Hobby plan)
- **Render**: Free (with limitations, sleeps after 15min inactivity)
- **NeonDB**: Free (0.5GB storage, unlimited projects)
- **Total**: $0/month! 🎉

---

## Quick Reference

**NeonDB Dashboard**: https://console.neon.tech
**Render Dashboard**: https://dashboard.render.com
**Vercel Dashboard**: https://vercel.com/dashboard
