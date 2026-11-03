## Round 1: Owner B challenge

Owner A is right that cash handling and cylinder custody matter. But the proposed “must-have” list treats a prototype for three riders as if it were already the shop’s system of record. The prototype needs to show whether the workflow is useful and where money or tanks go missing. It does not need every audit, forecast, and liability feature before anyone can try it.

### Where A is overbuilding or ranking the wrong thing

- **A’s cash controls are the strongest items, but the package is too large.** Expected COD, a short-payment reason, and a saved handover record could expose a real discrepancy. A separate shortage ledger with carry-over, a formal close-day lock, wallet tick-off, receiver, timestamp, and money-edit audit trail are not all equally urgent for a front-end demo. The simulated data cannot establish that a “locked” day or wallet tick-off corresponds to real cash or a real wallet balance. Start with the order-level expected amount, actual amount, payment method, reason for any difference, and a visible saved handover.
- **The rider route item is overrated as an owner investment.** A numbered stop list with landmark, call, and navigation links could save time. The claimed **1–2 hours per rider per day** needs evidence; with three riders, a manual list plus map links may be enough. ETA and map features should not imply live routing or GPS.
- **A overstates cylinder value as proof that every custody feature belongs near the top.** The 145 held tanks and P300–500k at risk are useful reasons to reconcile the current count, but a prototype ledger does not recover a missing tank by itself. Start with a physical count and a simple location/status per cylinder size. Add rider load-out and returns if that exposes a real gap in daily practice.
- **Days of cover and a forecast from customers due are too high at #10.** A reorder warning based on today’s stock and an owner-set threshold is useful. Forecasting demand from due customers depends on refill-cycle estimates, customer behavior, and open orders; those inputs can be wrong. It will not change a purchase decision until the data is credible.
- **Safety checklist gating is not a top-15 prototype investment on the evidence given.** A checklist may support a real operating policy, but local simulated storage does not give the owner the durable, reviewable record A wants. It also does not prove safe handling. Keep the checklist in the rider workflow if it is already there; do not make building a dispatcher-visible record a priority over cash, custody, or callbacks.
- **Supplier receipts, cost, margin, inventory valuation, and deposit liability are several different jobs.** They are reasonable later extensions, but they don’t all belong in one top-15 list. If the immediate decision is “do I need to restock?”, a receipt note and corrected physical count matter more than a valuation model.
- **A’s follow-up ranking is too low at #15.** A callback date and suppression after reorder make the list actionable. A more elaborate value-and-cylinder-held score is speculative until someone uses the list and can say which calls led to orders. Start with due date, last order, typical order size/value, and callback.
- **A’s saved/lost disagreement is only partly resolved by a better definition.** I would keep the call outcome log and add a simple “ordered after contact” count with a period and rule. I would not present it as saved revenue or lost revenue unless the attribution is credible. A seven-day order after a call is a useful indicator, not proof the call caused that order.
- **A gives T4 too little separation between cheap and costly work.** An expandable row with the orders behind a remittance is likely cheap and useful. A date picker, saved history, and reliable reconciliation depend on persistence and a sound close workflow. Those are not the same effort or prototype value.
- **The blast safeguards are not “cheap” if they include promo cost and break-even.** Showing recipients, consent, and a deliberate review step could prevent an embarrassing send. Estimating promo lift or break-even from simulated margin assumptions may create false confidence and will not tell this owner whether to send a message.

### Which items would not change a decision or a peso yet

I would defer live-looking ETA, nearest-rider distance, density maps, cycle-confidence scoring, forecasted demand, promo lift, margin estimates, and saved/lost revenue attribution. In a simulated prototype, each can look precise without giving the owner a better basis for a real action.

A call history, order breakdown, and stock count can change a decision if they answer a concrete question: *Who do I call today? Which delivery explains this shortfall? How many cylinders do I actually have?* A dashboard label can prevent confusion, but “Order value” versus “cash collected” is a small, low-effort correction—not a reason to build a broader margin dashboard.

### My position on my earlier list

- **Defend cx-01 / remittance handover, cx-09 / COD correctness, and cx-16 / order breakdown.** These address the clearest cash-control problem, though I agree with A that the handover needs receiver/time and a saved record. I would keep a reason for the difference; I would defer a formal lock and audit history.
- **Defend cx-03 / rider cylinder movement and cx-04 / customer-held counts, with a narrower first pass.** A physical count by size and a simple custody view can reveal whether the ledger is useful. A full movement-history system and deposit valuation can follow.
- **Defend cx-02 / rider actions and cx-06 / callback scheduling.** They remove friction from daily work. Keep them simple: stop order, landmark, call/navigation, last order, callback date, and recent-order suppression.
- **Defend the cut to demo analytics, but concede the underlying measurements.** The app-share chart and simulated promo lift do not deserve build time. A period-scoped contact outcome and repeat-order count may be useful after the definitions are clear.
- **Concede A’s point that pin confirmation is lower priority than I rated it.** A usable landmark and a way to call the customer are a better first step for a three-rider operation. Confirming an old pin is sensible when an address is changed or a delivery fails, not necessarily on every order.
- **Concede the value of expected empties on delivery.** It is a cheap, concrete check that ties an exchange to a cylinder movement. A should rank that as a simple delivery action, not as a separate large ledger project.
- **Concede that I underweighted short-payment reasons.** Editable COD without a reason weakens the delivery and remittance records. Show amount due, amount received, and reason for any difference at the delivery step.
- **Do not accept A’s T9, T11, or full T5 as top-tier prototype requirements.** They may be operationally valuable later, but their claimed benefits need real use and reliable data behind them.

### Ranked top 15

Ranked for a three-rider dealership prototype by whether the item can expose a real operating gap or improve a daily decision, adjusted for effort.

1. **Show expected COD from the order and record actual cash received plus a short-payment reason.** Fixes the clearest way a shortage can disappear.
2. **Save a rider handover by date with COD due, wallet-recorded totals, amount turned in, receiver, time, and difference.** Makes the close reviewable without pretending the wallet was independently verified.
3. **Show the orders behind the remittance totals.** Lets the owner investigate a mismatch with specific deliveries.
4. **Put stop number, landmark, call, and Navigate on the rider delivery list.** Reduces taps and gives a rider a usable next action.
5. **Track a simple load-out and return by rider and cylinder size.** Start with full and empty counts; keep the form quick enough to use.
6. **Let the owner record a physical stock count beside the system count, with a reason for adjustment.** This establishes whether the displayed inventory is credible.
7. **Record empties expected and returned during a swap; flag a difference.** Makes customer-held tank changes visible at the delivery where they happen.
8. **Show a customer-held cylinder count by size and status.** Useful for reconciling custody; defer deposit valuation until the counts are trusted.
9. **Add callback date/snooze and suppress customers who reordered recently.** Turns follow-up outcomes into a workable queue.
10. **Show last order date, size, and amount in the follow-up list.** Gives the owner enough context to decide who to call.
11. **Warn about an active order and show phone, landmark, and recent order in customer search.** Helps prevent duplicate orders and wrong-household selection during a call.
12. **Show a simple low-stock warning by size against an owner-set threshold.** Supports a straightforward replenishment decision without a demand forecast.
13. **Make delivery failure stay visible until resolved, with customer-contact status and agreed next attempt.** Prevents “we’ll re-dispatch shortly” from becoming a false promise.
14. **Label dashboard figures accurately: order value, cash collected, e-wallet recorded, and deposits.** Cheap clarity; do not add margin estimates from assumed costs.
15. **Show SMS recipients and a review/confirm step before a blast.** Keep the audience and message visible; defer promo lift and break-even calculations.

### Hard cut line for the prototype

Do not build live GPS tracking, live ETA, route optimization, density maps, a forecast from refill cycles, inventory valuation or deposit-liability accounting, a detailed money-edit audit trail, mid-day cash-drop limits, load-capacity batching, promo lift or simulated break-even analytics, “saved/lost revenue” attribution, or a multi-stage shortage recovery ledger.

Also defer 30-day cash rollups and export unless the owner first uses the saved daily handover and says they need them. The prototype should prove that a rider can record the delivery correctly, that the owner can see what should have come back, and that callbacks and stock counts lead to action. If those workflows do not change what the owner does in a week, the larger systems will not change a peso either.
