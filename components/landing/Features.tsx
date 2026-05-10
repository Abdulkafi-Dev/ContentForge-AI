'use client'

import { motion } from 'framer-motion'
import {
  Camera,
  FileText,
  Mail,
  Megaphone,
  Zap,
  Brain,
  Copy,
  BookOpen,
} from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'Social Media Captions',
    description:
      'Generate viral Instagram, Facebook, and TikTok captions that drive engagement and grow your following — automatically.',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: BookOpen,
    title: 'Blog Article Writing',
    description:
      'Create SEO-optimized blog articles that rank on Google and establish you as an authority in your industry.',
    color: 'from-brand-500 to-purple-500',
    bg: 'bg-brand-500/10',
  },
  {
    icon: Megaphone,
    title: 'Google & Meta Ad Copy',
    description:
      'Write high-converting ad headlines and descriptions that maximize your ROAS and drive real business results.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Mail,
    title: 'Email Marketing Copy',
    description:
      'Craft email campaigns with irresistible subject lines and compelling body copy that drives opens, clicks, and sales.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: FileText,
    title: 'Product Descriptions',
    description:
      'Write persuasive product descriptions that highlight benefits, overcome objections, and convert browsers into buyers.',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Brain,
    title: 'AI Tone Customization',
    description:
      'Choose from Professional, Casual, Witty, Luxurious, and more. Your content always sounds exactly like your brand.',
    color: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Generation',
    description:
      'Get high-quality content in under 3 seconds. Stop spending hours writing. Let AI handle the heavy lifting.',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Copy,
    title: 'Copy, Export & Save',
    description:
      'One-click copy, export to PDF or TXT, and save your best content to your personal library for future use.',
    color: 'from-teal-500 to-cyan-500',
    bg: 'bg-teal-500/10',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-sm font-medium mb-6">
            Everything You Need
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            One platform,{' '}
            <span className="text-gradient">infinite content</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop juggling multiple tools. ContentForge AI handles every type of marketing
            content your business needs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 cursor-default"
            >
              <div
                className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <feature.icon
                  className={`w-5 h-5 bg-gradient-to-r ${feature.color} bg-clip-text`}
                  style={{ color: 'transparent' }}
                />
                <feature.icon className="w-5 h-5 absolute opacity-100" style={{ color: feature.color.includes('pink') ? '#ec4899' : feature.color.includes('brand') ? '#8b5cf6' : feature.color.includes('amber') ? '#f59e0b' : feature.color.includes('blue') ? '#3b82f6' : feature.color.includes('green') ? '#10b981' : feature.color.includes('purple') ? '#a855f7' : feature.color.includes('yellow') ? '#eab308' : '#14b8a6' }} />
              </div>

              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
