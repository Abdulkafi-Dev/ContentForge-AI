import { createClient } from '@/lib/supabase/server'
import { 
  Wand2, 
  BookmarkCheck, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Sparkles,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

async function getDashboardData(userId: string) {
  const supabase = await createClient()
  
  const [
    { count: totalGenerations },
    { count: savedContent },
    { count: thisMonthGenerations },
    { data: recentGenerations }
  ] = await Promise.all([
    supabase.from('generations').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('generations').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_saved', true),
    supabase.from('generations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('generations').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5)
  ])

  return {
    totalGenerations: totalGenerations || 0,
    savedContent: savedContent || 0,
    thisMonthGenerations: thisMonthGenerations || 0,
    recentGenerations: recentGenerations || []
  }
}

const getBadgeColor = (type: string) => {
  switch (type) {
    case 'blog_article': return 'bg-purple-500/10 text-purple-500'
    case 'product_description': return 'bg-blue-500/10 text-blue-500'
    case 'ad_copy': return 'bg-orange-500/10 text-orange-500'
    case 'instagram': return 'bg-pink-500/10 text-pink-500'
    default: return 'bg-brand-500/10 text-brand-500'
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch role and dashboard data
  const [{ data: profile }, data] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    getDashboardData(user.id)
  ])

  const isAdmin = profile?.role === 'admin' || user.email === 'admin@contentforge.com'
  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'there'

  const stats = [
    { label: 'Total Generations', value: data.totalGenerations, icon: Wand2, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Saved Content', value: data.savedContent, icon: BookmarkCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'This Month', value: data.thisMonthGenerations, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Content Types', value: new Set(data.recentGenerations.map((g: any) => g.content_type)).size, icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Good to see you, {firstName}! 👋</h2>
          <p className="text-muted-foreground text-sm mt-1">Here&apos;s what&apos;s happening with your content today.</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold hover:bg-red-500/20 transition-all"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
          <Link
            href="/generate"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Generate Content
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur hover:border-brand-500/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Generations</h3>
          <Link href="/saved" className="text-sm text-muted-foreground hover:text-brand-500 transition-colors flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4">
          {data.recentGenerations.length > 0 ? (
            data.recentGenerations.map((gen: any) => (
              <Link 
                key={gen.id} 
                href={`/saved?id=${gen.id}`}
                className="p-5 rounded-2xl border border-border bg-card/50 backdrop-blur flex flex-col gap-3 group hover:border-brand-500/30 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getBadgeColor(gen.content_type)}`}>
                    {gen.content_type.replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 pr-8 leading-relaxed">
                  {gen.output}
                </p>

                <div className="absolute right-5 bottom-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))
          ) : (
            <div className="p-12 rounded-2xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Wand2 className="w-6 h-6 text-muted-foreground opacity-20" />
              </div>
              <p className="text-sm font-medium">No content generated yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your recent creations will appear here</p>
              <Link href="/generate" className="mt-4 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all">
                Create your first content
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
