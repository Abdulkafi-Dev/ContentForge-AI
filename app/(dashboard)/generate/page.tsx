'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2,
  Copy,
  RotateCcw,
  BookmarkCheck,
  Download,
  Loader2,
  CheckCheck,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ContentType,
  CONTENT_TYPE_LABELS,
  CONTENT_TYPE_ICONS,
  TONE_OPTIONS,
} from '@/types/generation'
import { exportToPDF, exportToTXT } from '@/lib/utils/export'
import { InteractiveEditor } from '@/components/interactive-editor'

const CONTENT_TYPES: ContentType[] = [
  'instagram',
  'facebook',
  'tiktok',
  'product_description',
  'email_marketing',
  'blog_article',
  'ad_copy',
]



export default function GeneratePage() {
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('type') as ContentType) || 'instagram'

  const [contentType, setContentType] = useState<ContentType>(initialType)
  const [businessType, setBusinessType] = useState('')
  const [productService, setProductService] = useState('')
  const [tone, setTone] = useState('Professional')
  const [targetAudience, setTargetAudience] = useState('')
  const [keywords, setKeywords] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')

  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showExport, setShowExport] = useState(false)

  const handleGenerate = async () => {
    if (!businessType.trim() || !productService.trim()) {
      toast.error('Please fill in Business Type and Product/Service fields')
      return
    }

    setLoading(true)
    setGeneratedContent('')
    setSaved(false)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          businessType,
          productService,
          tone,
          targetAudience,
          keywords,
          additionalInstructions,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.upgradeRequired) {
          toast.error(data.error, {
            action: {
              label: 'Upgrade Now',
              onClick: () => window.location.href = '/billing',
            },
          })
        } else {
          toast.error(data.error || 'Generation failed')
        }
        return
      }

      setGeneratedContent(data.content)
      setGenerationId(data.generationId)
      toast.success('Content generated! ✨')
    } catch {
      toast.error('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!generationId) return
    const res = await fetch('/api/content/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generationId }),
    })
    if (res.ok) {
      setSaved(true)
      toast.success('Content saved to library!')
    } else {
      toast.error('Failed to save content')
    }
  }

  const handleExportPDF = () => exportToPDF(generatedContent, `contentforge-${contentType}`)
  const handleExportTXT = () => exportToTXT(generatedContent, `contentforge-${contentType}`)

  return (
    <div className="max-w-6xl">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Generate Content</h2>
            <p className="text-sm text-muted-foreground">
              Fill in the details below and let AI create your content
            </p>
          </div>

          {/* Content Type Selector */}
          <div>
            <label className="block text-sm font-medium mb-3">Content Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type}
                  id={`content-type-${type}`}
                  onClick={() => setContentType(type)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                    contentType === type
                      ? 'border-brand-500 bg-brand-500/10 text-brand-500'
                      : 'border-border hover:border-brand-500/50 hover:bg-accent'
                  }`}
                >
                  <span className="text-base">{CONTENT_TYPE_ICONS[type]}</span>
                  {CONTENT_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium mb-1.5">
                Business Type <span className="text-red-500">*</span>
              </label>
              <input
                id="businessType"
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. Fitness Studio, Coffee Shop, Real Estate Agency"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="productService" className="block text-sm font-medium mb-1.5">
                Product / Service <span className="text-red-500">*</span>
              </label>
              <input
                id="productService"
                type="text"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                placeholder="e.g. Personal Training Sessions, Specialty Cold Brew Coffee"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-medium mb-1.5">
                Tone of Voice
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium mb-1.5">
                Target Audience
              </label>
              <input
                id="targetAudience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Women aged 25-40 who love fitness"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium mb-1.5">
                Keywords
              </label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. organic, handcrafted, sustainable, local"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="additionalInstructions" className="block text-sm font-medium mb-1.5">
                Additional Instructions
              </label>
              <textarea
                id="additionalInstructions"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="Any specific details, promotions, or requirements..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            id="generate-btn"
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Content
              </>
            )}
          </button>
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Generated Content</h3>
            {generatedContent && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowExport(!showExport)}
                    id="export-btn"
                    className="p-2 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                    title="Export"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {showExport && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10"
                      >
                        <button
                          onClick={() => { handleExportPDF(); setShowExport(false) }}
                          className="w-full px-3 py-2.5 text-xs text-left hover:bg-accent transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Export PDF
                        </button>
                        <button
                          onClick={() => { handleExportTXT(); setShowExport(false) }}
                          className="w-full px-3 py-2.5 text-xs text-left hover:bg-accent transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Export TXT
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={handleCopy}
                  id="copy-btn"
                  className="p-2 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                  title="Copy"
                >
                  {copied ? <CheckCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  id="regenerate-btn"
                  className="p-2 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                  title="Regenerate"
                >
                  <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleSave}
                  disabled={saved}
                  id="save-btn"
                  className={`p-2 rounded-lg border transition-all ${
                    saved
                      ? 'border-green-500/30 bg-green-500/10 text-green-500'
                      : 'border-border hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                  title="Save"
                >
                  <BookmarkCheck className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="min-h-96 rounded-2xl border border-border bg-card p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
                  <Wand2 className="w-5 h-5 text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Crafting your content...</p>
                  <p className="text-xs text-muted-foreground mt-1">Claude AI is writing for you</p>
                </div>
              </div>
            ) : generatedContent ? (
              <InteractiveEditor value={generatedContent} onChange={setGeneratedContent} />
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl">
                  {CONTENT_TYPE_ICONS[contentType]}
                </div>
                <div>
                  <p className="font-medium text-sm">Your content will appear here</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fill in the form and click &ldquo;Generate Content&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>

          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 rounded-xl border border-border hover:bg-accent text-sm font-medium flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  saved
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save to Library'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
