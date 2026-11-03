ROLE: adversarial REVIEWER (read-only, do not edit). Defects only, no praise, no code summary. Each finding: file:line, what is wrong, concrete failure scenario, severity P1/P2/P3. Max 10, ranked. Read the lines before claiming; mark UNVERIFIED if unsure.

SCOPE (new this round)
A. Landing + single sign-in + per-tab session + role guard: src/pages/Landing.tsx, src/pages/SignIn.tsx, src/lib/session.ts, src/App.tsx (Guard), src/components/ui.tsx (Shell header: user name + "Switch user").
B. Dashboard fixes since your last review: src/pages/owner/Dashboard.tsx (unique-customer reorder count, consented baseline, 30-day failures, "—" for empty cohorts, KPI windows by placement date).

CHECK
1. Guard: can a signed-out or wrong-role user see a role area (HashRouter, back/forward, direct URL, refresh, new tab, session cleared while on a page)? Does Guard re-evaluate on navigation? Redirect loops?
2. sessionStorage in private mode / PWA standalone: what does the user see? Does signing in as a Rider with `?r=` correctly select that rider on the rider page (src/pages/rider/Rider.tsx)? Does switching user leave stale per-user state (customer persona key, rider selection)?
3. The customer account is hard-wired as "Maria Santos": does it match the store's demo-customer persona (src/pages/customer/Customer.tsx useMe, localStorage key)? Mismatch between the signed-in name shown in the header and the persona actually acting?
4. Landing/SignIn: accessibility (headings order, link vs button semantics, focus), mobile layout, copy honesty (prototype, no real auth).
5. PWA: manifest start_url and service worker with the new /signin route under HashRouter.
6. Dashboard (B): re-verify numbers and the promo/contact logic; any new bug introduced by the fixes (e.g. `latest` map, `contacted` tuple usage, perf cohort vs KPI cohort).
