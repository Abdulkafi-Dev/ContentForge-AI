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

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        plan,
        status,
        stripe_customer_id,
        stripe_subscription_id,
        current_period_end,
        created_at,
        profiles (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const summary = {
      free: 0,
      pro: 0,
      business: 0,
      total: subscriptions?.length || 0,
      mrr: 0,
    }

    subscriptions?.forEach((sub) => {
      if (sub.plan === 'pro') { summary.pro++; summary.mrr += 29 }
      else if (sub.plan === 'business') { summary.business++; summary.mrr += 79 }
      else summary.free++
    })

    return NextResponse.json({ subscriptions, summary })
  } catch (error) {
    console.error('Admin subscriptions error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }
}
