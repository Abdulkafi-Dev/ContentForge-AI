import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiClient } from '@/lib/ai/client'
import {
  buildInstagramPrompt,
  buildFacebookPrompt,
  buildTikTokPrompt,
  buildProductDescriptionPrompt,
  buildEmailMarketingPrompt,
  buildBlogArticlePrompt,
  buildAdCopyPrompt,
  PromptInput,
} from '@/lib/ai/prompts'
import { checkRateLimit } from '@/lib/utils/rateLimit'
import { ContentType } from '@/types/generation'
import { PLANS } from '@/lib/stripe/config'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting: 5 requests per minute per user
    const { allowed, remaining } = checkRateLimit(`generate:${user.id}`, 5, 60000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      )
    }

    // Check subscription & usage limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single()

    const plan = subscription?.plan || 'free'
    const planConfig = PLANS[plan as keyof typeof PLANS]

    if (planConfig.generationsPerMonth !== Infinity) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if ((count || 0) >= planConfig.generationsPerMonth) {
        return NextResponse.json(
          {
            error: `You've reached your ${planConfig.generationsPerMonth} generations limit for this month. Upgrade to Pro for unlimited generations.`,
            upgradeRequired: true,
          },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const { contentType, businessType, productService, tone, targetAudience, keywords, additionalInstructions } = body

    if (!contentType || !businessType || !productService) {
      return NextResponse.json(
        { error: 'Missing required fields: contentType, businessType, productService' },
        { status: 400 }
      )
    }

    const promptInput: PromptInput = {
      businessType,
      productService,
      tone: tone || 'Professional',
      targetAudience: targetAudience || 'General audience',
      keywords: keywords || '',
      additionalInstructions: additionalInstructions || '',
    }

    const promptBuilders: Record<ContentType, (input: PromptInput) => ReturnType<typeof buildInstagramPrompt>> = {
      instagram: buildInstagramPrompt,
      facebook: buildFacebookPrompt,
      tiktok: buildTikTokPrompt,
      product_description: buildProductDescriptionPrompt,
      email_marketing: buildEmailMarketingPrompt,
      blog_article: buildBlogArticlePrompt,
      ad_copy: buildAdCopyPrompt,
    }

    const promptBuilder = promptBuilders[contentType as ContentType]
    if (!promptBuilder) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const { system, userMessage, maxTokens, temperature } = promptBuilder(promptInput)

    const model = aiClient.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: system,
    })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature,
      }
    })

    const generatedContent = result.response.text() || ''

    // Save to database
    const { data: generation, error: saveError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        content_type: contentType,
        inputs: promptInput,
        output: generatedContent,
        is_saved: false,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save generation:', saveError)
    }

    // Track usage
    await supabase.from('usage_tracking').insert({
      user_id: user.id,
      action: 'generation',
      content_type: contentType,
    })

    return NextResponse.json({
      content: generatedContent,
      generationId: generation?.id,
      remaining,
    })
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate content.' },
      { status: 500 }
    )
  }
}
