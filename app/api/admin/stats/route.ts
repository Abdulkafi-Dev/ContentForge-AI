import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

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

export async function GET(request: NextRequest) {
  try {
    const user = await assertAdmin()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createAdminClient()

    const [
      { count: totalUsers },
      { count: totalGenerations },
      { data: subscriptionStats },
      { data: recentGenerations },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('generations').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('plan').neq('plan', 'free'),
      supabase
        .from('generations')
        .select('content_type, created_at')
        .order('created_at', { ascending: false })
        .limit(100),
    ])

    const planCounts = subscriptionStats?.reduce(
      (acc: Record<string, number>, sub: { plan: string }) => {
        acc[sub.plan] = (acc[sub.plan] || 0) + 1
        return acc
      },
      {}
    ) || {}

    const contentTypeCounts = recentGenerations?.reduce(
      (acc: Record<string, number>, gen: { content_type: string }) => {
        acc[gen.content_type] = (acc[gen.content_type] || 0) + 1
        return acc
      },
      {}
    ) || {}

    return NextResponse.json({
      totalUsers,
      totalGenerations,
      planCounts,
      contentTypeCounts,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
