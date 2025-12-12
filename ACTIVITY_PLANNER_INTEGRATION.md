# ActivityPlanner Integration - Section 5 Complete

## Summary
Successfully integrated the ActivityPlanner AI agent into `/events/create` page. Stewards can now describe their hangout idea and get AI-generated suggestions that auto-fill the event form.

---

## Files Created

### 1. TypeScript Interfaces
**File:** `src/types/activity-planner.ts`

**Purpose:** Type-safe interfaces for ActivityPlanner request and response.

**Interfaces:**
- `ActivityPlannerRequest` - Input payload for the API
- `ActivityPlannerResponse` - Output from the agent
- `ActivityPlannerAPIResponse` - Wrapper for API response

**Fields:**
- Request: `description` (required), `budget?`, `location_hint?`, `time_hint?`, `comfort_level?`
- Response: `suggested_title`, `suggested_description`, `suggested_group_size`, `suggested_tags[]`, `suggested_location_hint`, `suggested_time_hint`

---

## Files Modified

### 1. ActivityPlanner Agent Config
**File:** `src/agents/config.ts`

**Changes:**
- ✅ **Refined system prompt** to match required output schema
- ✅ Updated input fields to match UI requirements:
  - `description` (free text)
  - `budget?`, `location_hint?`, `time_hint?`, `comfort_level?` (optional)
- ✅ Updated output schema to return:
  - `suggested_title` (max 60 chars)
  - `suggested_description` (max 350 chars)
  - `suggested_group_size` (integer)
  - `suggested_tags` (array of strings)
  - `suggested_location_hint` (string)
  - `suggested_time_hint` (string)
- ✅ Maintained UK English tone and inclusive language

**Before:** Output included `suggested_venue_type`, `ideal_group_size` (string), `things_to_bring`, `icebreakers`  
**After:** Output matches form fields: `suggested_title`, `suggested_description`, `suggested_group_size` (integer), `suggested_tags[]`, `suggested_location_hint`, `suggested_time_hint`

### 2. API Route Mock Response
**File:** `src/app/api/agents/[name]/route.ts`

**Changes:**
- ✅ **Added ActivityPlanner mock response** for dev mode and fallback
- ✅ Mock returns realistic suggestions based on input description
- ✅ Handles cases where optional fields are missing

**Mock Behavior:**
- If description includes "anime" → suggests "Anime & Board Games Night"
- If description includes "coffee" → suggests "Coffee & Chat Hangout"
- Defaults to "Chill Hangout" if no keywords match
- Infers group size from `comfort_level` if provided
- Generates tags from description words

### 3. Event Creation Page
**File:** `src/app/(app)/events/create/page.tsx`

**Changes:**
- ✅ **Added "Plan with AI" section** at the top of the page
- ✅ Only visible to Stewards (consistent with existing role checks)
- ✅ Collapsible section with "Show/Hide" toggle
- ✅ Textarea for hangout description with helpful placeholder
- ✅ "Generate with Activity Planner" button
- ✅ Loading state ("Generating...") with spinner
- ✅ Error handling with user-friendly messages
- ✅ Success toast notification
- ✅ Auto-fills form fields with AI suggestions:
  - `title` ← `suggested_title`
  - `description` ← `suggested_description`
  - `max_attendees` ← `suggested_group_size` (converted to string)
  - `tags` ← `suggested_tags` (joined with commas)
  - `location` ← `suggested_location_hint`
- ✅ All fields remain editable after auto-fill
- ✅ AI section auto-collapses after successful generation

**UI Features:**
- Gradient background (emerald/teal) to distinguish AI section
- Sparkles icon for visual appeal
- Disabled state for button when loading or empty description
- Clear error messages
- Helpful hint text explaining what the AI does

---

## User Flow

### Steward Creating Event with AI Assistance

1. **Navigate to `/events/create`**
   - Steward-only page (already enforced)
   - Sees "Plan with AI" section at top

2. **Describe Hangout Idea**
   - Clicks "Show" to expand AI section (if collapsed)
   - Types description in textarea:
     - Example: "A chill anime and board games night near Stratford on a Friday evening, 4–6 people, low cost."
   - Can include optional details about budget, location, time, group size

3. **Generate Suggestions**
   - Clicks "Generate with Activity Planner" button
   - Button shows "Generating..." with spinner
   - Button is disabled during generation

4. **Review AI Suggestions**
   - On success:
     - Form fields auto-fill with suggestions:
       - Title: "Anime & Board Games Night"
       - Description: Generated friendly description
       - Max Attendees: 6 (or inferred from description)
       - Tags: "anime, board games, casual, weekend"
       - Location: "local coffee shop or casual venue"
     - Success toast appears: "Event suggestions generated! Review and edit the form fields as needed."
     - AI section auto-collapses
   - On error:
     - Error message shown in red box
     - Form fields remain unchanged
     - User can try again

5. **Edit and Submit**
   - User can edit any auto-filled field
   - Can add additional details (date/time, virtual link, etc.)
   - Submits form as normal
   - Event created via existing `/api/events/create` endpoint

### Steward Creating Event Without AI

1. **Navigate to `/events/create`**
2. **Optionally use AI** (can skip entirely)
3. **Fill form manually** (works exactly as before)
4. **Submit event**

**No breaking changes** - existing functionality preserved.

---

## Type Safety

### Interfaces:
- ✅ `ActivityPlannerRequest` - Fully typed request payload
- ✅ `ActivityPlannerResponse` - Fully typed response structure
- ✅ `ActivityPlannerAPIResponse` - Typed API wrapper with optional flags

### No `any` Types:
- ✅ All core structures properly typed
- ✅ Error handling uses `any` only in catch blocks (standard pattern)
- ✅ Form state properly typed with existing `Event` types

---

## Error Handling

### Client-Side:
- ✅ Empty description validation
- ✅ Network error handling
- ✅ Invalid response handling
- ✅ User-friendly error messages
- ✅ Form fields not overwritten on error

### Server-Side:
- ✅ Existing `/api/agents/[name]` route handles errors
- ✅ Falls back to mock if LLM fails
- ✅ Returns proper error responses

---

## Steward-Only Behavior

### UI Restrictions:
- ✅ AI section only visible if `isSteward === true`
- ✅ Consistent with existing Steward checks on page
- ✅ Non-Stewards already blocked from `/events/create` (redirect)

### Backend:
- ✅ No additional authorization needed (page-level restriction sufficient)
- ✅ API route accessible to all authenticated users (but only Stewards can reach the page)

---

## Testing Checklist

### Steward Users:
- [ ] Can see "Plan with AI" section on `/events/create`
- [ ] Can expand/collapse AI section
- [ ] Can type description in textarea
- [ ] Button disabled when description is empty
- [ ] Button shows "Generating..." during API call
- [ ] Form fields auto-fill with AI suggestions
- [ ] Success toast appears after generation
- [ ] AI section collapses after successful generation
- [ ] Can edit auto-filled fields
- [ ] Can submit event with AI-generated fields
- [ ] Can skip AI and fill form manually

### Error Cases:
- [ ] Empty description shows validation error
- [ ] Network error shows user-friendly message
- [ ] Invalid API response handled gracefully
- [ ] Form fields not overwritten on error
- [ ] Can retry after error

### Non-Stewards:
- [ ] Cannot access `/events/create` (redirected)
- [ ] AI section not visible (page not accessible)

---

## API Integration

### Endpoint:
- **Route:** `/api/agents/ActivityPlanner`
- **Method:** `POST`
- **Request Body:**
  ```typescript
  {
    description: string;
    budget?: string;
    location_hint?: string;
    time_hint?: string;
    comfort_level?: string;
  }
  ```

### Response:
```typescript
{
  agent: "ActivityPlanner";
  data: {
    suggested_title: string;
    suggested_description: string;
    suggested_group_size: number;
    suggested_tags: string[];
    suggested_location_hint: string;
    suggested_time_hint: string;
  };
  _mock?: boolean;
  warning?: string;
}
```

### Mock Mode:
- If `GATHERED_MOCK_AGENTS=true`, returns mock response
- If LLM call fails, falls back to mock
- Mock responses are realistic and match schema

---

## Form Field Mapping

| AI Suggestion | Form Field | Transformation |
|--------------|------------|----------------|
| `suggested_title` | `title` | Direct assignment |
| `suggested_description` | `description` | Direct assignment |
| `suggested_group_size` | `max_attendees` | Convert number to string |
| `suggested_tags` | `tags` | Join array with commas |
| `suggested_location_hint` | `location` | Direct assignment |
| `suggested_time_hint` | (not mapped) | Available in description or user can add manually |

**Note:** `suggested_time_hint` is not directly mapped to a form field, but the user can incorporate it into the description or add it manually when setting the event date/time.

---

## Recommended Improvements (Not Implemented)

1. **Time Hint Integration:**
   - Could parse `suggested_time_hint` and pre-fill `start_time` field
   - Would require date/time parsing logic

2. **Budget Field:**
   - Could add budget field to form
   - Map `suggested_budget` if added to agent output

3. **Multiple Suggestions:**
   - Could return 2-3 title/description options
   - Let user choose which one to use

4. **Refinement:**
   - Add "Refine suggestions" button to regenerate with tweaks
   - Allow user to provide feedback on suggestions

5. **History:**
   - Save AI-generated suggestions for reference
   - Show previous suggestions if user wants to reuse

---

## Summary of Changes

### Files Created:
1. `src/types/activity-planner.ts` - TypeScript interfaces

### Files Modified:
1. `src/agents/config.ts` - Refined ActivityPlanner prompt and output schema
2. `src/app/api/agents/[name]/route.ts` - Added ActivityPlanner mock response
3. `src/app/(app)/events/create/page.tsx` - Added AI assistance UI and form auto-fill logic

---

**Status:** ✅ **Complete - ActivityPlanner integrated into `/events/create` with full UI and form auto-fill functionality**

