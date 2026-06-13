import { NextRequest } from 'next/server'

const store = new Map<string, { count: number; timestamp: number }>()

export function checkRateLimit(
  ip: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const record = store.get(ip)
  if (!record || now - record.timestamp > windowMs) {
    store.set(ip, { count: 1, timestamp: now })
    return true
  }
  if (record.count >= maxRequests) return false
  store.set(ip, { count: record.count + 1, timestamp: record.timestamp })
  return true
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
