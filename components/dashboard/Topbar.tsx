'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, User, Wand2, Menu, X, LayoutDashboard, BookmarkCheck, LayoutTemplate, CreditCard, Settings } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { createClient } from '@/lib/supabase/client'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/generate': 'Generate Content',
  '/saved': 'Saved Content',
  '/templates': 'Templates',
  '/billing': 'Billing',
  '/settings': 'Settings',
  '/admin': 'Admin',
}

const mobileNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/generate', icon: Wand2, label: 'Generate' },
  { href: '/saved', icon: BookmarkCheck, label: 'Saved' },
  { href: '/templates', icon: LayoutTemplate, label: 'Templates' },
  { href: '/billing', icon: CreditCard, label: 'Billing' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Topbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const pageTitle = PAGE_TITLES[pathname] || 'ContentForge'
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <h1 className="font-semibold text-sm hidden md:block">{pageTitle}</h1>

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />

          <button
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all relative"
            aria-label="Notifications"
            id="notifications-btn"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
          </button>

          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-all"
            id="user-profile-btn"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-blue-400 flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-medium hidden sm:block max-w-24 truncate">
              {userName}
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="relative w-64 bg-card border-r border-border h-full flex flex-col z-50">
            <div className="p-4 border-b border-border font-bold text-sm">
              Content<span className="text-gradient">Forge</span>
            </div>
            <div className="flex-1 py-4 px-2 space-y-1">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
