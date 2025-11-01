# Gamification System Implementation Guide
## Faith Flames, Unity Points & Fellowship Engagement

**Last Updated:** November 1, 2025

---

## 🎯 System Overview

Gathered's gamification system is designed around **fellowship consistency and shared engagement**—not competition. It celebrates spiritual participation through Faith Flames, Unity Points, Weekly Challenges, and Blessing Badges.

---

## 🔥 Faith Flames (Individual System)

### Concept
Track daily spiritual activity to maintain a personal "Faith Flame" that glows brighter with consistency.

### Intensity Levels
```
Streak Days    Intensity    Icon    Visual
0              out          💨      Dim/gray
1-2            ember        🕯️      Flicker, soft yellow
3-6            glow         ✨      Pulsing, bright yellow
7-13           burning      🔥      Strong pulse, orange
14+            on-fire      🔥🔥    Intense pulse, red-gold
```

### Activity Tracking
**Activities that count:**
- Prayer request posted or prayed for
- Testimony shared
- Fellowship post created
- Encouraging comment left

**Scoring:**
- **1 activity/day** maintains streak
- **2+ activities/day** adds intensity bonus
- **3 inactive days** → Flame dims to ember
- **7+ inactive days** → Flame goes out

### Implementation
```typescript
// Component: FaithFlame.tsx
<FaithFlame 
  userId="user-123" 
  fellowshipId="fellowship-456" 
  size="md"
  showText={true} 
/>

// Displays:
// 🔥 7 days strong
// with animated glow effect
```

### Database
- `faith_flames` - Daily activity log
- `faith_streaks` - Current streak tracking

---

## 🔥 Unity Points (Fellowship System)

### Concept
Collective engagement metric that fills a Fellowship Ember Meter. When full (80%+), the fellowship is "on fire."

### Calculation
```
Unity Points = (
  Posts × 2 +
  Prayers × 1.5 +
  Events × 3 +
  Check-ins × 1 +
  Devotions × 2
)

Ember Meter Level = (Unity Points / Member Count) × 10
```

**Levels:**
- **0-40%:** 🔥 Struggling (encouragement message)
- **40-60%:** 🔥 Growing (momentum building)
- **60-80%:** 🔥 Strong (good engagement)
- **80-100%:** 🔥🔥 **ON FIRE!** (celebration highlight)

### Weekly Reset
Every Monday at 3 AM:
1. Calculate previous week's Unity Points
2. Generate celebration message if on fire
3. Create Fellowship Highlight if threshold met
4. Reset for new week

### Implementation
```typescript
// Component: EmberMeterCard.tsx
<EmberMeterCard fellowshipId="fellowship-456" />

// Displays:
// Circular progress meter (0-100%)
// "Your fellowship stayed on fire this week! 🔥"
// if isOnFire = true
```

### Database
- `unity_points` - Weekly totals
- `unity_contributions` - Individual contributions
- `fellowship_highlights` - Auto-generated celebrations

---

## 🎯 Weekly Challenges

### Concept
Steward-selected challenges to encourage specific types of engagement each week.

### Challenge Templates

**Community:**
- "Share a Testimony" (1 this week)
- "Encourage Others" (5 comments this week)
- "Attend an Event" (1 RSVP)

**Spiritual:**
- "Pray Together" (1 prayer this week)
- "Weekly Check-In" (3 check-ins)
- "Devotion Thread" (1 completion)

### Flow
1. Steward selects template on Monday
2. System tracks progress automatically
3. Users see progress in real-time
4. Completion → Badge awarded + celebration

### Implementation
```typescript
// Component: WeeklyChallenge.tsx
<WeeklyChallenge 
  fellowshipId="fellowship-456" 
  stewardView={false} // true for steward management
/>

// Displays:
// Active challenges with progress bars
// "Challenge complete! 🏅 Badge earned!"
```

### Database
- `challenge_templates` - Curated library
- `weekly_challenges` - Active challenges
- `challenge_progress` - User progress tracking

---

## 🏅 Blessing Badges

### Concept
Award spiritual growth milestones with beautiful, rare badges that glow on profiles.

### Badge Categories

**Consistency:**
- 🕯️ First Flame (1st activity)
- 🔥 Week Warrior (7-day streak)
- 🔥🔥 Month Warrior (30-day streak)

**Community:**
- 💝 Encourager (10 comments)
- 🤝 Mentor (helped 5 new members)

**Spiritual:**
- 🙏 Prayer Warrior (20 prayers/month)
- ✨ Testimony Sharer (3 testimonies)

**Leadership:**
- 👑 Unity Champion (fellowship on fire 4 weeks)
- 🏗️ Faith Builder (completed 5 challenges)

### Rarity Levels
```
Common:      White border      🌟
Uncommon:    Green border      💫
Rare:        Blue border       ⭐
Epic:        Purple border     ✨
Legendary:   Gold border       👑 (glows!)
```

### Implementation
```typescript
// Component: BlessingBadges.tsx
<BlessingBadges 
  userId="user-123" 
  fellowshipId="fellowship-456"
  compact={false} // true for profile cards
/>

// Displays:
// Grid of earned badges with icons
// "Recently Earned" featured section
```

### Database
- `blessing_badges` - Badge definitions
- `user_badges` - Earned badges junction table

---

## 🎉 Fellowship Highlights

### Concept
Auto-generated celebratory messages when milestones are reached.

### Highlight Types

**On Fire:**
```
Title: "This fellowship is on fire! 🔥"
Message: "Your fellowship stayed on fire this week! 127 Unity Points earned together."
Trigger: Ember Meter >= 80%
Display: Gradient card, pulsing glow
```

**Streak Milestone:**
```
Title: "6-Week Streak! 🔥🔥"
Message: "Your fellowship has stayed consistent for 6 weeks straight!"
Trigger: Unity Points weekly streak
```

**Unity Champion:**
```
Title: "Unity Champion! 👑"
Message: "Fellowship on fire for 4 weeks - legendary commitment!"
Trigger: 4 consecutive weeks on fire
```

### Implementation
```typescript
// Component: FellowshipHighlight.tsx
<FellowshipHighlight fellowshipId="fellowship-456" />

// Displays only if highlight exists
// Beautiful gradient card with icon
// Subtle bounce animation
```

### Database
- `fellowship_highlights` - Auto-generated celebrations

---

## 🎨 UI/UX Guidelines

### Faith-Themed Animations

**✅ Use:**
- Subtle pulse effects (representing heart/breath)
- Gentle glow transitions (light of faith)
- Warm color gradients (fire, warmth)
- Soft bounce (joy, celebration)

**❌ Avoid:**
- Confetti
- Cartoon explosions
- Competitive countdowns
- Aggressive animations

### Color Palette

**Faith Flames:**
- Out: Gray (opacity-20)
- Ember: Yellow-400 (opacity-60)
- Glow: Yellow-300 (opacity-75)
- Burning: Orange-500 (opacity-90)
- On-Fire: Red-500 (opacity-100)

**Ember Meter:**
- 0-40%: #D4AF37 (Deep gold)
- 40-60%: #FFD700 (Gold)
- 60-80%: #FF8C00 (Orange)
- 80-100%: #FF6B35 (Bright orange-red)

**Badges:**
- Common: White/gray border
- Uncommon: Green-400 border
- Rare: Blue-400 border
- Epic: Purple-400 border
- Legendary: Gold border + glow

---

## 📊 API Endpoints Required

### Faith Flames
```
POST   /api/gamification/track-activity
GET    /api/gamification/faith-flame/:userId/:fellowshipId
GET    /api/gamification/faith-flames/:fellowshipId
```

### Unity Points
```
GET    /api/gamification/unity-points/:fellowshipId
GET    /api/gamification/unity-points/:fellowshipId/history
```

### Weekly Challenges
```
GET    /api/gamification/challenges/:fellowshipId/active
GET    /api/gamification/challenges/progress/:userId/:fellowshipId
POST   /api/gamification/challenges/progress
POST   /api/gamification/challenges (Steward)
```

### Blessing Badges
```
GET    /api/gamification/badges
GET    /api/gamification/badges/:userId
POST   /api/gamification/badges/check
```

### Fellowship Highlights
```
GET    /api/gamification/highlights/:fellowshipId
```

---

## 🔄 Automated Jobs

### Daily (2 AM)
**Update Faith Flames:**
```sql
-- Check last activity date
-- Update streak if activity yesterday
-- Dim/reset if inactive 3+ days
-- Calculate intensity
```

### Weekly (Monday 3 AM)
**Calculate Unity Points:**
```sql
-- Aggregate previous week's activities
-- Calculate ember meter level
-- Determine if on fire
-- Generate celebration messages
-- Create fellowship highlights
```

### Daily (6 AM)
**Check Badge Eligibility:**
```sql
-- Scan all users' recent activity
-- Check badge criteria
-- Award new badges
-- Send celebration notifications
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Faith Flame', () => {
  it('should calculate intensity correctly', () => {
    expect(calculateFlameIntensity(0)).toBe('out')
    expect(calculateFlameIntensity(5)).toBe('glow')
    expect(calculateFlameIntensity(14)).toBe('on-fire')
  })
})

describe('Ember Meter', () => {
  it('should calculate level from points', () => {
    const level = calculateEmberMeterLevel(80, 20)
    expect(level).toBe(40) // (80/20) * 10
  })
  
  it('should detect on fire', () => {
    expect(isOnFire(80)).toBe(true)
    expect(isOnFire(79)).toBe(false)
  })
})
```

### Integration Tests
```typescript
describe('Challenge Progress', () => {
  it('should update progress on activity', async () => {
    const activity = await trackActivity(userId, 'testimony')
    const progress = await getChallengeProgress(userId, challengeId)
    expect(progress.progress).toBe(1)
  })
})
```

### E2E Tests
```typescript
describe('Gamification Flow', () => {
  it('should complete full engagement cycle', async () => {
    // 1. User posts testimony
    // 2. Faith Flame updates
    // 3. Unity Points increase
    // 4. Challenge progress updates
    // 5. Badge awarded if eligible
    // 6. UI reflects all changes in real-time
  })
})
```

---

## 📱 Mobile-First Considerations

### Touch Interactions
- Large tap targets (min 44x44px)
- Swipe to view badge details
- Tap to view challenge progress
- Pull-to-refresh for updates

### Performance
- Lazy-load badge grids
- Cache Faith Flame data
- Debounce progress updates
- Optimize SVG animations

### Offline Support
- Queue engagement tracking
- Show last known state
- Sync when online
- Progress indicators

---

## 🎯 Success Metrics

### Individual Engagement
- **Target:** 70%+ users have active Faith Flame
- **Target:** Average streak length: 5+ days
- **Target:** 60%+ users earn at least 1 badge/week

### Fellowship Engagement
- **Target:** 50%+ fellowships hit "on fire" monthly
- **Target:** Average Unity Points: 15+ per member
- **Target:** 80%+ challenge completion rate

### Retention Impact
- **Target:** Users with Faith Flame: 2x retention
- **Target:** On-fire fellowships: 3x retention
- **Target:** Badge collectors: 4x retention

---

## 🚀 Rollout Plan

### Week 1-2: Foundation
- [ ] Deploy database schema
- [ ] Create core components
- [ ] Implement Faith Flame tracking
- [ ] Basic Unity Points calculation

### Week 3-4: Enhancements
- [ ] Add Weekly Challenges
- [ ] Implement badge system
- [ ] Create Fellowship Highlights
- [ ] UI polish & animations

### Week 5-6: Automation
- [ ] Set up scheduled jobs
- [ ] Real-time WebSocket updates
- [ ] Notification system
- [ ] Analytics dashboard

### Week 7-8: Beta Testing
- [ ] 5 test fellowships
- [ ] Gather feedback
- [ ] Iterate on UX
- [ ] Performance optimization

---

This gamification system creates warm, faithful motivation through shared consistency rather than competition! 🌿🔥


