# 🚀 Wizard Connect - Setup & Run Guide

## 📋 Quick Overview

You have TWO projects:
1. **Backend** (Go API): `wizard-connect-backend/`
2. **Frontend** (Next.js): `wizard-connect/`

---

## ✅ Prerequisites Already Installed

- ✅ Node.js v22.14.0
- ✅ Go 1.25.6
- ✅ npm 10.9.2

---

## 🎯 5 Simple Steps to Run

### STEP 1: Set Up Supabase (5 minutes)

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: wizard-connect
   - **Password**: (save this!)
   - **Region**: Singapore
4. Wait for it to create (2-3 minutes)
5. Go to **Settings** → **API**
6. Copy these 3 things:
   - Project URL
   - anon/public key
   - JWT Secret

### STEP 2: Run Database Migration (2 minutes)

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of: `wizard-connect-backend/supabase/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click "Run" ▶️
6. You should see "Success. No rows returned"

### STEP 3: Set Up Backend (2 minutes)

Open your terminal and run:

```bash
cd /Users/hoon/Desktop/wizardconnect/wizard-connect-backend

# Create environment file
cat > .env << 'EOF'
SERVER_PORT=8080
ENVIRONMENT=development
SUPABASE_URL=YOUR_SUPABASE_URL_HERE
SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_JWT_SECRET=YOUR_JWT_SECRET_HERE
DB_PASSWORD=YOUR_DB_PASSWORD_HERE
JWT_SECRET=your-random-jwt-secret-here
FRONTEND_URL=http://localhost:3000
EOF
```

Now edit `.env` and replace:
- `YOUR_SUPABASE_URL_HERE` → Your actual Supabase URL
- `YOUR_ANON_KEY_HERE` → Your actual anon key
- `YOUR_JWT_SECRET_HERE` → Your actual JWT secret
- `YOUR_DB_PASSWORD_HERE` → Your database password
- `your-random-jwt-secret-here` → Generate a random secret (can use same as JWT_SECRET)

### STEP 4: Start Backend (1 command)

```bash
cd /Users/hoon/Desktop/wizardconnect/wizard-connect-backend

# Install Go dependencies
go mod download

# Start the backend
go run cmd/api/main.go
```

You should see:
```
Server starting on port 8080
```

**Keep this terminal open!** The backend is now running.

### STEP 5: Start Frontend (New Terminal)

Open a NEW terminal window and run:

```bash
cd /Users/hoon/Desktop/wizardconnect/wizard-connect

# Create environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF
```

Edit `.env.local` and replace:
- `YOUR_SUPABASE_URL_HERE` → Your actual Supabase URL
- `YOUR_ANON_KEY_HERE` → Your actual anon key

Then start the frontend:

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

---

## 🎉 You're Live!

Open your browser to: **http://localhost:3000**

You should see the Wizard Connect landing page!

---

## 🧪 Test It Out

1. **Go to**: http://localhost:3000
2. **Click**: "Sign Up" or "Continue with Google"
3. **Sign up**: Create an account
4. **Complete**: The survey
5. **View**: Your profile
6. **Generate**: Matches (click the button)
7. **Chat**: Send messages

---

## 🛑 How to Stop

**Backend**: Press `Ctrl+C` in the backend terminal
**Frontend**: Press `Ctrl+C` in the frontend terminal

To restart, just run the commands again from STEP 4 and STEP 5.

---

## 🐛 Troubleshooting

### Backend won't start?
- Make sure you replaced all placeholders in `.env`
- Check that port 8080 is not already in use
- Try: `lsof -i :8080` to see what's using the port

### Frontend won't start?
- Make sure you replaced placeholders in `.env.local`
- Check that port 3000 is not already in use
- Try: `rm -rf .next` then `npm run dev` again

### Database errors?
- Make sure you ran the SQL migration
- Check your Supabase credentials are correct
- Verify your Supabase project is active (not paused)

### Can't sign up?
- Make sure Supabase Auth is enabled
- Check email confirmation settings
- Try signing in with Google OAuth

---

## 📱 What You Can Do

Once running, you can:
- ✅ Sign up / Log in
- ✅ Complete the personality survey
- ✅ Edit your profile
- ✅ Generate matches (smart algorithm!)
- ✅ View compatibility scores
- ✅ Send messages to matches
- ✅ Submit anonymous crush list

---

## 🎨 Features Included

- **Smart Matching**: Personality + interests + values algorithm
- **Real-time Messaging**: Chat with matches instantly
- **Privacy Controls**: Public / Matches Only / Private
- **Pixel Art UI**: Beautiful retro gaming aesthetic
- **Mobile Responsive**: Works on all devices
- **Secure**: JWT auth, rate limiting, CORS

---

## 🚀 Next Steps

After you get it running:
1. Test all features
2. Create multiple test accounts
3. Try the matching algorithm
4. Send messages between accounts
5. Check out the pixel art effects!

---

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `ARCHITECTURE.md` - Technical details
- `DEPLOYMENT.md` - How to deploy to production

---

**Enjoy your full-stack matchmaking platform! 🪄💕**
