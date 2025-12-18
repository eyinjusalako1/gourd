-- Gathered Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  denomination TEXT,
  location TEXT,
  bio TEXT,
  church_affiliation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FELLOWSHIP GROUPS TABLE
-- ============================================
CREATE TABLE fellowship_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 0,
  max_members INTEGER,
  group_type TEXT NOT NULL CHECK (group_type IN ('bible_study', 'prayer_group', 'fellowship', 'youth_group', 'senior_group', 'mixed')),
  meeting_schedule TEXT,
  meeting_location TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- GROUP MEMBERSHIPS TABLE
-- ============================================
CREATE TABLE group_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES fellowship_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'rejected')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- JOIN REQUESTS TABLE
-- ============================================
CREATE TABLE join_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES fellowship_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('bible_study', 'prayer_meeting', 'fellowship', 'evangelism', 'worship', 'community_service', 'other')),
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,
  virtual_platform TEXT CHECK (virtual_platform IN ('zoom', 'teams', 'google_meet', 'other')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rsvp_count INTEGER DEFAULT 0,
  max_attendees INTEGER,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
  recurrence_end_date TIMESTAMP WITH TIME ZONE,
  group_id UUID REFERENCES fellowship_groups(id),
  is_active BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  requires_rsvp BOOLEAN DEFAULT TRUE,
  allow_guests BOOLEAN DEFAULT TRUE
);

-- ============================================
-- EVENT RSVPS TABLE
-- ============================================
CREATE TABLE event_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
  rsvp_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  guest_count INTEGER DEFAULT 0,
  notes TEXT
);

-- ============================================
-- EVENT ATTENDANCE TABLE
-- ============================================
CREATE TABLE event_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('testimony', 'scripture', 'encouragement', 'prayer_request', 'general')),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  group_id UUID REFERENCES fellowship_groups(id),
  event_id UUID REFERENCES events(id),
  is_active BOOLEAN DEFAULT TRUE,
  scripture_reference TEXT,
  prayer_category TEXT CHECK (prayer_category IN ('healing', 'guidance', 'family', 'work', 'ministry', 'other'))
);

-- ============================================
-- POST COMMENTS TABLE
-- ============================================
CREATE TABLE post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  parent_id UUID REFERENCES post_comments(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- POST LIKES TABLE
-- ============================================
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================
-- POST SHARES TABLE
-- ============================================
CREATE TABLE post_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT
);

-- ============================================
-- CONTENT FLAGS TABLE (MODERATION)
-- ============================================
CREATE TABLE content_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'group', 'event')),
  flag_type TEXT NOT NULL CHECK (flag_type IN ('inappropriate', 'spam', 'offensive', 'false_doctrine', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  reason TEXT NOT NULL,
  reported_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- ============================================
-- STUDY PLANS TABLE
-- ============================================
CREATE TABLE study_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL CHECK (category IN ('new_testament', 'old_testament', 'topical', 'chronological')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}'
);

-- ============================================
-- STUDY SESSIONS TABLE
-- ============================================
CREATE TABLE study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  day_number INTEGER NOT NULL,
  verses TEXT[] DEFAULT '{}',
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  reflection TEXT
);

-- ============================================
-- MEMORY VERSES TABLE
-- ============================================
CREATE TABLE memory_verses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  translation TEXT DEFAULT 'NIV',
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 0
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_fellowship_groups_created_by ON fellowship_groups(created_by);
CREATE INDEX idx_fellowship_groups_location ON fellowship_groups(location);
CREATE INDEX idx_group_memberships_user_id ON group_memberships(user_id);
CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_content_flags_status ON content_flags(status);
CREATE INDEX idx_memory_verses_user_id ON memory_verses(user_id);
CREATE INDEX idx_memory_verses_next_review ON memory_verses(next_review);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_verses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Fellowship groups policies
CREATE POLICY "Anyone can view public groups" ON fellowship_groups FOR SELECT USING (is_private = FALSE OR is_active = FALSE);
CREATE POLICY "Group creators can manage their groups" ON fellowship_groups FOR ALL USING (auth.uid() = created_by);

-- Group memberships policies
CREATE POLICY "Users can view memberships they're part of" ON group_memberships FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT created_by FROM fellowship_groups WHERE id = group_id));
CREATE POLICY "Users can join groups" ON group_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Anyone can view public events" ON events FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Event creators can manage their events" ON events FOR ALL USING (auth.uid() = created_by);

-- Event RSVPs policies
CREATE POLICY "Users can manage their own RSVPs" ON event_rsvps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Event creators can view RSVPs" ON event_rsvps FOR SELECT USING (auth.uid() IN (SELECT created_by FROM events WHERE id = event_id));

-- Posts policies
CREATE POLICY "Anyone can view active posts" ON posts FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);

-- Post comments policies
CREATE POLICY "Anyone can view active comments" ON post_comments FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON post_comments FOR UPDATE USING (auth.uid() = author_id);

-- Post likes policies
CREATE POLICY "Users can manage their own likes" ON post_likes FOR ALL USING (auth.uid() = user_id);

-- Post shares policies
CREATE POLICY "Users can manage their own shares" ON post_shares FOR ALL USING (auth.uid() = user_id);

-- Content flags policies
CREATE POLICY "Users can report content" ON content_flags FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Admins can view all flags" ON content_flags FOR SELECT USING (true);

-- Study plans policies
CREATE POLICY "Anyone can view public study plans" ON study_plans FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Users can create study plans" ON study_plans FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Study sessions policies
CREATE POLICY "Users can manage their own study sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);

-- Memory verses policies
CREATE POLICY "Users can manage their own memory verses" ON memory_verses FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fellowship_groups_updated_at BEFORE UPDATE ON fellowship_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE fellowship_groups 
        SET member_count = member_count + 1 
        WHERE id = NEW.group_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'active' AND NEW.status = 'active' THEN
            UPDATE fellowship_groups 
            SET member_count = member_count + 1 
            WHERE id = NEW.group_id;
        ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
            UPDATE fellowship_groups 
            SET member_count = member_count - 1 
            WHERE id = NEW.group_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
        UPDATE fellowship_groups 
        SET member_count = member_count - 1 
        WHERE id = OLD.group_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for member count
CREATE TRIGGER update_group_member_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON group_memberships
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Function to update post engagement counts
CREATE OR REPLACE FUNCTION update_post_engagement_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'post_likes' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'post_comments' THEN
        IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
            UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.is_active = true AND NEW.is_active = false THEN
                UPDATE posts SET comments_count = comments_count - 1 WHERE id = NEW.post_id;
            ELSIF OLD.is_active = false AND NEW.is_active = true THEN
                UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
            END IF;
        ELSIF TG_OP = 'DELETE' AND OLD.is_active = true THEN
            UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'post_shares' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE posts SET shares_count = shares_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE posts SET shares_count = shares_count - 1 WHERE id = OLD.post_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for post engagement counts
CREATE TRIGGER update_post_likes_count_trigger
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_engagement_count();

CREATE TRIGGER update_post_comments_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_engagement_count();

CREATE TRIGGER update_post_shares_count_trigger
    AFTER INSERT OR DELETE ON post_shares
    FOR EACH ROW EXECUTE FUNCTION update_post_engagement_count();

-- ============================================
-- SAMPLE DATA (OPTIONAL)
-- ============================================

-- Insert sample study plans
INSERT INTO study_plans (title, description, duration_days, difficulty, category, created_by, is_public) VALUES
('30-Day New Testament Journey', 'Read through key New Testament books in 30 days', 30, 'beginner', 'new_testament', '00000000-0000-0000-0000-000000000000', true),
('Psalms of Comfort', 'Study comforting Psalms for difficult times', 14, 'intermediate', 'old_testament', '00000000-0000-0000-0000-000000000000', true),
('Prayer Life Transformation', 'Deepen your prayer life through scripture study', 21, 'advanced', 'topical', '00000000-0000-0000-0000-000000000000', true);

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '🎉 Gathered database setup complete!';
    RAISE NOTICE '✅ All tables created';
    RAISE NOTICE '✅ All indexes created';
    RAISE NOTICE '✅ All RLS policies created';
    RAISE NOTICE '✅ All triggers and functions created';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update your .env.local with Supabase credentials';
    RAISE NOTICE '2. Run: npm run dev';
    RAISE NOTICE '3. Test your app at http://localhost:3000';
    RAISE NOTICE '4. Deploy to Vercel: npm run deploy';
END $$;












