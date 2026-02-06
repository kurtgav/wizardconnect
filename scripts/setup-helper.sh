#!/bin/bash

# Wizard Connect - Setup Helper
# This script helps you set up environment files

set -e

echo "🪄 Wizard Connect - Setup Helper"
echo "================================="
echo ""

# Check if we're in the right directory
if [ ! -d "wizard-connect" ] || [ ! -d "wizard-connect-backend" ]; then
    echo "❌ Error: Please run this script from the wizardconnect directory"
    echo "   cd /Users/hoon/Desktop/wizardconnect"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This script will help you set up your environment files${NC}"
echo ""
echo "You'll need your Supabase credentials:"
echo "  1. Project URL"
echo "  2. anon/public key"
echo "  3. JWT Secret"
echo "  4. Database Password"
echo ""
echo "Get these from: Supabase Dashboard → Settings → API"
echo ""
read -p "Press Enter when you have your credentials ready..."

echo ""
echo "=== BACKEND SETUP ==="
echo ""

# Backend setup
cd wizard-connect-backend

if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    read -p "Overwrite? (y/N): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Skipping backend setup..."
        cd ..
    else
        rm .env
    fi
fi

if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    echo ""

    read -p "Supabase URL (e.g., https://xxx.supabase.co): " SUPABASE_URL
    read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
    read -p "Supabase JWT Secret: " SUPABASE_JWT_SECRET
    read -sp "Database Password: " DB_PASSWORD
    echo ""
    read -p "JWT Secret (press Enter to auto-generate): " JWT_SECRET

    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change-this-secret-in-production")
    fi

    cat > .env << EOF
SERVER_PORT=8080
ENVIRONMENT=development
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_JWT_SECRET=$SUPABASE_JWT_SECRET
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=http://localhost:3000
EOF

    echo -e "${GREEN}✅ Backend .env created${NC}"
fi

cd ..

echo ""
echo "=== FRONTEND SETUP ==="
echo ""

cd wizard-connect

if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local file already exists${NC}"
    read -p "Overwrite? (y/N): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Skipping frontend setup..."
        cd ..
    else
        rm .env.local
    fi
fi

if [ ! -f .env.local ]; then
    echo "Creating frontend .env.local file..."
    echo ""

    if [ -z "$SUPABASE_URL" ]; then
        read -p "Supabase URL (e.g., https://xxx.supabase.co): " SUPABASE_URL
        read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
    fi

    cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF

    echo -e "${GREEN}✅ Frontend .env.local created${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. 📊 Run the Supabase SQL migration:"
echo "   - Go to Supabase Dashboard → SQL Editor"
echo "   - Open: wizard-connect-backend/supabase/migrations/001_initial_schema.sql"
echo "   - Click Run ▶️"
echo ""
echo "2. 🚀 Start the backend (Terminal 1):"
echo "   cd wizard-connect-backend"
echo "   go run cmd/api/main.go"
echo ""
echo "3. 🎨 Start the frontend (Terminal 2):"
echo "   cd wizard-connect"
echo "   npm run dev"
echo ""
echo "4. 🌐 Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "Happy matching! 💕"
