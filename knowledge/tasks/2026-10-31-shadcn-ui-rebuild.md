# shadcn UI rebuild (de-"AI-ify" the prototype)

**Why:** stakeholder feedback: UI reads as "too much AI" (gradient hero, cartoon SVGs, tinted icon chips, dashed cards, pills). Rebuild on shadcn/ui.
**Planner:** Codex (read-only), full plan in `tasks/reviews/codex-ui-plan.md`. **Reviewer:** Codex with an explicit reviewer brief (`tasks/reviews/ui-review-prompt.md`).

## Decisions (from the Codex plan, adopted)
- Tailwind v4 + shadcn (CLI default style `base-nova`, Base UI primitives). Brand blue = `--primary`; orange only as `--brand` accent; red = `--destructive`; status colours stay semantic.
- No illustrations, no hero art, no gradients, no shadows, radius 10px. Imagery: none (no licensed photos available offline); product name/size/price/stock carry the info. Photos only if the client supplies rights-cleared ones.
- Dispatcher + owner: shadcn Sidebar admin shell. Customer + rider: phone shell, bottom nav.
- Charts: shadcn Chart (Recharts), one axis each, refill-health stays a labelled segmented bar.
- Keep e2e-stable: routes, nav labels, button labels, aria-labels, `FG-####` ids. e2e selectors (`.card`, `.big`, `.pill.Delivered`) get updated in the same change.

## Checklist
- [x] Codex UI plan
- [x] Tailwind v4 + shadcn init, components added, tokens set
- [x] Shared layer (shells, StatusBadge, Field) on shadcn
- [x] Customer, Dispatcher, Rider, Owner pages migrated
- [x] Launcher migrated, art.tsx + old CSS deleted
- [x] e2e green, build green, Codex review (reviewer brief), fixes

## Outcome
- All 4 roles + launcher rebuilt on shadcn (base-nova). Old stylesheet, `art.tsx` (cartoon SVGs) and gradients deleted. No emoji, no illustrations.
- Work split: Codex planned; I built the shared layer; 5 parallel agents migrated disjoint page files from `reviews/ui-migration-brief.md`; Codex reviewed with `reviews/ui-review-prompt.md` (adversarial reviewer brief: defects only, cite file:line, severity, verify before claiming).
- Review 1 (4 findings, all verified real, all fixed): qty max not enforced (NewOrder), negative stock-in qty (Ops), persona switch left stale cylinder size (Customer), GPS copy overstated fallback (Rider).
- Verified: `tsc -b`, build, 4 unit tests, `npm run e2e` PASS (selectors moved off old CSS classes to `data-testid`/`data-slot`/text).
- Known soft spots: seed data makes delivery minutes near-identical across riders/towns, and the orders/day chart spikes on the last day. Photos not used (no licensed source).

## Round 2: dashboard redesign (owner feedback: "too many progress bars, not much data")
- Codex planned it (`reviews/codex-dashboard-plan.md`): decision tables replace 6 bar panels; one chart kept (app vs staff orders). Seed reshaped so the data says something (slow rider + slow town, dominant failure reason, promo lift vs consenting non-messaged baseline, follow-up calls with reorders).
- Codex review (`reviews/codex-dashboard-review-1.md`): 6 findings, all verified and fixed (unique-customer reorder count, consented baseline, 30-day failure window, empty-cohort dashes, consistent KPI windows, cohort size shown).

## Round 3: landing + single sign-in + switch user (user suggestion)
- `/` = landing (what it is, 5-minute walkthrough, reset). `/signin` = ONE page listing demo accounts (customer, dispatcher, 3 riders, owner); no password in a prototype.
- Session = `sessionStorage` per tab (not localStorage) so a presenter can hold a customer tab and a dispatcher tab side by side. Role guard on each area; header shows the user + "Switch user".
- e2e signs in through the real UI once, and seeds sessionStorage for the other hops.

### Rounds 2-3 outcome
- Dashboard: KPI strip (5), delivery-time table by rider/town with Slow flag, who-to-call table, app-vs-staff chart (the only chart), promo lift table, failed-reasons table. Screenshot: `design/references/dashboard-v2.png`.
- Landing (`/`), single sign-in (`/signin`, 6 demo accounts), per-tab session, role guard, header "Switch user". e2e covers guard, real sign-in, wrong-role bounce.
- Codex sign-in review (`reviews/codex-signin-review-1.md`): 5 findings. Fixed: customer sign-in now resets the persona to Maria; empty-cohort "0 days" cycle. Skipped (need future-dated data or dev-tools tampering): future-date upper bounds, session cleared mid-page.
- Verified: tsc, build, 4 unit tests, e2e PASS.

## Round 4: theme overhaul (multi-agent workflow, 14 agents)
- Research (3 parallel agents: shadcn theming, brand/visual direction, current-UI audit) -> `reviews/theme-research.md`. Codex wrote the theme spec -> `reviews/codex-theme-spec.md` (warm canvas #F7F5F2, charcoal admin sidebar, blue phone header, Inter Variable, soft status pills, step timeline replacing progress bars, orange only as a small brand marker).
- Foundation agent (tokens, font, shared components) then 4 parallel page agents (landing+signin, customer+rider, dispatcher, owner). Verify agent: tsc, build, 4 unit tests, e2e all green first time.
- Codex review 1: 9 findings, 7 fixed, 2 rejected with reasons (`codex-theme-review-1.md`). Codex review 2 (confirmation): 6 findings (`codex-theme-review-2.md`): fixed timestamps on timeline steps, 44px phone switch-user target, brand mark contrast (brand-strong), safe-area padding on bottom nav; rejected sign-in checkmark (already added) and phone-width admin tables (horizontal scroll by design).
- Root cause of "I don't see any changes": the PWA registered via a bare script that never reloaded on a new build. Fixed: `registerSW` in main.tsx with `onNeedRefresh -> updateSW(true)`; build stamp on the landing page.
