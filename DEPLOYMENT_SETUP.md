# Gathered Deployment Setup Script

## 🚀 **Step 1: Install Prerequisites**

### **A. Install Node.js**
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Restart your terminal/command prompt

### **B. Verify Installation**
```bash
node --version
npm --version
```

### **C. Install Global Tools**
```bash
# Install Vercel CLI
npm install -g vercel

# Install Supabase CLI (optional but recommended)
npm install -g supabase
```

## 🗄️ **Step 2: Supabase Setup**

### **A. Create Supabase Account**
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project
4. Choose a project name: "gathered-app"
5. Set a strong database password
6. Choose a region close to your users

### **B. Get Project Credentials**
1. In your Supabase dashboard, go to Settings > API
2. Copy these values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

### **C. Set Up Database Schema**
1. Go to SQL Editor in Supabase
2. Copy and paste the complete schema from DEPLOYMENT.md
3. Run the SQL to create all tables and policies

## 🔧 **Step 3: Environment Configuration**

### **A. Create Environment File**
```bash
# In your project directory
cp .env.local.example .env.local
```

### **B. Update Environment Variables**
Edit `.env.local` with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🚀 **Step 4: Deploy to Vercel**

### **A. Install Dependencies**
```bash
cd gathered
npm install
```

### **B. Test Locally**
```bash
npm run dev
```
Visit http://localhost:3000 to test your app

### **C. Deploy to Vercel**
```bash
# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: gathered
# - Directory: ./
# - Override settings? No
```

### **D. Set Environment Variables in Vercel**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### **E. Redeploy**
```bash
vercel --prod
```

## 🌐 **Step 5: Custom Domain (Optional)**

### **A. Add Domain in Vercel**
1. Go to your project in Vercel dashboard
2. Click "Domains" tab
3. Add your custom domain
4. Follow DNS configuration instructions

### **B. Configure DNS**
Add these DNS records with your domain provider:
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

## ✅ **Step 6: Final Testing**

### **A. Test All Features**
1. Visit your deployed URL
2. Create a test account
3. Test all features:
   - User registration/login
   - Create posts
   - Join fellowship groups
   - Create events
   - Use Bible study tools
   - Check analytics dashboard

### **B. Monitor Performance**
1. Check Vercel analytics
2. Monitor Supabase usage
3. Test on mobile devices

## 🔧 **Troubleshooting**

### **Common Issues:**

**1. Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Environment Variables Not Working**
- Check Vercel environment variables are set
- Redeploy after adding variables
- Check variable names match exactly

**3. Database Connection Issues**
- Verify Supabase URL and keys
- Check RLS policies
- Ensure tables are created

**4. Authentication Issues**
- Check Supabase Auth settings
- Verify redirect URLs
- Check email templates

## 📊 **Post-Deployment Checklist**

- [ ] App loads successfully
- [ ] User registration works
- [ ] User login works
- [ ] Posts can be created
- [ ] Fellowship groups work
- [ ] Events can be created
- [ ] Bible study tools work
- [ ] Analytics dashboard loads
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] All navigation links work

## 🎯 **Next Steps After Deployment**

1. **Monitor Usage**: Check Vercel and Supabase dashboards
2. **Gather Feedback**: Test with real users
3. **Optimize Performance**: Monitor Core Web Vitals
4. **Plan Phase 2**: Mobile app, worship integration
5. **Marketing**: Share with Christian communities

---

**Your Gathered app will be live and ready to serve the Christian community!** 🙏









