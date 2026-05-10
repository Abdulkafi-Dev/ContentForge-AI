'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Zap, TrendingUp, DollarSign, Loader2, ShieldCheck, ArrowRight, BarChart3 } from 'lucide-react'
import { CONTENT_TYPE_LABELS } from '@/types/generation'
import Link from 'next/link'

interface AdminStats {
  totalUsers: number
  totalGenerations: number
  generationsLast7d: number
  planCounts: Record<string, number>
  contentTypeCounts: Record<string, number>
  mrr: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setStats(data)
      })
      .finally(() => setLoading(false))
  }, [])

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
          <p className="text-xl font-bold mb-2">403 — Access Denied</p>
          <p className="text-muted-foreground text-sm">Admin access required</p>
        </div>
      </div>
    )
  }

  const kpis = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      href: '/admin/users',
    },
    {
      label: 'Total Generations',
      value: stats?.totalGenerations || 0,
      icon: Zap,
      color: 'text-brand-500',
      bg: 'bg-brand-500/10',
      href: '/admin/analytics',
    },
    {
      label: 'Pro Subscribers',
      value: (stats?.planCounts?.pro || 0) + (stats?.planCounts?.business || 0),
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      href: '/admin/subscriptions',
    },
    {
      label: 'Est. MRR',
      value: `$${(stats?.mrr || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      href: '/admin/subscriptions',
    },
  ]

  const quickLinks = [
    { href: '/admin/users', icon: Users, label: 'View All Users', desc: 'Browse and manage user accounts' },
    { href: '/admin/subscriptions', icon: DollarSign, label: 'Subscriptions', desc: 'Monitor revenue and plans' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Deep Analytics', desc: 'Charts, trends, and growth' },
  ]

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-xl font-bold">Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Platform-wide analytics and key metrics</p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={kpi.href}
              className="block p-5 rounded-2xl border border-border bg-card hover:border-border/80 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 group-hover:text-foreground transition-colors">
                View details <ArrowRight className="w-3 h-3" />
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {['free', 'pro', 'business'].map((plan) => {
              const count = stats?.planCounts?.[plan] || 0
              const total = stats?.totalUsers || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={plan}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{plan}</span>
                    <span className="text-muted-foreground">{count} users ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        plan === 'business' ? 'bg-amber-500' : plan === 'pro' ? 'bg-brand-500' : 'bg-muted-foreground/40'
                      }`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content Type Usage */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Top Content Types</h3>
          <div className="space-y-2">
            {Object.entries(stats?.contentTypeCounts || {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([type, count]) => {
                const total = Object.values(stats?.contentTypeCounts || {}).reduce((a, b) => a + b, 0) || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={type} className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-32 truncate">
                      {CONTENT_TYPE_LABELS[type as keyof typeof CONTENT_TYPE_LABELS] || type}
                    </span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full bg-brand-500 rounded-full"
                      />
                    </div>
                    <span className="text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-semibold mb-3">Quick Navigation</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-red-500/20 hover:bg-red-500/5 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <link.icon className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{link.label}</p>
                <p className="text-xs text-muted-foreground truncate">{link.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
