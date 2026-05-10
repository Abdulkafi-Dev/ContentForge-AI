'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Zap, TrendingUp, DollarSign, Loader2, ShieldCheck } from 'lucide-react'
import { CONTENT_TYPE_LABELS } from '@/types/generation'

interface AnalyticsData {
  totalUsers: number
  totalGenerations: number
  generationsLast7d: number
  generationsLast30d: number
  newUsersLast30d: number
  contentTypeCounts: Record<string, number>
  dailyActivity: Array<{ date: string; count: number }>
  planCounts: Record<string, number>
  mrr: number
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error)
        else setData(d)
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

  if (error || !data) {
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

  const maxDaily = Math.max(...data.dailyActivity.map((d) => d.count), 1)

  const kpis = [
    { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Generations', value: data.totalGenerations, icon: Zap, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Generations (30d)', value: data.generationsLast30d, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Est. MRR', value: `$${data.mrr.toLocaleString()}`, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'New Users (30d)', value: data.newUsersLast30d, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Generations (7d)', value: data.generationsLast7d, icon: BarChart3, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  ]

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h2 className="text-xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Platform usage metrics and growth data</p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Activity (bar chart) */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Generations — Last 7 Days</h3>
          <div className="flex items-end gap-2 h-32">
            {data.dailyActivity.map(({ date, count }, i) => {
              const height = maxDaily > 0 ? Math.max((count / maxDaily) * 100, 4) : 4
              const label = new Date(date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="w-full rounded-t-sm bg-brand-500"
                    title={`${count} generations`}
                  />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                  <span className="text-[10px] font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content type breakdown */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Content Type Breakdown</h3>
          <div className="space-y-2.5">
            {Object.entries(data.contentTypeCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 7)
              .map(([type, count]) => {
                const total = Object.values(data.contentTypeCounts).reduce((a, b) => a + b, 0) || 1
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
                    <span className="text-muted-foreground w-6 text-right">{count}</span>
                    <span className="text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {['free', 'pro', 'business'].map((plan) => {
              const count = data.planCounts[plan] || 0
              const total = data.totalUsers || 1
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

        {/* Growth summary */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Growth Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Generations / User</p>
                <p className="text-lg font-bold">
                  {data.totalUsers > 0 ? (data.totalGenerations / data.totalUsers).toFixed(1) : '0'}
                </p>
              </div>
              <Zap className="w-5 h-5 text-brand-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground">Paid Conversion Rate</p>
                <p className="text-lg font-bold">
                  {data.totalUsers > 0
                    ? (((data.planCounts.pro || 0) + (data.planCounts.business || 0)) / data.totalUsers * 100).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground">ARPU (paid users)</p>
                <p className="text-lg font-bold">
                  ${(() => {
                    const paid = (data.planCounts.pro || 0) + (data.planCounts.business || 0)
                    return paid > 0 ? (data.mrr / paid).toFixed(2) : '0.00'
                  })()}
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
