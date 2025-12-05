# Deploy to Railway (Alternative to Render) 🚂

Railway is often more reliable and easier than Render. Let's deploy there instead!

## Step 1: Create Railway Account

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (easiest)
4. Authorize Railway to access your repos

## Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select: **`milestone-english-pwa`**
4. Click **"Deploy Now"**

## Step 3: Configure Service

Railway will auto-detect it's a Node.js project. We need to configure it:

1. Click on your service
2. Go to **"Settings"** tab
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Step 4: Add PostgreSQL Database

1. In your project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Wait for provisioning (~1 minute)
4. Railway will automatically add `DATABASE_URL` environment variable!

## Step 5: Add Environment Variables

Go to your service → **"Variables"** tab and add:

```
NODE_ENV=production
JWT_SECRET=v8Txu87yNmCYIkisOS4dmJdrvuFvsTbemx2jeOIwa3g=
JWT_REFRESH_SECRET=32zEVHHxn8w/OGfYlPL3fbPySe4xadsfW8zSt8sm2i0=
FRONTEND_URL=https://milestone-english-pwa.vercel.app
```

**Note**: Railway automatically adds `DATABASE_URL` from the PostgreSQL service!

## Step 6: Update Database Connection

Since Railway creates its own PostgreSQL, you have two options:

### Option A: Use Railway's PostgreSQL (Recommended)

1. Railway automatically creates `DATABASE_URL`
2. Your backend code will use it automatically ✅
3. No changes needed!

### Option B: Use Your NeonDB

If you want to keep using NeonDB:

1. Add this variable:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_5qkeGRWDb3zQ@ep-gentle-fog-ag1o7z2v-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
2. This will override Railway's database

## Step 7: Deploy

1. Railway will auto-deploy when you push to GitHub
2. Or click **"Deploy"** button
3. Watch the build logs
4. Once deployed, Railway will give you a URL like: `https://milestone-backend.up.railway.app`

## Step 8: Run Migrations

1. Go to your service → **"Deployments"** tab
2. Click on the latest deployment
3. Click **"View Logs"**
4. Or use Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run node scripts/migrate.js
railway run node scripts/seed.js
```

## Why Railway?

✅ **More Reliable**: Less downtime than Render  
✅ **Easier Setup**: Better UI/UX  
✅ **Auto-Deploy**: Deploys on every GitHub push  
✅ **Free Tier**: $5 credit monthly (enough for small apps)  
✅ **Better Logs**: Easier to debug  
✅ **No Sleep**: Services stay awake longer  

## Cost

- **Free**: $5 credit monthly (usually enough for small projects)
- **After free tier**: Pay-as-you-go, very affordable

---

## Quick Comparison

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | ✅ Yes | ✅ $5/month credit |
| Sleep Time | 15min | Longer |
| Setup | Medium | Easy |
| Reliability | Good | Better |
| Auto-Deploy | ✅ | ✅ |

---

## Next Steps

After Railway deployment:
1. ✅ Copy your Railway backend URL
2. ✅ Deploy frontend to Vercel
3. ✅ Update `FRONTEND_URL` in Railway
4. ✅ Test your app!
