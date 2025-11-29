# Gathered App - Build Summary & Feature Overview

## Project Overview

**Gathered** is a Christian community platform built with Next.js, TypeScript, and Tailwind CSS. It's designed to help believers find fellowship, grow in faith, and build meaningful connections within the Christian community.

**Tech Stack:**
- Framework: Next.js 13.5.6
- Language: TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- State Management: React Hooks + localStorage
- Deployment: Vercel
- Repository: GitHub (eyinjusalako1/gourd)

---

## Brand Identity

**Colors:**
- Deep Navy: `#0F1433` (primary background)
- Radiant Gold: `#F5C451` / `#D4AF37` (accent, buttons, highlights)
- White: Primary text and card backgrounds

**Design Principles:**
- Mobile-first responsive design
- Soft, rounded cards with subtle gradients
- Clean, modern UI
- Accessible contrast ratios

---

## Core Features Implemented

### Latest: Personalization & Mobile UX (Nov 2025)
- **Preferences Onboarding** (`/onboarding/preferences`) collects name, role, interests, availability, optional city, notification cadence, and accessibility flags.
- **Role-Aware Dashboards** now differentiate Disciple vs Steward home screens with tailored sections, suggestions, and smart quick actions.
- **Feed Ranking & Suggestions** powered by `/lib/prefs.ts` rule-based weighting and dismissible suggestion cards.
- **Notification & Quiet Hours Controls** with cadence/channel toggles and reduced-motion/high-contrast/large-text accessibility settings.
- **Theme Adjustments** apply instantly via CSS classes (`text-lg-base`, `.theme-high-contrast`) and respect reduce-motion preferences.

### 1. User Onboarding & Role Selection

**Components:**
- `OnboardingFlow.tsx` - Initial user type selection
- `OnboardingTutorial.tsx` - Interactive feature walkthrough

**User Types:**
- **Individual Members**: Focus on finding fellowships and attending events
- **Leaders/Church Reps**: Access to leadership dashboard with management tools

**Key Features:**
- Role-based dashboard customization
- Gold gradient header for leaders vs deep navy for members
- Tutorial shows only once (tracked in localStorage)
- Skip option available

---

### 2. Dashboard System

**File:** `src/app/dashboard/page.tsx`

**For Individual Members:**
- Verse of the Day card
- Fellowship discovery section
- Upcoming events list
- Announcements feed
- Personal stats panel

**For Leaders:**
- All member features PLUS:
- Leadership dashboard with unique gold theme
- Fellowship management tools
- Quick actions bar
- Member analytics
- Active fellowships list

**Navigation Elements:**
- Top header: Logo, notifications bell, discover people, profile, testimonies, prayers, settings
- Bottom navigation: Home, Events, Chat, Fellowships, Devotions
- Swipeable tabs
- Responsive mobile design

---

### 3. Fellowship Management

**Pages:**
- `/fellowships` - Browse all fellowships
- `/fellowships/create` - Create new fellowship
- `/fellowships/[id]/manage` - Fellowship management dashboard
- `/fellowships/[id]/chat` - Group chat for fellowship

**Features:**
- Browse by category (Bible Study, Women's Ministry, Men's Ministry, Service, etc.)
- Search functionality
- Create fellowship with comprehensive form:
  - Name, description, category
  - Location (physical or online)
  - Meeting schedule
  - Privacy settings
  - Joining rules
  - Tags
- Management dashboard with tabs:
  - Overview: Quick stats and actions
  - Members: Member list, search, invite
  - Events: Fellowship-specific events
  - Announcements: Send announcements
  - Settings: Privacy, joining rules, deletion

**Data Storage:**
- Created fellowships saved to localStorage
- Auto-sync across browser tabs

---

### 4. Event System

**Pages:**
- `/events` - Event listing page
- `/events/[id]` - Individual event details
- `/events/create` - Event creation for leaders

**Features:**
- Category filtering (Bible Study, Worship, Service, Social, Prayer)
- Event cards with:
  - Title, description, date/time
  - Location or online indicator
  - RSVP counts
  - Event type indicators
- RSVP modal with options:
  - Going
  - Interested
  - Not Going
- Event details page with:
  - Full event information
  - Organizer details
  - Capacity management
  - Attendees list
  - Add to calendar functionality
- Capacity warnings when near full

**Data Storage:**
- Events saved to localStorage
- Loaded via EventService

---

### 5. Group Chat System

**Pages:**
- `/chat` - List of fellowship chats
- `/fellowships/[id]/chat` - Individual fellowship chat

**Features:**
- Real-time messaging interface
- Message bubbles (sent vs received)
- Timestamps (relative: "5m ago", "1h ago")
- User avatars
- Typing indicators (placeholder)
- Unread message badges
- Send button functionality
- Auto-scroll to bottom

**Tech:**
- Mock messages for MVP
- Prepared for real-time integration (WebSocket ready)

---

### 6. Testimonies Feature

**Pages:**
- `/testimonies` - Browse testimonies
- `/testimonies/create` - Share your testimony

**Features:**
- Category filtering (Community, Faith, Service, Healing, Growth, Encouragement)
- Search by title/content
- Like system
- Comment count display
- Share button
- Create testimony form:
  - Title, content, category
  - Tags system (up to 5 tags)
  - Anonymous posting option
- Tag system: faith, prayer, hope, love, community, healing, growth, service, friendship, encouragement

**Data Storage:**
- Testimonies saved to localStorage
- Created testimonies appear immediately

---

### 7. Prayer Requests System

**Pages:**
- `/prayers` - Browse prayer requests
- `/prayers/create` - Submit prayer request

**Features:**
- Category filtering (Healing, Provision, Relationships, Faith, Family, Work, Other)
- Search functionality
- "Pray for This" button with:
  - Like/unlike functionality
  - Prayer count display
  - Visual feedback on click
- Create prayer request form:
  - Title, details, category
  - Anonymous posting option
  - Message field
- Fellowship context display
- Real-time prayer counts

**Data Storage:**
- Prayer requests saved to localStorage
- Instant visibility after creation

---

### 8. Devotions & Bible Reading

**Pages:**
- `/devotions` - Main devotions page

**Features:**
- Daily Bible reading display
- Reading stats:
  - Day streak counter
  - Total readings completed
  - Active reading plans count
- Today's reading with:
  - Scripture reference
  - Content preview
  - Mark as complete button
  - Read full passage button
- Reading plans showcase:
  - 30 Days in the Gospels
  - The Psalms
  - Read the Bible in a Year
- Progress tracking
- Plan descriptions and durations

**Future Enhancements:**
- Detailed reading plan pages
- Bible verse integration
- Reading reminders
- Note-taking system

---

### 9. Profile & Discovery

**Pages:**
- `/profile` - User profile
- `/discover` - User search and discovery

**Profile Features:**
- Personal information display
- Photo and cover photo placeholders
- Bio, location, denomination
- Interests/tags
- Activity timeline
- Testimonies section
- Connection stats
- Edit profile modal with:
  - All profile fields editable
  - Dynamic interest management
  - Photo upload placeholders

**Discovery Features:**
- User search by name
- Filter by category
- User cards with:
  - Profile picture
  - Name and location
  - Interests
  - Follow button
- Mutual connections display

---

### 10. Member Invitation System

**Component:** `MemberInviteModal.tsx`

**Features:**
- Two invitation methods:
  - **Email Invites**: Enter email, optional custom message
  - **Link Invites**: Generate shareable invitation link
- Success feedback
- Integrated into fellowship management page
- Loading states
- Copy link to clipboard functionality

**Placeholder:**
- Currently shows success message
- Ready for email API integration
- Link generation system in place

---

### 11. Content Moderation

**Files:**
- `src/lib/content-moderation.ts` - Moderation logic
- `src/components/ReportModal.tsx` - Report interface

**Features:**
- Keyword filtering system
- Content violation detection:
  - Profanity
  - Bullying/harassment
  - Spam
  - Explicit content
- Report system with:
  - Multiple report reasons
  - Additional context field
  - Severity classification (low/medium/high)
  - Recommended actions (warn/block/remove)
- Moderation functions:
  - `containsInappropriateContent()`
  - `filterInappropriateContent()`
  - `getContentWarning()`
  - `checkContent()`

**Report Reasons:**
- Inappropriate content
- Bullying or harassment
- Spam or irrelevant content
- False information
- Violence or threats
- Other

---

### 12. Responsive Design

**Breakpoints:**
- Mobile-first design
- Max-width container: `max-w-md` (448px)
- Sticky headers and footers
- Touch-optimized buttons
- Swipe gestures ready
- Bottom navigation bar with icons and labels

---

## Data Management

### localStorage Keys:
- `gathered_user_type` - User role preference
- `gathered_fellowships` - Created fellowships
- `gathered_events` - Created events
- `gathered_testimonies` - Shared testimonies
- `gathered_prayers` - Prayer requests
- `gathered_tutorial_completed` - Tutorial completion status

### Mock Data:
- Sample fellowships (4)
- Sample events (via EventService)
- Sample testimonies (4)
- Sample prayer requests (3)
- Sample users for discovery

### Data Flow:
- User actions → Save to localStorage
- Dispatch storage events for cross-tab sync
- Other components listen and update
- Instant UI updates without page refresh

---

## Navigation Structure

```
/
├── /dashboard (role-based)
├── /events
│   ├── /[id] (event details)
│   └── /create (leader only)
├── /fellowships
│   ├── /[id]/manage (leader only)
│   └── /[id]/chat
├── /testimonies
│   └── /create
├── /prayers
│   └── /create
├── /devotions
├── /读到profile
└── /discover
```

---

## UI/UX Patterns

### Cards:
- `bg-white/5` with `border border-[#D4AF37]`
- Gradient overlays: `bg-gradient-to-r from-[#F5C451]/5 to-transparent`
- Hover effects: `hover:bg-white/10`
- Gold accents on interactive elements

### Buttons:
- Primary: `bg-gradient-to-r from-[#D4AF37] to-[#F5C451]`
- Secondary: `bg-white/10` with borders
- States: hover, active, disabled
- Icons with text labels

### Modals:
- Full-screen overlay: `bg-black/50`
- Centered cards with gold borders
- Close buttons (X icon)
- Loading states with spinners
- Success feedback

### Forms:
- Styled inputs with gold focus borders
- Label + input + helper text pattern
- Validation states
- Submit buttons with loading animations

---

## Completed MVP Checklist

✅ Dual user types (individual/leader)  
✅ Role-based dashboards  
✅ Fellowship management  
✅ Event system with RSVP  
✅ Group chat  
✅ Testimonies sharing  
✅ Prayer requests  
✅ Devotions/Bible reading  
✅ Member invitations  
✅ User profiles  
✅ People discovery  
✅ Content moderation  
✅ Report system  
✅ Onboarding tutorial  
✅ Mobile-first responsive design  
✅ Deep Navy & Gold branding  
✅ Data persistence (localStorage)  

---

## Testing Documentation

**File:** `TESTING_INSTRUCTIONS.md`

Includes:
- Access instructions
- Feature walkthrough
- Testing scenarios
- Feedback collection methods
- Known issues
- Troubleshooting guide

---

## Deployment

**Platform:** Vercel  
**Repository:** https://github.com/eyinjusalako1/gourd  
**Auto-deploy:** On push to master branch  
**Environment:** Production  
**Build Status:** ✓ Passing

---

## Future Enhancements (Post-MVP)

### Planned:
- [ ] AI content moderation (Perspective API)
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Reading plans with detailed content
- [ ] Church giving/donations
- [ ] Email notifications
- [ ] User authentication (Supabase)
- [ ] Real-time chat (WebSocket)
- [ ] Push notifications
- [ ] Apple/Google app stores

### Nice to Have:
- [ ] Video calls for fellowships
- [ ] Event check-in QR codes
- [ ] Bible verse sharing
- [ ] Prayer chains
- [ ] Leader analytics dashboard
- [ ] Custom fellowship branding

---

## Technical Notes

### Client-Side Rendering:
- All interactive pages use `'use client'`
- Server components used for static content

### Performance:
- Lazy loading ready
- Image optimization ready
- Bundle size optimized
- Fast initial load

### Accessibility:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliant

### Browser Support:
- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Build Commands

```bash
npm install    # Install dependencies
npm run dev    # Development server
npm run build  # Production build
npm run lint   # Run ESLint
```

---

## Summary

Gathered is a **fully functional Christian community platform** ready for beta testing. It provides all core features needed for fellowship discovery, event management, prayer sharing, testimony creation, and community building. The MVP successfully implements both individual member and leader experiences with a beautiful, mobile-first interface.

**Current Status:** ✅ Ready for beta testing  
**Next Steps:** User testing → Feedback collection → Iteration → Production launch

---

**Last Updated:** October 27, 2025  
**Version:** 1.0.0 (MVP Beta)  
**Build:** 3a760ec




