/**
 * Agent Types and Interfaces
 * Defines the structure for AI agents in the Gathered app
 */

export type AgentName =
  | "OnboardingAssistant"
  | "ActivityPlanner"
  | "DiscoveryAssistant"
  | "ContentEngine"
  | "QAEngine"
  | "InsightsEngine"
  | "DevOpsAssistant"
  | "GroupPlanner"

export interface AgentConfig {
  name: AgentName
  role: "user-facing" | "internal"
  description: string
  systemPrompt: string
  model?: string // OpenAI model to use (default: gpt-4)
  temperature?: number // 0-1, default: 0.7
  maxTokens?: number
  enabled?: boolean
}

export interface AgentRequest {
  agentName: string
  message: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
}

export interface AgentResponse {
  success: boolean
  message: string
  data?: any
  error?: string
  tokensUsed?: number
}

export interface AgentContext {
  userId?: string
  userRole?: 'disciple' | 'steward'
  currentPage?: string
  userPreferences?: Record<string, any>
  recentActivity?: any[]
}

export interface AgentCapabilities {
  canModerate: boolean
  canRecommend: boolean
  canAnalyze: boolean
  canAssist: boolean
  canDevelop: boolean
}

