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

  // Dev mode: Return mock data if GATHERED_MOCK_AGENTS is enabled
  const isMockMode = process.env.GATHERED_MOCK_AGENTS === 'true';
  
  if (isMockMode) {
    console.log(`[MOCK MODE] Returning mock data for agent: ${agentName}`);
    const mockData = getMockResponse(agentName, body);
    return NextResponse.json({
      agent: agentName,
      data: mockData,
      _mock: true, // Flag to indicate this is mock data
    });
  }

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

/**
 * Generate mock responses for agents when GATHERED_MOCK_AGENTS=true
 */
function getMockResponse(agentName: string, body: any): any {
  switch (agentName) {
    case 'EJ': {
      // Generate mock EJ response based on user answers
      const answers = body.answers || {};
      const interests = answers.interests || 'gym, anime, church';
      const socialEnergy = answers.social_energy || 'ambivert';
      const availability = answers.availability || 'weekends';
      const groupSize = answers.preferred_group_size || '6-10';
      
      // Parse interests into tags
      const tags = interests
        .split(',')
        .map((i: string) => i.trim())
        .filter((i: string) => i.length > 0)
        .slice(0, 8);
      
      return {
        short_bio: `Passionate about ${tags.slice(0, 3).join(', ')}. ${socialEnergy === 'extrovert' ? 'Love connecting with people' : socialEnergy === 'introvert' ? 'Enjoy meaningful connections' : 'Enjoy both social and quiet time'}. Always looking to grow and learn.`,
        long_bio: `I'm a ${socialEnergy} who enjoys ${tags.slice(0, 3).join(', ')}. My ideal time involves ${answers.weekend_style || 'balancing activities and rest'}. I'm ${availability.includes('weekend') ? 'usually available on weekends' : availability.includes('weekday') ? 'available during weekdays' : `available ${availability}`}. Looking forward to connecting with others who share similar interests and values!`,
        tags: tags.length > 0 ? tags : ['community', 'growth', 'connection'],
        social_style: socialEnergy || 'ambivert',
        preferred_group_size: groupSize || '6-10',
        availability_summary: `Available ${availability}. ${groupSize === '1-1' ? 'Prefer one-on-one connections.' : groupSize === '3-5' ? 'Enjoy small, intimate groups.' : groupSize === '6-10' ? 'Love medium-sized gatherings.' : groupSize === '10+' ? 'Thrive in larger groups!' : 'Open to any group size.'}`,
      };
    }
    
    case 'Simi': {
      return {
        intent: 'discover',
        interests: [],
        location_hint: '',
        time_preferences: '',
        other_constraints: [],
      };
    }
    
    case 'PROPHECY': {
      return {
        content: 'Mock content from PROPHECY agent',
        type: body.content_type || 'script',
      };
    }
    
    case 'Joe': {
      return {
        diagnosis: 'Mock diagnosis',
        proposed_fix_explanation: 'Mock fix explanation',
        patch_suggestion: '// Mock patch',
        pr_title: 'Mock PR Title',
        pr_description: 'Mock PR Description',
      };
    }
    
    default:
      return {
        message: `Mock response for ${agentName}`,
        input: body,
      };
  }
}

