# Deploy Backend to Render with NeonDB 🚀

Follow these exact steps to deploy your backend and connect it to NeonDB.

## Your NeonDB Connection Details

From your connection string, here are the values:

```
Connection String: postgresql://neondb_owner:npg_5qkeGRWDb3zQ@ep-gentle-fog-ag1o7z2v-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

Individual Values:
DB_HOST=ep-gentle-fog-ag1o7z2v-pooler.c-2.eu-central-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_5qkeGRWDb3zQ
```

---

## Step 1: Generate JWT Secrets

First, let's generate secure secrets for JWT tokens:

```bash
cd /Users/omer/Documents/desktop3/PWA_MILESTONE
openssl rand -base64 32
openssl rand -base64 32
```

**Copy both outputs** - you'll need them for JWT_SECRET and JWT_REFRESH_SECRET.

---

## Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Go to **https://render.com**
2. Sign up/login with **GitHub** (if not already)
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect account"** if needed, then select your GitHub account
5. Find and select repository: **`milestone-english-pwa`**
6. Click **"Connect"**

### 2.2 Configure Service

Fill in these settings:

- **Name**: `milestone-backend`
- **Region**: Choose closest to you (or default)
- **Branch**: `master`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: **Free**

### 2.3 Add Environment Variables

Click **"Advanced"** to expand environment variables section.

Add these variables one by one (click "Add Environment Variable" for each):

#### Database Variables (Method 1 - Connection String - Recommended):

```
Key: DATABASE_URL
Value: postgresql://neondb_owner:npg_5qkeGRWDb3zQ@ep-gentle-fog-ag1o7z2v-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**OR** Individual Variables (Method 2):

```
Key: DB_HOST
Value: ep-gentle-fog-ag1o7z2v-pooler.c-2.eu-central-1.aws.neon.tech

Key: DB_PORT
Value: 5432

Key: DB_NAME
Value: neondb

Key: DB_USER
Value: neondb_owner

Key: DB_PASSWORD
Value: npg_5qkeGRWDb3zQ
```

#### Application Variables:

```
Key: NODE_ENV
Value: production

Key: JWT_SECRET
Value: <paste-first-openssl-output>

Key: JWT_REFRESH_SECRET
Value: <paste-second-openssl-output>

Key: FRONTEND_URL
Value: https://milestone-english-pwa.vercel.app
```
⚠️ **Note**: Update FRONTEND_URL after you deploy frontend to Vercel!

### 2.4 Create Service

1. Scroll down and click **"Create Web Service"**
2. Wait for deployment (~5-7 minutes)
3. You'll see build logs in real-time
4. Once deployed, copy your backend URL: `https://milestone-backend.onrender.com`

---

## Step 3: Run Database Migrations

After backend is deployed:

### Option A: Using Render Shell (Easiest)

1. Go to your Render service dashboard
2. Click on **"Shell"** tab (top menu)
3. Wait for shell to connect
4. Run these commands:

```bash
cd backend
node scripts/migrate.js
```

You should see: `✅ Database initialized successfully`

5. Then run:

```bash
node scripts/seed.js
```

You should see: `✅ Questions seeded successfully`

### Option B: Run Locally

1. Create `backend/.env` file:

```env
DATABASE_URL=postgresql://neondb_owner:npg_5qkeGRWDb3zQ@ep-gentle-fog-ag1o7z2v-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
```

2. Run migrations:

```bash
cd backend
node scripts/migrate.js
node scripts/seed.js
```

---

## Step 4: Test Backend

1. Go to your backend URL: `https://milestone-backend.onrender.com`
2. You should see: `{"status":"ok","message":"Milestone English API is running"}`
3. Test health endpoint: `https://milestone-backend.onrender.com/health`

---

## Step 5: Deploy Frontend (Next Step)

After backend is working:

1. Go to **https://vercel.com**
2. Import your GitHub repo: `milestone-english-pwa`
3. Configure:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://milestone-backend.onrender.com/api
   ```
5. Deploy!

---

## Troubleshooting

### Database Connection Error

If you see connection errors:

1. **Check SSL**: Make sure connection string includes `sslmode=require`
2. **Verify credentials**: Double-check all values are correct
3. **Test connection**: Use NeonDB dashboard SQL editor to test

### Build Fails

- Check build logs in Render dashboard
- Make sure `backend/package.json` has correct scripts
- Verify Node version (should be 18+)

### Service Won't Start

- Check logs in Render dashboard
- Verify `npm start` command works locally
- Check environment variables are set correctly

---

## ✅ Checklist

- [ ] JWT secrets generated
- [ ] Backend service created on Render
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Database migrations run
- [ ] Backend URL accessible
- [ ] Health endpoint working

---

## Next: Deploy Frontend

Once backend is working, follow `QUICK_DEPLOY.md` Step 3 to deploy frontend to Vercel!
