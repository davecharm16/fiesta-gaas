# shadcn CLI gotchas (Vite 8, TS 7, Tailwind v4)
- `shadcn add` wired generated components to an npm package literally named `cn` and re-adds it on every `add`. Fix: `src/lib/utils.ts` = clsx + tailwind-merge, `sed` imports to `@/lib/utils`, `npm rm cn`; re-check after each `add`.
- TS 7 removed `baseUrl`: use only `paths` in tsconfig.
- Default style is `base-nova` (Base UI, `render` prop instead of `asChild`). Use `NativeSelect`, not Base UI Select, so e2e `selectOption` works.
- Screenshots of Recharts taken immediately show empty charts (entry animation): wait ~900ms before capture.
- Process: give Codex a reviewer brief (defects only, file:line, severity, verify-first, no praise) and it returns short, mostly real findings.
- Returning visitors saw a stale PWA build: register the SW via virtual:pwa-register and reload on onNeedRefresh; show a build stamp so 'is this the new version?' is answerable. (2026-10-31)
- Admin tables: shadcn TableCell is whitespace-nowrap, so wide tables clip inside the card at 1280px. Merge columns / add whitespace-normal; always LOOK at the desktop screenshot, agents and Codex only flagged it as a phone problem. (2026-10-31)
