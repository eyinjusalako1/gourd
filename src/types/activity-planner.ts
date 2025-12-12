/**
 * TypeScript interfaces for ActivityPlanner agent
 */

/**
 * Request payload for ActivityPlanner API
 */
export interface ActivityPlannerRequest {
  description: string; // Free text describing the hangout idea
  budget?: string; // Optional: "low", "medium", "high", "free"
  location_hint?: string; // Optional: area or location preference
  time_hint?: string; // Optional: preferred time window
  comfort_level?: string; // Optional: "small group", "medium group", "big vibes"
}

/**
 * Response from ActivityPlanner agent
 */
export interface ActivityPlannerResponse {
  suggested_title: string;
  suggested_description: string;
  suggested_group_size: number;
  suggested_tags: string[];
  suggested_location_hint: string;
  suggested_time_hint: string;
}

/**
 * API response wrapper for ActivityPlanner
 */
export interface ActivityPlannerAPIResponse {
  agent: "ActivityPlanner";
  data: ActivityPlannerResponse;
  _mock?: boolean; // Flag indicating if this is mock data
  warning?: string; // Warning message if fallback was used
}

