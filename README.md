# 🪄 Wizard Connect

**World-Class Full-Stack Matchmaking Platform for Mapua Malayan Colleges Laguna**

A production-ready Valentine's Day matchmaking application built with clean architecture, featuring a smart compatibility algorithm, real-time messaging, and premium pixel-art UI.

---

## 🌟 Features

### For Students
- ✅ **Smart Matching Algorithm** - Personality, interests, values, and lifestyle compatibility scoring
- ✅ **Anonymous Crush List** - Submit up to 5 secret crushes with mutual match detection
- ✅ **Real-time Messaging** - Chat with your matches before Valentine's Day reveal
- ✅ **Privacy Controls** - Choose who sees your profile (public, matches only, private)
- ✅ **Pixel Art UI** - Beautiful retro gaming aesthetic with Mapua branding

### For Developers
- ✅ **Clean Architecture** - 4-layer separation (Domain, Application, Infrastructure, Interface)
- ✅ **Type-Safe** - Full TypeScript on frontend, strict typing on backend
- ✅ **Secure** - JWT auth, rate limiting, CORS, RLS, SQL injection prevention
- ✅ **Scalable** - Stateless design, connection pooling, horizontal scaling ready
- ✅ **Free Tier Hosting** - Deploy to Render + Vercel + Supabase at $0/month

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js 14    │     │   Go 1.21 API   │     │   Supabase DB  │
│   (Vercel)      │◄────┤   (Render)      │◄────┤   PostgreSQL    │
│   TypeScript    │     │   Clean Arch    │     │   + Auth        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS | UI & UX |
| **Backend** | Go 1.21, Gin, Clean Architecture | API & Business Logic |
| **Database** | PostgreSQL (Supabase) | Data & Auth |
| **Hosting** | Vercel (Frontend) + Render (Backend) | Free Tier Deployment |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Go** 1.21+
- **Supabase** account (free)
- **GitHub** account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wizardconnect
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `wizard-connect-backend/supabase/migrations/001_initial_schema.sql`
3. Get your credentials:
   - Project URL
   - anon/public key
   - JWT Secret (Settings → API)

### 3. Backend Setup

```bash
cd wizard-connect-backend

# Install dependencies
go mod download

# Create environment file
cp .env.example .env

# Edit .env with your Supabase credentials
nano .env
```

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
DB_PASSWORD=your-db-password
JWT_SECRET=generate-strong-secret
FRONTEND_URL=http://localhost:3000
```

```bash
# Run backend
make run
# or
go run cmd/api/main.go
```

Backend will run on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd wizard-connect

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local
nano .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8080
```

```bash
# Run frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📁 Project Structure

```
wizardconnect/
├── wizard-connect/              # Next.js Frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── (dashboard)/    # Protected routes
│   │   │   ├── login/          # Authentication
│   │   │   └── layout.tsx      # Root layout
│   │   ├── components/         # React components
│   │   │   ├── effects/        # Parallax, particles
│   │   │   ├── features/       # Feature components
│   │   │   └── auth/           # Auth components
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx # Auth provider
│   │   ├── lib/                # Utilities
│   │   │   ├── api-client.ts   # Backend API client
│   │   │   └── supabase.ts     # Supabase client
│   │   └── types/              # TypeScript types
│   │       └── api.ts          # Shared API types
│   ├── package.json
│   └── vercel.json             # Vercel config
│
├── wizard-connect-backend/      # Go Backend
│   ├── cmd/
│   │   └── api/main.go         # Application entry
│   ├── internal/
│   │   ├── application/        # Use cases
│   │   ├── config/             # Configuration
│   │   ├── domain/             # Business logic
│   │   │   ├── entities/       # Domain entities
│   │   │   ├── repositories/   # Repository interfaces
│   │   │   └── services/       # Domain services
│   │   ├── infrastructure/     # External concerns
│   │   │   ├── database/       # Repository implementations
│   │   │   └── supabase/       # Supabase client
│   │   └── interface/          # HTTP layer
│   │       └── http/
│   │           ├── controllers/# Request handlers
│   │           ├── middleware/ # Auth, CORS, rate limit
│   │           └── routes/     # Route definitions
│   ├── supabase/migrations/    # SQL migrations
│   ├── go.mod
│   ├── Dockerfile
│   ├── Makefile
│   └── render.yaml             # Render config
│
├── DEPLOYMENT.md                # Deployment guide
├── ARCHITECTURE.md              # Architecture docs
└── README.md                    # This file
```

---

## 🔐 Security Features

- **Authentication**: JWT tokens via Supabase Auth
- **Authorization**: Row Level Security (RLS) in PostgreSQL
- **Rate Limiting**: 100 requests/second per user
- **CORS Protection**: Configurable allowed origins
- **SQL Injection**: Prepared statements everywhere
- **XSS Protection**: React auto-escaping
- **Password Security**: Hashed by Supabase Auth
- **Environment Variables**: Encrypted at rest

---

## 📊 Matching Algorithm

The compatibility score is calculated as:

```
Score = (Personality × 30%) +
        (Interests × 25%) +
        (Values × 25%) +
        (Lifestyle × 10%) +
        (Mutual Crush × 10%)
```

- **Personality**: MBTI type compatibility matrix
- **Interests**: Percentage of shared interests
- **Values**: Alignment on core values
- **Lifestyle**: Similar lifestyle preferences
- **Mutual Crush**: Bonus if both listed each other

---

## 🛠️ Development

### Frontend

```bash
cd wizard-connect

# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint
```

### Backend

```bash
cd wizard-connect-backend

# Development
make run

# Build
make build

# Test
make test

# Format
make fmt

# Clean
make clean
```

---

## 🚢 Deployment

### Automated Deployment

**Frontend (Vercel)**
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Auto-deploys on push to main

**Backend (Render)**
1. Connect GitHub repository to Render
2. Set environment variables
3. Auto-deploys on push to main

**Database (Supabase)**
- Runs on Supabase infrastructure
- Automatic backups
- 99.9% uptime SLA

### Manual Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

---

## 📖 API Documentation

### Base URL
- Development: `http://localhost:8080`
- Production: `https://wizard-connect-api.onrender.com`

### Endpoints

#### Authentication (Supabase)
- `POST /auth/v1/signup` - Register
- `POST /auth/v1/token?grant_type=password` - Login
- `POST /auth/v1/oauth` - OAuth (Google)

#### Users
- `GET /api/v1/users/me` - Get profile
- `PUT /api/v1/users/me` - Update profile

#### Survey
- `GET /api/v1/surveys` - Get responses
- `POST /api/v1/surveys` - Submit survey

#### Matches
- `GET /api/v1/matches` - Get matches
- `POST /api/v1/matches/generate` - Generate matches

#### Messages
- `GET /api/v1/messages/conversations` - Get conversations
- `GET /api/v1/messages/conversations/:id` - Get messages
- `POST /api/v1/messages/conversations/:id/messages` - Send message

#### Crushes
- `GET /api/v1/crushes` - Get crush list
- `POST /api/v1/crushes` - Submit crushes

---

## 🧪 Testing

### Backend Tests

```bash
cd wizard-connect-backend
go test ./...
```

### Frontend Tests

```bash
cd wizard-connect
npm test
```

---

## 📈 Monitoring

### Backend (Render)
- Logs in Render dashboard
- Health check: `/health`
- Metrics: CPU, memory, response times

### Frontend (Vercel)
- Analytics in Vercel dashboard
- Runtime logs
- Deployment previews

### Database (Supabase)
- Database logs in Supabase dashboard
- Auth logs
- Query performance insights

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- **Mapua Malayan Colleges Laguna** - Our home institution
- **Supabase** - Amazing backend-as-a-service
- **Vercel** - Excellent Next.js hosting
- **Render** - Great Go hosting
- **Next.js Team** - Incredible framework

---

## 📞 Support

For issues, questions, or contributions:
- Open a GitHub issue
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help

---

**Built with ❤️ for Mapua students**

*Find your magic this Valentine's Day! 🪄💕*
