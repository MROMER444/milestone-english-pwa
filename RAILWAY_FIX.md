# Fix Railway Health Check Error 🔧

If you're getting a health check error on Railway, follow these steps:

## The Problem

Railway checks if your app is healthy by hitting a health endpoint. If it doesn't respond correctly, deployment fails.

## Solution 1: Update Railway Health Check Settings

1. Go to your Railway service dashboard
2. Click on your service
3. Go to **"Settings"** tab
4. Scroll to **"Healthcheck"** section
5. Set:
   - **Healthcheck Path**: `/health`
   - **Healthcheck Timeout**: `30` seconds
   - **Healthcheck Interval**: `10` seconds
6. Save changes

## Solution 2: Check Deploy Logs

1. Go to your service → **"Deployments"** tab
2. Click on the latest deployment
3. Click **"View Logs"**
4. Look for errors like:
   - Database connection errors
   - Port binding errors
   - Missing environment variables

## Solution 3: Verify Environment Variables

Make sure these are set in Railway:

```
NODE_ENV=production
DATABASE_URL=<your-neondb-connection-string>
JWT_SECRET=v8Txu87yNmCYIkisOS4dmJdrvuFvsTbemx2jeOIwa3g=
JWT_REFRESH_SECRET=32zEVHHxn8w/OGfYlPL3fbPySe4xadsfW8zSt8sm2i0=
FRONTEND_URL=https://milestone-english-pwa.vercel.app
```

## Solution 4: Disable Health Check (Temporary)

If health check keeps failing:

1. Go to Settings → Healthcheck
2. **Disable** health check temporarily
3. Deploy
4. Check if app works manually
5. Re-enable health check after fixing issues

## Solution 5: Check Database Connection

The health check might be failing because database isn't connecting:

1. Check logs for database errors
2. Verify `DATABASE_URL` is correct
3. Test NeonDB connection from Railway shell:

```bash
# In Railway shell
cd backend
node -e "require('dotenv').config(); const {Pool} = require('pg'); const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}}); pool.query('SELECT NOW()').then(r => console.log('✅ DB OK:', r.rows[0])).catch(e => console.error('❌ DB Error:', e));"
```

## Common Issues

### Issue 1: Port Not Listening
- **Fix**: Backend code already uses `process.env.PORT` ✅

### Issue 2: Database Connection Blocking
- **Fix**: I've updated server.js to start server first, then connect DB ✅

### Issue 3: Health Check Path Wrong
- **Fix**: Health check is at `/health` ✅

### Issue 4: Missing Environment Variables
- **Fix**: Check all variables are set in Railway

## Quick Test

After deployment, test manually:

1. Get your Railway URL: `https://your-app.up.railway.app`
2. Test health endpoint: `https://your-app.up.railway.app/health`
3. Should return: `{"status":"ok","message":"Milestone English API is running",...}`

## Still Not Working?

1. Check deploy logs for specific errors
2. Share the error message
3. Verify all environment variables are set
4. Make sure Root Directory is set to `backend`
