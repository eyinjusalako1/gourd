import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "@/agents/config";
import OpenAI from "openai";

export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const agentName = params.name;
  const agent = AGENTS[agentName];

  if (!agent) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
  }

  const body = await req.json();
  const userContent = JSON.stringify(body);

  // Check OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const llmResponseText = await callLLM(agent, userContent);

    let parsed;
    try {
      parsed = JSON.parse(llmResponseText);
    } catch (e) {
      return NextResponse.json(
        {
          error: "Agent did not return valid JSON",
          raw: llmResponseText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      agent: agentName,
      data: parsed,
    });
  } catch (error: any) {
    console.error("Agent API error:", error);
    
    // Handle specific OpenAI API errors
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
      return NextResponse.json(
        {
          error: "OpenAI API quota exceeded. Please check your OpenAI account billing and usage limits.",
          code: "QUOTA_EXCEEDED",
          details: "The AI service has reached its usage limit. Please add payment method or upgrade your OpenAI plan at https://platform.openai.com/account/billing",
        },
        { status: 429 }
      );
    }
    
    if (error.status === 401 || error.message?.includes('API key')) {
      return NextResponse.json(
        {
          error: "OpenAI API key is invalid or missing. Please check your environment variables.",
          code: "API_KEY_ERROR",
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred",
        details: error.response?.data || null,
      },
      { status: 500 }
    );
  }
}

async function callLLM(agent: typeof AGENTS[keyof typeof AGENTS], userContent: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: agent.model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: agent.systemPrompt },
      { role: 'user', content: userContent },
    ],
    temperature: agent.temperature ?? 0.7,
    max_tokens: agent.maxTokens ?? 2000,
    response_format: { type: 'json_object' },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error('No response from OpenAI');
  }

  return response;
}

