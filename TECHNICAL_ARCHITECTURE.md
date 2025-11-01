# Technical Architecture
## Fellowship Engagement Rate (FER) System

**Last Updated:** November 1, 2025

---

## 🏗️ System Overview

Gathered's engagement tracking system is built to measure and encourage deep fellowship participation through the Fellowship Engagement Rate (FER) metric.

---

## 📊 FER Calculation

### Core Formula

```javascript
function calculateFER(fellowshipId, period = 'week') {
  const engagement = getEngagementEvents(fellowshipId, period)
  
  const points = {
    posts: 2,
    prayers: 1.5,
    events: 3,
    checkIns: 1,
    devotions: 2
  }
  
  const totalPoints = Object.entries(points).reduce((sum, [action, weight]) => {
    const count = engagement.filter(e => e.action_type === action).length
    return sum + (count * weight)
  }, 0)
  
  const memberCount = getMemberCount(fellowshipId)
  
  return totalPoints / memberCount
}
```

### Weighting Rationale
- **Events (3x):** Highest value - bring community together physically
- **Posts & Devotions (2x):** Medium value - demonstrate active spiritual engagement
- **Prayers (1.5x):** Valuable but faster to do
- **Check-ins (1x):** Minimal barrier to entry

---

## 🔄 Engagement Tracking Flow

```
┌─────────────────┐
│  User Action    │
│  (Post/Prayer/  │
│   Event/etc)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Track Event    │
│  POST /api/     │
│  engagement/    │
│  track          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Award Points   │
│  + Update FER   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Streaks  │
│  Update Badges  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update UI      │
│  Real-time FER  │
└─────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables

#### `engagement_events`
Primary table tracking all engagement actions.

```sql
CREATE TABLE engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('post', 'prayer', 'devotion', 'check-in', 'event')),
  points INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_points CHECK (points >= 0)
);

-- Indexes for performance
CREATE INDEX idx_engagement_user ON engagement_events(user_id, created_at DESC);
CREATE INDEX idx_engagement_fellowship ON engagement_events(fellowship_id, created_at DESC);
CREATE INDEX idx_engagement_type ON engagement_events(action_type, created_at DESC);
CREATE INDEX idx_engagement_period ON engagement_events(fellowship_id, created_at DESC) 
  WHERE created_at > NOW() - INTERVAL '30 days';
```

#### `streaks`
Tracks consecutive activity for gamification.

```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL CHECK (streak_type IN ('fellowship', 'prayer', 'devotion')),
  current_streak INTEGER DEFAULT 1 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 1 CHECK (longest_streak >= 0),
  last_activity_date DATE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT streak_consistency CHECK (current_streak <= longest_streak)
);

CREATE UNIQUE INDEX idx_streaks_unique ON streaks(user_id, fellowship_id, streak_type);
CREATE INDEX idx_streaks_active ON streaks(fellowship_id, current_streak DESC) WHERE current_streak > 0;
```

#### `achievements`
Defines available badges and milestones.

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('community', 'consistency', 'leadership', 'spiritual')),
  criteria JSONB NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO achievements (code, name, description, category, criteria, icon) VALUES
  ('first_post', 'First Post', 'Share your first post in a fellowship', 'community', '{"action_count": {"post": 1}}', '🌟'),
  ('weekly_helper', 'Weekly Helper', 'Post or comment every day for a week', 'consistency', '{"streak_days": 7, "action": "post"}', '🔥'),
  ('prayer_warrior', 'Prayer Warrior', 'Offer 50 prayers in a month', 'spiritual', '{"action_count": {"prayer": 50}, "period": "month"}', '🙏'),
  ('devotion_master', 'Devotion Master', 'Complete 30 devotion threads', 'spiritual', '{"action_count": {"devotion": 30}}', '📖'),
  ('mentor', 'Mentor', 'Help 5 new members get started', 'leadership', '{"helped_members": 5}', '🤝');
```

#### `user_achievements`
Tracks which badges users have earned.

```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_achievement UNIQUE (user_id, fellowship_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_fellowship ON user_achievements(fellowship_id);
```

#### `check_in_prompts`
Steward-generated weekly prompts.

```sql
CREATE TABLE check_in_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE,
  steward_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('wellness', 'prayer', 'gratitude', 'reflection', 'feedback')),
  question TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'archived')),
  steward_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_check_in_prompt_fellowship ON check_in_prompts(fellowship_id, status, scheduled_for DESC);
CREATE INDEX idx_check_in_prompt_active ON check_in_prompts(fellowship_id) WHERE status = 'active';
```

#### `check_in_responses`
Member responses to prompts.

```sql
CREATE TABLE check_in_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES check_in_prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_response UNIQUE (prompt_id, user_id)
);

CREATE INDEX idx_check_in_responses_prompt ON check_in_responses(prompt_id, created_at DESC);
CREATE INDEX idx_check_in_responses_user ON check_in_responses(user_id, created_at DESC);
```

#### `share_tracking`
Tracks content shared externally.

```sql
CREATE TABLE share_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fellowship_id UUID REFERENCES fellowships(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('event', 'prayer', 'devotion', 'post', 'testimony')),
  content_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'instagram', 'email', 'other')),
  metadata JSONB DEFAULT '{}',
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_share_tracking_user ON share_tracking(user_id, shared_at DESC);
CREATE INDEX idx_share_tracking_fellowship ON share_tracking(fellowship_id, shared_at DESC);
CREATE INDEX idx_share_tracking_platform ON share_tracking(platform, shared_at DESC);
```

---

## 🔧 API Endpoints

### Engagement Tracking

#### `POST /api/engagement/track`
Track a user's engagement action.

**Request:**
```json
{
  "action": "post",
  "fellowshipId": "uuid",
  "metadata": {
    "postId": "uuid",
    "type": "encouragement"
  }
}
```

**Response:**
```json
{
  "success": true,
  "pointsAwarded": 2,
  "currentFER": 15.8,
  "streaksUpdated": true,
  "badgesEarned": ["first_post"]
}
```

**Implementation:**
```typescript
async function trackEngagement(req: Request, res: Response) {
  const { action, fellowshipId, metadata } = req.body
  const userId = req.user.id
  
  // Award points
  const points = getPointsForAction(action)
  await db.engagement_events.insert({
    user_id: userId,
    fellowship_id: fellowshipId,
    action_type: action,
    points,
    metadata
  })
  
  // Update FER
  const fer = await updateFER(fellowshipId)
  
  // Check streaks
  const streaksUpdated = await checkAndUpdateStreaks(userId, fellowshipId, action)
  
  // Check achievements
  const badgesEarned = await checkAndAwardAchievements(userId, fellowshipId, action)
  
  // Real-time update
  await broadcastToFellowship(fellowshipId, {
    type: 'fer_update',
    fer: fer,
    userPoints: points
  })
  
  res.json({
    success: true,
    pointsAwarded: points,
    currentFER: fer,
    streaksUpdated,
    badgesEarned
  })
}
```

#### `GET /api/engagement/fer/:fellowshipId`
Get current FER and trends.

**Response:**
```json
{
  "fer": 15.8,
  "trend": "up",
  "change": 1.2,
  "period": "week",
  "breakdown": {
    "posts": 6.0,
    "prayers": 4.5,
    "events": 3.0,
    "devotions": 2.0,
    "checkIns": 0.3
  }
}
```

#### `GET /api/engagement/streaks/:userId`
Get user's current streaks.

**Response:**
```json
{
  "streaks": [
    {
      "type": "fellowship",
      "current": 4,
      "longest": 6,
      "lastActivity": "2025-10-28"
    },
    {
      "type": "prayer",
      "current": 12,
      "longest": 12,
      "lastActivity": "2025-10-31"
    }
  ]
}
```

### Steward Tools

#### `GET /api/steward/dashboard/:fellowshipId`
Get comprehensive steward dashboard data.

**Response:**
```json
{
  "fer": {
    "current": 15.8,
    "trend": "up",
    "change": 1.2
  },
  "growth": {
    "memberCount": 24,
    "change": 2,
    "topContributors": [...]
  },
  "checkIns": [
    {
      "id": "uuid",
      "question": "How's your week going?",
      "responses": 18,
      "total": 24
    }
  ],
  "weeklyActivity": {
    "posts": 12,
    "prayers": 8,
    "devotions": 5,
    "events": 1
  }
}
```

#### `POST /api/steward/check-in`
Create a check-in prompt.

**Request:**
```json
{
  "fellowshipId": "uuid",
  "template": "wellness",
  "scheduledFor": "2025-11-04T09:00:00Z",
  "customQuestion": "How can we support you this week?"
}
```

---

## ⚡ Real-Time Updates

### WebSocket Channels

#### `fellowship:fer:${fellowshipId}`
Broadcast FER updates to all fellowship members.

```typescript
// When engagement occurs
broadcast(fellowshipId, {
  type: 'fer_update',
  fer: 15.8,
  action: 'post',
  user: { name: 'Sarah M.' },
  timestamp: Date.now()
})
```

#### `user:achievements:${userId}`
Notify user of new badges earned.

```typescript
broadcast(userId, {
  type: 'achievement_earned',
  achievement: {
    code: 'first_post',
    name: 'First Post',
    icon: '🌟'
  }
})
```

---

## 🔍 Analytics Queries

### Weekly FER Calculation

```sql
WITH engagement_scores AS (
  SELECT 
    fellowship_id,
    SUM(
      CASE action_type
        WHEN 'post' THEN points * 2
        WHEN 'prayer' THEN points * 1.5
        WHEN 'event' THEN points * 3
        WHEN 'devotion' THEN points * 2
        WHEN 'check-in' THEN points * 1
        ELSE points
      END
    ) as total_points
  FROM engagement_events
  WHERE created_at >= NOW() - INTERVAL '7 days'
  GROUP BY fellowship_id
),
member_counts AS (
  SELECT fellowship_id, COUNT(*) as member_count
  FROM fellowship_members
  WHERE status = 'active'
  GROUP BY fellowship_id
)
SELECT 
  es.fellowship_id,
  es.total_points / NULLIF(mc.member_count, 0) as fer
FROM engagement_scores es
JOIN member_counts mc ON es.fellowship_id = mc.fellowship_id;
```

### Top Contributors

```sql
SELECT 
  u.id,
  u.name,
  u.avatar,
  SUM(ee.points) as total_points,
  COUNT(ee.id) as activity_count
FROM users u
JOIN engagement_events ee ON u.id = ee.user_id
WHERE ee.fellowship_id = $1
  AND ee.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.name, u.avatar
ORDER BY total_points DESC
LIMIT 10;
```

### Streak Maintenance

```sql
-- Update streaks when activity occurs
WITH last_activity AS (
  SELECT 
    user_id,
    fellowship_id,
    MAX(last_activity_date) as last_date,
    current_streak
  FROM streaks
  WHERE user_id = $1 AND fellowship_id = $2 AND streak_type = $3
  GROUP BY user_id, fellowship_id, current_streak
),
streak_check AS (
  SELECT 
    *,
    CASE 
      WHEN last_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
      WHEN last_date = CURRENT_DATE THEN current_streak
      ELSE 1
    END as new_streak
  FROM last_activity
)
UPDATE streaks s
SET 
  current_streak = sc.new_streak,
  longest_streak = GREATEST(s.longest_streak, sc.new_streak),
  last_activity_date = CURRENT_DATE,
  updated_at = NOW()
FROM streak_check sc
WHERE s.user_id = sc.user_id 
  AND s.fellowship_id = sc.fellowship_id
  AND s.streak_type = sc.streak_type;
```

---

## 🎨 Frontend Integration

### Engagement Tracking Hook

```typescript
// hooks/useEngagement.ts
export function useEngagement(fellowshipId: string) {
  const [fer, setFER] = useState(0)
  const [streaks, setStreaks] = useState<Streak[]>([])
  
  const trackAction = async (action: EngagementAction, metadata?: object) => {
    const response = await fetch('/api/engagement/track', {
      method: 'POST',
      body: JSON.stringify({ action, fellowshipId, metadata })
    })
    
    const data = await response.json()
    setFER(data.currentFER)
    
    // Show success toast
    toast.success(`+${data.pointsAwarded} points!`)
    
    // Show achievement earned
    if (data.badgesEarned.length > 0) {
      data.badgesEarned.forEach((badge: string) => {
        toast.success(`🏅 ${badge} unlocked!`)
      })
    }
  }
  
  useEffect(() => {
    // WebSocket subscription
    const channel = supabase
      .channel(`fellowship-${fellowshipId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'engagement_events',
        filter: `fellowship_id=eq.${fellowshipId}`
      }, () => {
        // Refresh FER
        fetchFER()
      })
      .subscribe()
    
    return () => channel.unsubscribe()
  }, [fellowshipId])
  
  return { fer, streaks, trackAction }
}
```

### Steward Dashboard Hook

```typescript
// hooks/useStewardDashboard.ts
export function useStewardDashboard(fellowshipId: string) {
  const [dashboard, setDashboard] = useState<StewardDashboard | null>(null)
  
  useEffect(() => {
    fetchDashboard()
  }, [fellowshipId])
  
  const fetchDashboard = async () => {
    const response = await fetch(`/api/steward/dashboard/${fellowshipId}`)
    const data = await response.json()
    setDashboard(data)
  }
  
  const exportWeeklySummary = async (format: ExportFormat) => {
    const response = await fetch(`/api/export/weekly-summary`, {
      method: 'POST',
      body: JSON.stringify({ fellowshipId, format })
    })
    
    const { downloadUrl } = await response.json()
    window.open(downloadUrl, '_blank')
  }
  
  return { dashboard, exportWeeklySummary, refetch: fetchDashboard }
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('FER Calculation', () => {
  it('should calculate FER correctly', () => {
    const engagement = [
      { action: 'post', count: 10 },
      { action: 'prayer', count: 8 },
      { action: 'event', count: 2 }
    ]
    const memberCount = 20
    
    const fer = calculateFER(engagement, memberCount)
    expect(fer).toBe(2.0) // (10*2 + 8*1.5 + 2*3) / 20
  })
})
```

### Integration Tests

```typescript
describe('Engagement Tracking', () => {
  it('should track action and update FER', async () => {
    const response = await request(app)
      .post('/api/engagement/track')
      .send({ action: 'post', fellowshipId: 'test-id' })
    
    expect(response.body.success).toBe(true)
    expect(response.body.pointsAwarded).toBe(2)
  })
})
```

---

This technical architecture provides a robust, scalable foundation for measuring and encouraging deep fellowship engagement! 🚀


