# Testing Guide - EJ Onboarding & Agent API

## 🚀 Quick Start

Once your Vercel deployment is live, use this guide to test everything.

---

## 📍 Step 1: Get Your Deployment URL

After Vercel finishes deploying, you'll get a URL like:
- `https://gathered-app-xyz.vercel.app`
- Or your custom domain if configured

**Copy this URL** - you'll need it for testing!

---

## 🧪 Step 2: Test EJ Onboarding Page

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

4. **Click "Finish with EJ"**
   - You should see "Talking to EJ..." while it processes
   - Currently returns `{}` until `callLLM` is implemented
   - Once implemented, you'll see the generated profile

### Option B: Test with Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this to test the API directly:

```javascript
fetch('https://your-app.vercel.app/api/agents/EJ', {
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
  console.log('EJ Response:', data);
  // Should return: { agent: "EJ", data: {...} }
})
.catch(err => console.error('Error:', err));
```

---

## 🔌 Step 3: Test Agent API Directly

### Test EJ Agent

```javascript
// In browser console or Postman
fetch('https://your-app.vercel.app/api/agents/EJ', {
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
  "agent": "EJ",
  "data": {}  // Will be populated once callLLM is implemented
}
```

### Test Simi Agent

```javascript
fetch('https://your-app.vercel.app/api/agents/Simi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Find me a Bible study group near downtown"
  })
})
.then(r => r.json())
.then(console.log);
```

### Test PROPHECY Agent

```javascript
fetch('https://your-app.vercel.app/api/agents/PROPHECY', {
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

### Test Joe Agent

```javascript
fetch('https://your-app.vercel.app/api/agents/Joe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    error_message: "TypeError: Cannot read property 'map' of undefined",
    file: "src/app/dashboard/page.tsx",
    line: 42
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
- ✅ Check agent name matches exactly: `EJ`, `Simi`, `PROPHECY`, `Joe`
- ✅ Verify agent is enabled in `/src/agents/config.ts`

**Issue: "OpenAI API key is not configured"**
- ✅ Check `OPENAI_API_KEY` is set in Vercel environment variables
- ✅ Verify it's enabled for Production/Preview/Development

**Issue: Returns empty `{}`**
- ✅ This is expected until `callLLM` function is implemented
- ✅ The placeholder returns `"{}"` which gets parsed as empty object

**Issue: CORS errors**
- ✅ Shouldn't happen with Next.js API routes
- ✅ If testing from external site, may need CORS headers

---

## 📊 Step 5: Verify Everything Works

### Checklist:

- [ ] EJ onboarding page loads at `/onboarding/ej-onboarding`
- [ ] Form validation works (can't proceed without filling fields)
- [ ] "Finish with EJ" button calls the API
- [ ] API returns response (even if empty `{}` for now)
- [ ] No console errors in browser
- [ ] No errors in Vercel function logs
- [ ] All 4 agents are accessible via API

---

## 🎯 Next Steps After Testing

1. **Implement `callLLM` function** in `/src/app/api/agents/[name]/route.ts`
   - Replace placeholder with real OpenAI API call
   - Test with real responses

2. **Wire up EJ onboarding to save profiles**
   - Update `handleFinalAction` in onboarding page
   - Save to Supabase `user_profiles` table

3. **Add more agent integrations**
   - Connect Simi to search functionality
   - Use PROPHECY for content generation
   - Use Joe for development assistance

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

