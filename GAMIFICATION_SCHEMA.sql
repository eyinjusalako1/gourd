-- Gathered Gamification System Database Schema
-- Fellowship Consistency & Shared Engagement

-- ============================================================================
-- FAITH FLAMES (Individual System)
-- ============================================================================

-- Track daily activities for Faith Flame streaks
CREATE TABLE faith_flames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  activity_count INTEGER DEFAULT 1 CHECK (activity_count >= 0),
  activity_type TEXT CHECK (activity_type IN ('prayer', 'testimony', 'post', 'comment')),
  points_awarded INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_day_activity UNIQUE (user_id, fellowship_id, activity_date, activity_type)
);

CREATE INDEX idx_faith_flames_user ON faith_flames(user_id, activity_date DESC);
CREATE INDEX idx_faith_flames_fellowship ON faith_flames(fellowship_id, activity_date DESC);
CREATE INDEX idx_faith_flames_streak ON faith_flames(user_id, fellowship_id, activity_date) 
  WHERE activity_date >= CURRENT_DATE - INTERVAL '30 days';

-- Track current Faith Flame streaks
CREATE TABLE faith_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 1 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 1 CHECK (longest_streak >= 0),
  last_activity_date DATE NOT NULL,
  flame_intensity TEXT DEFAULT 'ember' CHECK (flame_intensity IN ('out', 'ember', 'glow', 'burning', 'on-fire')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_fellowship_streak UNIQUE (user_id, fellowship_id),
  CONSTRAINT streak_consistency CHECK (current_streak <= longest_streak)
);

CREATE INDEX idx_faith_streaks_active ON faith_streaks(fellowship_id, current_streak DESC) 
  WHERE current_streak > 0;

-- ============================================================================
-- UNITY POINTS (Fellowship System)
-- ============================================================================

-- Track fellowship Unity Points by week
CREATE TABLE unity_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL, -- Monday of the week
  week_end DATE NOT NULL,   -- Sunday of the week
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
  participation_rate DECIMAL(5,2) DEFAULT 0, -- Percentage of members who participated
  member_count INTEGER DEFAULT 0,
  ember_meter_level INTEGER DEFAULT 0 CHECK (ember_meter_level >= 0 AND ember_meter_level <= 100),
  is_on_fire BOOLEAN DEFAULT FALSE, -- True if ember_meter_level >= 80
  weekly_message TEXT, -- Auto-generated celebration message
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_fellowship_week UNIQUE (fellowship_id, week_start)
);

CREATE INDEX idx_unity_points_fellowship ON unity_points(fellowship_id, week_start DESC);
CREATE INDEX idx_unity_points_on_fire ON unity_points(fellowship_id) WHERE is_on_fire = TRUE;

-- Track individual contributions to Unity Points
CREATE TABLE unity_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unity_points_id UUID REFERENCES unity_points(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  contribution_type TEXT CHECK (contribution_type IN ('post', 'prayer', 'testimony', 'event_attendance', 'check_in', 'comment')),
  points INTEGER NOT NULL CHECK (points >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_contribution UNIQUE (unity_points_id, user_id, contribution_type, DATE(created_at))
);

CREATE INDEX idx_unity_contributions_user ON unity_contributions(user_id, created_at DESC);
CREATE INDEX idx_unity_contributions_points ON unity_contributions(unity_points_id);

-- ============================================================================
-- WEEKLY CHALLENGES
-- ============================================================================

-- Challenge templates (curated by Gathered)
CREATE TABLE challenge_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('community', 'prayer', 'testimony', 'devotion', 'service', 'outreach')),
  requirements JSONB NOT NULL, -- e.g., {"action": "testimony", "count": 1, "period": "week"}
  icon TEXT NOT NULL,
  badge_reward TEXT, -- Badge code to award on completion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed challenge templates
INSERT INTO challenge_templates (title, description, category, requirements, icon, badge_reward) VALUES
  ('Share a Testimony', 'Share one testimony this week with your fellowship', 'testimony', 
   '{"action": "testimony", "count": 1, "period": "week"}'::jsonb, '💬', 'testimony_sharer'),
  ('Pray Together', 'Join in a group prayer or prayer request this week', 'prayer',
   '{"action": "prayer", "count": 1, "period": "week"}'::jsonb, '🙏', 'prayer_warrior'),
  ('Attend Event', 'RSVP and attend an upcoming fellowship event', 'community',
   '{"action": "event_attendance", "count": 1, "period": "month"}'::jsonb, '📅', 'event_goer'),
  ('Encourage Others', 'Leave 5 encouraging comments this week', 'community',
   '{"action": "comment", "count": 5, "period": "week"}'::jsonb, '🌟', 'encourager'),
  ('Weekly Check-In', 'Complete 3 check-in prompts this week', 'devotion',
   '{"action": "check_in", "count": 3, "period": "week"}'::jsonb, '✅', 'faith_walker');

-- Active challenges (Steward-selected)
CREATE TABLE weekly_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES challenge_templates(id) ON DELETE CASCADE NOT NULL,
  steward_id UUID REFERENCES users(id) ON DELETE SET NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  completion_threshold INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_weekly_challenges_fellowship ON weekly_challenges(fellowship_id, status, week_start DESC);
CREATE INDEX idx_weekly_challenges_active ON weekly_challenges(fellowship_id, status) WHERE status = 'active';

-- Track challenge progress
CREATE TABLE challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES weekly_challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_challenge UNIQUE (challenge_id, user_id)
);

CREATE INDEX idx_challenge_progress_challenge ON challenge_progress(challenge_id, is_completed);
CREATE INDEX idx_challenge_progress_user ON challenge_progress(user_id, completed_at DESC);

-- ============================================================================
-- BLESSING BADGES
-- ============================================================================

-- Badge definitions
CREATE TABLE blessing_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('community', 'consistency', 'leadership', 'spiritual', 'challenge')),
  icon TEXT NOT NULL,
  glow_color TEXT, -- Hex color for glow effect
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  requirements JSONB NOT NULL, -- Criteria for earning
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed blessing badges
INSERT INTO blessing_badges (code, name, description, category, icon, glow_color, rarity, requirements) VALUES
  ('first_flame', 'First Flame', 'Light your first Faith Flame', 'spiritual', '🕯️', '#F5C451', 'common', '{"action": "any_activity", "count": 1}'::jsonb),
  ('week_warrior', 'Week Warrior', 'Keep your flame burning for 7 days', 'consistency', '🔥', '#FF6B35', 'uncommon', '{"streak_days": 7}'::jsonb),
  ('encourager', 'Encourager', 'Leave 10 encouraging comments', 'community', '💝', '#FFD700', 'common', '{"action": "comment", "count": 10}'::jsonb),
  ('prayer_warrior', 'Prayer Warrior', 'Offer 20 prayers in a month', 'spiritual', '🙏', '#9370DB', 'rare', '{"action": "prayer", "count": 20, "period": "month"}'::jsonb),
  ('testimony_sharer', 'Testimony Sharer', 'Share 3 powerful testimonies', 'spiritual', '✨', '#FF1493', 'uncommon', '{"action": "testimony", "count": 3}'::jsonb),
  ('faith_builder', 'Faith Builder', 'Complete 5 weekly challenges', 'consistency', '🏗️', '#00CED1', 'rare', '{"challenges_completed": 5}'::jsonb),
  ('unity_champion', 'Unity Champion', 'Your fellowship stayed on fire for 4 weeks', 'leadership', '👑', '#FFD700', 'epic', '{"unity_fire_weeks": 4}'::jsonb),
  ('month_warrior', 'Month Warrior', 'Keep your flame burning for 30 days', 'consistency', '🔥🔥', '#FF4500', 'epic', '{"streak_days": 30}'::jsonb);

-- User badges (earned)
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE, -- NULL for platform-wide badges
  badge_id UUID REFERENCES blessing_badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT unique_user_badge UNIQUE (user_id, fellowship_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id, earned_at DESC);
CREATE INDEX idx_user_badges_featured ON user_badges(user_id, is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_user_badges_fellowship ON user_badges(fellowship_id, earned_at DESC);

-- ============================================================================
-- FELLOWSHIP HIGHLIGHTS
-- ============================================================================

-- Track fellowship highlights for public display
CREATE TABLE fellowship_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE NOT NULL,
  highlight_type TEXT CHECK (highlight_type IN ('on_fire', 'streak_milestone', 'unity_champion', 'growth_surge')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon TEXT NOT NULL,
  points_or_streak INTEGER,
  threshold_met INTEGER, -- The milestone reached
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  display_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_until TIMESTAMP WITH TIME ZONE, -- NULL for permanent highlights
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_fellowship_highlights_active ON fellowship_highlights(fellowship_id, display_start, display_until) 
  WHERE is_public = TRUE AND (display_until IS NULL OR display_until > NOW());
CREATE INDEX idx_fellowship_highlights_fire ON fellowship_highlights(highlight_type) WHERE highlight_type = 'on_fire';

-- ============================================================================
-- AUTOMATED RESET FUNCTIONS
-- ============================================================================

-- Function to calculate Faith Flame intensity
CREATE OR REPLACE FUNCTION calculate_flame_intensity(streak_days INTEGER)
RETURNS TEXT AS $$
BEGIN
  CASE
    WHEN streak_days = 0 THEN RETURN 'out';
    WHEN streak_days BETWEEN 1 AND 2 THEN RETURN 'ember';
    WHEN streak_days BETWEEN 3 AND 6 THEN RETURN 'glow';
    WHEN streak_days BETWEEN 7 AND 13 THEN RETURN 'burning';
    WHEN streak_days >= 14 THEN RETURN 'on-fire';
    ELSE RETURN 'ember';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update Unity Points
CREATE OR REPLACE FUNCTION update_unity_points()
RETURNS VOID AS $$
DECLARE
  current_week_start DATE;
  current_week_end DATE;
BEGIN
  -- Get current week (Monday-Sunday)
  current_week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  current_week_end := current_week_start + INTERVAL '6 days';
  
  -- Update or create Unity Points for each fellowship
  INSERT INTO unity_points (fellowship_id, week_start, week_end, total_points, member_count, ember_meter_level, is_on_fire)
  SELECT 
    f.id as fellowship_id,
    current_week_start,
    current_week_end,
    COALESCE(SUM(uc.points), 0) as total_points,
    COUNT(DISTINCT uc.user_id) as member_count,
    LEAST(100, COALESCE(SUM(uc.points)::FLOAT / NULLIF(f.member_count, 0) * 10, 0)::INTEGER) as ember_meter_level,
    (COALESCE(SUM(uc.points)::FLOAT / NULLIF(f.member_count, 0) * 10, 0)) >= 80 as is_on_fire
  FROM fellowships f
  LEFT JOIN faith_flames ff ON f.id = ff.fellowship_id AND ff.activity_date >= current_week_start
  LEFT JOIN unity_contributions uc ON f.id = uc.fellowship_id AND uc.created_at >= current_week_start
  WHERE f.status = 'active'
  GROUP BY f.id, f.member_count
  ON CONFLICT (fellowship_id, week_start) 
  DO UPDATE SET
    total_points = EXCLUDED.total_points,
    member_count = EXCLUDED.member_count,
    ember_meter_level = EXCLUDED.ember_meter_level,
    is_on_fire = EXCLUDED.is_on_fire,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to reset weekly challenges
CREATE OR REPLACE FUNCTION reset_weekly_challenges()
RETURNS VOID AS $$
BEGIN
  -- Mark expired challenges
  UPDATE weekly_challenges
  SET status = 'expired'
  WHERE week_end < CURRENT_DATE
    AND status = 'active';
  
  -- Reset challenge progress for next week
  DELETE FROM challenge_progress
  WHERE challenge_id IN (
    SELECT id FROM weekly_challenges
    WHERE week_end < CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create fellowship highlights
CREATE OR REPLACE FUNCTION create_fellowship_highlights()
RETURNS VOID AS $$
DECLARE
  current_week_start DATE;
  highlight_count INTEGER;
BEGIN
  current_week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  
  -- Create highlights for fellowships "on fire"
  INSERT INTO fellowship_highlights (fellowship_id, highlight_type, title, message, icon, is_public, period_start, period_end)
  SELECT 
    up.fellowship_id,
    'on_fire',
    'Your Fellowship is On Fire! 🔥',
    'Your fellowship stayed on fire this week! ' || up.total_points || ' Unity Points earned together.',
    '🔥',
    TRUE,
    up.week_start,
    up.week_end
  FROM unity_points up
  WHERE up.is_on_fire = TRUE
    AND up.week_start = current_week_start
    AND NOT EXISTS (
      SELECT 1 FROM fellowship_highlights fh
      WHERE fh.fellowship_id = up.fellowship_id 
        AND fh.period_start = up.week_start
        AND fh.highlight_type = 'on_fire'
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SCHEDULED JOBS (to be set up in Supabase)
-- ============================================================================

-- Daily: Update Faith Flame streaks and intensities
-- Runs: Every day at 2 AM
-- Function: Check all users' last activity, update streaks, dim/reset if inactive 3+ days

-- Weekly: Calculate Unity Points, reset challenges, create highlights
-- Runs: Every Monday at 3 AM
-- Functions: update_unity_points(), reset_weekly_challenges(), create_fellowship_highlights()

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Faith Flames: Users can only see their own and their fellowship's
ALTER TABLE faith_flames ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own faith flames"
  ON faith_flames FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view fellowship faith flames"
  ON faith_flames FOR SELECT
  USING (
    fellowship_id IN (
      SELECT fellowship_id FROM fellowship_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Faith Streaks: Public to fellowship members
ALTER TABLE faith_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view fellowship streaks"
  ON faith_streaks FOR SELECT
  USING (
    fellowship_id IN (
      SELECT fellowship_id FROM fellowship_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Unity Points: Public to fellowship members
ALTER TABLE unity_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view fellowship unity points"
  ON unity_points FOR SELECT
  USING (
    fellowship_id IN (
      SELECT fellowship_id FROM fellowship_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- User Badges: Public to fellowship members
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view fellowship badges"
  ON user_badges FOR SELECT
  USING (
    fellowship_id IN (
      SELECT fellowship_id FROM fellowship_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
    OR fellowship_id IS NULL -- Platform-wide badges are public
  );


