'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, X, Zap, Star } from 'lucide-react'
import { PLANS } from '@/lib/stripe/config'

export function Pricing() {
  const plans = [
    { key: 'free', ...PLANS.free, popular: false },
    { key: 'pro', ...PLANS.pro, popular: true },
    { key: 'business', ...PLANS.business, popular: false },
  ]

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium mb-6">
            Simple Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Start free.{' '}
            <span className="text-gradient">Scale as you grow.</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'border-brand-500 bg-brand-500/5 shadow-2xl shadow-brand-500/10 scale-105'
                  : 'border-border bg-card hover:border-brand-500/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold">
                    <Star className="w-3 h-3 fill-white" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>

                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground mb-1">/month</span>
                  )}
                </div>

                {plan.generationsPerMonth === Infinity ? (
                  <p className="text-sm text-brand-500 font-medium mt-1">
                    ∞ Unlimited generations
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.generationsPerMonth} generations/month
                  </p>
                )}
              </div>

              <Link
                href={plan.price === 0 ? '/signup' : `/signup?plan=${plan.key}`}
                id={`pricing-cta-${plan.key}`}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all mb-6 ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:opacity-90 glow-sm'
                    : 'border border-border hover:bg-accent'
                }`}
              >
                {plan.price === 0 ? 'Get Started Free' : `Start ${plan.name}`}
                {plan.popular && <Zap className="w-3.5 h-3.5" />}
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded?.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          All plans include 14-day free trial for paid features. No credit card required to start.
        </motion.p>
      </div>
    </section>
  )
}
