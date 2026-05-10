export interface StripeSubscription {
  id: string
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  plan: 'free' | 'pro' | 'business'
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  currentPeriodEnd: string
}

export interface CheckoutSessionRequest {
  priceId: string
  planName: string
}

export interface WebhookEvent {
  type: string
  data: {
    object: Record<string, unknown>
  }
}
