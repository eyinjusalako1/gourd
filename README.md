# Gathered - Fellowship-First Youth Community Platform

A modern Next.js application designed for youth fellowships to build deep community through shared devotion, prayer, and consistent engagement.

## Vision

Make Gathered deeply useful for youth fellowships by focusing on intimacy, shared devotion, and consistent activity—without replacing existing tools like WhatsApp or Instagram.

## Core Features

- 🌿 **Fellowship Feed** - Unified activity feed (posts, prayers, testimonies, devotions)
- 📊 **Engagement Tracking** - Fellowship Engagement Rate (FER) to measure spiritual participation
- 🔥 **Streaks & Badges** - Gamification to drive consistency
- 👑 **Steward Tools** - Weekly summaries, check-in prompts, growth analytics
- 📱 **Social Integration** - Share to WhatsApp, Instagram, Email
- 📅 **Event Management** - Fellowship gatherings with RSVP
- 💬 **Messages** - Fellowship group chats
- 👤 **Profile** - Personal stats and achievements

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Supabase (configurable)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `out` folder to Netlify

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Documentation

### Strategic Planning
- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - High-level strategy and business model
- **[PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md)** - Detailed product strategy and features
- **[ROADMAP_SUMMARY.md](./ROADMAP_SUMMARY.md)** - Quick overview of all changes

### Technical Implementation
- **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)** - Database schema, APIs, FER system
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Social media integration implementation
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - 12-week phased rollout guide

### Design & UX
- **[WIREFRAME_DASHBOARD.md](./WIREFRAME_DASHBOARD.md)** - Mobile-first dashboard wireframes
- **[REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md)** - Dashboard refactor details

### Build & Deployment
- **[BUILD_SUMMARY.md](./BUILD_SUMMARY.md)** - Feature overview and build status
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[TESTING_INSTRUCTIONS.md](./TESTING_INSTRUCTIONS.md)** - Testing scenarios

### Branding
- **[LOGO_GUIDE.md](./LOGO_GUIDE.md)** - Brand guidelines and assets

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── dashboard/              # Main dashboard (youth-focused)
│   ├── events/                 # Events listing and creation
│   ├── fellowships/            # Fellowship management
│   ├── chat/                   # Group messages
│   ├── profile/                # User profiles
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # Reusable components
│   ├── FellowshipFeed.tsx      # Unified activity feed
│   ├── EngagementStreak.tsx    # Streak tracking
│   ├── GrowthCard.tsx          # Fellowship metrics
│   ├── UpcomingEvents.tsx      # Event cards
│   ├── QuickActions.tsx        # Action buttons
│   └── CommunityHighlight.tsx  # Encouragement cards
├── lib/                        # Utilities and services
│   ├── auth-context.tsx        # Authentication
│   ├── event-service.ts        # Event management
│   └── content-moderation.ts   # Moderation tools
└── types/                      # TypeScript definitions
    └── index.ts                # Main types
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | API base URL | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Optional |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Optional |

## Key Metrics

### Fellowship Engagement Rate (FER)
Core metric measuring spiritual participation:

```
FER = (Posts×2 + Prayers×1.5 + Events×3 + Check-ins×1 + Devotions×2) / Members
```

**Target:** 15+ points per member per week

### Growth Indicators
- **Streak Tracking:** Fellowship, prayer, devotion streaks
- **Achievement Badges:** Community, consistency, leadership, spiritual milestones
- **Growth Cards:** Member trends, top contributors, milestones

## Product Roadmap

Gathered is currently in **Phase 1: Foundation** of a 12-week rollout:

- ✅ Phase 1-2: MVP deployed, navigation simplified, dashboard redesigned
- 🔄 Phase 3-8: FER tracking, social integrations, steward tools
- ⏳ Phase 9-12: Beta testing, production launch, scaling

See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for full timeline.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Building community that matters.** 🌿



