/**
 * Agent Configuration
 * Defines all available agents and their settings
 */

import type { AgentConfig, AgentName } from '@/types/agents'

export const agents: Record<AgentName, AgentConfig> = {
  EJ: {
    name: "EJ",
    role: "user-facing",
    description: "User-facing agent EJ",
    systemPrompt: `You are EJ, a helpful assistant for Gathered, a Christian social platform.
Your role is to assist users with questions, provide guidance, and offer support.
Maintain a warm, supportive, and Christ-centered tone.`,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1500,
    enabled: true,
  },

  Joshua: {
    name: "Joshua",
    role: "user-facing",
    description: "User-facing agent Joshua",
    systemPrompt: `You are Joshua, a helpful assistant for Gathered, a Christian social platform.
Your role is to assist users with questions, provide guidance, and offer support.
Maintain a warm, supportive, and Christ-centered tone.`,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1500,
    enabled: true,
  },

  Simi: {
    name: "Simi",
    role: "user-facing",
    description: "User-facing agent Simi",
    systemPrompt: `You are Simi, a helpful assistant for Gathered, a Christian social platform.
Your role is to assist users with questions, provide guidance, and offer support.
Maintain a warm, supportive, and Christ-centered tone.`,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1500,
    enabled: true,
  },

  PROPHECY: {
    name: "PROPHECY",
    role: "internal",
    description: "Internal agent for prophecy-related tasks",
    systemPrompt: `You are PROPHECY, an internal agent for Gathered, a Christian social platform.
Your role is to handle prophecy-related tasks and operations.
Maintain a respectful and biblically sound approach.`,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    enabled: true,
  },

  KING: {
    name: "KING",
    role: "internal",
    description: "Internal agent for administrative tasks",
    systemPrompt: `You are KING, an internal administrative agent for Gathered, a Christian social platform.
Your role is to handle administrative tasks and system operations.
Be efficient, accurate, and maintain system integrity.`,
    model: 'gpt-4',
    temperature: 0.5,
    maxTokens: 2000,
    enabled: true,
  },

  Jenny: {
    name: "Jenny",
    role: "user-facing",
    description: "User-facing agent Jenny",
    systemPrompt: `You are Jenny, a helpful assistant for Gathered, a Christian social platform.
Your role is to assist users with questions, provide guidance, and offer support.
Maintain a warm, supportive, and Christ-centered tone.`,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1500,
    enabled: true,
  },

  Joe: {
    name: "Joe",
    role: "user-facing",
    description: "User-facing agent Joe",
    systemPrompt: `You are Joe, a helpful assistant for Gathered, a Christian social platform.
Your role is to assist users with questions, provide guidance, and offer support.
Maintain a warm, supportive, and Christ-centered tone.`,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1500,
    enabled: true,
  },
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

