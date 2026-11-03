import type { Size } from './types'

export const DAY = 86_400_000
export const GRACE_DAYS = 3
export const REMIND_DAYS = 3
const SIZE_DEFAULT: Record<Size, number> = { '11kg': 35, '22kg': 20, '50kg': 12 }

export type RefillStatus = 'new' | 'ok' | 'due' | 'overdue'
export interface Refill {
  cycleDays: number
  source: 'default' | 'first' | 'average'
  firstToSecond?: number
  expectedNext: number
  daysUntil: number
  status: RefillStatus
}

/**
 * Refill-cycle rules (PRD):
 * 1 order  -> default cycle (area average, else cylinder-size default)
 * 2 orders -> first real cycle (also tracked as first-to-second interval)
 * 3+       -> average of all intervals
 * expected next = last order + cycle; overdue once past it by GRACE_DAYS; due inside REMIND_DAYS.
 */
export function computeRefill(deliveredAt: number[], size: Size, areaAvg: number | undefined, now: number): Refill | null {
  const t = [...deliveredAt].sort((a, b) => a - b)
  if (!t.length) return null
  const gaps = t.slice(1).map((x, i) => (x - t[i]) / DAY)
  const cycleDays = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : areaAvg ?? SIZE_DEFAULT[size]
  const expectedNext = t[t.length - 1] + cycleDays * DAY
  const daysUntil = (expectedNext - now) / DAY
  const status: RefillStatus = daysUntil <= -GRACE_DAYS ? 'overdue' : daysUntil <= REMIND_DAYS ? 'due' : 'ok'
  return {
    cycleDays,
    source: !gaps.length ? 'default' : gaps.length === 1 ? 'first' : 'average',
    firstToSecond: gaps[0],
    expectedNext,
    daysUntil,
    status,
  }
}
