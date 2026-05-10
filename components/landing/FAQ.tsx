'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How does ContentForge AI work?',
    a: 'ContentForge AI uses Claude AI (by Anthropic) to generate high-quality marketing content. You simply choose your content type, describe your business, select a tone, and our AI generates professional content in seconds.',
  },
  {
    q: 'Do I need any copywriting experience?',
    a: 'None at all! ContentForge is designed for small business owners, not marketing experts. If you can describe your business, the AI handles everything else.',
  },
  {
    q: 'How many generations do I get on the free plan?',
    a: 'The free plan includes 10 generations per month. This resets on the 1st of every month. Upgrade to Pro for unlimited generations.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: "Yes, absolutely. You can cancel your Pro or Business subscription at any time from your billing settings. You'll continue to have access until the end of your billing period.",
  },
  {
    q: 'Is the generated content unique?',
    a: 'Yes! Every piece of content is freshly generated based on your specific inputs. No two generations are exactly alike, and the content is original to your business.',
  },
  {
    q: 'What content types can I generate?',
    a: 'You can generate Instagram captions, Facebook posts, TikTok captions, product descriptions, email marketing copy, blog articles, and Google/Meta ad copy.',
  },
  {
    q: 'Does the AI understand different industries?',
    a: "Yes! ContentForge includes templates for restaurants, fitness, real estate, beauty salons, e-commerce, agencies, cafes, and coaching. You can also use any custom business type.",
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All data is encrypted in transit and at rest. We use Supabase (backed by AWS) for secure storage. We never share your content with third parties.',
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
        id={`faq-${index}`}
      >
        <span className="font-medium text-sm">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 ml-4 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold">
            Frequently asked{' '}
            <span className="text-gradient">questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about ContentForge AI
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
