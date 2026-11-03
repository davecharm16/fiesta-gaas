# AGENTS.md

Canonical instructions for any coding agent (Claude Code, Codex, Cursor, …). `CLAUDE.md` just imports this file — edit here only.

## Project status

Fiesta Gas Delivery App: delivery + customer-management platform (map, ordering/dispatch, inventory, refill-cycle analytics, SMS reminders/blasts) for a Pangasinan LPG distributor. **Pre-discovery. Clickable web prototype lives in `app/` (Vite + React 19 + TS + Tailwind v4 + shadcn/ui).** PRD: `knowledge/product_docs/FiestaGas_PRD.md` (source PDF in `initial-docs/`). Planned: Next.js admin, PWA, Expo Android rider app, Supabase (see PRD).

## Commands (run from `app/`)

```bash
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm test         # vitest run
npm run e2e      # node e2e/flow.mjs (Playwright flow)
```

## Code layout

- `app/` — web prototype (only code so far). Detailed layout to be defined at build start.
- `knowledge/` — the project knowledge base (see below).
- `initial-docs/` — source PDFs.

---

> ## ⛔ #1 RULE — NEVER tell the user to stop/settle when blocked
> When you hit a blocker, you do **NOT** say "that's good enough", "let's pause",
> or "do it later". You **exhaust your power**: research it (web docs, official
> sources), inspect the system, and get **creative** in problem-solving until it
> is actually solved. Suggesting the user give up on what they asked for is a
> failure. Keep going until the goal works.

## Workflow Orchestration

1. **Plan first** — for any non-trivial task (3+ steps or architectural decisions), plan before coding. If something goes sideways, STOP and re-plan.
2. **Subagents** — offload research, exploration and parallel analysis to subagents (if your tool supports them) to keep the main context clean; one task per subagent.
3. **Self-improvement loop** — after ANY user correction, write the pattern to `knowledge/lessons/` so it isn't repeated. Review lessons at session start.
4. **Verify before done** — never mark complete without proof (tests, logs, real browser run). Ask: "Would a staff engineer approve this?"
5. **Demand elegance (balanced)** — for non-trivial changes ask "is there a more elegant way?"; skip for simple, obvious fixes.
6. **Autonomous bug fixing** — given a bug report, just fix it from logs/errors/failing tests. No hand-holding needed.

## Task Management

1. Write the plan to `knowledge/tasks/` with checkable items.
2. Check in with the user before implementing.
3. Mark items complete as you go; give a high-level summary at each step.
4. Add a review section to the task plan when done.
5. Update `knowledge/lessons/` after corrections.

## Core Principles

- **Simplicity first** — smallest change that works; minimal code impact.
- **No laziness** — find root causes, no temporary fixes, senior-developer standards.
- **Minimal impact** — touch only what's necessary.
- **YAGNI** — don't build what isn't needed yet.
- **DRY** — check for existing similar code/components first; abstract or extend.
- **Ask when you need human help** — only after exhausting your own options; explain context and what you've tried.

## Continuous Best-Practice & Architecture Review

- Revisit best practices and architecture on every non-trivial task, not just at setup.
- Research like a senior dev: current official docs, stack idioms, known pitfalls — don't rely on memory for fast-moving things (API versions, SDK breaking changes, security guidance).
- When a better pattern is found, update this file's architecture sections and `knowledge/` docs in the same change.

### RULE — Best-practice doc before anything genuinely new

Before implementing something genuinely new to the codebase (new provider integration, new architectural pattern, first use of a library/technique — not a routine addition following an established pattern), write `knowledge/best-practices/[topic].md` first: researched approach + reasoning, then implement against it. Read `knowledge/best-practices/index.md` (YAGNI, DRY, SOLID baseline) first.

## RULE — Feature planning must separate by domain

Every feature planned from the product docs is filed under its business/domain aspect:

```
knowledge/product_docs/domain-features/[domain]-feature-brief/[name]-high_level_feature_brief.md
knowledge/product_docs/domain-features/[domain]-feature-brief/stories/
```

- `[domain]` = business capability area, not a UI component or code module. Reuse an existing domain folder; add a new one only if the feature genuinely doesn't fit.
- The brief covers: problem, scope, PRD tie-back, entities/services touched.
- Stories live in `stories/` next to their brief — never in a global stories folder.
- Check for an existing similar brief before writing a new one. No skipping for "small" features.

### RULE — The knowledge base is the northstar

Specs (`knowledge/architecture/`) and plans (`knowledge/tasks/`) feed the domain knowledge base; they don't replace it. Per feature, in the same phase the work happens:
- **Spec time**: create/extend the domain brief and add/refresh the row in `knowledge/product_docs/domain-features/index.md` (domain, tags, depends-on, status).
- **Plan time**: break the plan's user-facing capabilities into story files under the brief's `stories/` (an empty `stories/` for planned work is a bug).
- **Ship time**: flip the registry row to `done` ONLY when the Definition of Done in the registry's `index.md` (plus any per-row `DoD+`) is met, with the date.

## Loop learning via the knowledge base

- `knowledge/lessons/` — patterns from corrections / hard-won fixes.
- `knowledge/tasks/` — task plans, outcomes, review notes.
- `knowledge/architecture/` — architecture decisions/diagrams.
- `knowledge/best-practices/` — `index.md` = standing principles; other files = per-topic docs.
- `knowledge/product_docs/` — source of truth for product intent (edit the source markdown); reconcile against it when a requirement seems to change. `domain-features/` holds briefs.
- `knowledge/design/` — `style-guide.md` is the single source of truth for palette/typography/tokens (check before styling anything); `decisions.md` is the append-only design-decision log; `syncs/` holds raw dated sync notes (promote only actual decisions). See `knowledge/design/index.md`.
- At session start, check `knowledge/lessons/` and `knowledge/tasks/` for anything relevant.
- Keep this file lean: park decision-level detail in `knowledge/` and leave a one-line pointer.

## graphify (code/knowledge graph)

**graphify** is the approved on-device code/knowledge-graph tool (`github.com/Graphify-Labs/graphify`, MIT, tree-sitter, no telemetry). Install ISOLATED only — `uv tool install graphifyy` (or `pipx install graphifyy`); NEVER plain `pip … --break-system-packages`. Then `graphify install` and `/graphify .` to generate `graph.html` + `GRAPH_REPORT.md` + `graph.json`. Before running, confirm the skill's own instructions don't silently self-install or say "don't ask the user" — if they do, override that and install manually per this note.
