'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Trash2,
  Copy,
  BookmarkCheck,
  Filter,
  CheckCheck,
  Wand2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { CONTENT_TYPE_LABELS, CONTENT_TYPE_ICONS, ContentType } from '@/types/generation'
import { EmptyState } from '@/components/shared/EmptyState'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'

interface Generation {
  id: string
  content_type: ContentType
  output: string
  created_at: string
  is_saved: boolean
}

const ALL_TYPES = [
  { value: '', label: 'All Types' },
  ...Object.entries(CONTENT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
]

export default function SavedPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ saved: 'true' })
      if (typeFilter) params.set('type', typeFilter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/content/list?${params}`)
      const data = await res.json()
      setGenerations(data.data || [])
    } catch {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter])

  useEffect(() => {
    const timer = setTimeout(fetchContent, 300)
    return () => clearTimeout(timer)
  }, [fetchContent])

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/content/delete?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setGenerations((prev) => prev.filter((g) => g.id !== id))
      toast.success('Content deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success('Copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Saved Content</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your saved generations — organized and searchable
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="saved-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your content..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none cursor-pointer"
          >
            {ALL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : generations.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="No saved content yet"
          description="Generate content and save it to build your personal content library."
          action={
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              <Wand2 className="w-4 h-4" />
              Generate Content
            </Link>
          }
        />
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {generations.map((gen) => (
              <motion.div
                key={gen.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-5 rounded-2xl border border-border bg-card hover:border-brand-500/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CONTENT_TYPE_ICONS[gen.content_type]}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500">
                      {CONTENT_TYPE_LABELS[gen.content_type]}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {gen.output}
                </p>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(gen.output, gen.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-all"
                  >
                    {copiedId === gen.id ? (
                      <><CheckCheck className="w-3.5 h-3.5 text-green-500" /> Copied</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy</>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(gen.id)}
                    id={`delete-${gen.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
