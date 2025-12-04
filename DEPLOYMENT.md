# 🚀 Gathered - Complete Deployment Guide

## 📋 **Phase 1 Advanced Features - COMPLETED!**

### ✅ **What We've Built:**

**🤖 AI-Powered Content Moderation:**
- Real-time content analysis for inappropriate language, spam, and false doctrine
- Automated flagging system with severity levels
- Admin moderation dashboard with review tools
- Content quality scoring and suggestions

**📚 Bible Study Tools:**
- Daily verse system with sharing capabilities
- Scripture search and discovery
- Memory verse system with spaced repetition
- Study plans and progress tracking
- Popular verses by category (encouragement, comfort, love)

**📊 Advanced Analytics Dashboard:**
- Personal spiritual growth metrics
- Community engagement analytics
- Content performance tracking
- Growth trend analysis
- Achievement milestones and recommendations

**🛡️ Moderation Dashboard:**
- Content flag management
- Admin review tools
- Statistics and reporting
- Automated content analysis

---

## 🚀 **Deployment Instructions**

### **1. Prerequisites**
```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Install Vercel CLI
npm install -g vercel

# Install Supabase CLI (optional)
npm install -g supabase
```

### **2. Environment Setup**
```bash
# Navigate to project directory
cd gathered

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### **3. Supabase Database Setup**

#### **A. Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy your project URL and anon key
4. Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### **B. Database Schema**
Run this SQL in your Supabase SQL editor:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  denomination TEXT,
  location TEXT,
  bio TEXT,
  church_affiliation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fellowship groups table
CREATE TABLE fellowship_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 0,
  max_members INTEGER,
  group_type TEXT NOT NULL CHECK (group_type IN ('bible_study', 'prayer_group', 'fellowship', 'youth_group', 'senior_group', 'mixed')),
  meeting_schedule TEXT,
  meeting_location TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

-- Group memberships table
CREATE TABLE group_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES fellowship_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'rejected')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id)
);

-- Join requests table
CREATE TABLE join_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES fellowship_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('bible_study', 'prayer_meeting', 'fellowship', 'evangelism', 'worship', 'community_service', 'other')),
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,
  virtual_platform TEXT CHECK (virtual_platform IN ('zoom', 'teams', 'google_meet', 'other')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rsvp_count INTEGER DEFAULT 0,
  max_attendees INTEGER,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
  recurrence_end_date TIMESTAMP WITH TIME ZONE,
  group_id UUID REFERENCES fellowship_groups(id),
  is_active BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  requires_rsvp BOOLEAN DEFAULT TRUE,
  allow_guests BOOLEAN DEFAULT TRUE
);

-- Event RSVPs table
CREATE TABLE event_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
  rsvp_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  guest_count INTEGER DEFAULT 0,
  notes TEXT
);

-- Event attendance table
CREATE TABLE event_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('testimony', 'scripture', 'encouragement', 'prayer_request', 'general')),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  group_id UUID REFERENCES fellowship_groups(id),
  event_id UUID REFERENCES events(id),
  is_active BOOLEAN DEFAULT TRUE,
  scripture_reference TEXT,
  prayer_category TEXT CHECK (prayer_category IN ('healing', 'guidance', 'family', 'work', 'ministry', 'other'))
);

-- Post comments table
CREATE TABLE post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  parent_id UUID REFERENCES post_comments(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- Post likes table
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Post shares table
CREATE TABLE post_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT
);

-- Content flags table (for moderation)
CREATE TABLE content_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'group', 'event')),
  flag_type TEXT NOT NULL CHECK (flag_type IN ('inappropriate', 'spam', 'offensive', 'false_doctrine', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  reason TEXT NOT NULL,
  reported_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Study plans table
CREATE TABLE study_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL CHECK (category IN ('new_testament', 'old_testament', 'topical', 'chronological')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}'
);

-- Study sessions table
CREATE TABLE study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  day_number INTEGER NOT NULL,
  verses TEXT[] DEFAULT '{}',
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  reflection TEXT
);

-- Memory verses table
CREATE TABLE memory_verses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  translation TEXT DEFAULT 'NIV',
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_fellowship_groups_created_by ON fellowship_groups(created_by);
CREATE INDEX idx_fellowship_groups_location ON fellowship_groups(location);
CREATE INDEX idx_group_memberships_user_id ON group_memberships(user_id);
CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_content_flags_status ON content_flags(status);
CREATE INDEX idx_memory_verses_user_id ON memory_verses(user_id);
CREATE INDEX idx_memory_verses_next_review ON memory_verses(next_review);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_verses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view public groups" ON fellowship_groups FOR SELECT USING (is_private = FALSE OR is_active = FALSE);
CREATE POLICY "Group creators can manage their groups" ON fellowship_groups FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Users can view memberships they're part of" ON group_memberships FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT created_by FROM fellowship_groups WHERE id = group_id));
CREATE POLICY "Users can join groups" ON group_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view public events" ON events FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Event creators can manage their events" ON events FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Users can manage their own RSVPs" ON event_rsvps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Event creators can view RSVPs" ON event_rsvps FOR SELECT USING (auth.uid() IN (SELECT created_by FROM events WHERE id = event_id));

CREATE POLICY "Anyone can view active posts" ON posts FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Anyone can view active comments" ON post_comments FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON post_comments FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can manage their own likes" ON post_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own shares" ON post_shares FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can report content" ON content_flags FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Admins can view all flags" ON content_flags FOR SELECT USING (true);

CREATE POLICY "Anyone can view public study plans" ON study_plans FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Users can create study plans" ON study_plans FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can manage their own study sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own memory verses" ON memory_verses FOR ALL USING (auth.uid() = user_id);
```

### **4. Deploy to Vercel**

```bash
# Login to Vercel
vercel login

# Deploy the project
vercel

# Set environment variables in Vercel dashboard
# Go to your project settings > Environment Variables
# Add:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
```

### **5. Domain Configuration**
1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain
4. Configure DNS settings with your domain provider

---

## 🎯 **Key Features Implemented**

### **✅ Core Features:**
- ✅ User authentication and profiles
- ✅ Fellowship group discovery and management
- ✅ Event creation and RSVP system
- ✅ Content sharing and community feed
- ✅ Real-time engagement (likes, comments, shares)

### **✅ Advanced Features:**
- ✅ AI-powered content moderation
- ✅ Bible study tools and scripture integration
- ✅ Advanced analytics dashboard
- ✅ Memory verse system with spaced repetition
- ✅ Study plans and progress tracking
- ✅ Content flagging and admin moderation
- ✅ Spiritual growth metrics and recommendations

### **✅ Technical Features:**
- ✅ Responsive design for all devices
- ✅ Dark mode support
- ✅ Real-time updates
- ✅ Comprehensive error handling
- ✅ Clean, well-structured codebase
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling

---

## 🚀 **Next Steps for Competitive Advantage**

### **Phase 2 Features (3-6 months):**
1. **Mobile App** (React Native)
2. **Worship Integration** (Music, streaming)
3. **Family Features** (Parental controls, children's content)
4. **Gamification** (Achievements, challenges)
5. **Mentorship System** (Mentor-mentee matching)

### **Phase 3 Features (6-12 months):**
1. **Global Mission Features** (International reach)
2. **Health Integration** (Mental health resources)
3. **Advanced AI** (Personalized recommendations)
4. **Enterprise Features** (Church management tools)

---

## 📊 **Competitive Advantages**

1. **Comprehensive Christian Ecosystem** - Not just social media, but complete spiritual journey platform
2. **AI-Powered Safety** - Advanced content moderation ensures Christ-centered environment
3. **Bible Study Integration** - Built-in scripture tools and memory systems
4. **Spiritual Growth Tracking** - Analytics for personal and community development
5. **Family-First Design** - Safe, wholesome environment for all ages

**Gathered is now ready to compete with any Christian social platform!** 🙏

The app provides a complete ecosystem for Christian community, growth, and fellowship with advanced features that set it apart from competitors.










