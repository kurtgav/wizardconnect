# Wizard Connect Valentine's 2026 Campaign Implementation Plan

## Table of Contents
1. [Current Status Overview](#current-status-overview)
2. [Missing Features](#missing-features)
3. [Implementation Steps](#implementation-steps)
4. [SQL Queries](#sql-queries)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Integration Points](#integration-points)

---

## Current Status Overview

### What's Working ✅

#### Database Schema
- **Campaigns table** exists with date fields: `survey_open_date`, `survey_close_date`, `profile_update_start_date`, `profile_update_end_date`, `results_release_date`
- **Matches table** has `campaign_id`, `user_a_viewed`, `user_b_viewed`, `user_a_contacted`, `user_b_contacted`, `messaging_unlocked` fields
- **Messages table** exists with `match_id`, `sender_id`, `recipient_id` structure
- **Users table** has profile fields: `first_name`, `last_name`, `bio`, `instagram`, `phone`, `gender`, `seeking_gender`, `year`, `major`, `profile_visibility`
- **RLS policies** are in place for tables
- **Initial Valentine's 2026 campaign** seeded with correct dates:
  - Survey: Feb 5-10, 2026
  - Profile Update: Feb 11-13, 2026
  - Results Release: Feb 14, 2026 (7:00 AM UTC)

#### Backend Infrastructure
- **Campaign repository** (`backend/internal/infrastructure/database/campaign_repository.go`) - CRUD operations
- **Campaign helper** (`backend/internal/infrastructure/database/campaign_helper.go`) - GetActiveCampaign function
- **Campaign controller** (`backend/internal/interface/http/controllers/campaign_controller.go`) - Full CRUD + statistics
- **User controller** (`backend/internal/interface/http/controllers/user_controller.go`) - Get/Update profile
- **Match controller** (`backend/internal/interface/http/controllers/match_controller.go`) - Get/Generate matches
- **Message controller** (`backend/internal/interface/http/controllers/message_controller.go`) - Messaging operations
- **Auth middleware** for authentication
- **Routes setup** (`backend/internal/interface/http/routes/routes.go`) - All endpoints registered

#### Frontend Components
- **CountdownTimer** component (`frontend/src/components/ui/CountdownTimer.tsx`) - Works but needs campaign integration
- **Profile page** (`frontend/src/app/(dashboard)/profile/page.tsx`) - Full edit/view functionality
- **Matches page** (`frontend/src/app/(dashboard)/matches/page.tsx`) - Match display grid
- **Messages page** (`frontend/src/app/(dashboard)/messages/page.tsx`) - Chat interface
- **Survey page** (`frontend/src/app/(dashboard)/survey/page.tsx`) - Survey form
- **API client** (`frontend/src/lib/api-client.ts`) - Backend communication
- **Supabase client** (`frontend/src/lib/supabase.ts`) - Direct DB access

---

## Missing Features

### 1. Profile Update Window Enforcement ⚠️
**Status**: Profile editing is always available, no date restrictions

**Requirements**:
- Allow profile edits ONLY during Feb 11-13, 2026
- Block profile edits outside this window
- Display countdown to profile update window (before Feb 11)
- Display countdown to profile update end (during Feb 11-13)
- Show "Profile update period ended" message after Feb 13

### 2. Messaging Unlock Period Enforcement ⚠️
**Status**: Messaging system exists but no date restrictions

**Requirements**:
- Allow messaging ONLY during Feb 11-13, 2026
- Block message sending outside this window
- Display countdown to messaging unlock (before Feb 11)
- Display countdown to messaging end (during Feb 11-13)
- Show "Messaging period ended" message after Feb 13
- Mark matches as `messaging_unlocked = true` during the period

### 3. Valentine's Day Match Reveal ⚠️
**Status**: Matches are visible immediately after generation

**Requirements**:
- Hide match details until Feb 14, 2026 (7:00 AM UTC)
- Show countdown to match reveal (before Feb 14)
- Show "Matches revealed!" message on/after Feb 14
- Show blurred placeholder for matches before reveal date
- Reveal matches gradually (animation) when date arrives

### 4. Campaign Date Enforcement Throughout App ⚠️
**Status**: No global campaign date awareness

**Requirements**:
- Fetch active campaign data on app initialization
- Store campaign dates in global state/context
- Display appropriate countdowns/banners on all pages
- Show current campaign phase status
- Block actions based on current phase

### 5. Survey Date Enforcement ⚠️
**Status**: Survey is always available

**Requirements**:
- Allow survey ONLY during Feb 5-10, 2026
- Block survey submission outside this window
- Display countdown to survey open (before Feb 5)
- Display countdown to survey close (during Feb 5-10)
- Show "Survey period ended" message after Feb 10

---

## Implementation Steps

### Phase 1: Backend Campaign Date Enforcement

#### Step 1.1: Add Campaign Date Check Helper
**File**: `backend/internal/infrastructure/database/campaign_helper.go`

**Add these functions**:
```go
// IsSurveyOpen checks if survey period is currently open
func IsSurveyOpen(ctx context.Context, db *sql.DB) (bool, error) {
    query := `
        SELECT NOW() >= survey_open_date AND NOW() <= survey_close_date
        FROM campaigns
        WHERE is_active = TRUE
        LIMIT 1
    `
    var isOpen bool
    err := db.QueryRowContext(ctx, query).Scan(&isOpen)
    return isOpen, err
}

// IsProfileUpdatePeriod checks if profile update period is currently active
func IsProfileUpdatePeriod(ctx context.Context, db *sql.DB) (bool, error) {
    query := `
        SELECT profile_update_start_date IS NOT NULL
        AND profile_update_end_date IS NOT NULL
        AND NOW() >= profile_update_start_date
        AND NOW() <= profile_update_end_date
        FROM campaigns
        WHERE is_active = TRUE
        LIMIT 1
    `
    var isActive bool
    err := db.QueryRowContext(ctx, query).Scan(&isActive)
    return isActive, err
}

// IsMessagingPeriod checks if messaging period is currently active
func IsMessagingPeriod(ctx context.Context, db *sql.DB) (bool, error) {
    query := `
        SELECT profile_update_start_date IS NOT NULL
        AND profile_update_end_date IS NOT NULL
        AND NOW() >= profile_update_start_date
        AND NOW() <= profile_update_end_date
        FROM campaigns
        WHERE is_active = TRUE
        LIMIT 1
    `
    var isActive bool
    err := db.QueryRowContext(ctx, query).Scan(&isActive)
    return isActive, err
}

// IsResultsReleased checks if results have been released
func IsResultsReleased(ctx context.Context, db *sql.DB) (bool, error) {
    query := `
        SELECT NOW() >= results_release_date
        FROM campaigns
        WHERE is_active = TRUE
        LIMIT 1
    `
    var isReleased bool
    err := db.QueryRowContext(ctx, query).Scan(&isReleased)
    return isReleased, err
}

// GetCampaignStatus returns current campaign status and all key dates
func GetCampaignStatus(ctx context.Context, db *sql.DB) (*CampaignStatus, error) {
    query := `
        SELECT
            survey_open_date,
            survey_close_date,
            profile_update_start_date,
            profile_update_end_date,
            results_release_date,
            NOW() >= survey_open_date AS survey_open,
            NOW() <= survey_close_date AS survey_active,
            NOW() >= profile_update_start_date AS profile_update_open,
            NOW() <= profile_update_end_date AS profile_update_active,
            NOW() >= results_release_date AS results_released
        FROM campaigns
        WHERE is_active = TRUE
        LIMIT 1
    `
    var status CampaignStatus
    var profileUpdateStartDate, profileUpdateEndDate *time.Time
    err := db.QueryRowContext(ctx, query).Scan(
        &status.SurveyOpenDate,
        &status.SurveyCloseDate,
        &profileUpdateStartDate,
        &profileUpdateEndDate,
        &status.ResultsReleaseDate,
        &status.SurveyOpen,
        &status.SurveyActive,
        &status.ProfileUpdateOpen,
        &status.ProfileUpdateActive,
        &status.ResultsReleased,
    )
    status.ProfileUpdateStartDate = profileUpdateStartDate
    status.ProfileUpdateEndDate = profileUpdateEndDate
    return &status, err
}

type CampaignStatus struct {
    SurveyOpenDate           time.Time  `json:"survey_open_date"`
    SurveyCloseDate          time.Time  `json:"survey_close_date"`
    ProfileUpdateStartDate   *time.Time `json:"profile_update_start_date"`
    ProfileUpdateEndDate     *time.Time `json:"profile_update_end_date"`
    ResultsReleaseDate       time.Time  `json:"results_release_date"`
    SurveyOpen               bool       `json:"survey_open"`
    SurveyActive             bool       `json:"survey_active"`
    ProfileUpdateOpen        bool       `json:"profile_update_open"`
    ProfileUpdateActive      bool       `json:"profile_update_active"`
    ResultsReleased          bool       `json:"results_released"`
}
```

#### Step 1.2: Update User Controller to Enforce Profile Update Window
**File**: `backend/internal/interface/http/controllers/user_controller.go`

**Update `UpdateProfile` function** (line 40):
```go
// UpdateProfile updates the current user's profile
func (ctrl *UserController) UpdateProfile(c *gin.Context) {
    userID, exists := middleware.GetUserID(c)
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // Check if profile update period is active
    isUpdatePeriod, err := database.IsProfileUpdatePeriod(c.Request.Context(), ctrl.userRepo.GetDB())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check campaign status"})
        return
    }
    if !isUpdatePeriod {
        c.JSON(http.StatusForbidden, gin.H{
            "error": "Profile updates are only allowed during the profile update period (Feb 11-13, 2026)",
            "phase": "profile_update_closed"
        })
        return
    }

    // ... rest of existing code ...
}
```

**Note**: `GetDB()` method needs to be added to UserRepository to expose the DB connection.

#### Step 1.3: Update Message Controller to Enforce Messaging Period
**File**: `backend/internal/interface/http/controllers/message_controller.go`

**Update `SendMessage` function** (line 136):
```go
// SendMessage sends a new message
func (ctrl *MessageController) SendMessage(c *gin.Context) {
    userID, exists := middleware.GetUserID(c)
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // Check if messaging period is active
    isMessagingPeriod, err := database.IsMessagingPeriod(c.Request.Context(), ctrl.conversationRepo.GetDB())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check campaign status"})
        return
    }
    if !isMessagingPeriod {
        c.JSON(http.StatusForbidden, gin.H{
            "error": "Messaging is only allowed during the messaging period (Feb 11-13, 2026)",
            "phase": "messaging_closed"
        })
        return
    }

    // ... rest of existing code ...
}
```

#### Step 1.4: Update Match Controller to Hide Matches Until Release Date
**File**: `backend/internal/interface/http/controllers/match_controller.go`

**Update `GetMatches` function** (line 30):
```go
// GetMatches retrieves the user's matches
func (ctrl *MatchController) GetMatches(c *gin.Context) {
    userID, exists := middleware.GetUserID(c)
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    matches, err := ctrl.matchRepo.GetByUserID(c.Request.Context(), userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve matches"})
        return
    }

    // Check if results have been released
    resultsReleased, err := database.IsResultsReleased(c.Request.Context(), ctrl.matchRepo.GetDB())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check campaign status"})
        return
    }

    // If results not released, hide match details but reveal count
    if !resultsReleased {
        // Return match count only, hide all details
        c.JSON(http.StatusOK, gin.H{
            "data": []Match{},
            "match_count": len(matches),
            "results_released": false,
            "results_release_date": "2026-02-14T07:00:00Z"
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "data": matches,
        "results_released": true,
    })
}
```

#### Step 1.5: Update Survey Controller to Enforce Survey Period
**File**: `backend/internal/interface/http/controllers/survey_controller.go`

**Update `SubmitSurvey` function**:
```go
// SubmitSurvey submits survey responses
func (ctrl *SurveyController) SubmitSurvey(c *gin.Context) {
    userID, exists := middleware.GetUserID(c)
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // Check if survey period is active
    isSurveyActive, err := database.IsSurveyOpen(c.Request.Context(), ctrl.surveyRepo.GetDB())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check campaign status"})
        return
    }
    if !isSurveyActive {
        c.JSON(http.StatusForbidden, gin.H{
            "error": "Survey is only allowed during the survey period (Feb 5-10, 2026)",
            "phase": "survey_closed"
        })
        return
    }

    // ... rest of existing code ...
}
```

#### Step 1.6: Add New Campaign Status Endpoint
**File**: `backend/internal/interface/http/controllers/campaign_controller.go`

**Add this new function**:
```go
// GetCampaignStatus returns the current campaign status
func (c *CampaignController) GetCampaignStatus(ctx *gin.Context) {
    status, err := database.GetCampaignStatus(ctx.Request.Context(), c.campaignRepo.GetDB())
    if err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "Campaign status not available"})
        return
    }
    ctx.JSON(http.StatusOK, status)
}
```

**File**: `backend/internal/interface/http/routes/routes.go`

**Add route** (line 109, inside campaigns admin group):
```go
campaigns.GET("/status", campaignController.GetCampaignStatus)
```

---

### Phase 2: Frontend Campaign State Management

#### Step 2.1: Create Campaign Context
**New File**: `frontend/src/contexts/CampaignContext.tsx`

```typescript
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface CampaignStatus {
  survey_open_date: string
  survey_close_date: string
  profile_update_start_date: string | null
  profile_update_end_date: string | null
  results_release_date: string
  survey_open: boolean
  survey_active: boolean
  profile_update_open: boolean
  profile_update_active: boolean
  results_released: boolean
}

interface CampaignContextType {
  status: CampaignStatus | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<CampaignStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaignStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      // Note: This endpoint needs to be created as public or add to protected routes
      const data = await apiClient.get('/api/v1/campaigns/status')
      setStatus(data)
    } catch (err) {
      console.error('Failed to fetch campaign status:', err)
      setError('Failed to load campaign status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaignStatus()
    // Refresh every 60 seconds
    const interval = setInterval(fetchCampaignStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <CampaignContext.Provider value={{ status, loading, error, refresh: fetchCampaignStatus }}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  const context = useContext(CampaignContext)
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider')
  }
  return context
}
```

#### Step 2.2: Wrap App with CampaignProvider
**File**: `frontend/src/app/layout.tsx`

Add CampaignProvider to existing providers:
```typescript
import { CampaignProvider } from '@/contexts/CampaignContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CampaignProvider>
          {/* ... existing providers ... */}
          {children}
        </CampaignProvider>
      </body>
    </html>
  )
}
```

#### Step 2.3: Update API Client to Support Public Campaign Status
**File**: `frontend/src/lib/api-client.ts`

Add new method (line 203):
```typescript
async getCampaignStatus(): Promise<CampaignStatus> {
  return this.get<CampaignStatus>('/api/v1/campaigns/status')
}
```

Add type to `types/api.ts`:
```typescript
export interface CampaignStatus {
  survey_open_date: string
  survey_close_date: string
  profile_update_start_date: string | null
  profile_update_end_date: string | null
  results_release_date: string
  survey_open: boolean
  survey_active: boolean
  profile_update_open: boolean
  profile_update_active: boolean
  results_released: boolean
}
```

#### Step 2.4: Make Campaign Status Endpoint Public
**File**: `backend/internal/interface/http/routes/routes.go`

Move `/api/v1/campaigns/status` route OUTSIDE of admin group:
```typescript
// Protected routes (require authentication)
protected := router.Group("")
protected.Use(authMiddleware.Authenticate())
{
    // ... existing user, survey, matches, messages, crushes routes ...

    // Campaign status - public to authenticated users
    protected.GET("/campaigns/status", campaignController.GetCampaignStatus)

    // Admin routes
    admin := protected.Group("/admin")
    admin.Use(adminMiddleware.RequireAdmin())
    {
        // ... existing admin routes ...
    }
}
```

---

### Phase 3: Frontend Date Enforcement UI

#### Step 3.1: Create Campaign Phase Banner Component
**New File**: `frontend/src/components/campaign/CampaignPhaseBanner.tsx`

```typescript
'use client'

import { useCampaign } from '@/contexts/CampaignContext'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { PixelIcon } from '@/components/ui/PixelIcon'

export function CampaignPhaseBanner() {
  const { status, loading } = useCampaign()

  if (loading || !status) return null

  // Phase 1: Before survey opens
  if (!status.survey_open) {
    return (
      <div className="w-full bg-gradient-to-r from-[#FF6B9D] to-[#00D4FF] border-b-4 border-[var(--retro-navy)] py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <PixelIcon name="star" size={32} className="text-white" />
            <div>
              <h3 className="pixel-font text-white text-lg">SURVEY OPENS IN</h3>
              <p className="pixel-font-body text-white text-sm opacity-90">Complete to find your Valentine!</p>
            </div>
          </div>
          <CountdownTimer targetDate={status.survey_open_date} className="scale-90" />
        </div>
      </div>
    )
  }

  // Phase 2: Survey active
  if (status.survey_active && !status.profile_update_open) {
    return (
      <div className="w-full bg-gradient-to-r from-[#9B59B6] to-[#00D4FF] border-b-4 border-[var(--retro-navy)] py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <PixelIcon name="envelope" size={32} className="text-white" />
            <div>
              <h3 className="pixel-font text-white text-lg">SURVEY ACTIVE</h3>
              <p className="pixel-font-body text-white text-sm opacity-90">Complete before {new Date(status.survey_close_date).toLocaleDateString()}</p>
            </div>
          </div>
          <CountdownTimer targetDate={status.survey_close_date} className="scale-90" />
        </div>
      </div>
    )
  }

  // Phase 3: Survey closed, waiting for profile update
  if (!status.profile_update_open) {
    return (
      <div className="w-full bg-gradient-to-r from-[#FF8E53] to-[#FF6B9D] border-b-4 border-[var(--retro-navy)] py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <PixelIcon name="lock" size={32} className="text-white" />
            <div>
              <h3 className="pixel-font text-white text-lg">PROFILE UPDATE WINDOW</h3>
              <p className="pixel-font-body text-white text-sm opacity-90">Opens in:</p>
            </div>
          </div>
          {status.profile_update_start_date && (
            <CountdownTimer targetDate={status.profile_update_start_date} className="scale-90" />
          )}
        </div>
      </div>
    )
  }

  // Phase 4: Profile update window active
  if (status.profile_update_active && !status.results_released) {
    return (
      <div className="w-full bg-gradient-to-r from-[#FFD93D] to-[#FF6B9D] border-b-4 border-[var(--retro-navy)] py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <PixelIcon name="sparkle" size={32} className="text-white" />
            <div>
              <h3 className="pixel-font text-white text-lg">PROFILE UPDATE & MESSAGING ACTIVE</h3>
              <p className="pixel-font-body text-white text-sm opacity-90">Window closes:</p>
            </div>
          </div>
          {status.profile_update_end_date && (
            <CountdownTimer targetDate={status.profile_update_end_date} className="scale-90" />
          )}
        </div>
      </div>
    )
  }

  // Phase 5: Waiting for results
  if (!status.results_released) {
    return (
      <div className="w-full bg-gradient-to-r from-[#00D4FF] to-[#9B59B6] border-b-4 border-[var(--retro-navy)] py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <PixelIcon name="heart_solid" size={32} className="text-white" />
            <div>
              <h3 className="pixel-font text-white text-lg">MATCH REVEAL</h3>
              <p className="pixel-font-body text-white text-sm opacity-90">Your Valentine's matches:</p>
            </div>
          </div>
          <CountdownTimer targetDate={status.results_release_date} className="scale-90" />
        </div>
      </div>
    )
  }

  // Phase 6: Results released
  return (
    <div className="w-full bg-gradient-to-r from-[#FF6B9D] to-[#FFD93D] border-b-4 border-[var(--retro-navy)] py-4 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3">
          <PixelIcon name="star" size={32} className="text-white animate-bounce" />
          <h3 className="pixel-font text-white text-lg">MATCHES REVEALED! 💕</h3>
          <PixelIcon name="star" size={32} className="text-white animate-bounce" />
        </div>
      </div>
    </div>
  )
}
```

#### Step 3.2: Add Banner to Dashboard Layout
**File**: `frontend/src/app/(dashboard)/layout.tsx`

Add banner after header or at top of content:
```typescript
import { CampaignPhaseBanner } from '@/components/campaign/CampaignPhaseBanner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--retro-cream)]">
      <CampaignPhaseBanner />
      {/* ... existing layout ... */}
      {children}
    </div>
  )
}
```

---

### Phase 4: Page-Specific Date Enforcement

#### Step 4.1: Update Profile Page with Date Enforcement
**File**: `frontend/src/app/(dashboard)/profile/page.tsx`

Add date checks in the component:
```typescript
import { useCampaign } from '@/contexts/CampaignContext'

export default function ProfilePage() {
  const { status } = useCampaign()
  const [profile, setProfile] = useState({...})
  // ... existing code ...

  const handleSave = async () => {
    // Check if profile update is allowed
    if (!status?.profile_update_active) {
      alert('Profile updates are only allowed during the profile update window (Feb 11-13, 2026)')
      return
    }

    try {
      setIsSaving(true)
      // ... existing save logic ...
    }
  }

  // Update Edit button visibility
  const canEdit = status?.profile_update_active || false

  // Update the edit button:
  <button
    onClick={() => setIsEditing(true)}
    disabled={!canEdit}
    className="..."
  >
    {canEdit ? 'EDIT PROFILE' : 'EDITING LOCKED'}
  </button>

  // If edit mode is entered but period ended, show message:
  {!canEdit && isEditing && (
    <div className="pixel-card text-center py-4 mb-4">
      <p className="pixel-font-body text-sm">
        Profile editing is only allowed during Feb 11-13, 2026
      </p>
      <button onClick={() => setIsEditing(false)} className="pixel-btn mt-2">
        Close
      </button>
    </div>
  )}
}
```

#### Step 4.2: Update Survey Page with Date Enforcement
**File**: `frontend/src/app/(dashboard)/survey/page.tsx`

```typescript
import { useCampaign } from '@/contexts/CampaignContext'

export default function SurveyPage() {
  const { status, loading } = useCampaign()
  // ... existing code ...

  if (loading) return <Loading />

  // Survey not open yet
  if (!status?.survey_active && !status?.survey_open) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="pixel-card text-center py-16">
          <PixelIcon name="lock" size={64} />
          <h2 className="pixel-font text-2xl text-[var(--retro-navy)] mb-4 mt-4">
            Survey Not Yet Open
          </h2>
          <p className="pixel-font-body text-gray-600 mb-6">
            The survey will open on {new Date(status?.survey_open_date || '').toLocaleDateString()}
          </p>
          {status?.survey_open_date && (
            <CountdownTimer targetDate={status.survey_open_date} />
          )}
        </div>
      </div>
    )
  }

  // Survey period ended
  if (!status?.survey_active && status?.survey_open) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="pixel-card text-center py-16">
          <PixelIcon name="check" size={64} />
          <h2 className="pixel-font text-2xl text-[var(--retro-navy)] mb-4 mt-4">
            Survey Period Ended
          </h2>
          <p className="pixel-font-body text-gray-600 mb-6">
            The survey closed on {new Date(status?.survey_close_date || '').toLocaleDateString()}
          </p>
          <p className="pixel-font-body text-sm text-gray-500">
            Your responses have been saved. Please wait for your matches to be revealed!
          </p>
        </div>
      </div>
    )
  }

  // Show existing survey form
  return (
    // ... existing survey UI ...
  )
}
```

#### Step 4.3: Update Matches Page with Reveal Logic
**File**: `frontend/src/app/(dashboard)/matches/page.tsx`

```typescript
import { useCampaign } from '@/contexts/CampaignContext'

export default function MatchesPage() {
  const { status } = useCampaign()
  const [matches, setMatches] = useState<Match[]>([])
  const [matchCount, setMatchCount] = useState(0)
  const [resultsReleased, setResultsReleased] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const response: any = await apiClient.getMatches()
      if (response.results_released === false) {
        setMatchCount(response.match_count || 0)
        setResultsReleased(false)
        setMatches([])
      } else {
        setResultsReleased(true)
        setMatches(response.data || [])
      }
      setLoading(false)
    } catch (error) {
      // ... error handling
    }
  }

  // Before results released
  if (!resultsReleased) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="pixel-font text-3xl md:text-5xl font-bold mb-4 text-[var(--retro-navy)]">
             Your <span className="text-[var(--retro-red)]">Matches</span>
          </h1>
          <div className="inline-block bg-[var(--retro-navy)] text-white px-6 py-3">
            <p className="pixel-font text-xl">{matchCount} Matches Found!</p>
          </div>
        </div>

        {/* Reveal Card */}
        <div className="pixel-card text-center py-16">
          <PixelIcon name="heart_solid" size={80} className="text-[var(--retro-red)] mb-6" />
          <h2 className="pixel-font text-3xl text-[var(--retro-navy)] mb-4">
            Matches Revealed On Valentine's Day
          </h2>
          <p className="pixel-font-body text-gray-600 mb-6 max-w-md mx-auto">
            Your matches have been calculated! They will be revealed on
            {status?.results_release_date && ` ${new Date(status.results_release_date).toLocaleDateString()} at 7:00 AM`}
          </p>
          {status?.results_release_date && (
            <div className="max-w-md mx-auto mb-6">
              <CountdownTimer targetDate={status.results_release_date} />
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[...Array(Math.min(matchCount, 3))].map((_, i) => (
              <div key={i} className="w-24 h-24 bg-[var(--retro-cream)] border-4 border-[var(--retro-navy)] flex items-center justify-center blur-sm opacity-60">
                <PixelIcon name="smiley" size={40} />
              </div>
            ))}
          </div>
          {matchCount > 3 && (
            <p className="pixel-font-body text-sm text-gray-500 mt-4">
              +{matchCount - 3} more matches waiting...
            </p>
          )}
        </div>
      </div>
    )
  }

  // After results released - show existing matches grid
  return (
    // ... existing matches UI ...
  )
}
```

#### Step 4.4: Update Messages Page with Date Enforcement
**File**: `frontend/src/app/(dashboard)/messages/page.tsx`

```typescript
import { useCampaign } from '@/contexts/CampaignContext'

export default function MessagesPage() {
  const { status } = useCampaign()
  // ... existing code ...

  // Check messaging period
  const canMessage = status?.profile_update_active || false

  // Update message input:
  <div className="p-4 bg-[var(--retro-cream)] border-t-4 border-[var(--retro-navy)]">
    {!canMessage ? (
      <div className="text-center py-4">
        <p className="pixel-font text-sm text-[var(--retro-navy)]">
          Messaging is only allowed during Feb 11-13, 2026
        </p>
        {status?.profile_update_start_date && new Date(status.profile_update_start_date) > new Date() && (
          <div className="mt-2">
            <CountdownTimer targetDate={status.profile_update_start_date} />
          </div>
        )}
      </div>
    ) : (
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="pixel-input flex-1 border-2"
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          disabled={sendingMessage}
        />
        <button
          onClick={handleSendMessage}
          disabled={sendingMessage || !newMessage.trim()}
          className="pixel-btn px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendingMessage ? '...' : 'SEND'}
        </button>
      </div>
    )}
  </div>
}
```

---

## SQL Queries

### Query 1: Add DB Connection Method to Repositories
**Note**: This is a code change, not SQL, but required for Phase 1.2-1.5

For each repository (`user_repository.go`, `match_repository.go`, `survey_repository.go`, `conversation_repository.go`), add:
```go
func (r *userRepositoryImpl) GetDB() *sql.DB {
    return r.db.GetDB()
}
```

Update the `Database` struct in `backend/internal/infrastructure/database/database.go`:
```go
type Database struct {
    db *sql.DB
}

func (d *Database) GetDB() *sql.DB {
    return d.db
}
```

### Query 2: Update Matches Table for Better Date Tracking
**File**: `backend/supabase/migrations/009_enhance_campaign_tracking.sql`

```sql
-- ============================================
-- ENHANCED CAMPAIGN DATE TRACKING
-- ============================================

-- Add function to check if messaging is allowed based on campaign dates
CREATE OR REPLACE FUNCTION can_send_message()
RETURNS BOOLEAN AS $$
DECLARE
    can_send BOOLEAN;
BEGIN
    SELECT COALESCE(
        profile_update_start_date IS NOT NULL
        AND profile_update_end_date IS NOT NULL
        AND NOW() >= profile_update_start_date
        AND NOW() <= profile_update_end_date,
        FALSE
    ) INTO can_send
    FROM campaigns
    WHERE is_active = TRUE
    LIMIT 1;

    RETURN can_send;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically unlock messaging during window
CREATE OR REPLACE FUNCTION auto_unlock_messaging()
RETURNS TRIGGER AS $$
BEGIN
    IF can_send_message() THEN
        UPDATE matches
        SET messaging_unlocked = TRUE
        WHERE campaign_id = NEW.id
        AND messaging_unlocked = FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on campaigns
DROP TRIGGER IF EXISTS on_campaign_update ON campaigns;
CREATE TRIGGER on_campaign_update
    AFTER UPDATE ON campaigns
    FOR EACH ROW
    WHEN (OLD.is_active != NEW.is_active OR
          OLD.profile_update_start_date IS DISTINCT FROM NEW.profile_update_start_date OR
          OLD.profile_update_end_date IS DISTINCT FROM NEW.profile_update_end_date)
    EXECUTE FUNCTION auto_unlock_messaging();

-- Add comprehensive campaign status function
CREATE OR REPLACE FUNCTION get_campaign_status()
RETURNS JSON AS $$
DECLARE
    status JSON;
BEGIN
    SELECT json_build_object(
        'survey_open_date', survey_open_date,
        'survey_close_date', survey_close_date,
        'profile_update_start_date', profile_update_start_date,
        'profile_update_end_date', profile_update_end_date,
        'results_release_date', results_release_date,
        'survey_open', NOW() >= survey_open_date,
        'survey_active', NOW() >= survey_open_date AND NOW() <= survey_close_date,
        'profile_update_open', COALESCE(NOW() >= profile_update_start_date, FALSE),
        'profile_update_active', COALESCE(
            profile_update_start_date IS NOT NULL
            AND profile_update_end_date IS NOT NULL
            AND NOW() >= profile_update_start_date
            AND NOW() <= profile_update_end_date,
            FALSE
        ),
        'results_released', NOW() >= results_release_date,
        'current_phase', CASE
            WHEN NOW() < survey_open_date THEN 'before_survey'
            WHEN NOW() >= survey_open_date AND NOW() <= survey_close_date THEN 'survey_active'
            WHEN profile_update_start_date IS NOT NULL AND NOW() < profile_update_start_date THEN 'waiting_profile_update'
            WHEN profile_update_end_date IS NOT NULL AND NOW() >= profile_update_start_date AND NOW() <= profile_update_end_date THEN 'profile_update_active'
            WHEN NOW() < results_release_date THEN 'waiting_results'
            ELSE 'results_released'
        END
    ) INTO status
    FROM campaigns
    WHERE is_active = TRUE
    LIMIT 1;

    RETURN COALESCE(status, '{}'::json);
END;
$$ LANGUAGE plpgsql;
```

---

## API Endpoints

### New Endpoints

#### GET /api/v1/campaigns/status
**Purpose**: Get current campaign status for frontend date enforcement

**Response**:
```json
{
  "survey_open_date": "2026-02-05T00:00:00Z",
  "survey_close_date": "2026-02-10T23:59:59Z",
  "profile_update_start_date": "2026-02-11T00:00:00Z",
  "profile_update_end_date": "2026-02-13T23:59:59Z",
  "results_release_date": "2026-02-14T07:00:00Z",
  "survey_open": true,
  "survey_active": false,
  "profile_update_open": false,
  "profile_update_active": false,
  "results_released": false
}
```

**Controller**: `CampaignController.GetCampaignStatus` (Phase 1.6)

**Route**: `routes.go` (Phase 2.4)

---

### Modified Endpoints

#### PUT /api/v1/users/me (Update Profile)
**Changes**:
- Added date validation: Check if `profile_update_active` is true
- Returns 403 Forbidden if outside profile update window
- Error response includes `phase: "profile_update_closed"`

**Controller**: `UserController.UpdateProfile` (Phase 1.2)

---

#### POST /api/v1/messages/conversations/:id/messages (Send Message)
**Changes**:
- Added date validation: Check if messaging period is active
- Returns 403 Forbidden if outside messaging window (Feb 11-13)
- Error response includes `phase: "messaging_closed"`

**Controller**: `MessageController.SendMessage` (Phase 1.3)

---

#### GET /api/v1/matches (Get Matches)
**Changes**:
- Added results release check
- Before Feb 14: Returns empty array with `match_count` and `results_released: false`
- On/after Feb 14: Returns full match data with `results_released: true`
- Includes `results_release_date` in response

**Controller**: `MatchController.GetMatches` (Phase 1.4)

---

#### POST /api/v1/surveys (Submit Survey)
**Changes**:
- Added date validation: Check if survey is active
- Returns 403 Forbidden if outside survey window (Feb 5-10)
- Error response includes `phase: "survey_closed"`

**Controller**: `SurveyController.SubmitSurvey` (Phase 1.5)

---

## Frontend Components

### New Components

#### CampaignContext (Context Provider)
**File**: `frontend/src/contexts/CampaignContext.tsx`

**Purpose**: Global state management for campaign dates and status

**Features**:
- Fetches campaign status on mount
- Auto-refreshes every 60 seconds
- Provides `status`, `loading`, `error`, `refresh` to consumers
- Used by all date-enforced pages

**Usage**:
```typescript
const { status, loading } = useCampaign()
if (!status?.survey_active) return <SurveyClosed />
```

---

#### CampaignPhaseBanner (Component)
**File**: `frontend/src/components/campaign/CampaignPhaseBanner.tsx`

**Purpose**: Display current campaign phase with appropriate countdown

**Features**:
- Shows different banner for each phase:
  - Before survey opens
  - Survey active
  - Waiting for profile update
  - Profile update active
  - Waiting for results
  - Results released
- Integrated with CountdownTimer
- Responsive design
- Animated icons

**Usage**:
```typescript
import { CampaignPhaseBanner } from '@/components/campaign/CampaignPhaseBanner'

// In layout.tsx
<CampaignPhaseBanner />
```

---

### Modified Components

#### ProfilePage
**Changes** (Phase 4.1):
- Import and use `useCampaign` hook
- Check `status.profile_update_active` before allowing edits
- Disable edit button when not in update window
- Show warning message if user tries to edit outside window
- Display countdown to window opening (before Feb 11)

---

#### SurveyPage
**Changes** (Phase 4.2):
- Import and use `useCampaign` hook
- Check `status.survey_active` before showing form
- Show "Survey Not Yet Open" state with countdown (before Feb 5)
- Show "Survey Period Ended" state (after Feb 10)
- Only display survey form during active period (Feb 5-10)

---

#### MatchesPage
**Changes** (Phase 4.3):
- Import and use `useCampaign` hook
- Handle new API response format (`match_count`, `results_released`)
- Show blurred placeholder cards before reveal date (before Feb 14)
- Display countdown to match reveal
- Show celebration message when results released
- Animate match reveal (optional enhancement)

---

#### MessagesPage
**Changes** (Phase 4.4):
- Import and use `useCampaign` hook
- Check `status.profile_update_active` before allowing messages
- Disable message input outside messaging window (Feb 11-13)
- Show countdown to messaging unlock (before Feb 11)
- Show "messaging closed" message after window (after Feb 13)
- Keep read-only access to existing messages

---

#### CountdownTimer (Enhancement)
**File**: `frontend/src/components/ui/CountdownTimer.tsx`

**Suggested Enhancements**:
- Add `label` prop to customize "Until [event]" text
- Add `compact` mode for smaller display
- Add `showLabel` boolean to hide/show the bottom label
- Add callback when countdown expires (onExpire prop)

**Optional Changes** (not required for MVP):
```typescript
interface CountdownTimerProps {
  targetDate: Date | string
  className?: string
  label?: string // Custom label text
  compact?: boolean // Smaller size
  showLabel?: boolean // Hide bottom label
  onExpire?: () => void // Callback when expired
}
```

---

## Integration Points

### 1. Backend-Database Integration

**Repository → Database Connection**:
- All controllers need access to the underlying `*sql.DB` to call campaign date check functions
- Add `GetDB()` method to all repositories
- Pass DB connection to helper functions in `campaign_helper.go`

**Campaign Helper Functions**:
- `IsSurveyOpen()` - Check survey period
- `IsProfileUpdatePeriod()` - Check profile update window
- `IsMessagingPeriod()` - Check messaging window
- `IsResultsReleased()` - Check if matches revealed
- `GetCampaignStatus()` - Get full campaign status

**Usage Flow**:
```
Controller → Repository.GetDB() → campaign_helper.GetCampaignStatus()
                                       → SQL Query (campaigns table)
```

---

### 2. Backend API Integration

**Protected Routes → Campaign Status**:
- Move `/api/v1/campaigns/status` to public (authenticated) route
- Remove admin requirement from this endpoint
- All frontend users can fetch campaign status

**Request Flow**:
```
Frontend → apiClient.getCampaignStatus()
         → GET /api/v1/campaigns/status
         → CampaignController.GetCampaignStatus()
         → campaign_helper.GetCampaignStatus()
         → JSON response
```

---

### 3. Frontend State Integration

**CampaignProvider → App Tree**:
- Wrap entire app with `CampaignProvider` in `layout.tsx`
- Fetches status on mount, auto-refreshes every 60s
- Available to all components via `useCampaign()` hook

**Component Integration**:
```
layout.tsx (CampaignProvider)
    ↓
DashboardLayout (CampaignPhaseBanner)
    ↓
ProfilePage (useCampaign → status.profile_update_active)
MatchesPage (useCampaign → status.results_released)
MessagesPage (useCampaign → status.profile_update_active)
SurveyPage (useCampaign → status.survey_active)
```

---

### 4. Date Enforcement Integration Points

| Feature | Backend Check | Frontend Check | Fallback |
|---------|---------------|----------------|----------|
| Profile Update | `user_controller.go` line ~48 | `profile/page.tsx` handleSave | Backend enforces (403) |
| Messaging | `message_controller.go` line ~45 | `messages/page.tsx` canMessage | Backend enforces (403) |
| Match Reveal | `match_controller.go` line ~37 | `matches/page.tsx` resultsReleased | Backend hides data |
| Survey | `survey_controller.go` line ~18 | `survey/page.tsx` status.survey_active | Backend enforces (403) |

**Defense in Depth**:
1. **Frontend**: Disable buttons, show warning messages, prevent UI actions
2. **Backend**: Validate requests, return 403 Forbidden with error message
3. **Database**: RLS policies prevent unauthorized updates (optional enhancement)

---

### 5. Countdown Timer Integration

**CountdownTimer Uses**:
1. **CampaignPhaseBanner**: Show countdown for next phase transition
2. **SurveyPage**: Countdown to survey open (before Feb 5)
3. **ProfilePage**: Countdown to update window opening (before Feb 11)
4. **MatchesPage**: Countdown to match reveal (before Feb 14)
5. **MessagesPage**: Countdown to messaging unlock (before Feb 11)

**Props Needed**:
```typescript
<CountdownTimer
  targetDate={status.survey_open_date}  // or other dates
  className="scale-90"                   // optional styling
/>
```

---

### 6. Error Handling Integration

**Backend Error Responses**:
```json
{
  "error": "Profile updates are only allowed during the profile update window (Feb 11-13, 2026)",
  "phase": "profile_update_closed"
}
```

**Frontend Error Handling**:
```typescript
try {
  await apiClient.updateProfile(data)
} catch (error: any) {
  if (error.message.includes('only allowed during')) {
    // Show user-friendly message
    alert('Profile editing is only available during the profile update window!')
  }
}
```

---

### 7. Testing Integration Points

**Key Test Scenarios**:
1. **Before Feb 5**: Survey shows countdown, submit blocked
2. **Feb 5-10**: Survey open, form functional
3. **After Feb 10**: Survey shows "ended", submit blocked
4. **Before Feb 11**: Profile shows countdown, edit blocked
5. **Feb 11-13**: Profile editing allowed, messaging enabled
6. **After Feb 13**: Profile/messaging shows "ended", actions blocked
7. **Before Feb 14**: Matches blurred, countdown shown
8. **Feb 14+**: Matches revealed, full details shown

**Test Data**:
```sql
-- Test campaign with adjusted dates
UPDATE campaigns
SET survey_open_date = NOW() - INTERVAL '1 day',
    survey_close_date = NOW() + INTERVAL '1 day',
    profile_update_start_date = NOW() + INTERVAL '2 days',
    profile_update_end_date = NOW() + INTERVAL '4 days',
    results_release_date = NOW() + INTERVAL '6 days'
WHERE is_active = TRUE;
```

---

## Implementation Checklist

### Phase 1: Backend (2-3 hours)
- [ ] Add `GetDB()` method to repositories
- [ ] Create campaign helper functions (campaign_helper.go)
- [ ] Update UserController.UpdateProfile with date check
- [ ] Update MessageController.SendMessage with date check
- [ ] Update MatchController.GetMatches with reveal logic
- [ ] Update SurveyController.SubmitSurvey with date check
- [ ] Add CampaignController.GetCampaignStatus endpoint
- [ ] Move campaigns/status route to public/authenticated
- [ ] Test all endpoints with Postman/curl

### Phase 2: Frontend State (1 hour)
- [ ] Create CampaignContext
- [ ] Create CampaignStatus type in types/api.ts
- [ ] Add getCampaignStatus to apiClient
- [ ] Wrap app with CampaignProvider
- [ ] Test context with browser dev tools

### Phase 3: Banner Component (1 hour)
- [ ] Create CampaignPhaseBanner component
- [ ] Add to DashboardLayout
- [ ] Test all phase states (manually adjust dates)
- [ ] Verify countdown functionality

### Phase 4: Page Updates (2-3 hours)
- [ ] Update ProfilePage with date enforcement
- [ ] Update SurveyPage with date enforcement
- [ ] Update MatchesPage with reveal logic
- [ ] Update MessagesPage with date enforcement
- [ ] Test each page manually at different dates

### Phase 5: Database (30 min)
- [ ] Create migration file (009_enhanced_campaign_tracking.sql)
- [ ] Test SQL functions in Supabase SQL editor
- [ ] Verify campaign status function returns correct data

### Phase 6: Testing (1-2 hours)
- [ ] Test all date windows (before, during, after)
- [ ] Verify backend enforcement (API calls return 403)
- [ ] Verify frontend enforcement (UI disabled/blocked)
- [ ] Test countdown timer accuracy
- [ ] Test match reveal animation
- [ ] End-to-end test: Complete user flow

---

## Timeline Estimate

**Total Implementation Time**: 7-10 hours

- Phase 1 (Backend): 2-3 hours
- Phase 2 (State): 1 hour
- Phase 3 (Banner): 1 hour
- Phase 4 (Pages): 2-3 hours
- Phase 5 (Database): 0.5 hours
- Phase 6 (Testing): 1-2 hours

---

## Notes & Considerations

### Time Zones
- All dates in database are stored as UTC (TIMESTAMPTZ)
- Display dates in user's local time using JavaScript `toLocaleString()`
- Valentine's reveal at 7:00 AM UTC = 3:00 PM PHT (Philippines Standard Time)

### Edge Cases
- What if no active campaign exists? → Handle gracefully, show "No active campaign"
- What if campaign dates are null? → Treat as phase not active
- What if user already submitted survey? → Show view mode, disable edits
- What if admin changes campaign dates mid-period? → Frontend auto-refreshes every 60s

### Future Enhancements
- Add admin panel to adjust campaign dates on-the-fly
- Add email notifications for phase transitions
- Add push notifications for match reveal
- Add "phase history" to show what phases were completed
- Add ability to extend deadlines (e.g., survey extension)

### Performance
- Campaign status queried once per page load (via context)
- Auto-refresh every 60 seconds prevents stale data
- Consider server-sent events (SSE) for real-time updates on reveal
- Cache campaign status in localStorage for offline capability

---

## Summary

This implementation plan provides a comprehensive approach to adding campaign date enforcement to Wizard Connect's Valentine's 2026 campaign. The key focus areas are:

1. **Profile Update Window (Feb 11-13)**: Enforced on backend and frontend
2. **Messaging Window (Feb 11-13)**: Enforced on backend and frontend
3. **Match Reveal (Feb 14)**: Hidden until reveal date, with countdown
4. **Survey Period (Feb 5-10)**: Enforced on backend and frontend
5. **Global Campaign Awareness**: Context provider with auto-refresh

The implementation follows a defense-in-depth approach with validation at both frontend (UI/UX) and backend (security) levels, ensuring users have a clear understanding of what actions are available at any given time while preventing unauthorized actions.
