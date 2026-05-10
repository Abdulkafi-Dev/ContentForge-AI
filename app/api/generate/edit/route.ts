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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const action = body.action
    const selectedText = body.selectedText
    const fullContext = body.fullContext

    if (!action || !selectedText) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
        },
        {
          status: 400,
        }
      )
    }

    let systemInstruction = ''

    if (action === 'rewrite') {
      systemInstruction =
        'Rewrite the text professionally while preserving meaning.'
    } else if (action === 'shorten') {
      systemInstruction =
        'Shorten the text while preserving the core meaning.'
    } else {
      return NextResponse.json(
        {
          error: 'Invalid action',
        },
        {
          status: 400,
        }
      )
    }

    const userMessage =
      'Context:\n' +
      (fullContext || 'No context') +
      '\n\nTarget Text:\n' +
      selectedText

    const model = aiClient.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: userMessage,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
    })

    const editedText =
      result.response.text()?.trim() || ''

    return NextResponse.json({
      text: editedText,
    })
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        error: error.message || 'Failed',
      },
      {
        status: 500,
      }
    )
  }
}