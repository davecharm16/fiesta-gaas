# Task: TECHNICAL SPEC for backlog B01-B16 (read-only; output the spec as your final answer)

Project: Fiesta Gas Delivery prototype at /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app (Vite + React 19 + TS + Tailwind v4 + shadcn base-nova; state in src/lib/store.ts external store persisted to localStorage; seed in src/lib/seed.ts; derived helpers in src/lib/derive.ts; types in src/lib/types.ts). Four roles: customer + rider (phone shell) and dispatcher + owner (sidebar admin).

## Read first
- /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/knowledge/tasks/2026-10-31-owner-gap-backlog.md (the agreed backlog B01-B16)
- /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/knowledge/tasks/reviews/owner-debate.md (focus on Round 2 and the final check)
- Code under /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src: lib/types.ts, lib/store.ts, lib/seed.ts, lib/derive.ts, pages/rider/Rider.tsx, pages/owner/Ops.tsx, pages/owner/Engage.tsx, pages/owner/Dashboard.tsx, pages/dispatcher/*.tsx, pages/customer/Customer.tsx, components/MapView.tsx, and e2e/flow.mjs
- Attached screenshots show current Remittance, Inventory, Follow-ups, Rider out-for-delivery screens.

## Rules
Design/theme: warm canvas, shadcn components only, tokens not hex, tabular numerals (.num), page-title/meta classes, soft Pill statuses, no gradients/illustrations/emoji, professional English copy (no Tagalog), 44px touch targets on phone screens.
Prototype honesty: SMS, payments, GPS are simulated; wallet references are "recorded, not verified"; never claim route optimisation or live ETA.

## Produce a TECHNICAL SPEC for implementing B01-B16 in this exact codebase, with these sections
1. types.ts changes: exact interfaces/fields, all new optional so old saved data does not crash; bump the persisted store version key if needed and say how to migrate/reset.
2. store.ts action signatures and rules (e.g. deliver() with cash received + shortReason + walletRef + emptiesReturned; remit() snapshot; loadOut/returnLoad; adjust() requiring reason; stockIn with DR number; snooze/callback; fail() with nextAttempt; reorderStops), including validation rules and what each action appends to movements/sms.
3. seed.ts additions so every new screen shows realistic data on first load (one rider with an unexplained shortage yesterday, one shortage with a reason, a low-stock size, customer-held tanks by size, a failed order awaiting re-dispatch, a snoozed customer); deterministic and not consuming the PRNG earlier than today.
4. derive.ts helper signatures (heldBySize, openOrdersNeed, stops for a rider ordered by stopSeq then distance, etc.).
5. Per-screen UI structure for: Rider list+stop map (answer: how does a rider easily know where to go), Rider job (cash due/received/reason, wallet ref, empties expected/returned), Remittance (saved handovers, orders behind each row, date picker), Inventory (count+adjust, load-out/return, held-by-size with deposit estimate, thresholds, supplier receipt), Follow-ups (snooze/callback, last order info, saved/lost redefinition), Board (unresolved failed orders), NewOrder (duplicate warning, search), Dashboard (honesty relabel).
6. File ownership split so 4 UI agents never edit the same file (Ops.tsx must be split into Inventory.tsx and Remittance.tsx by the foundation step; App.tsx imports updated).
7. Unit tests to add to src/lib (vitest) for the money and stock rules.
8. e2e additions (what to click/assert).

Be decisive and concrete; keep names consistent across sections. Output the full spec in markdown as your final message.
