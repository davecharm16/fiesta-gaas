## 1. Design thesis: 5 bullets.

- Give Fiesta Gas a dependable, operations-first feel: warm neutral surfaces, clear type hierarchy, and blue as the consistent interactive color.
- Keep surfaces distinct with a lightly warm canvas, white cards, and restrained borders; use shadows only to separate layers that need it.
- Reserve orange for one small signal per screen, such as the brand mark or an active marker. Use a darker orange for any text or filled control.
- Use color to communicate status and action. Pair every status color with a readable label; remove decorative progress bars and icon backgrounds.
- Treat the blue and orange brand values as placeholders until the client confirms them. Keep colors tokenized for a simple palette swap.

## 2. Token table for :root

Use these values in light mode. Status and brand variants are included as semantic tokens so component classes do not need raw palette colors.

| Token | Value | Intended use |
|---|---|---|
| `--background` | `#F7F5F2` | App canvas |
| `--foreground` | `#1C1917` | Main text |
| `--card` | `#FFFFFF` | Cards and raised content |
| `--card-foreground` | `#1C1917` | Card text |
| `--popover` | `#FFFFFF` | Menus and popovers |
| `--popover-foreground` | `#1C1917` | Popover text |
| `--primary` | `#0F57A6` | Primary actions, links, selected controls |
| `--primary-foreground` | `#FFFFFF` | Text/icons on primary |
| `--secondary` | `#F1EEE9` | Secondary fills |
| `--secondary-foreground` | `#292524` | Text on secondary |
| `--muted` | `#F1EEE9` | Quiet fills and table headers |
| `--muted-foreground` | `#57534E` | Secondary text |
| `--accent` | `#E8F0FA` | Hover and selected-row fill |
| `--accent-foreground` | `#0B3F7A` | Text on accent |
| `--destructive` | `#B42318` | Destructive action and error text |
| `--border` | `#D6D1C8` | Control and component borders |
| `--input` | `#D6D1C8` | Input border |
| `--ring` | `#0F57A6` | Focus ring |
| `--chart-1` | `#0F57A6` | Primary series |
| `--chart-2` | `#C93A1F` | Secondary series |
| `--chart-3` | `#167D9A` | Third series |
| `--chart-4` | `#946200` | Fourth series |
| `--chart-5` | `#57534E` | Fifth series |
| `--sidebar` | `#211E1B` | Admin navigation surface |
| `--sidebar-foreground` | `#F7F5F2` | Sidebar text |
| `--sidebar-primary` | `#0F57A6` | Active navigation fill |
| `--sidebar-primary-foreground` | `#FFFFFF` | Text on active navigation |
| `--sidebar-accent` | `#34302C` | Sidebar hover/selected fill |
| `--sidebar-accent-foreground` | `#FFFFFF` | Text on sidebar accent |
| `--sidebar-border` | `#49443E` | Sidebar dividers |
| `--sidebar-ring` | `#8AB8E8` | Sidebar focus ring |
| `--success` | `#166534` | Success text and icons |
| `--success-soft` | `#DCFCE7` | Success background |
| `--success-foreground` | `#14532D` | Text on success background |
| `--warning` | `#92400E` | Warning text and icons |
| `--warning-soft` | `#FEF3C7` | Warning background |
| `--warning-foreground` | `#78350F` | Text on warning background |
| `--info` | `#1E40AF` | Informational text and icons |
| `--info-soft` | `#DBEAFE` | Information background |
| `--info-foreground` | `#1E3A8A` | Text on info background |
| `--brand` | `#F04A2D` | Brand mark or non-text signal only |
| `--brand-strong` | `#C93A1F` | Accessible orange action/text |
| `--brand-soft` | `#FCE8E2` | Rare orange background |
| `--brand-foreground` | `#7C2D12` | Text on brand-soft |

Key contrast ratios (WCAG contrast calculations, rounded to one decimal):

| Foreground / background | Ratio | Use |
|---|---:|---|
| `#1C1917` / `#F7F5F2` | 15.4:1 | Body text on canvas |
| `#57534E` / `#FFFFFF` | 7.6:1 | Secondary text on cards |
| `#57534E` / `#F7F5F2` | 7.0:1 | Secondary text on canvas |
| `#0F57A6` / `#FFFFFF` | 7.2:1 | Links and primary text |
| `#FFFFFF` / `#0F57A6` | 7.2:1 | Primary button label |
| `#0B3F7A` / `#E8F0FA` | 9.0:1 | Selected-row text |
| `#B42318` / `#FFFFFF` | 6.6:1 | Destructive text |
| `#166534` / `#DCFCE7` | 6.2:1 | Success status |
| `#92400E` / `#FEF3C7` | 6.4:1 | Warning status |
| `#1E40AF` / `#DBEAFE` | 7.0:1 | Info status |
| `#7C2D12` / `#FCE8E2` | 7.2:1 | Brand-soft text |
| `#F04A2D` / `#FFFFFF` | 3.7:1 | **Decorative mark only; fails for text** |
| `#C93A1F` / `#FFFFFF` | 5.1:1 | Accessible orange text/action |

Use `#D6D1C8` borders for controls and component edges; do not rely on border color alone to communicate state. The listed text/background pairs meet AA for normal text. For UI geometry and larger text, retain the stronger listed ratios where possible. Do not use the bright orange token as text on white.

## 3. Font family, type scale, and numeric styling

- **Package:** [`@fontsource-variable/inter`](https://www.npmjs.com/package/%40fontsource-variable/inter); CSS family name: **`"Inter Variable"`**. The package is published on npm and supports variable weights. citeturn0search0
- Use Inter Variable throughout, with system sans-serif fallback. Do not add a separate display face.
- Use 400 for body, 500 for labels and controls, and 600 for titles and KPI values. Avoid 700 except for rare emphasis.
- Scale: 12px metadata; 13px compact admin labels; 14px admin body; 16px phone body and form controls; 20px page title; 24px major heading; 32px landing headline and prominent KPI.
- Use tabular numerals for all prices, quantities, counts, dates, times, KPIs, and table numeric columns. Use slashed-zero only for identifiers where confusion is likely. Avoid monospace for general content.

## 4. Radius, border, shadow and density rules (admin vs phone)

- Set base radius to 8px. Controls use 8px; cards and dialogs use 12px; status badges use fully rounded pills. Avoid larger decorative radii.
- Use 1px borders in `border-border`. Cards may use a restrained `0 1px 2px rgb(28 25 23 / 0.04)` shadow. Avoid large shadows, glow, and gradients.
- **Admin:** 14px body, 36px controls, 44px table rows, 16px card padding, compact 12px metadata. Keep dashboards aligned to a readable max width around 1200px.
- **Phone:** 16px form text, 44px minimum touch targets, 56px table/list rows, 16px page gutters, and a 48px minimum primary action. Keep the bottom navigation clearly separated by a top border and a 2px active indicator.

## 5. Component-level rules

Class patterns below assume the listed colors are mapped to Tailwind semantic utilities. Extend the project’s theme mapping for `success`, `warning`, `info`, and brand variants as needed.

- **Button:** Primary: `h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/35`. Secondary: `h-9 rounded-lg border border-border bg-card text-foreground hover:bg-muted`. Destructive uses `bg-destructive text-white`. On phone, use `h-11` or taller.
- **Card:** `rounded-xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgb(28_25_23/0.04)]`. Header: `gap-1.5 p-4`; title `text-base font-semibold`; content `p-4 pt-0`. Keep KPI cards flat and consistent.
- **Badge:** `inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium`. Status badge pairs use their corresponding `*-soft` background and `*-foreground` text plus a small status dot and explicit label. Neutral status uses `bg-muted text-foreground`.
- **Table:** Wrap in `overflow-x-auto rounded-xl border border-border bg-card`. Header: `sticky top-0 bg-muted text-xs font-medium text-muted-foreground`; cells `h-11 px-3`; rows `border-b border-border/70 hover:bg-accent/50`; selected rows `bg-accent`. Numeric cells use `text-right tabular-nums`. Avoid colored row fills for ordinary data.
- **Input:** Admin: `h-9 rounded-lg border border-input bg-card px-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25`. Phone: `h-11 text-base`. Keep labels visible above controls; do not rely on placeholders as labels.
- **Tabs/nav:** Tabs: `h-10 border-b border-border`; selected tab `border-b-2 border-primary font-medium text-primary`; inactive `text-muted-foreground hover:text-foreground`. Phone bottom nav: `min-h-14 border-t border-border bg-card`; selected icon/label `text-primary` and a 2px top indicator; inactive `text-muted-foreground`. No filled icon chips.
- **Sidebar:** `bg-sidebar text-sidebar-foreground`; group labels `px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/70`; links `h-10 rounded-md px-3`; active `bg-sidebar-accent text-sidebar-accent-foreground` with a 2px left `--brand-strong` marker. Keep icons directly on the surface.
- **Header:** Admin header `h-14 border-b border-border bg-card px-6`; page title `text-sm font-medium text-foreground`; reserve the larger 20–24px title for the page content heading. Phone header uses `bg-primary text-primary-foreground`, title `text-base font-semibold`, and plain icon actions with accessible labels.
- **KPI card:** `rounded-xl border border-border bg-card p-4`; label `text-xs font-medium text-muted-foreground`; value `text-[28px] font-semibold tracking-tight tabular-nums`; comparison `mt-1 text-xs text-muted-foreground`. Use one meaningful comparison when data supports it; no progress bars, icon chips, or invented sparks.
- **Toast:** `rounded-lg border border-border bg-popover text-popover-foreground shadow-md`; title `text-sm font-semibold`, description `text-sm text-muted-foreground`; success/error icon and text use semantic tokens. Keep messages concise and actionable.
- **Chart:** Put charts on white card surfaces. Use chart tokens only; axes and grid use muted foreground/border tokens. Use `text-xs` labels, tabular tooltip values, and explicit legends. Use a chart only where the data answers a real question; avoid decorative sparklines or bar-like progress indicators.

## 6. Per-screen adjustments

### Landing

- Use a 32px semibold headline and short plain-language subhead; lead with the delivery service and Pangasinan coverage.
- Use one primary blue CTA and a secondary outlined CTA.
- Use a simple text-and-number service summary; no illustrations or decorative graphics.
- Keep the existing brand mark as the only orange element.

### Sign-in

- Center a compact form card on the warm canvas with a clear title and short instruction.
- Show each demo role as a full-width selectable row with role name and one-line description.
- Use a blue selected border and checkmark; avoid role-specific color treatments.
- Make the primary sign-in action full width and at least 48px high.

### Customer

- Keep the phone shell at a readable maximum width with a blue header and white content cards.
- Put reorder and current-order actions first; price and quantity use tabular numerals.
- Display order status as a text-labeled vertical timeline with timestamps.
- Make the primary action sticky above the bottom navigation when the task needs it.
- Keep payment methods as plain radio rows with clear selected state.

### Rider

- Prioritize the current assigned delivery and the next required action above history.
- Use large, full-width actions with 44px+ touch targets and clear action verbs.
- Show address, contact, and delivery notes as scannable text rows with direct actions.
- Use explicit status text and timestamps; do not add decorative completion bars.

### Dispatcher

- Use the dark sidebar as the single strong admin frame and keep the main canvas warm.
- Place queue counts near section titles; distinguish urgent states with status labels and text.
- Keep assignment controls inline where space permits and use compact 36px admin controls.
- Use sticky table headers, 44px rows, right-aligned prices, and visible row hover.

### Owner

- Lead with a 20px page title and a compact row/grid of flat KPI cards.
- Use real comparisons only when the source window and sample size are clear.
- Keep charts secondary to labeled tables; use one chart accent series at a time where possible.
- Surface customer follow-up and overdue work as text-linked counts with semantic status colors.

## 7. A 10-item reviewer checklist

1. Does each screen have one clear primary action?
2. Are blue and orange used consistently, with orange limited to a small signal?
3. Does every text/background pair meet AA contrast for its size?
4. Are all statuses labeled in text as well as color?
5. Are cards, inputs, and tables using the same border and radius language?
6. Are page titles visibly stronger than body copy and shell labels?
7. Do prices, counts, times, and quantities align with tabular numerals?
8. Are phone controls at least 44px tall and comfortable to tap?
9. Are admin tables compact but readable, with visible hover and selected states?
10. Have gradients, illustrations, emoji, tinted icon chips, and decorative progress bars been removed?
