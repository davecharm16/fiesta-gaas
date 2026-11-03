import { dayKey } from './derive'
import { defaultPricing } from './geo'
import { SYSTEM_ROLES } from './rbac'
import { loadDB } from './store'
import type { Customer, DB, Order } from './types'

/** Fixed clock for tests: 2026-10-31 09:00 local. */
export const NOW = new Date(2026, 9, 31, 9, 0, 0).getTime()
export const TODAY = dayKey(NOW)
export const YESTERDAY = dayKey(NOW - 86_400_000)
export const POD: NonNullable<Order['pod']> = { kind: 'otp', at: NOW, lat: 0, lng: 0 }

const cust = (id: string, size: Customer['size'], held: number, extra: Partial<Customer> = {}): Customer => ({
  id, branchId: 'b1', name: id, phone: '0917 000 0000', town: 'Dagupan City', barangay: 'Pantal', street: 'Purok 1', landmark: 'x', lat: 16.04, lng: 120.33, size, promoConsent: true, heldCylinders: held, ...extra,
})
export const ord = (id: string, over: Partial<Order> = {}): Order => ({
  id, branchId: 'b1', customerId: 'c1', size: '11kg', qty: 1, type: 'refill', channel: 'call', status: 'Out for delivery', payment: 'cod', amount: 880, placedAt: NOW - 3600_000, riderId: 'r1', ...over,
})

export function fixture(orders: Order[] = [], over: Partial<DB> = {}): DB {
  const d: DB = {
    customers: [cust('c1', '11kg', 1), cust('c2', '22kg', 1)],
    riders: [{ id: 'r1', name: 'Berto', phone: '1', branchId: 'b1' }, { id: 'r2', name: 'Jun', phone: '2', branchId: 'b1' }],
    orders, sms: [], followUps: [], blasts: [], movements: [], remits: [],
    branches: [{ id: 'b1', name: 'Main', town: 'Dagupan City', address: '', lat: 16.04, lng: 120.33, active: true }, { id: 'b2', name: 'Second', town: 'Alaminos City', address: '', lat: 16.15, lng: 119.98, active: true }],
    roles: SYSTEM_ROLES.map((r) => ({ ...r })), users: [], pricing: { base: defaultPricing(), byBranch: {} },
    stocks: { b1: { full: { '11kg': 20, '22kg': 10, '50kg': 5 }, empty: { '11kg': 8, '22kg': 4, '50kg': 2 } }, b2: { full: { '11kg': 0, '22kg': 0, '50kg': 0 }, empty: { '11kg': 0, '22kg': 0, '50kg': 0 } } },
    thresholds: { b1: { '11kg': 15, '22kg': 8, '50kg': 3 }, b2: { '11kg': 15, '22kg': 8, '50kg': 3 } }, openingHeld: { b1: {}, b2: {} },
    seededAt: NOW, ...over,
  }
  loadDB(d)
  return d
}
