# Page migration brief (shared by all agents)

App: /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app (Vite + React 19 + TS + Tailwind v4 + shadcn `base-nova`, Base UI primitives).
Read first: knowledge/tasks/reviews/codex-ui-plan.md (design direction + per-screen spec) and src/components/ui.tsx (shared shells/badges already migrated).

GOAL: rebuild your assigned pages on shadcn components + Tailwind utility classes. The stakeholder said the old UI looked "too much AI". Target: quiet, restrained, boring-in-a-good-way admin/product UI.

HARD RULES
- Use components from `@/components/ui/*` (button, card, table, badge, input, textarea, select via `native-select`, checkbox, radio-group, tabs, dialog, alert-dialog, sheet, sonner `toast`, progress, alert, separator, skeleton, chart...). Use `cn` from `@/lib/utils`. Lucide icons only, `size-4` default, no emoji.
- Do NOT use: gradients, shadows beyond the card default, dashed borders, tinted icon tiles, cartoon/SVG illustrations (`components/art.tsx` is being deleted: do not import it), hover-lift effects, inline `style={{}}` (except dynamic widths/positions), the old CSS classes (.card .row .stack .pill .btn .chip .mute .big .grid etc.: the old stylesheet is GONE).
- Use `NativeSelect` (native <select>), NOT the Base UI `Select`, so selects stay keyboard/e2e friendly.
- Colour: brand blue = `primary`; `text-muted-foreground` for secondary text; status via `StatusPill` / `HealthBadge` / `ChannelTag` exported from `@/components/ui` (use them, do not reinvent). Orange (`bg-brand`) only for the logo. No colour-only meaning.
- Every input has a visible label (`Field` from `@/components/ui` wraps `<label>`; keep aria-labels that exist today).
- Only edit the files you own (listed in your task). Do NOT touch: src/components/ui.tsx, src/index.css, src/App.tsx, src/lib/*, e2e/*, other pages. If you need a tiny shared helper, define it locally in your file.
- Keep ALL behaviour and data logic identical (store actions, derive helpers). Only presentation changes. Keep these STABLE because the e2e script depends on them: route paths, button text ("Place order", "Create order", "Start delivery", "Complete delivery", "Confirm delivered", "Mark delivery failed", "Send now", "Reorder"...), aria-labels ("Demo customer", "Rider", "Assign ...", "Outcome <name>", "Turned over <rider>"), field labels ("Name", "Mobile number", "Street / purok"), SMS texts, `FG-####` ids shown in <b> or a <span> with the id as the only text, visible status text. Do not rename any visible label unless it is clearly wrong.
- Mobile first for customer + rider (430px), tables for admin with `overflow-x-auto` on narrow widths.
- Page title: one `<h1 className="text-xl font-semibold tracking-tight">` plus optional one-line `text-sm text-muted-foreground` description. Sections inside `Card` with `CardHeader/CardTitle/CardContent`.
- Verify: `cd app && npx tsc -b` must pass for YOUR files (other agents are editing other files concurrently; ignore their errors). Do not run the build or e2e. Do not start servers.
- Be efficient. When done, reply with a 5-line summary: files changed, anything you could not keep stable, any shared need you noticed.
