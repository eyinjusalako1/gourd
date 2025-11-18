# GATHERED APP - CODEBASE STATUS REPORT
**Generated:** December 11, 2025  
**Purpose:** Complete overview of current implementation state for external AI assistant collaboration

---

## A. PROJECT STRUCTURE SUMMARY

### `/src/app` - Next.js 13 App Router Pages

#### **Fully Implemented Pages:**
- ✅ `/dashboard` - Main dashboard with Disciple/Steward views
- ✅ `/devotions` - Devotions listing page with mock data
- ✅ `/prayers` - Prayer requests feed (mock data)
- ✅ `/testimonies` - Testimonies feed (mock data)
- ✅ `/events` - Events listing and detail pages
- ✅ `/fellowships` - Fellowship groups listing and management
- ✅ `/profile` - User profile page
- ✅ `/settings` - Settings pages (account, appearance, notifications, etc.)
- ✅ `/discover` - Discovery page for finding users/fellowships
- ✅ `/chat` - Chat interface
- ✅ `/faq` - FAQ page
- ✅ `/announcements/create` - Create announcements

#### **Partially Implemented / Placeholder Pages:**
- ⚠️ `/bible` - **EMPTY FILE** (exists but no content)
- ⚠️ `/bible/[book]` - **EMPTY FILE** (route exists, no implementation)
- ⚠️ `/bible/[book]/[chapter]` - **EMPTY FILE** (route exists, no implementation)
- ⚠️ `/devotions/create` - Exists but may need implementation review

#### **API Routes (`/src/app/api`):**
- ✅ `/api/gamification/track-activity` - POST endpoint (mock mode)
- ✅ `/api/gamification/badges/check` - POST endpoint (mock mode)
- ✅ `/api/gamification/badges/[userId]` - GET endpoint (mock mode)
- ✅ `/api/gamification/challenges/[fellowshipId]/active` - GET endpoint (mock mode)
- ✅ `/api/gamification/faith-flame/[userId]/[fellowshipId]` - GET endpoint (mock mode)
- ✅ `/api/gamification/highlights/[fellowshipId]` - GET endpoint (mock mode)
- ✅ `/api/gamification/unity-points/[fellowshipId]` - GET endpoint (mock mode)
- ❌ `/api/faith-study` - **DOES NOT EXIST** (mentioned in requirements but not implemented)

### `/src/components` - React Components

#### **Core UI Components:**
- ✅ `AppHeader.tsx` - Reusable header component
- ✅ `BottomNavigation.tsx` - Bottom nav bar
- ✅ `GlobalBottomNav.tsx` - Global navigation
- ✅ `Navigation.tsx` - Navigation component
- ✅ `Logo.tsx` - Logo component
- ✅ `CommandPalette.tsx` - Command palette (search/navigation)

#### **Feature Components:**
- ✅ `VerseCard.tsx` - Verse of the day card (uses mock data, NOT connected to Bible JSON)
- ✅ `FaithFlame.tsx` - Faith Flame gamification component
- ✅ `EmberMeter.tsx` - Unity Points meter
- ✅ `BlessingBadges.tsx` - Badge display
- ✅ `WeeklyChallenge.tsx` - Challenge display
- ✅ `FellowshipHighlight.tsx` - Fellowship highlights
- ✅ `EventList.tsx` - Event listing
- ✅ `FellowshipGroups.tsx` - Fellowship groups
- ✅ `FellowshipDiscovery.tsx` - Fellowship discovery
- ✅ `AnnouncementFeed.tsx` - Announcements feed
- ✅ `FellowshipActivityFeed.tsx` - Activity feed

#### **Dashboard Components:**
- ✅ `dashboard/DiscipleHome.tsx` - Disciple dashboard view
- ✅ `dashboard/StewardHome.tsx` - Steward dashboard view
- ✅ `LeaderDashboard.tsx` - Leader dashboard

#### **Settings Components:**
- ✅ `settings/RoleSelector.tsx` - Role selection
- ✅ `personalization/PreferenceForm.tsx` - User preferences
- ✅ `personalization/SuggestionCard.tsx` - Suggestions

#### **UI Primitives:**
- ✅ `ui/Modal.tsx` - Modal component
- ✅ `ui/BottomSheet.tsx` - Bottom sheet
- ✅ `ui/Toast.tsx` - Toast notifications

#### **Missing Components:**
- ❌ `BibleReader.tsx` - **DOES NOT EXIST** (needed for Bible feature)
- ❌ `BibleNavigation.tsx` - **DOES NOT EXIST** (book/chapter selector)
- ❌ `BibleControls.tsx` - **DOES NOT EXIST** (font size, theme controls)
- ❌ `VerseHighlighter.tsx` - **DOES NOT EXIST** (verse highlighting)
- ❌ `BibleNotes.tsx` - **DOES NOT EXIST** (notes feature)
- ❌ `BibleSearch.tsx` - **DOES NOT EXIST** (search functionality)

### `/src/lib` - Library/Service Files

- ✅ `supabase.ts` - Supabase client (mock mode when not configured)
- ✅ `auth-context.tsx` - Authentication context
- ✅ `gamification-service.ts` - Gamification service layer
- ✅ `event-service.ts` - Event service
- ✅ `content-moderation.ts` - Content moderation utilities
- ✅ `prefs.ts` - Personalization preferences
- ✅ `tutorial-context.tsx` - Tutorial system
- ✅ `tutorial-steps.ts` - Tutorial steps definition

### `/src/data` - Data Files

- ✅ `bible-books.ts` - Bible book definitions (ONLY John defined)
- ✅ `bibles/web/John.json` - **COMPLETE** (21 chapters, all verses)
- ❌ `bibles/web/*.json` - **MISSING** (only John exists, need 65 more books)

### `/src/hooks` - Custom React Hooks

- ✅ `useUserProfile.ts` - User profile hook
- ✅ `useNotificationPlanner.ts` - Notification planning
- ✅ `useDisableBodyScroll.ts` - Body scroll management
- ✅ `useViewportVH.ts` - Viewport height utilities

### `/src/utils` - Utility Functions

- ✅ `cn.ts` - Class name utility (likely clsx/tailwind-merge)
- ✅ `analytics.ts` - Analytics utilities

---

## B. BIBLE FEATURE STATUS

### Current Implementation State:

#### **Route Structure:**
- ✅ `/bible` - Route exists but **EMPTY FILE** (no implementation)
- ✅ `/bible/[book]` - Route exists but **EMPTY FILE** (no implementation)
- ✅ `/bible/[book]/[chapter]` - Route exists but **EMPTY FILE** (no implementation)
- ✅ `/bible/layout.tsx` - Layout file exists but **EMPTY FILE**

#### **Data Layer:**
- ✅ `bible-books.ts` - File exists, but **ONLY John** is defined:
  ```typescript
  export const WEB_BOOKS: BibleBook[] = [
    { id: 'John', name: 'John', chapters: 21 },
    // add the rest later
  ]
  ```
- ✅ `bibles/web/John.json` - **COMPLETE** (21 chapters, all verses in correct format)
- ❌ Other 65 books - **MISSING** (can be fetched using `scripts/fetch-bible.js`)

#### **Components:**
- ❌ `BibleReader` component - **DOES NOT EXIST**
- ❌ `BibleNavigation` component - **DOES NOT EXIST**
- ❌ `BibleControls` component - **DOES NOT EXIST**
- ⚠️ `VerseCard.tsx` - Exists but uses **MOCK DATA**, not connected to Bible JSON files

#### **Feature Completeness:**

| Feature | Status | Notes |
|---------|--------|-------|
| **Quick Navigation (books → chapters)** | ❌ MISSING | No component exists, routes are empty |
| **Reader Controls (font size, theme)** | ❌ MISSING | No controls component exists |
| **Verse Actions (Study with Faith Guide)** | ❌ MISSING | No integration with `/api/faith-study` (which also doesn't exist) |
| **Verse Highlighting** | ❌ MISSING | No highlight component or Supabase integration |
| **Verse Notes** | ❌ MISSING | No notes component or Supabase integration |
| **AI Study Integration** | ❌ MISSING | `/api/faith-study` route does not exist |
| **Reading Plan Support** | ⚠️ PARTIAL | Devotions page has mock reading plans, but no Bible integration |
| **Search** | ❌ MISSING | No search component or functionality |
| **Supabase Integration** | ❌ MISSING | No database tables/queries for notes, highlights, reading progress, streaks |

#### **What Needs to Be Built:**

1. **Bible Reader Component** (`/src/components/BibleReader.tsx`)
   - Display chapter verses from JSON
   - Navigation between chapters
   - Verse selection/highlighting UI

2. **Bible Navigation Component** (`/src/components/BibleNavigation.tsx`)
   - Book selector (dropdown/modal)
   - Chapter selector
   - Progress tracking

3. **Bible Controls Component** (`/src/components/BibleControls.tsx`)
   - Font size slider
   - Theme toggle (light/dark)
   - Reading mode options

4. **Bible Pages Implementation:**
   - `/src/app/bible/page.tsx` - Book selection page
   - `/src/app/bible/[book]/page.tsx` - Chapter selection page
   - `/src/app/bible/[book]/[chapter]/page.tsx` - Chapter reader page

5. **API Route:**
   - `/src/app/api/faith-study/route.ts` - AI study integration

6. **Supabase Integration:**
   - Database tables for notes, highlights, reading progress
   - Service functions to save/load user data

7. **Data Expansion:**
   - Add remaining 65 books to `bible-books.ts`
   - Fetch remaining books using `scripts/fetch-bible.js`

---

## C. CURRENT ENTRY POINTS

### **Main User Flows:**

#### **Dashboard (`/dashboard`)**
- ✅ Fully implemented
- Shows different views for Disciple vs Steward
- Includes gamification (Faith Flame, Unity Points, Badges)
- Personalization suggestions
- Quick actions

#### **Bible (`/bible`)**
- ❌ **NOT FUNCTIONAL** - Empty files, no implementation
- Route exists but shows nothing

#### **Devotions (`/devotions`)**
- ✅ Partially implemented
- Shows mock reading plans
- Has stats (streak, total readings)
- "Read Full Passage" button doesn't link to Bible reader
- Uses mock data

#### **Prayer (`/prayers`)**
- ✅ Implemented with mock data
- Feed of prayer requests
- Create prayer request page
- Like/pray functionality (mock)

#### **Testimonies (`/testimonies`)**
- ✅ Implemented with mock data
- Feed of testimonies
- Create testimony page
- Like/comment functionality (mock)

#### **Steward Features:**
- ✅ `/fellowships/create` - Create fellowship
- ✅ `/fellowships/[id]/manage` - Manage fellowship
- ✅ `/events/create` - Create event
- ✅ `/announcements/create` - Create announcement
- ✅ `/devotions/create` - Create devotional

---

## D. ERRORS OR TECHNICAL DEBT

### **Unreachable/Broken Routes:**
- ⚠️ `/bible` - Route exists but empty, will show blank page
- ⚠️ `/bible/[book]` - Route exists but empty, will show blank page
- ⚠️ `/bible/[book]/[chapter]` - Route exists but empty, will show blank page
- ⚠️ `/devotions/plans` - Referenced in code but route may not exist
- ⚠️ `/devotions/plans/[planId]` - Referenced in code but route may not exist

### **Unused/Misplaced Code:**
- ⚠️ `VerseCard.tsx` - Uses mock data, not connected to actual Bible JSON
- ⚠️ Bible routes exist but are completely empty (should either implement or remove)

### **Missing Imports/Dependencies:**
- No obvious missing imports detected
- All components appear to have proper imports

### **Next.js 13 App Router Conventions:**
- ✅ Structure follows App Router conventions correctly
- ✅ All pages use `'use client'` where needed
- ✅ Route structure is correct (`[book]`, `[chapter]` dynamic routes)
- ⚠️ Empty page files should either be implemented or removed

### **TODO Comments Found:**
- `src/app/prayers/create/page.tsx:59` - `// TODO: Get from user's current fellowship`

---

## E. PENDING TODOs AND PLANNED FEATURES

### **Explicit TODOs in Code:**
1. `src/app/prayers/create/page.tsx` - Line 59: Get fellowship ID from user's current fellowship

### **Commented-Out Logic:**
- None found in Bible-related files (they're just empty)

### **Unmet Features (Based on Requirements):**

#### **Bible Feature:**
- ❌ Bible reader UI
- ❌ Book/chapter navigation
- ❌ Font size controls
- ❌ Theme controls
- ❌ Verse highlighting
- ❌ Verse notes
- ❌ "Study with Faith Guide" AI integration
- ❌ Search functionality
- ❌ Reading plans integration with Bible
- ❌ Supabase integration (notes, highlights, progress, streaks)

#### **AI Features:**
- ❌ `/api/faith-study` endpoint
- ❌ AI-powered Bible study assistance
- ❌ Faith Guide integration

#### **Gamification:**
- ✅ Backend APIs exist (mock mode)
- ⚠️ Frontend components exist but may need Supabase integration
- ❌ Real Supabase integration pending (currently mock mode)

#### **FER (Fellowship Engagement & Retention) System:**
- ⚠️ Partially implemented
- ✅ Fellowship creation/management
- ✅ Activity feeds
- ✅ Unity Points system (mock)
- ❌ Full engagement tracking
- ❌ Retention analytics

#### **Personalization:**
- ✅ Preference system exists
- ✅ Suggestion system exists
- ⚠️ May need refinement based on usage

#### **Supabase Integration:**
- ⚠️ Client configured but in mock mode
- ✅ Schema types defined
- ❌ Real database connection pending
- ❌ Row Level Security (RLS) policies not implemented
- ❌ Real-time subscriptions not implemented

---

## SUMMARY

### **What's Working:**
- ✅ Core app structure (Next.js 13 App Router)
- ✅ Dashboard with Disciple/Steward views
- ✅ Gamification backend (mock mode)
- ✅ Fellowship management
- ✅ Events, Prayers, Testimonies (with mock data)
- ✅ Settings and personalization
- ✅ One complete Bible book (John) with all chapters

### **What's Missing:**
- ❌ **Bible reader implementation** (routes exist but empty)
- ❌ **Bible navigation components**
- ❌ **Bible controls (font, theme)**
- ❌ **Verse actions (highlight, notes, AI study)**
- ❌ **AI study API endpoint**
- ❌ **Bible search**
- ❌ **65 more Bible books** (only John exists)
- ❌ **Supabase real integration** (currently mock mode)
- ❌ **Reading plans Bible integration**

### **Priority Fixes Needed:**
1. **HIGH:** Implement Bible reader pages (currently empty)
2. **HIGH:** Create BibleReader component
3. **HIGH:** Add remaining books to `bible-books.ts` and fetch data
4. **MEDIUM:** Implement Bible controls (font, theme)
5. **MEDIUM:** Create `/api/faith-study` endpoint
6. **MEDIUM:** Implement verse highlighting/notes with Supabase
7. **LOW:** Add Bible search functionality

---

**Which area would you like to work on next?**

