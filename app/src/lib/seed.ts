import { branchOfTown, defaultPricing, DEPOSIT, REFILL_PRICE, TOWNS, town } from './geo'
import { SYSTEM_ROLES } from './rbac'
import { DAY } from './refill'
import { SIZES, type Branch, type Customer, type DB, type FollowUp, type Order, type Rider, type Size, type User } from './types'

const FIRST = ['Mylene', 'Rogelio', 'Janice', 'Alvin', 'Cecilia', 'Domingo', 'Fe', 'Gener', 'Hazel', 'Isidro', 'Jocelyn', 'Kristoffer', 'Leonora', 'Marlon', 'Norma', 'Oscar',
  'Perla', 'Quirino', 'Remedios', 'Saturnino', 'Teresita', 'Ulysses', 'Violeta', 'Wilfredo', 'Yolanda', 'Zaldy', 'Aileen', 'Bong', 'Corazon', 'Danilo', 'Edna', 'Fernando']
const LAST = ['Gonzales', 'Javier', 'Castillo', 'Navarro', 'Ramos', 'Salazar', 'Tamayo', 'Uy', 'Velasco', 'Yap', 'Zamora', 'Aguilar', 'Bernardo', 'Carino', 'Dizon', 'Espino']
const NAMES = ['Maria Santos', 'Jose dela Cruz', 'Ana Villanueva', 'Ramon Bautista', 'Liza Manuel', 'Pedro Ocampo', 'Grace Tolentino',
  'Carlo Mendoza', 'Rosalie Pascual', 'Dennis Cabrera', 'Joy Fernandez', 'Mario Soriano', 'Elena Padilla', 'Ricky Aquino', 'Nena Abalos',
  'Tonyo Sison', 'Marites Lopez', 'Benjie Cruz', 'Aling Cora Estrada', 'Noel Quiambao', 'Jessa Rivera', 'Arnel De Guzman', 'Lorna Macaraeg',
  'Boy Caasi', 'Sheila Evangelista', 'Rodel Ventura', 'Cherry Soliven', 'Tita Baby Nava',
  ...Array.from({ length: 92 }, (_, i) => `${FIRST[i % FIRST.length]} ${LAST[(i * 5 + Math.floor(i / FIRST.length) * 3) % LAST.length]}`)]
const STREETS = ['Purok 3', 'Purok 5', 'Zone 2', 'Rizal St.', 'Quezon Ave.', 'Mabini St.', 'Purok 1', 'Sitio Centro']
const LANDMARKS = ['Beside the barangay hall', 'Blue gate, near the chapel', 'Across the sari-sari store', 'Behind the elementary school',
  'Near the basketball court', 'Green house with mango tree', 'Beside the vulcanizing shop']

// Small deterministic PRNG so the demo data is the same on every reset.
function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
}

export function seed(now = Date.now()): DB {
  const r = rng(42)
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)]
  const branches: Branch[] = [
    { id: 'b1', name: 'Dagupan Main', town: 'Dagupan City', address: 'Arellano St., Pantal, Dagupan City', lat: 16.043, lng: 120.334, active: true },
    { id: 'b2', name: 'Alaminos Branch', town: 'Alaminos City', address: 'Quezon Ave., Poblacion, Alaminos City', lat: 16.1556, lng: 119.9816, active: true },
  ]
  const riders: Rider[] = [
    { id: 'r1', name: 'Kuya Berto', phone: '0917 555 0101', branchId: 'b2' },
    { id: 'r2', name: 'Jun Manaois', phone: '0918 555 0102', branchId: 'b1' },
    { id: 'r3', name: 'Mac Rosario', phone: '0919 555 0103', branchId: 'b1' },
    { id: 'r4', name: 'Ben Dizon', phone: '0920 555 0104', branchId: 'b2' },
  ]
  // A rider always serves their own branch's customers. One r() draw, same as before, so the demo stories keep their shape.
  const riderFor = (c: { branchId: string }, u = r()) => { const rs = riders.filter((x) => x.branchId === c.branchId); return rs[Math.floor(u * rs.length)] }
  const customers: Customer[] = NAMES.map((name, i) => {
    const t = TOWNS[i < 8 ? 0 : i % TOWNS.length]
    const b = t.barangays[Math.floor(r() * t.barangays.length)]
    return {
      id: `c${i + 1}`, branchId: branchOfTown(t.name), name, phone: `09${17 + (i % 5)} ${String(100 + i * 7).padStart(3, '0')} ${String(1000 + i * 131).slice(-4)}`,
      town: t.name, barangay: b, street: pick(STREETS), landmark: pick(LANDMARKS),
      lat: t.lat + (r() - 0.5) * 0.04, lng: t.lng + (r() - 0.5) * 0.04,
      size: ((x) => (x < 0.7 ? '11kg' : x < 0.93 ? '22kg' : '50kg'))(r()), promoConsent: r() < 0.85, heldCylinders: 1 + (r() < 0.2 ? 1 : 0),
    }
  })

  const orders: Order[] = []
  let n = 1
  const mk = (c: Customer, placedAt: number, over: Partial<Order> = {}): Order => {
    const qty = 1
    const o: Order = {
      id: `FG-${String(1000 + n++)}`, branchId: c.branchId, customerId: c.id, size: c.size, qty, type: 'refill',
      // App share grows over time (adoption story): ~12% two months ago -> ~65% now.
      channel: r() < 0.1 + 0.55 * Math.max(0, 1 - (now - placedAt) / (60 * DAY)) ? 'app' : pick(['call', 'call', 'text', 'walk-in'] as const), status: 'Delivered',
      payment: pick(['cod', 'cod', 'gcash', 'maya'] as const),
      amount: REFILL_PRICE[c.size] * qty + town(c.town).fee, placedAt, ...over,
    }
    return o
  }
  customers.forEach((c, i) => {
    const cycle = (c.size === '11kg' ? 26 : c.size === '22kg' ? 16 : 10) + Math.floor(r() * 14)
    // every 4th customer is new this month (growth story); every 7th has only ever ordered once
    const count = i % 7 === 0 || i % 4 === 1 ? 1 : 2 + Math.floor(r() * 5)
    // Last order lands between ~2 and ~cycle+9 days ago, so some customers are due/overdue.
    let last = now - Math.floor(r() * (cycle + 7)) * DAY
    const times: number[] = []
    for (let k = 0; k < count; k++) { times.unshift(last); last -= (cycle + Math.floor(r() * 7) - 3) * DAY }
    times.forEach((t, k) => {
      const placedAt = t - 8 * 3600_000 + Math.floor(r() * 4) * 3600_000
      const base = 28 + Math.floor(r() * 70)
      const rider = riderFor(c).id
      // Demo story: Kuya Berto and Alaminos City are the slow spots (a real, investigable finding).
      const mins = base - 8 + (rider === 'r1' ? 24 : 0) + (c.town === 'Alaminos City' ? 26 : 0)
      const o = mk(c, placedAt, {
        riderId: rider, assignedAt: placedAt + (3 + Math.floor(r() * 14)) * 60_000, deliveredAt: placedAt + mins * 60_000,
        empties: 1, cashCollected: 0,
        pod: { kind: r() < 0.5 ? 'otp' : 'photo', at: placedAt + mins * 60_000, lat: c.lat, lng: c.lng },
        type: k === 0 && count > 1 && r() < 0.3 ? 'new' : 'refill',
      })
      if (o.type === 'new') o.amount += DEPOSIT[c.size]
      if (o.payment === 'cod') o.cashCollected = o.amount
      orders.push(o)
    })
  })
  // A handful of failed deliveries for the analytics reasons chart.
  ;(['Wrong address', 'Wrong address', 'No one home', 'Wrong address', 'Wrong address', 'No one home', 'Wrong address'] as const).forEach((reason, i) => {
    const c = customers[(i * 5 + 3) % customers.length]
    orders.push(mk(c, (i ? now - (3 + i * 4) * DAY : now - 3 * 3600_000), { status: 'Failed', failReason: reason, riderId: riderFor(c).id, assignedAt: (i ? now - (3 + i * 4) * DAY : now - 3 * 3600_000) + 600_000 }))
  })
  // Live board for the demo (today).
  const live: [number, Partial<Order>][] = [
    [8, { status: 'Placed', channel: 'text' }],
    [20, { status: 'Placed', channel: 'call' }],
    [34, { status: 'Assigned', riderId: 'r2', assignedAt: now - 28 * 60_000 }],
    [52, { status: 'Out for delivery', riderId: 'r1', assignedAt: now - 45 * 60_000 }],
    [61, { status: 'Out for delivery', riderId: 'r2', assignedAt: now - 50 * 60_000 }],
  ]
  live.forEach(([mAgo, over], i) => {
    const c = customers[8 + i * 3]
    orders.push(mk(c, now - mAgo * 60_000, { empties: undefined, cashCollected: undefined, deliveredAt: undefined, pod: undefined, payment: i === 3 ? 'gcash' : 'cod', ...over }))
  })
  const liveOrders = orders.slice(-5) // [Placed, Placed, Assigned r1, Out r1, Out r2]

  const blastAt = now - 10 * DAY
  const recipients = customers.filter((c) => c.promoConsent).slice(0, 30).map((c) => c.id)
  const quick = (c: Customer, placedAt: number, i: number) => mk(c, placedAt, { riderId: riderFor(c, ((i % 3) + 0.5) / 3).id, assignedAt: placedAt + 6 * 60_000, deliveredAt: placedAt + 55 * 60_000, empties: 1, cashCollected: 0, pod: { kind: 'otp', at: placedAt + 55 * 60_000, lat: c.lat, lng: c.lng } })
  // Promo lift: about half the recipients order inside the 7 days after the blast (non-recipients keep their natural rate).
  recipients.forEach((id, i) => {
    const c = customers.find((x) => x.id === id)!
    const hit = orders.some((o) => o.customerId === id && o.placedAt > blastAt && o.placedAt < blastAt + 7 * DAY)
    if (!hit && i % 2 === 0) orders.push(quick(c, blastAt + (1 + (i % 5)) * DAY + 3600_000 * (9 + (i % 6)), i))
  })
  // Follow-up calls made ~2 weeks ago; "Ordered" ones are followed by a real order (call-to-reorder tracking).
  const outcomes = ['Ordered', 'Ordered', 'Ordered', 'Ordered', 'Reached', 'Reached', 'Call back later', 'Switched supplier', 'Not interested', 'Switched supplier'] as const
  const followUps: FollowUp[] = outcomes.map((outcome, i) => {
    const c = customers[2 + i * 9], at = now - (16 - i) * DAY
    if (outcome === 'Ordered') orders.push(quick(c, at + 2 * DAY, i))
    return { id: `f${i + 1}`, customerId: c.id, outcome, at }
  })
  // ---- Owner-gap backlog additions. Built AFTER all PRNG use above: no r() calls here, so existing demo stories are unchanged. ----
  customers.forEach((c) => { c.heldBySize = { [c.size]: c.heldCylinders } })
  // Explicit per-size holdings so every size has a count (some customers hold a second size).
  const c3 = customers[2], c9 = customers[8], c20 = customers[19]
  c3.heldBySize = { [c3.size]: c3.heldCylinders, ...(c3.size === '50kg' ? {} : { '50kg': 1 }) }
  c9.heldBySize = { [c9.size]: c9.heldCylinders, ...(c9.size === '22kg' ? {} : { '22kg': 1 }) }
  c20.heldBySize = { [c20.size]: c20.heldCylinders, ...(c20.size === '11kg' ? {} : { '11kg': 1 }) }
  customers.forEach((c) => { c.heldCylinders = SIZES.reduce((a, z) => a + (c.heldBySize?.[z] ?? 0), 0) })
  const openingHeld = Object.fromEntries(branches.map((b) => [b.id, Object.fromEntries(SIZES.map((z) => [z, customers.filter((c) => c.branchId === b.id).reduce((a, c) => a + (c.heldBySize?.[z] ?? 0), 0)]))])) as Record<string, Partial<Record<Size, number>>>

  const local = (daysBack: number, h: number) => { const x = new Date(now); x.setDate(x.getDate() - daysBack); x.setHours(h, 0, 0, 0); return x.getTime() }
  let en = n // continue the FG-#### sequence
  const ex = (c: Customer, over: Partial<Order>): Order => ({
    id: `FG-${1000 + en++}`, branchId: c.branchId, customerId: c.id, size: c.size, qty: 1, type: 'refill', channel: 'call', status: 'Delivered', payment: 'cod',
    amount: REFILL_PRICE[c.size] + town(c.town).fee, placedAt: now, ...over,
  })
  const delivered = (c: Customer, riderId: string, hour: number, over: Partial<Order>): Order => {
    const at = local(1, hour)
    return ex(c, { riderId, placedAt: at - 90 * 60_000, assignedAt: at - 80 * 60_000, deliveredAt: at, emptiesExpected: 1, emptiesReturned: 1, empties: 1, pod: { kind: 'otp', at, lat: c.lat, lng: c.lng }, ...over })
  }
  const y1 = delivered(customers[41], 'r1', 10, {}); y1.cashCollected = y1.amount - 120 // unexplained shortage
  const y2 = delivered(customers[40], 'r2', 11, {}); y2.cashCollected = y2.amount - 200; y2.shortReason = 'Customer paid part, balance to be collected on next delivery'
  const y3 = delivered(customers[42], 'r3', 12, { payment: 'gcash', walletRef: 'GC-48213', cashCollected: 0 })
  const y4 = delivered(customers[43], 'r3', 14, { payment: 'maya', walletRef: 'MY-77120', cashCollected: 0 })
  // Rider r1 (Alaminos branch) route: three active stops in Alaminos City, in stop order. Rider r2 (Dagupan Main): two stops.
  const alam = customers.filter((c) => c.branchId === 'b2' && c.id !== customers[17].id)
  liveOrders[3].stopSeq = 1 // out for delivery (r1)
  liveOrders[4].stopSeq = 1 // out for delivery (r2)
  liveOrders[2].stopSeq = 2 // assigned (r2)
  const stop2 = ex(alam[0], { status: 'Assigned', riderId: 'r1', assignedAt: now - 20 * 60_000, placedAt: now - 30 * 60_000, stopSeq: 2 })
  const stop3 = ex(alam[1], { status: 'Assigned', riderId: 'r1', assignedAt: now - 15 * 60_000, placedAt: now - 25 * 60_000, stopSeq: 3 })
  const failed = ex(customers[55], { status: 'Failed', riderId: 'r2', assignedAt: now - 5 * 3600_000, placedAt: now - 6 * 3600_000, failReason: 'No one home', failedContact: 'not-contacted', nextAttempt: now + 20 * 3600_000 })
  orders.push(y1, y2, y3, y4, stop2, stop3, failed)
  // Follow-up states: callback due soon, a snooze, and recorded lost reasons.
  followUps[6] = { ...followUps[6], callbackAt: now + 6 * 3600_000 }
  followUps[4] = { ...followUps[4], snoozedUntil: now + 3 * DAY }
  followUps[7] = { ...followUps[7], lostReason: 'Price' }
  followUps[8] = { ...followUps[8], lostReason: 'Not due' }
  followUps[9] = { ...followUps[9], lostReason: 'Switched supplier' }

  return {
    customers, riders, orders: orders.sort((a, b) => a.placedAt - b.placedAt),
    sms: [], followUps,
    blasts: [{ id: 'b1', message: 'Fiesta Gas promo: free delivery this weekend on any refill! Reply STOP to opt out.', segment: 'Weekend promo · consented customers', recipients, at: blastAt }],
    movements: [
      { id: 'm2', branchId: 'b1', at: now - 1 * DAY, kind: 'adjustment', size: '22kg', full: -1, empty: 0, note: 'Physical count: one cylinder with a damaged valve set aside', reason: 'Damaged valve' },
      { id: 'm1', branchId: 'b1', at: now - 2 * DAY, kind: 'stock-in', size: '11kg', full: 40, empty: 0, note: 'Supplier receipt DR-20418', drNumber: 'DR-20418', emptiesHandedBack: 0 },
    ],
    remits: [],
    // Business-wide prices; Alaminos charges a little more per 11kg refill to cover transport (override example).
    pricing: { base: defaultPricing(), byBranch: { b2: { refill: { '11kg': 920 } } } },
    branches, roles: SYSTEM_ROLES.map((r) => ({ ...r })), users: seedUsers(riders),
    // Dagupan 11kg is deliberately below its alert level (15); Alaminos is low on 22kg and 50kg (low-stock story).
    stocks: {
      b1: { full: { '11kg': 9, '22kg': 10, '50kg': 4 }, empty: { '11kg': 20, '22kg': 6, '50kg': 3 } },
      b2: { full: { '11kg': 22, '22kg': 4, '50kg': 2 }, empty: { '11kg': 10, '22kg': 3, '50kg': 1 } },
    },
    seededAt: now,
    loadouts: [], openingHeld,
    thresholds: { b1: { '11kg': 15, '22kg': 8, '50kg': 3 }, b2: { '11kg': 15, '22kg': 8, '50kg': 3 } },
  }
}
export type { Size }

/** Demo staff accounts. Ids are stable so sessions survive a reseed. */
export function seedUsers(riders: Rider[]): User[] {
  return [
    { id: 'u-c1', name: 'Maria Santos', roleId: 'role-customer', branchIds: ['b1'], active: true, customerId: 'c1' },
    { id: 'u-d1', name: 'Ana Reyes', roleId: 'role-dispatcher', branchIds: ['b1'], active: true },
    { id: 'u-d2', name: 'Rico Pascual', roleId: 'role-dispatcher', branchIds: ['b2'], active: true },
    ...riders.map((r): User => ({ id: `u-${r.id}`, name: r.name, roleId: 'role-rider', branchIds: [r.branchId], active: true, riderId: r.id })),
    { id: 'u-m2', name: 'Liza Gomez', roleId: 'role-manager', branchIds: ['b2'], active: true },
    { id: 'u-owner', name: 'Dave Charm', roleId: 'role-owner', branchIds: 'all', active: true },
  ]
}
