# Update Vercel Environment Variable 🚀

Your Railway backend URL: `https://milestone-backend-production.up.railway.app`

## Step-by-Step: Update Vercel

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Sign in if needed

### Step 2: Select Your Project

1. Find and click: **`milestone-english-pwa`**

### Step 3: Go to Environment Variables

1. Click **"Settings"** tab (top menu)
2. Click **"Environment Variables"** (left sidebar)

### Step 4: Update VITE_API_URL

1. Find `VITE_API_URL` in the list
2. Click **"Edit"** (or the pencil icon)
3. Change the value to:
   ```
   https://milestone-backend-production.up.railway.app/api
   ```
4. Make sure **"Production"** is selected
5. Click **"Save"**

### Step 5: Redeploy

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Wait 2-3 minutes for redeployment

---

## Step 6: Update Railway CORS

Make sure Railway allows your Vercel frontend:

1. Go to **Railway Dashboard**: https://railway.app/dashboard
2. Click your backend service
3. Go to **"Variables"** tab
4. Add/Update this variable:
   ```
   FRONTEND_URL=https://milestone-english-pwa.vercel.app
   ```
   (Replace with your actual Vercel URL if different)
5. Railway will auto-redeploy

---

## Test It!

1. Visit your Vercel frontend URL
2. Open browser console (F12)
3. Try to login
4. Check Network tab - requests should go to:
   `milestone-backend-production.up.railway.app/api`

---

## Quick Reference

**Railway Backend**: `https://milestone-backend-production.up.railway.app`  
**Vercel Frontend**: `https://milestone-english-pwa.vercel.app` (or your URL)  
**VITE_API_URL**: `https://milestone-backend-production.up.railway.app/api`  
**FRONTEND_URL** (Railway): `https://milestone-english-pwa.vercel.app`

---

## Done! ✅

After redeploying Vercel, your frontend will connect to Railway backend!
