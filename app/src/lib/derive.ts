import { computeRefill, DAY, type Refill } from './refill'
import { LOW_STOCK } from './geo'
import { SIZES, type Pricing, type Stock, type Customer, type DB, type FollowUp, type Loadout, type LoadoutLine, type Order, type RemitOrderSnapshot, type Size } from './types'

export const delivered = (d: DB) => d.orders.filter((o) => o.status === 'Delivered')
export const byId = <T extends { id: string }>(a: T[], id?: string) => a.find((x) => x.id === id)
export const mins = (a: number, b: number) => Math.round((b - a) / 60_000)
export const peso = (n: number) => '₱' + Math.round(n).toLocaleString()
export const ago = (t: number, now = Date.now()) => {
  const m = Math.round((now - t) / 60_000)
  return m < 1 ? 'just now' : m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`
}
/** Local calendar day key (YYYY-MM-DD). Never UTC: a 7am Manila delivery belongs to that Manila day. */
export const dayKey = (t: number) => {
  const x = new Date(t), p = (n: number) => String(n).padStart(2, '0')
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`
}
export const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)

/** Area average cycle per town, from customers with 2+ delivered orders. */
export function areaCycles(d: DB): Record<string, number> {
  const out: Record<string, number[]> = {}
  for (const c of d.customers) {
    const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
    const r = computeRefill(t, c.size, undefined, Date.now())
    if (r && r.source !== 'default') (out[`${c.town}|${c.size}`] ||= []).push(r.cycleDays)
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, avg(v)]))
}

export function refillOf(d: DB, c: Customer, area = areaCycles(d)): Refill | null {
  const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
  return computeRefill(t, c.size, area[`${c.town}|${c.size}`], Date.now())
}

export const refillRows = (d: DB) => {
  const area = areaCycles(d)
  return d.customers.map((c) => ({ c, r: refillOf(d, c, area) }))
}

export const ordersOf = (d: DB, customerId: string): Order[] => d.orders.filter((o) => o.customerId === customerId).sort((a, b) => b.placedAt - a.placedAt)
export const lastOrderDays = (d: DB, c: Customer) => {
  const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
  return t.length ? (Date.now() - Math.max(...t)) / DAY : Infinity
}

export const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const r = (x: number) => (x * Math.PI) / 180
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}
const FALLBACK_DEPOT = { lat: 16.043, lng: 120.334 }
/** A branch's depot position (the branch pin), used as a rider's start point. */
export const depotOf = (d: DB, branchId?: string) => d.branches.find((b) => b.id === branchId) ?? d.branches[0] ?? FALLBACK_DEPOT
/** Rider position = their latest active stop, else the depot. Stand-in for live GPS. */
export function riderPos(d: DB, riderId: string) {
  const DEPOT = depotOf(d, byId(d.riders, riderId)?.branchId)
  const active = d.orders.filter((o) => o.riderId === riderId && (o.status === 'Assigned' || o.status === 'Out for delivery')).sort((a, b) => b.assignedAt! - a.assignedAt!)[0]
  return active ? byId(d.customers, active.customerId)! : DEPOT
}
/** Nearest rider of the order's own branch. */
export function nearestRider(d: DB, o: Order) {
  const c = byId(d.customers, o.customerId)!
  return d.riders.filter((r) => r.branchId === o.branchId).map((r) => ({ r, km: km(riderPos(d, r.id), c) })).sort((a, b) => a.km - b.km)[0]
}

// ---------- owner-gap backlog helpers (pure) ----------
const zeroBy = <T,>(f: () => T) => Object.fromEntries(SIZES.map((s) => [s, f()])) as Record<Size, T>
/** Effective prices for a branch: the business default with that branch's overrides on top. */
export function pricingOf(d: DB, branchId?: string): Pricing {
  const b = d.pricing.base, o = (branchId && d.pricing.byBranch[branchId]) || {}
  return { smsCost: b.smsCost, refill: { ...b.refill, ...o.refill }, deposit: { ...b.deposit, ...o.deposit }, fees: { ...b.fees, ...o.fees } }
}
/** Order total at a branch's prices: (refill + deposit when it is a new cylinder) x qty + the town's delivery fee. */
export const orderAmount = (d: DB, branchId: string, i: { size: Size; qty: number; type: 'refill' | 'new'; town: string }) => {
  const p = pricingOf(d, branchId)
  return (p.refill[i.size] + (i.type === 'new' ? p.deposit[i.size] : 0)) * i.qty + (p.fees[i.town] ?? 0)
}
export const holdingOf = (c: Customer): Partial<Record<Size, number>> => c.heldBySize ?? { [c.size]: c.heldCylinders }
export const thresholdOf = (d: DB, branchId: string, s: Size) => d.thresholds?.[branchId]?.[s] ?? LOW_STOCK[s]
export const emptyStock = (): Stock => ({ full: zeroBy(() => 0), empty: zeroBy(() => 0) })
/** One branch's depot stock (zeros for a branch with no stock yet). */
export const stockOf = (d: DB, branchId: string): Stock => d.stocks[branchId] ?? emptyStock()
/** Depot stock summed over every branch present in `d` (a scoped view contains only the branches in scope). */
export const stockTotal = (d: DB): Stock => {
  const t = emptyStock()
  for (const s of Object.values(d.stocks)) for (const z of SIZES) { t.full[z] += s.full[z]; t.empty[z] += s.empty[z] }
  return t
}
export const openingHeldTotal = (d: DB): Partial<Record<Size, number>> => {
  const o: Partial<Record<Size, number>> = {}
  for (const h of Object.values(d.openingHeld ?? {})) for (const z of SIZES) o[z] = (o[z] ?? 0) + (h[z] ?? 0)
  return o
}

/** Cylinders out with customers, by size. depositEstimate = count x deposit; an estimate only, not a liability. */
export function heldBySize(d: DB) {
  const out = zeroBy(() => ({ cylinders: 0, depositEstimate: 0, customers: 0 }))
  for (const c of d.customers) {
    const h = holdingOf(c)
    const dep = pricingOf(d, c.branchId).deposit
    for (const s of SIZES) { const n = h[s] ?? 0; if (n > 0) { out[s].cylinders += n; out[s].customers++; out[s].depositEstimate += n * dep[s] } }
  }
  return out
}

/** Quantity on open orders vs full tanks in the depot(s) in `d`. */
export function openOrdersNeed(d: DB) {
  const stock = stockTotal(d)
  const out = zeroBy(() => ({ qty: 0, fullAvailable: 0, shortfall: 0 }))
  for (const o of d.orders) if (o.status === 'Placed' || o.status === 'Assigned' || o.status === 'Out for delivery') out[o.size].qty += o.qty
  for (const s of SIZES) { out[s].fullAvailable = stock.full[s]; out[s].shortfall = Math.max(0, out[s].qty - out[s].fullAvailable) }
  return out
}

/**
 * Rider's active stops: by stopSeq (unsequenced after sequenced); within a group, nearest to the previous stop first.
 * Straight-line distance is a tie-breaker only. This is NOT route optimisation.
 */
export function activeStops(d: DB, riderId: string): Order[] {
  const act = d.orders.filter((o) => o.riderId === riderId && (o.status === 'Assigned' || o.status === 'Out for delivery'))
  const seqOf = (o: Order) => o.stopSeq ?? Infinity
  const DEPOT = depotOf(d, byId(d.riders, riderId)?.branchId)
  const pos = (o: Order) => byId(d.customers, o.customerId) ?? DEPOT
  const out: Order[] = []
  let prev: { lat: number; lng: number } = DEPOT
  for (const q of [...new Set(act.map(seqOf))].sort((a, b) => a - b)) {
    const rest = act.filter((o) => seqOf(o) === q)
    while (rest.length) {
      let bi = 0
      rest.forEach((o, i) => { if (km(prev, pos(o)) < km(prev, pos(rest[bi]))) bi = i })
      const [o] = rest.splice(bi, 1)
      out.push(o); prev = pos(o)
    }
  }
  return out
}

export const ordersForRemit = (d: DB, riderId: string, day: string): Order[] =>
  d.orders.filter((o) => o.riderId === riderId && o.status === 'Delivered' && o.deliveredAt !== undefined && dayKey(o.deliveredAt) === day).sort((a, b) => a.deliveredAt! - b.deliveredAt!)

/** Order-level payment snapshot. Expected cash always comes from Order.amount, never from cashCollected. */
export const remitSnapshot = (orders: Order[]): RemitOrderSnapshot[] =>
  orders.map((o) => ({
    orderId: o.id, amountDue: o.amount, payment: o.payment,
    cashReceived: o.payment === 'cod' ? o.cashCollected ?? 0 : 0,
    walletAmount: o.payment === 'cod' ? 0 : o.amount,
    walletRef: o.walletRef, shortReason: o.shortReason,
  }))

export function remitTotals(d: DB, riderId: string, day: string) {
  const rem = d.remits.find((r) => r.riderId === riderId && r.day === day)
  const snap = rem?.orders ?? remitSnapshot(ordersForRemit(d, riderId, day))
  const cod = snap.filter((x) => x.payment === 'cod')
  const expectedCash = rem?.expected ?? cod.reduce((a, x) => a + x.amountDue, 0)
  const handedOver = rem ? rem.cash ?? rem.turnedOver : undefined
  const difference = handedOver === undefined ? undefined : handedOver - expectedCash
  return {
    deliveries: snap.length,
    expectedCash,
    cashReceived: cod.reduce((a, x) => a + x.cashReceived, 0),
    gcash: snap.filter((x) => x.payment === 'gcash').reduce((a, x) => a + x.walletAmount, 0),
    maya: snap.filter((x) => x.payment === 'maya').reduce((a, x) => a + x.walletAmount, 0),
    difference,
    /** Not handed over (with COD orders) or a nonzero difference with no saved reason. */
    open: rem ? difference !== 0 && !rem.reason?.trim() : cod.length > 0,
    saved: !!rem,
    handedOver,
    remit: rem,
  }
}

/** Per size: expected return = out - delivered (full), out + empties collected (empty); diff = returned - expected. */
export function loadoutRecon(d: DB, l: Loadout) {
  const day = l.day
  const mine = ordersForRemit(d, l.riderId, day)
  const out: Partial<Record<Size, { expected: LoadoutLine; returned?: LoadoutLine; diff?: LoadoutLine; mismatch: boolean }>> = {}
  for (const s of SIZES) {
    const o = l.out?.[s]; if (!o) continue
    const sold = mine.filter((x) => x.size === s)
    const expected = { full: o.full - sold.reduce((a, x) => a + x.qty, 0), empty: o.empty + sold.reduce((a, x) => a + (x.emptiesReturned ?? 0), 0) }
    const returned = l.returned ? l.returned[s] ?? { full: 0, empty: 0 } : undefined
    const diff = returned && { full: returned.full - expected.full, empty: returned.empty - expected.empty }
    out[s] = { expected, returned, diff, mismatch: !!diff && (diff.full !== 0 || diff.empty !== 0) }
  }
  return out
}

/** Failed deliveries the dispatcher has not resolved (new-style failures carry nextAttempt). */
export const unresolvedFailed = (d: DB) => d.orders.filter((o) => o.status === 'Failed' && o.nextAttempt !== undefined)

/** Follow-up state for one customer at `now`. */
export function followUpState(d: DB, customerId: string, now = Date.now()) {
  const fs = d.followUps.filter((f) => f.customerId === customerId).sort((a, b) => b.at - a.at)
  const contacts = fs.filter((f) => !f.noContact)
  const last: FollowUp | undefined = contacts[0]
  const snoozedUntil = Math.max(0, ...fs.map((f) => f.snoozedUntil ?? 0))
  const callbackAt = fs.find((f) => f.callbackAt !== undefined)?.callbackAt
  const reorderedSinceContact = !!last && d.orders.some((o) => o.customerId === customerId && o.status !== 'Cancelled' && o.placedAt > last.at)
  return { last, callbackAt, snoozed: snoozedUntil > now, snoozedUntil: snoozedUntil || undefined, reorderedSinceContact }
}

/** Contacts in [from, to): distinct customers, and those with a non-cancelled order within 7 days after their latest contact. An indicator, not causation. */
export function followUpIndicator(d: DB, from: number, to: number, now = Date.now()) {
  const latest = new Map<string, number>()
  for (const f of d.followUps) if (!f.noContact && f.at >= from && f.at < to) latest.set(f.customerId, Math.max(latest.get(f.customerId) ?? 0, f.at))
  let ordered = 0, pending = 0
  for (const [id, at] of latest) {
    if (d.orders.some((o) => o.customerId === id && o.status !== 'Cancelled' && o.placedAt > at && o.placedAt <= at + 7 * DAY)) ordered++
    else if (at + 7 * DAY > now) pending++ // window still open: not yet a "did not reorder"
  }
  return { contacted: latest.size, orderedWithin7Days: ordered, pending, notOrdered: latest.size - ordered - pending, period: { from, to } }
}
