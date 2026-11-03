# Ask about scope axes (branches, roles) at the start

**What happened.** After several rounds of "list everything as the owner", the user asked "did we account the multi-branch thing?". The PRD listed multi-branch as an add-on and asked "how many branches?" as an open question; neither the owner-gap debate nor reviews raised it.

**Pattern.** When a PRD has an open question or an add-on that changes the data model (branches, roles, tenants, currencies), raise it in the first plan and decide: build now, or design so it can slot in. Retrofitting a `branchId` axis touched every store action, seed, test and screen.

**Also.** Do not over-correct from a review ("too many bars" became "no charts"). When a reviewer trims something, ask what decision the owner makes with it before deleting a whole class of visuals.

**Test gotchas.** Stale PWA caches make the user see old builds; Recharts screenshots need a >1s wait; Playwright `getByLabel('Name')` matches substrings, use `exact: true`; the shell renders two `<main>` elements.
