'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-purple-500/10 to-blue-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-sm font-medium">
            <Zap className="w-3.5 h-3.5" />
            Get Started Today — Free Forever Plan
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold leading-tight">
            Your competitors are{' '}
            <span className="text-gradient">already using AI.</span>
            <br />
            Are you?
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join 2,000+ small businesses generating more content, faster, with better results.
            Start for free — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/signup"
              id="final-cta-signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 glow"
            >
              Start Generating for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border hover:bg-card transition-all font-medium text-lg"
            >
              View Pricing
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Free plan: 10 generations/month • No credit card required • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
