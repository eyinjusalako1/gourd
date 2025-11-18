import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ref, text } = body

    if (!ref || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: ref and text' },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

    // If no API key, return stub response
    if (!openaiApiKey) {
      return NextResponse.json({
        explanation: `AI-assisted explanation of ${ref}. This passage speaks to the heart of God's love and purpose for humanity. The text reveals deep spiritual truths that can guide us in our daily walk with Christ.`,
        context: `This passage from ${ref} is part of the larger narrative of Scripture, showing God's consistent character and plan throughout history. Understanding the context helps us see how this verse fits into the broader story of redemption.`,
        reflections: [
          'What does this verse reveal about God\'s character and His heart for you?',
          'How might this truth apply to your current life circumstances?',
          'What is the Holy Spirit highlighting to you as you read this passage?'
        ],
        application: 'Take a moment this week to meditate on this verse. Write down one practical way you can live out this truth in your relationships, work, or daily routine.',
        prayer: `Lord, thank You for Your Word. Help me to understand and apply the truth of ${ref} in my life. Open my heart to receive what You want to teach me through this passage. In Jesus' name, Amen.`,
        references: []
      })
    }

    // If API key exists, call OpenAI
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const systemPrompt = `You are a helpful, encouraging Christian Bible study assistant. Your role is to provide biblically grounded, thoughtful explanations of Scripture that help people grow in their faith.

Guidelines:
- Be encouraging and grace-filled, not dogmatic
- Ground your explanations in biblical truth
- Be respectful of different Christian traditions
- Always label your content as "AI-assisted" to be clear this is not authoritative biblical interpretation
- Focus on practical application and spiritual growth
- Keep responses concise but meaningful
- Use a warm, pastoral tone

Format your response as JSON with these exact fields:
- explanation: A clear, encouraging explanation of the passage
- context: How this passage fits into the broader biblical narrative
- reflections: An array of 2-3 thoughtful reflection questions
- application: One practical step the reader can take this week
- prayer: A short, heartfelt prayer related to the passage
- references: An array of related Bible references (if any)`

    const userPrompt = `Please provide a Bible study guide for ${ref}:\n\n${text}\n\nFormat your response as valid JSON matching the structure described in the system prompt.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for cost efficiency, can upgrade to gpt-4 if needed
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let studyData
    try {
      studyData = JSON.parse(aiResponse)
    } catch (parseError) {
      // If parsing fails, return a structured fallback
      return NextResponse.json({
        explanation: `AI-assisted explanation of ${ref}. ${aiResponse.substring(0, 200)}...`,
        context: 'Context provided by AI study assistant.',
        reflections: [
          'What does this verse reveal about God?',
          'How might this apply to your life this week?'
        ],
        application: 'Reflect on this passage and ask God how He wants you to apply it.',
        prayer: `Lord, help me to understand and apply the truth of ${ref}. Amen.`,
        references: []
      })
    }

    // Ensure all required fields exist
    const response = {
      explanation: studyData.explanation || `AI-assisted explanation of ${ref}.`,
      context: studyData.context || 'Context provided by AI study assistant.',
      reflections: Array.isArray(studyData.reflections) 
        ? studyData.reflections 
        : ['What does this verse reveal about God?', 'How might this apply to your life this week?'],
      application: studyData.application || 'Reflect on this passage and ask God how He wants you to apply it.',
      prayer: studyData.prayer || `Lord, help me to understand and apply the truth of ${ref}. Amen.`,
      references: Array.isArray(studyData.references) ? studyData.references : []
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in faith-study route:', error)
    
    // Return a fallback response even on error
    return NextResponse.json(
      {
        explanation: 'AI study guide is temporarily unavailable. Please try again later.',
        context: 'Context unavailable.',
        reflections: [
          'What does this verse reveal about God?',
          'How might this apply to your life this week?'
        ],
        application: 'Take time to meditate on this passage and ask the Holy Spirit to reveal its meaning to you.',
        prayer: 'Lord, open my heart to receive Your truth. Amen.',
        references: []
      },
      { status: 500 }
    )
  }
}

