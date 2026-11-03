import { expect, test } from 'vitest'
import { activeStops, dayKey, followUpState, heldBySize, openingHeldTotal, openOrdersNeed, remitTotals, thresholdOf, unresolvedFailed } from './derive'
import { normalize } from './store'
import { seed } from './seed'
import { SIZES } from './types'
import { NOW } from './testkit'

const d = seed(NOW)
const yday = dayKey(NOW - 86_400_000)

test('seed is deterministic and ids are unique FG-####', () => {
  expect(JSON.stringify(seed(NOW))).toBe(JSON.stringify(d))
  expect(new Set(d.orders.map((o) => o.id)).size).toBe(d.orders.length)
  expect(d.orders.every((o) => /^FG-\d{4,}$/.test(o.id))).toBe(true)
})
test('yesterday: r1 unexplained shortage, r2 explained', () => {
  const r1 = remitTotals(d, 'r1', yday), r2 = remitTotals(d, 'r2', yday)
  expect(r1.open).toBe(true)
  expect(d.orders.some((o) => o.riderId === 'r1' && dayKey(o.deliveredAt ?? 0) === yday && o.cashCollected! < o.amount && !o.shortReason && o.payment === 'cod')).toBe(true)
  expect(d.orders.some((o) => o.riderId === 'r2' && o.shortReason)).toBe(true)
  expect(r2.expectedCash).toBeGreaterThan(0)
})
test('low 11kg stock, per-size holdings, stops, failed and follow-up states', () => {
  expect(d.stocks.b1.full['11kg']).toBeLessThan(thresholdOf(d, 'b1', '11kg'))
  expect(d.stocks.b1.full['22kg']).toBeGreaterThan(thresholdOf(d, 'b1', '22kg'))
  expect(openOrdersNeed(d)['11kg'].qty + openOrdersNeed(d)['22kg'].qty).toBeGreaterThan(0)
  SIZES.forEach((s) => expect(heldBySize(d)[s].cylinders).toBeGreaterThan(0))
  expect(Object.values(openingHeldTotal(d)).reduce((a, b) => a + (b ?? 0), 0)).toBe(d.customers.reduce((a, c) => a + c.heldCylinders, 0))
  expect(activeStops(d, 'r1').map((o) => o.stopSeq)).toEqual([1, 2, 3])
  const f = unresolvedFailed(d)
  expect(f).toHaveLength(1); expect(f[0].nextAttempt!).toBeGreaterThan(NOW)
  expect(d.followUps.filter((x) => x.snoozedUntil! > NOW)).toHaveLength(1)
  expect(followUpState(d, d.followUps[4].customerId, NOW).snoozed).toBe(true)
  expect(d.followUps.some((x) => x.callbackAt! > NOW)).toBe(true)
})
test('normalize upgrades a v1-shaped snapshot and rejects garbage', () => {
  const v1 = JSON.parse(JSON.stringify(d))
  for (const k of ['loadouts', 'thresholds', 'openingHeldBySize']) delete v1[k]
  v1.customers.forEach((c: { heldBySize?: unknown }) => delete c.heldBySize)
  const n = normalize(v1)
  expect(n.loadouts).toEqual([]); expect(n.thresholds).toBeTruthy(); expect(n.customers[0].heldBySize).toBeTruthy()
  expect(() => normalize({})).toThrow()
})
