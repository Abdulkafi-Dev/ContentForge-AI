'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Palette, Trash2, Loader2, Check, Users, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function SettingsPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const [userPlan, setUserPlan] = useState<string>('free')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email || '')
        setFullName(data.user.user_metadata?.full_name || '')
      }
    })
    
    supabase.from('subscriptions').select('plan').then(({ data }) => {
      if (data?.[0]) setUserPlan(data[0].plan)
    })
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingProfile(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    })

    if (error) {
      toast.error(error.message)
    } else {
      // Also update profiles table
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({ id: user.id, full_name: fullName, email })
      }
      toast.success('Profile updated!')
    }
    setLoadingProfile(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoadingPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setLoadingPassword(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Type DELETE to confirm')
      return
    }
    toast.error('Please contact support to delete your account.')
  }

  const sections = [
    {
      id: 'profile',
      icon: User,
      title: 'Profile Information',
      description: 'Update your display name and email',
      content: (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="settings-name" className="block text-sm font-medium mb-1.5">Full Name</label>
            <input
              id="settings-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div>
            <label htmlFor="settings-email" className="block text-sm font-medium mb-1.5">Email Address</label>
            <input
              id="settings-email"
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed from here</p>
          </div>
          <button
            type="submit"
            disabled={loadingProfile}
            id="save-profile-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      ),
    },
    {
      id: 'password',
      icon: Lock,
      title: 'Change Password',
      description: 'Update your account password',
      content: (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium mb-1.5">New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-1.5">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loadingPassword}
            id="save-password-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loadingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Update Password
          </button>
        </form>
      ),
    },
    {
      id: 'appearance',
      icon: Palette,
      title: 'Appearance',
      description: 'Customize your theme preference',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      ),
    },
    {
      id: 'team',
      icon: Users,
      title: 'Team Management',
      description: 'Invite and manage your team members',
      content: userPlan === 'business' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center text-center gap-2">
            <Users className="w-8 h-8 text-muted-foreground opacity-50" />
            <div>
              <p className="text-sm font-medium">No team members yet</p>
              <p className="text-xs text-muted-foreground">Start by inviting your first collaborator</p>
            </div>
            <button className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all">
              Invite Member
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Business Plan Feature</p>
              <p className="text-xs text-muted-foreground">Collaborate with your team members in real-time</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/billing'}
            className="px-3 py-1.5 rounded-lg border border-brand-500/20 text-brand-500 text-xs font-semibold hover:bg-brand-500/10 transition-all"
          >
            Upgrade
          </button>
        </div>
      ),
    },
    {
      id: 'danger',
      icon: Trash2,
      title: 'Danger Zone',
      description: 'Irreversible account actions',
      danger: true,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Deleting your account is permanent and cannot be undone. All your content and subscription will be lost.
          </p>
          <div>
            <label htmlFor="delete-confirm" className="block text-xs text-muted-foreground mb-1.5">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              id="delete-confirm"
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-3 rounded-xl border border-red-500/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all"
            />
          </div>
          <button
            onClick={handleDeleteAccount}
            id="delete-account-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {sections.map((section, i) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`p-6 rounded-2xl border bg-card ${
            section.danger ? 'border-red-500/20' : 'border-border'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              section.danger ? 'bg-red-500/10' : 'bg-brand-500/10'
            }`}>
              <section.icon className={`w-4 h-4 ${section.danger ? 'text-red-500' : 'text-brand-500'}`} />
            </div>
            <div>
              <p className="font-semibold text-sm">{section.title}</p>
              <p className="text-xs text-muted-foreground">{section.description}</p>
            </div>
          </div>
          {section.content}
        </motion.div>
      ))}
    </div>
  )
}
