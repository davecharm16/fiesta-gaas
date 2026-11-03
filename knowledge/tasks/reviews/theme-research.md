# Theme research (Fiesta Gas prototype)

Three research passes: (A) shadcn mechanics, (B) premium-dashboard/brand direction, (C) audit of the current app. Brand hexes are PLACEHOLDERS (Petron blue #0F57A6, orange-red #F04A2D from a logo aggregator, not official).

## A. shadcn token mechanics (verified against official docs unless noted)
- Tokens are background/foreground pairs (primary, secondary, muted, accent, card, popover) plus destructive, border, input, ring, chart-1..5, radius, and sidebar, sidebar-foreground, sidebar-primary(-foreground), sidebar-accent(-foreground), sidebar-border, sidebar-ring. Declared in :root, exposed via @theme inline as --color-*. Defaults are oklch; radius scale derives from --radius.
- Default theme is fully achromatic (chroma 0) which is why stock shadcn looks plain. The Sidebar component reads only sidebar-* tokens, so the admin shell can be restyled independently.
- Tailwind v4 shadcn uses OKLCH: oklch(L C H / alpha).
- tabular-nums = font-variant-numeric: tabular-nums; needs font support.
- Biggest default-to-bespoke lever: tint ALL neutrals toward the brand hue (chroma 0.005-0.015, hue ~255) rather than chroma 0. One brand hue for chrome (primary); orange only as sparing accent.
- Approx OKLCH: #0F57A6 ~ oklch(0.47 0.14 255); #F04A2D ~ oklch(0.64 0.20 35).
- Suggested tokens (approx, verify): background oklch(0.985 0.003 255); foreground oklch(0.20 0.02 255); card white; primary oklch(0.47 0.14 255); secondary oklch(0.955 0.008 255); muted oklch(0.96 0.006 255); muted-foreground oklch(0.50 0.02 255); accent oklch(0.95 0.02 255) (hover/selected wash); destructive oklch(0.577 0.22 27); border oklch(0.92 0.008 255); input oklch(0.89 0.01 255); ring oklch(0.60 0.15 255).
- Charts: brand-led ordered set: blue, orange, light cyan-blue oklch(0.70 0.10 220), amber oklch(0.75 0.13 85), slate oklch(0.55 0.03 255). Prefer numbers/sparklines/small tables over bars (stakeholder: too many progress bars).
- Sidebar option: dark navy (oklch(0.22 0.05 255)), orange active marker (2px inset left), no icon chips, group labels 11px uppercase tracking-wider /50.
- Radius: stock 0.625rem reads as default; go 0.5rem. One radius step per nesting level.
- Depth: border + hairline shadow (shadow-xs); no shadow-lg, no gradients. Focus: focus-visible:ring-[3px] ring-ring/35 + border-ring.
- Type: Inter Variable (@fontsource-variable/inter, family 'Inter Variable') or Geist (@fontsource-variable/geist). Optional display face for h1/KPI only (plus-jakarta-sans / manrope). NOT verified: package names/OpenType caveats; verify with npm view. Fonts bundle locally via Vite.
- Numerals: tabular-nums on every table cell, price (PHP), quantity, timestamp, KPI, ETA; slashed-zero only for IDs. Scale: body 14px, secondary text-xs muted, page title text-xl/2xl semibold tracking-tight, KPI text-2xl/3xl semibold tabular. Micro label: text-[11px] font-medium uppercase tracking-wider text-muted-foreground. antialiased body.
- Density: admin h-9 controls, table rows h-10/py-2, card p-4; phone h-11/12 targets, 16px min input text; bottom nav active = primary colour + 2px top bar, not filled chip.
- Tables: bordered card, header bg-muted/50 xs uppercase muted, rows border-b border-border/60, hover:bg-accent/40, selected bg-accent, numeric right-aligned tabular, sticky header, status as dot + text.
- Status tokens beyond shadcn: --success oklch(0.55 0.13 150), --warning oklch(0.72 0.15 75), info = primary. Backgrounds at most /10 alpha.
- Process: keep every colour in tokens (no hard-coded hex in components) so a client brand swap is ~6 variables. User said "I dont see any changes": verify dev server serves edited CSS and components use token classes, not raw Tailwind palette classes.

## B. Direction and premium-UI conventions (design-blog consensus, informed opinion)
- Premium admin UIs: small base type (13-14px), Inter or Geist, tabular numerals, mono only for IDs/money, near-monochrome palette where colour carries meaning, hairline borders over shadows/gradients, white cards on slightly tinted canvas, flat KPI tiles.
- Why app looks plain: stock cold-grey neutrals, brand colour not structural, no type hierarchy, no surface layering. Fix is NOT decoration (already rejected) but warm/tinted neutral system, type scale, one committed brand moment per screen, disciplined status colour.
- Computed WCAG on white: #0F57A6 = 7.16:1 (good for text/buttons). #F04A2D = 3.67:1 on white (FAILS for text/small UI; white-on-it 3.67, large/bold only). Darkened orange #C93A1F = 5.11 on white, 4.70 on #F7F5F2 (passes). #0B3F7A = 10.47.
- DIRECTION A "Forge" (recommended): canvas #F7F5F2, card #FFFFFF, subtle fill #F1EEE9, border #E7E3DC, strong border #D6D1C8. Ink #1C1917, secondary #57534E (7.6), tertiary #78716C (4.8 on white; >=14px only). Primary #0F57A6, hover #0B4A8E, pressed #0B3F7A, tint #E8F0FA, focus ring #0F57A6 @40%. Orange as sparing signal: #F04A2D only for non-text marks, #C93A1F where text/button. Type Inter 14px admin, 15-16px mobile; scale 12/13/14/16/20/24/32; weights 400/500/600; mono for IDs. Radius 8px controls, 12px cards, 999px only for status pills. Elevation 1px border + 0 1px 2px rgb(28 25 23/.04).
- DIRECTION B "Gasul Bold": cool canvas #F5F6F8, deep-blue #0B3F7A header band on phone shells, orange #C93A1F only for the primary CTA (white on it 5.11), Plus Jakarta/Manrope headings + Inter body. Risk: drifts to marketing look.
- Recommendation: A for dispatcher/owner; borrow B's single deep-blue header band for customer/rider phone shells as the only brand moment. Keep brand tokens in one layer.
- Blue = identity + all interactive primary. Orange = scarce signal (<=1 element per screen): active-nav indicator, new-order dot, brand mark. Never orange for errors; never both as large side-by-side fills (Petron imitation look).
- Surfaces: 3 layers canvas > card > subtle fill; 1px borders not shadows. Table: header 12px/500 #57534E on #FBFAF8, row 44px admin / 56px mobile, hairline dividers, hover #F7F5F2, selected #E8F0FA, numeric right-aligned. KPI tile: label 12-13px secondary, value 28-32px/600 tabular, delta as coloured text (not chip), no icon chips, no progress bars, no sparkline unless data is real. Page header 20-24px title, 14px secondary, actions right; admin max width ~1200px.
- Status pairs (text on tint, all >= 6.3:1): success #166534 on #DCFCE7 (dot #15803D); pending #92400E on #FEF3C7 (dot #B45309); failed #991B1B on #FEE2E2 (dot #B91C1C); in transit/assigned info #1E40AF on #DBEAFE (dot #1D4ED8); neutral #44403C on #EDE9E3 (dot #78716C). Always colour + text label. Pill 12px/500.
- Mobile conventions for PH users (general knowledge): bottom tab bar 4-5 items; rows >=56px with PHP price right-aligned (P1,250.00); order status as vertical timeline stepper with timestamps; clear blue header + white cards (GCash-like); sticky bottom action bar with one full-width primary; COD / GCash as plain radio rows; 44px+ targets; high contrast for outdoor use.
- AVOID: any gradient, glow shadows, glassmorphism, emoji/cartoon, tinted icon chips, rounded-3xl, decorative progress bars, >1 accent per screen, #F04A2D text on white, pure #000, cold #F3F4F6 canvas, all-caps labels everywhere, 16px+ admin table body, invented chart data, copying real Petron/Gasul/Solane logos. No dark mode.
- Open: confirm real brand hexes and font licence; label colours as placeholders.

## C. Current-app audit (files under app/src)
- Tokens (index.css:54-90) mixed: brand tokens hex, but card/border/secondary/muted/sidebar are chroma-0 oklch; cold look. background #f8f9fb vs white card ~3% apart, flat.
- Card (ui/card.tsx:14) only ring-1 ring-foreground/10, no shadow/header hierarchy; all cards identical (KPI, table, form).
- Borders/rings faint; table headers same weight/colour as body, no uppercase muted header, no row hover, no sticky.
- Typography: Geist Variable only, --font-heading aliased to sans; every page title text-xl semibold (Board.tsx:61, Dashboard.tsx:75, Ops.tsx:21, Customer.tsx:61/126, Rider.tsx:19); CardTitle text-base font-medium; no eyebrow style; tabular-nums only in Kpi (charts.tsx:18). Landing H1 text-4xl only display text.
- Kpi (charts.tsx:10-25): Card size=sm, text-2xl value, muted label; at 5-across cards tiny, delta faint text-xs, "2% better" copy misleading on tiny changes.
- StatusPill (ui.tsx:20-28) uses raw Tailwind palette (amber/blue/green/red) not tokens; Assigned and Out for delivery share identical blue; Badge h-5 small; inventory "OK" badge unstyled; HealthBadge reuses STATUS.
- Header (ui.tsx:60-67): h-14 bg-card, title muted (least prominent), breadcrumb duplicates H1; "Demo" badge, lowercase role string, "Switch user" button crowd right; no avatar/user menu. Phone header repeats brand + "Rider app" + icon-only button.
- Brand: orange only in 24px logo tile; everything interactive blue, rest grey. Landing is text + outline cards, tiny role glyphs.
- Mobile nav (ui.tsx:72-78): fixed nav, active state is only text-primary; no safe-area padding; rider has a lone single tab; desktop phone frame is bordered column on flat grey.
- Sidebar (ui.tsx:84-103, index.css:82-89): near-white oklch(0.985) on #f8f9fb blends; group label xs muted; active item pale #eef3fa fill, no indicator; no footer/user; sidebar-ring neutral; SidebarMenuButton render={<span/>} inside NavLink may harm focus semantics.
- Spacing: main p-4 md:p-6; ad hoc gaps; row density inconsistent (~53px dispatcher vs ~37px analytics/inventory); each page hand-writes h1 block (no shared PageHeader); dead space under short pages (inventory).
- Tables: Board action column mixes primary Button, NativeSelect and ghost Cancel; two tables not column-aligned; numeric columns inconsistently right-aligned; no hover.
- Charts (index.css:76-80, charts.tsx:37): chart-1..5 all same blue family, low contrast chart-3/4; single stacked bar chart; default grid; no orange counter-colour. Analytics page has no focal point.
- Empty states: single small Card with muted text + underline link; no icon/title/CTA; shadcn Empty not installed.
- Interaction states inconsistent: hover on landing cards absent, sign-in row pale fill; bottom nav lacks focus-visible.
- Progress (Customer.tsx:105-108): still a thin "Step 1 of 4" progress bar, contradicts "too many progress bars"; replace with real dot stepper (done = check, current = filled primary, labels below).
- Dead .dark block (index.css:92-124) incl. purple sidebar-primary; light only product, delete.
- Missing shadcn primitives hand-rolled: Avatar, DropdownMenu, Tabs/ToggleGroup (By rider/By town, Dashboard.tsx:92), Empty, Breadcrumb, Field (ui.tsx:38), ScrollArea, Kbd, Spinner.
- Suggested order: (1) tokens + status/chart colours + badge variants, (2) Card/Table/Button tweaks, (3) PageHeader/Kpi/StatusPill refactor, (4) shell: header user menu, sidebar footer, bottom nav, (5) stepper, empty states, landing, (6) screenshot all routes.
