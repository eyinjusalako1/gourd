# Testing Guide - Onboarding Assistant & Agent API

## 🚀 Quick Start

Once your Vercel deployment is live, use this guide to test everything.

---

## 📍 Step 1: Get Your Deployment URL

After Vercel finishes deploying, you'll get a URL like:
- `https://gathered-app-xyz.vercel.app`
- Or your custom domain if configured

**Copy this URL** - you'll need it for testing!

---

## 🧪 Step 2: Test Onboarding Assistant Page

### Option A: Browser Testing (Easiest)

1. **Open your deployment URL** in a browser
2. **Navigate to:** `/onboarding/ej-onboarding`
   - Full URL: `https://your-app.vercel.app/onboarding/ej-onboarding`

3. **Fill out the 3-step form:**

   **Step 1 - Interests:**
   - Enter something like: "gym, church, anime, brunch, football"

   **Step 2 - Social Vibe:**
   - Weekend style: "gym in the morning, church on Sunday, Netflix in the evening"
   - Social energy: Select "Ambivert" (or any option)

   **Step 3 - Timing & Group Size:**
   - Availability: "weekday evenings after 6pm, Saturdays"
   - Group size: Select "Small group (3–5)"

4. **Click "Finish & Generate Profile"**
   - You should see "Generating your profile..." while it processes
   - Returns mock data if `GATHERED_MOCK_AGENTS=true`, or real AI-generated profile
   - Once complete, you'll see the generated profile

### Option B: Test with Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this to test the API directly:

```javascript
fetch('https://your-app.vercel.app/api/agents/OnboardingAssistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    answers: {
      interests: 'gym, church, anime',
      weekend_style: 'gym in the morning, church on Sunday',
      social_energy: 'ambivert',
      availability: 'weekday evenings after 6pm',
      preferred_group_size: '3-5'
    }
  })
})
.then(r => r.json())
.then(data => {
  console.log('OnboardingAssistant Response:', data);
  // Should return: { agent: "OnboardingAssistant", data: {...} }
})
.catch(err => console.error('Error:', err));
```

---

## 🔌 Step 3: Test Agent API Directly

### Test OnboardingAssistant Agent

```javascript
// In browser console or Postman
fetch('https://your-app.vercel.app/api/agents/OnboardingAssistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    answers: {
      interests: 'gym, church',
      weekend_style: 'church on Sunday',
      social_energy: 'extrovert',
      availability: 'weekends',
      preferred_group_size: '6-10'
    }
  })
})
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "agent": "OnboardingAssistant",
  "data": {
    "short_bio": "...",
    "long_bio": "...",
    "tags": [...],
    "social_style": "...",
    "preferred_group_size": "...",
    "availability_summary": "..."
  }
}
```

### Test DiscoveryAssistant Agent

```javascript
fetch('https://your-app.vercel.app/api/agents/DiscoveryAssistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Find me a Bible study group near downtown"
  })
})
.then(r => r.json())
.then(console.log);
```

### Test ContentEngine Agent

```javascript
fetch('https://your-app.vercel.app/api/agents/ContentEngine', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content_type: "email",
    topic: "Welcome new users"
  })
})
.then(r => r.json())
.then(console.log);
```

### Test DevOpsAssistant Agent

```javascript
fetch('https://your-app.vercel.app/api/agents/DevOpsAssistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    error_log: "TypeError: Cannot read property 'map' of undefined",
    code_context: "src/app/dashboard/page.tsx",
    file_path: "src/app/dashboard/page.tsx"
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 🐛 Step 4: Check for Errors

### View Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **"Functions"** tab
4. Click on any function to see logs
5. Look for:
   - API route calls: `/api/agents/[name]`
   - Any error messages
   - Response times

### Common Issues & Fixes

**Issue: "Unknown agent" error**
- ✅ Check agent name matches exactly: `OnboardingAssistant`, `DiscoveryAssistant`, `ContentEngine`, `DevOpsAssistant`, etc.
- ✅ Verify agent is enabled in `/src/agents/config.ts`

**Issue: "OpenAI API key is not configured"**
- ✅ Check `OPENAI_API_KEY` is set in Vercel environment variables
- ✅ Verify it's enabled for Production/Preview/Development

**Issue: Returns mock data**
- ✅ If `GATHERED_MOCK_AGENTS=true`, returns mock responses (expected in dev mode)
- ✅ If API fails, automatically falls back to mock data
- ✅ Check OpenAI API key and quota if you expect real AI responses

**Issue: CORS errors**
- ✅ Shouldn't happen with Next.js API routes
- ✅ If testing from external site, may need CORS headers

---

## 📊 Step 5: Verify Everything Works

### Checklist:

- [ ] Onboarding page loads at `/onboarding/ej-onboarding`
- [ ] Form validation works (can't proceed without filling fields)
- [ ] "Finish & Generate Profile" button calls the API
- [ ] API returns response (mock or real AI-generated profile)
- [ ] No console errors in browser
- [ ] No errors in Vercel function logs
- [ ] All 7 agents are accessible via API

---

## 🎯 Next Steps After Testing

1. **Implement `callLLM` function** in `/src/app/api/agents/[name]/route.ts`
   - Replace placeholder with real OpenAI API call
   - Test with real responses

2. **Wire up onboarding to save profiles**
   - Update `handleFinalAction` in onboarding page (already implemented)
   - Save to Supabase `user_profiles` table (already implemented)

3. **Add more agent integrations**
   - Connect DiscoveryAssistant to search functionality
   - Use ContentEngine for content generation
   - Use DevOpsAssistant for development assistance
   - Use ActivityPlanner for event planning
   - Use QAEngine for test scenario generation
   - Use InsightsEngine for feedback analysis

---

## 🛠️ Testing Tools

### Browser DevTools
- **Console**: Test API calls with `fetch()`
- **Network**: See API requests/responses
- **Application**: Check localStorage, cookies

### Postman/Insomnia
- Test API routes directly
- Set headers and body
- See full response

### Vercel Dashboard
- **Deployments**: See build status
- **Functions**: View API logs
- **Analytics**: Monitor usage

---

**Happy Testing! 🚀**

