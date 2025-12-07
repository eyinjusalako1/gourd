import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "@/agents/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MOCK_MODE = process.env.GATHERED_MOCK_AGENTS === "true";

/**
 * Simple mock responses for dev mode and fallback.
 * You can tweak these to match what you expect each agent to return.
 */
function getMockResponse(agentName: string, body: any) {
  switch (agentName) {
    case "OnboardingAssistant":
      return {
        short_bio: "Weekend gym, anime, church & chill hangs.",
        long_bio:
          "I'm into gym, anime, church and chilled social vibes. I like meeting new people in small groups, exploring food spots and having good conversations on weekends.",
        tags: ["gym", "anime", "church", "brunch", "chilled vibes"],
        social_style: body?.answers?.social_energy || "ambivert",
        preferred_group_size: body?.answers?.preferred_group_size || "3-5",
        availability_summary:
          body?.answers?.availability ||
          "Weekends and some weekday evenings.",
      };

    case "DiscoveryAssistant":
      return {
        intent: "mixed",
        interests: ["anime", "gym"],
        location_hint: "Stratford, London",
        time_preferences: "Sunday afternoons",
        other_constraints: ["faith-based"],
      };

    case "ContentEngine":
      return {
        content_type: body?.content_type || "tiktok_script",
        hooks: [
          "POV: You moved cities and your social life disappeared overnight.",
          "Adulting is wild: busy calendar, zero real friends.",
          "London is packed, but somehow you still feel alone?",
        ],
        script_outline: [
          "Relatable intro about struggling to make friends after uni.",
          "Show quick cuts of being at home vs going out alone.",
          "Introduce Gathered as the app that helps you find your people.",
          "End with CTA to join the waitlist / download.",
        ],
        cta: "Download Gathered and find your people in your city.",
        hashtags: ["#gatheredapp", "#newfriends", "#londonlife"],
      };

    case "DevOpsAssistant":
      return {
        diagnosis:
          "Likely an undefined or null value being accessed in the component based on the stack trace.",
        proposed_fix_explanation:
          "Add a defensive check before using the value and ensure the expected prop/state is set before render.",
        patch_suggestion:
          "// Example: if (!props.user) return null; // then safely use props.user below.",
        pr_title: "Add null-check to prevent runtime error in component",
        pr_description:
          "Adds a null-check around the user prop in the component to prevent crashes when the user object is not yet loaded.",
      };

    default:
      return { note: "No mock defined for this agent yet." };
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const agentName = params.name as keyof typeof AGENTS;
  const agent = AGENTS[agentName];

  if (!agent) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
  }

  const body = await req.json();

  // 1) If dev mock mode is on, always return mock
  if (MOCK_MODE) {
    const mock = getMockResponse(agentName, body);
    return NextResponse.json({ agent: agentName, data: mock });
  }

  const userContent = JSON.stringify(body);

  let llmResponseText: string;
  try {
    // 2) Try real LLM call
    llmResponseText = await callLLM({
      systemPrompt: agent.systemPrompt,
      userContent,
    });
  } catch (error: any) {
    console.error("LLM error for agent", agentName, error?.message || error);

    // 3) If API quota or error => fall back to mock
    const mock = getMockResponse(agentName, body);
    return NextResponse.json(
      {
        agent: agentName,
        data: mock,
        warning:
          "LLM call failed, returned mock response instead. Check API billing/limits.",
      },
      { status: 200 }
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(llmResponseText || "{}");
  } catch (e) {
    // If parsing fails, also fall back to mock so the UI doesn't die
    const mock = getMockResponse(agentName, body);
    return NextResponse.json(
      {
        agent: agentName,
        data: mock,
        warning:
          "Agent did not return valid JSON, returned mock instead. Check prompt formatting.",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    agent: agentName,
    data: parsed,
  });
}

async function callLLM(args: { systemPrompt: string; userContent: string }) {
  const { systemPrompt, userContent } = args;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: 0.4,
  });

  const message = completion.choices[0]?.message?.content;
  if (!message) {
    throw new Error("No response from language model");
  }

  return message;
}
