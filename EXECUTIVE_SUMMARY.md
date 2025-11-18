# Executive Summary: Fellowship-First Refactor
## Gathered Product Roadmap

**Strategic Shift:** From generic Christian app → Deep, useful youth fellowship platform

---

## 🎯 The Opportunity

**Problem:** Existing tools (WhatsApp, Instagram) lack spiritual context and engagement tracking for youth fellowships.

**Solution:** Gathered becomes the **spiritual context layer** for fellowship communities:
- Adds verses, devotions, check-ins to group chats
- Tracks spiritual engagement (not vanity metrics)
- Provides leader tools for community building
- Integrates seamlessly with existing platforms

**Target:** Youth fellowships (15-25 members) seeking deeper connection and engagement.

---

## 📊 Key Performance Indicator

### Fellowship Engagement Rate (FER)

**Formula:**
```
FER = (Posts×2 + Prayers×1.5 + Events×3 + Check-ins×1 + Devotions×2) / Members
```

**Target:** 15+ points per member per week

**Why it matters:**
- Measures **depth** of spiritual participation
- Encourages consistent community engagement
- Provides Stewards actionable insights
- Creates healthy competition through streaks/badges

---

## 🏗️ What Changes

### Navigation
- **Before:** 6+ tabs (Fragmented)
- **After:** 5 tabs (Focused, context-aware)
- **Impact:** 40% reduction in cognitive load

### Content Strategy
- **Before:** Testimonies, Prayers, Devotions as separate features
- **After:** Unified Fellowship Feed (all content in context)
- **Impact:** Natural flow, no context switching

### Engagement Model
- **Before:** Basic likes/comments
- **After:** FER tracking, streaks, badges, growth cards
- **Impact:** Gamification drives consistency

### Leader Tools
- **Before:** Basic event creation
- **After:** Weekly summaries, check-in prompts, FER dashboards
- **Impact:** Stewards become more effective

### Social Strategy
- **Before:** Platform silo
- **After:** Share to WhatsApp/Instagram/Email with tracking
- **Impact:** Viral growth, real-world integration

---

## 📈 Projected Growth

### Phase 1 (Months 1-3)
- **Users:** 5-15 fellowships (75-450 members)
- **Engagement:** Average FER 12-15
- **Retention:** 70%+ month-over-month
- **Goal:** Prove product-market fit

### Phase 2 (Months 4-6)
- **Users:** 20-50 fellowships (600-1,500 members)
- **Engagement:** Average FER 15-18
- **Retention:** 80%+ month-over-month
- **Goal:** Refine, optimize, scale

### Phase 3 (Months 7-12)
- **Users:** 100+ fellowships (3,000+ members)
- **Engagement:** Average FER 18+
- **Retention:** 85%+ month-over-month
- **Goal:** Sustainable growth, monetization

---

## 💰 Business Model

### Free Tier
- Unlimited members
- Basic FER tracking
- Up to 3 fellowships per user
- Standard sharing tools

### Premium ($9.99/month per fellowship)
- Advanced analytics
- Weekly summary automation
- Priority support
- Custom branding
- Unlimited storage

### Enterprise (Custom pricing)
- Multi-church management
- White-label option
- API access
- Dedicated support

---

## 🔧 Technical Requirements

### Frontend
- Next.js 13.5+ with App Router
- React 18+ with TypeScript
- Tailwind CSS for styling
- Real-time subscriptions (Supabase Realtime)

### Backend
- Supabase (PostgreSQL + Auth)
- Row Level Security policies
- Scheduled jobs for FER updates
- Image generation for Instagram cards

### Infrastructure
- Vercel (hosting)
- Supabase (database + storage)
- Resend/SendGrid (email)
- Cloudinary/ImageKit (image processing)

---

## ⚠️ Risks & Mitigation

### Risk: Low Adoption
**Mitigation:** Focus on 5 carefully selected beta fellowships, provide hands-on onboarding

### Risk: High Churn
**Mitigation:** Deep engagement tracking, meaningful metrics, leader tools drive retention

### Risk: Complex Integration
**Mitigation:** Start with WhatsApp (easiest), add Instagram/Email incrementally

### Risk: Performance Issues
**Mitigation:** Database indexes, query optimization, caching layer, load testing

### Risk: Feature Bloat
**Mitigation:** Strict product prioritization, beta user feedback loops, quarterly pruning

---

## 🎯 Success Criteria

### Product Success
- ✅ FER > 15 average
- ✅ 70%+ weekly active users
- ✅ Net Promoter Score > 50
- ✅ < 2% critical bug rate

### Business Success
- ✅ 100+ paid fellowships in 12 months
- ✅ $10K+ MRR by month 12
- ✅ 85%+ retention rate
- ✅ < 5% monthly churn

### Community Success
- ✅ 50+ powerful testimonies shared
- ✅ 500+ prayers answered
- ✅ 200+ fellowship events hosted
- ✅ 10+ fellowships grown from 5 to 30 members

---

## 📋 Next Steps

### This Week
1. **Team Review:** Product roadmap, technical architecture
2. **Budget Approval:** Infrastructure costs, development hours
3. **Beta Recruitment:** Identify 5 target fellowships
4. **Design Kickoff:** Wireframe refinement, component library

### This Month
1. **Database Setup:** Migrations, RLS policies, seed data
2. **Core APIs:** Engagement tracking, FER calculation
3. **Beta Onboarding:** Fellowship 1 of 5 onboarded
4. **UX Testing:** Weekly feedback loops

### This Quarter
1. **Full Beta:** All 5 fellowships active
2. **Social Integrations:** WhatsApp, Instagram working
3. **Steward Tools:** Dashboard, summaries, prompts
4. **Performance:** Load testing, optimization complete

---

## 🚀 Why This Will Work

### 1. **Product-Market Fit**
- Targets real need (youth fellowship engagement)
- Solves actual problem (lost connections, low engagement)
- Integrates with existing tools (not disruptive)

### 2. **Strong Metrics**
- FER quantifies spiritual participation
- Streaks gamify consistency
- Leader tools drive effectiveness
- All feedback loops visible

### 3. **Network Effects**
- More members → More engagement
- Better data → Better insights
- Stronger community → More retention
- Higher retention → More referrals

### 4. **Defensible Moats**
- Deep engagement data (hard to replicate)
- Fellowship intimacy (switching costs)
- Integration ecosystem (sticky)
- Community trust (brand loyalty)

---

## 📊 Resource Requirements

### Development
- **Frontend Developer:** 30 hours/week × 12 weeks
- **Backend Developer:** 25 hours/week × 12 weeks
- **UI/UX Designer:** 15 hours/week × 6 weeks
- **QA Engineer:** 10 hours/week × 8 weeks

### Infrastructure
- **Vercel Pro:** $20/month
- **Supabase Pro:** $25/month
- **Email Service:** $10/month
- **Image Storage:** $5/month
- **Total:** ~$60/month operational cost

### Beta Support
- **Onboarding:** 2 hours per fellowship
- **Weekly Check-ins:** 30 min per fellowship
- **Feedback Sessions:** 1 hour per fellowship
- **Total:** ~50 hours over 12 weeks

---

## 🎉 Expected Outcomes

### For Youth Fellowships
- **Deeper connections** through consistent engagement
- **Spiritual growth** via tracked devotion and prayer
- **Better leadership** through data-driven insights
- **Stronger community** via meaningful interactions

### For Gathered
- **Sustainable growth** through network effects
- **Differentiated product** in Christian tech space
- **Strong metrics** proving product-market fit
- **Foundation** for scaling to thousands of fellowships

### For the Kingdom
- **Thriving communities** of believers
- **Discipled young people** growing in faith
- **Empowered leaders** shepherding well
- **Lasting impact** beyond the app

---

**Let's build something that matters.** 🌿

---

**Questions?** See detailed docs:
- `ROADMAP_SUMMARY.md` - Quick overview
- `PRODUCT_ROADMAP.md` - Full strategy
- `TECHNICAL_ARCHITECTURE.md` - Implementation
- `IMPLEMENTATION_CHECKLIST.md` - Tasks
- `INTEGRATION_GUIDE.md` - Social features





