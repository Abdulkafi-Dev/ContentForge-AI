import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ContentForge AI — AI Content Generator for Small Businesses',
    template: '%s | ContentForge AI',
  },
  description:
    'Generate Instagram captions, Facebook posts, TikTok content, blog articles, ad copy, and more — powered by AI. Built for small businesses.',
  keywords: [
    'AI content generator',
    'Instagram captions AI',
    'social media content',
    'small business marketing',
    'AI marketing tool',
    'content creation',
  ],
  authors: [{ name: 'ContentForge AI' }],
  creator: 'ContentForge AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'ContentForge AI — AI Content Generator for Small Businesses',
    description:
      'Generate Instagram captions, Facebook posts, blog articles, ad copy, and more in seconds. Powered by Claude AI.',
    siteName: 'ContentForge AI',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ContentForge AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContentForge AI — AI Content Generator',
    description: 'Generate marketing content in seconds with AI',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
