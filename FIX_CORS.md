# Fix CORS Error 🔧

## Problem
Getting error: "Response body is not available to scripts (Reason: CORS Allow Origin Not Matching Origin)"

## Solution

The backend needs to allow requests from your Vercel frontend URL.

---

## Step 1: Verify Railway FRONTEND_URL Variable

1. Go to Railway Dashboard: https://railway.app/dashboard
2. Your backend service → **Variables** tab
3. Check if `FRONTEND_URL` exists and has value:
   ```
   https://milestone-english-pwa.vercel.app
   ```

**If it's missing or wrong:**
- Click **"+ New Variable"**
- Key: `FRONTEND_URL`
- Value: `https://milestone-english-pwa.vercel.app`
- Make sure it's a **Service Variable** (not shared, for backend only)
- Click **Save**

---

## Step 2: Push Updated Backend Code

I've updated the backend CORS configuration to be more flexible. You need to push this change:

```bash
cd /Users/omer/Documents/desktop3/PWA_MILESTONE
git add backend/server.js
git commit -m "Fix CORS configuration for Vercel frontend"
git push
```

Railway will automatically redeploy when you push.

---

## Step 3: Wait for Redeploy

1. Go to Railway → Your backend service
2. Click **"Deployments"** tab
3. Wait for new deployment to finish (1-2 minutes)
4. Check logs to ensure it started successfully

---

## Step 4: Test Again

1. Go to your frontend: `https://milestone-english-pwa.vercel.app`
2. Open DevTools (F12) → **Network** tab
3. Try to login
4. Check if CORS error is gone

---

## What I Changed

The backend now:
- ✅ Allows requests from your Vercel URL
- ✅ Allows requests from localhost (for development)
- ✅ Handles requests with no origin (mobile apps)
- ✅ Shows which origins are blocked in logs (for debugging)

---

## Still Getting CORS Error?

### Check Railway Logs:
1. Railway → Backend service → **Deployments** → Latest → **View Logs**
2. Look for: "CORS blocked origin: ..."
3. This tells you which URL is being blocked

### Verify Your Vercel URL:
- Make sure it's exactly: `https://milestone-english-pwa.vercel.app`
- No trailing slash
- Check if you have a custom domain (use that instead)

### Test Backend Directly:
Visit: `https://milestone-backend-production.up.railway.app/health`
- Should return: `{"status":"ok",...}`
- If you see CORS error here too, the backend isn't running

---

## Quick Checklist

- [ ] Verified `FRONTEND_URL` in Railway = `https://milestone-english-pwa.vercel.app`
- [ ] Pushed updated `backend/server.js` to GitHub
- [ ] Railway redeployed successfully
- [ ] Tested login on frontend
- [ ] CORS error is gone

Let me know once you've pushed the code and I'll help verify it's working! 🚀
