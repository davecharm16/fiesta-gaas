You are the UI/data-viz PLANNER (read-only). Plan a redesign of the owner Analytics dashboard: ./src/pages/owner/Dashboard.tsx, ./src/components/charts.tsx, data helpers in ./src/lib/derive.ts and ./src/lib/seed.ts, goals in ../knowledge/product_docs/FiestaGas_PRD.md (Goals & success metrics table). Screenshot attached.

PROBLEM (owner feedback): "too many bars, they don't tell me much." Today: 6 horizontal-bar panels (delivery minutes by rider, by town, revenue by town, units by size, failed reasons) plus a segmented refill-health bar. By rider/town delivery minutes are all ~62 so the bars carry no information; bars just restate numbers.

DELIVER (concise, decisive):
1. For each PRD goal (faster deliveries, more repeat orders, fewer lost customers, better promo results, less manual work), name the DECISION the owner makes and the single best visual or table for it. Prefer: a table with inline numbers + delta + a tiny sparkline or a coloured delta; a ranked table with a "vs target / vs avg" column and flagged outliers; a small number of well-chosen charts; a heat/calendar view if it earns it. Delete anything that does not change a decision. Hard cap: at most 3 charts on the page, and no horizontal-bar panel unless the values differ enough to matter.
2. Page layout top to bottom (section order, what each contains, column lists for tables).
3. Seed-data changes needed so the numbers are informative and plausible (e.g. one slow rider, one slow town, a clear failed-delivery reason, promo blast with real order lift). Be specific about which values in seed.ts to change, keep it deterministic and keep all current e2e-visible text ("Business overview", "Avg delivery time") stable.
4. Which shadcn components to use (table, badge, tabs, chart...). No gradients, no decorative tiles.
5. A reviewer checklist of 8 checkable items.
Be opinionated. Do not exceed one screen of text per section.
