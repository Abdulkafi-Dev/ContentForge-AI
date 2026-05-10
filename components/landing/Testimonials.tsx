'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Owner, Bloom Beauty Studio',
    avatar: '👩‍🦰',
    content:
      "I used to spend 3 hours every Sunday writing captions for the week. Now it takes me 15 minutes with ContentForge. The captions actually sound like me — not a robot. My engagement has gone up 40%!",
    rating: 5,
    highlight: 'engagement up 40%',
  },
  {
    name: 'Marcus Johnson',
    role: 'CEO, FitLife Coaching',
    avatar: '🏋️',
    content:
      "As a fitness coach, I need content that motivates. ContentForge nails the tone every single time. The blog articles it writes are better than anything I could produce, and they rank on Google too!",
    rating: 5,
    highlight: 'blog articles rank on Google',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, Spice Garden Restaurant',
    avatar: '👩‍🍳',
    content:
      "Our restaurant had zero social media presence before ContentForge. Now we post daily. The captions drive real foot traffic. Last month we got 3 new table bookings directly from Instagram!",
    rating: 5,
    highlight: '3 new bookings from Instagram',
  },
  {
    name: 'David Chen',
    role: 'Director, Chen Realty Group',
    avatar: '🏠',
    content:
      "Property listing descriptions used to take me 45 minutes each. Now they're done in seconds and honestly sound more professional than what I wrote. Closed 2 extra deals this month alone.",
    rating: 5,
    highlight: '2 extra deals this month',
  },
  {
    name: 'Amara Williams',
    role: 'Owner, Glow Skincare Co.',
    avatar: '✨',
    content:
      "I launched my skincare brand 3 months ago with no marketing budget. ContentForge is my entire marketing team. The email campaigns convert at 18% — my friends with agencies can't even match that.",
    rating: 5,
    highlight: '18% email conversion rate',
  },
  {
    name: 'Tom Rivera',
    role: 'Founder, Rivera Digital Agency',
    avatar: '💻',
    content:
      "We use ContentForge for all our client work now. It's a massive time saver and the quality is consistently excellent. The Business plan pays for itself after just one client project.",
    rating: 5,
    highlight: 'pays for itself instantly',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
            ★★★★★ Loved by Small Businesses
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Real results from{' '}
            <span className="text-gradient">real businesses</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Join 2,000+ small business owners growing with ContentForge AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, s) => (
                  <span key={s} className="text-amber-400">★</span>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-medium mb-4">
                🎯 {t.highlight}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-blue-400 flex items-center justify-center text-lg">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
