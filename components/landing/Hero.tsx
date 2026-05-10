'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

const TYPING_WORDS = ['Instagram Captions', 'Blog Articles', 'Ad Copy', 'Email Campaigns', 'TikTok Content', 'Product Descriptions']

function TypingWords() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = TYPING_WORDS[index]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60)
    } else if (!isDeleting && displayed.length === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setIndex((i) => (i + 1) % TYPING_WORDS.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, index])

  return (
    <span className="text-gradient">
      {displayed}
      <span className="animate-typing-cursor">|</span>
    </span>
  )
}

import { useState, useEffect } from 'react'

const demoContent = {
  type: 'Instagram Caption',
  icon: '📸',
  output: `✨ Transform your mornings with our signature cold brew. ☕

Every sip is crafted with love — 12-hour slow-steeped, perfectly balanced, never bitter.

Whether you're crushing deadlines or chasing dreams, we've got your back.

Limited batch available this weekend only! 🔥

👇 Tag someone who needs this in their life

#ColdBrew #MorningVibes #CoffeeLover #LocalCafe #SmallBusiness #ArtisanCoffee #CoffeeTime #CaffeineAddict`,
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Claude AI
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight">
              Generate{' '}
              <br />
              <TypingWords />
              <br />
              <span className="text-foreground">in Seconds</span>
            </h1>

            <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-lg">
              ContentForge AI creates{' '}
              <strong className="text-foreground">scroll-stopping content</strong> for your
              small business. No copywriter needed. Just describe your business and let AI do
              the rest.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/signup"
              id="hero-cta-signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-all hover:scale-105 glow-sm"
            >
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              id="hero-cta-features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-medium text-base transition-all"
            >
              <Play className="w-4 h-4" />
              See How It Works
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-6 pt-4"
          >
            <div className="flex -space-x-2">
              {['🧑‍💼', '👩‍🍳', '💪', '🏠'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-blue-400 border-2 border-background flex items-center justify-center text-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Loved by <strong className="text-foreground">2,000+</strong> small businesses
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column — Demo UI */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 ml-3 bg-background/50 rounded-md h-6 flex items-center px-3">
                <span className="text-xs text-muted-foreground">app.contentforge.ai/generate</span>
              </div>
            </div>

            {/* App content preview */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="text-2xl">{demoContent.icon}</div>
                <div>
                  <p className="font-semibold text-sm">{demoContent.type}</p>
                  <p className="text-xs text-muted-foreground">Local Coffee Shop • Casual & Friendly</p>
                </div>
                <div className="ml-auto px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                  Generated ✓
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Generated Content</p>
                <div className="bg-muted/50 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                  {demoContent.output}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                  Copy Content
                </button>
                <button className="flex-1 py-2 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                  Save
                </button>
                <button className="flex-1 py-2 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-xs font-medium"
          >
            <span className="text-green-500">⚡ Generated in 2.1s</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-xs font-medium"
          >
            <span>🎯 98% engagement rate</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
