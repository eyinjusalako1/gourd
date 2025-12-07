/**
 * Agent Configuration
 * Defines all available agents and their settings
 */

import type { AgentConfig, AgentName } from '@/types/agents'

export const ONBOARDING_ASSISTANT_CONFIG: AgentConfig = {
  name: "OnboardingAssistant",
  role: "user-facing",
  description: "Onboarding & profile coach for new users.",
  systemPrompt: `
You are a warm, friendly onboarding assistant for the Gathered app.

Your job:
- Help new users describe themselves in a natural way.
- Ask 3–7 light questions about their interests, social energy, ideal hangouts, and availability.
- Then generate:
  - A short profile bio (max 180 characters).
  - A longer bio (max 400 characters).
  - A list of 5–10 interest tags.
  - Social style: introvert, ambivert, or extrovert.
  - Preferred group size (1-1, 3–5, 6–10, 10+).
  - Availability summary.

Output JSON only in this shape:
{
  "short_bio": "...",
  "long_bio": "...",
  "tags": ["...", "..."],
  "social_style": "...",
  "preferred_group_size": "...",
  "availability_summary": "..."
}
`.trim(),
  model: 'gpt-4o-mini', // Updated from gpt-4 to valid model name
  temperature: 0.7,
  maxTokens: 2000,
  enabled: true,
}

export const DISCOVERY_ASSISTANT_CONFIG: AgentConfig = {
  name: "DiscoveryAssistant",
  role: "user-facing",
  description: "Ask-me-anything discovery assistant.",
  systemPrompt: `
You are a discovery assistant inside the Gathered app.

Your job:
- Turn natural language search queries into structured filters.

Output JSON in this shape:
{
  "intent": "...",
  "interests": ["...", "..."],
  "location_hint": "...",
  "time_preferences": "...",
  "other_constraints": ["...", "..."]
}
`.trim(),
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1500,
  enabled: true,
}

export const CONTENT_ENGINE_CONFIG: AgentConfig = {
  name: "ContentEngine",
  role: "internal",
  description: "Content & marketing AI agent.",
  systemPrompt: `
You are the content and marketing brain for the Gathered app.

Your job:
- Generate scripts, captions, emails, or push notifications.

Return JSON based on the content_type provided.
`.trim(),
  model: 'gpt-4o-mini',
  temperature: 0.8,
  maxTokens: 2000,
  enabled: true,
}

export const DEVOPS_ASSISTANT_CONFIG: AgentConfig = {
  name: "DevOpsAssistant",
  role: "internal",
  description: "AI Dev Agent for bug fixing & PR suggestions.",
  systemPrompt: `
You are an AI development assistant for the Gathered app.

Output JSON:
{
  "diagnosis": "...",
  "proposed_fix_explanation": "...",
  "patch_suggestion": "/* code patch */",
  "pr_title": "...",
  "pr_description": "..."
}
`.trim(),
  model: 'gpt-4o-mini',
  temperature: 0.3,
  maxTokens: 3000,
  enabled: true,
}

// Placeholder configs for other agents (can be configured later)
export const ACTIVITY_PLANNER_CONFIG: AgentConfig = {
  name: "ActivityPlanner",
  role: "user-facing",
  description: "Activity planning assistant for users",
  systemPrompt: `You are a helpful activity planning assistant for Gathered, a Christian social platform.
Your role is to help users plan activities, suggest events, and organize gatherings.
Maintain a warm, supportive, and Christ-centered tone.`,
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1500,
  enabled: false, // Disabled until configured
}

export const INSIGHTS_ENGINE_CONFIG: AgentConfig = {
  name: "InsightsEngine",
  role: "internal",
  description: "Internal agent for analytics and insights",
  systemPrompt: `You are an internal insights and analytics agent for Gathered, a Christian social platform.
Your role is to analyze data, generate insights, and provide recommendations.
Be efficient, accurate, and maintain system integrity.`,
  model: 'gpt-4o-mini',
  temperature: 0.5,
  maxTokens: 2000,
  enabled: false, // Disabled until configured
}

export const QA_ENGINE_CONFIG: AgentConfig = {
  name: "QAEngine",
  role: "user-facing",
  description: "Quality assurance and testing assistant",
  systemPrompt: `You are a quality assurance assistant for Gathered, a Christian social platform.
Your role is to help with testing, quality checks, and ensuring the app works correctly.
Maintain a warm, supportive, and Christ-centered tone.`,
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1500,
  enabled: false, // Disabled until configured
}

export const agents: Record<AgentName, AgentConfig> = {
  OnboardingAssistant: ONBOARDING_ASSISTANT_CONFIG,
  DiscoveryAssistant: DISCOVERY_ASSISTANT_CONFIG,
  ContentEngine: CONTENT_ENGINE_CONFIG,
  DevOpsAssistant: DEVOPS_ASSISTANT_CONFIG,
  ActivityPlanner: ACTIVITY_PLANNER_CONFIG,
  InsightsEngine: INSIGHTS_ENGINE_CONFIG,
  QAEngine: QA_ENGINE_CONFIG,
}

// Export individual configs for convenience
export const AGENTS: Record<string, AgentConfig> = {
  OnboardingAssistant: ONBOARDING_ASSISTANT_CONFIG,
  DiscoveryAssistant: DISCOVERY_ASSISTANT_CONFIG,
  ContentEngine: CONTENT_ENGINE_CONFIG,
  DevOpsAssistant: DEVOPS_ASSISTANT_CONFIG,
}

/**
 * Get agent configuration by name
 */
export function getAgentConfig(name: string): AgentConfig | null {
  return agents[name as AgentName] || null
}

/**
 * Get all enabled agents
 */
export function getEnabledAgents(): AgentConfig[] {
  return Object.values(agents).filter(agent => agent.enabled !== false)
}

/**
 * Get all user-facing agents
 */
export function getUserFacingAgents(): AgentConfig[] {
  return Object.values(agents).filter(
    agent => agent.role === 'user-facing' && agent.enabled !== false
  )
}

/**
 * Get all internal agents
 */
export function getInternalAgents(): AgentConfig[] {
  return Object.values(agents).filter(
    agent => agent.role === 'internal' && agent.enabled !== false
  )
}

/**
 * Check if an agent exists and is enabled
 */
export function isAgentAvailable(name: string): boolean {
  const agent = agents[name as AgentName]
  return agent !== undefined && agent.enabled !== false
}

