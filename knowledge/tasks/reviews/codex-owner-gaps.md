## Ranked gaps to close

Ranked by likely business impact. Estimates below are prototype work: screens and local logic using simulated data, with no live SMS, payment, GPS-tracking, or backend integration implied.

| # | Area | Gap and why it matters | Evidence | Concrete prototype fix | Effort | Value |
|---:|---|---|---|---|:---:|:---:|
| 1 | Remittance | **Separate cash due from e-wallet sales, and make handover a recorded event.** The current screen sums `cashCollected`, but does not show GCash/Maya totals, which orders make up the cash figure, when cash was handed over, or who received it. That makes shortages hard to investigate and can confuse cash sales with wallet payments. | Remittance screen; `src/pages/owner/Ops.tsx`, `src/lib/store.ts` | Show COD due, GCash, and Maya totals per rider; list the orders behind each total. Add turnover amount, received-by, time, and a confirm/save action. Show signed short/over amount and flag it for follow-up. | M | 5 |
| 2 | Rider | **Show the destination and next action from the deliveries list.** A rider has to open a job to get the phone, landmark, map, and directions. That adds taps and makes it easier to miss a customer or waste a trip. | Owner feedback; `src/pages/rider/Rider.tsx` | Put landmark, tap-to-call, and a one-tap “Navigate” link on each card. Clearly mark the next stop and show a simple stop number. | S | 5 |
| 3 | Rider / Inventory | **Track cylinders loaded onto and returned by each rider.** Depot counts alone cannot show whether a cylinder is at the shop, on a tricycle, with a customer, or missing. Each lost cylinder ties up deposit-backed stock and replacement cash. | PRD inventory scope; `src/pages/owner/Ops.tsx`; `src/lib/types.ts` has no rider load/return record | Add a simulated load-out/return form by rider and size. Show depot full/empty, rider full/empty, and customer-held counts separately; add each transfer to movements. | M | 5 |
| 4 | Inventory | **Make customer deposits and cylinder custody reconcilable.** The screen shows a single held-cylinder count, not which customer or order holds what, deposit value, or whether a returned empty was recorded. This makes disputes and asset loss difficult to resolve. | Owner feedback; `src/pages/owner/Ops.tsx`; customer `heldCylinders` in `src/lib/types.ts` | Add a per-size held count and a drill-down list of customers, size, quantity, deposit amount, and last delivery. On simulated new-tank delivery, add a cylinder to the customer’s holding record. | M | 5 |
| 5 | Inventory | **Add physical counts, adjustment reasons, and supplier receipt details.** Automatic movement entries do not prove that stock on screen matches what is physically in the yard. A stock-in entry also lacks a supplier delivery reference, making quantity disputes harder to trace. | Owner feedback; `src/pages/owner/Ops.tsx`; movement type includes `adjustment`, but no count workflow is exposed | Add “Count stock” by size, show system vs counted quantity, require a reason for the difference, and record supplier/reference and note on stock-in. | M | 5 |
| 6 | Follow-ups | **Make each contact actionable and prevent repeated or mistimed outreach.** The list shows cycle and overdue days, but not last order/size/value or a callback date; “Call back later” has no scheduling effect. Repeated generic reminders can irritate customers who already reordered or prefer calls at another time. | Owner feedback; `src/pages/owner/Engage.tsx`; `FollowUp` in `src/lib/types.ts` stores only outcome and time | Show last order date, size, amount, and lifetime order count. Add callback date/snooze, “do not contact today,” and a per-customer last-contact history; sort overdue and callbacks due first. | M | 5 |
| 7 | Rider | **Gate delivery start on the safety checklist and keep it saved for the shift.** The checklist resets when the screen remounts and does not stop a rider starting. A checklist that can be skipped or lost does little to prevent a rushed departure or safety issue. | Owner feedback; `src/pages/rider/Rider.tsx` | Persist checklist state locally for the rider and day; disable “Start delivery” until all checks are complete, with a visible reset/new-shift action. | S | 4 |
| 8 | Customer / Dispatcher | **Capture and verify a usable address pin before accepting an order.** New dispatcher customers require a pin, but repeat customers can have old or approximate pins; the customer order screen only displays their saved address. Wrong pins mean wasted fuel, late delivery, and a failed order. | PRD address/pin requirement; `src/pages/customer/Customer.tsx`, `src/pages/dispatcher/NewOrder.tsx`, `src/lib/seed.ts` | Add a customer “Confirm delivery address and landmark” step, with a pin preview/edit control and saved confirmation. In the dispatcher flow, show the selected customer’s pin and landmark before creating the order. | M | 5 |
| 9 | Rider | **Make payment and proof-of-delivery checks match the actual order.** COD amount is editable and defaults to the full total; non-COD has no recorded confirmation. The UI can therefore mark an order delivered without a useful e-wallet reference or explaining a partial cash collection. | `src/pages/rider/Rider.tsx`; `src/lib/store.ts` | For COD, show amount due and require confirmation of amount received, with an explicit short-payment reason. For GCash/Maya, add “verified” plus a simulated reference field. Show the chosen proof method and amount on the completed job. | M | 5 |
| 10 | Dispatcher | **Show an accurate order queue with useful assignment context.** Nearest-rider assignment uses a demo position derived from the latest active stop, not current GPS or remaining route; it can look authoritative while being wrong. Orders also lack a clear promised/needed-by time. | `src/pages/dispatcher/Board.tsx`, `src/lib/derive.ts` | Label the suggestion “demo estimate,” show rider’s assigned stops and customer location/landmark, and let dispatcher choose manually. Add a simple delivery time window/urgency label and queue sort. | M | 4 |
| 11 | Customer | **Show a credible delivery window and useful status updates.** “On the way” and a rider name do not tell a household when to be home with cash, empties, or an OTP. | `src/pages/customer/Customer.tsx`; PRD ordering/status scope | Add a simulated delivery window (for example, “expected 2–4 PM”) and last status time. Include a call-rider action once out for delivery and a reminder to prepare the agreed payment and empty cylinder. | S | 4 |
| 12 | Dispatcher / Customer | **Prevent duplicate orders and make repeat customer selection safer.** Search results show name and area but not phone or recent order status; a dispatcher could choose the wrong household or create a duplicate while handling a call/text. | `src/pages/dispatcher/NewOrder.tsx` | Show phone, saved landmark, last order date/status, and any active order in search results. Warn and require a deliberate confirm if that customer already has an open order. | S | 4 |
| 13 | Analytics | **Distinguish sales from money collected and profit.** “Revenue” sums order amount, which may include unpaid/failed orders and cylinder deposits. With thin margins, gross sales alone can mislead decisions about discounts, delivery fees, and cash available. | Analytics screen; `src/pages/owner/Dashboard.tsx` | Label the existing KPI “Order value”; add delivered value, COD collected, e-wallet recorded, and deposits separately. If simulated costs are available, show estimated gross margin by size/area and make assumptions visible. | M | 4 |
| 14 | Follow-ups / Customer | **Protect against bad refill-cycle predictions.** The due list depends on historical cycle estimates, but a customer with one order or an unusual refill may be incorrectly treated as due. Calling the wrong person wastes time and can annoy them. | PRD refill-cycle rules; `src/lib/refill.ts`, `src/lib/derive.ts`, `src/pages/owner/Engage.tsx` | Display the last delivered order and whether the cycle is an area default or customer history. Add “not due / wrong estimate” to outcomes and let the demo snooze that customer from the list. | S | 4 |
| 15 | SMS blast | **Show who will receive a message and avoid accidental discount loss.** The screen estimates SMS cost and includes consented customers, but a blast can promise a free delivery or discount without showing the promo’s cost to the owner or a clear send confirmation. | `src/pages/owner/Engage.tsx`; SMS blast screen | Show recipient count and sample recipients before sending; add an explicit review step. For promo templates, show discount/free-delivery cost and a simple estimated orders-to-break-even field using simulated margin assumptions. | S | 4 |
| 16 | Remittance | **Support day-by-day review and order-level dispute checks.** Only “today” is available; once a rider leaves, the owner cannot review yesterday’s imbalance or identify which delivery caused it. | Remittance screen; `Remit` in `src/lib/types.ts` | Add a date selector and saved remittance history, with expandable delivered-order rows showing amount, payment type, and recorded cash. | S | 4 |
| 17 | Dispatcher / Customer | **Make order failures and re-dispatch visible to the customer and dispatcher.** Failure reasons exist, but customer wording says “We’ll re-dispatch shortly” regardless of the actual queue, and the board does not capture a new agreed time or customer contact. | `src/pages/customer/Customer.tsx`, `src/pages/dispatcher/Board.tsx`, `src/lib/store.ts` | On failure, add “customer contacted,” next attempt time, and a clear status. Show the failed order in the queue until resolved or cancelled, with a simulated SMS update based on the selected action. | S | 3 |
| 18 | Customer | **Make the order total and cylinder exchange terms unmistakable.** New tank + deposit and refill swap have different asset/cash implications; the customer screen shows a total, but does not make the empty-cylinder expectation or deposit return condition clear. | `src/pages/customer/Customer.tsx`; `src/lib/geo.ts` | Add a short size-specific explanation: what empty to return for a refill swap, deposit charged for a new tank, and what happens if the old cylinder is unavailable. Repeat it on order confirmation. | S | 4 |

### The owner’s questions

#### What remittance needs to work and have value

- Show **COD cash due separately from GCash and Maya**. E-wallet order value is not cash the rider should turn over.
- Let the owner inspect the **orders behind the total**, including customer, amount, payment method, and delivery time.
- Record **amount handed over, who received it, and when**, then save/confirm the handover.
- Show the **short or excess amount clearly**, retain the saved record by date, and flag unresolved differences.
- Include a brief note for a shortage, such as customer paid less, change given, or cash still with rider.

The current prototype calculates expected COD from delivered orders and stores a turnover amount, but the turnover input saves on blur and has no receiver, timestamp, explanation, or history view. That is a useful start, not yet a reliable cash-control record.

#### What inventory needs to work and have value

- Show full and empty counts **by size**, with owner-set reorder thresholds and a clear “buy/refill soon” warning.
- Track cylinders across **depot, rider, and customer custody**. Keep full/empty swaps and new-cylinder deposits distinct.
- Record supplier stock-in with quantity, date, and a delivery/reference note.
- Allow a physical count and a reasoned adjustment; show system count beside counted count.
- Provide movement history that can answer “where did these 11kg cylinders go?” and make discrepancies visible.

The prototype already deducts full stock and adds returned empties on delivery, has a low-stock threshold, and records movements. The valuable next step is custody and reconciliation: otherwise those automatic numbers can drift from what is physically on hand.

#### What follow-ups needs to work and have value

- Prioritize customers by **overdue days and callback date**, while showing last order, size, and typical value so the owner knows who is worth calling first.
- Make phone calling one tap, with a brief call prompt: last order date/size, expected refill date, and a natural reminder.
- Save outcomes with **time and follow-up date**; “call back later” must create a callback, not just a label.
- Allow filters by town, size, and contact state; snooze customers who are not due or already reordered.
- Track who reordered after contact and who switched supplier, with enough history to avoid contacting them repeatedly.

The current screen has phone links, outcome logging, and a reminder button. Its core limitation is that it records an outcome without making the next action clear.

#### As a rider, how can I easily know where to go?

Put the practical directions on the **My deliveries** list, before the rider opens each job:

1. Sort stops into a simple numbered sequence and label the next stop.
2. Show customer name, barangay/town, street or purok, and the saved landmark.
3. Put **tap-to-call** and **Navigate** buttons on each card. Navigate can open Google Maps using the saved pin, as the job detail already does.
4. Show cylinder size/quantity and whether to collect COD, so the rider can prepare the right stock and change.
5. On the job screen, show the pin and landmark together, and let the rider report a wrong pin or missing landmark for correction.

For this prototype, a deterministic stop order and Google Maps directions link are enough to demonstrate the workflow. Do not imply that the current nearest-rider estimate or map pin is live GPS.

## Five demo features to cut or simplify

1. **App-share growth chart** — attractive adoption story, but it does not show whether deliveries are profitable or customers are retained. Replace with dispatcher time saved or repeat orders by channel only if the data is trustworthy.
2. **Nearest-rider recommendation presented as a precise distance** — the current rider position is a demo stand-in, so a decimal kilometre figure suggests accuracy the prototype does not have.
3. **Customer-density map and concentration panel** — potentially useful for planning later, but less urgent than accurate addresses, rider stops, and stock custody for a three-rider operation.
4. **Promo “lift” comparison and polished blast history** — simulated order attribution can look persuasive while saying little about actual incremental sales. Prioritize consent, cost, and reorder results that can be checked.
5. **Aggregate “saved/lost” follow-up badges** — without a period, denominator, or definitions they look like business outcomes but can count old demo calls. Keep the call outcome log; cut or relabel the badges until they measure a clear date range.

*I reviewed the provided owner feedback, PRD, and prototype source under `app/src`, plus the supplied reference screens. I treated the displayed screenshots and the owner feedback as the UI evidence; the source filenames above point to the corresponding implementation.*
