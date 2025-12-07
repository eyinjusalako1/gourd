# Quick Deployment Checklist

## ✅ Pre-Deployment (Already Done)
- [x] Code pushed to GitHub
- [x] Agent system files created
- [x] EJ onboarding page created
- [x] API routes set up

## 📋 Steps to Deploy on Vercel

### 1. Go to Vercel
- Visit: https://vercel.com
- Sign in with GitHub

### 2. Import Project
- Click "Add New..." → "Import Project"
- Select: `eyinjusalako1/Gathered-App`
- Click "Import"

### 3. Add Environment Variables
Click "Environment Variables" and add:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` = (from Supabase dashboard → Settings → API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from Supabase dashboard → Settings → API)
- `OPENAI_API_KEY` = (from https://platform.openai.com/api-keys)

**For each variable:**
- Check: Production, Preview, Development
- Click "Add"

### 4. Deploy
- Click "Deploy" button
- Wait 2-5 minutes for build
- Click "Visit" when done

### 5. Test
- Visit: `https://your-app.vercel.app/onboarding/ej-onboarding`
- Test the agent API endpoints

## 🎯 That's It!

Your app will auto-deploy on every push to `master` branch.

