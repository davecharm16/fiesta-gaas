import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { ordersForRemit, remitTotals } from './derive'
import { actions, getDB } from './store'
import { fixture, NOW, ord, POD, TODAY, YESTERDAY } from './testkit'

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(NOW) })
afterEach(() => vi.useRealTimers())

const deliverCod = (id: string, cashReceived: number, shortReason?: string) =>
  actions.deliver(id, { pod: POD, cashReceived, shortReason, emptiesReturned: 1 })
const day = (id: string, over = {}) => ord(id, { status: 'Delivered', deliveredAt: NOW - 1000, ...over })

test('COD expected cash comes from Order.amount, not cashCollected', () => {
  fixture([day('FG-1', { amount: 900, cashCollected: 500 }), day('FG-2', { amount: 100, cashCollected: 100 })])
  const t = remitTotals(getDB(), 'r1', TODAY)
  expect(t.expectedCash).toBe(1000)
  expect(t.cashReceived).toBe(600)
})

test('cash under or over requires a reason; exact amount does not', () => {
  fixture([ord('FG-1')])
  expect(() => deliverCod('FG-1', 800)).toThrow(/reason/i)
  expect(() => deliverCod('FG-1', 950)).toThrow(/reason/i)
  expect(getDB().orders[0].status).toBe('Out for delivery')
  deliverCod('FG-1', 880)
  expect(getDB().orders[0].shortReason).toBeUndefined()
  fixture([ord('FG-2')])
  deliverCod('FG-2', 800, 'Customer short')
  expect(getDB().orders[0]).toMatchObject({ cashCollected: 800, shortReason: 'Customer short' })
})

test('GCash and Maya need a reference and are totalled separately', () => {
  fixture([ord('FG-1', { payment: 'gcash' }), ord('FG-2', { payment: 'maya', amount: 500 })])
  expect(() => actions.deliver('FG-1', { pod: POD, cashReceived: 0, emptiesReturned: 1 })).toThrow(/reference/i)
  actions.deliver('FG-1', { pod: POD, cashReceived: 0, walletRef: 'GC-1', emptiesReturned: 1 })
  actions.deliver('FG-2', { pod: POD, cashReceived: 0, walletRef: 'MY-2', emptiesReturned: 1 })
  const t = remitTotals(getDB(), 'r1', TODAY)
  expect([t.gcash, t.maya, t.expectedCash]).toEqual([880, 500, 0])
  actions.remit('r1', TODAY, { cash: 0, receiver: 'Owner' })
  const snap = getDB().remits[0].orders!
  expect(snap.map((s) => s.walletRef)).toEqual(['GC-1', 'MY-2'])
})

test('handover snapshot includes order payments and matches rider and date', () => {
  fixture([
    day('FG-1', { cashCollected: 880 }), day('FG-2', { riderId: 'r2' }),
    day('FG-3', { deliveredAt: NOW - 86_400_000, cashCollected: 880 }),
    day('FG-4', { payment: 'gcash', walletRef: 'GC-9', deliveredAt: NOW - 500 }),
  ])
  expect(ordersForRemit(getDB(), 'r1', TODAY).map((o) => o.id)).toEqual(['FG-1', 'FG-4'])
  expect(ordersForRemit(getDB(), 'r1', YESTERDAY).map((o) => o.id)).toEqual(['FG-3'])
  actions.remit('r1', TODAY, { cash: 880, receiver: 'Owner' })
  const r = getDB().remits[0]
  expect(r).toMatchObject({ expected: 880, cash: 880, turnedOver: 880, receiver: 'Owner', at: NOW, gcash: 880 })
  expect(r.orders).toHaveLength(2)
  expect(r.orders![0]).toMatchObject({ orderId: 'FG-1', amountDue: 880, cashReceived: 880 })
})

test('first save stores receiver and time; later save needs an edit reason', () => {
  fixture([day('FG-1', { cashCollected: 880 })])
  expect(() => actions.remit('r1', TODAY, { cash: 880, receiver: '' })).toThrow(/receiver/i)
  actions.remit('r1', TODAY, { cash: 880, receiver: 'Owner' })
  expect(() => actions.remit('r1', TODAY, { cash: 880, receiver: 'Owner' })).toThrow(/edit/i)
  vi.setSystemTime(NOW + 60_000)
  actions.remit('r1', TODAY, { cash: 880, receiver: 'Owner 2', editReason: 'Wrong receiver' })
  expect(getDB().remits).toHaveLength(1)
  expect(getDB().remits[0]).toMatchObject({ receiver: 'Owner 2', at: NOW, edits: [{ at: NOW + 60_000, reason: 'Wrong receiver' }] })
})

test('unexplained difference is open and cannot be saved without a reason; explained is visible but not open', () => {
  fixture([day('FG-1', { cashCollected: 880 })])
  expect(remitTotals(getDB(), 'r1', TODAY)).toMatchObject({ open: true, saved: false, difference: undefined })
  expect(() => actions.remit('r1', TODAY, { cash: 800, receiver: 'Owner' })).toThrow(/reason/i)
  actions.remit('r1', TODAY, { cash: 800, receiver: 'Owner', reason: 'Fuel advance' })
  expect(remitTotals(getDB(), 'r1', TODAY)).toMatchObject({ difference: -80, open: false })
  // a saved record with a difference but no reason (e.g. imported) stays open
  const d = getDB(); d.remits[0].reason = undefined
  expect(remitTotals(d, 'r1', TODAY).open).toBe(true)
})

test('legacy Remit.turnedOver records can still be read', () => {
  fixture([day('FG-1', { deliveredAt: NOW - 86_400_000, cashCollected: 880 })], { remits: [{ riderId: 'r1', day: YESTERDAY, turnedOver: 880 }] })
  expect(remitTotals(getDB(), 'r1', YESTERDAY)).toMatchObject({ saved: true, handedOver: 880, expectedCash: 880, difference: 0, open: false })
})
