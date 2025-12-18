/**
 * TypeScript interfaces for GroupPlanner agent
 */

/**
 * Request payload for GroupPlanner API
 */
export interface GroupPlannerRequest {
  goal: string // required: what the group is about and why it exists
  location_hint?: string // optional
  audience?: string // optional (e.g., young adults, new believers, couples, men, women)
  meeting_frequency?: string // optional (e.g., weekly, biweekly)
  tone?: 'chill' | 'structured' | 'deep' | 'social' // optional
}

/**
 * Response from GroupPlanner agent
 */
export interface GroupPlannerResponse {
  suggested_name: string
  suggested_short_description: string // <= 120 chars
  suggested_full_description: string // 2-4 sentences
  suggested_meeting_schedule: string // e.g., "Every Saturday 7pm"
  suggested_tags: string[] // 3-6, unique, lowercase, no duplicates
  suggested_privacy: 'public' | 'private'
  suggested_group_rules: string[] // 3-6 bullet rules
  suggested_welcome_message: string // 1-2 sentences
}

/**
 * API response wrapper for GroupPlanner
 */
export interface GroupPlannerAPIResponse {
  agent: 'GroupPlanner'
  data: GroupPlannerResponse
  _mock?: boolean // Flag indicating if this is mock data
  warning?: string // Warning message if fallback was used
}

