'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, DollarSign, Users, TrendingUp, Loader2, ShieldCheck, ExternalLink } from 'lucide-react'

interface Subscription {
  id: string
  plan: string
  status: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  created_at: string
  profiles: { email: string; full_name: string | null } | null
}

interface SubscriptionSummary {
  free: number
  pro: number
  business: number
  total: number
  mrr: number
}

const PLAN_BADGE: Record<string, string> = {
  pro: 'bg-brand-500/10 text-brand-500',
  business: 'bg-amber-500/10 text-amber-500',
  free: 'bg-muted text-muted-foreground',
}

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500',
  canceled: 'bg-red-500/10 text-red-500',
  past_due: 'bg-yellow-500/10 text-yellow-500',
  trialing: 'bg-blue-500/10 text-blue-500',
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [summary, setSummary] = useState<SubscriptionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')

  useEffect(() => {
    fetch('/api/admin/subscriptions')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setSubscriptions(data.subscriptions || [])
        setSummary(data.summary)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = filterPlan === 'all'
    ? subscriptions
    : subscriptions.filter((s) => s.plan === filterPlan)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-bold mb-1">Access Denied</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const kpis = [
    { label: 'Monthly Recurring Revenue', value: `$${summary?.mrr.toLocaleString() || 0}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pro Subscribers', value: summary?.pro || 0, icon: TrendingUp, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Business Subscribers', value: summary?.business || 0, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Free Users', value: summary?.free || 0, icon: CreditCard, color: 'text-muted-foreground', bg: 'bg-muted' },
  ]

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Subscriptions</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage and monitor all active subscriptions</p>
      </div>

      {/* KPI Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <div className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'free', 'pro', 'business'].map((plan) => (
          <button
            key={plan}
            onClick={() => setFilterPlan(plan)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filterPlan === plan
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-accent text-muted-foreground'
            }`}
          >
            {plan}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Renewal</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stripe ID</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => (
                <motion.tr
                  key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{sub.profiles?.full_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{sub.profiles?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${PLAN_BADGE[sub.plan] || PLAN_BADGE.free}`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[sub.status] || STATUS_BADGE.active}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {sub.current_period_end
                      ? new Date(sub.current_period_end).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {sub.stripe_subscription_id ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                        {sub.stripe_subscription_id.slice(0, 14)}…
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="w-10 h-10 text-muted-foreground opacity-30 mb-3" />
              <p className="text-sm text-muted-foreground">No subscriptions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
