# Gathered Product Roadmap
## Fellowship-First Design for Youth Communities

**Vision:** Make Gathered deeply useful for youth fellowships by focusing on intimacy, shared devotion, and consistent engagement — without replacing WhatsApp/Instagram.

**Last Updated:** November 1, 2025

---

## 🎯 Core Philosophy

### Fellowship-First Design
- **Intimacy over scale:** Optimize for small groups (5-30 members)
- **Shared devotion:** Make spiritual growth collaborative and visible
- **Consistent activity:** Encourage weekly check-ins and regular engagement
- **Warmth & emotion:** Create spaces that feel welcoming and personal

### Integration over Replacement
- **Complement existing tools:** WhatsApp, Instagram, Email
- **Add spiritual context:** Fellowship feeds, devotion threads, check-ins
- **Share beyond platform:** Deep-links, story cards, email summaries
- **Lower friction:** Make sharing effortless

---

## 📊 Key Performance Indicators (KPIs)

### Primary Metric: Fellowship Engagement Rate (FER)

**Formula:**
```
FER = (
  (Posts Shared × 2) +
  (Prayers Made × 1.5) +
  (Events Attended × 3) +
  (Check-ins Completed × 1) +
  (Devotion Threads × 2)
) / Total Members
```

**Target FER:** 15+ points per member per week

### Secondary Metrics
- **Fellowship Health Score:** Combination of FER, member retention, and activity consistency
- **Spiritual Growth Indicators:** Devotion completion, prayer engagement, testimony sharing
- **Steward Effectiveness:** Member growth, engagement quality, prompt response rate

---

## 🏗️ Product Architecture

### 1. Fellowship-First Navigation

**Core Tabs (Mobile-First):**
```
┌────────────────────────┐
│  Home (Dashboard)      │  ← Fellowship Feed + Verse + Quick Actions
│  Fellowships           │  ← Browse/Join/Manage
│  Events                │  ← Calendar + RSVP
│  Messages              │  ← Fellowship Chats
│  Profile               │  ← Personal Stats + Settings
└────────────────────────┘
```

**Removed from Main Nav:**
- Testimonies (→ Merged into Fellowship Feed)
- Prayers (→ Merged into Fellowship Feed)
- Devotions (→ Merged into Fellowship Feed)

**Rationale:** All spiritual content lives in the context of fellowship community.

---

### 2. Unified Fellowship Feed

**Component:** `FellowshipFeed.tsx`

**Content Types Merged:**
1. **Posts:** General updates, announcements, encouragements
2. **Prayers:** Prayer requests, praise reports
3. **Testimonies:** Member stories, faith journeys
4. **Devotions:** Weekly reading threads, scripture discussions
5. **Check-ins:** Weekly prompts, reflection questions
6. **Events:** Upcoming gatherings, RSVPs
7. **Celebrations:** Birthdays, achievements, milestones

**Feed Features:**
- **Color-coded by type:** Visual distinction (prayer=purple, testimony=green, devotion=blue)
- **Engagement tracking:** Like, comment, share, pray buttons
- **Context-aware:** Show fellowship members, related events
- **Share integrations:** WhatsApp, Instagram Story, Email

**Sample Feed Post:**
```
[Prayer Icon] Young Adults Bible Study      2h ago
┌────────────────────────────────────────┐
│ "Please pray for our final exams...    │
│  🙏"                                     │
│                                        │
│  Sarah M.                               │
│  [Pray for This] [💬 5] [Share]        │
└────────────────────────────────────────┘
```

---

### 3. Fellowship Engagement System

#### A. Streak Tracking
**Component:** `EngagementStreak.tsx`

**Types:**
- **Fellowship Streak:** Consecutive weeks with activity
- **Prayer Streak:** Consecutive prayers offered
- **Devotion Streak:** Consecutive devotion completions

**Visual Feedback:**
```
🔥 Fellowship Streak: 4 weeks
💪 Prayer Streak: 12 days
✨ Devotion Streak: 8 days
```

#### B. Growth Cards
**Component:** `GrowthCard.tsx`

**Metrics Shown:**
- Total members (this month vs last month)
- Average FER (trending up/down)
- Top contributors (who's most engaged)
- Milestones reached

**Sample Card:**
```
┌────────────────────────────────┐
│  Fellowship Growth 📈          │
│                                │
│  24 members (+2 this month)   │
│  Avg FER: 18.5 ↑ 15%          │
│                                │
│  Top Contributors:            │
│  🥇 Sarah M. (28 pts)         │
│  🥈 Mike C. (22 pts)          │
│  🥉 Emily L. (18 pts)         │
└────────────────────────────────┘
```

#### C. Achievement Badges
**Component:** `AchievementBadges.tsx`

**Badge Categories:**
- **Community:** First Post, First Prayer, Weekly Helper
- **Consistency:** 4-Week Streak, Devotion Master, Prayer Warrior
- **Leadership:** Mentor, Encourager, Organizer
- **Spiritual:** Testimony Sharer, Faith Walker, Grace Giver

**Badge Display:**
```
🏅 Badges (6 earned)
New: Faith Walker
View All →
```

---

### 4. Check-In Prompts

**Component:** `CheckInPrompt.tsx`

**Types:**
- **Weekly Spiritual Check-in:** "How's your faith journey this week?"
- **Prayer Request:** "What can we pray for you?"
- **Gratitude Share:** "What are you thankful for?"
- **Verse Reflection:** "How did this week's verse impact you?"

**Steward Features:**
- Pre-written templates
- Scheduled prompts
- Response tracking
- Follow-up notifications

---

### 5. Social Media Integrations

#### A. WhatsApp Deep-Links
**Endpoint:** `/api/share/whatsapp`

**Use Cases:**
- Share event: `whatsapp://send?text=[Event Title] - Join us...`
- Share prayer request: `whatsapp://send?text=Please pray for...`
- Share devotion: `whatsapp://send?text=This week's reading...`

**Implementation:**
```javascript
const shareToWhatsApp = (content, fellowshipId) => {
  const encoded = encodeURIComponent(content)
  const link = `whatsapp://send?text=${encoded}`
  window.location.href = link
}
```

#### B. Instagram Story Card Generation
**Endpoint:** `/api/share/instagram`

**Flow:**
1. User clicks "Create Story Card"
2. Generate beautiful card with:
   - Fellowship logo/branding
   - Event details or prayer request
   - Call-to-action button
3. Return as image download or clipboard

**Story Card Template:**
```
┌──────────────────────┐
│  [Fellowship Logo]   │
│                      │
│  📅 Sunday Gathering  │
│  Join us at 10 AM    │
│  Main Sanctuary      │
│                      │
│  [Gathered.app badge]│
│  Tap to RSVP →       │
└──────────────────────┘
```

#### C. Email Weekly Summary
**Endpoint:** `/api/export/weekly-summary`

**Template:**
```
Subject: Your Fellowship Week at a Glance

Hi [Member Name],

This week at [Fellowship Name]:

📊 Activity Overview
- 12 posts shared
- 8 prayers offered
- 5 devotion completions
- Average FER: 16.2

🎉 Highlights
- [Member] shared a powerful testimony
- [Event] had 24 RSVPs
- Fellowship streak: 6 weeks strong!

📅 Coming Up
- [Event] this Sunday at 10 AM
- Weekly check-in prompt posted

[View Full Summary] [RSVP to Event]

Blessings,
The Gathered Team
```

---

## 🛠️ Steward Tools

### 1. Weekly Fellowship Summary Generator

**Component:** `StewardDashboard.tsx` → `WeeklySummaryGenerator.tsx`

**Auto-Generated Content:**
- **Activity Report:** Posts, prayers, check-ins, devotions
- **Engagement Analysis:** FER trending, top contributors
- **Spiritual Insights:** Common prayer themes, devotion responses
- **Member Health:** Active vs. quiet members
- **Event Feedback:** Attendance rates, participation quality

**Export Options:**
- Email template (ready to personalize)
- PDF download
- WhatsApp message
- Fellowship announcement post

### 2. Quick Check-In Prompt Templates

**Component:** `CheckInTemplates.tsx`

**Templates:**
1. **"How are you doing?"** - Simple wellness check
2. **"Prayer request?"** - Invite sharing needs
3. **"Gratitude sharing"** - Encourage thanksgiving
4. **"Verse reflection"** - Spiritual growth check
5. **"Event feedback"** - Improve future gatherings

**Steward Features:**
- One-click post to Fellowship Feed
- Schedule for specific days
- Set response deadline
- Track completion rates

---

## 📦 Component Architecture Changes

### New Components

#### `FellowshipFeed.tsx` (Replaces AnnouncementFeed)
```typescript
interface FellowshipFeedItem {
  id: string
  type: 'post' | 'prayer' | 'testimony' | 'devotion' | 'check-in' | 'event' | 'celebration'
  fellowshipId: string
  fellowshipName: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  metadata?: {
    eventId?: string
    devotionId?: string
    checkInPrompt?: string
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    prayers?: number
  }
  createdAt: string
  expiresAt?: string
}
```

#### `EngagementStreak.tsx`
```typescript
interface StreakData {
  fellowshipId: string
  userId: string
  type: 'fellowship' | 'prayer' | 'devotion'
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
  milestones: StreakMilestone[]
}
```

#### `GrowthCard.tsx`
```typescript
interface GrowthMetrics {
  fellowshipId: string
  period: 'week' | 'month' | 'quarter'
  memberCount: {
    current: number
    previous: number
    change: number
  }
  avgFER: {
    current: number
    previous: number
    change: number
  }
  topContributors: Contributor[]
  milestones: Milestone[]
}
```

#### `CheckInPrompt.tsx`
```typescript
interface CheckInPrompt {
  id: string
  fellowshipId: string
  type: 'wellness' | 'prayer' | 'gratitude' | 'reflection' | 'feedback'
  question: string
  scheduledFor: string
  dueDate?: string
  responses: CheckInResponse[]
  stewardNotes?: string
}
```

#### `WeeklySummaryGenerator.tsx` (Steward Only)
```typescript
interface WeeklySummary {
  fellowshipId: string
  period: DateRange
  activity: ActivityReport
  engagement: EngagementReport
  spiritual: SpiritualInsights
  members: MemberHealth[]
  events: EventFeedback[]
  exportFormat: 'email' | 'pdf' | 'whatsapp' | 'post'
}
```

### Modified Components

#### `FellowshipActivityFeed.tsx` → Merged into `FellowshipFeed.tsx`
**Changes:** Expand to include devotions, check-ins, celebrations

#### `LeaderDashboard.tsx` → Enhanced with `StewardDashboard.tsx`
**Additions:**
- FER tracking dashboard
- Weekly summary generator
- Check-in prompt manager
- Export tools

---

## 🔌 Required API Endpoints

### Engagement Tracking
```typescript
POST /api/engagement/track
Body: {
  action: 'post' | 'prayer' | 'devotion' | 'check-in' | 'event'
  fellowshipId: string
  userId: string
  metadata?: object
}

GET /api/engagement/streaks/:userId
Response: StreakData[]

GET /api/engagement/fer/:fellowshipId
Response: { fer: number, trend: 'up' | 'down' | 'stable' }
```

### Social Media Integration
```typescript
POST /api/share/whatsapp
Body: { content: string, type: string, fellowshipId: string }

POST /api/share/instagram
Body: { template: string, data: object }
Response: { imageUrl: string, downloadLink: string }

POST /api/export/weekly-summary
Body: { fellowshipId: string, format: string }
Response: { content: string, downloadUrl?: string }
```

### Steward Tools
```typescript
GET /api/steward/dashboard/:fellowshipId
Response: { 
  fer: number, 
  growth: GrowthMetrics, 
  checkIns: CheckInPrompt[],
  weeklyActivity: ActivityReport
}

POST /api/steward/check-in
Body: { fellowshipId: string, template: string, scheduledFor: string }

GET /api/steward/summary/:fellowshipId/:period
Response: WeeklySummary
```

---

## 🗄️ Data Model Adjustments

### New Tables

#### `engagement_events`
```sql
CREATE TABLE engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  fellowship_id UUID REFERENCES fellowships(id),
  action_type TEXT NOT NULL, -- 'post', 'prayer', 'devotion', 'check-in', 'event'
  points INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_engagement_user ON engagement_events(user_id);
CREATE INDEX idx_engagement_fellowship ON engagement_events(fellowship_id);
CREATE INDEX idx_engagement_created ON engagement_events(created_at DESC);
```

#### `streaks`
```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  fellowship_id UUID REFERENCES fellowships(id),
  streak_type TEXT NOT NULL, -- 'fellowship', 'prayer', 'devotion'
  current_streak INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  last_activity_date DATE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_streaks_user_fellowship_type 
ON streaks(user_id, fellowship_id, streak_type);
```

#### `check_in_prompts`
```sql
CREATE TABLE check_in_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fellowship_id UUID REFERENCES fellowships(id),
  steward_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  question TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'completed'
  steward_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE check_in_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES check_in_prompts(id),
  user_id UUID REFERENCES users(id),
  response TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `share_tracking`
```sql
CREATE TABLE share_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  fellowship_id UUID REFERENCES fellowships(id),
  content_type TEXT NOT NULL, -- 'event', 'prayer', 'devotion', 'post'
  content_id UUID NOT NULL,
  platform TEXT NOT NULL, -- 'whatsapp', 'instagram', 'email', 'other'
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Modified Tables

#### `fellowships`
```sql
ALTER TABLE fellowships ADD COLUMN IF NOT EXISTS current_fer DECIMAL(5,2) DEFAULT 0;
ALTER TABLE fellowships ADD COLUMN IF NOT EXISTS member_count INTEGER DEFAULT 0;
ALTER TABLE fellowships ADD COLUMN IF NOT EXISTS last_fer_update TIMESTAMP WITH TIME ZONE;
```

#### `users`
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_engagement_points INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS achievement_badges JSONB DEFAULT '[]';
```

---

## 📅 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- ✅ Unified Fellowship Feed component
- ✅ Engagement tracking system
- ✅ Basic FER calculation
- ✅ Streak tracking

### Phase 2: Engagement Features (Weeks 3-4)
- [ ] Growth cards
- [ ] Achievement badges
- [ ] Check-in prompts
- [ ] Visual feedback loops

### Phase 3: Steward Tools (Weeks 5-6)
- [ ] Weekly summary generator
- [ ] FER dashboard
- [ ] Check-in template manager
- [ ] Export tools

### Phase 4: Social Integration (Weeks 7-8)
- [ ] WhatsApp deep-links
- [ ] Instagram Story cards
- [ ] Email templates
- [ ] Share tracking

### Phase 5: Polish & Launch (Weeks 9-10)
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Beta testing with 3-5 fellowships
- [ ] Production launch

---

## 🎯 Success Metrics

### Week 1-4 (Early Adoption)
- **Target:** 3-5 active fellowships
- **FER Goal:** 10+ points per member
- **Engagement:** 60%+ members posting weekly

### Week 5-8 (Growth)
- **Target:** 10-15 active fellowships
- **FER Goal:** 15+ points per member
- **Engagement:** 70%+ members posting weekly
- **Retention:** 80%+ month-over-month

### Week 9-12 (Scale)
- **Target:** 20-30 active fellowships
- **FER Goal:** 18+ points per member
- **Engagement:** 75%+ members posting weekly
- **Retention:** 85%+ month-over-month

---

## 🚀 Go-to-Market Strategy

### Fellowship-First Launch
1. **Invite 5 carefully selected fellowships** (optimal size: 15-25 members)
2. **Provide Steward onboarding** (30-min session per fellowship)
3. **Offer "Fellowship Kick-off Event"** (2-week check-in challenge)
4. **Gather feedback weekly** (adjust based on real usage)

### Viral Growth Mechanics
- **Share incentives:** "Share 3 posts this week → unlock badge"
- **Referral rewards:** "Invite 2 members → special achievement"
- **Community highlights:** "Top fellowship this month gets featured"

### Partnerships
- **Campus ministries:** Offer Gathered to university fellowships
- **Churches:** Provide Gathered for their youth groups
- **Non-profits:** Partner with Christian organizations

---

**Ready to build community that matters.** 🌿




