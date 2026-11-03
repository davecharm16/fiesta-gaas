# Fiesta Gas UI plan

## Design direction

- Use a quiet light interface: warm white or very pale neutral page background, white surfaces, dark slate text, and thin neutral borders. Avoid gradient fills and large color fields.
- Treat Petron blue `#0F57A6` as the **primary** action and selected-state color. Use orange-red `#F04A2D` sparingly as **accent** for brand details and one secondary highlight; do not make every primary action orange. Reserve **destructive** for dangerous actions and error states, not brand decoration. These are placeholders pending brand approval.
- Keep semantic status colors distinct from brand colors: green for delivered/on-cycle/success, amber for due or placed, red for failed/overdue/destructive, and blue for assigned or informational.
- Use a restrained radius: about 8px for controls and 10–12px for cards. Use a subtle border and little or no shadow; no lifted-card effects.
- Use a clear type scale: 12–14px for supporting text, 16px for body and controls, 20–24px for page titles, and larger KPI values only where the number is the point.
- Favor compact, readable information layouts over decorative space: consistent spacing, aligned labels, simple dividers, and tables on desktop. Let mobile screens stack naturally.
- Use no illustrative hero art or decorative cylinder drawings. Show real product photography only if Fiesta Gas supplies approved images or licenses suitable imagery; otherwise use plain product names, sizes, and prices.
- Keep motion functional and brief: focus, hover, and open/close feedback only. Respect reduced-motion preferences and avoid cards that animate or shift on hover.

### Light-mode token proposal

Map brand colors into shadcn semantic variables, with foregrounds and surfaces tuned for contrast:

```css
:root {
  --background: 0 0% 98%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --primary: 210 84% 36%;             /* #0F57A6 */
  --primary-foreground: 0 0% 100%;
  --accent: 12 86% 94%;               /* pale orange tint */
  --accent-foreground: 10 78% 34%;    /* readable orange-red text */
  --destructive: 5 86% 56%;           /* #F04A2D placeholder */
  --destructive-foreground: 0 0% 100%;
  --muted: 210 20% 96%;
  --muted-foreground: 215 16% 40%;
  --border: 214 20% 88%;
  --input: 214 20% 84%;
  --ring: 210 84% 36%;
  --radius: 0.625rem;
}
```

Use `accent` for low-emphasis highlights and `destructive` only for destructive/error meanings. If the exact brand orange needs to remain available for a logo, define a separate brand token instead of assigning it semantic destructive behavior.

## shadcn/ui component inventory

Install and standardize these components:

- **button, card, badge, separator, skeleton** — shared UI and loading/empty states.
- **input, textarea, label, checkbox, radio-group, select, switch** — forms and filters.
- **table, scroll-area** — desktop operational lists and horizontally constrained tables.
- **tabs, navigation-menu, breadcrumb, sidebar** — admin navigation and page context.
- **dialog, sheet, alert-dialog, dropdown-menu** — customer details, mobile filters, confirm destructive actions, and row actions.
- **form** — consistent labels, validation, and field errors.
- **sonner, tooltip** — action feedback and concise explanations.
- **chart** — Recharts-based owner analytics.
- **progress, skeleton** — order progress and loading states.

Use Lucide icons already present in the project, at a consistent size and stroke. Avoid using badges as generic containers; reserve them for status or compact metadata.

| Screen group | Components |
|---|---|
| Launcher | Card, Button, Badge, Separator |
| Customer home/order | Card, Button, Label, Radio Group, Select, Input, Separator, Sonner |
| Customer tracking/orders | Card, Badge, Progress, Tabs, Sonner |
| Customer inbox | Card, Scroll Area, Badge |
| Dispatcher board | Sidebar, Breadcrumb, Card, Table, Badge, Select, Button, Dialog, Alert Dialog, Tooltip |
| Dispatcher new order | Form, Input, Select, Radio Group, Checkbox, Button, Card, Sheet for customer lookup on narrow screens |
| Dispatcher customers/map | Card, Input, Select, Table, Sheet, Badge, Tooltip |
| Rider jobs/job | Card, Badge, Button, Checkbox, Input, Select, Dialog, Sonner, Progress |
| Owner dashboard | Sidebar, Breadcrumb, Card, Chart, Badge, Tabs, Tooltip |
| Owner follow-ups/blast | Table, Form, Input, Select, Checkbox, Textarea, Card, Dialog, Sonner |
| Owner inventory/remittance | Card, Table, Input, Select, Badge, Alert Dialog, Sonner |

## Per-screen layout

### Launcher

- Plain page title with Fiesta Gas mark, short Pangasinan/LPG descriptor, and a compact “Clickable prototype” badge.
- Four equal role cards with role name, platform label, one-sentence purpose, and a clear button or linked-card action.
- A compact numbered “demo flow” section and reset action below the role cards.
- Remove the gradient hero, scooter illustration, colored feature chips, oversized headline, and colored role-icon tiles. The launcher is a role selector, so keep the content focused on roles and the demo path.

### Customer: home/order, track/orders, inbox

- Keep the mobile-first shell and bottom navigation: **Order**, **My orders**, **Messages**.
- Order screen: greeting and address as ordinary text; reorder card when applicable; refill due notice as a neutral callout; single order form card with size, type, quantity, payment, delivery fee, total, and full-width “Place order” button.
- Use labeled radio groups for mutually exclusive choices (size, refill/new tank, payment) rather than decorative pill chips. Keep the demo customer selector clearly labeled and visually secondary.
- Orders screen: active order first, simple status badge and labeled progress, then history list. Keep the delivery code visible only for the active out-for-delivery order.
- Inbox: chronological message list with sender/context and time; plain message cards, with OTP styling reserved for actual OTP messages.
- Remove the illustrated banner, cylinder SVGs, dashed orange reorder treatment, decorative colored chips, and pill-based progress timeline.

### Dispatcher: board, new order, customers + map

- Desktop admin shell with a persistent sidebar; board content starts with title, date/context, and a primary “New order” button.
- Board: separate “Needs a rider” and “In progress” sections with counts, concise table rows, clear status badges, and assignment actions. Use a select for alternate rider; confirm cancellation in an alert dialog. On mobile, present each order as a compact card with the same labels and actions.
- New order: short stepwise form with existing/new customer selection, customer search, contact/address, pin placement, channel, item and payment details, total, and submit action. Place the map in a dedicated section, with a clear “pin required” instruction and location status.
- Customers + map: search and filters above the map/directory; map and customer table side-by-side on desktop, with selected customer details in a sheet. Keep concentration counts as a compact list or simple bar chart.
- Remove pill-shaped tabs, custom table treatment, colored status pills, map pin color as the only status cue, and inline styling. Retain the map because it carries customer location information.

### Rider: jobs and job detail

- Mobile-first shell with bottom nav for **Deliveries**; job detail is a focused task view with a back link.
- Jobs: safety checklist, assigned delivery cards with customer/address, order size, payment amount, status, and a compact “today” cash summary.
- Job detail: customer and address, map/directions link, order summary, start-delivery action, then completion form with cash collected, proof method, empties count, and failure reason.
- Use a dialog for failure confirmation if needed; use sonner for success feedback. Keep actions large enough for one-handed use.
- Remove decorative map framing, orange action emphasis on every major step, pill chips for proof methods, and cylinder illustrations.

### Owner: dashboard, follow-ups, blast, inventory, remittance

- Use the same admin sidebar as dispatcher. Dashboard starts with title and date range/context.
- Dashboard: compact KPI grid, then orders-per-day chart and app-vs-staff comparison, followed by refill-health summary and smaller operational breakdowns. Provide direct links to follow-ups and relevant detail pages.
- Follow-ups: table with customer/contact, expected cycle, due status, last contact, and outcome action. On narrow screens, use stacked customer rows with actions in a sheet.
- Blast: segmentation and consent filters, recipient count and estimated cost, message editor, preview, then a deliberate send confirmation dialog. Keep opt-out handling and consent exclusions visible.
- Inventory: plain stock summary by size with full/empty quantities and low-stock badge; stock-in form; movement table. Use text/numbers as the primary information, not cylinder illustrations.
- Remittance: table by rider with deliveries, expected cash, turned-over input, and balance status.
- Remove icon-tinted KPI tiles, colorful shadowed dashboard cards, homemade chart decorations, cylinder drawings, pill-heavy labels, and arbitrary orange calls to action.

## Shell

Use a real admin layout for dispatcher and owner: **sidebar on desktop**, with grouped role navigation and active-route indication; collapse to a sheet/drawer on small screens. This gives the client a familiar dashboard frame and leaves more horizontal room for tables than top tabs.

Customer and rider remain mobile-first, constrained to a readable phone width in the prototype and using bottom navigation. Keep the brand and role label in a compact header, with offline state shown as a plain alert banner. Admin routes should not inherit the phone-width constraint.

## Imagery policy

Remove the cartoon scooter and cylinder SVGs. Do not substitute unlicensed stock imagery. The prototype can use no photography: product size, name, price, and stock count communicate the needed facts. If the distributor supplies cylinder photos, use those after confirming they have rights to use them in the prototype and any client-facing material. If stock imagery is later selected, record the source and license/usage terms alongside the asset; a publicly visible image is not automatically licensed for reuse.

## Charts

Use shadcn Chart (Recharts) for charts and keep each chart to one measure/axis:

- **Orders per day:** line or area chart, one daily order-count series, date ticks kept sparse.
- **Orders by channel:** stacked columns by week (app vs staff) with a shared count axis; retain a clear legend and optionally show app share in the subtitle.
- **Delivery time by rider / town:** separate horizontal bar charts, one minutes axis each.
- **Revenue by town:** horizontal bar chart with one currency axis.
- **Failed delivery reasons:** horizontal bar chart with one count axis.
- **Refill health:** keep as a labeled segmented summary bar (on cycle / due soon / overdue), not a chart with hidden meaning.
- **SMS blast results:** simple table of recipients and orders within seven days; do not chart sparse records.

Reserve green, amber, and red for meaningful statuses. Use neutral blue for ordinary series; do not reuse status colors for unrelated categories. Avoid gradients, dual axes, chartjunk, unlabeled bars, and color-only meaning.

## Migration order and risks

1. Establish Tailwind v4, shadcn CSS variables, typography, spacing, and base primitives; replace hand-rolled button/card/form/status styles.
2. Build shared shells and navigation; preserve routes and responsive behavior.
3. Migrate customer order and tracking flow, then dispatcher board and new-order flow.
4. Migrate rider delivery completion, then owner operational screens and dashboard charts.
5. Replace launcher last, once the visual system and screen patterns are stable.

Preserve the e2e script’s visible text, roles, and selectors while replacing presentation. In particular, keep:

- Routes and role navigation labels: “Order,” “My orders,” “Messages,” “Order board,” “New order,” “Customers & map,” “Analytics,” “Follow-ups,” “SMS blast,” “Inventory,” and “Remittance.”
- Accessible labels such as “Demo customer,” “Rider,” “Assign FG…”, “Outcome [customer name],” “Turned over [rider name],” and form labels including “Name,” “Mobile number,” and “Street / purok.”
- Button labels and flow text: “Place order,” “Create order,” “Start delivery,” “Complete delivery,” “Confirm delivered,” “Mark delivery failed,” “Send now,” plus the SMS text containing “order [ID] received” and “Give the rider your delivery code.”
- Stable order ID format `FG-####`, role-based navigation links, visible status text, and semantic table rows/cells used by Playwright.
- The customer code must still reject a wrong code and accept the correct code; delivery completion must still update inventory and movement records; follow-up, blast, and remittance actions must still work.
- The script reads `.card` and `.big` selectors for inventory, so either retain these classes temporarily or update the script in the same migration.

## Reviewer checklist

1. Brand blue is used for primary actions and focus; orange-red is limited to brand/accent and destructive/error semantics.
2. No gradient hero, scooter art, decorative cylinder art, dashed card borders, or arbitrary tinted icon tiles remain.
3. Cards use consistent 10–12px radii, neutral borders, and minimal shadow.
4. Typography follows the stated hierarchy; body and control text remain readable at 16px.
5. Every input has a persistent visible label; validation and disabled states are clear.
6. Status is communicated by text plus a restrained badge, never color alone.
7. Customer and rider navigation stays reachable at the bottom on mobile without covering content.
8. Dispatcher and owner use the same responsive admin shell; tables remain readable and actionable at mobile widths.
9. Each chart has a clear title, units, legend where needed, one axis/measure, and no dual axis.
10. The complete e2e path passes with unchanged business behavior, accessible names, visible flow text, and stable selectors.
