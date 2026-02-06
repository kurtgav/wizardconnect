# Wizard Connect - Deployment Guide

Complete deployment guide for the Wizard Connect full-stack matchmaking platform.

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Next.js)     │◄────────┤   (Go API)      │
│   Vercel        │         │   Render        │
└────────┬────────┘         └────────┬────────┘
         │                          │
         │                          │
         └──────────┬───────────────┘
                    │
         ┌──────────▼─────────┐
         │     Supabase       │
         │  Database & Auth   │
         └────────────────────┘
```

## Prerequisites

- GitHub account
- Supabase account (free tier)
- Render account (free tier)
- Vercel account (free tier)
- Go 1.21+ installed locally
- Node.js 18+ installed locally

## Deployment Steps

### 1. Supabase Setup (Database & Auth)

1. **Create a new project**
   - Go to https://supabase.com
   - Click "New Project"
   - Set organization and project name
   - Set a strong database password
   - Wait for project to be provisioned (~2 minutes)

2. **Get your credentials**
   - Go to Project Settings → API
   - Copy:
     - Project URL
     - anon/public key
     - JWT Secret (from Settings → API → JWT Secret)

3. **Run database migrations**
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the SQL from `wizard-connect-backend/supabase/migrations/001_initial_schema.sql`

4. **Configure Google OAuth** (Optional but recommended)
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your redirect URL: `https://your-frontend.vercel.app/auth/callback`
   - Save changes

### 2. Backend Deployment (Render)

1. **Prepare your repository**
   ```bash
   cd wizard-connect-backend
   git add .
   git commit -m "Add Go backend"
   git push
   ```

2. **Create Render Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `wizard-connect-backend` folder

3. **Configure settings**
   - **Name**: `wizard-connect-api`
   - **Runtime**: `Go`
   - **Build Command**: `go build -o bin/api ./cmd/api`
   - **Start Command**: `./bin/api`

4. **Add Environment Variables**
   ```env
   ENVIRONMENT=production
   SERVER_PORT=8080
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   DB_PASSWORD=your-db-password
   JWT_SECRET=generate-strong-random-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your API URL (e.g., `https://wizard-connect-api.onrender.com`)

### 3. Frontend Deployment (Vercel)

1. **Prepare frontend repository**
   ```bash
   cd wizard-connect
   npm install
   npm run build
   ```

2. **Create local environment file**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://wizard-connect-api.onrender.com
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select `wizard-connect` folder

4. **Configure environment variables**
   In Vercel project settings, add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://wizard-connect-api.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL

### 4. Update CORS Configuration

1. **Update Backend CORS**
   - Go to Render dashboard
   - Edit Environment Variables
   - Update `FRONTEND_URL` to your actual Vercel URL
   - Trigger a new deployment

2. **Update Supabase Redirect URLs**
   - Go to Supabase → Authentication → URL Configuration
   - Add your Vercel URL to:
     - Allowed Redirect URLs
     - Redirect URLs

### 5. Test the Deployment

1. **Check Backend Health**
   ```bash
   curl https://wizard-connect-api.onrender.com/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "time": "2024-02-06T..."
   }
   ```

2. **Check Frontend**
   - Open your Vercel URL
   - Verify all pages load correctly
   - Check browser console for errors

3. **Test Authentication Flow**
   - Try signing up/logging in
   - Verify Supabase auth works
   - Check that JWT tokens are stored

4. **Test API Integration**
   - Create a test user
   - Submit a survey
   - Generate matches
   - Verify all endpoints work

## Free Tier Limitations

### Render Free Tier
- ✅ 750 hours/month of runtime
- ✅ 512 MB RAM
- ✅ Shared CPU
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start takes ~30 seconds

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Serverless functions

### Supabase Free Tier
- ✅ 500 MB database storage
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth/month
- ⚠️ Database pauses after 1 week of inactivity

## Monitoring & Maintenance

### Backend (Render)
- **Logs**: Available in Render dashboard
- **Metrics**: CPU, memory, response times
- **Health Checks**: Automatic at `/health`

### Frontend (Vercel)
- **Analytics**: Built-in analytics
- **Logs**: Runtime logs in dashboard
- **Deployments**: Automatic on git push

### Database (Supabase)
- **Database Logs**: Available in dashboard
- **Auth Logs**: Track sign-ins/sign-ups
- **Storage**: Monitor file storage usage

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure `FRONTEND_URL` in backend matches your Vercel URL
- Check Vercel deployment URL matches exactly (including https://)

**2. Authentication Fails**
- Verify Supabase URL and keys are correct
- Check redirect URLs in Supabase settings
- Ensure Google OAuth is configured (if using)

**3. API Timeout**
- Render free tier spins down after inactivity
- First request after spin-down may take 30 seconds
- Consider implementing keep-alive pings

**4. Database Connection Errors**
- Verify `DB_PASSWORD` is correct
- Check Supabase project is active (not paused)
- Ensure database URL format is correct

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, random secrets
   - Rotate secrets periodically

2. **API Security**
   - Enable rate limiting
   - Validate all inputs
   - Use HTTPS everywhere

3. **Database Security**
   - Enable Row Level Security (RLS)
   - Use service role keys only server-side
   - Regular backups

4. **Auth Security**
   - Require email verification
   - Implement password strength requirements
   - Enable 2FA (available in Supabase Pro)

## Scaling Beyond Free Tier

When you're ready to scale:

### Backend (Render)
- **Starter ($7/month)**: Keeps service always on
- **Pro ($25/month)**: Better performance, more RAM

### Database (Supabase)
- **Pro ($25/month)**: 8GB storage, 100K MAU
- **Team ($599/month)**: Unlimited projects, priority support

### Frontend (Vercel)
- **Pro ($20/month)**: More bandwidth, team features
- **Enterprise**: Custom solutions

## Post-Deployment Checklist

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] Sign up/login works
- [ ] Survey submission works
- [ ] Match generation works
- [ ] Messaging works
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] Error tracking set up
- [ ] Backups enabled
- [ ] Domain configured (optional)

## Support

For issues or questions:
- Backend: Check `wizard-connect-backend/README.md`
- Frontend: Check main `README.md`
- Issues: Open a GitHub issue

## Next Steps

1. Set up custom domains (optional)
2. Configure analytics (Google Analytics, Plausible)
3. Set up error tracking (Sentry)
4. Add logging (Logtail, Datadog)
5. Set up CI/CD pipelines
6. Configure automated backups
7. Add monitoring alerts
