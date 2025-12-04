# Gathered App - Comprehensive Summary

## 🎯 App Overview

**Gathered** is a Christian social platform built to help believers find fellowship, join Bible studies, share testimonies, and grow in faith together. The app connects Christians in local communities through groups, events, prayers, and Bible study features.

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript 5.3.2
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.6
- **Theme**: next-themes (dark/light mode)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React hooks + SWR for data fetching

### Backend & Infrastructure
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for avatars)
- **Deployment**: Vercel
- **Node Version**: Requires Node.js >=18.0.0 (currently using Node 24.x on Vercel)

### Key Libraries
- `@supabase/supabase-js`: Database and auth client
- `swr`: Data fetching and caching
- `openai`: AI-powered features (moderation, recommendations)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── verify-email/
│   │   └── callback/             # Email verification callback route
│   ├── dashboard/                # Main dashboard (role-based)
│   ├── onboarding/               # Role selection (Disciple/Steward)
│   ├── fellowship/               # Fellowship groups
│   ├── events/                   # Event management
│   ├── feed/                     # Social feed
│   ├── prayers/                  # Prayer requests
│   ├── testimonies/              # Testimonies sharing
│   ├── bible-study/              # Bible study tools
│   ├── analytics/                # Analytics dashboard
│   ├── settings/                 # User settings
│   └── page.tsx                  # Homepage (smart router)
├── components/                   # React components
│   ├── DiscipleHome.tsx          # Dashboard for disciples
│   ├── StewardHome.tsx           # Dashboard for stewards
│   ├── BottomNavigation.tsx      # Mobile navigation
│   ├── OnboardingTutorial.tsx    # Interactive tutorial
│   └── personalization/          # Preference forms
├── lib/                          # Core libraries
│   ├── supabase.ts               # Supabase client (lazy-loaded)
│   ├── auth-context.tsx          # Auth context provider
│   ├── prefs.ts                  # User profile/preferences
│   ├── event-service.ts          # Event management
│   ├── fellowship-service.ts     # Fellowship groups
│   ├── post-service.ts           # Social posts
│   └── [other services]
└── hooks/                        # Custom React hooks
    ├── usePrefs.ts               # User role/preferences hook
    ├── useUserProfile.ts         # User profile hook
    └── useUnreadActivity.ts      # Activity tracking
```

## 🎨 Key Features

### 1. **Authentication & Onboarding**
- Email/password authentication via Supabase
- Email verification with callback handler
- Role selection: Disciple or Steward
- Interactive onboarding tutorial
- Profile setup with preferences

### 2. **User Roles**
- **Disciple**: Join groups, participate in events, browse content
- **Steward**: Lead groups, create events, manage communities
- Role stored in `user_profiles.role` field ('disciple' or 'steward')
- Role-based dashboard rendering

### 3. **Dashboard (Role-Based)**
- **DiscipleHome**: Personalized feed, suggestions, activities
- **StewardHome**: Management tools, analytics, group controls
- Bottom navigation: Home, Events, Chat, Fellowships, Devotions
- Unread activity notifications
- Mobile-first responsive design

### 4. **Fellowship Groups**
- Create/join fellowship groups
- Group management (for stewards)
- Location-based discovery
- Group events and activities

### 5. **Events Management**
- Create events (virtual/in-person)
- RSVP system
- Event sharing
- Calendar integration

### 6. **Social Feed**
- Share testimonies
- Prayer requests
- Content engagement (likes, comments)
- Tag system

### 7. **Bible Study Tools**
- Daily verses
- Scripture search
- Memory verse system
- Study plans

### 8. **Settings & Preferences**
- Profile customization
- Notification preferences (cadence: daily/weekly/off, channel: push/email)
- Quiet hours configuration
- Accessibility settings (reduce motion, large text, high contrast)
- Personalization toggles

### 9. **Analytics**
- User engagement metrics
- Content performance
- Growth tracking

## 🗄️ Database Schema

### Key Tables

#### `user_profiles`
- Stores user profile information
- **Columns**: id (UUID, PK), email, name, avatar_url, bio, city, role, interests[], availability[], notif_cadence, notif_channel, quiet_hours_start/end, dismissed_suggestions[], accessibility (JSONB), personalization_enabled (JSONB), profile_complete (boolean)
- **RLS**: Users can only read/update their own profile

#### `user_prefs` (optional fallback)
- Alternative storage for user preferences
- **Columns**: user_id, user_type, updated_at

#### Other Tables (inferred from code)
- `fellowship_groups`
- `events`
- `posts` / `post_comments` / `post_likes`
- `user_badges` (exists in database)
- Content moderation tables

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Policies use `auth.uid() = id` pattern

## 🔐 Authentication Flow

1. **Sign Up**: User creates account → Email verification sent
2. **Email Verification**: Click link → Redirects to `/auth/callback` → Verifies email → Redirects to dashboard
3. **Onboarding**: User selects role (Disciple/Steward) → Saves to `user_profiles.role`
4. **Dashboard Access**: Role-based dashboard loads based on `role` field

### Important Auth Files
- `src/lib/auth-context.tsx`: Auth provider, signUp, signIn, signOut
- `src/app/auth/callback/route.ts`: Email verification handler
- `src/app/onboarding/page.tsx`: Role selection
- `src/hooks/usePrefs.ts`: Role loading/saving

## 🎯 Important Code Patterns

### 1. **Lazy Supabase Client**
`src/lib/supabase.ts` uses a Proxy pattern to lazily initialize the Supabase client only when accessed. This prevents build errors when environment variables aren't set.

### 2. **Type Guards**
Type safety for union types (Role, Cadence, Channel) using type guard functions:
```typescript
function isValidRole(value: string | null | undefined): value is Role {
  return value === 'disciple' || value === 'steward'
}
```

### 3. **LocalStorage Caching**
Profile and preferences are cached in localStorage for instant hydration, then synced with Supabase.

### 4. **Dynamic Routes**
Pages that use client-side hooks are marked as `export const dynamic = 'force-dynamic'` to prevent static generation errors.

### 5. **Mobile-First Design**
- Bottom navigation for mobile
- Responsive layouts (max-w-md containers)
- Touch-friendly UI elements

## 🐛 Recent Fixes & Known Issues

### Fixed Issues
1. ✅ TypeScript type errors in PreferenceForm (role, notifCadence, notifChannel)
2. ✅ Missing fields in UserProfile type (notif_channel, quiet_hours_start/end)
3. ✅ Supabase client initialization during build
4. ✅ Email verification redirects to localhost → Fixed with callback route
5. ✅ ToastProvider missing from layout → Added
6. ✅ Static page generation errors → Made pages dynamic
7. ✅ Homepage showing static landing → Converted to smart router

### Current Issues
1. ⚠️ `user_profiles` table doesn't exist in database (SQL script created but needs to be run)
2. ⚠️ Node.js 24.x being used (very new, may cause compatibility issues)
3. ⚠️ Some deprecated packages (@supabase/auth-helpers-nextjs)
4. ⚠️ ESLint warnings about useEffect dependencies

### Pending Setup
- Supabase Site URL configured
- Environment variables set in Vercel (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Database tables need to be created (user_profiles table script ready)

## 🚀 Deployment Configuration

### Vercel Settings
- **Framework**: Next.js
- **Node Version**: 24.x (auto-selected due to engines requirement)
- **Build Command**: `npm run build`
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL` (optional, auto-detected)

### Supabase Configuration
- **Site URL**: Should be set to Vercel deployment URL
- **Redirect URLs**: Must include callback route
- **Email Templates**: Custom verification emails

## 📱 Mobile Experience

- Fully responsive design
- Bottom navigation bar
- Mobile-optimized forms
- Touch gestures
- PWA-ready structure

## 🎨 Design System

### Color Scheme
- Primary: Gold/Yellow (#D4AF37, #F5C451)
- Background: Navy blue (#0F1433) / Beige (light mode)
- Accent: Purple gradients
- Status: Green (success), Red (error)

### Typography
- Font: Inter (Google Fonts)
- Responsive text sizing
- Dark/light theme support

## 🔄 State Management

- **Auth State**: AuthContext provider
- **Profile State**: useUserProfile hook with SWR
- **Preferences**: usePrefs hook with localStorage caching
- **Unread Activity**: useUnreadActivity hook
- **Component State**: React useState/useReducer

## 📝 Important Notes for Debugging

1. **Supabase Client**: Uses lazy initialization - check environment variables are set
2. **Type Safety**: UserProfile type uses `string | null | undefined` for most fields - need type guards
3. **Onboarding**: Requires user_profiles table with role field
4. **Email Verification**: Needs callback route at `/auth/callback`
5. **Role Loading**: Checks both user_prefs and user_profiles tables
6. **Build Errors**: Some pages must be dynamic due to client-side hooks

## 🎯 Current Development Status

### Completed
- ✅ Authentication system
- ✅ Role-based dashboards
- ✅ Onboarding flow
- ✅ Basic UI components
- ✅ Mobile navigation
- ✅ Settings pages
- ✅ Email verification

### In Progress
- ⏳ Database schema setup
- ⏳ Full feature implementation
- ⏳ Testing and bug fixes

### Planned
- 📅 Fellowship groups (partially implemented)
- 📅 Events system (partially implemented)
- 📅 Social feed (partially implemented)
- 📅 Bible study features
- 📅 Analytics dashboard

## 🔍 Key Files to Review

1. `src/lib/supabase.ts` - Supabase client configuration
2. `src/lib/auth-context.tsx` - Authentication logic
3. `src/hooks/usePrefs.ts` - User role management
4. `src/lib/prefs.ts` - User profile types and utilities
5. `src/app/onboarding/page.tsx` - Role selection
6. `src/app/dashboard/page.tsx` - Main dashboard
7. `src/components/personalization/PreferenceForm.tsx` - Profile setup
8. `create-user-profiles-table.sql` - Database schema

## 🛡️ Security Considerations

- Row Level Security (RLS) on all tables
- User can only access own data
- Email verification required
- Secure authentication via Supabase
- Input validation needed in forms
- Content moderation (AI-powered, partially implemented)

## 📊 Performance Optimizations

- LocalStorage caching for instant UI updates
- SWR for data fetching and caching
- Lazy component loading
- Image optimization (should use Next.js Image component)
- Code splitting via Next.js App Router

---

**Last Updated**: Based on codebase as of recent fixes
**Status**: Active development, production deployment on Vercel
