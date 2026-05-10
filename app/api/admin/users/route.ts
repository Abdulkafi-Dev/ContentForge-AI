import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

async function assertAdmin() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Admin Auth Check: No user found', authError)
      return null
    }

    if (user.email === 'admin@contentforge.com') return user

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return user
  } catch (e) {
    console.error('Admin Auth Check: Unexpected error', e)
    return null
  }
}

export async function GET(_request: NextRequest) {
  try {
    const adminUser = await assertAdmin()
    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const supabase = await createAdminClient()

    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // Fetch subscriptions separately to avoid join errors
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('user_id, plan, status, current_period_end')

    const subMap: Record<string, any> = {}
    subs?.forEach(s => {
      subMap[s.user_id] = s
    })

    // Enrich with generation counts
    const userIds = users?.map((u) => u.id) || []
    const { data: generationCounts } = await supabase
      .from('generations')
      .select('user_id')
      .in('user_id', userIds)

    const countMap: Record<string, number> = {}
    generationCounts?.forEach(({ user_id }) => {
      countMap[user_id] = (countMap[user_id] || 0) + 1
    })

    const enriched = users?.map((u) => ({
      ...u,
      subscriptions: subMap[u.id] || { plan: 'free', status: 'none' },
      generationCount: countMap[u.id] || 0,
    }))

    return NextResponse.json({ users: enriched })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
