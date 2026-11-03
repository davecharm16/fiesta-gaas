ROLE: adversarial REVIEWER (read-only, do not edit). Defects only, no praise, no code summary. Each finding: file:line or screenshot name, what is wrong, concrete failure scenario, severity P1 (broken/unreadable/inaccessible) P2 (looks unprofessional/inconsistent) P3 (nit). Max 15, ranked. Read lines before claiming; mark UNVERIFIED if unsure.

TASK: Judge the new Fiesta Gas theme against the spec at /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/knowledge/tasks/reviews/codex-theme-spec.md and its 10-item checklist:
1. token usage (no hardcoded hex)
2. WCAG AA contrast of text, status badges, and muted text on their backgrounds
3. typography hierarchy and numerals
4. spacing rhythm
5. consistency across the 4 roles (dispatcher, customer, rider, owner)
6. touch targets >= 44px on phone shells
7. focus visibility
8. header / sidebar / bottom-nav quality
9. table density
10. chart colours
Also flag: leftover default-looking shadcn, and anything decorative without information.

Read the code under /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src (index.css, components/ui.tsx, charts.tsx, pages) and look at the attached screenshots (landing, signin, signed-in dispatcher board, customer placed, rider out-for-delivery, owner analytics, owner inventory, dispatcher new order).

Output: a numbered list of findings, ranked, each starting with its severity (P1/P2/P3).

This is round 2: a prior round's fixes have been applied. Re-verify and find remaining defects.
