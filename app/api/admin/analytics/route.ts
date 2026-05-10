import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isSuperAdmin = user.email === 'admin@contentforge.com'
  return (profile?.role === 'admin' || isSuperAdmin) ? user : null
}

export async function GET(_request: NextRequest) {
  try {
    const adminUser = await assertAdmin()
    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const supabase = await createAdminClient()

    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      { count: totalUsers },
      { count: totalGenerations },
      { count: generationsLast7d },
      { count: generationsLast30d },
      { count: newUsersLast30d },
      { data: generationsByType },
      { data: dailyActivity },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('generations').select('*', { count: 'exact', head: true }),
      supabase.from('generations').select('*', { count: 'exact', head: true }).gte('created_at', last7Days.toISOString()),
      supabase.from('generations').select('*', { count: 'exact', head: true }).gte('created_at', last30Days.toISOString()),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', last30Days.toISOString()),
      supabase.from('generations').select('content_type').order('created_at', { ascending: false }).limit(500),
      supabase.from('generations').select('created_at').order('created_at', { ascending: false }).limit(300),
    ])

    // Count by content type
    const contentTypeCounts: Record<string, number> = {}
    generationsByType?.forEach(({ content_type }) => {
      contentTypeCounts[content_type] = (contentTypeCounts[content_type] || 0) + 1
    })

    // Build daily chart (last 7 days)
    const dailyMap: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dailyMap[d.toISOString().slice(0, 10)] = 0
    }
    dailyActivity?.forEach(({ created_at }) => {
      const day = created_at.slice(0, 10)
      if (day in dailyMap) dailyMap[day]++
    })

    // Plan counts for MRR
    const { data: subs } = await supabase.from('subscriptions').select('plan')
    const planCounts: Record<string, number> = { free: 0, pro: 0, business: 0 }
    subs?.forEach(({ plan }) => { planCounts[plan] = (planCounts[plan] || 0) + 1 })
    const mrr = (planCounts.pro || 0) * 29 + (planCounts.business || 0) * 79

    return NextResponse.json({
      totalUsers,
      totalGenerations,
      generationsLast7d,
      generationsLast30d,
      newUsersLast30d,
      contentTypeCounts,
      dailyActivity: Object.entries(dailyMap).map(([date, count]) => ({ date, count })),
      planCounts,
      mrr,
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
