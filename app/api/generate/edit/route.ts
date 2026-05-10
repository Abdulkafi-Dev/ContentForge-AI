import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiClient } from '@/lib/ai/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, selectedText, fullContext } = body

    if (!action || !selectedText) {
      return NextResponse.json(
        { error: 'Missing required fields: action, selectedText' },
        { status: 400 }
      )
    }

    let systemInstruction = ''

    if (action === 'rewrite') {
      systemInstruction =
        'You are an expert editor and copywriter. Rewrite the provided text to be more engaging, polished, and professional while retaining the original meaning.'
    } else if (action === 'shorten') {
      systemInstruction =
        'You are an expert editor. Shorten the provided text to be concise and direct while keeping the core message.'
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    const userMessage =
      'Original full context (for reference only):\n' +
      (fullContext || 'No context provided') +
      '\n\nText to ' +
      action +
      ':\n' +
      selectedText

    const model = aiClient.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
    })

    const editedText = result.response.text()?.trim() || ''

    return NextResponse.json({
      text: editedText,
    })
  } catch (error: any) {
    console.error('Editor generation error:', error)

    return NextResponse.json(
      {
        error: error.message || 'Failed to edit content.',
      },
      { status: 500 }
    )
  }
}