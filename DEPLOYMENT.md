# Deployment Guide

This guide will help you deploy your Milestone English PWA to production.

## Recommended Hosting

- **Frontend**: Vercel (Best for React/Vite PWAs)
- **Backend**: Render (Free PostgreSQL + Express hosting)

Both are **100% free** and perfect for this project!

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend for Deployment

1. **Update backend/server.js** to use environment PORT:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

2. **Create render.yaml** (optional, for easier setup):
   ```yaml
   services:
     - type: web
       name: milestone-backend
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: NODE_ENV
           value: production
   ```

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
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_NAME=milestone_english
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Create PostgreSQL Database**:
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `milestone-db`
   - Plan: Free
   - Copy the connection details
   - Update your environment variables with the database info

7. Click **"Create Web Service"**

8. Once deployed, copy your backend URL (e.g., `https://milestone-backend.onrender.com`)

### Step 3: Run Database Migrations

After backend is deployed:

1. SSH into your Render service or use Render Shell
2. Or run migrations locally pointing to Render database:
   ```bash
   # Update backend/.env with Render database credentials
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   ```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. **Update API base URL** in `frontend/src/utils/api.js`:
   ```javascript
   // Change to use environment variable
   const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   ```

2. **Create vercel.json** (optional):
   ```json
   {
     "buildCommand": "cd frontend && npm install && npm run build",
     "outputDirectory": "frontend/dist",
     "devCommand": "cd frontend && npm run dev",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

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
   VITE_API_URL=https://your-backend.onrender.com
   ```

5. Click **"Deploy"**

6. Wait for deployment (usually 2-3 minutes)

7. Your app will be live at: `https://milestone-english-pwa.vercel.app`

---

## Part 3: Update Backend CORS

After frontend is deployed, update backend CORS to allow your Vercel URL:

1. Go to Render dashboard → Your backend service → Environment
2. Add/Update:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Update `backend/server.js` CORS to use this environment variable

---

## Alternative Options

### Frontend Alternatives:
- **Netlify**: Similar to Vercel, also excellent
- **GitHub Pages**: Free but requires more setup

### Backend Alternatives:
- **Railway**: Great free tier, easier PostgreSQL setup
- **Fly.io**: Good free tier, global edge deployment
- **Heroku**: No longer free, but still an option

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database migrations run
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Test login/register functionality
- [ ] Test PWA installation on mobile
- [ ] Update README with live URLs

---

## Troubleshooting

### Backend Issues:
- **Database connection errors**: Check environment variables
- **Port errors**: Make sure using `process.env.PORT`
- **CORS errors**: Update FRONTEND_URL in backend

### Frontend Issues:
- **API errors**: Check VITE_API_URL is set correctly
- **Build errors**: Check Node version (should be 18+)
- **PWA not working**: Ensure HTTPS (Vercel provides this automatically)

---

## Cost

- **Vercel**: Free (Hobby plan)
- **Render**: Free (with limitations, sleeps after 15min inactivity)
- **Total**: $0/month! 🎉

---

## Quick Deploy Commands

If you have Vercel CLI installed:

```bash
# Frontend
cd frontend
vercel

# Backend (Render doesn't have CLI, use dashboard)
```
