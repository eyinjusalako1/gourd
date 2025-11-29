# Product Roadmap Summary
## Fellowship-First Refactor for Gathered

**Date:** November 1, 2025  
**Vision:** Make Gathered deeply useful for youth fellowships through intimacy, engagement, and integration

---

## 🎯 Core Changes Overview

### 1. **Navigation Simplified**
**Before:** 6+ tabs (Home, Events, Chat, Fellowships, Devotions, More)  
**After:** 5 focused tabs (Home, Fellowships, Events, Messages, Profile)

**Removed:** Standalone Testimonies, Prayers, Devotions  
**Rationale:** All spiritual content merged into Fellowship Feed for context

### 2. **Unified Fellowship Feed**
**Component:** `FellowshipFeed.tsx` (replaces fragmented feeds)

**Content Types Unified:**
- Posts (announcements, encouragements)
- Prayers (requests, praise reports)
- Testimonies (member stories)
- Devotions (weekly readings, discussions)
- Check-ins (prompted reflections)
- Events (gatherings, RSVPs)
- Celebrations (milestones, birthdays)

**Key Feature:** Color-coded by type, engagement tracking, share buttons

### 3. **Fellowship Engagement Rate (FER)**
**Core KPI:** Measure depth of fellowship participation

**Formula:**
```
FER = (Posts×2 + Prayers×1.5 + Events×3 + Check-ins×1 + Devotions×2) / Members
```

**Target:** 15+ points per member per week

**Tracking:**
- Streak maintenance (fellowship, prayer, devotion)
- Achievement badges (community, consistency, leadership, spiritual)
- Growth metrics (member count, FER trends, top contributors)

### 4. **Social Media Integration**
**Philosophy:** Complement, don't replace existing tools

**Platforms:**
- **WhatsApp:** Deep-link sharing with branded messages
- **Instagram:** Beautiful story card generation (1080x1920)
- **Email:** Weekly summary templates for Stewards

**Features:**
- One-click sharing
- Tracked shares (analytics)
- Branded, professional content
- Deep-links back to Gathered

### 5. **Steward Tools**
**Enhanced Dashboard** for fellowship leaders

**Features:**
- FER visualization
- Weekly summary auto-generator
- Check-in prompt templates
- Growth analytics
- Export tools (email, PDF, WhatsApp)

**Quick Actions:**
- Schedule prompts
- Generate summaries
- Track engagement trends
- Celebrate milestones

---

## 📚 Documentation Created

### 1. **PRODUCT_ROADMAP.md** (3,500+ words)
- Fellowship-first philosophy
- Component architecture
- API endpoint specifications
- Data model adjustments
- Success metrics
- Go-to-market strategy

### 2. **TECHNICAL_ARCHITECTURE.md** (4,500+ words)
- Database schema (7 new tables)
- FER calculation implementation
- Real-time WebSocket integration
- API endpoint specifications
- Analytics queries
- Testing strategy

### 3. **INTEGRATION_GUIDE.md** (3,000+ words)
- WhatsApp deep-link implementation
- Instagram story card generation
- Email weekly summaries
- Share tracking analytics
- Universal share menu component

### 4. **IMPLEMENTATION_CHECKLIST.md** (2,000+ words)
- 12-week phased rollout
- Detailed task breakdown
- Success metrics by phase
- Technical debt tracking
- Launch readiness checklist

---

## 🗄️ Database Schema Changes

### New Tables (7)
1. **engagement_events** - Track all user actions
2. **streaks** - Maintain consecutive activity records
3. **achievements** - Badge definitions and criteria
4. **user_achievements** - Junction table for earned badges
5. **check_in_prompts** - Steward-created weekly prompts
6. **check_in_responses** - Member responses to prompts
7. **share_tracking** - Analytics for external shares

### Modified Tables (2)
1. **fellowships** - Add FER, member_count columns
2. **users** - Add engagement_points, achievement_badges columns

---

## 🎨 Component Changes

### New Components (9)
1. `FellowshipFeed.tsx` - Unified activity feed
2. `EngagementStreak.tsx` - Streak tracking display
3. `GrowthCard.tsx` - Fellowship health metrics
4. `CheckInPrompt.tsx` - Weekly prompts
5. `AchievementBadges.tsx` - Badge showcase
6. `ShareMenu.tsx` - Universal share
7. `WeeklySummaryGenerator.tsx` - Steward tool
8. `CheckInTemplates.tsx` - Prompt library
9. `ShareAnalytics.tsx` - Share tracking

### Modified Components (2)
1. `LeaderDashboard.tsx` → `StewardDashboard.tsx` (enhanced)
2. `FellowshipActivityFeed.tsx` → Merged into `FellowshipFeed.tsx`

---

## 🔌 API Endpoints Required

### Engagement Tracking (4)
- `POST /api/engagement/track` - Log action, award points
- `GET /api/engagement/fer/:fellowshipId` - Get FER
- `GET /api/engagement/streaks/:userId` - Get streaks
- `POST /api/share/track` - Track shares

### Steward Tools (3)
- `GET /api/steward/dashboard/:fellowshipId` - Dashboard data
- `POST /api/steward/check-in` - Create prompt
- `GET /api/steward/summary/:fellowshipId/:period` - Generate summary

### Social Integration (3)
- `POST /api/share/whatsapp` - WhatsApp deep-link
- `POST /api/share/instagram` - Story card generation
- `POST /api/export/weekly-summary` - Email/PDF export

---

## 📅 Implementation Timeline

### Phase 1-2: Foundation (Weeks 1-2)
- Database setup
- Core APIs
- Basic tracking

### Phase 3-4: Components (Weeks 3-4)
- New components
- Feed unification
- UI/UX polish

### Phase 5: Real-Time (Week 5)
- WebSocket integration
- Live updates
- Notifications

### Phase 6-7: Integrations (Weeks 6-7)
- WhatsApp sharing
- Instagram cards
- Email summaries

### Phase 8: Steward Tools (Week 8)
- Dashboard enhancements
- Summary generator
- Export tools

### Phase 9-10: Testing (Weeks 9-10)
- Unit tests
- Integration tests
- Performance optimization

### Phase 11: Beta Launch (Week 11)
- 5 test fellowships
- Monitoring
- Iterations

### Phase 12: Production (Week 12)
- Final polish
- Security audit
- Launch!

---

## 📊 Success Metrics

### Early Adoption (Weeks 1-4)
- 3-5 active fellowships
- Average FER: 10+
- 60% weekly posting rate

### Growth (Weeks 5-8)
- 10-15 active fellowships
- Average FER: 15+
- 70% weekly posting rate
- 80% retention

### Scale (Weeks 9-12)
- 20-30 active fellowships
- Average FER: 18+
- 75% weekly posting rate
- 85% retention
- NPS: 50+

---

## 🎯 Key Differentiators

### vs. WhatsApp
- **Spiritual context** (verses, devotions, check-ins)
- **Engagement tracking** (streaks, badges, FER)
- **Beautiful organization** (unified feed, categories)
- **Leader tools** (prompts, summaries, analytics)

### vs. Instagram
- **Private community** (fellowship-only content)
- **Intentional sharing** (prayer focus vs. aesthetic)
- **Spiritual growth** (devotions, testimonies)
- **Steward oversight** (moderation, prompts)

### vs. Generic Apps
- **Church-first** (built for believers)
- **Fellowship-intimacy** (small groups, not broadcast)
- **Spiritual metrics** (FER, not just likes)
- **Integration-friendly** (share to existing tools)

---

## 🚀 Next Steps

### Immediate Actions
1. Review documentation with team
2. Approve technical architecture
3. Assign development phases
4. Set up project management board
5. Begin Phase 1 database setup

### Week 1 Deliverables
- Database migrations deployed
- Core engagement tracking APIs working
- Basic FER calculation implemented
- Unit tests passing

---

## 📝 Notes

**Philosophy:** Deep, intentional, spiritual community—not shallow social media.

**Focus:** Quality over quantity, intimacy over scale, growth over engagement.

**Integration:** Complement existing tools (WhatsApp, Instagram), don't compete.

**Metrics:** FER measures spiritual participation, not vanity metrics.

---

**Ready to build community that matters!** 🌿

---

**Questions?** Check detailed docs:
- `PRODUCT_ROADMAP.md` - Strategy and features
- `TECHNICAL_ARCHITECTURE.md` - Implementation details
- `INTEGRATION_GUIDE.md` - Social integrations
- `IMPLEMENTATION_CHECKLIST.md` - Step-by-step guide





