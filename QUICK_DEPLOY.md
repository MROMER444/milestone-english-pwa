# Quick Deployment Guide 🚀

Deploy your PWA in **15 minutes** using free hosting!

## 🎯 Recommended Setup

- **Frontend**: Vercel (Best for React/Vite)
- **Backend**: Render (Free PostgreSQL + Express)

---

## 📦 Step 1: Deploy Backend (Render)

### 1.1 Create PostgreSQL Database

1. Go to https://render.com
2. Sign up/login with GitHub
3. Click **"New +"** → **"PostgreSQL"**
4. Settings:
   - **Name**: `milestone-db`
   - **Database**: `milestone_english`
   - **User**: `milestone_user`
   - **Plan**: Free
5. Click **"Create Database"**
6. Wait for it to be ready (~2 minutes)
7. **Copy the connection details** (you'll need them)

### 1.2 Deploy Backend Service

1. Still on Render, click **"New +"** → **"Web Service"**
2. Connect GitHub repository: `milestone-english-pwa`
3. Settings:
   - **Name**: `milestone-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   DB_HOST=<from-postgres-connection>
   DB_PORT=5432
   DB_NAME=milestone_english
   DB_USER=<from-postgres-connection>
   DB_PASSWORD=<from-postgres-connection>
   JWT_SECRET=change-this-to-random-secret-key-min-32-chars
   JWT_REFRESH_SECRET=change-this-to-another-random-secret-key-min-32-chars
   FRONTEND_URL=https://your-app.vercel.app
   ```
   ⚠️ **Important**: Generate random secrets! Use: `openssl rand -base64 32`

5. Click **"Create Web Service"**
6. Wait for deployment (~5 minutes)
7. **Copy your backend URL**: `https://milestone-backend.onrender.com`

### 1.3 Run Database Migrations

After backend is deployed:

**Option A: Using Render Shell**
1. Go to your backend service → "Shell" tab
2. Run:
   ```bash
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   ```

**Option B: Run Locally**
1. Update `backend/.env` with Render database credentials
2. Run:
   ```bash
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   ```

---

## 🎨 Step 2: Deploy Frontend (Vercel)

### 2.1 Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import repository: `milestone-english-pwa`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Environment Variables**:
   ```
   VITE_API_URL=https://milestone-backend.onrender.com/api
   ```
   (Use your actual backend URL from Step 1.2)

7. Click **"Deploy"**
8. Wait for deployment (~2-3 minutes)
9. **Copy your frontend URL**: `https://milestone-english-pwa.vercel.app`

### 2.2 Update Backend CORS

1. Go back to Render → Your backend service
2. Go to "Environment" tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://milestone-english-pwa.vercel.app
   ```
4. Click "Save Changes" (will auto-redeploy)

---

## ✅ Step 3: Test Your Deployment

1. Visit your frontend URL
2. Try registering a new account
3. Try logging in
4. Test PWA installation on mobile

---

## 🔧 Troubleshooting

### Backend Issues

**Database Connection Error**
- Check all DB environment variables are correct
- Make sure database is fully provisioned (can take 2-3 minutes)

**CORS Errors**
- Update `FRONTEND_URL` in backend environment variables
- Make sure it matches your Vercel URL exactly

**Port Errors**
- Backend already uses `process.env.PORT` ✅ (no changes needed)

### Frontend Issues

**API Not Working**
- Check `VITE_API_URL` includes `/api` at the end
- Format: `https://your-backend.onrender.com/api`

**Build Errors**
- Make sure Node version is 18+ (Vercel auto-detects)
- Check for any missing dependencies

**PWA Not Installing**
- Make sure you're using HTTPS (Vercel provides this automatically)
- Check browser console for service worker errors

---

## 📱 Testing PWA Installation

1. Open your Vercel URL on mobile Chrome
2. You should see "Add to Home screen" prompt
3. Or use menu → "Add to Home screen"
4. App should install and work offline!

---

## 💰 Cost

- **Vercel**: Free forever (Hobby plan)
- **Render**: Free (with limitations)
  - Backend sleeps after 15min inactivity (wakes up on first request)
  - Database: 90 days free, then $7/month (or use Railway for free DB)

**Total: $0/month** for the first 90 days! 🎉

---

## 🚀 Alternative: Railway (All-in-One)

If you prefer one platform:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Add PostgreSQL database
6. Deploy both frontend and backend

Railway offers:
- Free $5 credit monthly
- No sleep (always on)
- Easier setup

---

## 📝 Post-Deployment

- [ ] Update README.md with live URLs
- [ ] Add repository topics: `pwa`, `react`, `nodejs`, `english-learning`
- [ ] Test all features
- [ ] Share your app! 🎉

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Your Repo**: https://github.com/MROMER444/milestone-english-pwa

---

**Need Help?** Check the full `DEPLOYMENT.md` guide for detailed instructions.
