You are a senior product designer and shadcn/ui + Tailwind v4 expert. Produce a THEME SPEC (do not write code files; output the spec as markdown to stdout).

## Context
Project: Fiesta Gas Delivery prototype (LPG delivery, Pangasinan, Philippines). Location: /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app. Stack: Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui (style base-nova, Base UI primitives). Brand colours are PLACEHOLDERS (Petron-like blue #0F57A6, orange-red #F04A2D; not confirmed). Four roles: customer and rider (phone shell with bottom nav), dispatcher and owner (sidebar admin). Stakeholder feedback so far: the earlier UI looked "too much AI" (gradients, cartoon art, tinted icon chips), then "too many progress bars". It now looks plain/default; the owner wants a better overall THEME that feels like a credible, polished product for a client demo. No illustrations or photos are available. Light mode only.

## Read first
- /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/index.css
- /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/components/ui.tsx
- A few pages under /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages (e.g. Landing.tsx, customer/Customer.tsx, rider/Rider.tsx, dispatcher/Board.tsx, owner/Dashboard.tsx) and app/src/components/charts.tsx, app/src/components/ui/*.tsx as needed
- Research: /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/knowledge/tasks/reviews/theme-research.md (read all of it; it contains a verified audit of the current app, token mechanics, contrast numbers, and two candidate directions)

## Required output sections (use exactly these headings)
1. Design thesis: 5 bullets.
2. Token table for :root: background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, border, input, ring, chart-1..chart-5, sidebar, sidebar-foreground, sidebar-primary, sidebar-primary-foreground, sidebar-accent, sidebar-accent-foreground, sidebar-border, sidebar-ring, plus --success, --warning, --brand (and soft/foreground variants you need, incl. info). Give hex or oklch. Light mode only. EVERY text/background pair must be >= WCAG AA (4.5:1 body text, 3:1 large/UI); include a short contrast table with computed ratios for the key pairs.
3. Font family (must be an @fontsource-variable package that exists on npm; name the exact package and CSS family name), type scale, and numeric styling (tabular-nums rules).
4. Radius, border, shadow and density rules (admin vs phone).
5. Component-level rules for: button, card, badge, table, input, tabs/nav, sidebar, header, KPI card, toast, chart. Give concrete Tailwind class patterns for each.
6. Per-screen adjustments for landing, sign-in, customer, rider, dispatcher, owner: specific, at most 5 bullets each.
7. A 10-item reviewer checklist.

## Rules
Be decisive: pick one palette, one font, one answer per question; no option menus. Cut anything decorative that carries no information. FORBIDDEN: gradients, illustrations, emoji, tinted icon chips, decorative progress bars. Keep all colours in tokens so a brand swap is a few-variable edit. Use orange sparingly and never as small text on white unless it passes AA.
