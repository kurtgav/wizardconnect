#!/bin/bash

# Wizard Connect - Quick Start Script
# This script helps you set up and run the full-stack application

set -e

echo "🪄 Wizard Connect - Quick Start"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go is not installed${NC}"
    echo "Please install Go from https://golang.org/"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Ask for Supabase credentials
echo "Please enter your Supabase credentials:"
echo "Get these from https://supabase.com/dashboard → Project Settings → API"
echo ""

read -p "Supabase URL (e.g., https://xxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Supabase JWT Secret: " SUPABASE_JWT_SECRET
read -sp "Database Password: " DB_PASSWORD
echo ""
read -p "Generate JWT Secret (press Enter to auto-generate): " JWT_SECRET

if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT Secret: $JWT_SECRET"
fi

echo ""
echo -e "${YELLOW}Setting up backend...${NC}"

# Backend setup
cd wizard-connect-backend

# Create .env file
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

# Install Go dependencies
echo "Installing Go dependencies..."
go mod download
echo -e "${GREEN}✅ Go dependencies installed${NC}"

# Build backend
echo "Building backend..."
go build -o bin/api ./cmd/api
echo -e "${GREEN}✅ Backend built${NC}"

cd ..

echo ""
echo -e "${YELLOW}Setting up frontend...${NC}"

# Frontend setup
cd wizard-connect

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF

echo -e "${GREEN}✅ Frontend .env.local created${NC}"

# Install npm dependencies
echo "Installing npm dependencies..."
npm install
echo -e "${GREEN}✅ NPM dependencies installed${NC}"

cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend:"
echo -e "   ${YELLOW}cd wizard-connect-backend && make run${NC}"
echo ""
echo "2. Start Frontend (new terminal):"
echo -e "   ${YELLOW}cd wizard-connect && npm run dev${NC}"
echo ""
echo "3. Open browser:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "⚠️  Make sure to run the Supabase migration first:"
echo "   Go to Supabase SQL Editor and run:"
echo -e "   ${YELLOW}wizard-connect-backend/supabase/migrations/001_initial_schema.sql${NC}"
echo ""
echo "Happy matching! 💕"
