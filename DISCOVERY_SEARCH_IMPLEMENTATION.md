# Discovery → Real Search Implementation (Section 3)

## Summary
Successfully implemented real event search for the `/discovery` route. The Discovery Assistant now returns structured filters that are used to query Supabase for matching events, which are displayed as interactive cards.

---

## Files Created

### 1. `/api/discover/search` Endpoint
**File:** `src/app/api/discover/search/route.ts`

**Purpose:** Backend search endpoint that accepts DiscoveryAssistant filters and returns matching events from Supabase.

**Request Body:**
```typescript
interface DiscoverySearchRequest {
  intent: "find_events" | "find_people" | "find_groups" | "mixed";
  interests?: string[];
  location_hint?: string;
  time_preferences?: string;
  other_constraints?: string[];
}
```

**Response:**
```typescript
interface DiscoverySearchResponse {
  events: DiscoveryEventResult[];
}

interface DiscoveryEventResult {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location?: string;
  tags: string[];
  event_type: string;
  is_virtual: boolean;
  virtual_link?: string;
  created_by: string;
  rsvp_count: number;
  max_attendees?: number;
}
```

**Search Logic:**
1. **Base Query:** Only future, active events (`start_time >= now()`, `is_active = true`)
2. **Interest Matching:**
   - Checks if any interest keyword matches event `tags` array (case-insensitive)
   - Checks if any interest keyword appears in `title` or `description` (case-insensitive)
   - Events match if they satisfy either condition
3. **Location Matching:**
   - If `location_hint` provided, filters events where `location` contains the hint (case-insensitive)
4. **Time Preferences & Other Constraints:**
   - Ignored for v1 (can be enhanced later)
5. **Results:** Limited to 50 events, ordered by `start_time` ascending

**Error Handling:**
- Returns appropriate HTTP status codes (400, 500)
- Graceful error messages
- Returns empty array if no matches found

---

## Files Modified

### 1. Discovery Page Component
**File:** `src/app/(app)/discovery/page.tsx`

**Changes:**
1. **Added Types:**
   - `DiscoveryEventResult` interface for event results
   - Imported icons: `Calendar`, `Clock`, `MapPin`, `Monitor`, `Users`, `Tag`

2. **Added State:**
   - `isSearching`: Loading state for search operation
   - `events`: Array of matching events
   - `searchError`: Error state for search failures

3. **Enhanced `handleSubmit`:**
   - After DiscoveryAssistant returns filters, automatically calls `/api/discover/search`
   - Passes all filter data to search endpoint
   - Handles search errors separately from assistant errors

4. **Added `formatEventDate` Helper:**
   - Formats event dates/times for display

5. **New UI Sections:**
   - **Loading State:** Shows spinner while searching
   - **Search Error:** Displays search-specific errors
   - **Results Section:**
     - Shows interpreted filters (condensed view)
     - Displays matching events count
     - **Event Cards:**
       - Title, description (truncated)
       - Date/time with icons
       - Location (if available)
       - RSVP count
       - Tags (up to 3, with "+X more" indicator)
       - Virtual/In-Person indicator
       - "View Event Details" button
       - Clickable card (navigates to `/events/[id]`)
   - **Empty State:**
     - Friendly message when no events found
     - "Host your first hangout" button → `/events/create`

---

## Final JSON Response Shape

### `/api/discover/search` Response
```json
{
  "events": [
    {
      "id": "uuid",
      "title": "Event Title",
      "description": "Event description...",
      "start_time": "2024-12-25T18:00:00Z",
      "end_time": "2024-12-25T20:00:00Z",
      "location": "123 Main St, London",
      "tags": ["anime", "gym", "church"],
      "event_type": "fellowship",
      "is_virtual": false,
      "virtual_link": null,
      "created_by": "user-uuid",
      "rsvp_count": 5,
      "max_attendees": 20
    }
  ]
}
```

---

## Schema Assumptions & TODOs

### Assumptions Made:
1. **Events Table Schema:**
   - `id` (UUID, primary key)
   - `title` (text)
   - `description` (text)
   - `start_time` (timestamp)
   - `end_time` (timestamp)
   - `location` (text, nullable)
   - `tags` (text[] or JSON array)
   - `event_type` (text)
   - `is_virtual` (boolean)
   - `virtual_link` (text, nullable)
   - `created_by` (UUID)
   - `rsvp_count` (integer)
   - `max_attendees` (integer, nullable)
   - `is_active` (boolean)

2. **Search Behavior:**
   - Interest matching is case-insensitive
   - Partial matches work (e.g., "anime" matches "anime club")
   - Tags array overlap uses substring matching (not exact array intersection)
   - Location matching is substring-based (not geospatial)

### Future Enhancements (Not Implemented):
1. **People Search:**
   - Currently returns empty array with message "People and groups search coming soon"
   - Would need to query `user_profiles` table with similar filters

2. **Groups Search:**
   - Similar to people search, query `fellowships` or `groups` table

3. **Time Preferences:**
   - Could parse `time_preferences` string (e.g., "Sunday afternoons")
   - Filter events by day of week or time of day

4. **Geospatial Location:**
   - Use `latitude`/`longitude` fields if available
   - Calculate distance from `location_hint` coordinates

5. **Advanced Tag Matching:**
   - Use PostgreSQL array operators for exact tag matching
   - Support tag synonyms or related tags

6. **Pagination:**
   - Currently limited to 50 results
   - Add pagination for larger result sets

7. **Relevance Scoring:**
   - Rank results by relevance (tag matches > text matches)
   - Consider RSVP count, recency, etc.

---

## Testing Checklist

- [x] Discovery Assistant returns filters correctly
- [x] Search endpoint accepts filters and queries Supabase
- [x] Events are filtered by interests (tags and text)
- [x] Events are filtered by location hint
- [x] Only future events are returned
- [x] Only active events are returned
- [x] Event cards display all required information
- [x] Event cards are clickable and navigate to `/events/[id]`
- [x] Empty state shows when no events match
- [x] Error states are handled gracefully
- [x] Loading states are shown during search
- [x] `/discover` route remains unchanged (different feature)

---

## Preserved Behavior

✅ **`/discover` route unchanged** - This route is for user search and remains completely separate from `/discovery` (Discovery Assistant).

---

## Type Safety

- ✅ All TypeScript interfaces defined
- ✅ Request/response types match between frontend and backend
- ✅ Event result type matches Event interface from `@/types`
- ✅ No `any` types used (except error handling)

---

## Code Quality

- ✅ Consistent with existing codebase style
- ✅ Error handling implemented
- ✅ Loading states provided
- ✅ Empty states handled
- ✅ Comments added for complex logic
- ✅ Follows existing patterns (e.g., uses `supabaseServer`)

---

**Status:** ✅ **Section 3 Complete - Discovery now returns real event results from Supabase**

