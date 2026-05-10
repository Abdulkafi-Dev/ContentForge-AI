import { cn } from '@/lib/utils/cn'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="shimmer-line h-4 rounded-md" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted shimmer-line" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded shimmer-line w-1/3" />
          <div className="h-3 bg-muted rounded shimmer-line w-1/2" />
        </div>
      </div>
      <LoadingSkeleton lines={3} />
      <div className="flex gap-2">
        <div className="h-9 bg-muted rounded-lg shimmer-line flex-1" />
        <div className="h-9 bg-muted rounded-lg shimmer-line w-20" />
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-muted rounded shimmer-line w-24" />
        <div className="w-8 h-8 bg-muted rounded-lg shimmer-line" />
      </div>
      <div className="h-8 bg-muted rounded shimmer-line w-16 mb-1" />
      <div className="h-3 bg-muted rounded shimmer-line w-20" />
    </div>
  )
}
