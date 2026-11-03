# Owner gap backlog (prototype), 2026-10-31

Source: knowledge/tasks/reviews/owner-debate.md (Owner A Claude, Owner B Codex). All items below were agreed by both owners (B's round-2 verdict: AGREE on all 18). Items 15 (safety gate) merged into 5, and 17/18 trimmed: blast confirm is deferred, dashboard relabel kept. All figures stay visibly "simulated". Paths relative to app/src.

Shared-file warning: lib/types.ts, lib/store.ts, lib/seed.ts are touched by many items. Do the data-model edits for each lane in one pass per lane.

## Lane A, rider cash (pages/rider/Rider.tsx, pages/owner/Ops.tsx Remittance)
1. Expected COD from order price, reason required for shortfall (S). Rider.tsx Job: show amount due (order.amount), amount received, required reason dropdown when less. types: Order.shortReason. store.deliver takes reason.
2. Saved handover per rider/day (M). types Remit: expected, cash, wallet, receiver, at, reason, edits. store.remit saves a snapshot; later edits need a reason; unexplained difference shows Open on the rider. Ops.tsx Remittance.
3. Cash vs GCash/Maya split with reference number (S). Order.walletRef; Rider.tsx Job input for gcash/maya; Remittance shows cash due/received, GCash and Maya totals with references. Not labelled "verified".
4. Orders behind each remittance row plus date picker over saved handovers (M). Ops.tsx only, reads d.orders by rider/day.

## Lane B, rider route (pages/rider/Rider.tsx Jobs, components/MapView.tsx, lib/geo.ts)
5. Rider stop list: numbered stops, landmark, town, map pin view, Call/Text/Navigate (maps URL), simple manual reorder (up/down), next stop highlighted, no ETA. Safety checklist gates Start (existing CHECKS). types: Order.stopSeq. (M)

## Lane C, cylinders (pages/owner/Ops.tsx Inventory, lib/derive.ts)
6. Rider load-out and end-of-shift return by size, full and empty, flag difference (M). types: Loadout; store.loadOut/returnLoad; Ops Inventory panel.
7. Empties expected vs returned at delivery; default to qty for swaps; "tank owed" record when short (S). Rider.tsx Job, store.deliver, Order.emptiesExpected, Customer.heldCylinders updated from owed.
8. Customer-held cylinders by size and status with one read-only deposit estimate per size, fed by item 7 (M). derive.ts heldBySize; opening count in seed.ts; replaces hard-coded 145.
9. Physical count beside system count; adjustment needs reason code (S). store.adjust writes Movement kind adjustment.
10. Low-stock warning vs owner-set threshold per size, plus "open orders need X, you have Y" (S). types DB.thresholds; Ops Inventory; optional banner on Dashboard.tsx.
11. Supplier receipt: qty, DR number, empties handed back, mismatch note (S). Extend store.stockIn and Movement.

## Lane D, follow-ups and dispatch (pages/owner/Engage.tsx FollowUps, pages/dispatcher/*)
12. Follow-up snooze, callback date, hide recently reordered; show last order date/size/amount, phone, town (M). types FollowUp.callbackAt, lostReason; store.logFollowUp extended; Engage.tsx.
13. Failed delivery stays visible until resolved, contact status, next-attempt time in SMS (S). store.fail/requeue, Order.nextAttempt; Board.tsx; Customer.tsx copy fix (no false "re-dispatch shortly").
14. Duplicate-order warning; phone, landmark, last order in customer search (S). pages/dispatcher/NewOrder.tsx, Customers.tsx.

## Lane E, dashboard (pages/owner/Dashboard.tsx, Engage.tsx)
15. Saved/lost redefined as "ordered within 7 days of contact" with period, labelled an indicator; lost-reason dropdown (S). Engage.tsx plus derive.ts helper.
16. Dashboard relabel: order value, cash collected, e-wallet recorded, deposits; remove app-share chart; promo lift marked simulated and moved down (S). Dashboard.tsx, components/charts.tsx.

## Cut
Live GPS/ETA/nearest-rider precision/route optimisation/density map; wallet tick-off and hard day lock; multi-stage shortage ledger; money audit log beyond edit reason; mid-day cash drop; load-capacity batching; refill-cycle forecast and confidence; inventory valuation, deposit liability, supplier cost/margin; value-and-cylinder ranking and lapsed tier; promo lift/break-even/app-share chart; dispatcher-visible safety record, offline queue, damaged bucket, POD distance flag; 30-day rollups and CSV; pin confirm on every order; blast confirm (deferred, easiest to cut).

## Rider answer
Open My deliveries: stops are numbered in visit order with the next one highlighted, each showing customer, barangay/town, full address and landmark. Tap Navigate to open maps at that pin, Call or Text if the house is hard to find, or switch to the map view to see all of today's pins. You can nudge the order up or down yourself; it is not auto-optimised and shows no live ETA.

## Outcome (implemented 2026-10-31)
- B01-B16 built. Process: Claude owner (4 lenses) + Codex owner independent analyses (40 + 23 gaps) -> 2-round debate (`reviews/owner-debate.md`) -> agreed backlog -> Codex wrote the technical spec (`reviews/codex-owner-backlog-spec.md`) -> foundation agent (lib rules + 30 unit tests) -> 4 parallel screen agents -> e2e extended -> Codex review 1 (5 findings: 4 fixed, 1 rejected) -> Codex review 2 (6 findings: placeOrder quantity validation, cancel-after-delivered block, callback-today fixed; 3 rejected: storage-shape validation, phone-width admin tables x2).
- Money/stock rules live in the store (shortfall needs reason, wallet ref, handover edit reason, count adjust reason, truck stock, status guards). 32 unit tests.
- Found by looking at the screenshots (not by Codex): Remittance and Follow-ups tables were clipped at desktop width; fixed by merging GCash/Maya into one E-wallet column and letting cells wrap.
- Not built (cut by both owners): see the cut list above.

## Follow-up 2026-11-01
- Owner screens on phones: `Table stack` prop (cards below md, labels from header row) on Remittance, Inventory, Follow-ups, promo table, dispatcher board.
- Rider app rebuilt map-first (Route/Truck/Cash/Done tabs; rider = signed-in rider; out-for-delivery sorts first).
- Dashboard charts restored (orders/day area, avg delivery time bars with average line, app vs staff weekly stack). Lesson: the earlier "decision tables only" cut over-corrected; the owner wants trend charts. Recharts screenshots need >1s wait.

## Multi-branch + RBAC (2026-11-01)
Plan in `best-practices/rbac-and-branches.md` and `product_docs/domain-features/organization-feature-brief/`.
Built: Branch registry (add/edit/deactivate, map pin), `branchId` on customers/riders/orders/movements, stock + thresholds + opening-held per branch, stock transfer, rider assignment limited to own branch, permission-based roles (system + custom), user registry with branch scope, store-level `authorize()` on every action, UI nav/guards/branch switcher, branch comparison on the dashboard. Migration: v1/v2 snapshots become one branch "Main branch".
Not done: server-side auth (client-side only), per-permission-per-branch matrix, audit log UI, reassigning an order to another branch.
