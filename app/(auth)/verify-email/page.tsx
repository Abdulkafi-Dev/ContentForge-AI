import Link from 'next/link'
import { Zap, Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">
            Content<span className="text-gradient">Forge</span>
          </span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Check your email</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We&apos;ve sent you a verification email. Click the link in the email to verify your account and get started with ContentForge AI.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder, or{' '}
            <Link href="/signup" className="text-primary hover:underline">
              try again
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
