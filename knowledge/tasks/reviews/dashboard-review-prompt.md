ROLE: adversarial REVIEWER (read-only, do not edit). The owner Analytics dashboard was just redesigned from 6 bar-chart panels into decision tables + one chart, following your plan in ../knowledge/tasks/reviews/codex-dashboard-plan.md. Files: ./src/pages/owner/Dashboard.tsx, ./src/components/charts.tsx, ./src/lib/seed.ts (seed story changes), ./src/lib/derive.ts, ./src/lib/refill.ts. Screenshot attached.

RULES: defects only, no praise, no summary of the code. Each finding: file:line, what is wrong, concrete failure scenario, severity P1 (wrong number / misleading / crash) P2 (unprofessional/inconsistent) P3 (nit). Max 12, ranked. Read the actual lines before claiming; mark UNVERIFIED if not sure.

CHECK SPECIFICALLY
1. Are the numbers computed correctly? Verify delta windows (-29..+1 vs -59..-29), avg delivery time windows, repeat rate, "customers to call" count, overdue day rounding, "Last order" derived as expectedNext - cycleDays*DAY (is that really the last order date given refill.ts?), sort order of the call list.
2. Promo lift: is comparing recipients to non-recipients a fair baseline? Selection bias (recipients = first 30 consented customers; seed adds orders only for recipients). Is the label honest? Does the "Not messaged" cohort include non-consenting customers who could never be messaged? Division by zero cases.
3. Contacted-to-reordered: any double counting, orders placed BEFORE vs after the follow-up, customers with several follow-ups.
4. Delivery table: Failed counts by rider/town vs deliveries; flag threshold; empty states; town grouping uses current customer town.
5. Seed: deterministic? does the added code consume r() in a way that changes earlier data, any duplicate order ids, orders in the future, follow-up customers colliding with the e2e flow, failed orders now older than the 2-day board window?
6. Anything that still reads as filler: every remaining element must support an owner decision.
7. Accessibility: tables have headers, colour is never the only signal (slow/overdue/lift), toggle buttons have aria-pressed.
Return the findings only.
