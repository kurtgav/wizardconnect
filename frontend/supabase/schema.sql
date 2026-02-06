-- ============================================
-- WIZARD CONNECT DATABASE SCHEMA
-- Supabase PostgreSQL + RLS Policies
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    year VARCHAR(20),
    major VARCHAR(100),
    college VARCHAR(100),
    gender VARCHAR(50),
    seeking_gender VARCHAR(50),
    profile_photo_url TEXT,
    bio TEXT,
    instagram_handle VARCHAR(100),
    phone_number VARCHAR(20),
    contact_preference VARCHAR(50) DEFAULT 'email',
    profile_visibility VARCHAR(20) DEFAULT 'matches_only',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by all authenticated users"
    ON users FOR SELECT
    USING (
        profile_visibility = 'public'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can insert their own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Index for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    survey_open_date TIMESTAMPTZ NOT NULL,
    survey_close_date TIMESTAMPTZ NOT NULL,
    profile_update_start_date TIMESTAMPTZ,
    profile_update_end_date TIMESTAMPTZ,
    results_release_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    total_participants INTEGER DEFAULT 0,
    total_matches_generated INTEGER DEFAULT 0,
    algorithm_version VARCHAR(50),
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active campaigns"
    ON campaigns FOR SELECT
    USING (is_active = true);

CREATE POLICY "Only admins can modify campaigns"
    ON campaigns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.email IN ('admin@wizardconnect.com', 'admin@mapua.edu.ph')
        )
    );

CREATE INDEX idx_campaigns_active ON campaigns(is_active);

-- ============================================
-- SURVEY RESPONSES TABLE
-- ============================================
CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL,
    question_category VARCHAR(50),
    response_value JSONB NOT NULL,
    response_score FLOAT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, campaign_id, question_id)
);

-- RLS for survey responses
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own responses"
    ON survey_responses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
    ON survey_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses before deadline"
    ON survey_responses FOR UPDATE
    USING (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM campaigns
            WHERE campaigns.id = campaign_id
            AND NOW() < campaigns.survey_close_date
        )
    );

CREATE INDEX idx_survey_user_campaign ON survey_responses(user_id, campaign_id);
CREATE INDEX idx_survey_question ON survey_responses(question_id);

-- ============================================
-- CRUSH LISTS TABLE
-- ============================================
CREATE TABLE crush_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    crush_email VARCHAR(255) NOT NULL,
    crush_name VARCHAR(200),
    is_matched BOOLEAN DEFAULT false,
    is_mutual BOOLEAN DEFAULT false,
    nudge_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for crush lists
ALTER TABLE crush_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own crush list"
    ON crush_lists FOR ALL
    USING (auth.uid() = user_id);

CREATE INDEX idx_crush_user ON crush_lists(user_id);
CREATE INDEX idx_crush_email ON crush_lists(crush_email);
CREATE INDEX idx_crush_campaign ON crush_lists(campaign_id);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    user_a_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_b_id UUID REFERENCES users(id) ON DELETE CASCADE,
    compatibility_score FLOAT NOT NULL,
    rank_for_a INTEGER,
    rank_for_b INTEGER,
    is_mutual_crush BOOLEAN DEFAULT false,
    user_a_viewed BOOLEAN DEFAULT false,
    user_b_viewed BOOLEAN DEFAULT false,
    user_a_contacted BOOLEAN DEFAULT false,
    user_b_contacted BOOLEAN DEFAULT false,
    messaging_unlocked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, user_a_id, user_b_id)
);

-- RLS for matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches"
    ON matches FOR SELECT
    USING (
        auth.uid() = user_a_id
        OR auth.uid() = user_b_id
    );

CREATE POLICY "Users can update their match view status"
    ON matches FOR UPDATE
    USING (
        auth.uid() = user_a_id
        OR auth.uid() = user_b_id
    );

CREATE INDEX idx_matches_user_a ON matches(user_a_id);
CREATE INDEX idx_matches_user_b ON matches(user_b_id);
CREATE INDEX idx_matches_campaign ON matches(campaign_id);

-- ============================================
-- MESSAGES TABLE (Feb 11-13 Messaging)
-- ============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their matches"
    ON messages FOR SELECT
    USING (
        auth.uid() = sender_id
        OR auth.uid() = recipient_id
    );

CREATE POLICY "Users can send messages to their matches"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = match_id
            AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
            AND matches.messaging_unlocked = true
        )
    );

CREATE POLICY "Users can mark their received messages as read"
    ON messages FOR UPDATE
    USING (auth.uid() = recipient_id);

CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = false;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to check if messaging is unlocked
CREATE OR REPLACE FUNCTION can_message(match_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    match_unlocked BOOLEAN;
    campaign_dates RECORD;
BEGIN
    -- Get match and campaign info
    SELECT
        m.messaging_unlocked,
        c.profile_update_start_date,
        c.profile_update_end_date
    INTO match_unlocked, campaign_dates
    FROM matches m
    JOIN campaigns c ON m.campaign_id = c.id
    WHERE m.id = match_uuid;

    -- Check if messaging is allowed
    RETURN match_unlocked
        AND NOW() >= campaign_dates.profile_update_start_date
        AND NOW() <= campaign_dates.profile_update_end_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA - Valentine's 2026 Campaign
-- ============================================
INSERT INTO campaigns (
    name,
    survey_open_date,
    survey_close_date,
    profile_update_start_date,
    profile_update_end_date,
    results_release_date,
    is_active,
    algorithm_version,
    config
) VALUES (
    'Valentine''s Day 2026 - Mapua Malayan Colleges Laguna',
    '2026-02-05 00:00:00+00',
    '2026-02-10 23:59:59+00',
    '2026-02-11 00:00:00+00',
    '2026-02-13 23:59:59+00',
    '2026-02-14 07:00:00+00',
    true,
    'v1.0',
    '{
        "college": "Mapua Malayan Colleges Laguna",
        "num_matches": 7,
        "weights": {
            "demographics": 0.10,
            "personality": 0.30,
            "values": 0.25,
            "lifestyle": 0.20,
            "interests": 0.15
        },
        "crush_bonus": {
            "mutual": 1.20,
            "one_way": 1.10
        }
    }'::jsonb
) ON CONFLICT DO NOTHING;

-- ============================================
-- STORAGE BUCKETS (if needed)
-- ============================================
-- Note: Create these via Supabase dashboard or CLI
-- Bucket: profile-images
-- Bucket: campaign-assets
