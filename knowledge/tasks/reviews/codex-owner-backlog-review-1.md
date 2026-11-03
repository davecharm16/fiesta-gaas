1. **P1 — `src/lib/store.ts:134–141`** — A delivery from a truck load-out skips the stock check whenever *any* open load-out exists for that rider and day. If the rider loads one 11kg cylinder, then records two 11kg deliveries, both succeed and the depot stays unchanged after the initial load-out. The owner loses track of a cylinder.

2. **P1 — `src/lib/store.ts:100–116`** — `assign` and `startDelivery` do not validate the order’s current status. Calling them on a delivered or cancelled order can put it back into the delivery flow; completing it again deducts stock and records cash a second time. This bypasses the store’s transition rules and can create duplicate deliveries and incorrect stock or money records.

3. **P2 — `src/lib/derive.ts:160`; `src/pages/dispatcher/Board.tsx:15–19`** — The board treats only failed orders with `nextAttempt` as unresolved, and hides older failures after two days. A failed order loaded from v1 data has no `nextAttempt`; it can disappear from dispatcher work without being resolved, leaving its customer’s delivery stranded.

4. **P2 — `src/pages/owner/Dashboard.tsx:41–45, 100–102`** — “Customers to call” includes due customers who have reordered or are snoozed, even though the call list filters both groups out. Owners can be told to call customers whose follow-up is intentionally hidden, risking an unnecessary or duplicate contact.

5. **P2 — `src/lib/derive.ts:173–179`; `src/pages/owner/Engage.tsx:62–77`** — Contacts from the last seven days are counted as “Not ordered within 7 days” before their seven-day window has elapsed. The follow-up indicator can therefore overstate customers who did not reorder.
