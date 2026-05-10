const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const key = identifier

  const existing = rateLimitMap.get(key)

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetIn: windowMs }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: existing.resetTime - now,
    }
  }

  existing.count++
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetIn: existing.resetTime - now,
  }
}
