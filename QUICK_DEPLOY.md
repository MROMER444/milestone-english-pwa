# Quick Deployment Guide 🚀

Deploy your PWA in **15 minutes** using free hosting!

## 🎯 Recommended Setup

- **Frontend**: Vercel (Best for React/Vite)
- **Backend**: Render (Free Express hosting)
- **Database**: NeonDB (Free serverless PostgreSQL)

---

## 📦 Step 1: Setup Database (NeonDB)

### 1.1 Create NeonDB Account & Database

1. Go to https://neon.tech
2. Sign up/login with GitHub
3. Click **"Create Project"**
4. Settings:
   - **Project Name**: `milestone-english`
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 15 or 16
5. Click **"Create Project"**
6. Wait for provisioning (~30 seconds)

### 1.2 Get Connection Details

1. After project is created, you'll see a **Connection String**
2. It looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
3. **Copy this connection string** - you'll need it!

**Extract these values from the connection string:**
- `DB_HOST`: The hostname (e.g., `ep-xxx-xxx.us-east-2.aws.neon.tech`)
- `DB_PORT`: `5432`
- `DB_NAME`: The database name
- `DB_USER`: The username  
- `DB_PASSWORD`: The password

---

## 🖥️ Step 2: Deploy Backend (Render)

### 2.1 Deploy Backend Service

1. Go to https://render.com
2. Sign up/login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect GitHub repository: `milestone-english-pwa`
5. Settings:
   - **Name**: `milestone-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   DB_HOST=<from-neondb-connection-string>
   DB_PORT=5432
   DB_NAME=<from-neondb-connection-string>
   DB_USER=<from-neondb-connection-string>
   DB_PASSWORD=<from-neondb-connection-string>
   JWT_SECRET=change-this-to-random-secret-key-min-32-chars
   JWT_REFRESH_SECRET=change-this-to-another-random-secret-key-min-32-chars
   FRONTEND_URL=https://your-app.vercel.app
   ```
   
   ⚠️ **Generate secrets**: Run `openssl rand -base64 32` twice for JWT secrets

7. Click **"Create Web Service"**
8. Wait for deployment (~5 minutes)
9. **Copy your backend URL**: `https://milestone-backend.onrender.com`

### 2.2 Run Database Migrations

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
1. Update `backend/.env` with NeonDB credentials:
   ```env
   DB_HOST=<neondb-host>
   DB_PORT=5432
   DB_NAME=<neondb-dbname>
   DB_USER=<neondb-user>
   DB_PASSWORD=<neondb-password>
   ```
2. Run:
   ```bash
   cd backend
   node scripts/migrate.js
   node scripts/seed.js
   ```

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Deploy to Vercel

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
   (Use your actual backend URL from Step 2.1)

7. Click **"Deploy"**
8. Wait for deployment (~2-3 minutes)
9. **Copy your frontend URL**: `https://milestone-english-pwa.vercel.app`

### 3.2 Update Backend CORS

1. Go back to Render → Your backend service
2. Go to "Environment" tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://milestone-english-pwa.vercel.app
   ```
   (Use your actual Vercel URL)
4. Click "Save Changes" (will auto-redeploy)

---

## ✅ Step 4: Test Your Deployment

1. Visit your frontend URL
2. Try registering a new account
3. Try logging in
4. Test PWA installation on mobile

---

## 🔧 Troubleshooting

### Database Connection Error
- ✅ Check all DB environment variables are correct
- ✅ Make sure NeonDB project is fully provisioned
- ✅ Verify connection string format
- ✅ Check SSL is enabled (`sslmode=require`)

### CORS Errors
- ✅ Update `FRONTEND_URL` in backend environment variables
- ✅ Make sure it matches your Vercel URL exactly (no trailing slash)

### API Not Working
- ✅ Check `VITE_API_URL` includes `/api` at the end
- ✅ Format: `https://your-backend.onrender.com/api`

### Backend Sleep Issues
- ⚠️ Render free tier sleeps after 15min inactivity
- ✅ First request after sleep takes ~30 seconds to wake up
- ✅ Consider upgrading to paid plan for always-on

---

## 📱 Testing PWA Installation

1. Open your Vercel URL on mobile Chrome
2. You should see "Add to Home screen" prompt
3. Or use menu → "Add to Home screen"
4. App should install and work offline!

---

## 💰 Cost

- **Vercel**: Free forever (Hobby plan)
- **Render**: Free (sleeps after 15min inactivity)
- **NeonDB**: Free (0.5GB storage, unlimited projects)
- **Total**: $0/month! 🎉

---

## 🚀 Why NeonDB?

✅ **Always On** - No sleep/wake delays  
✅ **Better Performance** - Faster than Render's PostgreSQL  
✅ **Free Tier** - 0.5GB storage, unlimited projects  
✅ **Serverless** - Auto-scales automatically  
✅ **Easy Setup** - Simple connection string  

---

## 📝 Post-Deployment

- [ ] Update README.md with live URLs
- [ ] Add repository topics: `pwa`, `react`, `nodejs`, `english-learning`
- [ ] Test all features
- [ ] Share your app! 🎉

---

## 🔗 Useful Links

- **NeonDB Dashboard**: https://console.neon.tech
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Repo**: https://github.com/MROMER444/milestone-english-pwa

---

**Need Help?** Check the full `DEPLOYMENT.md` guide for detailed instructions.
