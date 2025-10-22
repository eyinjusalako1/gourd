# 🚀 Gathered - Manual Setup Guide

## **Current Status:**
- ✅ Node.js v25.0.0 installed
- ✅ npm v11.6.2 installed  
- ✅ yarn installed
- ❌ Dependencies installation failing due to SSL cipher issues

## **Alternative Approach:**

Since we're experiencing SSL cipher issues with package managers, let's proceed with the Supabase setup first, then we'll resolve the dependency issues.

### **Step 1: Set Up Supabase Project**

1. **Go to https://supabase.com**
2. **Sign up/Login** to your account
3. **Create a new project:**
   - Project name: `gathered-app`
   - Database password: Choose a strong password
   - Region: Choose closest to your users
   - Pricing plan: Free tier

4. **Wait for project creation** (takes 2-3 minutes)

### **Step 2: Get Supabase Credentials**

1. **Go to Settings > API** in your Supabase dashboard
2. **Copy these values:**
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

### **Step 3: Set Up Database Schema**

1. **Go to SQL Editor** in Supabase
2. **Copy the entire content** from `supabase-setup.sql`
3. **Paste and run** the SQL script
4. **Verify all tables are created**

### **Step 4: Configure Environment**

1. **Copy `.env.local.example` to `.env.local`**
2. **Edit `.env.local`** with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### **Step 5: Resolve Dependency Issues**

The SSL cipher issue can be resolved by:

1. **Using a different network** (mobile hotspot)
2. **Updating Windows/OpenSSL**
3. **Using offline installation**
4. **Using a different package manager**

### **Step 6: Test Basic Functionality**

Once dependencies are installed:
```bash
npm run dev
# or
yarn dev
```

Visit http://localhost:3000

---

## **Next Steps:**

1. **Set up Supabase project** (most important)
2. **Configure environment variables**
3. **Resolve dependency installation**
4. **Test locally**
5. **Deploy to Vercel**

---

**Let's start with Supabase setup - this is the most critical part!** 🚀


