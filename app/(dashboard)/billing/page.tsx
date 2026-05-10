'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, CreditCard, Zap, Loader2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { PLANS } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/client'

export default function BillingPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [loadingPortal, setLoadingPortal] = useState(false)

  useEffect(() => {
    if (success) toast.success('🎉 Subscription activated! Welcome to Pro.')
    if (canceled) toast.info('Checkout canceled. You can upgrade anytime.')

    const supabase = createClient()
    supabase.from('subscriptions').select('plan, status').then(({ data }) => {
      if (data?.[0]) setSubscription({ plan: data[0].plan, status: data[0].status })
    })
  }, [success, canceled])

  const currentPlan = subscription?.plan || 'free'
  const currentStatus = subscription?.status || 'active'

  const handleUpgrade = async (planKey: string, priceId: string | null | undefined) => {
    if (!priceId) return
    setLoadingPlan(planKey)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planName: planKey }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error('Failed to start checkout')
    } catch {
      toast.error('Failed to start checkout')
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleManage = async () => {
    setLoadingPortal(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error('Failed to open billing portal')
    } catch {
      toast.error('Failed to open billing portal')
    } finally {
      setLoadingPortal(false)
    }
  }

  const plans = [
    { key: 'free', ...PLANS.free, popular: false },
    { key: 'pro', ...PLANS.pro, popular: true },
    { key: 'business', ...PLANS.business, popular: false },
  ]

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-xl font-bold">Billing & Subscription</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current plan indicator */}
      <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-brand-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">Current Plan: <span className="capitalize">{currentPlan}</span></p>
              {currentPlan !== 'free' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                  currentStatus === 'active' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {currentStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentPlan === 'free' ? 'Free forever' : 'Billed monthly via Stripe'}
            </p>
          </div>
        </div>
        {currentPlan !== 'free' && (
          <button
            onClick={handleManage}
            disabled={loadingPortal}
            id="manage-billing-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent text-sm font-medium transition-all disabled:opacity-50"
          >
            {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
            Manage Billing
          </button>
        )}
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.key
          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative p-6 rounded-2xl border transition-all ${
                plan.popular && !isCurrent
                  ? 'border-brand-500 bg-brand-500/5'
                  : isCurrent
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-border bg-card'
              }`}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Current Plan
                  </div>
                </div>
              )}

              <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-end gap-1 mb-5">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-muted-foreground mb-0.5">/mo</span>}
              </div>

              <button
                onClick={() => !isCurrent && plan.priceId && handleUpgrade(plan.key, plan.priceId)}
                disabled={isCurrent || loadingPlan === plan.key || plan.price === 0}
                id={`billing-plan-${plan.key}`}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold mb-5 transition-all flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-green-500/10 text-green-500 cursor-default'
                    : plan.price === 0
                    ? 'bg-muted text-muted-foreground cursor-default'
                    : plan.popular
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'border border-border hover:bg-accent'
                }`}
              >
                {loadingPlan === plan.key ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCurrent ? (
                  <><Check className="w-4 h-4" /> Current</>
                ) : plan.price === 0 ? (
                  'Free Forever'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
