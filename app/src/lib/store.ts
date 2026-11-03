import { useSyncExternalStore } from 'react'
import { activeStops, dayKey, emptyStock, orderAmount, holdingOf, ordersForRemit, remitSnapshot } from './derive'
import { can, scopeOf, SYSTEM_ROLES } from './rbac'
import { currentUserId } from './session'
import { defaultPricing } from './geo'
import { seed, seedUsers } from './seed'
import { SIZES, type Branch, type Channel, type Customer, type DB, type FollowUpLossReason, type LoadoutLine, type Order, type Outcome, type Payment, type Perm, type Size, type Stock, type User } from './types'

const KEY = 'fiesta-gas-demo-v3'
const OLD_KEYS = ['fiesta-gas-demo-v2', 'fiesta-gas-demo-v1']
const ls = (): Storage | undefined => { try { return typeof localStorage === 'undefined' ? undefined : localStorage } catch { return undefined } }

/** Bring any saved snapshot (v1, v2 or v3) up to the current shape. Throws on garbage so the caller can reseed. */
export function normalize(raw: unknown): DB {
  const d = raw as DB & { stock?: Stock; openingHeldBySize?: Partial<Record<Size, number>> }
  if (!d || !Array.isArray(d.customers) || !Array.isArray(d.orders)) throw new Error('bad snapshot')
  d.sms ||= []; d.followUps ||= []; d.blasts ||= []; d.movements ||= []; d.remits ||= []; d.riders ||= []
  d.loadouts ||= []
  for (const c of d.customers) c.heldBySize ||= { [c.size]: c.heldCylinders }
  if (!d.branches) {
    // Single-branch snapshot (v1/v2): everything belongs to one branch, so no data is lost.
    if (!d.stock?.full || !d.stock?.empty) throw new Error('bad snapshot')
    const b = 'b1'
    d.branches = [{ id: b, name: 'Main branch', town: 'Dagupan City', address: '', lat: 16.043, lng: 120.334, active: true }]
    for (const x of [...d.customers, ...d.riders, ...d.orders, ...d.movements]) (x as { branchId?: string }).branchId ||= b
    d.stocks = { [b]: d.stock }
    const th = (d as { thresholds?: Partial<Record<Size, number>> }).thresholds
    d.thresholds = { [b]: th ?? { '11kg': 15, '22kg': 8, '50kg': 3 } }
    d.openingHeld = { [b]: d.openingHeldBySize ?? {} }
    delete d.stock; delete d.openingHeldBySize
  }
  d.roles ||= SYSTEM_ROLES.map((r) => ({ ...r }))
  for (const r of d.roles) if (r.id === 'role-manager' && !r.perms.includes('pricing.manage')) r.perms.push('pricing.manage')
  d.pricing ||= { base: defaultPricing(), byBranch: {} }
  d.users ||= []
  d.thresholds ||= {}; d.openingHeld ||= {}
  if (!d.stocks || typeof d.stocks !== 'object') throw new Error('bad snapshot')
  for (const b of d.branches) { d.stocks[b.id] ||= emptyStock(); d.thresholds[b.id] ||= { '11kg': 15, '22kg': 8, '50kg': 3 }; d.openingHeld[b.id] ||= {} }
  if (!d.users.length) d.users = seedUsers(d.riders)
  return d
}

const load = (): DB => {
  const st = ls()
  try {
    const cur = st?.getItem(KEY)
    if (cur) return normalize(JSON.parse(cur))
    for (const k of OLD_KEYS) {
      const old = st?.getItem(k)
      if (!old) continue
      const d = normalize(JSON.parse(old))
      try { st!.setItem(KEY, JSON.stringify(d)); st!.removeItem(k) } catch { /* keep the old copy until the new one is persisted */ }
      return d
    }
  } catch { /* corrupt or unreadable: fall through to seed */ }
  return seed()
}
let db: DB = load()
const subs = new Set<() => void>()
const emit = () => { try { ls()?.setItem(KEY, JSON.stringify(db)) } catch { /* quota: keep in memory */ } subs.forEach((f) => f()) }
// Other tabs (e.g. dispatcher on one tab, rider on another) stay live.
if (typeof addEventListener === 'function') {
  addEventListener('storage', (e) => { if (e.key === KEY && e.newValue) { try { db = normalize(JSON.parse(e.newValue)); subs.forEach((f) => f()) } catch { /* ignore bad write */ } } })
}

export const getDB = () => db
/** Replace the whole DB (tests / tooling). Normalizes first. */
export const loadDB = (d: DB) => { db = normalize(structuredClone(d)); emit() }
export const useDB = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => db)
/** Mutates a clone; a thrown validation error leaves the live DB untouched. */
const set = (f: (d: DB) => DB) => { db = f(structuredClone(db)); emit() }
const uid = (p: string) => `${p}${Math.random().toString(36).slice(2, 8)}`
const sms = (d: DB, to: string, text: string, kind: 'status' | 'reminder' | 'blast' | 'otp') => d.sms.unshift({ id: uid('s'), to, text, at: Date.now(), kind })
const cust = (d: DB, id: string) => d.customers.find((c) => c.id === id)!

// --- validation helpers: every rule throws an Error with a user-readable message ---
function need(ok: unknown, msg: string): asserts ok { if (!ok) throw new Error(msg) }
/**
 * RBAC gate. The acting user comes from the tab's session; with no session (unit tests, tooling) nothing is restricted.
 * `perm` may be a list (any one is enough). `branchId` must be inside the user's branch scope.
 * The UI also hides what a user cannot do, but this is the rule that holds.
 */
function authorize(d: DB, perm: Perm | Perm[], branchId?: string) {
  const id = currentUserId()
  if (!id) return
  const u = d.users.find((x) => x.id === id)
  need(u && u.active, 'Your account is not active')
  need((Array.isArray(perm) ? perm : [perm]).some((p) => can(d, u, p)), 'Your role does not allow this action')
  if (branchId) need(scopeOf(d, u).includes(branchId), 'That branch is outside your access')
}
const stk = (d: DB, branchId: string): Stock => (d.stocks[branchId] ||= emptyStock())
const branchOf = (d: DB, id: string): Branch => { const b = d.branches.find((x) => x.id === id); need(b, 'Unknown branch'); return b }
const riderOf = (d: DB, id: string) => { const r = d.riders.find((x) => x.id === id); need(r, 'Unknown rider'); return r }
function isInt(n: unknown): n is number { return typeof n === 'number' && Number.isInteger(n) }
const nonNeg = (n: unknown, what: string) => need(isInt(n) && n >= 0, `${what} must be a whole number, 0 or more`)
const text = (v: unknown, what: string): string => { need(typeof v === 'string' && v.trim(), `${what} is required`); return (v as string).trim() }
function order(d: DB, id: string): Order { const o = d.orders.find((x) => x.id === id); need(o, `Unknown order ${id}`); return o }
const when = (t: number) => new Date(t).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const setHeld = (c: Customer, size: Size, delta: number) => {
  const h = { ...holdingOf(c) }
  h[size] = Math.max(0, (h[size] ?? 0) + delta)
  c.heldBySize = h
  c.heldCylinders = SIZES.reduce((a, s) => a + (h[s] ?? 0), 0)
}
const lines = (l: Partial<Record<Size, LoadoutLine>>) => {
  const out: Partial<Record<Size, LoadoutLine>> = {}
  for (const s of SIZES) {
    const x = l[s]; if (!x) continue
    nonNeg(x.full, `${s} full`); nonNeg(x.empty, `${s} empty`)
    if (x.full || x.empty) out[s] = { full: x.full, empty: x.empty }
  }
  need(Object.keys(out).length, 'Enter at least one cylinder count')
  return out
}
const nextStopSeq = (d: DB, riderId: string) => Math.max(0, ...activeStops(d, riderId).map((o) => o.stopSeq ?? 0)) + 1

export const OTP = '4821' // demo one-time code, shown in the customer's SMS inbox

export const actions = {
  reset: () => { db = seed(); emit(); try { OLD_KEYS.forEach((k) => ls()?.removeItem(k)) } catch { /* ignore */ } },
  touch: () => { db = { ...db }; emit() }, // new snapshot so subscribers re-render after a non-DB change (demo persona)

  placeOrder(i: { customerId: string; size: Size; qty: number; type: 'refill' | 'new'; payment: Payment; channel: Channel }) {
    set((d) => {
      authorize(d, ['orders.create', 'app.customer'])
      need(Number.isInteger(i.qty) && i.qty >= 1 && i.qty <= 20, 'Quantity must be a whole number from 1 to 20')
      const c = cust(d, i.customerId)
      if (!can(d, d.users.find((x) => x.id === currentUserId()), 'app.customer')) authorize(d, 'orders.create', c.branchId)
      const amount = orderAmount(d, c.branchId, { ...i, town: c.town })
      const o: Order = { id: `FG-${Math.max(1000, ...d.orders.map((x) => +x.id.slice(3))) + 1}`, branchId: c.branchId, ...i, status: 'Placed', amount, placedAt: Date.now() }
      d.orders.push(o)
      sms(d, c.phone, `Fiesta Gas: order ${o.id} received (${i.qty}x ${i.size}, ₱${amount.toLocaleString()}). We'll text you when a rider is on the way.`, 'status')
      return d
    })
  },
  assign(orderId: string, riderId: string) {
    set((d) => {
      const o = order(d, orderId)
      need(o.status === 'Placed' || o.status === 'Failed' || o.status === 'Assigned', `Order ${o.id} is ${o.status} and cannot be assigned`)
      authorize(d, 'orders.dispatch', o.branchId)
      need(riderOf(d, riderId).branchId === o.branchId, `That rider works from another branch than order ${o.id}`)
      o.status = 'Assigned'; o.riderId = riderId; o.assignedAt = Date.now(); o.failReason = undefined
      o.failedContact = undefined; o.nextAttempt = undefined; o.stopSeq = nextStopSeq(d, riderId)
      sms(d, cust(d, o.customerId).phone, `Fiesta Gas: ${d.riders.find((r) => r.id === riderId)!.name} will deliver order ${o.id}.`, 'status')
      return d
    })
  },
  cancel(orderId: string) {
    set((d) => {
      const o = order(d, orderId)
      authorize(d, 'orders.dispatch', o.branchId)
      need(o.status === 'Placed' || o.status === 'Assigned' || o.status === 'Failed', `Order ${o.id} is ${o.status} and cannot be cancelled`)
      o.status = 'Cancelled'
      return d
    })
  },
  startDelivery(orderId: string) {
    set((d) => {
      const o = order(d, orderId)
      authorize(d, ['app.rider', 'orders.dispatch'])
      need(o.status === 'Assigned', `Order ${o.id} must be assigned before it can start delivery`)
      o.status = 'Out for delivery'
      const c = cust(d, o.customerId)
      sms(d, c.phone, `Fiesta Gas: your order ${o.id} is out for delivery. Delivery code: ${OTP}. Give it to the rider.`, 'otp')
      return d
    })
  },
  /**
   * Complete a delivery. COD: cashReceived may differ from amount only with shortReason.
   * GCash/Maya: amount is recorded against the wallet and walletRef is required (recorded, not verified).
   */
  deliver(orderId: string, i: { pod: NonNullable<Order['pod']>; cashReceived: number; shortReason?: string; walletRef?: string; emptiesReturned: number }) {
    set((d) => {
      const o = order(d, orderId)
      authorize(d, 'app.rider')
      if (o.status !== 'Out for delivery') return d // already delivered (e.g. second tab)
      nonNeg(i.emptiesReturned, 'Empties returned')
      const cod = o.payment === 'cod'
      if (cod) {
        nonNeg(i.cashReceived, 'Cash received')
        if (i.cashReceived !== o.amount) o.shortReason = text(i.shortReason, 'A reason for the cash difference')
      } else o.walletRef = text(i.walletRef, 'Wallet reference')
      const at = Date.now()
      const day = dayKey(at)
      const truck = d.loadouts?.find((l) => l.riderId === o.riderId && l.day === day && l.outAt && !l.returnedAt)?.out?.[o.size]
      const onTruck = !!truck // this size was loaded; otherwise it comes from the depot
      if (truck) {
        const sold = d.movements.filter((m) => m.kind === 'delivery' && m.onTruck && m.riderId === o.riderId && m.size === o.size && dayKey(m.at) === day).reduce((a, m) => a - m.full, 0)
        need(truck.full - sold >= o.qty, `Only ${truck.full - sold} full ${o.size} left on the truck`)
      } else need(stk(d, o.branchId).full[o.size] >= o.qty, `Only ${stk(d, o.branchId).full[o.size]} full ${o.size} in this branch's stock`)
      const expected = o.type === 'refill' ? o.qty : 0
      o.status = 'Delivered'; o.deliveredAt = at; o.pod = i.pod
      o.cashCollected = cod ? i.cashReceived : 0
      o.emptiesExpected = expected; o.emptiesReturned = i.emptiesReturned; o.empties = i.emptiesReturned
      if (!onTruck) { stk(d, o.branchId).full[o.size] -= o.qty; stk(d, o.branchId).empty[o.size] += i.emptiesReturned }
      d.movements.unshift({ id: uid('m'), branchId: o.branchId, at, kind: 'delivery', size: o.size, full: -o.qty, empty: i.emptiesReturned, note: `Order ${o.id}, ${i.emptiesReturned} of ${expected} empties returned`, orderId: o.id, riderId: o.riderId, onTruck: onTruck || undefined })
      if (i.emptiesReturned !== expected) setHeld(cust(d, o.customerId), o.size, expected - i.emptiesReturned)
      sms(d, cust(d, o.customerId).phone, `Fiesta Gas: Order ${o.id} has been delivered. Thank you for choosing Fiesta Gas.`, 'status')
      return d
    })
  },
  fail(orderId: string, i: { reason: string; contacted: boolean; nextAttempt: number }) {
    set((d) => {
      const o = order(d, orderId)
      authorize(d, ['app.rider', 'orders.dispatch'])
      need(o.status === 'Assigned' || o.status === 'Out for delivery', 'Only an assigned or out-for-delivery order can be marked failed')
      const reason = text(i.reason, 'A failure reason')
      need(i.nextAttempt > Date.now(), 'Next attempt must be in the future')
      o.status = 'Failed'; o.failReason = reason; o.failedContact = i.contacted ? 'contacted' : 'not-contacted'; o.nextAttempt = i.nextAttempt
      sms(d, cust(d, o.customerId).phone, `Fiesta Gas: we could not complete delivery of order ${o.id} (${reason}). The next attempt is planned for ${when(i.nextAttempt)}. We will text you to confirm.`, 'status')
      return d
    })
  },
  markContacted(orderId: string) {
    set((d) => { const o = order(d, orderId); authorize(d, 'orders.dispatch', o.branchId); need(o.status === 'Failed', 'Order is not failed'); o.failedContact = 'contacted'; return d })
  },
  /** Resolve a failed order: back to Placed, or Assigned when riderId is given. */
  requeue(orderId: string, riderId?: string) {
    set((d) => {
      const o = order(d, orderId)
      authorize(d, 'orders.dispatch', o.branchId)
      need(o.status === 'Failed', 'Only a failed order can be requeued')
      if (riderId) need(riderOf(d, riderId).branchId === o.branchId, `That rider works from another branch than order ${o.id}`)
      o.failReason = undefined; o.failedContact = undefined; o.nextAttempt = undefined
      if (riderId) { o.status = 'Assigned'; o.riderId = riderId; o.assignedAt = Date.now(); o.stopSeq = nextStopSeq(d, riderId) }
      else { o.status = 'Placed'; o.riderId = undefined; o.assignedAt = undefined; o.stopSeq = undefined }
      sms(d, cust(d, o.customerId).phone, riderId ? `Fiesta Gas: order ${o.id} is rescheduled and assigned to ${d.riders.find((r) => r.id === riderId)!.name}. We will text you when it is out for delivery.` : `Fiesta Gas: order ${o.id} is back in our queue and will be assigned to a rider. We will text you when it is out for delivery.`, 'status')
      return d
    })
  },
  /** orderedOrderIds: the rider's active stops in the new order; stopSeq becomes 1-based position. */
  reorderStops(riderId: string, orderedOrderIds: string[]) {
    set((d) => {
      authorize(d, 'app.rider')
      need(new Set(orderedOrderIds).size === orderedOrderIds.length, 'Duplicate stop in the new order')
      orderedOrderIds.forEach((id) => {
        const o = order(d, id)
        need(o.riderId === riderId && (o.status === 'Assigned' || o.status === 'Out for delivery'), `${id} is not an active stop for this rider`)
      })
      orderedOrderIds.forEach((id, i) => { order(d, id).stopSeq = i + 1 })
      return d
    })
  },

  addCustomer(c: Omit<Customer, 'id' | 'heldCylinders'>) {
    let id = ''
    set((d) => { authorize(d, ['customers.manage', 'orders.create'], c.branchId); branchOf(d, c.branchId); id = uid('c'); d.customers.push({ ...c, id, heldCylinders: 0, heldBySize: {} }); return d })
    return id
  },
  logFollowUp(customerId: string, outcome: Outcome, i: { callbackAt?: number; lostReason?: FollowUpLossReason } = {}) {
    set((d) => {
      authorize(d, 'followups.manage', cust(d, customerId).branchId)
      if (outcome === 'Call back later') need(i.callbackAt, 'A callback date is required')
      if (outcome === 'Switched supplier' || outcome === 'Not interested') need(i.lostReason, 'A lost reason is required')
      d.followUps.unshift({ id: uid('f'), customerId, outcome, at: Date.now(), callbackAt: i.callbackAt, lostReason: i.lostReason })
      return d
    })
  },
  /** Hide the customer from the active follow-up list until `until`. Not a contact; sends nothing. */
  snoozeFollowUp(customerId: string, until: number) {
    set((d) => {
      authorize(d, 'followups.manage', cust(d, customerId).branchId)
      need(until > Date.now(), 'Snooze date must be in the future')
      d.followUps.unshift({ id: uid('f'), customerId, outcome: 'Call back later', at: Date.now(), snoozedUntil: until, noContact: true })
      return d
    })
  },

  sendBlast(message: string, segment: string, recipients: string[]) {
    set((d) => {
      authorize(d, 'blast.send')
      recipients.forEach((id) => authorize(d, 'blast.send', cust(d, id).branchId))
      d.blasts.unshift({ id: uid('b'), message, segment, recipients, at: Date.now() })
      recipients.forEach((id) => sms(d, cust(d, id).phone, message, 'blast'))
      return d
    })
  },
  sendReminder(customerId: string) {
    set((d) => { authorize(d, 'followups.manage', cust(d, customerId).branchId); sms(d, cust(d, customerId).phone, 'Fiesta Gas: Your LPG cylinder may be running low. Reorder at fiestagas.example/order. Reply STOP to opt out.', 'reminder'); return d })
  },

  /** Supplier receipt into one branch: adds full tanks, hands empties back to the supplier. */
  stockIn(branchId: string, size: Size, qty: number, i: { drNumber: string; emptiesHandedBack: number; mismatchNote?: string }) {
    set((d) => {
      authorize(d, 'inventory.manage', branchId); branchOf(d, branchId)
      need(isInt(qty) && qty > 0, 'Quantity must be a whole number above 0')
      const dr = text(i.drNumber, 'DR number')
      nonNeg(i.emptiesHandedBack, 'Empties handed back')
      const st = stk(d, branchId)
      need(i.emptiesHandedBack <= st.empty[size], `Only ${st.empty[size]} empty ${size} in this depot`)
      const note = i.mismatchNote?.trim()
      st.full[size] += qty; st.empty[size] -= i.emptiesHandedBack
      d.movements.unshift({ id: uid('m'), branchId, at: Date.now(), kind: 'stock-in', size, full: qty, empty: -i.emptiesHandedBack, note: `Supplier receipt ${dr}${note ? `, ${note}` : ''}`, drNumber: dr, emptiesHandedBack: i.emptiesHandedBack, reason: note || undefined })
      return d
    })
  },
  /** Physical count: sets one branch's depot stock to the counted numbers. A reason is mandatory. */
  adjust(branchId: string, size: Size, i: { fullCount: number; emptyCount: number; reason: string }) {
    set((d) => {
      authorize(d, 'inventory.manage', branchId); branchOf(d, branchId)
      nonNeg(i.fullCount, 'Full count'); nonNeg(i.emptyCount, 'Empty count')
      const reason = text(i.reason, 'A reason')
      const st = stk(d, branchId)
      const f = i.fullCount - st.full[size], e = i.emptyCount - st.empty[size]
      st.full[size] = i.fullCount; st.empty[size] = i.emptyCount
      d.movements.unshift({ id: uid('m'), branchId, at: Date.now(), kind: 'adjustment', size, full: f, empty: e, note: `Physical count: ${reason}`, reason })
      return d
    })
  },
  /** Move full tanks from one branch depot to another. Recorded as a paired movement on each side. */
  transferStock(fromId: string, toId: string, size: Size, qty: number, note?: string) {
    set((d) => {
      authorize(d, 'inventory.manage', fromId)
      const from = branchOf(d, fromId), to = branchOf(d, toId)
      need(fromId !== toId, 'Choose two different branches')
      need(to.active, `${to.name} is not active`)
      need(isInt(qty) && qty > 0, 'Quantity must be a whole number above 0')
      const src = stk(d, fromId), dst = stk(d, toId)
      need(src.full[size] >= qty, `Only ${src.full[size]} full ${size} at ${from.name}`)
      src.full[size] -= qty; dst.full[size] += qty
      const at = Date.now(), n = note?.trim()
      d.movements.unshift({ id: uid('m'), branchId: toId, at, kind: 'transfer', size, full: qty, empty: 0, note: `Transfer in from ${from.name}${n ? `: ${n}` : ''}` })
      d.movements.unshift({ id: uid('m'), branchId: fromId, at, kind: 'transfer', size, full: -qty, empty: 0, note: `Transfer out to ${to.name}${n ? `: ${n}` : ''}` })
      return d
    })
  },
  setThreshold(branchId: string, size: Size, n: number) { set((d) => { authorize(d, 'inventory.manage', branchId); branchOf(d, branchId); nonNeg(n, 'Threshold'); d.thresholds![branchId] = { ...d.thresholds![branchId], [size]: n }; return d }) },
  loadOut(riderId: string, day: string, l: Partial<Record<Size, LoadoutLine>>) {
    set((d) => {
      const rider = riderOf(d, riderId)
      authorize(d, 'inventory.manage', rider.branchId)
      d.loadouts ||= []
      need(!d.loadouts.some((x) => x.riderId === riderId && x.day === day), 'This rider already has a load-out for that day')
      const out = lines(l), at = Date.now(), st = stk(d, rider.branchId)
      for (const s of SIZES) {
        const x = out[s]; if (!x) continue
        need(x.full <= st.full[s] && x.empty <= st.empty[s], `Not enough ${s} in the depot (${st.full[s]} full, ${st.empty[s]} empty)`)
      }
      for (const s of SIZES) {
        const x = out[s]; if (!x) continue
        st.full[s] -= x.full; st.empty[s] -= x.empty
        d.movements.unshift({ id: uid('m'), branchId: rider.branchId, at, kind: 'load-out', size: s, full: -x.full, empty: -x.empty, note: `Load-out to ${rider.name}`, riderId })
      }
      d.loadouts.push({ riderId, day, outAt: at, out })
      return d
    })
  },
  returnLoad(riderId: string, day: string, l: Partial<Record<Size, LoadoutLine>>) {
    set((d) => {
      const rider = riderOf(d, riderId)
      authorize(d, 'inventory.manage', rider.branchId)
      const lo = d.loadouts?.find((x) => x.riderId === riderId && x.day === day)
      need(lo?.outAt, 'No load-out recorded for this rider and day')
      need(!lo.returnedAt, 'This load has already been returned')
      const ret = lines(l), at = Date.now(), st = stk(d, rider.branchId)
      for (const s of SIZES) {
        const x = ret[s]; if (!x) continue
        st.full[s] += x.full; st.empty[s] += x.empty
        d.movements.unshift({ id: uid('m'), branchId: rider.branchId, at, kind: 'load-return', size: s, full: x.full, empty: x.empty, note: `Load returned by ${rider.name}`, riderId })
      }
      lo.returned = ret; lo.returnedAt = at
      return d
    })
  },

  /** One current handover per rider/day. Difference vs expected COD needs `reason`; saving again needs `editReason`. */
  remit(riderId: string, day: string, i: { cash: number; receiver: string; reason?: string; editReason?: string }) {
    set((d) => {
      authorize(d, 'cash.record', riderOf(d, riderId).branchId)
      nonNeg(i.cash, 'Cash handed over')
      const receiver = text(i.receiver, 'Receiver name')
      const orders = remitSnapshot(ordersForRemit(d, riderId, day))
      const expected = orders.filter((x) => x.payment === 'cod').reduce((a, x) => a + x.amountDue, 0)
      const reason = i.reason?.trim()
      if (i.cash !== expected) need(reason, 'A reason is required when cash differs from expected')
      const prev = d.remits.find((r) => r.riderId === riderId && r.day === day)
      const at = Date.now()
      const edits = prev?.edits ? [...prev.edits] : []
      if (prev) edits.push({ at, reason: text(i.editReason, 'A reason for the edit') })
      const rec = {
        riderId, day, turnedOver: i.cash, expected, cash: i.cash, receiver, at: prev?.at ?? at, reason: reason || undefined,
        gcash: orders.filter((x) => x.payment === 'gcash').reduce((a, x) => a + x.walletAmount, 0),
        maya: orders.filter((x) => x.payment === 'maya').reduce((a, x) => a + x.walletAmount, 0),
        edits: edits.length ? edits : undefined, orders,
      }
      d.remits = d.remits.filter((r) => r !== prev); d.remits.push(rec)
      return d
    })
  },

  // ---- Prices ----
  /**
   * Set prices for the whole business (`scope: 'base'`, needs access to all branches) or override them for one branch.
   * A `null` value clears a branch override so that value follows the business default again.
   */
  setPricing(scope: 'base' | string, i: { refill?: Partial<Record<Size, number | null>>; deposit?: Partial<Record<Size, number | null>>; fees?: Record<string, number | null>; smsCost?: number }) {
    set((d) => {
      authorize(d, 'pricing.manage', scope === 'base' ? undefined : scope)
      const uid0 = currentUserId(), u = uid0 ? d.users.find((x) => x.id === uid0) : undefined
      need(scope !== 'base' || !u || u.branchIds === 'all', 'Only someone with access to all branches can change the business default prices')
      if (scope !== 'base') branchOf(d, scope)
      const money = (v: unknown, what: string) => need(typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1_000_000, `${what} must be an amount from 0 to 1,000,000`)
      const apply = <K extends string>(target: Partial<Record<K, number>>, src: Partial<Record<K, number | null>> | undefined, what: string) => {
        for (const [k, v] of Object.entries(src ?? {}) as [K, number | null][]) {
          if (v === null) { need(scope !== 'base', 'The business default cannot be cleared'); delete target[k] } else { money(v, `${what} ${k}`); target[k] = v }
        }
      }
      if (scope === 'base') {
        apply(d.pricing.base.refill, i.refill, 'Refill price'); apply(d.pricing.base.deposit, i.deposit, 'Deposit'); apply(d.pricing.base.fees, i.fees, 'Delivery fee')
        if (i.smsCost !== undefined) { money(i.smsCost, 'SMS cost'); d.pricing.base.smsCost = i.smsCost }
      } else {
        const o = (d.pricing.byBranch[scope] ||= {})
        o.refill ||= {}; o.deposit ||= {}; o.fees ||= {}
        apply(o.refill, i.refill, 'Refill price'); apply(o.deposit, i.deposit, 'Deposit'); apply(o.fees, i.fees, 'Delivery fee')
      }
      return d
    })
  },

  // ---- Branches, team and roles (all need the matching admin permission) ----
  /** Register a branch. It is usable at once: it gets its own empty stock and default alert levels. */
  addBranch(i: { name: string; town: string; address: string; lat: number; lng: number }) {
    let id = ''
    set((d) => {
      authorize(d, 'branches.manage')
      const name = text(i.name, 'Branch name')
      need(!d.branches.some((b) => b.name.toLowerCase() === name.toLowerCase()), 'A branch with that name already exists')
      need(Number.isFinite(i.lat) && Number.isFinite(i.lng) && Math.abs(i.lat) <= 90 && Math.abs(i.lng) <= 180, 'Enter a valid map position')
      id = `b${Math.max(0, ...d.branches.map((b) => +b.id.slice(1) || 0)) + 1}`
      d.branches.push({ id, name, town: text(i.town, 'Town'), address: i.address.trim(), lat: i.lat, lng: i.lng, active: true })
      d.stocks[id] = emptyStock(); d.thresholds![id] = { '11kg': 15, '22kg': 8, '50kg': 3 }; d.openingHeld![id] = {}
      // Users who work in every branch (owner) already cover it; scoped users must be given the new branch explicitly.
      return d
    })
    return id
  },
  updateBranch(id: string, i: Partial<Pick<Branch, 'name' | 'town' | 'address' | 'lat' | 'lng'>>) {
    set((d) => {
      authorize(d, 'branches.manage')
      const b = branchOf(d, id)
      if (i.name !== undefined) { const n = text(i.name, 'Branch name'); need(!d.branches.some((x) => x.id !== id && x.name.toLowerCase() === n.toLowerCase()), 'A branch with that name already exists'); b.name = n }
      if (i.town !== undefined) b.town = text(i.town, 'Town')
      if (i.address !== undefined) b.address = i.address.trim()
      if (i.lat !== undefined && i.lng !== undefined) { need(Number.isFinite(i.lat) && Number.isFinite(i.lng), 'Enter a valid map position'); b.lat = i.lat; b.lng = i.lng }
      return d
    })
  },
  setBranchActive(id: string, active: boolean) {
    set((d) => {
      authorize(d, 'branches.manage')
      const b = branchOf(d, id)
      if (!active) {
        need(d.branches.filter((x) => x.active).length > 1, 'At least one branch must stay active')
        need(!d.orders.some((o) => o.branchId === id && ['Placed', 'Assigned', 'Out for delivery'].includes(o.status)), 'Finish or move this branch\'s open orders first')
      }
      b.active = active
      return d
    })
  },
  addUser(i: { name: string; roleId: string; branchIds: string[] | 'all' }) {
    let id = ''
    set((d) => {
      authorize(d, 'users.manage')
      const name = text(i.name, 'Name')
      const role = d.roles.find((r) => r.id === i.roleId); need(role, 'Choose a role')
      need(role.id !== 'role-owner' || i.branchIds === 'all', 'Owners work in all branches')
      need(i.branchIds === 'all' || (i.branchIds.length > 0 && i.branchIds.every((b) => d.branches.some((x) => x.id === b))), 'Choose at least one branch')
      id = uid('u')
      const u: User = { id, name, roleId: role.id, branchIds: i.branchIds, active: true }
      if (role.perms.includes('app.rider')) {
        need(i.branchIds !== 'all' && i.branchIds.length === 1, 'A rider works from exactly one branch')
        const rid = uid('r'); d.riders.push({ id: rid, name, phone: '', branchId: i.branchIds[0] }); u.riderId = rid
      }
      d.users.push(u)
      return d
    })
    return id
  },
  updateUser(id: string, i: { roleId?: string; branchIds?: string[] | 'all'; active?: boolean }) {
    set((d) => {
      authorize(d, 'users.manage')
      const u = d.users.find((x) => x.id === id); need(u, 'Unknown user')
      const owners = d.users.filter((x) => x.active && x.roleId === 'role-owner')
      const wasLastOwner = u.roleId === 'role-owner' && u.active && owners.length === 1
      if (i.roleId !== undefined) { need(d.roles.some((r) => r.id === i.roleId), 'Unknown role'); need(!(wasLastOwner && i.roleId !== 'role-owner'), 'The last owner cannot lose the owner role'); u.roleId = i.roleId }
      if (i.branchIds !== undefined) {
        need(i.branchIds === 'all' || (i.branchIds.length > 0 && i.branchIds.every((b) => d.branches.some((x) => x.id === b))), 'Choose at least one branch')
        need(!(u.roleId === 'role-owner' && i.branchIds !== 'all'), 'Owners work in all branches')
        u.branchIds = i.branchIds
        if (u.riderId) { need(i.branchIds !== 'all' && i.branchIds.length === 1, 'A rider works from exactly one branch'); riderOf(d, u.riderId).branchId = i.branchIds[0] }
      }
      if (i.active !== undefined) { need(!(wasLastOwner && !i.active), 'The last owner cannot be deactivated'); u.active = i.active }
      return d
    })
  },
  /** Create or edit a role. System roles can be edited except Owner, which always holds every admin permission. */
  saveRole(i: { id?: string; name: string; perms: Perm[] }) {
    let id = i.id ?? ''
    set((d) => {
      authorize(d, 'users.manage')
      const name = text(i.name, 'Role name')
      need(!d.roles.some((r) => r.id !== i.id && r.name.toLowerCase() === name.toLowerCase()), 'A role with that name already exists')
      need(!(i.perms.includes('app.rider') || i.perms.includes('app.customer')) || i.perms.every((p) => p.startsWith('app.')), 'App roles (rider, customer) cannot also hold admin permissions')
      if (i.id) {
        const r = d.roles.find((x) => x.id === i.id); need(r, 'Unknown role'); need(r.id !== 'role-owner', 'The Owner role is fixed')
        r.name = name; r.perms = [...new Set(i.perms)]
      } else { id = uid('role-'); d.roles.push({ id, name, perms: [...new Set(i.perms)] }) }
      return d
    })
    return id
  },
  deleteRole(id: string) {
    set((d) => {
      authorize(d, 'users.manage')
      const r = d.roles.find((x) => x.id === id); need(r, 'Unknown role'); need(!r.system, 'System roles cannot be deleted')
      need(!d.users.some((u) => u.roleId === id), 'Move the users with this role to another role first')
      d.roles = d.roles.filter((x) => x.id !== id)
      return d
    })
  },
}
