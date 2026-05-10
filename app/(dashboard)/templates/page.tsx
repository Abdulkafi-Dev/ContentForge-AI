'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Lock, Sparkles } from 'lucide-react'
import { INDUSTRY_TEMPLATES } from '@/types/generation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const TEMPLATE_DATA: Record<string, Array<{
  title: string
  type: string
  description: string
  isPremium?: boolean
  prefill: { businessType: string; productService: string; tone: string; targetAudience: string; keywords: string }
}>> = {
  restaurants: [
    {
      title: 'New Menu Launch',
      type: 'instagram',
      description: 'Announce a new menu item on Instagram',
      prefill: { businessType: 'Restaurant', productService: 'New seasonal menu item', tone: 'Casual & Friendly', targetAudience: 'Food lovers aged 25-45', keywords: 'fresh, seasonal, chef-crafted' },
    },
    {
      title: 'Weekend Special Post',
      type: 'facebook',
      description: 'Promote weekend deals on Facebook',
      prefill: { businessType: 'Restaurant', productService: 'Weekend dining special', tone: 'Casual & Friendly', targetAudience: 'Local families and couples', keywords: 'discount, special, weekend' },
    },
  ],
  fitness: [
    {
      title: 'Class Promotion',
      type: 'instagram',
      description: 'Promote a new fitness class',
      prefill: { businessType: 'Fitness Studio', productService: 'HIIT fitness class', tone: 'Inspirational', targetAudience: 'Health-conscious adults 25-45', keywords: 'transformation, strength, community' },
    },
    {
      title: 'Personal Training Ad',
      type: 'ad_copy',
      isPremium: true,
      description: 'Google ad for personal training',
      prefill: { businessType: 'Personal Training', productService: 'One-on-one personal training', tone: 'Urgent & Persuasive', targetAudience: 'People looking to lose weight', keywords: 'results, certified, customized' },
    },
  ],
  real_estate: [
    {
      title: 'Property Listing',
      type: 'product_description',
      description: 'Write a compelling property listing',
      prefill: { businessType: 'Real Estate Agency', productService: '3-bedroom family home', tone: 'Professional', targetAudience: 'Young families and professionals', keywords: 'spacious, modern, prime location' },
    },
    {
      title: 'Open House Email',
      type: 'email_marketing',
      isPremium: true,
      description: 'Invite buyers to an open house',
      prefill: { businessType: 'Real Estate', productService: 'Open house event', tone: 'Professional', targetAudience: 'Prospective home buyers', keywords: 'exclusive, opportunity, dream home' },
    },
  ],
  beauty: [
    {
      title: 'Salon Service Caption',
      type: 'instagram',
      description: 'Promote a salon service on Instagram',
      prefill: { businessType: 'Beauty Salon', productService: 'Hair transformation service', tone: 'Luxurious & Premium', targetAudience: 'Women aged 25-50', keywords: 'luxury, transformation, confidence' },
    },
    {
      title: 'Beauty Product Description',
      type: 'product_description',
      description: 'Describe a beauty product',
      prefill: { businessType: 'Beauty Brand', productService: 'Organic face serum', tone: 'Luxurious & Premium', targetAudience: 'Skincare enthusiasts', keywords: 'organic, natural, glowing' },
    },
  ],
  ecommerce: [
    {
      title: 'Product Launch Post',
      type: 'facebook',
      description: 'Launch a product on Facebook',
      prefill: { businessType: 'E-Commerce Store', productService: 'New product launch', tone: 'Urgent & Persuasive', targetAudience: 'Online shoppers', keywords: 'limited edition, exclusive, must-have' },
    },
    {
      title: 'Product Description',
      type: 'product_description',
      description: 'Write a converting product description',
      prefill: { businessType: 'Online Store', productService: 'Premium lifestyle product', tone: 'Casual & Friendly', targetAudience: 'Millennial shoppers', keywords: 'quality, affordable, bestseller' },
    },
  ],
  agencies: [
    {
      title: 'Agency Services Blog',
      type: 'blog_article',
      isPremium: true,
      description: 'Write a blog about agency services',
      prefill: { businessType: 'Digital Marketing Agency', productService: 'Social media management services', tone: 'Professional', targetAudience: 'Small business owners', keywords: 'ROI, growth, engagement' },
    },
    {
      title: 'Client Results Email',
      type: 'email_marketing',
      isPremium: true,
      description: 'Share client success story via email',
      prefill: { businessType: 'Marketing Agency', productService: 'Digital marketing results', tone: 'Professional', targetAudience: 'Potential B2B clients', keywords: 'results, proven, ROI' },
    },
  ],
  cafes: [
    {
      title: 'Morning Coffee Post',
      type: 'instagram',
      description: 'Morning coffee Instagram caption',
      prefill: { businessType: 'Cafe', productService: 'Specialty coffee drinks', tone: 'Casual & Friendly', targetAudience: 'Coffee lovers aged 22-40', keywords: 'artisan, cozy, morning ritual' },
    },
    {
      title: 'New Drink TikTok',
      type: 'tiktok',
      description: 'TikTok caption for new drink',
      prefill: { businessType: 'Cafe', productService: 'Viral drink recipe', tone: 'Witty & Humorous', targetAudience: 'Gen Z and Millennials', keywords: 'viral, aesthetic, delicious' },
    },
  ],
  coaches: [
    {
      title: 'Coaching Program Launch',
      type: 'email_marketing',
      isPremium: true,
      description: 'Launch email for coaching program',
      prefill: { businessType: 'Life Coach', productService: '12-week transformation program', tone: 'Inspirational', targetAudience: 'Ambitious professionals', keywords: 'transformation, clarity, results' },
    },
    {
      title: 'Motivational TikTok',
      type: 'tiktok',
      description: 'Motivational TikTok caption',
      prefill: { businessType: 'Fitness Coach', productService: 'Online coaching services', tone: 'Inspirational', targetAudience: 'People wanting life change', keywords: 'motivation, success, mindset' },
    },
  ],
}

export default function TemplatesPage() {
  const [userPlan, setUserPlan] = useState<string>('free')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('subscriptions').select('plan').then(({ data }) => {
      if (data?.[0]) setUserPlan(data[0].plan)
    })
  }, [])

  const isPro = userPlan === 'pro' || userPlan === 'business'

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-xl font-bold">Templates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pre-built content templates for your industry — click to auto-fill the generator
        </p>
      </div>

      {INDUSTRY_TEMPLATES.map(({ id, name, emoji }, i) => {
        const templates = TEMPLATE_DATA[id] || []
        if (templates.length === 0) return null

        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{emoji}</span>
              <h3 className="font-semibold">{name}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {templates.map((template) => {
                const params = new URLSearchParams({
                  type: template.type,
                  ...template.prefill,
                })

                const isLocked = template.isPremium && !isPro

                const handleClick = (e: React.MouseEvent) => {
                  if (isLocked) {
                    e.preventDefault()
                    toast.error('This is a Premium Template', {
                      description: 'Upgrade to Pro to unlock industry-leading templates.',
                      action: {
                        label: 'Upgrade',
                        onClick: () => router.push('/billing'),
                      },
                    })
                  }
                }

                return (
                  <Link
                    key={template.title}
                    href={isLocked ? '#' : `/generate?${params}`}
                    id={`template-${id}-${template.type}`}
                    onClick={handleClick}
                    className={`group p-5 rounded-xl border transition-all ${
                      isLocked 
                        ? 'border-border bg-muted/50 cursor-not-allowed opacity-80' 
                        : 'border-border bg-card hover:border-brand-500/30 hover:bg-brand-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{template.title}</p>
                          {template.isPremium && (
                            <span className="px-1.5 py-0.5 rounded-md bg-brand-500/10 text-brand-500 text-[10px] font-bold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              PRO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                      {isLocked ? (
                        <Lock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                        {template.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {template.prefill.tone}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
