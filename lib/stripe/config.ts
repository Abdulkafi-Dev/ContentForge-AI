export const PLANS = {
  free: {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    priceId: null,
    generationsPerMonth: 10,
    features: [
      '10 AI generations per month',
      'Standard templates',
      'Copy & save content',
      'Community support',
    ],
    notIncluded: [
      'Unlimited generations',
      'Premium templates',
      'Priority AI generation',
      'Team features',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'For power users & creators',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    generationsPerMonth: Infinity,
    features: [
      'Unlimited AI generations',
      'Premium templates',
      'Full edit workstation',
      'Export to PDF & TXT',
      'Priority support',
    ],
    notIncluded: ['Team features', 'Custom AI training'],
  },
  business: {
    name: 'Business',
    description: 'For teams & agencies',
    price: 79,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    generationsPerMonth: Infinity,
    features: [
      'Everything in Pro',
      'Team collaborative features',
      'Priority AI generation',
      'Advanced dashboard analytics',
      'Dedicated account manager',
    ],
    notIncluded: [],
  },
} as const

export type PlanType = keyof typeof PLANS
