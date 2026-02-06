# 🎯 Wizard Connect - Visual Setup Guide

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR BROWSER                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Frontend (Next.js)                              │  │
│  │       http://localhost:3000                           │  │
│  │                                                        │  │
│  │  • Landing page                                       │  │
│  │  • Login/Signup                                       │  │
│  │  • Survey form                                        │  │
│  │  • Profile management                                 │  │
│  │  • Match display                                      │  │
│  │  • Messaging interface                                │  │
│  └───────────────────────┬──────────────────────────────┘  │
│                          │ API Calls                      │
└──────────────────────────┼─────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Go + Gin)                         │
│              http://localhost:8080                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Authentication (JWT)                              │  │
│  │  • User Management                                   │  │
│  │  • Survey Processing                                 │  │
│  │  • Matching Algorithm                                │  │
│  │  • Message Handling                                  │  │
│  │  • Crush List                                        │  │
│  └───────────────────────┬──────────────────────────────┘  │
│                          │                                 │
└──────────────────────────┼─────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase (Cloud)                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                 │  │
│  │                                                      │  │
│  │  • users                                             │  │
│  │  • surveys                                           │  │
│  │  • matches                                           │  │
│  │  • crushes                                           │  │
│  │  • conversations                                     │  │
│  │  • messages                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication Service                               │  │
│  │                                                      │  │
│  │  • Email/Password                                    │  │
│  │  • Google OAuth                                      │  │
│  │  • JWT Tokens                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Flow Diagram

```
START
  │
  ▼
┌─────────────────┐
│ Create Supabase │
│   Project       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Run SQL         │
│ Migration       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Setup Backend   │
│ (.env file)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Setup Frontend  │
│ (.env.local)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Start Backend   │
│ (Terminal 1)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Start Frontend  │
│ (Terminal 2)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Open Browser    │
│ localhost:3000  │
└────────┬────────┘
         │
         ▼
      SUCCESS! 🎉
```

---

## 📝 Terminal Setup

### Terminal 1: Backend
```bash
# Navigate to backend
cd /Users/hoon/Desktop/wizardconnect/wizard-connect-backend

# Create .env file (or run setup helper)
nano .env

# Add your Supabase credentials:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_JWT_SECRET=your-jwt-secret
# DB_PASSWORD=your-db-password
# JWT_SECRET=your-jwt-secret
# FRONTEND_URL=http://localhost:3000

# Start backend
go run cmd/api/main.go
```

**Expected output:**
```
Server starting on port 8080
```

### Terminal 2: Frontend
```bash
# Navigate to frontend
cd /Users/hoon/Desktop/wizardconnect/wizard-connect

# Create .env.local file
nano .env.local

# Add your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Start frontend
npm run dev
```

**Expected output:**
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

---

## 🎮 Testing the Application

### 1. Open Browser
```
http://localhost:3000
```

### 2. Test Authentication
- Click "Sign Up"
- Enter email and password
- Or click "Continue with Google"

### 3. Complete Survey
- Go to Survey page
- Answer personality questions
- Select interests and values
- Submit survey

### 4. View/Edit Profile
- Go to Profile page
- Update your information
- Set privacy preferences

### 5. Generate Matches
- Go to Matches page
- Click "Generate Matches"
- View compatibility scores
- See match rankings

### 6. Send Messages
- Go to Messages page
- Select a conversation
- Send a message

---

## 🐛 Common Issues & Solutions

### Issue: "Connection refused"
**Solution**: Make sure both backend and frontend are running

### Issue: "Invalid JWT"
**Solution**: Check your SUPABASE_JWT_SECRET is correct

### Issue: "Database error"
**Solution**: Make sure you ran the SQL migration in Supabase

### Issue: "Port already in use"
**Solution**: Kill the process using the port
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 📊 File Structure After Setup

```
wizardconnect/
├── wizard-connect-backend/          # Go Backend
│   ├── .env                        # ✅ You create this
│   ├── cmd/api/main.go             # Entry point
│   ├── internal/                   # Source code
│   ├── supabase/migrations/        # SQL files
│   └── go.mod                      # Go dependencies
│
├── wizard-connect/                 # Next.js Frontend
│   ├── .env.local                  # ✅ You create this
│   ├── src/                        # Source code
│   │   ├── app/                    # Pages
│   │   ├── components/             # React components
│   │   ├── contexts/               # Auth context
│   │   └── lib/                    # Utilities
│   └── package.json                # NPM dependencies
│
├── SETUP_GUIDE.md                  # ✅ This guide
├── setup-helper.sh                 # ✅ Setup script
└── README.md                       # Full documentation
```

---

## ✅ Setup Checklist

Use this checklist to track your progress:

- [ ] Created Supabase account
- [ ] Created new Supabase project
- [ ] Copied Supabase credentials (URL, key, secret)
- [ ] Ran SQL migration in Supabase
- [ ] Created backend `.env` file with credentials
- [ ] Created frontend `.env.local` file with credentials
- [ ] Started backend server (Terminal 1)
- [ ] Started frontend server (Terminal 2)
- [ ] Opened browser to http://localhost:3000
- [ ] Tested sign up / login
- [ ] Tested survey submission
- [ ] Tested match generation
- [ ] Tested messaging

**All checked?** 🎉 **You're all set!**

---

## 🎓 Learning Resources

- **Backend Clean Architecture**: See `ARCHITECTURE.md`
- **API Endpoints**: See `README.md` → API Documentation
- **Database Schema**: See `supabase/migrations/001_initial_schema.sql`
- **Matching Algorithm**: See `internal/domain/services/matching.go`

---

## 💡 Pro Tips

1. **Keep both terminals open** when developing
2. **Use Google Chrome DevTools** to inspect the app
3. **Check browser console** for errors
4. **Monitor backend terminal** for API requests
5. **Test with multiple users** to see matching in action
6. **Save your credentials** somewhere safe

---

**Need help?** Check `README.md` or open a GitHub issue! 🚀
