ROLE: adversarial REVIEWER (read-only, do not edit). Defects only, no praise, no code summary. Each finding: file:line or screenshot, what is wrong, concrete failure scenario (who loses what: cash, a cylinder, a customer, a delivery), severity P1 (wrong money/stock number, data loss or crash, a rule bypassable) P2 (misleading, inconsistent, unprofessional) P3 (nit). Max 15, ranked. Read the lines before claiming; mark UNVERIFIED if unsure.

Judge the implementation in /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app against:
- Backlog: /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/knowledge/tasks/2026-10-31-owner-gap-backlog.md
- Spec: /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/knowledge/tasks/reviews/codex-owner-backlog-spec.md
- The cut list in the spec. Do NOT request cut items.

Attached screenshots are from the latest e2e run (rider list, rider out-for-delivery, inventory, inventory adjust, followups, snoozed followups, remittance, dashboard/analytics, new order, duplicate warning, failed-order next attempt). Cite them by filename when relevant.

Specific checks:
1. Money rules enforced in the STORE, not just the UI: shortfall needs a reason, wallet payment needs a reference, handover edits need a reason, no negative stock, inventory adjustments need a reason.
2. Remittance / expected-cash math: COD vs wallet, partial payments, multiple orders per rider per day, day boundaries and timezone.
3. Load-out / return and empties / owed-tank math; held-by-size consistency.
4. Rider ordering / stop logic; whether any copy claims route optimisation or ETA.
5. Old persisted localStorage data not crashing (missing new fields, schema migration).
6. Seed determinism.
7. Duplicate / active-order checks.
8. Snooze / callback logic.
9. Failed-order requeue.
10. Dashboard relabel: do the numbers add up.
11. Accessibility: labels, 44px touch targets on phone screens, status not conveyed by colour only.
12. Leftover dead code and unused exports.
13. Professional English copy.
