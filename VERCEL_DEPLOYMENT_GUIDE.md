# Vercel Deployment Guide - Step by Step

## Step 1: Verify Your Code is Pushed to GitHub

1. Open your terminal/PowerShell
2. Navigate to your project: `cd C:\Users\user\gathered`
3. Check git status:
   ```bash
   git status
   ```
4. If there are uncommitted changes, commit them:
   ```bash
   git add -A
   git commit -m "Add agent system and EJ onboarding"
   git push origin master
   ```

## Step 2: Go to Vercel Dashboard

1. Open your web browser
2. Go to: https://vercel.com
3. Sign in with your GitHub account (or create an account if needed)

## Step 3: Import Your Project

1. Click the **"Add New..."** button (or **"Import Project"**)
2. Select **"Import Git Repository"**
3. Find your repository: `eyinjusalako1/Gathered-App`
4. Click **"Import"**

## Step 4: Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:

### Framework Preset
- Should be: **Next.js** (auto-detected)

### Root Directory
- Leave as: **`./`** (root)

### Build Command
- Should be: **`npm run build`** (auto-detected)

### Output Directory
- Should be: **`.next`** (auto-detected)

### Install Command
- Should be: **`npm install`** (auto-detected)

## Step 5: Add Environment Variables

Click **"Environment Variables"** and add:

### Required Variables:
1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - Value: Your Supabase project URL
   - Environment: Production, Preview, Development

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - Value: Your Supabase anon/public key
   - Environment: Production, Preview, Development

3. **`OPENAI_API_KEY`** (for agents)
   - Value: Your OpenAI API key
   - Environment: Production, Preview, Development
   - Get it from: https://platform.openai.com/api-keys

### How to get Supabase values:
1. Go to your Supabase dashboard
2. Click on your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-5 minutes)
3. You'll see build logs in real-time

## Step 7: Verify Deployment

Once deployment is complete:

1. You'll see a **"Visit"** button with your deployment URL
2. Click it to open your deployed app
3. The URL will be something like: `https://gathered-app-xyz.vercel.app`

## Step 8: Test Your Agent System

### Test EJ Onboarding:
1. Go to: `https://your-app.vercel.app/onboarding/ej-onboarding`
2. Fill out the 3-step form
3. Click "Finish with EJ"
4. It should call the agent API (will return `{}` until you implement `callLLM`)

### Test Agent API Directly:
1. Open browser console or use Postman/curl
2. Test endpoint:
   ```javascript
   fetch('https://your-app.vercel.app/api/agents/EJ', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ answers: { interests: 'gym, church' } })
   })
   .then(r => r.json())
   .then(console.log)
   ```

## Step 9: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain if you have one

## Troubleshooting

### If build fails:
1. Check the build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - ESLint errors (we've fixed most of these)

### If agents don't work:
1. Verify `OPENAI_API_KEY` is set in environment variables
2. Check Vercel function logs for errors
3. Make sure the API route is accessible

## Next Steps After Deployment

1. **Implement `callLLM` function** in `/src/app/api/agents/[name]/route.ts`
2. **Test each agent** (EJ, Simi, PROPHECY, Joe)
3. **Wire up EJ onboarding** to save profiles to database
4. **Add more agent integrations** as needed

---

**Your app will automatically redeploy** whenever you push to the `master` branch on GitHub!

