import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "@/agents/config";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const llmResponseText = await callLLM({
      systemPrompt: agent.systemPrompt,
      userContent,
      model: agent.model || "gpt-4",
      temperature: agent.temperature ?? 0.7,
      maxTokens: agent.maxTokens || 2000,
    });

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
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred",
        details: error.response?.data || null,
      },
      { status: 500 }
    );
  }
}

/**
 * Real OpenAI LLM call implementation
 */
async function callLLM(args: {
  systemPrompt: string;
  userContent: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const { systemPrompt, userContent, model = "gpt-4", temperature = 0.7, maxTokens = 2000 } = args;

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" }, // Request JSON response
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    if (!responseText) {
      throw new Error("Empty response from OpenAI");
    }

    return responseText;
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // Handle OpenAI API errors
    if (error.response) {
      throw new Error(`OpenAI API error: ${error.response.statusText || error.message}`);
    }
    
    throw error;
  }
}

