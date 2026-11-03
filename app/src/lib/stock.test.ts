import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { heldBySize, loadoutRecon, openOrdersNeed, activeStops, followUpIndicator } from './derive'
import { DEPOSIT } from './geo'
import { actions, getDB } from './store'
import { fixture, NOW, ord, POD, TODAY } from './testkit'

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(NOW) })
afterEach(() => vi.useRealTimers())

const deliver = (id: string, emptiesReturned: number) => actions.deliver(id, { pod: POD, cashReceived: 880, emptiesReturned })
const held = (id = 'c1') => getDB().customers.find((c) => c.id === id)!

test('delivery deducts full, adds returned empties, records a movement', () => {
  fixture([ord('FG-1')])
  deliver('FG-1', 1)
  expect(getDB().stocks.b1.full['11kg']).toBe(19)
  expect(getDB().stocks.b1.empty['11kg']).toBe(9)
  expect(getDB().movements[0]).toMatchObject({ kind: 'delivery', full: -1, empty: 1, orderId: 'FG-1', riderId: 'r1' })
})

test('expected empties: swap = qty, new tank = 0', () => {
  fixture([ord('FG-1', { qty: 2 }), ord('FG-2', { type: 'new' })])
  deliver('FG-1', 2); deliver('FG-2', 0)
  expect(getDB().orders.map((o) => o.emptiesExpected)).toEqual([2, 0])
})

test('short empties raise customer-held by size; excess lowers it, never below zero', () => {
  fixture([ord('FG-1', { qty: 2 }), ord('FG-2'), ord('FG-3', { customerId: 'c2', size: '22kg' })])
  deliver('FG-1', 0)
  expect(held().heldBySize).toEqual({ '11kg': 3 }); expect(held().heldCylinders).toBe(3)
  deliver('FG-2', 5)
  expect(held().heldBySize).toEqual({ '11kg': 0 })
  actions.deliver('FG-3', { pod: POD, cashReceived: 880, emptiesReturned: 3 })
  expect(held('c2').heldBySize?.['22kg']).toBe(0)
})

test('delivery cannot take stock below zero', () => {
  fixture([ord('FG-1', { qty: 3 })], { stocks: { b1: { full: { '11kg': 2, '22kg': 0, '50kg': 0 }, empty: { '11kg': 0, '22kg': 0, '50kg': 0 } } } })
  expect(() => deliver('FG-1', 3)).toThrow(/stock/i)
  expect(getDB().stocks.b1.full['11kg']).toBe(2)
})

test('load-out deducts stock, return adds it, mismatch is detectable; deliveries from the truck do not double count', () => {
  fixture([ord('FG-1')])
  expect(() => actions.loadOut('r1', TODAY, { '11kg': { full: 99, empty: 0 } })).toThrow(/enough/i)
  actions.loadOut('r1', TODAY, { '11kg': { full: 5, empty: 2 } })
  expect(getDB().stocks.b1.full['11kg']).toBe(15); expect(getDB().stocks.b1.empty['11kg']).toBe(6)
  expect(() => actions.loadOut('r1', TODAY, { '11kg': { full: 1, empty: 0 } })).toThrow(/already/i)
  deliver('FG-1', 1)
  expect(getDB().stocks.b1.full['11kg']).toBe(15) // already off the depot shelf
  expect(getDB().movements[0].onTruck).toBe(true)
  actions.returnLoad('r1', TODAY, { '11kg': { full: 3, empty: 3 } }) // expected 4 full, 3 empty
  expect(getDB().stocks.b1.full['11kg']).toBe(18)
  expect(() => actions.returnLoad('r1', TODAY, { '11kg': { full: 1, empty: 0 } })).toThrow(/already/i)
  const rec = loadoutRecon(getDB(), getDB().loadouts![0])['11kg']!
  expect(rec).toMatchObject({ mismatch: true, diff: { full: -1, empty: 0 } })
  expect(getDB().movements.filter((m) => m.kind === 'load-out' || m.kind === 'load-return')).toHaveLength(2)
})

test('return needs a prior load-out', () => {
  fixture()
  expect(() => actions.returnLoad('r1', TODAY, { '11kg': { full: 1, empty: 0 } })).toThrow(/load-out/i)
})

test('physical adjustment sets exact counts and requires a reason', () => {
  fixture()
  expect(() => actions.adjust('b1', '11kg', { fullCount: 18, emptyCount: 8, reason: ' ' })).toThrow(/reason/i)
  expect(() => actions.adjust('b1', '11kg', { fullCount: -1, emptyCount: 8, reason: 'x' })).toThrow()
  actions.adjust('b1', '11kg', { fullCount: 18, emptyCount: 9, reason: 'Recount' })
  expect(getDB().stocks.b1.full['11kg']).toBe(18)
  expect(getDB().movements[0]).toMatchObject({ kind: 'adjustment', full: -2, empty: 1, reason: 'Recount' })
})

test('supplier receipt adds full, subtracts empties handed back, records DR and note', () => {
  fixture()
  expect(() => actions.stockIn('b1', '11kg', 10, { drNumber: '', emptiesHandedBack: 0 })).toThrow(/DR/)
  expect(() => actions.stockIn('b1', '11kg', 10, { drNumber: 'DR-1', emptiesHandedBack: 9 })).toThrow(/empty/i)
  expect(() => actions.stockIn('b1', '11kg', 0, { drNumber: 'DR-1', emptiesHandedBack: 0 })).toThrow()
  actions.stockIn('b1', '11kg', 10, { drNumber: 'DR-1', emptiesHandedBack: 6, mismatchNote: '2 short' })
  expect(getDB().stocks.b1).toMatchObject({ full: { '11kg': 30 }, empty: { '11kg': 2 } })
  expect(getDB().movements[0]).toMatchObject({ kind: 'stock-in', drNumber: 'DR-1', full: 10, empty: -6, emptiesHandedBack: 6, reason: '2 short' })
})

test('heldBySize uses per-size holdings, falls back to size+held, estimate = count x deposit', () => {
  fixture()
  const d = structuredClone(getDB())
  d.customers = [
    { ...d.customers[0], id: 'a', size: '11kg', heldCylinders: 2, heldBySize: undefined },
    { ...d.customers[0], id: 'b', size: '22kg', heldCylinders: 9, heldBySize: { '22kg': 1, '50kg': 1 } },
  ]
  const h = heldBySize(d)
  expect(h['11kg']).toEqual({ cylinders: 2, depositEstimate: 2 * DEPOSIT['11kg'], customers: 1 })
  expect(h['22kg'].cylinders).toBe(1); expect(h['50kg'].cylinders).toBe(1)
})

test('openOrdersNeed counts placed, assigned and out-for-delivery and computes shortfall', () => {
  const d = fixture([
    ord('1', { status: 'Placed', qty: 4 }), ord('2', { status: 'Assigned', qty: 3 }), ord('3'), ord('4', { status: 'Delivered' }), ord('5', { status: 'Cancelled', qty: 9 }), ord('6', { status: 'Failed' }),
  ], { stocks: { b1: { full: { '11kg': 5, '22kg': 0, '50kg': 0 }, empty: { '11kg': 0, '22kg': 0, '50kg': 0 } } } })
  expect(openOrdersNeed(d)['11kg']).toEqual({ qty: 8, fullAvailable: 5, shortfall: 3 })
  expect(openOrdersNeed(d)['22kg'].shortfall).toBe(0)
})

test('stop order, fail and requeue', () => {
  fixture([ord('A', { status: 'Assigned', stopSeq: 2 }), ord('B', { status: 'Assigned', stopSeq: 1 }), ord('C', { status: 'Assigned' })])
  expect(activeStops(getDB(), 'r1').map((o) => o.id)).toEqual(['B', 'A', 'C'])
  actions.reorderStops('r1', ['A', 'B'])
  expect(activeStops(getDB(), 'r1').map((o) => o.id)).toEqual(['A', 'B', 'C'])
  expect(() => actions.reorderStops('r1', ['A', 'A'])).toThrow()
  expect(() => actions.fail('A', { reason: 'No one home', contacted: false, nextAttempt: NOW - 1 })).toThrow(/future/i)
  expect(() => actions.fail('A', { reason: '', contacted: false, nextAttempt: NOW + 1 })).toThrow(/reason/i)
  actions.fail('A', { reason: 'No one home', contacted: false, nextAttempt: NOW + 86_400_000 })
  expect(getDB().orders[0]).toMatchObject({ status: 'Failed', failedContact: 'not-contacted' })
  expect(getDB().sms[0].text).toMatch(/next attempt/i)
  actions.requeue('A', 'r2')
  expect(getDB().orders[0]).toMatchObject({ status: 'Assigned', riderId: 'r2', nextAttempt: undefined })
})

test('follow-up rules and 7-day indicator', () => {
  fixture([ord('X', { status: 'Delivered', placedAt: NOW + 2 * 86_400_000 })])
  expect(() => actions.logFollowUp('c1', 'Call back later')).toThrow(/callback/i)
  expect(() => actions.logFollowUp('c1', 'Switched supplier')).toThrow(/lost reason/i)
  expect(() => actions.snoozeFollowUp('c1', NOW - 1)).toThrow(/future/i)
  actions.logFollowUp('c1', 'Reached')
  actions.logFollowUp('c2', 'Not interested', { lostReason: 'Price' })
  actions.snoozeFollowUp('c2', NOW + 1000)
  expect(followUpIndicator(getDB(), NOW - 1000, NOW + 1000)).toMatchObject({ contacted: 2, orderedWithin7Days: 1 })
})

test('truck deliveries cannot exceed what was loaded', () => {
  fixture([ord('A'), ord('B')])
  actions.loadOut('r1', TODAY, { '11kg': { full: 1, empty: 0 } })
  deliver('A', 1)
  expect(() => deliver('B', 1)).toThrow(/left on the truck/i)
  expect(getDB().orders[1].status).toBe('Out for delivery')
})

test('assign and startDelivery reject orders in the wrong status', () => {
  fixture([ord('D', { status: 'Delivered' }), ord('X', { status: 'Cancelled' }), ord('P', { status: 'Placed' })])
  expect(() => actions.assign('D', 'r1')).toThrow(/cannot be assigned/i)
  expect(() => actions.assign('X', 'r1')).toThrow(/cannot be assigned/i)
  expect(() => actions.startDelivery('P')).toThrow(/assigned/i)
  expect(() => actions.startDelivery('D')).toThrow(/assigned/i)
})

test('follow-up indicator keeps open 7-day windows out of "not ordered"', () => {
  fixture([])
  actions.logFollowUp('c1', 'Reached')
  expect(followUpIndicator(getDB(), NOW - 1000, NOW + 1000)).toMatchObject({ contacted: 1, pending: 1, notOrdered: 0 })
  vi.setSystemTime(NOW + 8 * 86_400_000)
  expect(followUpIndicator(getDB(), NOW - 1000, NOW + 9 * 86_400_000)).toMatchObject({ pending: 0, notOrdered: 1 })
})

test('cancel is blocked once an order is delivered (cash and stock already moved)', () => {
  fixture([ord('FG-1')])
  deliver('FG-1', 1)
  expect(() => actions.cancel('FG-1')).toThrow(/cannot be cancelled/)
  expect(getDB().orders[0].status).toBe('Delivered')
})

test('placeOrder rejects zero, negative and fractional quantities', () => {
  fixture([])
  const base = { customerId: getDB().customers[0].id, size: '11kg' as const, type: 'refill' as const, payment: 'cod' as const, channel: 'call' as const }
  for (const qty of [0, -2, 1.5, 21]) expect(() => actions.placeOrder({ ...base, qty })).toThrow(/Quantity/)
  expect(getDB().orders).toHaveLength(0)
})
