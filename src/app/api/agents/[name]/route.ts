/**
 * Agent API Route
 * Handles requests to AI agents
 * 
 * POST /api/agents/[name]
 * 
 * Body: {
 *   message: string
 *   context?: Record<string, any>
 *   userId?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAgentConfig, isAgentAvailable } from '@/agents/config'
import type { AgentRequest, AgentResponse, AgentName } from '@/types/agents'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const agentName = params.name

    // Check if agent exists and is enabled
    if (!isAgentAvailable(agentName)) {
      return NextResponse.json(
        {
          success: false,
          message: `Agent "${agentName}" is not available or not enabled`,
          error: 'AGENT_NOT_FOUND',
        } as AgentResponse,
        { status: 404 }
      )
    }

    // Get agent configuration
    const agentConfig = getAgentConfig(agentName)
    if (!agentConfig) {
      return NextResponse.json(
        {
          success: false,
          message: `Agent configuration not found for "${agentName}"`,
          error: 'AGENT_CONFIG_NOT_FOUND',
        } as AgentResponse,
        { status: 404 }
      )
    }

    // Parse request body
    const body: AgentRequest = await request.json()
    const { message, context, userId } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Message is required and must be a string',
          error: 'INVALID_REQUEST',
        } as AgentResponse,
        { status: 400 }
      )
    }

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'OpenAI API key is not configured',
          error: 'OPENAI_NOT_CONFIGURED',
        } as AgentResponse,
        { status: 500 }
      )
    }

    // Get user context if userId is provided
    let userContext = {}
    if (userId && isSupabaseConfigured()) {
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, interests, city')
          .eq('id', userId)
          .single()

        if (profile) {
          userContext = {
            userRole: profile.role,
            interests: profile.interests,
            location: profile.city,
          }
        }
      } catch (error) {
        console.warn('Failed to fetch user context:', error)
        // Continue without user context
      }
    }

    // Build the full context for the agent
    const fullContext = {
      ...userContext,
      ...context,
      agentName: agentConfig.name,
      agentRole: agentConfig.role,
    }

    // Prepare messages for OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: agentConfig.systemPrompt,
      },
      {
        role: 'user',
        content: context
          ? `${message}\n\nContext: ${JSON.stringify(fullContext, null, 2)}`
          : message,
      },
    ]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: agentConfig.model || 'gpt-4',
      messages,
      temperature: agentConfig.temperature ?? 0.7,
      max_tokens: agentConfig.maxTokens || 1000,
    })

    const responseMessage = completion.choices[0]?.message?.content || ''
    const tokensUsed = completion.usage?.total_tokens || 0

    // Return successful response
    return NextResponse.json({
      success: true,
      message: responseMessage,
      data: {
        agent: agentConfig.name,
        role: agentConfig.role,
        tokensUsed,
      },
    } as AgentResponse)
  } catch (error: any) {
    console.error('Agent API error:', error)

    // Handle OpenAI API errors
    if (error.response) {
      return NextResponse.json(
        {
          success: false,
          message: 'OpenAI API error',
          error: error.response.statusText || 'OPENAI_ERROR',
        } as AgentResponse,
        { status: error.response.status || 500 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'An unexpected error occurred',
        error: 'INTERNAL_ERROR',
      } as AgentResponse,
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to retrieve agent information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const agentName = params.name

  if (!isAgentAvailable(agentName)) {
    return NextResponse.json(
      {
        success: false,
        message: `Agent "${agentName}" is not available`,
        error: 'AGENT_NOT_FOUND',
      },
      { status: 404 }
    )
  }

  const agentConfig = getAgentConfig(agentName)
  if (!agentConfig) {
    return NextResponse.json(
      {
        success: false,
        message: `Agent configuration not found`,
        error: 'AGENT_CONFIG_NOT_FOUND',
      },
      { status: 404 }
    )
  }

  // Return agent info (without sensitive system prompt)
  return NextResponse.json({
    success: true,
    data: {
      name: agentConfig.name,
      role: agentConfig.role,
      description: agentConfig.description,
      enabled: agentConfig.enabled,
    },
  })
}

