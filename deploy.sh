#!/bin/bash

echo "🚀 Starting Deployment Process..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

echo -e "${BLUE}Generated Secrets:${NC}"
echo "JWT_SECRET: $JWT_SECRET"
echo "JWT_REFRESH_SECRET: $JWT_REFRESH_SECRET"
echo ""

# Save secrets to file
cat > .deployment-secrets.txt << EOF
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
EOF

echo -e "${GREEN}✅ Secrets saved to .deployment-secrets.txt${NC}"
echo ""

# Deploy Frontend to Vercel
echo -e "${BLUE}📦 Deploying Frontend to Vercel...${NC}"
cd frontend

# Check if .env.production exists, if not create it
if [ ! -f .env.production ]; then
    echo "VITE_API_URL=https://milestone-backend.onrender.com/api" > .env.production
    echo -e "${GREEN}✅ Created .env.production${NC}"
fi

# Deploy to Vercel
vercel --prod --yes

cd ..

echo ""
echo -e "${GREEN}✅ Frontend deployment initiated!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Backend deployment requires manual steps:${NC}"
echo ""
echo "1. Go to https://render.com and sign in with GitHub"
echo "2. Create a PostgreSQL database:"
echo "   - Name: milestone-db"
echo "   - Database: milestone_english"
echo "   - Plan: Free"
echo ""
echo "3. Create a Web Service:"
echo "   - Connect repo: milestone-english-pwa"
echo "   - Root Directory: backend"
echo "   - Build: npm install"
echo "   - Start: npm start"
echo ""
echo "4. Add these environment variables:"
echo "   NODE_ENV=production"
echo "   DB_HOST=<from-postgres-connection>"
echo "   DB_PORT=5432"
echo "   DB_NAME=milestone_english"
echo "   DB_USER=<from-postgres-connection>"
echo "   DB_PASSWORD=<from-postgres-connection>"
echo "   JWT_SECRET=$JWT_SECRET"
echo "   JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"
echo "   FRONTEND_URL=<your-vercel-url>"
echo ""
echo "5. After backend deploys, update FRONTEND_URL with your Vercel URL"
echo ""
echo -e "${GREEN}Check .deployment-secrets.txt for your JWT secrets${NC}"
