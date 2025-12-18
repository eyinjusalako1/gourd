# 🗄️ Supabase Setup Guide for Gathered

## **Step 1: Create Supabase Account & Project**

### **A. Sign Up/Login**
1. **Go to https://supabase.com**
2. **Click "Start your project"** or **"Sign in"**
3. **Sign up with:**
   - GitHub (recommended)
   - Email
   - Google

### **B. Create New Project**
1. **Click "New Project"**
2. **Fill in project details:**
   - **Organization**: Choose your organization or create new
   - **Project Name**: `gathered-app`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East, Europe)
   - **Pricing Plan**: Free tier (perfect for development)

3. **Click "Create new project"**
4. **Wait 2-3 minutes** for project creation

---

## **Step 2: Get Project Credentials**

### **A. Access API Settings**
1. **In your Supabase dashboard**, go to **Settings** (gear icon)
2. **Click "API"** in the left sidebar

### **B. Copy Credentials**
You'll see three important values:

1. **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
2. **Anon (public) key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
3. **Service role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

**⚠️ Important:** Keep the Service role key secret - it has admin privileges!

---

## **Step 3: Set Up Database Schema**

### **A. Open SQL Editor**
1. **In your Supabase dashboard**, click **"SQL Editor"** in the left sidebar
2. **Click "New query"**

### **B. Run Database Schema**
1. **Open the file `supabase-setup.sql`** in your project folder
2. **Copy the entire content** (it's a large SQL script)
3. **Paste it into the SQL Editor**
4. **Click "Run"** (or press Ctrl+Enter)

### **C. Verify Tables Created**
After running the script, you should see:
- ✅ **Success message** in the SQL Editor
- ✅ **Tables appear** in the "Table Editor" section
- ✅ **All tables listed**: profiles, fellowship_groups, events, posts, etc.

---

## **Step 4: Configure Environment Variables**

### **A. Create Environment File**
1. **In your project folder**, copy `.env.local.example` to `.env.local`
2. **Open `.env.local`** in a text editor

### **B. Add Supabase Credentials**
Replace the placeholder values with your actual Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **C. Save the File**
Make sure to save `.env.local` with your credentials.

---

## **Step 5: Test Database Connection**

### **A. Verify Tables**
1. **In Supabase dashboard**, go to **"Table Editor"**
2. **You should see these tables:**
   - `profiles`
   - `fellowship_groups`
   - `group_memberships`
   - `join_requests`
   - `events`
   - `event_rsvps`
   - `event_attendance`
   - `posts`
   - `post_comments`
   - `post_likes`
   - `post_shares`
   - `content_flags`
   - `study_plans`
   - `study_sessions`
   - `memory_verses`

### **B. Check Row Level Security**
1. **Go to "Authentication" > "Policies"**
2. **Verify RLS is enabled** on all tables
3. **Check that policies are created**

---

## **Step 6: Configure Authentication**

### **A. Set Up Auth Providers**
1. **Go to "Authentication" > "Providers"**
2. **Enable Email provider** (should be enabled by default)
3. **Configure email templates** (optional)

### **B. Set Up Redirect URLs**
1. **Go to "Authentication" > "URL Configuration"**
2. **Add redirect URLs:**
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback` (for production)

---

## **Step 7: Test Basic Functionality**

### **A. Create Test User**
1. **Go to "Authentication" > "Users"**
2. **Click "Add user"**
3. **Create a test user** with email and password

### **B. Verify Database Connection**
Once dependencies are installed, you can test the connection by running:
```bash
npm run dev
# or
yarn dev
```

---

## **Troubleshooting**

### **Common Issues:**

**1. SQL Script Fails**
- Check for syntax errors
- Ensure you're copying the entire script
- Try running sections separately

**2. Tables Not Created**
- Refresh the Table Editor
- Check the SQL Editor for error messages
- Verify you have the correct permissions

**3. Environment Variables Not Working**
- Check file name is exactly `.env.local`
- Verify no extra spaces or quotes
- Restart your development server

**4. Authentication Issues**
- Check redirect URLs are correct
- Verify email provider is enabled
- Check RLS policies are created

---

## **Next Steps After Supabase Setup:**

1. ✅ **Supabase project created**
2. ✅ **Database schema deployed**
3. ✅ **Environment variables configured**
4. ✅ **Authentication configured**
5. 🔄 **Resolve dependency installation**
6. 🔄 **Test locally**
7. 🔄 **Deploy to Vercel**

---

**Ready to start? Let's begin with Step 1 - creating your Supabase project!** 🚀












