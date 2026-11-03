# Fiesta Gas Delivery App — PRD

Source: `initial-docs/Fiesta Gas Delivery App — Initial Proposal.pdf` (Oct 29, 2026, Dave Charm). The PDF is archival; edit this file.
Status: **proposal / pre-discovery.** Baselines, targets and the open questions below are settled in discovery.

## Overview
Delivery + customer-management platform for a local Fiesta Gas (Petron partner) LPG distributor in Pangasinan.
Customers order refills online, riders deliver with payment and proof captured on the spot, and the business uses each
customer's refill cycle to send reminders and promos by SMS.

**Problem today:** orders arrive by call/text/Messenger and are tracked by hand; no customer map, no reorder history,
follow-ups depend on staff memory.

**Four parts:** (1) customer map + directory, (2) ordering + delivery (rider assignment, payment, proof of delivery,
cylinder inventory), (3) analytics (delivery speed, refill cycle), (4) automated engagement (reminders, follow-up list, SMS blasts).

## Goals & success metrics
| Goal | Measure |
|---|---|
| Faster deliveries | Avg minutes order placed → delivered, per rider and town |
| More repeat orders | Share of customers with a 2nd order; avg days between refills |
| Fewer lost customers | Overdue customers contacted, and how many reordered |
| Better promo results | Orders within a set window after an SMS blast |
| Less manual work | Dispatcher-encoded vs customer-placed orders |

## Roles
| Role | Interface | Main jobs |
|---|---|---|
| Customer | Mobile web app (PWA) | Order refill, pick size/payment, track rider, history |
| Dispatcher/Admin | Web dashboard | Encode call/text orders, manage map, assign riders, cancellations |
| Rider | Native Android app | Delivery list + route, collect payment, proof of delivery, log empties |
| Owner/Manager | Web dashboard | Analytics, products/prices/inventory, text blasts, review remittances |

Dispatcher-encoded orders are a first-class path (same flow as app orders).

## Domains (feature scope)
- **Customer mapping & search** — pin per customer (name, contact, town, barangay, street/purok, landmark); pins dropped by customer, rider or dispatcher; map filters (town, barangay, cylinder size, last order); barangay density view; search by name/mobile/town/barangay; PSGC standard town/barangay list (not free text).
- **Ordering** — size, quantity, type (refill swap | new tank with deposit); dispatcher encoding for walk-in/call/text; SMS/in-app confirmations and status.
- **Delivery & dispatch** — manual or nearest-rider assignment; status: Placed → Assigned → Out for delivery → Delivered | Failed; failed deliveries return to queue with reason.
- **Payment** — COD and e-wallet (GCash/Maya) recorded per order; online prepayment is an add-on; end-of-day rider remittance (expected vs turned over).
- **Proof of delivery** — photo, signature or OTP, auto GPS + timestamp, empties collected.
- **Inventory** — full/empty stock per size (delivery deducts full, empties add back), stock-in, rider load-out/return, customer-held cylinders and deposits, low-stock alerts, counts with adjustment reasons, movement/discrepancy report.
- **Analytics & refill cycle** — see rules below; dashboard: delivery time, time to dispatch, refill cycle, first-to-second interval, due/overdue, repeat rate, sales by area/product, failed deliveries.
- **Engagement** — auto refill reminder (configurable timing/template/quiet hours, opt-out); lead follow-up list + call outcome logging (reached, ordered, switched supplier, not interested, call back); prospects as leads; SMS blasts (segment, preview count, send/schedule, saved templates, delivery report + orders-after-blast). Promo only to consenting customers (Data Privacy Act).

### Refill-cycle rules
1. First order: default cycle from cylinder size + area average.
2. Second order sets first real cycle; first-to-second interval tracked separately (new-customer retention signal).
3. Later orders update the average cycle.
4. Expected next refill = last order date + avg cycle; past it by a grace period → overdue.

## Baseline vs out of scope
Baseline (fixed price) also includes offline sync, rider safety checklist, delivery zones/fees, inventory, sales/remittance reports.
Out of scope: Petron system integration (unless API provided), accounting/BIR invoicing/payroll, hardware, multi-warehouse and supplier POs.
Optional add-ons (quoted separately): customer feedback, typhoon mode, SMS keyword ordering, scheduled auto-refill, online prepayment, live rider tracking, multi-branch, loyalty/referrals, Messenger bot, route optimization, reseller portal, native customer app.

## Platform & tech (confirm after discovery)
Web admin (Next.js) + customer PWA + native Android rider app (React Native/Expo), one shared backend.
PostgreSQL + PostGIS (e.g. Supabase); Google Maps or Mapbox; PSA PSGC codes; local SMS gateway (Semaphore/M360); PayMongo/Xendit (add-on); Vercel hosting.
Why not native for customers: ~1 order/month/household, PWA from an SMS link avoids download friction. Why native for riders: background GPS, camera, offline storage.

## Commercials (indicative)
PHP 441,000–661,500 fixed, ~147 man-days at PHP 3,000–4,500; ~3–4 months with 2–3 people. Payments: 30% signing / 40% UAT build / 30% go-live. 30 days bug-fix warranty. Running costs (SMS ≈ PHP 0.56/msg, maps, hosting ≈ PHP 3–5k/mo) paid by distributor.

| Module | Man-days |
|---|---|
| Rider app | 20 |
| Inventory | 15 |
| Discovery + UI/UX | 12 |
| Directory, map, search, import | 12 |
| Order mgmt + dispatch | 12 |
| Customer PWA + OTP login | 12 |
| Testing + bug fixing | 12 |
| Analytics dashboard | 10 |
| Backend, roles, PSGC data | 8 |
| SMS blast + segments | 8 |
| Refill-cycle engine + reminders | 6 |
| Lead follow-up + call logging | 6 |
| Deploy, UAT, training | 6 |
| Payment logging, sales, remittance report | 5 |
| Delivery zones + fees | 3 |
| **Total** | **147** |

## Assumptions & risks
Assumes: distributor runs its own riders and sets own prices; riders have Android + data; an existing customer list can seed the map.
Risks: customers keep calling (→ dispatcher entry is full path, reminders link to order page); rural addresses (→ pin on first delivery + landmark); SMS cost growth (→ segment targeting, per-blast limits, cost preview); promo privacy complaints (→ explicit consent, opt-out in every message, consent records); Fiesta Gas/Petron branding (→ confirm guidelines before launch).

## Open questions (discovery)
Towns covered / all Pangasinan? · Riders, branches, active customers now? · Cylinder sizes, prices, deposit handling? · Households only or stores/resellers too? · Payment methods today? · Format of current customer list and stock records? · Who pays SMS/map costs post-launch? · Budget range and target launch date?
