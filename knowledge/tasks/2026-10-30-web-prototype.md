# Web prototype (PWA) — client demo

## Goal
A clickable, installable PWA prototype (mock data, no backend) showing the whole delivery loop across the four roles,
for a client presentation. Source: `product_docs/FiestaGas_PRD.md`.

## Decisions (own recommendation, YOLO)
- **One app, role launcher** (Customer / Dispatcher / Rider / Owner) instead of 3 codebases. Prototype only; the real build keeps Next.js + Expo per PRD.
- **Vite + React + TS + react-router + vite-plugin-pwa.** Fastest installable PWA; no SSR needed for a demo.
- **Mock backend = one in-memory store persisted to localStorage** with "Reset demo data". Seeded Pangasinan customers/riders/orders.
- **Map = Leaflet + OpenStreetMap tiles** (no API key). PSGC town/barangay subset for Pangasinan.
- **Refill-cycle engine is real logic** (`src/lib/refill.ts`) with a unit test — it is the product's core insight.
- **Brand:** Petron blue + orange-red as placeholder (Fiesta Gas palette unverified; PRD risk: confirm with Petron). Tokens in one CSS file so a swap is trivial.
- Out of prototype: real SMS, payments, auth, GPS, offline sync (faked/labeled).
- **Process:** Claude plans + builds; Codex (`codex exec`) reviews each checkpoint; fix findings before moving on.

## Plan
- [x] Scaffold + PWA manifest/SW + tokens + role launcher
- [x] Store, seed data, refill engine + test
- [x] Customer PWA: order flow, tracking, history
- [x] Dispatcher: encode order, assign rider, order board, customer map/search
- [x] Rider: delivery list, status flow, payment, proof of delivery (photo/OTP), failed reason
- [x] Owner: analytics, due/overdue follow-up list, SMS blast composer, inventory
- [x] Codex review → fix → build + test + browser run through the demo script

## Verification
`npm run build`, `npm test`, Playwright walkthrough of the demo script (customer orders → dispatcher assigns → rider delivers → owner sees analytics/inventory update), PWA installable (manifest + SW).

## Outcome
Shipped `app/` (see app/README.md): 4 role UIs, installable PWA (manifest + service worker + cached OSM tiles), refill engine with 4 unit tests, browser-verified loop (customer order -> dispatcher assign -> rider deliver -> inventory/analytics update), 0 console errors. Screenshots: knowledge/design/references/.
Codex reviews: `tasks/reviews/codex-review-1.md` (15 findings) and `-2.md` (regression pass). Fixed: double-delivery guard, per-size area cycle, grace boundary, order-ID collisions, stock-in empties, real GPS w/ fallback, duplicate blast, customer persona picker, stale failed orders on board, `touch()` snapshot bug (found by review 2). Disputed: avg-cycle vs first-to-second 'identical' (they differ with 3+ orders).
Deferred (add when client asks): block negative stock, checklist gating, inventory counts/adjustments, blast scheduling, requeue button, leads, load-out/return.

## Outcome update 2 (stakeholder-appeal pass)
Trigger: user feedback that the prototype "doesn't seem appealing" and doubt about dashboards / end-to-end verification. Honest finding: the first pass verified the flow only in pieces (a reset happened mid-way; the rider delivered a *different* seeded order), never opened follow-ups/blast/remittance/new-order in a browser, and looked like an internal admin tool (emoji, no imagery, bare bars).
Done: `app/e2e/flow.mjs` (`npm run e2e`) drives ONE order through customer -> dispatcher -> rider (wrong code blocked) -> customer -> owner (stock -1 exactly, movement logged), plus follow-up logging, blast, remittance and a new-customer phone order; asserts a clean console. It caught a real Leaflet unmount bug the manual pass missed (fixed). lucide-react icons replace all emoji; original SVG illustrations (cylinders x3 sizes, scooter hero) in `src/components/art.tsx`; customer app got banner, one-tap Reorder, cylinder size cards; dashboard rebuilt per the dataviz skill (stat tiles w/ deltas + sparkline, orders/day area chart with hover, app-vs-staff weekly stacked columns, refill-health segmented bar with icons+labels, ranked bars, cylinder units). Seed now 120 customers / ~hundreds of orders with a deliberate adoption + growth story (synthetic, labelled as demo data).
Codex review 3 (`reviews/codex-review-3.md`): 5 findings, none demo-breaking; fixed the app-share wording, skipped empty/single-point guards (data is fixed).
Known: images are illustrations, not photos (no licensed photography available offline); brand colors still placeholders.
