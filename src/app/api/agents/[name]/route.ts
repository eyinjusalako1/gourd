import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "@/agents/config";

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
    const llmResponseText = await callLLM();

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

async function callLLM() {
  return "{}";
}

