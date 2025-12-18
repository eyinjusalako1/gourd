# Mock Mode Guide - Testing Agents Without OpenAI API

Mock mode allows you to test the agent system without making real OpenAI API calls, saving costs and allowing offline development.

---

## 🎯 What is Mock Mode?

When `GATHERED_MOCK_AGENTS=true`, the agent API returns pre-defined mock responses instead of calling OpenAI. This is useful for:
- **Development**: Test without API costs
- **Offline work**: No internet required
- **Fast iteration**: Instant responses
- **Testing UI**: See how the app handles agent responses

---

## 📋 Step-by-Step Setup

### Option 1: Local Development (`.env.local`)

#### Step 1: Create/Edit `.env.local`
1. Navigate to your project root: `C:\Users\user\gathered`
2. Open or create `.env.local` file
3. Add this line:
   ```
   GATHERED_MOCK_AGENTS=true
   ```

#### Step 2: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

#### Step 3: Test It
1. Open your browser to `http://localhost:3000`
2. Navigate to `/onboarding/ej-onboarding`
3. Fill out the form and click "Finish & Generate Profile"
4. You should see mock data instantly (no API call)

---

### Option 2: Vercel Production/Preview

#### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in and select your **Gathered** project

#### Step 2: Navigate to Environment Variables
1. Click on **Settings** (top navigation)
2. Click on **Environment Variables** (left sidebar)

#### Step 3: Add Mock Mode Variable
1. Click **Add New** button
2. Enter:
   - **Key**: `GATHERED_MOCK_AGENTS`
   - **Value**: `true`
3. Select environments:
   - ✅ **Production** (if you want it in production)
   - ✅ **Preview** (recommended for testing)
   - ✅ **Development** (optional)
4. Click **Save**

#### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2-5 minutes)

#### Step 5: Test It
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Navigate to `/onboarding/ej-onboarding`
3. Fill out the form and submit
4. You should see mock data

---

## 🧪 Testing Mock Mode

### Test OnboardingAssistant

1. **Navigate to onboarding page:**
   ```
   https://your-app.vercel.app/onboarding/ej-onboarding
   ```

2. **Fill out the form:**
   - **Step 1**: Enter interests (e.g., "gym, anime, church")
   - **Step 2**: Enter weekend style and select social energy
   - **Step 3**: Enter availability and select group size

3. **Click "Finish & Generate Profile"**

4. **Expected Result:**
   ```json
   {
     "short_bio": "Weekend gym, anime, church & chill hangs.",
     "long_bio": "I'm into gym, anime, church and chilled social vibes...",
     "tags": ["gym", "anime", "church", "brunch", "chilled vibes"],
     "social_style": "ambivert",  // or whatever you selected
     "preferred_group_size": "3-5",  // or whatever you selected
     "availability_summary": "Weekends and some weekday evenings."
   }
   ```

### Test via Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Run this command:

```javascript
fetch('/api/agents/OnboardingAssistant', {
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
  console.log('Mock Response:', data);
  // Should show: { agent: "OnboardingAssistant", data: {...} }
})
.catch(err => console.error('Error:', err));
```

### Test Other Agents

#### DiscoveryAssistant
```javascript
fetch('/api/agents/DiscoveryAssistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Find me a Bible study group near downtown"
  })
})
.then(r => r.json())
.then(console.log);
```

#### ContentEngine
```javascript
fetch('/api/agents/ContentEngine', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content_type: "tiktok_script",
    topic: "Welcome new users"
  })
})
.then(r => r.json())
.then(console.log);
```

#### DevOpsAssistant
```javascript
fetch('/api/agents/DevOpsAssistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    error_log: "TypeError: Cannot read property 'map' of undefined",
    code_context: "src/app/dashboard/page.tsx"
  })
})
.then(r => r.json())
.then(console.log);
```

---

## ✅ How to Verify Mock Mode is Active

### Method 1: Check Response
Mock responses include consistent data that matches the mock function. For example:
- OnboardingAssistant always returns the same structure
- Tags are always: `["gym", "anime", "church", "brunch", "chilled vibes"]`
- No variation (unlike real AI responses)

### Method 2: Check Network Tab
1. Open DevTools → **Network** tab
2. Submit the onboarding form
3. Click on the `/api/agents/OnboardingAssistant` request
4. Check the **Response** - should be instant (no API delay)
5. Response should match mock data exactly

### Method 3: Check Vercel Logs
1. Go to Vercel Dashboard → **Functions** tab
2. Click on `/api/agents/[name]` function
3. Look for logs - should NOT show OpenAI API calls
4. Should show: `[MOCK MODE] Returning mock data for agent: OnboardingAssistant`

---

## 🔄 Disabling Mock Mode

### Local Development
1. Open `.env.local`
2. Change:
   ```
   GATHERED_MOCK_AGENTS=false
   ```
   Or delete the line entirely
3. Restart dev server: `npm run dev`

### Vercel
1. Go to Vercel Dashboard → **Settings** → **Environment Variables**
2. Find `GATHERED_MOCK_AGENTS`
3. Click **⋯** → **Delete**
4. Or change value to `false`
5. **Redeploy** your app

---

## 🎨 Customizing Mock Responses

To change what mock data is returned, edit:
```
src/app/api/agents/[name]/route.ts
```

Find the `getMockResponse()` function and modify the return values:

```typescript
case "OnboardingAssistant":
  return {
    short_bio: "Your custom short bio here",
    long_bio: "Your custom long bio here",
    tags: ["custom", "tags", "here"],
    // ... etc
  };
```

---

## 🚨 Important Notes

1. **Mock mode takes precedence**: If `GATHERED_MOCK_AGENTS=true`, it ALWAYS returns mocks, even if OpenAI API key is set
2. **Fallback behavior**: If OpenAI API fails (quota, network error), it automatically falls back to mocks (even if mock mode is off)
3. **No API costs**: Mock mode = $0 API costs
4. **Consistent responses**: Mock data is always the same (good for testing, but not realistic)

---

## 📊 Mock Mode vs Real API

| Feature | Mock Mode | Real API |
|---------|-----------|----------|
| **Speed** | Instant | 1-3 seconds |
| **Cost** | $0 | ~$0.01-0.10 per call |
| **Variety** | Same every time | Different each time |
| **Offline** | ✅ Works | ❌ Needs internet |
| **Testing** | ✅ Perfect | ⚠️ Costs money |

---

## 🎯 Best Practices

1. **Development**: Always use mock mode
2. **Testing UI**: Use mock mode to test different scenarios
3. **Production**: Disable mock mode (unless you want consistent responses)
4. **Preview Deployments**: Use mock mode to test without costs

---

## 🐛 Troubleshooting

### Mock mode not working?
- ✅ Check environment variable is set correctly
- ✅ Restart dev server (local) or redeploy (Vercel)
- ✅ Check variable name: `GATHERED_MOCK_AGENTS` (case-sensitive)
- ✅ Check value: Must be exactly `"true"` (string)

### Still getting real API calls?
- ✅ Check `.env.local` is in project root
- ✅ Check Vercel environment variables are saved
- ✅ Check you redeployed after adding the variable

### Getting errors?
- ✅ Check browser console for error messages
- ✅ Check Vercel function logs
- ✅ Verify the agent name is correct (e.g., `OnboardingAssistant` not `EJ`)

---

**Happy Testing! 🚀**



