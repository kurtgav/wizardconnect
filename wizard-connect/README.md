# 🪄 Wizard Connect

**Mapua Malayan Colleges Laguna's Official Valentine's Day Matchmaking Platform**

A pixel-art themed matchmaking application that helps Mapua students find their perfect matches based on personality, values, interests, and lifestyle compatibility.

![Wizard Connect](https://img.shields.io/badge/Mapua-Malayan%20Colleges%20Laguna-red)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Features

- **🎨 Pixel Art UI/UX** - Beautiful retro 8-bit/16-bit themed interface with Mapua's red and blue colors
- **🎯 Smart Matching Algorithm** - Advanced compatibility scoring using Hungarian algorithm
- **💕 Crush List System** - Secretly admire up to 5 people with mutual crush bonuses
- **📝 Comprehensive Survey** - Multi-step survey covering demographics, personality, values, lifestyle, and interests
- **🔒 Privacy Focused** - User data protected with Supabase Row Level Security (RLS)
- **💬 Early Messaging** - Exclusive Feb 11-13 messaging period before Valentine's reveal
- **📱 Mobile Responsive** - Works perfectly on all devices

## 🗓️ Important Dates

| Date | Event |
|------|-------|
| **Feb 5** | Survey opens |
| **Feb 10 (11:59 PM)** | Survey closes |
| **Feb 11-13** | Profile updates & early messaging |
| **Feb 14** | 💕 Valentine's Day Match Reveal! |

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS with custom pixel art design system
- **State Management**: React Hooks + Local Storage
- **UI Components**: Custom pixel-art themed components

### Backend (Python Algorithm Service)
- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL)
- **Algorithm**: Scipy (Hungarian algorithm), NumPy
- **Authentication**: Supabase Auth (Google OAuth)

## 📁 Project Structure

```
wizard-connect/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/               # Google OAuth login
│   │   │   └── callback/            # OAuth callback handler
│   │   ├── (dashboard)/             # Protected routes
│   │   │   ├── survey/              # Multi-step survey
│   │   │   ├── profile/             # Profile management
│   │   │   ├── matches/             # Match results display
│   │   │   └── messages/            # Messaging system
│   │   ├── globals.css              # Pixel art design system
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   └── features/                # Feature-specific components
│   ├── lib/
│   │   ├── supabase/                # Supabase client setup
│   │   ├── surveyQuestions.ts       # Survey configuration
│   │   └── utils.ts                 # Utility functions
│   └── types/
│       └── index.ts                 # TypeScript definitions
├── algorithm-service/                # Python matching service
│   └── src/
│       ├── algorithm/
│       │   ├── scoring.py           # Compatibility scoring
│       │   └── matching.py          # Hungarian algorithm
│       └── main.py                  # FastAPI app
├── supabase/
│   └── schema.sql                   # Database schema
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (for algorithm service)
- Supabase account (free tier works!)
- Google Cloud Console account (for OAuth)

### 1. Clone & Install

```bash
# Navigate to project
cd wizard-connect

# Install frontend dependencies
npm install

# (Optional) Install algorithm service dependencies
cd algorithm-service
pip install -r requirements.txt
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Google OAuth in Authentication → Providers → Google
4. Copy your project URL and anon key

### 3. Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
# Start Next.js frontend
npm run dev

# (Optional) Start algorithm service
cd algorithm-service
python src/main.py
```

Visit [http://localhost:3000](http://localhost:3000) to see the application!

## 🎨 Pixel Art Design System

The application uses a custom pixel art design system with Mapua's colors:

### Colors
- **Mapua Red**: `#D32F2F`
- **Mapua Blue**: `#1976D2`
- **Background**: `#FFF8F0` (cream)
- **Pixel Borders**: `#000000` (black)

### Components
- `.pixel-card` - Card with pixel shadow
- `.pixel-btn` - Retro button style
- `.pixel-input` - Pixel-bordered input
- `.pixel-progress-container` - Chunky progress bar
- `.pixel-badge` - Small badge component

### Animations
- `.pixel-bounce` - Bouncing animation
- `.pixel-pulse` - Pulsing glow
- `.pixel-glow` - Glowing shadow effect

## 📊 Matching Algorithm

Our matching algorithm uses multiple factors:

### Scoring Categories
1. **Demographics (10%)** - Year, major similarity
2. **Personality (30%)** - Cosine similarity on personality vectors
3. **Values (25%)** - Alignment on family, career, religion, politics
4. **Lifestyle (20%)** - Study habits, weekend preferences, cleanliness
5. **Interests (15%)** - Jaccard similarity on shared hobbies

### Bonuses
- **Mutual Crush**: +20% compatibility boost
- **One-way Crush**: +10% compatibility boost

### Algorithm
- Uses Hungarian algorithm for optimal matching
- Generates 7 matches per user
- Respects gender preferences
- Groups users by preference pools

## 🔐 Security

- **Row Level Security (RLS)** on all Supabase tables
- **JWT Authentication** via Supabase Auth
- **Input Validation** on all forms
- **CORS Protection** configured
- **Environment Variables** for secrets

## 📱 What's Built

✅ Landing page with pixel art hero and countdown
✅ Login page (ready for Google OAuth integration)
✅ Multi-step survey system with 20+ questions
✅ Profile management with pixel art avatars
✅ Matches display with compatibility scores
✅ Messaging interface (Feb 11-13 feature)
✅ Supabase database schema with RLS
✅ Python matching algorithm service
✅ Complete pixel art design system

## 🎓 Acknowledgments

- Mapua Malayan Colleges Laguna
- Supabase for the amazing backend platform
- Next.js team for the excellent framework
- All contributors and testers

---

Made with 💕 for Mapua Cardinals

**Wizard Connect** - Find Your Perfect Match! 🪄
