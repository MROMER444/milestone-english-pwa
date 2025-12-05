# Update Frontend to Use Railway Backend 🔄

Your frontend is pointing to Render, but your backend is on Railway. Let's fix it!

## Step 1: Find Your Railway Backend URL

1. Go to **Railway Dashboard**: https://railway.app/dashboard
2. Click on your backend service
3. Go to **"Settings"** tab
4. Scroll to **"Domains"** section
5. Copy your Railway URL (looks like: `https://your-app.up.railway.app`)

**OR** check the **"Deployments"** tab → Latest deployment → It shows the URL

---

## Step 2: Update Frontend (If Deployed on Vercel)

### Option A: Update in Vercel Dashboard (Recommended)

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project: `milestone-english-pwa`
3. Go to **"Settings"** → **"Environment Variables"**
4. Find `VITE_API_URL`
5. Click **"Edit"**
6. Update to: `https://your-railway-url.up.railway.app/api`
   (Replace `your-railway-url` with your actual Railway URL)
7. Click **"Save"**
8. Go to **"Deployments"** tab
9. Click **"..."** on latest deployment → **"Redeploy"**

### Option B: Update via Vercel CLI

```bash
cd /Users/omer/Documents/desktop3/PWA_MILESTONE/frontend
vercel env add VITE_API_URL production
# When prompted, enter: https://your-railway-url.up.railway.app/api
```

---

## Step 3: Update Local Development (Optional)

If you want to test locally:

1. Update `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-railway-url.up.railway.app/api
   ```

2. Or create `frontend/.env.local`:
   ```env
   VITE_API_URL=https://your-railway-url.up.railway.app/api
   ```

---

## Step 4: Update Railway CORS

Make sure Railway backend allows your Vercel frontend:

1. Go to Railway → Your backend service → **"Variables"**
2. Add/Update:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
   (Use your actual Vercel frontend URL)

3. Railway will auto-redeploy

---

## Step 5: Test

1. Visit your Vercel frontend URL
2. Try to login
3. Check browser console (F12) → Network tab
4. Verify requests go to: `your-railway-url.up.railway.app/api`

---

## Quick Checklist

- [ ] Found Railway backend URL
- [ ] Updated `VITE_API_URL` in Vercel
- [ ] Redeployed frontend on Vercel
- [ ] Updated `FRONTEND_URL` in Railway
- [ ] Tested login functionality

---

## Still Not Working?

1. **Check CORS**: Make sure Railway has correct `FRONTEND_URL`
2. **Check Railway Logs**: See if requests are reaching backend
3. **Check Browser Console**: Look for CORS or network errors
4. **Verify URLs**: Make sure both URLs are correct (no typos)

---

## Example URLs

**Railway Backend**: `https://milestone-backend-production.up.railway.app`  
**Vercel Frontend**: `https://milestone-english-pwa.vercel.app`  
**VITE_API_URL**: `https://milestone-backend-production.up.railway.app/api`  
**FRONTEND_URL** (in Railway): `https://milestone-english-pwa.vercel.app`
