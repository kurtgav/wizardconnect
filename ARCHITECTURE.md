# Wizard Connect - Full Stack Architecture

## World-Class Production Architecture

This document outlines the complete architecture of the Wizard Connect platform, built with industry best practices and clean architecture principles.

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Next.js 14 Frontend (Vercel)                 │  │
│  │  - React Server Components                          │  │
│  │  - TypeScript 5                                      │  │
│  │  - TailwindCSS                                       │  │
│  │  - Pixel Art UI                                      │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │         API Client Layer                             │  │
│  │  - Type-safe API calls                               │  │
│  │  - JWT token management                              │  │
│  │  - Error handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Go Backend API (Render Hosting)                │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  HTTP Layer (Gin Framework)                  │   │  │
│  │  │  - Controllers                               │   │  │
│  │  │  - Routes                                    │   │  │
│  │  │  - Middleware (Auth, CORS, Rate Limit)       │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  Application Layer                           │   │  │
│  │  │  - Use Cases                                 │   │  │
│  │  │  - DTOs                                      │   │  │
│  │  │  - Business Logic                            │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  Domain Layer                                │   │  │
│  │  │  - Entities (User, Match, Message, etc.)     │   │  │
│  │  │  - Repository Interfaces                     │   │  │
│  │  │  - Domain Services (Matching Algorithm)      │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  Infrastructure Layer                        │   │  │
│  │  │  - Repository Implementations                │   │  │
│  │  │  - Database (PostgreSQL)                     │   │  │
│  │  │  - External APIs                             │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Supabase (PostgreSQL)                       │  │
│  │                                                        │  │
│  │  Tables:                                              │  │
│  │  - users (profiles, visibility, contact info)        │  │
│  │  - surveys (responses, personality, interests)       │  │
│  │  - crushes (anonymous crush list)                    │  │
│  │  - matches (compatibility scores, rankings)          │  │
│  │  - conversations (chat threads)                      │  │
│  │  - messages (individual messages)                    │  │
│  │                                                        │  │
│  │  Features:                                            │  │
│  │  - Row Level Security (RLS)                          │  │
│  │  - Realtime subscriptions                           │  │
│  │  - JWT authentication                               │  │
│  │  - OAuth (Google, Email)                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Principles

### 1. Clean Architecture
- **Domain Layer**: Core business logic, independent of frameworks
- **Application Layer**: Use cases and application-specific business rules
- **Infrastructure Layer**: External concerns (database, APIs)
- **Interface Layer**: HTTP controllers, routes, middleware

### 2. Separation of Concerns
- Each layer has a single responsibility
- Dependencies point inward (toward the domain)
- Outer layers can be changed without affecting inner layers

### 3. Dependency Inversion
- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces)
- Interfaces defined in the domain layer

### 4. SOLID Principles
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

---

## 🔒 Security Architecture

### Authentication Flow
```
1. User signs in via Supabase Auth (Google OAuth or Email/Password)
2. Supabase returns JWT token
3. Frontend stores token in localStorage
4. All API requests include token in Authorization header
5. Backend validates token on each request
6. Protected endpoints return 401 if token invalid
```

### Authorization
- **Row Level Security (RLS)** in Supabase
  - Users can only see their own data
  - Matches can see each other's profiles
  - Privacy settings enforced at DB level
- **JWT Claims**: User ID, email, role
- **Middleware**: Auth middleware checks token validity

### Security Features
✅ JWT authentication with Supabase
✅ Rate limiting (100 req/s, burst 200)
✅ CORS protection
✅ SQL injection prevention (prepared statements)
✅ XSS protection (React escaping)
✅ CSRF protection (SameSite cookies)
✅ Input validation on all endpoints
✅ Environment variable encryption
✅ HTTPS only in production

---

## 📊 Database Schema

### Core Tables

#### `users`
- Profile information (name, bio, avatar)
- Contact preferences (email, phone, Instagram)
- Privacy settings (public, matches_only, private)
- Academic info (year, major)

#### `surveys`
- User responses (JSONB)
- Personality type (MBTI-based)
- Interests array
- Values array
- Lifestyle preferences

#### `matches`
- Compatibility score (0-100)
- Ranking (1-7)
- Mutual crush flag
- Generated by matching algorithm

#### `crushes`
- Anonymous crush submissions
- Email of crush
- Priority ranking (1-5)

#### `conversations`
- Chat threads between matched users
- Last message preview
- Updated timestamp for sorting

#### `messages`
- Individual messages
- Read/unread status
- Real-time updates

### Database Features
- **Indexes**: Fast lookups on user_id, compatibility_score
- **Triggers**: Auto-update timestamps
- **Views**: matches_with_details for easy queries
- **Constraints**: CHECK constraints for data integrity
- **RLS Policies**: Fine-grained access control

---

## 🔄 Matching Algorithm

### Compatibility Score Calculation

```
Total Score = (Personality × 0.30) +
              (Interests × 0.25) +
              (Values × 0.25) +
              (Lifestyle × 0.10) +
              (Mutual Crush × 0.10)
```

### Factors

1. **Personality Match (30%)**
   - MBTI compatibility matrix
   - Compatible types get 85-90%
   - Less compatible get 60%

2. **Interests Overlap (25%)**
   - Percentage of shared interests
   - Base 40% + overlap percentage

3. **Values Alignment (25%)**
   - Shared values
   - Base 30% + match percentage

4. **Lifestyle Compatibility (10%)**
   - Same lifestyle = 90%
   - Different = 60%

5. **Mutual Crush (10%)**
   - Both users listed each other
   - Bonus points applied

### Algorithm Complexity
- Time: O(n²) where n = number of users
- Space: O(n) for storing candidates
- Optimized with database indexes

---

## 🚀 Deployment Architecture

### Hosting (All Free Tier)

#### Frontend (Vercel)
- **Framework**: Next.js 14
- **Runtime**: Edge Network
- **Build**: Automatic on git push
- **Features**: CDN caching, automatic HTTPS, preview deployments

#### Backend (Render)
- **Runtime**: Go 1.21
- **Server**: Gin framework
- **Database**: PostgreSQL via Supabase
- **Features**: Health checks, auto-scaling, SSL

#### Database (Supabase)
- **Database**: PostgreSQL 15
- **Auth**: Supabase Auth
- **Storage**: 500 MB included
- **Features**: Realtime, RLS, automatic backups

---

## 📦 Project Structure

### Frontend (`wizard-connect/`)
```
src/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # Protected routes
│   │   ├── survey/
│   │   ├── profile/
│   │   ├── matches/
│   │   └── messages/
│   ├── api/                  # API routes (if needed)
│   └── page.tsx              # Landing page
├── components/
│   ├── effects/              # Parallax, particles, scanlines
│   ├── features/             # Survey form, match cards
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── api-client.ts         # Backend API client
│   └── supabase.ts           # Supabase client
└── types/
    └── api.ts                # TypeScript types
```

### Backend (`wizard-connect-backend/`)
```
cmd/
└── api/
    └── main.go               # Application entry point
internal/
├── application/              # Use cases, DTOs
├── config/                   # Configuration
├── domain/                   # Domain layer
│   ├── entities/             # Business entities
│   ├── repositories/         # Repository interfaces
│   └── services/             # Domain services
├── infrastructure/           # Infrastructure
│   ├── database/             # DB implementations
│   └── supabase/             # Supabase client
└── interface/                # External interfaces
    └── http/
        ├── controllers/      # HTTP handlers
        ├── middleware/       # Auth, CORS, rate limit
        └── routes/           # Route definitions
pkg/
└── utils/                    # Reusable utilities
```

---

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS
- **UI**: Custom pixel art components
- **State**: React hooks, Context
- **Auth**: Supabase Auth
- **Deployment**: Vercel

### Backend
- **Language**: Go 1.21
- **Framework**: Gin
- **Database**: PostgreSQL (Supabase)
- **Auth**: JWT (Supabase)
- **Rate Limiting**: golang.org/x/time/rate
- **Deployment**: Render

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel/Render automatic deployments
- **Environment**: .env files
- **Monitoring**: Built-in logs and metrics
- **Health Checks**: /health endpoint

---

## 📈 Performance Optimizations

### Frontend
- **Server Components**: Reduce client-side JavaScript
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Caching**: Vercel Edge Network
- **Lazy Loading**: Components loaded on demand

### Backend
- **Connection Pooling**: Reuse DB connections
- **Indexed Queries**: Fast lookups
- **Rate Limiting**: Prevent abuse
- **Context Timeouts**: Prevent hanging requests
- **Graceful Shutdown**: Clean connection close

### Database
- **Indexes**: On frequently queried columns
- **Views**: Pre-joined queries
- **RLS Policies**: Efficient at DB level
- **Connection Pooling**: Managed by Supabase

---

## 🧪 Testing Strategy

### Unit Tests
- Domain logic (matching algorithm)
- Use cases
- Utility functions

### Integration Tests
- API endpoints
- Database operations
- Auth flow

### E2E Tests
- User signup/login
- Survey submission
- Match generation
- Messaging

---

## 🔄 CI/CD Pipeline

### Frontend (Vercel)
1. Push to GitHub
2. Vercel webhook triggered
3. Run `npm run build`
4. Deploy to Edge Network
5. Automatic HTTPS

### Backend (Render)
1. Push to GitHub
2. Render webhook triggered
3. Run `go build`
4. Deploy to container
5. Health checks

---

## 📊 Monitoring & Observability

### Metrics to Track
- Response times
- Error rates
- Active users
- Database query performance
- API endpoint usage

### Logging
- Structured logs (JSON)
- Request/response logging
- Error stack traces
- Performance metrics

### Alerts
- High error rate
- Slow queries
- High memory usage
- Database connection issues

---

## 🛡️ Error Handling

### Frontend
- Try-catch boundaries
- Error boundaries (React)
- User-friendly error messages
- Automatic retry on network errors

### Backend
- Panic recovery middleware
- Custom error types
- Proper HTTP status codes
- Detailed error logging

---

## 📝 API Documentation

### Base URL
- Development: `http://localhost:8080`
- Production: `https://wizard-connect-api.onrender.com`

### Endpoints

#### Authentication (via Supabase)
- `POST /auth/v1/signup` - Register new user
- `POST /auth/v1/token?grant_type=password` - Sign in
- `POST /auth/v1/oauth` - OAuth login

#### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update profile

#### Survey
- `GET /api/v1/surveys` - Get survey responses
- `POST /api/v1/surveys` - Submit survey

#### Matches
- `GET /api/v1/matches` - Get user's matches
- `POST /api/v1/matches/generate` - Generate matches

#### Messages
- `GET /api/v1/messages/conversations` - Get conversations
- `GET /api/v1/messages/conversations/:id` - Get messages
- `POST /api/v1/messages/conversations/:id/messages` - Send message

#### Crushes
- `GET /api/v1/crushes` - Get crush list
- `POST /api/v1/crushes` - Submit crushes

---

## 🎨 UI/UX Design

### Design Principles
1. **Pixel Art Theme**: Retro gaming aesthetic
2. **Mapua Branding**: Red (#D32F2F) and Blue (#1976D2)
3. **Responsive**: Mobile-first approach
4. **Accessibility**: High contrast, readable fonts
5. **Performance**: Smooth animations, lazy loading

### UI Components
- Parallax backgrounds
- Particle effects (hearts, stars, mixed)
- Scanline effects
- Pixel fonts (Press Start 2P, VT323)
- Animated gradients
- Hover effects (lift, shine, ripple)

---

## 🚀 Next Steps for Production

1. **Testing**
   - Write comprehensive test suite
   - Load testing
   - Security audit

2. **Monitoring**
   - Set up error tracking (Sentry)
   - Analytics (Google Analytics)
   - Performance monitoring

3. **Scaling**
   - Upgrade to paid tiers when needed
   - Add caching layer (Redis)
   - Implement CDN for static assets

4. **Features**
   - Real-time messaging (Supabase Realtime)
   - Push notifications
   - Image upload
   - Advanced matching filters

---

## 📚 Resources

- [Backend README](wizard-connect-backend/README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Go Best Practices](https://go.dev/doc/effective_go)

---

Built with ❤️ using clean architecture and industry best practices.
