# Automated Deployment Guide 🤖

I'll help you deploy both frontend and backend! Follow these steps:

## 🔐 Step 1: Login to Vercel (One-time setup)

Run this command and follow the prompts:

```bash
cd /Users/omer/Documents/desktop3/PWA_MILESTONE
vercel login
```

This will open your browser to authenticate.

---

## 🚀 Step 2: Run Automated Deployment Script

I've created a deployment script for you. Run:

```bash
cd /Users/omer/Documents/desktop3/PWA_MILESTONE
./deploy.sh
```

This will:
- ✅ Generate secure JWT secrets
- ✅ Deploy frontend to Vercel
- ✅ Show you backend deployment instructions

---

## 📦 Step 3: Deploy Backend (Render - Web Interface)

Since Render requires web interface, follow these steps:

### 3.1 Create PostgreSQL Database

1. Go to: https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `milestone-db`
   - **Database**: `milestone_english`
   - **User**: `milestone_user`
   - **Plan**: Free
4. Click **"Create Database"**
5. Wait 2-3 minutes for provisioning
6. **Copy the connection details** (Internal Database URL)

### 3.2 Deploy Backend Service

1. Still on Render, click **"New +"** → **"Web Service"**
2. Connect GitHub: Select `milestone-english-pwa` repository
3. Configure:
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
   JWT_SECRET=<from-deployment-secrets-file>
   JWT_REFRESH_SECRET=<from-deployment-secrets-file>
   FRONTEND_URL=<your-vercel-url-after-frontend-deploys>
   ```

5. Click **"Create Web Service"**

### 3.3 Run Database Migrations

After backend is deployed:

1. Go to your backend service → **"Shell"** tab
2. Run:
   ```bash
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   ```

### 3.4 Update CORS

1. Go to backend service → **"Environment"** tab
2. Update `FRONTEND_URL` with your Vercel URL
3. Save (will auto-redeploy)

---

## ✅ Step 4: Update Frontend Environment Variable

After backend is deployed:

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL`:
   ```
   https://milestone-backend.onrender.com/api
   ```
5. Redeploy (or it will auto-update)

---

## 🎉 Done!

Your app should now be live!

- **Frontend**: `https://milestone-english-pwa.vercel.app`
- **Backend**: `https://milestone-backend.onrender.com`

---

## 🔄 Alternative: Use Web Interfaces (Easier!)

If you prefer not to use CLI:

### Frontend (Vercel Web):
1. Go to https://vercel.com/new
2. Import `milestone-english-pwa`
3. Configure:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. Add env: `VITE_API_URL=https://milestone-backend.onrender.com/api`
5. Deploy!

### Backend (Render Web):
Follow Step 3 above.

---

## 📝 Quick Reference

**Secrets File**: `.deployment-secrets.txt` (created by deploy.sh)
**Frontend URL**: Check Vercel dashboard after deployment
**Backend URL**: Check Render dashboard after deployment
