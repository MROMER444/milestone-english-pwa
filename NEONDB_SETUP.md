# NeonDB Setup Guide 🗄️

Quick guide to set up NeonDB for your Milestone English PWA.

## Why NeonDB?

✅ **Free Tier**: 0.5GB storage, unlimited projects  
✅ **Always On**: No sleep/wake delays (unlike Render's PostgreSQL)  
✅ **Serverless**: Auto-scales automatically  
✅ **Better Performance**: Faster connection times  
✅ **Easy Setup**: Simple connection string  

---

## Step 1: Create NeonDB Account

1. Go to https://neon.tech
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize NeonDB to access your GitHub

---

## Step 2: Create Project

1. After logging in, click **"Create Project"**
2. Fill in the form:
   - **Project Name**: `milestone-english`
   - **Region**: Choose the closest region to you
     - US East (N. Virginia)
     - US West (Oregon)
     - EU (Frankfurt)
     - Asia Pacific (Singapore)
   - **PostgreSQL Version**: Choose **15** or **16** (latest)
   - **Compute Size**: **Free** (0.5 vCPU, 1GB RAM)

3. Click **"Create Project"**

4. Wait ~30 seconds for provisioning

---

## Step 3: Get Connection Details

After project is created, you'll see:

### Option A: Connection String (Easiest)

You'll see a connection string like:
```
postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

**Copy this entire string** - you can use it directly in Render!

### Option B: Individual Values

If you prefer individual values, extract from connection string:

- **Host**: `ep-xxx-xxx.us-east-2.aws.neon.tech`
- **Port**: `5432`
- **Database**: `neondb` (or your project name)
- **User**: `neondb_owner` (or similar)
- **Password**: The password shown (save it securely!)

---

## Step 4: Use in Render

### Method 1: Connection String (Recommended)

In Render environment variables, add:
```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### Method 2: Individual Variables

```
DB_HOST=ep-xxx-xxx.us-east-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=your-password-here
```

---

## Step 5: Test Connection

### Using NeonDB Dashboard

1. Go to your project dashboard
2. Click **"SQL Editor"**
3. Try running: `SELECT NOW();`
4. If it works, connection is good! ✅

### Using psql (Local)

```bash
psql "postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

---

## Important Notes

⚠️ **SSL Required**: NeonDB requires SSL connections  
✅ **Connection String**: Use `sslmode=require` in connection string  
✅ **Password**: Save your password securely - you can't see it again!  
✅ **Free Tier**: 0.5GB storage, unlimited projects  

---

## Troubleshooting

### Connection Refused
- ✅ Check SSL is enabled (`sslmode=require`)
- ✅ Verify connection string format
- ✅ Make sure project is fully provisioned

### Authentication Failed
- ✅ Verify username and password are correct
- ✅ Check if password has special characters (may need URL encoding)

### SSL Error
- ✅ Make sure `sslmode=require` is in connection string
- ✅ Backend code already handles SSL automatically ✅

---

## Next Steps

After NeonDB is set up:

1. ✅ Copy connection details
2. ✅ Deploy backend to Render (see `QUICK_DEPLOY.md`)
3. ✅ Add connection details to Render environment variables
4. ✅ Run database migrations
5. ✅ Test your app!

---

## Useful Links

- **NeonDB Dashboard**: https://console.neon.tech
- **NeonDB Docs**: https://neon.tech/docs
- **Connection Guide**: https://neon.tech/docs/connect/connect-from-any-app
