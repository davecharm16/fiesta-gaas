import { actions, getDB, loadDB } from './store'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { can, scopeOf } from './rbac'
import { ord, fixture, POD } from './testkit'
import { seed } from './seed'
import { scopeDB } from './auth'
import { signIn, signOut } from './session'
import { pricingOf, stockOf } from './derive'

const as = (id: string) => { const u = getDB().users.find((x) => x.id === id)!; signIn(u) }
beforeEach(() => { loadDB(seed(Date.now())); const store = new Map<string, string>(); (globalThis as any).sessionStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) }; (globalThis as any).localStorage ??= { getItem: () => null, setItem: () => {}, removeItem: () => {} } })
afterEach(() => signOut())

test('registering a branch is immediate: own stock, active, usable for a scoped user', () => {
  as('u-owner')
  const id = actions.addBranch({ name: 'Urdaneta Depot', town: 'Urdaneta City', address: 'Poblacion', lat: 15.97, lng: 120.57 })
  const d = getDB()
  expect(d.branches.find((b) => b.id === id)?.active).toBe(true)
  expect(stockOf(d, id).full['11kg']).toBe(0)
  expect(() => actions.addBranch({ name: 'urdaneta depot', town: 'x', address: '', lat: 1, lng: 1 })).toThrow(/already exists/)
  actions.stockIn(id, '11kg', 10, { drNumber: 'DR-1', emptiesHandedBack: 0 })
  expect(stockOf(getDB(), id).full['11kg']).toBe(10)
})
test('a dispatcher cannot register branches, and only acts inside their branch', () => {
  as('u-d1') // Ana, Dagupan Main (b1)
  expect(() => actions.addBranch({ name: 'X', town: 'x', address: '', lat: 1, lng: 1 })).toThrow(/does not allow/)
  const alamOrder = getDB().orders.find((o) => o.branchId === 'b2' && o.status === 'Placed') ?? ord('x')
  const d = getDB(); const o = d.orders.find((x) => x.branchId === 'b2')!
  expect(() => actions.cancel(o.id)).toThrow(/outside your access|cannot be cancelled/)
  expect(scopeOf(d, d.users.find((u) => u.id === 'u-d1'))).toEqual(['b1'])
  void alamOrder
})
test('a rider can only be assigned to an order of their own branch', () => {
  as('u-owner')
  const d = getDB(); const o = d.orders.find((x) => x.status === 'Placed' && x.branchId === 'b1')!
  expect(() => actions.assign(o.id, 'r1')).toThrow(/another branch/) // r1 works from b2
  actions.assign(o.id, 'r2'); expect(getDB().orders.find((x) => x.id === o.id)?.riderId).toBe('r2')
})
test('stock transfer moves full tanks and records both sides; cannot overdraw', () => {
  as('u-owner')
  const before = getDB(); const b1 = before.stocks.b1.full['11kg'], b2 = before.stocks.b2.full['11kg']
  actions.transferStock('b2', 'b1', '11kg', 5, 'rebalance')
  const d = getDB()
  expect(d.stocks.b1.full['11kg']).toBe(b1 + 5); expect(d.stocks.b2.full['11kg']).toBe(b2 - 5)
  expect(d.movements.filter((m) => m.kind === 'transfer').length).toBe(2)
  expect(() => actions.transferStock('b2', 'b1', '11kg', 999)).toThrow(/Only/)
  expect(() => actions.transferStock('b1', 'b1', '11kg', 1)).toThrow(/different/)
})
test('custom role: permissions drive can(); the last owner is protected; used roles cannot be deleted', () => {
  as('u-owner')
  const rid = actions.saveRole({ name: 'Cashier', perms: ['cash.view', 'cash.record'] })
  const uid = actions.addUser({ name: 'Cora', roleId: rid, branchIds: ['b1'] })
  let d = getDB(); const u = d.users.find((x) => x.id === uid)!
  expect(can(d, u, 'cash.record')).toBe(true); expect(can(d, u, 'inventory.manage')).toBe(false)
  expect(() => actions.deleteRole(rid)).toThrow(/Move the users/)
  expect(() => actions.updateUser('u-owner', { roleId: rid })).toThrow(/last owner/)
  expect(() => actions.updateUser('u-owner', { active: false })).toThrow(/last owner/)
  expect(() => actions.saveRole({ id: 'role-owner', name: 'Owner', perms: [] })).toThrow(/fixed/)
  as(uid) // the cashier may record cash for b1 but not touch stock
  expect(() => actions.stockIn('b1', '11kg', 1, { drNumber: 'D', emptiesHandedBack: 0 })).toThrow(/does not allow/)
  d = getDB()
})
test('scoped view contains only the branch in view', () => {
  const d = getDB(); const v = scopeDB(d, ['b2'])
  expect(v.customers.every((c) => c.branchId === 'b2')).toBe(true)
  expect(v.orders.every((o) => o.branchId === 'b2')).toBe(true)
  expect(Object.keys(v.stocks)).toEqual(['b2'])
  expect(v.riders.map((r) => r.id).sort()).toEqual(['r1', 'r4'])
})
void fixture; void POD

test('prices: a branch override beats the default; other values follow the default; orders use the serving branch price', () => {
  as('u-owner')
  const d0 = getDB()
  expect(pricingOf(d0, 'b1').refill['11kg']).toBe(880)
  expect(pricingOf(d0, 'b2').refill['11kg']).toBe(920) // seeded Alaminos override
  expect(pricingOf(d0, 'b2').refill['22kg']).toBe(1760) // not overridden: follows default
  actions.setPricing('base', { refill: { '22kg': 1800 } })
  expect(pricingOf(getDB(), 'b2').refill['22kg']).toBe(1800) // branch without an override follows the new default
  const c = getDB().customers.find((x) => x.branchId === 'b2' && x.size === '11kg')!
  actions.placeOrder({ customerId: c.id, size: '11kg', qty: 1, type: 'refill', payment: 'cod', channel: 'call' })
  const o = getDB().orders.at(-1)!
  expect(o.branchId).toBe('b2'); expect(o.amount).toBe(920 + (pricingOf(getDB(), 'b2').fees[c.town] ?? 0))
  actions.setPricing('b2', { refill: { '11kg': null } }) // clear the override
  expect(pricingOf(getDB(), 'b2').refill['11kg']).toBe(880)
  expect(getDB().orders.find((x) => x.id === o.id)!.amount).toBe(o.amount) // history keeps its price
})
test('prices: validation and who may edit what', () => {
  as('u-owner')
  expect(() => actions.setPricing('base', { refill: { '11kg': -5 } })).toThrow(/amount/)
  expect(() => actions.setPricing('base', { refill: { '11kg': null } })).toThrow(/cannot be cleared/)
  as('u-m2') // Alaminos manager: own branch only, not the business default
  actions.setPricing('b2', { deposit: { '11kg': 2600 } })
  expect(pricingOf(getDB(), 'b2').deposit['11kg']).toBe(2600)
  expect(() => actions.setPricing('base', { refill: { '11kg': 900 } })).toThrow(/all branches/)
  expect(() => actions.setPricing('b1', { refill: { '11kg': 900 } })).toThrow(/outside your access/)
  as('u-d1'); expect(() => actions.setPricing('b1', { refill: { '11kg': 900 } })).toThrow(/does not allow/)
})
