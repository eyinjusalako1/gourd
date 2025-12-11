# Testing Guide: Discovery → Real Search

## Quick Test Flow

### 1. Access Discovery Page
- Navigate to `/discovery` (or click "Find your people" from dashboard)
- ✅ Page loads with search form

### 2. Test Discovery Assistant
**Test Query Examples:**
```
"I want anime friends in Stratford who are free on Sundays"
"Looking for gym buddies in London"
"Bible study groups near me"
"Events this weekend about prayer"
```

**Expected Behavior:**
- ✅ Click "Ask Discovery Assistant"
- ✅ Shows "Thinking..." while processing
- ✅ Returns "Interpreted filters" section showing:
  - Intent (e.g., "mixed", "find_events")
  - Interests (e.g., ["anime", "gym"])
  - Location hint (e.g., "Stratford, London")
  - Time preferences (e.g., "Sunday afternoons")

### 3. Verify Search Results
**After filters appear:**
- ✅ Shows "Searching for events..." spinner
- ✅ Then displays "Matching Events (X)" section

**If Events Found:**
- ✅ Event cards appear with:
  - Title
  - Description (truncated)
  - Date & time
  - Location (if available)
  - RSVP count
  - Tags (up to 3 shown)
  - Virtual/In-Person indicator
- ✅ Cards are clickable → navigate to `/events/[id]`
- ✅ "View Event Details" button works

**If No Events Found:**
- ✅ Shows empty state message
- ✅ "Host your first hangout" button → `/events/create`

### 4. Test Edge Cases

**Empty Query:**
- ✅ Submit button disabled when query is empty
- ✅ Cannot submit empty form

**No Matching Events:**
- ✅ Try query: "events about quantum physics in Antarctica"
- ✅ Should show empty state with helpful message

**Location Filter:**
- ✅ Try query: "events in Stratford"
- ✅ Only events with "Stratford" in location should appear

**Interest Matching:**
- ✅ Create test event with tags: ["anime", "gym"]
- ✅ Search: "anime events"
- ✅ Event should appear in results

**Future Events Only:**
- ✅ Only events with `start_time >= now()` should appear
- ✅ Past events should NOT appear

---

## Manual Test Checklist

### Basic Flow
- [ ] Navigate to `/discovery`
- [ ] Enter a search query
- [ ] Click "Ask Discovery Assistant"
- [ ] See filters appear
- [ ] See search results (or empty state)
- [ ] Click on an event card
- [ ] Navigate to event detail page

### Error Handling
- [ ] Test with network disconnected (should show error)
- [ ] Test with invalid query (should handle gracefully)
- [ ] Test with OpenAI API down (should fallback to mock)

### UI States
- [ ] Loading state shows during assistant call
- [ ] Loading state shows during search
- [ ] Error messages display correctly
- [ ] Empty state displays when no results

### Data Validation
- [ ] Events match interest keywords
- [ ] Events match location hint
- [ ] Only future events shown
- [ ] Only active events shown
- [ ] Tags display correctly
- [ ] Date/time format correctly

---

## Quick Debug Tips

### If Discovery Assistant Fails:
1. Check browser console for errors
2. Check `/api/agents/DiscoveryAssistant` response
3. Verify `OPENAI_API_KEY` is set (or `GATHERED_MOCK_AGENTS=true`)

### If Search Returns No Results:
1. Check browser console for errors
2. Verify events exist in Supabase with:
   - `is_active = true`
   - `start_time >= now()`
   - Matching tags or location
3. Check Network tab → `/api/discover/search` request/response

### If Events Don't Match:
1. Verify event `tags` array format (should be text[])
2. Check interest matching logic (case-insensitive)
3. Verify location substring matching

### Common Issues:
- **"Failed to search events"** → Check Supabase connection
- **"Discovery Assistant request failed"** → Check OpenAI API key
- **No events showing** → Verify events exist and are future/active
- **Tags not matching** → Check tags array format in database

---

## Test Data Setup

### Create Test Events (via Supabase or app):
```sql
-- Example test event
INSERT INTO events (
  title, 
  description, 
  start_time, 
  location, 
  tags, 
  is_active,
  event_type,
  created_by
) VALUES (
  'Anime Watch Party',
  'Weekly anime viewing and discussion',
  NOW() + INTERVAL '7 days',  -- Future date
  'Stratford, London',
  ARRAY['anime', 'social', 'entertainment'],
  true,
  'fellowship',
  'your-user-id'
);
```

### Test Queries to Try:
1. **"anime events"** → Should find events with "anime" tag
2. **"events in Stratford"** → Should find events in Stratford
3. **"gym buddies London"** → Should find events with "gym" tag in London
4. **"Bible study this weekend"** → Should find Bible study events

---

## Expected Console Output

### Successful Flow:
```
1. POST /api/agents/DiscoveryAssistant → 200 OK
   Response: { agent: "DiscoveryAssistant", data: { intent: "...", interests: [...] } }

2. POST /api/discover/search → 200 OK
   Response: { events: [...] }
```

### Error Cases:
```
1. POST /api/agents/DiscoveryAssistant → 500
   Response: { error: "..." }

2. POST /api/discover/search → 500
   Response: { error: "Failed to search events", details: "..." }
```

---

## Performance Checks

- ✅ Assistant response time: < 3 seconds
- ✅ Search response time: < 1 second
- ✅ Page doesn't freeze during loading
- ✅ Results render smoothly

---

## Browser Testing

Test in:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile viewport (responsive design)

---

**Quick Start:** Just navigate to `/discovery`, type "anime events in London", and click the button. You should see filters appear, then matching events (if any exist in your database).

