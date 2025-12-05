# What to Do Next ✅

Here's your complete checklist to get your app fully working:

## ✅ Current Status

- ✅ Backend deployed on Railway: `https://milestone-backend-production.up.railway.app`
- ✅ Database (NeonDB) connected
- ✅ Frontend code updated locally
- ⚠️ Need to update Vercel
- ⚠️ Need to run database migrations
- ⚠️ Need to test everything

---

## Step 1: Update Vercel Environment Variable (5 minutes)

**This is CRITICAL** - Your frontend needs to know where your backend is!

1. Go to: **https://vercel.com/dashboard**
2. Click on: **`milestone-english-pwa`** project
3. Click: **"Settings"** tab → **"Environment Variables"**
4. Find: **`VITE_API_URL`**
5. Click: **"Edit"**
6. Change to: `https://milestone-backend-production.up.railway.app/api`
7. Make sure: **"Production"** is checked
8. Click: **"Save"**
9. Go to: **"Deployments"** tab
10. Click: **"..."** on latest deployment → **"Redeploy"**
11. Wait: 2-3 minutes for redeployment

---

## Step 2: Update Railway CORS (2 minutes)

Allow your Vercel frontend to access Railway backend:

1. Go to: **https://railway.app/dashboard**
2. Click: Your backend service
3. Go to: **"Variables"** tab
4. Add/Update:
   ```
   FRONTEND_URL=https://milestone-english-pwa.vercel.app
   ```
   (Replace with your actual Vercel URL if different)
5. Railway will auto-redeploy (wait 1-2 minutes)

---

## Step 3: Run Database Migrations (3 minutes)

Create tables in your NeonDB database:

### Option A: Using Railway Shell (Easiest)

1. Go to Railway → Your backend service
2. Click: **"Deployments"** tab
3. Click: Latest deployment
4. Click: **"View Logs"** or **"Shell"** tab
5. Run:
   ```bash
   cd backend
   node scripts/migrate.js
   ```
6. Then:
   ```bash
   node scripts/seed.js
   ```

### Option B: Run Locally

1. Create `backend/.env` file:
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_5qkeGRWDb3zQ@ep-gentle-fog-ag1o7z2v-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   NODE_ENV=production
   ```

2. Run:
   ```bash
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   ```

---

## Step 4: Test Your Backend (2 minutes)

1. Visit: `https://milestone-backend-production.up.railway.app/health`
2. Should see: `{"status":"ok","message":"Milestone English API is running",...}`
3. Visit: `https://milestone-backend-production.up.railway.app/`
4. Should see the same response

---

## Step 5: Test Your Frontend (5 minutes)

1. Visit your Vercel frontend URL (after redeploy)
2. Open browser console (F12)
3. Go to **"Network"** tab
4. Try to **register** a new account
5. Check Network tab - requests should go to:
   `milestone-backend-production.up.railway.app/api`
6. If login works, you're done! ✅

---

## Step 6: Test PWA Installation (Optional)

1. Open frontend URL on mobile Chrome
2. Should see "Add to Home screen" prompt
3. Install the app
4. Test offline functionality

---

## Troubleshooting

### Frontend still shows Render URL?

- ✅ Make sure you updated Vercel environment variable
- ✅ Make sure you redeployed Vercel
- ✅ Clear browser cache (hard refresh: Cmd+Shift+R)

### CORS Errors?

- ✅ Check `FRONTEND_URL` is set in Railway
- ✅ Make sure it matches your Vercel URL exactly
- ✅ Wait for Railway to redeploy

### Database Errors?

- ✅ Make sure migrations ran successfully
- ✅ Check Railway logs for database connection errors
- ✅ Verify `DATABASE_URL` is set in Railway

### Login Not Working?

- ✅ Check browser console for errors
- ✅ Check Network tab - are requests reaching backend?
- ✅ Check Railway logs - are requests being received?

---

## Quick Checklist

- [ ] Updated Vercel `VITE_API_URL` environment variable
- [ ] Redeployed Vercel frontend
- [ ] Updated Railway `FRONTEND_URL` variable
- [ ] Ran database migrations (`migrate.js`)
- [ ] Ran database seed (`seed.js`)
- [ ] Tested backend health endpoint
- [ ] Tested frontend login/register
- [ ] Everything working! 🎉

---

## Estimated Time

- **Total**: ~15-20 minutes
- Step 1 (Vercel): 5 min
- Step 2 (Railway CORS): 2 min
- Step 3 (Migrations): 3 min
- Step 4 (Test Backend): 2 min
- Step 5 (Test Frontend): 5 min

---

## Need Help?

If you get stuck:
1. Check the specific error message
2. Check Railway logs
3. Check browser console
4. Share the error and I'll help!

---

## Once Everything Works

🎉 **Congratulations!** Your app is live!

- Share your app URL
- Test all features
- Enjoy your deployed PWA!
