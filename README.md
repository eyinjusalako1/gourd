# 🙏 Gathered - Christian Social App

> "For where two or three gather in my name, there am I with them." - Matthew 18:20

A comprehensive Christian social platform that helps believers find fellowship, join Bible studies, share testimonies, and grow in faith together.

## ✨ Features

### 🔐 **Authentication & Profiles**
- Secure email/password authentication
- User profiles with denomination, location, bio
- Church affiliation tracking
- Protected routes and session management

### 👥 **Fellowship Discovery**
- Find and join Christian fellowship groups
- Create public/private groups
- Group management with admin controls
- Join requests and approval system
- Location-based group discovery

### 📅 **Event Management**
- Create and manage Christian events
- RSVP system with guest management
- Virtual and in-person event support
- Recurring event patterns
- Event sharing and discovery

### 📱 **Content Sharing**
- Share testimonies, scripture, and encouragement
- Prayer request system with categories
- Like, comment, and share functionality
- Content moderation and safety features
- Tag system for discoverability

### 📚 **Bible Study Tools**
- Daily verse system with sharing
- Scripture search and discovery
- Memory verse system with spaced repetition
- Study plans and progress tracking
- Popular verses by category

### 📊 **Analytics & Growth**
- Personal spiritual growth metrics
- Community engagement analytics
- Content performance tracking
- Achievement milestones
- Growth recommendations

### 🤖 **AI-Powered Moderation**
- Real-time content analysis
- Automated inappropriate content detection
- Admin moderation dashboard
- Content quality scoring
- Safety and doctrinal accuracy

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/gathered.git
cd gathered
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. **Set up Supabase**
- Create a new Supabase project
- Run the database schema from `DEPLOYMENT.md`
- Copy your project URL and keys to `.env.local`
- **Create storage bucket for avatars:**
  - Go to Storage in your Supabase dashboard
  - Click "New bucket"
  - Name it `Avatars` (or `avatars`)
  - Make it **Public** (uncheck "Private bucket")
  - Click "Create bucket"
- **Set up Row Level Security (RLS) policies for user_profiles:**
  - Go to Authentication > Policies in your Supabase dashboard
  - Or run this SQL in the SQL Editor:
  ```sql
  -- Enable RLS on user_profiles table
  ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

  -- Allow users to read their own profile
  CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

  -- Allow users to update their own profile
  CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

  -- Allow users to insert their own profile
  CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
  ```

5. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🗄️ Database Schema

The app uses Supabase with the following main tables:
- `profiles` - User profile information
- `fellowship_groups` - Fellowship group data
- `group_memberships` - User-group relationships
- `events` - Event information
- `event_rsvps` - Event attendance
- `posts` - User-generated content
- `post_comments` - Comments on posts
- `post_likes` - Post engagement
- `content_flags` - Moderation system
- `study_plans` - Bible study plans
- `study_sessions` - User study progress
- `memory_verses` - Scripture memorization

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables in Vercel dashboard**
4. **Redeploy**
```bash
vercel --prod
```

See `DEPLOYMENT_SETUP.md` for detailed deployment instructions.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, next-themes
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📱 Mobile Support

The app is fully responsive and works on all devices. Future mobile app development planned.

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Content moderation and flagging system
- Secure authentication with Supabase
- HTTPS enforcement
- Security headers and policies
- Input validation and sanitization

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Mission

Gathered exists to help Christians connect, fellowship, and grow in faith together. We believe in creating a safe, Christ-centered environment where believers can share testimonies, study scripture, and build meaningful relationships.

## 📞 Support

- 📧 Email: support@gathered.app
- 💬 Discord: [Join our community](https://discord.gg/gathered)
- 📖 Documentation: [docs.gathered.app](https://docs.gathered.app)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/gathered/issues)

## 🎯 Roadmap

### Phase 2 (Q2 2024)
- [ ] Mobile app (React Native)
- [ ] Worship music integration
- [ ] Family features and parental controls
- [ ] Gamification and achievements

### Phase 3 (Q3-Q4 2024)
- [ ] Global mission features
- [ ] Mental health resources
- [ ] Advanced AI recommendations
- [ ] Church management tools

---

**Built with ❤️ for the Christian community**

*"And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another—and all the more as you see the Day approaching." - Hebrews 10:24-25*