# ⚡ Wizard Connect - Quick Start

## 🎯 3 Commands to Run

### 1️⃣ Setup (One Time)
```bash
cd /Users/hoon/Desktop/wizardconnect
./setup-helper.sh
```
This will help you create the `.env` files with your Supabase credentials.

### 2️⃣ Start Backend (Terminal 1)
```bash
cd wizard-connect-backend
go run cmd/api/main.go
```
Backend runs on → **http://localhost:8080**

### 3️⃣ Start Frontend (Terminal 2)
```bash
cd wizard-connect
npm run dev
```
Frontend runs on → **http://localhost:3000**

---

## 📋 Before You Start

### Get Your Supabase Credentials:
1. Go to https://supabase.com
2. Create new project
3. Go to **Settings** → **API**
4. Copy:
   - Project URL
   - anon/public key
   - JWT Secret
5. Go to **SQL Editor**
6. Run the SQL migration: `wizard-connect-backend/supabase/migrations/001_initial_schema.sql`

---

## 🌐 Once Running

**Open:** http://localhost:3000

**Test It:**
1. Sign up for an account
2. Complete the survey
3. Generate matches
4. Send messages

---

## 🛑 To Stop

Press `Ctrl+C` in both terminals.

---

## 🔄 To Restart

Just run the start commands again.

---

## 📖 Full Guides

- **SETUP_GUIDE.md** - Detailed setup instructions
- **VISUAL_GUIDE.md** - Architecture diagrams
- **README.md** - Complete documentation

---

**That's it! 3 commands and you're running! 🚀**
