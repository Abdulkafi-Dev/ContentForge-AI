export type ContentType =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'product_description'
  | 'email_marketing'
  | 'blog_article'
  | 'ad_copy'

export interface GenerationInput {
  contentType: ContentType
  businessType: string
  productService: string
  tone: string
  targetAudience: string
  keywords: string
  additionalInstructions: string
}

export interface Generation {
  id: string
  user_id: string
  content_type: ContentType
  inputs: GenerationInput
  output: string
  is_saved: boolean
  created_at: string
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  instagram: 'Instagram Caption',
  facebook: 'Facebook Post',
  tiktok: 'TikTok Caption',
  product_description: 'Product Description',
  email_marketing: 'Email Marketing',
  blog_article: 'Blog Article',
  ad_copy: 'Ad Copy',
}

export const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
  instagram: '📸',
  facebook: '👥',
  tiktok: '🎵',
  product_description: '🛍️',
  email_marketing: '📧',
  blog_article: '📝',
  ad_copy: '📢',
}

export const TONE_OPTIONS = [
  'Professional',
  'Casual & Friendly',
  'Witty & Humorous',
  'Inspirational',
  'Urgent & Persuasive',
  'Luxurious & Premium',
  'Educational',
  'Empathetic',
] as const

export const INDUSTRY_TEMPLATES = [
  { id: 'restaurants', name: 'Restaurants & Food', emoji: '🍽️' },
  { id: 'fitness', name: 'Fitness & Wellness', emoji: '💪' },
  { id: 'real_estate', name: 'Real Estate', emoji: '🏠' },
  { id: 'beauty', name: 'Beauty & Salons', emoji: '💅' },
  { id: 'ecommerce', name: 'E-Commerce', emoji: '🛒' },
  { id: 'agencies', name: 'Marketing Agencies', emoji: '📊' },
  { id: 'cafes', name: 'Cafes & Bakeries', emoji: '☕' },
  { id: 'coaches', name: 'Coaches & Consultants', emoji: '🎯' },
]
