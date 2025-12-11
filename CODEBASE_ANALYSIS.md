# Gathered App - Codebase Analysis Report
**Date:** December 2024  
**Purpose:** Comprehensive snapshot of current state for v1 launch planning

---

## Tech Stack & Project Structure

### Framework & Core Stack
- **Next.js:** 14.2.5 (App Router)
- **TypeScript:** 5.3.2
- **React:** 18.2.0
- **Tailwind CSS:** 3.3.6
- **Supabase:** 
  - Client: `@supabase/supabase-js` v2.38.4
  - Auth Helpers: `@supabase/auth-helpers-nextjs` v0.8.7
- **OpenAI:** v4.20.1 (for AI agents)
- **State Management:** SWR v2.2.4
- **UI Libraries:** 
  - lucide-react (icons)
  - framer-motion (animations)
  - next-themes (theme switching)

### Project Structure
```
src/
├── app/
│   ├── (app)/              # Protected app routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── discovery/      # Discovery Assistant UI
│   │   ├── events/         # Events listing & creation
│   │   ├── fellowship/    # Fellowship groups
│   │   ├── devops-assistant/ # DevOps Assistant UI
│   │   └── [other routes]
│   ├── onboarding/        # Onboarding flow
│   │   └── profile/        # Profile creation step
│   ├── api/
│   │   ├── agents/[name]/  # AI agent endpoint
│   │   ├── onboarding/save-profile/
│   │   ├── profile/get-profile/
│   │   └── gamification/   # Gamification endpoints
│   └── auth/              # Auth routes
├── agents/
│   └── config.ts          # All agent configurations
├── lib/
│   ├── supabase.ts        # Client-side Supabase
│   ├── supabaseServer.ts  # Server-side Supabase (service role)
│   ├── auth-context.tsx   # Auth provider
│   ├── prefs.ts           # User profile management
│   ├── event-service.ts   # Event CRUD operations
│   └── [other services]
└── hooks/
    ├── useUserProfile.ts  # Profile hook
    └── usePrefs.ts        # Preferences hook
```

### App Routes (Top-Level)

**Public Routes:**
- `/` - Home (redirects based on auth state)
- `/auth/login` - Login page
- `/auth/callback` - Auth callback handler
- `/onboarding` - Role selection (Disciple/Steward)
- `/onboarding/profile` - Profile creation with OnboardingAssistant

**Protected Routes (app/(app)/):**
- `/dashboard` - Main dashboard (shows profile summary, actions)
- `/discovery` - Discovery Assistant UI (`/discover/assistant` mentioned in code but route is `/discovery`)
- `/events` - Events listing page
- `/events/create` - Event creation (Steward only)
- `/events/[id]` - Event detail page
- `/fellowship` - Fellowship groups listing
- `/fellowship/create` - Create fellowship group
- `/fellowship/[id]` - Fellowship detail
- `/devops-assistant` - DevOps Assistant UI
- `/chat`, `/devotions`, `/prayers`, `/testimonies`, `/bible-study`, `/analytics`, `/settings` - Various feature pages (implementation status unclear)

### API Routes

**`/api/agents/[name]`** - Universal AI agent endpoint
- **Method:** POST
- **Purpose:** Routes requests to any configured agent
- **Agents supported:** OnboardingAssistant, DiscoveryAssistant, ActivityPlanner, ContentEngine, QAEngine, InsightsEngine, DevOpsAssistant
- **Mock mode:** Controlled by `GATHERED_MOCK_AGENTS` env var
- **Fallback:** Falls back to mock if OpenAI API fails

**`/api/onboarding/save-profile`**
- **Method:** POST
- **Purpose:** Saves onboarding result to `user_profiles` table
- **Uses:** Service role key (bypasses RLS)
- **Saves:** bio, interests (tags), availability, profile_complete flag

**`/api/profile/get-profile`**
- **Method:** POST
- **Purpose:** Fetches user profile by userId
- **Table:** `user_profiles`

**`/api/gamification/*`** - Multiple endpoints
- `/badges/check` - Check user badges
- `/badges/[userId]` - Get user badges
- `/challenges/[fellowshipId]/active` - Active challenges
- `/faith-flame/[userId]/[fellowshipId]` - Faith flame tracking
- `/highlights/[fellowshipId]` - Fellowship highlights
- `/track-activity` - Track user activity
- `/unity-points/[fellowshipId]` - Unity points for fellowship

**`/api/faith-study`** - Faith study endpoint (implementation unclear)

---

## Routes & Product Flows

### Onboarding

**Flow:**
1. User selects role (`/onboarding`) → saves to `user_profiles.role` (Disciple/Steward)
2. User completes profile form (`/onboarding/profile`) → 3-step form:
   - Step 1: Interests (free text)
   - Step 2: Social vibe (weekend style, social energy)
   - Step 3: Timing & group size (availability, preferred_group_size)
3. On submit → calls `/api/agents/OnboardingAssistant` with answers
4. OnboardingAssistant returns: `short_bio`, `long_bio`, `tags`, `social_style`, `preferred_group_size`, `availability_summary`
5. Result saved via `/api/onboarding/save-profile` to `user_profiles` table
6. Redirects to `/dashboard`

**Data Saved:**
- Table: `user_profiles`
- Columns: `bio`, `interests` (array), `availability` (array), `profile_complete` (true)
- Also saves: `social_style`, `preferred_group_size` (from assistant response)

**Status:** ✅ **Fully implemented and working**

### Dashboard

**Current Implementation:**
- Route: `/dashboard`
- Shows: User profile summary (bio, tags, social style, group size, availability)
- Actions:
  - "Find your people" → `/discover/assistant` (but route is `/discovery`)
  - "Host your first hangout" → `/events/create` (placeholder comment says "coming soon")
  - "Edit profile" → `/profile` (placeholder route)

**Data Loading:**
- Fetches profile via `/api/profile/get-profile` (POST with userId)
- Uses `useAuth()` to get `user.id` from Supabase Auth session

**Status:** ✅ **UI implemented, but some routes are placeholders**

### Discovery

**Current Implementation:**
- Route: `/discovery` (not `/discover/assistant` as mentioned in dashboard)
- UI: Simple form with textarea for natural language query
- Calls: `/api/agents/DiscoveryAssistant` with query
- Returns: Structured filters (intent, interests, location_hint, time_preferences, other_constraints)
- **Displays:** Parsed filters in UI
- **Does NOT:** Actually search Supabase for matching people/groups/events

**Status:** ⚠️ **Agent integration works, but no backend search implementation**

### Events/Groups

**Events:**
- **Listing:** `/events` - Shows upcoming events from `events` table
- **Creation:** `/events/create` - Full form (Steward only)
  - Fields: title, description, event_type, location, virtual settings, dates, RSVP settings, tags
  - Uses `EventService.createEvent()` → saves to `events` table
- **Detail:** `/events/[id]` - Route exists, implementation unclear
- **Service:** `EventService` class with full CRUD operations
  - Tables used: `events`, `event_rsvps`, `event_attendance`, `event_attendees`

**Fellowships:**
- **Routes:** `/fellowship`, `/fellowship/create`, `/fellowship/[id]`
- **Service:** `FellowshipService` exists (not fully reviewed)
- **Tables:** Likely `fellowships` or similar

**Status:** ✅ **Events CRUD fully implemented, Fellowships partially implemented**

---

## AI Agents Status

### OnboardingAssistant
- **Config:** ✅ Defined in `agents/config.ts`
- **Used:** ✅ Used in `/onboarding/profile` page
- **Mock:** ✅ Has mock implementation in `/api/agents/[name]/route.ts`
- **Real OpenAI:** ✅ Uses `gpt-4o-mini` when `GATHERED_MOCK_AGENTS !== "true"`
- **Status:** ✅ **Fully working**

### DiscoveryAssistant
- **Config:** ✅ Defined in `agents/config.ts`
- **Used:** ✅ Used in `/discovery` page
- **Mock:** ✅ Has mock implementation
- **Real OpenAI:** ✅ Uses real API when not in mock mode
- **Status:** ⚠️ **Agent works, but results not connected to database search**

### ActivityPlanner
- **Config:** ✅ Defined in `agents/config.ts`
- **Used:** ❌ **Not used anywhere in UI**
- **Mock:** ✅ Has mock implementation
- **Status:** ⚠️ **Configured but unused**

### ContentEngine
- **Config:** ✅ Defined in `agents/config.ts`
- **Used:** ❌ **Not used anywhere in UI**
- **Mock:** ✅ Has mock implementation
- **Status:** ⚠️ **Configured but unused**

### QAEngine
- **Config:** ✅ Defined in `agents/config.ts`
- **Used:** ❌ **Not used anywhere in UI**
- **Mock:** ❌ **No mock implementation**
- **Status:** ⚠️ **Configured but unused**

### InsightsEngine
- **Config:** ✅ Defined in `agents/config.ts`
- **Used:** ❌ **Not used anywhere in UI**
- **Mock:** ❌ **No mock implementation**
- **Status:** ⚠️ **Configured but unused**

### DevOpsAssistant
- **Config:** ✅ Defined in `agents/config.ts`
- **Used:** ✅ Used in `/devops-assistant` page
- **Mock:** ✅ Has mock implementation
- **Real OpenAI:** ✅ Uses real API when not in mock mode
- **Status:** ✅ **Fully working**

### Agent Endpoint Behavior
- **Route:** `/api/agents/[name]`
- **Mock Mode:** Controlled by `GATHERED_MOCK_AGENTS` env var
- **Fallback:** If OpenAI API fails or returns invalid JSON, falls back to mock
- **Model:** Uses `gpt-4o-mini` with temperature 0.4
- **Response Format:** Returns `{ agent, data, _mock?, _fallback?, warning? }`

---

## Supabase & Data Model

### Tables in Use

**`user_profiles`** (Primary user data table)
- **Key Columns:**
  - `id` (UUID, primary key, matches `auth.users.id`)
  - `email`, `name`, `avatar_url`
  - `role` ('disciple' | 'steward')
  - `bio` (text)
  - `interests` (text[] or JSON)
  - `availability` (text[] or JSON)
  - `social_style`, `preferred_group_size`, `availability_summary` (from onboarding)
  - `profile_complete` (boolean)
  - `city`, `preferred_fellowship_id`
  - `notif_cadence`, `notif_channel`, `quiet_hours_start`, `quiet_hours_end`
  - `dismissed_suggestions` (text[])
  - `personalization_enabled` (JSON)
  - `accessibility` (JSON)
  - `created_at`, `updated_at`, `last_seen_at`, `last_activity_at`

**`events`**
- **Key Columns:** `id`, `title`, `description`, `event_type`, `location`, `is_virtual`, `virtual_link`, `virtual_platform`, `start_time`, `end_time`, `max_attendees`, `is_recurring`, `recurrence_pattern`, `recurrence_end_date`, `group_id`, `requires_rsvp`, `allow_guests`, `tags`, `created_by`, `is_active`, `rsvp_count`, `created_at`, `updated_at`

**`event_rsvps`**
- **Key Columns:** `id`, `event_id`, `user_id`, `status` ('going' | 'maybe' | 'not_going'), `guest_count`, `notes`, `rsvp_date`

**`event_attendance`**
- **Key Columns:** `id`, `event_id`, `user_id`, `attended`, `check_in_time`, `check_out_time`, `notes`

**`event_attendees`** (referenced in code, relationship table)
- Likely: `event_id`, `user_id`

**Gamification Tables** (referenced in API routes):
- `badges`, `challenges`, `faith_flame`, `highlights`, `unity_points`, `user_activity`

**Fellowship Tables:**
- Likely `fellowships` or similar (referenced in `FellowshipService`)

### Auth Usage

**Supabase Auth:**
- ✅ **Fully integrated** via `@supabase/auth-helpers-nextjs`
- **Client-side:** `supabase.auth` in `auth-context.tsx`
- **User ID Access:** `user.id` from `useAuth()` hook (from `session.user.id`)
- **Auth Flow:**
  1. User signs up/logs in via Supabase Auth
  2. Session stored client-side
  3. `AuthProvider` wraps app and provides `user` object
  4. Protected routes check `user` existence
  5. `user.id` used as foreign key in `user_profiles.id`

**RLS (Row Level Security):**
- ⚠️ **Status unclear from code review**
- Code comments mention RLS issues in error messages
- `save-profile` endpoint uses **service role key** (bypasses RLS)
- `get-profile` endpoint uses `supabaseServer` (service role)
- Client-side operations may be blocked by RLS if not configured
- Error messages in code suggest RLS policies may need configuration

### Data Access Patterns

**Client-side:**
- Uses `supabase` client (anon key) for reads
- May be blocked by RLS if policies not set

**Server-side:**
- Uses `supabaseServer` (service role key) for writes
- Bypasses RLS (used in API routes)

**Potential Issues:**
- Mixed use of client/server clients may cause RLS confusion
- Service role used for profile saves (secure but bypasses RLS checks)

---

## Known Gaps / Risks

### Engineering

1. **Discovery Assistant Not Connected**
   - Agent returns structured filters but no backend search implemented
   - No API endpoint to search `user_profiles`, `events`, or `fellowships` using filters
   - **Impact:** Feature is half-built

2. **Route Mismatches**
   - Dashboard links to `/discover/assistant` but route is `/discovery`
   - Dashboard links to `/profile` for edit (route may not exist)
   - **Impact:** Broken navigation

3. **RLS Policy Status Unknown**
   - Code suggests RLS may not be fully configured
   - Service role used for writes (bypasses RLS)
   - Client-side reads may fail if RLS not configured
   - **Impact:** Security risk or runtime errors

4. **Unused Agents**
   - ActivityPlanner, ContentEngine, QAEngine, InsightsEngine configured but not used
   - **Impact:** Dead code, maintenance burden

5. **Type Safety Issues**
   - `event-service.ts` imports from `./supabase` but should be `@/lib/supabase`
   - Some type definitions may be incomplete

6. **Missing Error Handling**
   - Some API routes may not handle all error cases
   - Client-side error messages could be more user-friendly

7. **Database Schema Not Documented**
   - No clear schema file visible
   - Table relationships inferred from code
   - **Impact:** Hard to verify data model completeness

### Product/Flow

1. **Discovery Flow Incomplete**
   - Discovery Assistant works but results don't lead to actual matches
   - No search results page
   - **Impact:** Core feature non-functional

2. **Activity Planner Not Integrated**
   - Agent exists but not used in event creation flow
   - Event creation form is manual (no AI assistance)
   - **Impact:** Missing AI-powered event planning feature

3. **Profile Edit Missing**
   - Dashboard links to `/profile` but route may not exist
   - No way to edit profile after onboarding
   - **Impact:** Users can't update their information

4. **Event Detail Page Unclear**
   - Route exists (`/events/[id]`) but implementation not reviewed
   - RSVP functionality may not be fully implemented

5. **Fellowship Features Partial**
   - Routes exist but full implementation unclear
   - Fellowship creation and management may be incomplete

6. **Gamification Features**
   - API endpoints exist but UI integration unclear
   - May be backend-only at this stage

### Security

1. **RLS Policies**
   - Status unknown - may allow unauthorized access or block legitimate access
   - Service role used for writes (secure but bypasses RLS validation)
   - **Risk:** Data exposure or access denied errors

2. **API Authentication**
   - API routes don't explicitly verify user authentication in all cases
   - Some routes accept `userId` in body without verifying it matches session
   - **Risk:** Users could access/modify other users' data

3. **Environment Variables**
   - `SUPABASE_SERVICE_ROLE_KEY` required for production
   - `OPENAI_API_KEY` required for real agent responses
   - Missing env vars cause fallback to mocks (may hide issues)

4. **Input Validation**
   - Limited validation on API route inputs
   - SQL injection risk mitigated by Supabase client, but input sanitization unclear

---

## Summary

### What's Working ✅
- Onboarding flow (complete with AI agent)
- Dashboard UI and profile display
- Event creation and listing (Steward role)
- Discovery Assistant agent (returns structured filters)
- DevOps Assistant (fully functional)
- Supabase Auth integration
- Basic profile management

### What's Half-Done ⚠️
- Discovery flow (agent works, no backend search)
- Event detail pages (routes exist, implementation unclear)
- Fellowship features (partial)
- Profile editing (route missing)
- Activity Planner agent (configured, unused)

### What's Missing ❌
- Backend search for Discovery Assistant results
- Integration of Activity Planner into event creation
- Profile edit page
- Comprehensive RLS policy documentation/verification
- Full event RSVP/attendance UI
- ContentEngine, QAEngine, InsightsEngine UI integration

### Critical Path to v1
1. **Fix Discovery flow** - Connect agent results to database search
2. **Verify RLS policies** - Ensure security and access control
3. **Add profile editing** - Complete user management
4. **Fix route mismatches** - Ensure navigation works
5. **Complete event detail pages** - RSVP and attendance UI
6. **Remove or integrate unused agents** - Clean up codebase

---

**Next Steps Recommendation:**
1. Audit Supabase RLS policies
2. Implement Discovery search backend
3. Create profile edit page
4. Fix route navigation issues
5. Complete event detail/RSVP flow
6. Remove unused agent code or integrate it

