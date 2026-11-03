You are a senior product designer + front-end lead acting as the UI PLANNER (read-only, you do not edit files).

CONTEXT
Fiesta Gas is an LPG delivery platform prototype (customer PWA, dispatcher board, rider app, owner dashboard) for a Pangasinan distributor. It will be shown to a non-technical client. Read /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/knowledge/product_docs/FiestaGas_PRD.md and the code in ./src (pages/, components/, index.css).

PROBLEM
The stakeholder said the current UI "looks like too much AI": gradient hero, cartoon SVG scooter scene, tinted icon chips, dashed orange cards, pills everywhere, hand-rolled CSS. Screenshots attached show it. We are rebuilding the UI on **shadcn/ui (Tailwind v4, Radix)** with the shadcn default restraint.

DELIVER A UI PLAN (markdown, concise, decisive, no menus of options):
1. Design direction in 5-8 bullets: what "not AI-looking" means here concretely (palette use, radius, shadows, type scale, density, imagery policy, motion). Brand colours are placeholders: Petron blue ~#0F57A6, orange-red ~#F04A2D; propose how to use them as shadcn CSS variables (primary / accent / destructive) in light mode only.
2. shadcn component inventory: exact components to install (button, card, table, badge, tabs, input, select, dialog/sheet, sonner, tooltip, chart, etc.) and which screen uses which.
3. Per-screen layout spec for: Launcher, Customer (home/order/track/inbox), Dispatcher (board/new order/customers+map), Rider (jobs/job), Owner (dashboard/follow-ups/blast/inventory/remittance). For each: structure, key components, what to REMOVE from today.
4. Shell: dispatcher+owner as a real admin layout (sidebar vs top tabs, your call), customer+rider as mobile-first with bottom nav.
5. Imagery policy: what replaces the cartoon illustrations (e.g. real photos of LPG cylinders via a stated source/licence, or none). Be honest about licensing.
6. Charts: use shadcn Chart (Recharts) - which charts, keep to the dataviz rules (one axis, no dual axis, status colours reserved).
7. Migration order and risks (the e2e script e2e/flow.mjs relies on visible text/roles, list what must stay stable).
8. A reviewer checklist: 10 concrete, checkable items I should hold the finished UI to.

Be opinionated. Cut anything decorative that does not carry information.
