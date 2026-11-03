# Technical spec: backlog B01–B16

This spec targets the current Fiesta Gas Vite, React 19, TypeScript and localStorage prototype. Keep the warm canvas, shadcn components, token colors, `.num` tabular numerals, `page-title` and `meta` classes, and soft `Pill` statuses. Phone controls must remain at least 44px tall. Use clear English copy. SMS, GPS and payments are simulated; e-wallet amounts are **recorded, not verified**. Do not imply route optimization or live ETA.

## 1. `lib/types.ts` changes

Add fields as optional where saved v1 data may lack them. Keep existing fields and their meanings intact. New records written by the updated store should populate the fields required by their workflows.

```ts
export type FollowUpLossReason =
  | 'Switched supplier'
  | 'Price'
  | 'Not due'
  | 'No response'
  | 'Other'

export type MovementKind =
  | 'delivery'
  | 'stock-in'
  | 'adjustment'
  | 'load-out'
  | 'load-return'

export interface Customer {
  // existing fields...
  heldBySize?: Partial<Record<Size, number>>
}

export interface Order {
  // existing fields...
  shortReason?: string
  walletRef?: string
  emptiesExpected?: number
  emptiesReturned?: number
  stopSeq?: number
  failedContact?: 'not-contacted' | 'contacted'
  nextAttempt?: number
}

export interface FollowUp {
  // existing fields...
  callbackAt?: number
  snoozedUntil?: number
  lostReason?: FollowUpLossReason
}

export interface Movement {
  // existing fields...
  kind: MovementKind
  reason?: string
  riderId?: string
  orderId?: string
  drNumber?: string
  emptiesHandedBack?: number
}

export interface RemitOrderSnapshot {
  orderId: string
  amountDue: number
  payment: Payment
  cashReceived: number
  walletAmount: number
  walletRef?: string
  shortReason?: string
}

export interface Remit {
  riderId: string
  day: string
  // Retain for reading old records; new records use the detailed snapshot below.
  turnedOver: number
  expected?: number
  cash?: number
  gcash?: number
  maya?: number
  receiver?: string
  at?: number
  reason?: string
  edits?: { at: number; reason: string }[]
  orders?: RemitOrderSnapshot[]
}

export interface LoadoutLine {
  full: number
  empty: number
}

export interface Loadout {
  riderId: string
  day: string
  outAt?: number
  returnedAt?: number
  out?: Partial<Record<Size, LoadoutLine>>
  returned?: Partial<Record<Size, LoadoutLine>>
}

export interface DB {
  // existing fields...
  loadouts?: Loadout[]
  openingHeldBySize?: Partial<Record<Size, number>>
  thresholds?: Partial<Record<Size, number>>
}
```

For existing customers, derive `heldBySize` from `size` and `heldCylinders` only as a compatibility fallback. Do not overwrite a present per-size count. `openingHeldBySize` records the seed opening balance; subsequent customer-held changes are reflected by delivery actions. Keep customer-held counts split by size. Status can be represented by the existing per-customer count plus owed/held records derived from deliveries; do not claim financial liability accounting.

Bump `KEY` in `store.ts` from `fiesta-gas-demo-v1` to `fiesta-gas-demo-v2`. On load, parse and normalize v1 data into v2-compatible shape: initialize missing `heldBySize`, `openingHeldBySize`, `thresholds`, and `loadouts`; initialize missing movement metadata as absent; preserve old orders, remittances, follow-ups and movements. Keep `remit.turnedOver` and the legacy `cashCollected` field so existing records still render. If normalization fails, fall back to `seed()`. `actions.reset()` should seed the current schema and write only the v2 key. Do not silently discard the v1 key until the normalized v2 snapshot has been successfully persisted.

## 2. `store.ts` actions and rules

Use integer pesos and cylinder counts. Reject invalid or negative amounts, fractional or non-positive quantities where a positive count is required, unknown ids, and state transitions that are no longer valid. Existing `set()` already clones the DB and emits; retain that pattern. Do not add network calls.

- `deliver(orderId, input)`  
  Signature:

  ```ts
  deliver(orderId: string, input: {
    pod: NonNullable<Order['pod']>
    cashReceived: number
    shortReason?: string
    walletRef?: string
    emptiesReturned: number
  }): void
  ```

  Only transition an `Out for delivery` order. Expected empties default to `qty` for a refill swap and `0` for a new tank. Store `emptiesExpected`, `emptiesReturned`, `cashCollected` for legacy reads, and payment fields. For COD, cash received may be below or above `amount`, but a difference requires a non-empty reason. For GCash/Maya, record the order amount as the corresponding wallet amount and require a reference string; do not call it verified. Add a `delivery` movement with full `-qty`, empty `+emptiesReturned`, order id and a concise note. Update the customer’s `heldBySize`/held count when returned empties differ from expected: a short return increases customer-held tanks; excess return decreases held tanks, clamped at zero. Send a delivery SMS only after a successful transition. The current UI already requests POD; retain that flow.

- `remit(riderId, day, input)`  
  Signature:

  ```ts
  remit(riderId: string, day: string, input: {
    cash: number
    receiver: string
    reason?: string
  }): void
  ```

  Build a snapshot of that rider’s delivered orders on `day`, sorted by delivery time. Expected is the sum of order amounts for COD orders; also snapshot cash received, GCash and Maya totals, wallet references, and any short reasons. Save exactly one current handover per rider/day. Store `turnedOver = cash` for backward compatibility, plus `expected`, `cash`, receiver, timestamp and order snapshots. Difference is `cash - expected`; if nonzero, require a reason to save. On a later save, require a non-empty edit reason and append `{ at, reason }` to `edits`. Do not update orders or create an SMS from a remittance save. The screen must show unexplained differences as Open; a saved difference reason can clear that state. An absent handover is “Not handed over,” not a zero difference.

- `loadOut(riderId, day, lines)`  
  Signature:

  ```ts
  loadOut(
    riderId: string,
    day: string,
    lines: Partial<Record<Size, LoadoutLine>>
  ): void
  ```

  Permit one initial load-out per rider/day; each line has non-negative integer full and empty quantities. Save the snapshot and append one `load-out` movement per size with negative depot full/empty values and rider id. Reject load-out exceeding depot stock.

- `returnLoad(riderId, day, lines)`  
  Same line shape as `loadOut`. Require a prior load-out and no existing return. Add returned full/empty counts to depot stock, save the return snapshot/time, and append `load-return` movement per size. Compare returned counts against out counts and show any mismatch on Inventory. Do not automatically “fix” an unexplained difference.

- `adjust(size, input)`  
  Signature:

  ```ts
  adjust(size: Size, input: {
    fullCount: number
    emptyCount: number
    reason: string
  }): void
  ```

  Require non-negative integer counts and a non-empty reason code. Set stock to the physical counts and append an `adjustment` movement containing the signed delta and reason.

- `stockIn(size, qty, input)`  
  Signature:

  ```ts
  stockIn(size: Size, qty: number, input: {
    drNumber: string
    emptiesHandedBack: number
    mismatchNote?: string
  }): void
  ```

  Require positive integer quantity, non-empty DR number, and a non-negative integer empty return no greater than depot empty stock. Add full stock, subtract empties handed back, and append a `stock-in` movement with DR number and any mismatch note. Do not include supplier cost or margin.

- `logFollowUp(customerId, outcome, input?)`  
  Signature:

  ```ts
  logFollowUp(
    customerId: string,
    outcome: Outcome,
    input?: { callbackAt?: number; lostReason?: FollowUpLossReason }
  ): void
  ```

  Save callback date when supplied. For “Call back later,” require a callback date. For “Switched supplier” or “Not interested,” require a lost reason. Do not create SMS automatically. An “Ordered” log is not attribution: the derive helper computes whether an order was placed within seven days after contact.

- `snoozeFollowUp(customerId, until)`  
  Require a future timestamp and suppress that customer from the active follow-up list until it expires. Do not create SMS.

- `fail(orderId, input)`  
  Signature:

  ```ts
  fail(orderId: string, input: {
    reason: string
    contacted: boolean
    nextAttempt: number
  }): void
  ```

  Require a non-empty reason and future next-attempt timestamp. Only allow an assigned or out-for-delivery order to fail. Set status, failure reason, contact status and next-attempt time. Text the customer that delivery could not be completed and state the next attempt time; never promise immediate re-dispatch. Keep the order visible as unresolved.

- `requeue(orderId, riderId?)`  
  Resolve an unresolved failed order back to `Placed` when no rider is specified, or `Assigned` with rider and assignment time when supplied. Clear failure/contact/next-attempt fields. Send a status SMS that gives the updated state without claiming a precise arrival time.

- `reorderStops(riderId, orderedOrderIds)`  
  Require each id to be a unique active order assigned to that rider, and update `stopSeq` to 1-based positions. No SMS or movement.

- `sendBlast(message, segment, recipients)`  
  Add a confirmation step in UI before invoking the existing action. Keep recipient consent filtering. Record blast and simulated SMS only after confirmation. Label send and history as simulated.

- `placeOrder(...)`  
  Preserve existing amount calculation. Duplicate detection is a UI warning, not a hard store block, so a dispatcher can intentionally proceed.

## 3. `seed.ts` additions

Keep seed output deterministic for a fixed `now`. The current seeded customer/order generator consumes a seeded PRNG in a specific sequence. Add feature-specific seed records only after the existing generator, blast, quick order and follow-up generation are complete; do not add calls to `r()` before or inside existing generation. This preserves existing demo stories and PRNG picks.

Seed these explicit additions using fixed ids, fixed relationships and timestamps derived from `now`:

- A delivered COD order yesterday for rider `r1` with amount/expected cash greater than cash received, no `shortReason`; it should appear as an unexplained shortage in yesterday’s handover view.
- A second delivered COD order yesterday for a different rider with a shortfall and an explanatory reason.
- A low-stock size: set 11kg full stock below its threshold, while leaving 22kg/50kg at realistic nonzero levels.
- Per-size opening customer-held counts, derived deterministically from customers’ sizes and `heldCylinders`, then make the seed’s baseline total legible. Add at least one explicit held-by-size count for each size.
- One assigned order with a low `stopSeq` and a nearby active stop with a later sequence, ensuring the rider list and map contain multiple visible pins.
- One failed order awaiting re-dispatch with `failedContact` and a future `nextAttempt`.
- One follow-up customer with future `snoozedUntil`; another with `callbackAt` due soon.
- Existing movements should include a realistic stock-in with DR number and a reasoned adjustment example if space permits.

Use explicit additions after existing generated arrays are built. Do not re-use the same customer/order ids or change the PRNG’s call order. Ensure all seeded `deliveredAt` values are on the intended local calendar day for the demo, not inferred from UTC-only date slicing.

## 4. `derive.ts` helper signatures

Add pure helpers and keep the existing exports:

```ts
export function heldBySize(d: DB): Record<Size, {
  cylinders: number
  depositEstimate: number
  customers: number
}>

export function openOrdersNeed(d: DB): Record<Size, {
  qty: number
  fullAvailable: number
  shortfall: number
}>

export function activeStops(d: DB, riderId: string): Order[]

export function ordersForRemit(d: DB, riderId: string, day: string): Order[]

export function remitTotals(d: DB, riderId: string, day: string): {
  deliveries: number
  expectedCash: number
  cashReceived: number
  gcash: number
  maya: number
  difference?: number
  open: boolean
}

export function followUpIndicator(
  d: DB,
  from: number,
  to: number
): { contacted: number; orderedWithin7Days: number; period: { from: number; to: number } }
```

- `heldBySize`: sum per-size customer holdings, using the compatibility fallback only when `heldBySize` is absent. Multiply count by `DEPOSIT[size]` for a plainly labelled estimate; count distinct customers with a positive holding.
- `openOrdersNeed`: sum quantities of orders in `Placed`, `Assigned` or `Out for delivery` by size; compare to current `stock.full`; shortfall is `max(0, qty - fullAvailable)`.
- `activeStops`: assigned/out-for-delivery orders for the rider, sorted by `stopSeq` (missing sequence sorts after sequenced stops), then straight-line distance from the prior stop (depot for the first stop). Distance is a tie-breaker only; do not label it optimized.
- `ordersForRemit`: delivered orders whose local day key matches the selected day, sorted by rider and delivery time. Add a local calendar day helper because current `dayKey()` uses UTC ISO dates; use the same local day convention for rider/remittance screens.
- `remitTotals`: expected cash is order-derived COD amount, cash received is order cash, and GCash/Maya totals are derived from matching delivered orders. `open` is true for a nonzero difference without a saved reason or when no handover exists for delivered COD orders.
- `followUpIndicator`: for contacts in `[from, to)`, count distinct contacted customers and distinct customers with an order placed in the seven days after their latest qualifying contact. Exclude cancelled orders. Label as an indicator, not saved revenue or causal impact.

## 5. Per-screen UI structure

### Rider deliveries: list and stop map (`pages/rider/Rider.tsx`, `components/MapView.tsx`)

Keep the pre-shift safety checklist as the gate for Start delivery. Today’s active orders are ordered by `stopSeq`, then distance for ties. Provide a list/map toggle. Each stop card shows sequence number, next-stop emphasis, customer, phone, size/quantity, payment due, status, full address, landmark and 44px minimum Call, Text and Navigate actions. A map shows today’s pins with numbered labels, selected-stop highlighting and card/map selection sync. Navigate opens a maps URL for that customer pin. Call uses `tel:`; Text opens `sms:` and is simulated. Reorder with explicit Move up/Move down controls that call `reorderStops`; do not describe the order as optimized and do not show ETA or live rider position.

### Rider job

Retain customer/address/map and proof-of-delivery flow. In the completion form show:

- “Amount due” from `order.amount`.
- “Cash received” input for COD.
- Required shortfall/overage reason whenever received differs from due.
- For GCash/Maya: recorded amount plus reference number input, with “Recorded, not verified” copy.
- “Empties expected” and “Empties returned” controls; expected defaults to quantity for refill swap, zero for new tank.
- Existing customer code/photo POD and failure form.

Keep all phone buttons at least 44px tall. Validate before enabling confirmation and repeat the rules in store action.

### Remittance (`pages/owner/Remittance.tsx`)

Use a date picker defaulting to today and rows for each rider. Show delivery count, expected COD, cash received, GCash, Maya and references, amount handed over, difference and status. Expand each rider row to list snapshot/current orders with id, customer, COD due/received or wallet amount/reference, and shortage reason. Save receiver name/time and difference reason. Saved handovers remain viewable on past dates; edits require a reason. Show unexplained discrepancy as Open. Label wallet figures “recorded, not verified.”

### Inventory (`pages/owner/Inventory.tsx`)

Top section: by-size full and empty system counts, physical counts, adjustment form with reason, threshold input and status pill. Show “Open orders need X; you have Y” for each size and low-stock status against owner threshold.

Additional cards:
- Rider load-out and return by day/rider/size, full and empty counts, mismatch indicator.
- Customer-held cylinders by size and status/count, opening count, and read-only deposit estimate explicitly labelled “estimate.”
- Supplier receipt form: size, quantity, DR number, empties handed back, mismatch note.
- Recent movements table including adjustment reason, rider, order or DR number where present.

No inventory valuation, deposit liability, supplier cost or margin.

### Follow-ups (`pages/owner/Engage.tsx`)

Keep due/overdue ordering. Show customer, phone, town, last order date/size/amount, expected refill status, last contact and outcome. Add callback date and snooze controls; suppress recently reordered customers and currently snoozed customers from active rows. Lost outcomes require a lost-reason dropdown. Display a date range and badges labelled **“Ordered within 7 days of contact”** and **“Not ordered within 7 days”**; explicitly label these indicators and do not call them saved/lost revenue or claim causation. Keep SMS reminders labelled simulated.

### Dispatcher board (`pages/dispatcher/Board.tsx`)

Add an “Unresolved failed deliveries” section above/beside normal open work. Show reason, customer contact state, next-attempt time, address and actions to mark contacted, requeue, or assign a rider. Failed orders stay visible until the operator resolves/requeues them. Do not requeue automatically.

### New order and customer search (`pages/dispatcher/NewOrder.tsx`, `Customers.tsx`)

Search by customer name or phone and display phone, landmark, town and last order date/size/amount. When a matching customer has an active non-cancelled order, show a duplicate warning with order status and timestamp. Keep a deliberate “Place another order” action; warning does not block order creation. Apply the same useful identity details in Customers search/list.

### Dashboard (`pages/owner/Dashboard.tsx`, `components/charts.tsx`)

Rename “Revenue” to “Order value.” Add separate totals for cash collected, e-wallet recorded and deposits; label e-wallet as recorded, not verified. Remove the app-share chart. Move promo lift lower and relabel it **Simulated order activity after blast** with clear text that it is not causal proof. Keep performance numbers factual and do not introduce ETA, routing or margin claims.

### Blast (`pages/owner/Engage.tsx`)

Before sending, show the selected recipients and consent status, message preview and simulated status in a confirmation dialog. Only confirmed action calls `sendBlast`. The final send action remains simulated.

## 6. File ownership split for four UI agents

Foundation work happens first: split the two exports currently in `Ops.tsx` into `pages/owner/Inventory.tsx` and `pages/owner/Remittance.tsx`, update imports/routes in `App.tsx`, then remove `Ops.tsx`. Keep `types.ts`, `store.ts`, `seed.ts` and shared derive helpers under one foundation owner; UI agents consume their finalized interfaces.

| Owner | Files owned | Screen |
|---|---|---|
| UI agent 1 | `pages/rider/Rider.tsx`, `components/MapView.tsx` | Rider list/map and job |
| UI agent 2 | `pages/owner/Remittance.tsx` | Remittance |
| UI agent 3 | `pages/owner/Inventory.tsx` | Inventory |
| UI agent 4 | `pages/owner/Engage.tsx`, `pages/dispatcher/Board.tsx`, `pages/dispatcher/NewOrder.tsx`, `pages/dispatcher/Customers.tsx`, `pages/customer/Customer.tsx` | Follow-ups, failed orders, duplicate warning and customer copy |
| Dashboard/foundation owner | `pages/owner/Dashboard.tsx`, `components/charts.tsx`, `App.tsx`, `lib/*` | Dashboard and shared model/store/seed/derive/migration |

No UI agent edits `Ops.tsx`; it is removed in the foundation step. Do not have two agents edit `App.tsx` or shared library files.

## 7. Unit tests under `src/lib` (Vitest)

Add `money.test.ts` and `stock.test.ts`; use small hand-built DB fixtures and fixed timestamps.

`money.test.ts`:

- COD expected cash comes from `Order.amount`, not `cashCollected`.
- Cash under/over expected requires a reason; exact amount does not.
- GCash and Maya totals are separated and include references; labels remain recorded, not verified.
- Handover snapshot includes order-level payments and matches date/rider.
- First save stores receiver/time; later save without edit reason is rejected; with reason appends an edit.
- Unexplained nonzero remittance remains open; explained difference is visible but not open.
- Legacy `Remit.turnedOver` data can still be read.

`stock.test.ts`:

- Delivery deducts full stock, adds returned empties, and records a movement.
- Swap expected empties defaults to quantity; new tank defaults to zero.
- Short returned empties increases customer-held count by size; excess return reduces it without going negative.
- Load-out deducts stock, return adds stock; mismatch is detectable.
- Physical adjustment sets exact counts and requires reason.
- Supplier receipt adds full stock, subtracts empties handed back, and records DR number/mismatch note.
- `heldBySize` uses per-size holdings and compatibility fallback; estimate equals count times deposit.
- `openOrdersNeed` includes placed, assigned and out-for-delivery orders and computes shortfall correctly.

Test store validation by exercising actions against a reset fixture or extracting pure rule validators that actions call. Do not weaken action validation to simplify tests.

## 8. E2E additions (`src/e2e/flow.mjs`)

Extend the existing end-to-end flow with these user-visible assertions:

1. As rider `r1`, open My deliveries; assert sequence numbers, next-stop highlight, landmark/address, multiple map pins, and Call/Text/Navigate actions. Move a stop and assert the sequence updates. Verify the UI contains no live ETA/optimized claim.
2. Open a COD job; assert amount due comes from the order. Submit a short cash amount without a reason and assert completion is blocked; add a reason and complete. Assert the remittance row reflects expected vs received.
3. Complete a GCash and a Maya order with references; assert separate recorded totals and references on Remittance and the “not verified” label.
4. Submit a swap with fewer empties returned than expected; assert held-by-size increases and delivery movement reflects actual empties. Submit a new-tank order and assert expected empties default to zero.
5. In Remittance, select yesterday, expand the seeded unexplained rider row and inspect orders; assert Open state. Save a handover with receiver and reason, reload or revisit the date, and assert the saved snapshot remains. Edit and assert edit reason is required.
6. In Inventory, assert low-stock 11kg and open-order need; adjust physical count with a reason; record supplier receipt with DR number and empties; record rider load-out/return and assert movement/mismatch view.
7. In Follow-ups, snooze a customer and assert removal; set a callback and assert it is shown; log a lost outcome and reason; verify a recently reordered customer is suppressed. Assert period-scoped seven-day indicator wording.
8. On Dispatcher Board, assert seeded failed order remains visible with next-attempt time; requeue/assign it and assert it leaves unresolved failures. Verify customer SMS uses the next-attempt time and makes no immediate re-dispatch promise.
9. In New Order, search by phone/name; assert phone, landmark and recent order detail. Attempt an active duplicate and assert a warning appears but the deliberate second-order action remains available.
10. On Dashboard, assert “Order value,” separate cash/e-wallet/deposits, “recorded, not verified,” no app-share chart, and promo activity explicitly marked simulated.

All assertions should use stable labels or `data-testid` attributes where practical. Reset demo state before the flow so seeded conditions are deterministic.
