OpenAI Codex v0.165.0
--------
workdir: /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
model: gpt-6-luna
provider: openai
approval: never
sandbox: read-only
reasoning effort: medium
reasoning summaries: none
session id: 01a18e65-d084-78f3-8660-da8e4fef2ef4
--------
user
Review the visual redesign of this PWA prototype for a client demo: src/components/art.tsx (SVG illustrations), src/components/charts.tsx, src/pages/owner/Dashboard.tsx, src/pages/Launcher.tsx, src/pages/customer/Customer.tsx (banner/reorder/size cards), src/lib/seed.ts (growth story), e2e/flow.mjs. Look for: wrong numbers/math or misleading labels on the dashboard (deltas, windows, app-share text), chart bugs (division by zero, empty data, NaN, tooltip positioning), SVG/a11y problems, React bugs, and demo-breaking edge cases (empty seed groups). Do NOT edit files. Max 10 findings, ranked: file:line - problem - fix. No style nitpicks.

codex
I’ll inspect the requested components and demo flow for concrete correctness and edge case issues, without changing files.
exec
/bin/bash -lc 'pwd && rg -n "" src/components/art.tsx src/components/charts.tsx src/pages/owner/Dashboard.tsx src/pages/Launcher.tsx src/pages/customer/Customer.tsx src/lib/seed.ts e2e/flow.mjs' in /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
 succeeded in 0ms:
/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
src/pages/Launcher.tsx:1:import { Link } from 'react-router-dom'
src/pages/Launcher.tsx:2:import { ArrowRight, BarChart3, Bike, MapPin, MessageSquareText, Package, RotateCcw, Smartphone, Wifi, LayoutDashboard } from 'lucide-react'
src/pages/Launcher.tsx:3:import { HeroArt } from '../components/art'
src/pages/Launcher.tsx:4:import { Brand } from '../components/ui'
src/pages/Launcher.tsx:5:import { actions } from '../lib/store'
src/pages/Launcher.tsx:6:
src/pages/Launcher.tsx:7:const ROLES = [
src/pages/Launcher.tsx:8:  ['/customer', Smartphone, '#0f57a6', 'Customer', 'Mobile PWA', 'Order a refill, track the rider, see history. Installs from a link, no app store.'],
src/pages/Launcher.tsx:9:  ['/dispatcher', LayoutDashboard, '#0b2a57', 'Dispatcher', 'Web dashboard', 'Encode call and text orders, assign riders, manage the Pangasinan customer map.'],
src/pages/Launcher.tsx:10:  ['/rider', Bike, '#f04a2d', 'Rider', 'Android app (shown as web)', 'Delivery list, directions, payment, proof of delivery, failed-delivery reasons.'],
src/pages/Launcher.tsx:11:  ['/owner', BarChart3, '#157a48', 'Owner / Manager', 'Web dashboard', 'Analytics, refill follow-ups, SMS blasts, inventory and remittance.'],
src/pages/Launcher.tsx:12:] as const
src/pages/Launcher.tsx:13:
src/pages/Launcher.tsx:14:export default function Launcher() {
src/pages/Launcher.tsx:15:  return (
src/pages/Launcher.tsx:16:    <div className="page stack" style={{ maxWidth: 1040, gap: 18 }}>
src/pages/Launcher.tsx:17:      <div className="row"><Brand dark /><span className="demo-tag">CLICKABLE PROTOTYPE</span></div>
src/pages/Launcher.tsx:18:      <section className="hero">
src/pages/Launcher.tsx:19:        <div className="copy">
src/pages/Launcher.tsx:20:          <span className="badge"><MapPin size={13} /> Pangasinan · LPG delivery</span>
src/pages/Launcher.tsx:21:          <h1>From phone call to doorstep, on one platform.</h1>
src/pages/Launcher.tsx:22:          <p>Customers reorder in a minute, riders prove every delivery, and the refill cycle tells you who to call before they switch supplier.</p>
src/pages/Launcher.tsx:23:          <div className="feats"><span><Smartphone size={14} />Installable PWA</span><span><Package size={14} />Live cylinder stock</span><span><MessageSquareText size={14} />Refill reminders &amp; SMS blasts</span><span><Wifi size={14} />Works offline</span></div>
src/pages/Launcher.tsx:24:        </div>
src/pages/Launcher.tsx:25:        <div className="art"><HeroArt /></div>
src/pages/Launcher.tsx:26:      </section>
src/pages/Launcher.tsx:27:      <div className="launch">
src/pages/Launcher.tsx:28:        {ROLES.map(([to, Icon, color, name, kind, blurb]) => (
src/pages/Launcher.tsx:29:          <Link key={to} to={to} className="card role lift">
src/pages/Launcher.tsx:30:            <div className="ico" style={{ background: color }}><Icon size={24} /></div>
src/pages/Launcher.tsx:31:            <ArrowRight className="go" size={18} />
src/pages/Launcher.tsx:32:            <h2 style={{ marginBottom: 2 }}>{name}</h2><div className="mute" style={{ fontWeight: 700, marginBottom: 6 }}>{kind}</div>
src/pages/Launcher.tsx:33:            <p className="mute" style={{ margin: 0, fontSize: 14 }}>{blurb}</p>
src/pages/Launcher.tsx:34:          </Link>
src/pages/Launcher.tsx:35:        ))}
src/pages/Launcher.tsx:36:      </div>
src/pages/Launcher.tsx:37:      <div className="card lift">
src/pages/Launcher.tsx:38:        <h2>Walk the whole loop in 5 minutes</h2>
src/pages/Launcher.tsx:39:        <ol className="steps">
src/pages/Launcher.tsx:40:          <li><div><b>Customer</b> taps Reorder. An SMS confirmation lands in their inbox.</div></li>
src/pages/Launcher.tsx:41:          <li><div><b>Dispatcher</b> sees it on the board, assigns the suggested nearest rider, and encodes a phone-call order for a new customer.</div></li>
src/pages/Launcher.tsx:42:          <li><div><b>Rider</b> starts the delivery, collects cash, confirms with the customer's code (demo code 4821), logs the empty collected.</div></li>
src/pages/Launcher.tsx:43:          <li><div><b>Owner</b> sees stock drop, the dashboard move, overdue customers to call, and sends a promo blast.</div></li>
src/pages/Launcher.tsx:44:        </ol>
src/pages/Launcher.tsx:45:        <div className="row" style={{ marginTop: 14 }}>
src/pages/Launcher.tsx:46:          <button className="btn ghost sm" onClick={actions.reset}><RotateCcw size={14} style={{ verticalAlign: -2 }} /> Reset demo data</button>
src/pages/Launcher.tsx:47:          <span className="mute">Prototype: SMS, payments and GPS are simulated. Brand colors are placeholders pending Petron approval.</span>
src/pages/Launcher.tsx:48:        </div>
src/pages/Launcher.tsx:49:      </div>
src/pages/Launcher.tsx:50:    </div>
src/pages/Launcher.tsx:51:  )
src/pages/Launcher.tsx:52:}
e2e/flow.mjs:1:// End-to-end: ONE order through customer -> dispatcher -> rider -> customer -> owner. Run: npm run build && npm run preview, then npm run e2e
e2e/flow.mjs:2:import { chromium } from 'playwright'
e2e/flow.mjs:3:import { mkdirSync } from 'node:fs'
e2e/flow.mjs:4:import assert from 'node:assert/strict'
e2e/flow.mjs:5:
e2e/flow.mjs:6:import { existsSync, readdirSync } from 'node:fs'
e2e/flow.mjs:7:import { homedir } from 'node:os'
e2e/flow.mjs:8:// Use any Chromium already in the Playwright cache (avoids a fresh browser download); falls back to Playwright's own.
e2e/flow.mjs:9:function findChrome() {
e2e/flow.mjs:10:  const root = `${homedir()}/Library/Caches/ms-playwright`
e2e/flow.mjs:11:  if (!existsSync(root)) return undefined
e2e/flow.mjs:12:  for (const d of readdirSync(root).filter((x) => /^chromium-\d+$/.test(x)).sort().reverse()) {
e2e/flow.mjs:13:    const p = `${root}/${d}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`
e2e/flow.mjs:14:    if (existsSync(p)) return p
e2e/flow.mjs:15:  }
e2e/flow.mjs:16:}
e2e/flow.mjs:17:const BASE = process.env.BASE ?? 'http://localhost:4173/'
e2e/flow.mjs:18:const OUT = new URL('../../knowledge/design/references/e2e/', import.meta.url).pathname
e2e/flow.mjs:19:mkdirSync(OUT, { recursive: true })
e2e/flow.mjs:20:const browser = await chromium.launch({ executablePath: process.env.CHROME ?? findChrome() })
e2e/flow.mjs:21:const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, serviceWorkers: 'block' })
e2e/flow.mjs:22:const page = await ctx.newPage()
e2e/flow.mjs:23:const errors = []
e2e/flow.mjs:24:page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
e2e/flow.mjs:25:page.on('pageerror', (e) => errors.push(String(e)))
e2e/flow.mjs:26:let n = 0
e2e/flow.mjs:27:const shot = (name) => page.screenshot({ path: `${OUT}${String(++n).padStart(2, '0')}-${name}.png` })
e2e/flow.mjs:28:const go = async (hash, w = 430) => { await page.setViewportSize({ width: w, height: 900 }); await page.goto(`${BASE}#${hash}`) }
e2e/flow.mjs:29:const step = (s) => console.log('•', s)
e2e/flow.mjs:30:
e2e/flow.mjs:31:await go('/'); await page.evaluate(() => localStorage.clear()); await go('/'); await shot('launcher')
e2e/flow.mjs:32:
e2e/flow.mjs:33:step('stock before')
e2e/flow.mjs:34:await go('/owner/inventory', 1280)
e2e/flow.mjs:35:const stock11 = async () => +(await page.locator('.card', { hasText: '11KG' }).first().locator('.big').innerText()).split(' ')[0]
e2e/flow.mjs:36:const before = await stock11()
e2e/flow.mjs:37:
e2e/flow.mjs:38:step('customer places an order')
e2e/flow.mjs:39:await go('/customer')
e2e/flow.mjs:40:await page.getByRole('button', { name: 'Place order' }).click()
e2e/flow.mjs:41:await page.waitForURL(/orders/)
e2e/flow.mjs:42:const id = (await page.locator('.card b', { hasText: /^FG-\d+$/ }).first().innerText()).trim()
e2e/flow.mjs:43:assert.match(id, /^FG-\d+$/); await shot('customer-placed')
e2e/flow.mjs:44:
e2e/flow.mjs:45:step('customer got SMS confirmation')
e2e/flow.mjs:46:await page.getByRole('link', { name: 'Messages' }).click()
e2e/flow.mjs:47:await page.getByText(`order ${id} received`).waitFor(); await shot('customer-sms')
e2e/flow.mjs:48:
e2e/flow.mjs:49:step('dispatcher sees it as Placed, assigns nearest rider')
e2e/flow.mjs:50:await go('/dispatcher', 1280)
e2e/flow.mjs:51:const row = page.locator('tr', { hasText: id })
e2e/flow.mjs:52:await row.getByText('Placed').waitFor()
e2e/flow.mjs:53:await row.getByRole('button', { name: /^Assign/ }).click()
e2e/flow.mjs:54:await page.locator('tr', { hasText: id }).getByText('Assigned').waitFor()
e2e/flow.mjs:55:const riderName = (await page.locator('tr', { hasText: id }).locator('td').last().innerText()).replace('🛵', '').trim()
e2e/flow.mjs:56:assert.ok(riderName, 'rider name shown'); await shot('dispatcher-assigned')
e2e/flow.mjs:57:
e2e/flow.mjs:58:step(`rider ${riderName} starts and completes it`)
e2e/flow.mjs:59:await go('/rider')
e2e/flow.mjs:60:await page.getByLabel('Rider').selectOption({ label: riderName })
e2e/flow.mjs:61:await page.getByRole('link', { name: new RegExp('Maria Santos') }).click()
e2e/flow.mjs:62:await page.getByRole('button', { name: /Start delivery/ }).click()
e2e/flow.mjs:63:await page.getByText('Complete delivery').waitFor(); await shot('rider-out-for-delivery')
e2e/flow.mjs:64:
e2e/flow.mjs:65:step('customer sees delivery code')
e2e/flow.mjs:66:const cust = await ctx.newPage(); await cust.setViewportSize({ width: 430, height: 900 })
e2e/flow.mjs:67:await cust.goto(`${BASE}#/customer/orders`)
e2e/flow.mjs:68:await cust.getByText('Give the rider your delivery code').waitFor()
e2e/flow.mjs:69:const code = (await cust.locator('.sms.otp b').innerText()).trim(); assert.match(code, /^\d{4}$/); await cust.close()
e2e/flow.mjs:70:
e2e/flow.mjs:71:step('wrong code blocks, right code confirms')
e2e/flow.mjs:72:await page.getByPlaceholder(/code/i).fill('0000')
e2e/flow.mjs:73:assert.equal(await page.getByRole('button', { name: 'Confirm delivered' }).isDisabled(), true)
e2e/flow.mjs:74:await page.getByPlaceholder(/code/i).fill(code)
e2e/flow.mjs:75:await page.getByRole('button', { name: 'Confirm delivered' }).click()
e2e/flow.mjs:76:await page.waitForURL(/#\/rider\?r=/, { timeout: 8000 }); await shot('rider-done')
e2e/flow.mjs:77:
e2e/flow.mjs:78:step('customer sees Delivered + SMS')
e2e/flow.mjs:79:await go('/customer/orders')
e2e/flow.mjs:80:await page.locator('.card', { hasText: id }).locator('.pill.Delivered').waitFor(); await shot('customer-delivered')
e2e/flow.mjs:81:
e2e/flow.mjs:82:step('owner: stock dropped by exactly 1, movement logged')
e2e/flow.mjs:83:await go('/owner/inventory', 1280)
e2e/flow.mjs:84:assert.equal(await stock11(), before - 1)
e2e/flow.mjs:85:await page.getByRole('cell', { name: `Order ${id}` }).waitFor(); await shot('owner-inventory')
e2e/flow.mjs:86:
e2e/flow.mjs:87:step('owner: analytics, follow-ups, blast, remittance render with data')
e2e/flow.mjs:88:await go('/owner', 1280); await page.getByText('Avg delivery time').waitFor(); await shot('owner-analytics')
e2e/flow.mjs:89:await go('/owner/follow-ups', 1280); assert.ok((await page.locator('tbody tr').count()) > 0); await shot('owner-followups')
e2e/flow.mjs:90:await page.locator('select[aria-label^="Outcome"]').first().selectOption('Reached')
e2e/flow.mjs:91:await page.getByText('1 saved').or(page.getByText('Reached').first()).first().waitFor()
e2e/flow.mjs:92:await go('/owner/blast', 1280); await page.getByRole('button', { name: 'Send now' }).click(); await page.getByText(/Sent \(simulated\)/).waitFor(); await shot('owner-blast')
e2e/flow.mjs:93:await go('/owner/remittance', 1280)
e2e/flow.mjs:94:const rem = page.locator('tr', { hasText: riderName }); assert.ok((await rem.count()) === 1); await shot('owner-remittance')
e2e/flow.mjs:95:
e2e/flow.mjs:96:step('dispatcher encodes a phone order for a NEW customer')
e2e/flow.mjs:97:await go('/dispatcher/new', 1280)
e2e/flow.mjs:98:await page.getByRole('button', { name: 'New customer' }).click()
e2e/flow.mjs:99:const f = page.locator('.card').first()
e2e/flow.mjs:100:await f.getByLabel('Name').fill('Test Customer'); await f.getByLabel('Mobile number').fill('0917 000 0000'); await f.getByLabel('Street / purok').fill('Purok 9')
e2e/flow.mjs:101:await page.locator('.map').click({ position: { x: 300, y: 120 } })
e2e/flow.mjs:102:await page.getByRole('button', { name: 'Create order' }).click()
e2e/flow.mjs:103:await page.waitForURL(/#\/dispatcher$/); await page.getByText('Test Customer').first().waitFor(); await shot('dispatcher-new-order')
e2e/flow.mjs:104:
e2e/flow.mjs:105:step('console clean')
e2e/flow.mjs:106:assert.deepEqual(errors, [], 'console errors: ' + errors.join('\n'))
e2e/flow.mjs:107:await browser.close()
e2e/flow.mjs:108:console.log('E2E PASS, order', id)
src/components/charts.tsx:1:import { useState } from 'react'
src/components/charts.tsx:2:import type { ReactNode } from 'react'
src/components/charts.tsx:3:import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
src/components/charts.tsx:4:import type { LucideIcon } from 'lucide-react'
src/components/charts.tsx:5:
src/components/charts.tsx:6:// Palette (validated with the dataviz validator): brand blue = the series, orange = emphasis, slate = context.
src/components/charts.tsx:7:export const C = { blue: '#0f57a6', orange: '#f04a2d', slate: '#8696b0', grid: '#e1e6ef', ok: '#1f9d55', warn: '#e8a317', bad: '#d63a2f' }
src/components/charts.tsx:8:
src/components/charts.tsx:9:export function Spark({ data, color = C.blue }: { data: number[]; color?: string }) {
src/components/charts.tsx:10:  const max = Math.max(1, ...data), w = 120, h = 30
src/components/charts.tsx:11:  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * w},${h - 3 - (v / max) * (h - 6)}`).join(' ')
src/components/charts.tsx:12:  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden><polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" /></svg>
src/components/charts.tsx:13:}
src/components/charts.tsx:14:
src/components/charts.tsx:15:/** good = which direction is an improvement (so a faster delivery time shows green when it falls). */
src/components/charts.tsx:16:export function Tile({ icon: Icon, tone = '', label, value, sub, delta, good = 'up', spark }: {
src/components/charts.tsx:17:  icon: LucideIcon; tone?: '' | 'o' | 'g' | 'r'; label: string; value: string; sub?: string; delta?: number; good?: 'up' | 'down'; spark?: number[]
src/components/charts.tsx:18:}) {
src/components/charts.tsx:19:  const better = delta === undefined ? undefined : (delta >= 0) === (good === 'up')
src/components/charts.tsx:20:  return (
src/components/charts.tsx:21:    <div className="card tile lift">
src/components/charts.tsx:22:      <div className="top"><span className={`ic ${tone}`}><Icon size={16} /></span>{label}</div>
src/components/charts.tsx:23:      <div className="val">{value}</div>
src/components/charts.tsx:24:      <div className="row" style={{ gap: 6 }}>
src/components/charts.tsx:25:        {delta !== undefined && Math.abs(delta) >= 0.5 && <span className={`delta ${better ? 'up' : 'down'}`}>{delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(Math.round(delta))}%</span>}
src/components/charts.tsx:26:        <span className="mute">{sub}</span>
src/components/charts.tsx:27:      </div>
src/components/charts.tsx:28:      {spark && <Spark data={spark} color={tone === 'o' ? C.orange : C.blue} />}
src/components/charts.tsx:29:    </div>
src/components/charts.tsx:30:  )
src/components/charts.tsx:31:}
src/components/charts.tsx:32:
src/components/charts.tsx:33:export function Panel({ icon: Icon, title, sub, children }: { icon: LucideIcon; title: string; sub?: string; children: ReactNode }) {
src/components/charts.tsx:34:  return <div className="card lift"><div className="section-h"><Icon size={18} /><h2>{title}</h2></div>{sub && <div className="mute" style={{ marginTop: -6, marginBottom: 10 }}>{sub}</div>}{children}</div>
src/components/charts.tsx:35:}
src/components/charts.tsx:36:
src/components/charts.tsx:37:/** Single-series area/line chart with crosshair tooltip. */
src/components/charts.tsx:38:export function AreaChart({ values, labels, unit = '' }: { values: number[]; labels: string[]; unit?: string }) {
src/components/charts.tsx:39:  const [hi, setHi] = useState<number>()
src/components/charts.tsx:40:  const W = 640, H = 200, L = 30, B = 22, T = 10
src/components/charts.tsx:41:  const max = Math.max(4, Math.ceil(Math.max(...values) / 2) * 2)
src/components/charts.tsx:42:  const x = (i: number) => L + (i / (values.length - 1)) * (W - L - 8)
src/components/charts.tsx:43:  const y = (v: number) => T + (1 - v / max) * (H - T - B)
src/components/charts.tsx:44:  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('')
src/components/charts.tsx:45:  const ticks = [0, max / 2, max]
src/components/charts.tsx:46:  return (
src/components/charts.tsx:47:    <div className="chart">
src/components/charts.tsx:48:      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Orders per day, last ${values.length} days`}
src/components/charts.tsx:49:        onMouseLeave={() => setHi(undefined)} onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHi(Math.max(0, Math.min(values.length - 1, Math.round(((e.clientX - r.left) / r.width * W - L) / (W - L - 8) * (values.length - 1))))) }}>
src/components/charts.tsx:50:        {ticks.map((t) => <g key={t}><line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke={C.grid} /><text x={L - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill={C.slate}>{t}</text></g>)}
src/components/charts.tsx:51:        <path d={`${line}L${x(values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={C.blue} opacity={0.12} />
src/components/charts.tsx:52:        <path d={line} fill="none" stroke={C.blue} strokeWidth={2} strokeLinejoin="round" />
src/components/charts.tsx:53:        {[0, Math.floor(values.length / 2), values.length - 1].map((i) => <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === values.length - 1 ? 'end' : 'middle'} fontSize="10" fill={C.slate}>{labels[i]}</text>)}
src/components/charts.tsx:54:        {hi !== undefined && <g><line x1={x(hi)} x2={x(hi)} y1={T} y2={H - B} stroke={C.slate} strokeDasharray="3 3" /><circle cx={x(hi)} cy={y(values[hi])} r={5} fill={C.blue} stroke="#fff" strokeWidth={2} /></g>}
src/components/charts.tsx:55:      </svg>
src/components/charts.tsx:56:      {hi !== undefined && <div className="tip" style={{ left: `${(x(hi) / W) * 100}%`, top: `${(y(values[hi]) / H) * 100}%` }}>{labels[hi]} · <b>{values[hi]}{unit}</b></div>}
src/components/charts.tsx:57:    </div>
src/components/charts.tsx:58:  )
src/components/charts.tsx:59:}
src/components/charts.tsx:60:
src/components/charts.tsx:61:/** Weekly stacked columns: app (accent) vs staff-encoded (context gray), 2px gaps, rounded data end. */
src/components/charts.tsx:62:export function StackedCols({ weeks }: { weeks: { label: string; app: number; staff: number }[] }) {
src/components/charts.tsx:63:  const [hi, setHi] = useState<number>()
src/components/charts.tsx:64:  const max = Math.max(1, ...weeks.map((w) => w.app + w.staff))
src/components/charts.tsx:65:  const H = 150
src/components/charts.tsx:66:  return (
src/components/charts.tsx:67:    <div className="chart">
src/components/charts.tsx:68:      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: H, borderBottom: `1px solid ${C.grid}` }}>
src/components/charts.tsx:69:        {weeks.map((w, i) => (
src/components/charts.tsx:70:          <div key={w.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: 2 }} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(undefined)}>
src/components/charts.tsx:71:            <div title={`${w.label}: ${w.staff} encoded by staff`} style={{ height: `${(w.staff / max) * 100}%`, background: C.slate, borderRadius: '4px 4px 0 0', opacity: hi === undefined || hi === i ? 1 : 0.5 }} />
src/components/charts.tsx:72:            <div title={`${w.label}: ${w.app} placed in the app`} style={{ height: `${(w.app / max) * 100}%`, background: C.blue, borderRadius: '2px', opacity: hi === undefined || hi === i ? 1 : 0.5 }} />
src/components/charts.tsx:73:          </div>
src/components/charts.tsx:74:        ))}
src/components/charts.tsx:75:      </div>
src/components/charts.tsx:76:      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>{weeks.map((w) => <span key={w.label} className="mute" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>{w.label}</span>)}</div>
src/components/charts.tsx:77:      <div className="legend"><span><i style={{ background: C.blue }} />Placed in the app</span><span><i style={{ background: C.slate }} />Encoded by staff (call / text / walk-in)</span></div>
src/components/charts.tsx:78:      {hi !== undefined && <div className="mute" style={{ marginTop: 4 }}>{weeks[hi].label}: <b>{weeks[hi].app}</b> app · <b>{weeks[hi].staff}</b> staff-encoded</div>}
src/components/charts.tsx:79:    </div>
src/components/charts.tsx:80:  )
src/components/charts.tsx:81:}
src/components/charts.tsx:82:
src/components/charts.tsx:83:export function HBars({ rows, fmt = (n: number) => String(Math.round(n)), color = C.blue }: { rows: [string, number][]; fmt?: (n: number) => string; color?: string }) {
src/components/charts.tsx:84:  const sorted = [...rows].sort((a, b) => b[1] - a[1]), max = Math.max(1, ...sorted.map((r) => r[1]))
src/components/charts.tsx:85:  return (
src/components/charts.tsx:86:    <div className="stack" style={{ gap: 8 }}>
src/components/charts.tsx:87:      {sorted.map(([k, v], i) => (
src/components/charts.tsx:88:        <div key={k} title={`${k}: ${fmt(v)}`} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 10, alignItems: 'center', fontSize: 13 }}>
src/components/charts.tsx:89:          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k}</span>
src/components/charts.tsx:90:          <div style={{ height: 10, background: '#eef1f6', borderRadius: 5 }}><div style={{ width: `${(v / max) * 100}%`, height: '100%', background: color, borderRadius: '2px 5px 5px 2px', opacity: 1 - i * 0.07 }} /></div>
src/components/charts.tsx:91:          <b>{fmt(v)}</b>
src/components/charts.tsx:92:        </div>
src/components/charts.tsx:93:      ))}
src/components/charts.tsx:94:    </div>
src/components/charts.tsx:95:  )
src/components/charts.tsx:96:}
src/pages/customer/Customer.tsx:1:import { useState } from 'react'
src/pages/customer/Customer.tsx:2:import { Link, useNavigate } from 'react-router-dom'
src/pages/customer/Customer.tsx:3:import { Bike, MapPin, Repeat, ShieldCheck } from 'lucide-react'
src/pages/customer/Customer.tsx:4:import { Cylinder, CylinderRow } from '../../components/art'
src/pages/customer/Customer.tsx:5:import { Field, StatusPill } from '../../components/ui'
src/pages/customer/Customer.tsx:6:import { DEPOSIT, REFILL_PRICE, town } from '../../lib/geo'
src/pages/customer/Customer.tsx:7:import { ago, byId, mins, ordersOf, peso, refillOf } from '../../lib/derive'
src/pages/customer/Customer.tsx:8:import { actions, OTP, useDB } from '../../lib/store'
src/pages/customer/Customer.tsx:9:import { SIZES, type Order, type Payment, type Size } from '../../lib/types'
src/pages/customer/Customer.tsx:10:
src/pages/customer/Customer.tsx:11:const KEY = 'fiesta-gas-demo-customer'
src/pages/customer/Customer.tsx:12:const read = () => { try { return localStorage.getItem(KEY) || 'c1' } catch { return 'c1' } }
src/pages/customer/Customer.tsx:13:/** Demo persona: which customer is using the PWA (default Maria, c1). */
src/pages/customer/Customer.tsx:14:function useMe() {
src/pages/customer/Customer.tsx:15:  const d = useDB()
src/pages/customer/Customer.tsx:16:  const id = d.customers.some((c) => c.id === read()) ? read() : 'c1'
src/pages/customer/Customer.tsx:17:  const pick = (v: string) => { try { localStorage.setItem(KEY, v) } catch { /* ignore */ } actions.touch() }
src/pages/customer/Customer.tsx:18:  return { id, pick, all: d.customers }
src/pages/customer/Customer.tsx:19:}
src/pages/customer/Customer.tsx:20:
src/pages/customer/Customer.tsx:21:export function OrderPage() {
src/pages/customer/Customer.tsx:22:  const d = useDB(); const nav = useNavigate(); const { id: ME, pick, all } = useMe()
src/pages/customer/Customer.tsx:23:  const me = byId(d.customers, ME)!
src/pages/customer/Customer.tsx:24:  const r = refillOf(d, me)
src/pages/customer/Customer.tsx:25:  const last = ordersOf(d, ME).find((o) => o.status === 'Delivered')
src/pages/customer/Customer.tsx:26:  const [size, setSize] = useState<Size>(me.size)
src/pages/customer/Customer.tsx:27:  const [qty, setQty] = useState(1)
src/pages/customer/Customer.tsx:28:  const [type, setType] = useState<'refill' | 'new'>('refill')
src/pages/customer/Customer.tsx:29:  const [payment, setPayment] = useState<Payment>('cod')
src/pages/customer/Customer.tsx:30:  const fee = town(me.town).fee
src/pages/customer/Customer.tsx:31:  const total = (REFILL_PRICE[size] + (type === 'new' ? DEPOSIT[size] : 0)) * qty + fee
src/pages/customer/Customer.tsx:32:  return (
src/pages/customer/Customer.tsx:33:    <div className="stack">
src/pages/customer/Customer.tsx:34:      <div className="banner">
src/pages/customer/Customer.tsx:35:        <div style={{ paddingBottom: 14 }}><h1>Kumusta, {me.name.split(' ')[0]}!</h1><div className="mute row" style={{ gap: 5, flexWrap: 'nowrap', alignItems: 'flex-start' }}><MapPin size={14} style={{ flex: 'none', marginTop: 2 }} />{me.street}, {me.barangay}, {me.town}</div>
src/pages/customer/Customer.tsx:36:        <div className="mute row" style={{ gap: 5, marginTop: 6, flexWrap: 'nowrap', alignItems: 'flex-start' }}><ShieldCheck size={14} style={{ flex: 'none', marginTop: 2 }} />Rider-verified delivery</div></div>
src/pages/customer/Customer.tsx:37:        <CylinderRow height={96} /></div>
src/pages/customer/Customer.tsx:38:      <div className="stack" style={{ gap: 4 }}>
src/pages/customer/Customer.tsx:39:        <label className="mute">Demo as: <select aria-label="Demo customer" value={ME} onChange={(e) => pick(e.target.value)}>{all.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
src/pages/customer/Customer.tsx:40:      {last && <div className="card reorder">
src/pages/customer/Customer.tsx:41:        <Repeat size={22} color="var(--orange)" /><div className="grow"><b>Reorder your usual</b><div className="mute">{last.qty}× {last.size} {last.type === 'new' ? 'new tank' : 'refill'} · {last.payment.toUpperCase()}</div></div>
src/pages/customer/Customer.tsx:42:        <button className="btn hot" onClick={() => { actions.placeOrder({ customerId: ME, size: last.size, qty: last.qty, type: last.type, payment: last.payment, channel: 'app' }); nav('/customer/orders') }}>Reorder</button></div>}
src/pages/customer/Customer.tsx:43:      {r && r.status !== 'ok' && <div className="card" style={{ borderColor: 'var(--orange)' }}>
src/pages/customer/Customer.tsx:44:        <b>{r.status === 'overdue' ? 'Baka paubos na ang gas ninyo.' : 'Malapit nang maubos ang gas.'}</b>
src/pages/customer/Customer.tsx:45:        <div className="mute">Usually you refill every ~{Math.round(r.cycleDays)} days. Order now and we'll deliver today.</div>
src/pages/customer/Customer.tsx:46:      </div>}
src/pages/customer/Customer.tsx:47:      <div className="card stack">
src/pages/customer/Customer.tsx:48:        <h2>Order a refill</h2>
src/pages/customer/Customer.tsx:49:        <Field label="Cylinder size"><div className="sizes">{SIZES.map((s) => <button key={s} className={`size ${size === s ? 'on' : ''}`} onClick={() => setSize(s)} aria-label={s}>
src/pages/customer/Customer.tsx:50:          <Cylinder size={s} height={s === '11kg' ? 70 : s === '22kg' ? 84 : 100} shadow={false} />{s}<small>{peso(REFILL_PRICE[s])}</small></button>)}</div></Field>
src/pages/customer/Customer.tsx:51:        <Field label="Order type"><div className="chips">
src/pages/customer/Customer.tsx:52:          <button className={`chip ${type === 'refill' ? 'on' : ''}`} onClick={() => setType('refill')}>Refill swap</button>
src/pages/customer/Customer.tsx:53:          <button className={`chip ${type === 'new' ? 'on' : ''}`} onClick={() => setType('new')}>New tank + deposit</button></div></Field>
src/pages/customer/Customer.tsx:54:        <Field label="Quantity"><div className="row">
src/pages/customer/Customer.tsx:55:          <button className="btn alt" aria-label="Less" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b style={{ minWidth: 24, textAlign: 'center' }}>{qty}</b>
src/pages/customer/Customer.tsx:56:          <button className="btn alt" aria-label="More" onClick={() => setQty(Math.min(5, qty + 1))}>+</button></div></Field>
src/pages/customer/Customer.tsx:57:        <Field label="Payment"><div className="chips">{([['cod', 'Cash on delivery'], ['gcash', 'GCash'], ['maya', 'Maya']] as const).map(([k, l]) =>
src/pages/customer/Customer.tsx:58:          <button key={k} className={`chip ${payment === k ? 'on' : ''}`} onClick={() => setPayment(k)}>{l}</button>)}</div></Field>
src/pages/customer/Customer.tsx:59:        <div className="row"><span className="mute">{qty}× {size} {type === 'new' ? 'new tank' : 'refill'}{fee ? ` + ${peso(fee)} delivery` : ' · free delivery'}</span><b className="right big" style={{ fontSize: 22 }}>{peso(total)}</b></div>
src/pages/customer/Customer.tsx:60:        <button className="btn hot block" onClick={() => { actions.placeOrder({ customerId: ME, size, qty, type, payment, channel: 'app' }); nav('/customer/orders') }}>Place order</button>
src/pages/customer/Customer.tsx:61:        {payment !== 'cod' && <div className="mute">E-wallet is paid to the rider on delivery in this version. Online prepayment is an optional add-on.</div>}
src/pages/customer/Customer.tsx:62:      </div>
src/pages/customer/Customer.tsx:63:    </div>
src/pages/customer/Customer.tsx:64:  )
src/pages/customer/Customer.tsx:65:}
src/pages/customer/Customer.tsx:66:
src/pages/customer/Customer.tsx:67:const STEPS = ['Placed', 'Assigned', 'Out for delivery', 'Delivered'] as const
src/pages/customer/Customer.tsx:68:
src/pages/customer/Customer.tsx:69:function OrderCard({ o, d, live }: { o: Order; d: ReturnType<typeof useDB>; live?: boolean }) {
src/pages/customer/Customer.tsx:70:  const rider = byId(d.riders, o.riderId)
src/pages/customer/Customer.tsx:71:  const idx = STEPS.indexOf(o.status as (typeof STEPS)[number])
src/pages/customer/Customer.tsx:72:  return (
src/pages/customer/Customer.tsx:73:    <div className="card stack">
src/pages/customer/Customer.tsx:74:      <div className="row"><b>{o.id}</b><StatusPill s={o.status} /><span className="right mute">{ago(o.placedAt)}</span></div>
src/pages/customer/Customer.tsx:75:      <div>{o.qty}× {o.size} {o.type === 'new' ? 'new tank' : 'refill'} · {peso(o.amount)} · {o.payment.toUpperCase()}</div>
src/pages/customer/Customer.tsx:76:      {live && <>
src/pages/customer/Customer.tsx:77:        <div className="timeline">{STEPS.map((s, i) => <span key={s} className={i <= idx ? 'done' : ''}>{s === 'Out for delivery' ? 'On the way' : s}</span>)}</div>
src/pages/customer/Customer.tsx:78:        {rider && <div className="mute row" style={{ gap: 6 }}><Bike size={15} />{rider.name} · {rider.phone}</div>}
src/pages/customer/Customer.tsx:79:        {o.status === 'Out for delivery' && <div className="sms otp">Give the rider your delivery code: <b>{OTP}</b></div>}
src/pages/customer/Customer.tsx:80:        {o.status === 'Failed' && <div className="mute">Delivery failed: {o.failReason}. We'll re-dispatch shortly.</div>}
src/pages/customer/Customer.tsx:81:      </>}
src/pages/customer/Customer.tsx:82:      {o.status === 'Delivered' && o.deliveredAt && <div className="mute">Delivered in {mins(o.placedAt, o.deliveredAt)} min</div>}
src/pages/customer/Customer.tsx:83:    </div>
src/pages/customer/Customer.tsx:84:  )
src/pages/customer/Customer.tsx:85:}
src/pages/customer/Customer.tsx:86:
src/pages/customer/Customer.tsx:87:export function Orders() {
src/pages/customer/Customer.tsx:88:  const d = useDB(); const { id: ME } = useMe()
src/pages/customer/Customer.tsx:89:  const all = ordersOf(d, ME)
src/pages/customer/Customer.tsx:90:  const live = all.filter((o) => ['Placed', 'Assigned', 'Out for delivery', 'Failed'].includes(o.status))
src/pages/customer/Customer.tsx:91:  const past = all.filter((o) => !live.includes(o))
src/pages/customer/Customer.tsx:92:  return (
src/pages/customer/Customer.tsx:93:    <div className="stack">
src/pages/customer/Customer.tsx:94:      <h1>My orders</h1>
src/pages/customer/Customer.tsx:95:      {live.length ? live.map((o) => <OrderCard key={o.id} o={o} d={d} live />) : <div className="card mute">No active order. <Link to="/customer">Order a refill</Link></div>}
src/pages/customer/Customer.tsx:96:      <h3>History</h3>
src/pages/customer/Customer.tsx:97:      {past.map((o) => <OrderCard key={o.id} o={o} d={d} />)}
src/pages/customer/Customer.tsx:98:    </div>
src/pages/customer/Customer.tsx:99:  )
src/pages/customer/Customer.tsx:100:}
src/pages/customer/Customer.tsx:101:
src/pages/customer/Customer.tsx:102:export function Inbox() {
src/pages/customer/Customer.tsx:103:  const d = useDB(); const { id: ME } = useMe()
src/pages/customer/Customer.tsx:104:  const me = byId(d.customers, ME)!
src/pages/customer/Customer.tsx:105:  const mine = d.sms.filter((s) => s.to === me.phone)
src/pages/customer/Customer.tsx:106:  return (
src/pages/customer/Customer.tsx:107:    <div className="stack">
src/pages/customer/Customer.tsx:108:      <h1>Messages</h1><div className="mute">What this customer's phone receives by SMS.</div>
src/pages/customer/Customer.tsx:109:      {mine.length ? mine.map((s) => <div key={s.id} className={`sms ${s.kind === 'otp' ? 'otp' : ''}`}>{s.text}<div className="mute">{ago(s.at)}</div></div>)
src/pages/customer/Customer.tsx:110:        : <div className="card mute">Nothing yet. Place an order to see the confirmation.</div>}
src/pages/customer/Customer.tsx:111:    </div>
src/pages/customer/Customer.tsx:112:  )
src/pages/customer/Customer.tsx:113:}
src/pages/owner/Dashboard.tsx:1:import { AlertTriangle, BellRing, Boxes, CalendarClock, CheckCircle2, Clock, Megaphone, PackageX, Repeat, Route, Smartphone, Timer, TrendingUp, UserPlus, Wallet, Map as MapIcon, Truck } from 'lucide-react'
src/pages/owner/Dashboard.tsx:2:import { Link } from 'react-router-dom'
src/pages/owner/Dashboard.tsx:3:import { Cylinder } from '../../components/art'
src/pages/owner/Dashboard.tsx:4:import { AreaChart, C, HBars, Panel, StackedCols, Tile } from '../../components/charts'
src/pages/owner/Dashboard.tsx:5:import { avg, byId, delivered, mins, peso, refillRows } from '../../lib/derive'
src/pages/owner/Dashboard.tsx:6:import { DAY } from '../../lib/refill'
src/pages/owner/Dashboard.tsx:7:import { useDB } from '../../lib/store'
src/pages/owner/Dashboard.tsx:8:import { SIZES } from '../../lib/types'
src/pages/owner/Dashboard.tsx:9:
src/pages/owner/Dashboard.tsx:10:const group = (a: [string, number][]) => Object.entries(a.reduce<Record<string, number[]>>((m, [k, v]) => ((m[k] ||= []).push(v), m), {}))
src/pages/owner/Dashboard.tsx:11:const pct = (cur: number, prev: number) => (prev ? ((cur - prev) / prev) * 100 : undefined)
src/pages/owner/Dashboard.tsx:12:
src/pages/owner/Dashboard.tsx:13:export default function Dashboard() {
src/pages/owner/Dashboard.tsx:14:  const d = useDB()
src/pages/owner/Dashboard.tsx:15:  const today = new Date().setHours(0, 0, 0, 0)
src/pages/owner/Dashboard.tsx:16:  const dayIdx = (t: number) => Math.floor((t - today) / DAY) // 0 = today, -1 = yesterday
src/pages/owner/Dashboard.tsx:17:  const real = d.orders.filter((o) => o.status !== 'Cancelled')
src/pages/owner/Dashboard.tsx:18:  const done = delivered(d)
src/pages/owner/Dashboard.tsx:19:  const dTime = (o: (typeof done)[number]) => mins(o.placedAt, o.deliveredAt!)
src/pages/owner/Dashboard.tsx:20:
src/pages/owner/Dashboard.tsx:21:  const perDay = Array.from({ length: 30 }, (_, i) => real.filter((o) => dayIdx(o.placedAt) === i - 29).length)
src/pages/owner/Dashboard.tsx:22:  const labels = Array.from({ length: 30 }, (_, i) => new Date(today + (i - 29) * DAY).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }))
src/pages/owner/Dashboard.tsx:23:  const win = (from: number, to: number) => real.filter((o) => dayIdx(o.placedAt) >= from && dayIdx(o.placedAt) < to)
src/pages/owner/Dashboard.tsx:24:  const cur = win(-29, 1), prev = win(-59, -29)
src/pages/owner/Dashboard.tsx:25:  const revCur = cur.reduce((a, o) => a + o.amount, 0), revPrev = prev.reduce((a, o) => a + o.amount, 0)
src/pages/owner/Dashboard.tsx:26:  const dtCur = avg(done.filter((o) => dayIdx(o.deliveredAt!) >= -29).map(dTime)), dtPrev = avg(done.filter((o) => dayIdx(o.deliveredAt!) < -29 && dayIdx(o.deliveredAt!) >= -59).map(dTime))
src/pages/owner/Dashboard.tsx:27:  const dispatch = d.orders.filter((o) => o.assignedAt).map((o) => mins(o.placedAt, o.assignedAt!))
src/pages/owner/Dashboard.tsx:28:
src/pages/owner/Dashboard.tsx:29:  const rows = refillRows(d)
src/pages/owner/Dashboard.tsx:30:  const mult = rows.filter((x) => x.r && x.r.source !== 'default')
src/pages/owner/Dashboard.tsx:31:  const withOrders = rows.filter((x) => x.r).length
src/pages/owner/Dashboard.tsx:32:  const status = { ok: rows.filter((x) => x.r?.status === 'ok').length, due: rows.filter((x) => x.r?.status === 'due').length, overdue: rows.filter((x) => x.r?.status === 'overdue').length }
src/pages/owner/Dashboard.tsx:33:  const total = Math.max(1, status.ok + status.due + status.overdue)
src/pages/owner/Dashboard.tsx:34:
src/pages/owner/Dashboard.tsx:35:  const weeks = Array.from({ length: 8 }, (_, i) => {
src/pages/owner/Dashboard.tsx:36:    const from = -7 * (7 - i) - 6, to = from + 7
src/pages/owner/Dashboard.tsx:37:    const w = win(from, to)
src/pages/owner/Dashboard.tsx:38:    return { label: new Date(today + from * DAY).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }), app: w.filter((o) => o.channel === 'app').length, staff: w.filter((o) => o.channel !== 'app').length }
src/pages/owner/Dashboard.tsx:39:  })
src/pages/owner/Dashboard.tsx:40:  const share = (w: { app: number; staff: number }) => Math.round((w.app / Math.max(1, w.app + w.staff)) * 100)
src/pages/owner/Dashboard.tsx:41:
src/pages/owner/Dashboard.tsx:42:  const townOf = (id: string) => byId(d.customers, id)!.town
src/pages/owner/Dashboard.tsx:43:  const reasons = group(d.orders.filter((o) => o.failReason).map((o) => [o.failReason!, 1]))
src/pages/owner/Dashboard.tsx:44:  const blastRows = d.blasts.map((b) => ({ b, n: d.orders.filter((o) => b.recipients.includes(o.customerId) && o.placedAt > b.at && o.placedAt < b.at + 7 * DAY).length }))
src/pages/owner/Dashboard.tsx:45:  const units = Object.fromEntries(SIZES.map((s) => [s, done.filter((o) => o.size === s).reduce((a, o) => a + o.qty, 0)]))
src/pages/owner/Dashboard.tsx:46:
src/pages/owner/Dashboard.tsx:47:  return (
src/pages/owner/Dashboard.tsx:48:    <div className="stack" style={{ gap: 14 }}>
src/pages/owner/Dashboard.tsx:49:      <div className="row"><h1 className="grow">Business overview</h1><span className="mute">Last 30 days vs the 30 before</span></div>
src/pages/owner/Dashboard.tsx:50:      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))' }}>
src/pages/owner/Dashboard.tsx:51:        <Tile icon={TrendingUp} label="Orders" value={String(cur.length)} sub="vs prior 30 days" delta={pct(cur.length, prev.length)} spark={perDay} />
src/pages/owner/Dashboard.tsx:52:        <Tile icon={Wallet} tone="g" label="Revenue" value={peso(revCur)} sub="vs prior 30 days" delta={pct(revCur, revPrev)} />
src/pages/owner/Dashboard.tsx:53:        <Tile icon={Timer} tone="o" label="Avg delivery time" value={`${Math.round(dtCur)} min`} sub="placed → delivered" delta={pct(dtCur, dtPrev)} good="down" />
src/pages/owner/Dashboard.tsx:54:        <Tile icon={Clock} label="Time to dispatch" value={`${Math.round(avg(dispatch))} min`} sub="placed → rider assigned" />
src/pages/owner/Dashboard.tsx:55:        <Tile icon={Repeat} tone="g" label="Repeat rate" value={`${Math.round((mult.length / Math.max(1, withOrders)) * 100)}%`} sub="customers with 2+ orders" />
src/pages/owner/Dashboard.tsx:56:        <Tile icon={CalendarClock} label="Avg refill cycle" value={`${Math.round(avg(mult.map((x) => x.r!.cycleDays)))} days`} sub={`${mult.length} customers`} />
src/pages/owner/Dashboard.tsx:57:        <Tile icon={UserPlus} label="First → second order" value={`${Math.round(avg(mult.map((x) => x.r!.firstToSecond!)))} days`} sub="new-customer retention" />
src/pages/owner/Dashboard.tsx:58:        <Link to="/owner/follow-ups" style={{ textDecoration: 'none', color: 'inherit' }}><Tile icon={BellRing} tone="r" label="Customers to call" value={String(status.due + status.overdue)} sub={`${status.overdue} overdue · ${status.due} due soon`} /></Link>
src/pages/owner/Dashboard.tsx:59:      </div>
src/pages/owner/Dashboard.tsx:60:
src/pages/owner/Dashboard.tsx:61:      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))' }}>
src/pages/owner/Dashboard.tsx:62:        <Panel icon={TrendingUp} title="Orders per day" sub="All channels, last 30 days. Hover for the day."><AreaChart values={perDay} labels={labels} /></Panel>
src/pages/owner/Dashboard.tsx:63:        <Panel icon={Smartphone} title="Who places the orders?" sub={`App share grew from ${share(weeks[0])}% to ${share(weeks[7])}% in 8 weeks. Less manual work for the dispatcher.`}><StackedCols weeks={weeks} /></Panel>
src/pages/owner/Dashboard.tsx:64:      </div>
src/pages/owner/Dashboard.tsx:65:
src/pages/owner/Dashboard.tsx:66:      <Panel icon={CheckCircle2} title="Customer refill health" sub="Based on each customer's own refill cycle. Overdue means past the expected date by the 3-day grace period.">
src/pages/owner/Dashboard.tsx:67:        <div className="seg" role="img" aria-label={`${status.ok} on cycle, ${status.due} due soon, ${status.overdue} overdue`}>
src/pages/owner/Dashboard.tsx:68:          <div style={{ flex: status.ok / total, background: C.ok }} /><div style={{ flex: status.due / total, background: C.warn }} /><div style={{ flex: status.overdue / total, background: C.bad }} />
src/pages/owner/Dashboard.tsx:69:        </div>
src/pages/owner/Dashboard.tsx:70:        <div className="legend"><span><i style={{ background: C.ok }} /><CheckCircle2 size={13} style={{ verticalAlign: -2 }} /> {status.ok} on cycle</span><span><i style={{ background: C.warn }} /><Clock size={13} style={{ verticalAlign: -2 }} /> {status.due} due soon</span><span><i style={{ background: C.bad }} /><AlertTriangle size={13} style={{ verticalAlign: -2 }} /> {status.overdue} overdue</span>
src/pages/owner/Dashboard.tsx:71:          <Link to="/owner/follow-ups" style={{ marginLeft: 'auto', fontWeight: 600 }}>Open the follow-up list →</Link></div>
src/pages/owner/Dashboard.tsx:72:      </Panel>
src/pages/owner/Dashboard.tsx:73:
src/pages/owner/Dashboard.tsx:74:      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
src/pages/owner/Dashboard.tsx:75:        <Panel icon={Truck} title="Delivery minutes · by rider" sub="Lower is faster."><HBars rows={group(done.map((o) => [byId(d.riders, o.riderId)?.name ?? '?', dTime(o)])).map(([k, v]) => [k, avg(v)])} /></Panel>
src/pages/owner/Dashboard.tsx:76:        <Panel icon={MapIcon} title="Delivery minutes · by town" sub="Where deliveries are slow."><HBars color={C.orange} rows={group(done.map((o) => [townOf(o.customerId), dTime(o)])).map(([k, v]) => [k, avg(v)])} /></Panel>
src/pages/owner/Dashboard.tsx:77:        <Panel icon={Wallet} title="Revenue · by town"><HBars fmt={peso} rows={group(done.map((o) => [townOf(o.customerId), o.amount])).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0)])} /></Panel>
src/pages/owner/Dashboard.tsx:78:        <Panel icon={Boxes} title="Units sold · by size">
src/pages/owner/Dashboard.tsx:79:          <div className="row" style={{ alignItems: 'flex-end', justifyContent: 'space-around' }}>{SIZES.map((s) => <div key={s} style={{ textAlign: 'center' }}><Cylinder size={s} height={s === '11kg' ? 70 : s === '22kg' ? 84 : 100} /><div className="big" style={{ fontSize: 22 }}>{units[s]}</div><div className="mute">{s}</div></div>)}</div>
src/pages/owner/Dashboard.tsx:80:        </Panel>
src/pages/owner/Dashboard.tsx:81:        <Panel icon={PackageX} title="Failed deliveries" sub="Reasons point to address quality and rider issues."><HBars color={C.bad} rows={reasons.map(([k, v]) => [k, v.length])} /></Panel>
src/pages/owner/Dashboard.tsx:82:        <Panel icon={Megaphone} title="Promo blasts" sub="Orders placed within 7 days of each blast.">
src/pages/owner/Dashboard.tsx:83:          {blastRows.map(({ b, n }) => <div key={b.id} className="row" style={{ marginBottom: 6 }}><Route size={15} color={C.blue} /><span className="grow">{b.segment}</span><b>{n} orders</b><span className="mute">from {b.recipients.length}</span></div>)}
src/pages/owner/Dashboard.tsx:84:        </Panel>
src/pages/owner/Dashboard.tsx:85:      </div>
src/pages/owner/Dashboard.tsx:86:    </div>
src/pages/owner/Dashboard.tsx:87:  )
src/pages/owner/Dashboard.tsx:88:}
src/lib/seed.ts:1:import { DEPOSIT, REFILL_PRICE, TOWNS, town } from './geo'
src/lib/seed.ts:2:import { DAY } from './refill'
src/lib/seed.ts:3:import type { Customer, DB, Order, Size } from './types'
src/lib/seed.ts:4:
src/lib/seed.ts:5:const FIRST = ['Mylene', 'Rogelio', 'Janice', 'Alvin', 'Cecilia', 'Domingo', 'Fe', 'Gener', 'Hazel', 'Isidro', 'Jocelyn', 'Kristoffer', 'Leonora', 'Marlon', 'Norma', 'Oscar',
src/lib/seed.ts:6:  'Perla', 'Quirino', 'Remedios', 'Saturnino', 'Teresita', 'Ulysses', 'Violeta', 'Wilfredo', 'Yolanda', 'Zaldy', 'Aileen', 'Bong', 'Corazon', 'Danilo', 'Edna', 'Fernando']
src/lib/seed.ts:7:const LAST = ['Gonzales', 'Javier', 'Castillo', 'Navarro', 'Ramos', 'Salazar', 'Tamayo', 'Uy', 'Velasco', 'Yap', 'Zamora', 'Aguilar', 'Bernardo', 'Carino', 'Dizon', 'Espino']
src/lib/seed.ts:8:const NAMES = ['Maria Santos', 'Jose dela Cruz', 'Ana Villanueva', 'Ramon Bautista', 'Liza Manuel', 'Pedro Ocampo', 'Grace Tolentino',
src/lib/seed.ts:9:  'Carlo Mendoza', 'Rosalie Pascual', 'Dennis Cabrera', 'Joy Fernandez', 'Mario Soriano', 'Elena Padilla', 'Ricky Aquino', 'Nena Abalos',
src/lib/seed.ts:10:  'Tonyo Sison', 'Marites Lopez', 'Benjie Cruz', 'Aling Cora Estrada', 'Noel Quiambao', 'Jessa Rivera', 'Arnel De Guzman', 'Lorna Macaraeg',
src/lib/seed.ts:11:  'Boy Caasi', 'Sheila Evangelista', 'Rodel Ventura', 'Cherry Soliven', 'Tita Baby Nava',
src/lib/seed.ts:12:  ...Array.from({ length: 92 }, (_, i) => `${FIRST[i % FIRST.length]} ${LAST[(i * 5 + Math.floor(i / FIRST.length) * 3) % LAST.length]}`)]
src/lib/seed.ts:13:const STREETS = ['Purok 3', 'Purok 5', 'Zone 2', 'Rizal St.', 'Quezon Ave.', 'Mabini St.', 'Purok 1', 'Sitio Centro']
src/lib/seed.ts:14:const LANDMARKS = ['Beside the barangay hall', 'Blue gate, near the chapel', 'Across the sari-sari store', 'Behind the elementary school',
src/lib/seed.ts:15:  'Near the basketball court', 'Green house with mango tree', 'Beside the vulcanizing shop']
src/lib/seed.ts:16:
src/lib/seed.ts:17:// Small deterministic PRNG so the demo data is the same on every reset.
src/lib/seed.ts:18:function rng(seed: number) {
src/lib/seed.ts:19:  return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
src/lib/seed.ts:20:}
src/lib/seed.ts:21:
src/lib/seed.ts:22:export function seed(now = Date.now()): DB {
src/lib/seed.ts:23:  const r = rng(42)
src/lib/seed.ts:24:  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)]
src/lib/seed.ts:25:  const riders = [
src/lib/seed.ts:26:    { id: 'r1', name: 'Kuya Berto', phone: '0917 555 0101' },
src/lib/seed.ts:27:    { id: 'r2', name: 'Jun Manaois', phone: '0918 555 0102' },
src/lib/seed.ts:28:    { id: 'r3', name: 'Mac Rosario', phone: '0919 555 0103' },
src/lib/seed.ts:29:  ]
src/lib/seed.ts:30:  const customers: Customer[] = NAMES.map((name, i) => {
src/lib/seed.ts:31:    const t = TOWNS[i < 8 ? 0 : i % TOWNS.length]
src/lib/seed.ts:32:    const b = t.barangays[Math.floor(r() * t.barangays.length)]
src/lib/seed.ts:33:    return {
src/lib/seed.ts:34:      id: `c${i + 1}`, name, phone: `09${17 + (i % 5)} ${String(100 + i * 7).padStart(3, '0')} ${String(1000 + i * 131).slice(-4)}`,
src/lib/seed.ts:35:      town: t.name, barangay: b, street: pick(STREETS), landmark: pick(LANDMARKS),
src/lib/seed.ts:36:      lat: t.lat + (r() - 0.5) * 0.04, lng: t.lng + (r() - 0.5) * 0.04,
src/lib/seed.ts:37:      size: ((x) => (x < 0.7 ? '11kg' : x < 0.93 ? '22kg' : '50kg'))(r()), promoConsent: r() < 0.85, heldCylinders: 1 + (r() < 0.2 ? 1 : 0),
src/lib/seed.ts:38:    }
src/lib/seed.ts:39:  })
src/lib/seed.ts:40:
src/lib/seed.ts:41:  const orders: Order[] = []
src/lib/seed.ts:42:  let n = 1
src/lib/seed.ts:43:  const mk = (c: Customer, placedAt: number, over: Partial<Order> = {}): Order => {
src/lib/seed.ts:44:    const qty = 1
src/lib/seed.ts:45:    const o: Order = {
src/lib/seed.ts:46:      id: `FG-${String(1000 + n++)}`, customerId: c.id, size: c.size, qty, type: 'refill',
src/lib/seed.ts:47:      // App share grows over time (adoption story): ~12% two months ago -> ~65% now.
src/lib/seed.ts:48:      channel: r() < 0.1 + 0.55 * Math.max(0, 1 - (now - placedAt) / (60 * DAY)) ? 'app' : pick(['call', 'call', 'text', 'walk-in'] as const), status: 'Delivered',
src/lib/seed.ts:49:      payment: pick(['cod', 'cod', 'gcash', 'maya'] as const),
src/lib/seed.ts:50:      amount: REFILL_PRICE[c.size] * qty + town(c.town).fee, placedAt, ...over,
src/lib/seed.ts:51:    }
src/lib/seed.ts:52:    return o
src/lib/seed.ts:53:  }
src/lib/seed.ts:54:  customers.forEach((c, i) => {
src/lib/seed.ts:55:    const cycle = (c.size === '11kg' ? 26 : c.size === '22kg' ? 16 : 10) + Math.floor(r() * 14)
src/lib/seed.ts:56:    // every 4th customer is new this month (growth story); every 7th has only ever ordered once
src/lib/seed.ts:57:    const count = i % 7 === 0 || i % 4 === 1 ? 1 : 2 + Math.floor(r() * 5)
src/lib/seed.ts:58:    // Last order lands between ~2 and ~cycle+9 days ago, so some customers are due/overdue.
src/lib/seed.ts:59:    let last = now - Math.floor(r() * (cycle + 7)) * DAY
src/lib/seed.ts:60:    const times: number[] = []
src/lib/seed.ts:61:    for (let k = 0; k < count; k++) { times.unshift(last); last -= (cycle + Math.floor(r() * 7) - 3) * DAY }
src/lib/seed.ts:62:    times.forEach((t, k) => {
src/lib/seed.ts:63:      const placedAt = t - 8 * 3600_000 + Math.floor(r() * 4) * 3600_000
src/lib/seed.ts:64:      const mins = 28 + Math.floor(r() * 70)
src/lib/seed.ts:65:      const rider = pick(riders).id
src/lib/seed.ts:66:      const o = mk(c, placedAt, {
src/lib/seed.ts:67:        riderId: rider, assignedAt: placedAt + (3 + Math.floor(r() * 14)) * 60_000, deliveredAt: placedAt + mins * 60_000,
src/lib/seed.ts:68:        empties: 1, cashCollected: 0,
src/lib/seed.ts:69:        pod: { kind: r() < 0.5 ? 'otp' : 'photo', at: placedAt + mins * 60_000, lat: c.lat, lng: c.lng },
src/lib/seed.ts:70:        type: k === 0 && count > 1 && r() < 0.3 ? 'new' : 'refill',
src/lib/seed.ts:71:      })
src/lib/seed.ts:72:      if (o.type === 'new') o.amount += DEPOSIT[c.size]
src/lib/seed.ts:73:      if (o.payment === 'cod') o.cashCollected = o.amount
src/lib/seed.ts:74:      orders.push(o)
src/lib/seed.ts:75:    })
src/lib/seed.ts:76:  })
src/lib/seed.ts:77:  // A handful of failed deliveries for the analytics reasons chart.
src/lib/seed.ts:78:  ;(['No one home', 'Wrong address', 'No one home', 'Customer cancelled at door', 'Wrong address'] as const).forEach((reason, i) => {
src/lib/seed.ts:79:    const c = customers[(i * 5 + 3) % customers.length]
src/lib/seed.ts:80:    orders.push(mk(c, (i ? now - (3 + i * 9) * DAY : now - 3 * 3600_000), { status: 'Failed', failReason: reason, riderId: pick(riders).id, assignedAt: (i ? now - (3 + i * 9) * DAY : now - 3 * 3600_000) + 600_000 }))
src/lib/seed.ts:81:  })
src/lib/seed.ts:82:  // Live board for the demo (today).
src/lib/seed.ts:83:  const live: [number, Partial<Order>][] = [
src/lib/seed.ts:84:    [8, { status: 'Placed', channel: 'text' }],
src/lib/seed.ts:85:    [20, { status: 'Placed', channel: 'call' }],
src/lib/seed.ts:86:    [34, { status: 'Assigned', riderId: 'r1', assignedAt: now - 28 * 60_000 }],
src/lib/seed.ts:87:    [52, { status: 'Out for delivery', riderId: 'r1', assignedAt: now - 45 * 60_000 }],
src/lib/seed.ts:88:    [61, { status: 'Out for delivery', riderId: 'r2', assignedAt: now - 50 * 60_000 }],
src/lib/seed.ts:89:  ]
src/lib/seed.ts:90:  live.forEach(([mAgo, over], i) => {
src/lib/seed.ts:91:    const c = customers[8 + i * 3]
src/lib/seed.ts:92:    orders.push(mk(c, now - mAgo * 60_000, { empties: undefined, cashCollected: undefined, deliveredAt: undefined, pod: undefined, payment: i === 3 ? 'gcash' : 'cod', ...over }))
src/lib/seed.ts:93:  })
src/lib/seed.ts:94:
src/lib/seed.ts:95:  const recipients = customers.filter((c) => c.promoConsent).slice(0, 9).map((c) => c.id)
src/lib/seed.ts:96:  return {
src/lib/seed.ts:97:    customers, riders, orders: orders.sort((a, b) => a.placedAt - b.placedAt),
src/lib/seed.ts:98:    sms: [], followUps: [],
src/lib/seed.ts:99:    blasts: [{ id: 'b1', message: 'Fiesta Gas promo: free delivery this weekend on any refill! Reply STOP to opt out.', segment: 'Weekend promo · consented customers', recipients, at: now - 10 * DAY }],
src/lib/seed.ts:100:    movements: [{ id: 'm1', at: now - 2 * DAY, kind: 'stock-in', size: '11kg', full: 40, empty: 0, note: 'Refilled cylinders from supplier (DR-20418)' }],
src/lib/seed.ts:101:    remits: [],
src/lib/seed.ts:102:    stock: { full: { '11kg': 42, '22kg': 14, '50kg': 6 }, empty: { '11kg': 30, '22kg': 9, '50kg': 4 } } as DB['stock'],
src/lib/seed.ts:103:    seededAt: now,
src/lib/seed.ts:104:  }
src/lib/seed.ts:105:}
src/lib/seed.ts:106:export type { Size }
src/components/art.tsx:1:import type { Size } from '../lib/types'
src/components/art.tsx:2:
src/components/art.tsx:3:// Original illustrations (not the Petron/Fiesta Gas logo). Colors follow the placeholder brand tokens.
src/components/art.tsx:4:const SPEC: Record<Size, { w: number; h: number }> = { '11kg': { w: 54, h: 84 }, '22kg': { w: 60, h: 102 }, '50kg': { w: 66, h: 128 } }
src/components/art.tsx:5:const GRAD = (id: string) => (
src/components/art.tsx:6:  <linearGradient id={id} x1="0" x2="1">
src/components/art.tsx:7:    <stop offset="0" stopColor="#0a3d80" /><stop offset=".35" stopColor="#1670d0" /><stop offset="1" stopColor="#0b2a57" />
src/components/art.tsx:8:  </linearGradient>
src/components/art.tsx:9:)
src/components/art.tsx:10:
src/components/art.tsx:11:/** Cylinder drawn with its bottom-center at (0,0), growing upward. Reused inside bigger scenes. */
src/components/art.tsx:12:function Glyph({ size, grad }: { size: Size; grad: string }) {
src/components/art.tsx:13:  const { w, h } = SPEC[size]
src/components/art.tsx:14:  return (
src/components/art.tsx:15:    <g>
src/components/art.tsx:16:      <rect x={-w / 2 + 4} y={-6} width={w - 8} height={6} rx={2} fill="#08203f" />
src/components/art.tsx:17:      <rect x={-w / 2} y={-h} width={w} height={h - 4} rx={w * 0.34} fill={`url(#${grad})`} />
src/components/art.tsx:18:      <rect x={-w / 2 + 7} y={-h + 16} width={5} height={h - 40} rx={2.5} fill="#fff" opacity={0.25} />
src/components/art.tsx:19:      <rect x={-w / 2} y={-h * 0.62} width={w} height={h * 0.2} fill="#f04a2d" />
src/components/art.tsx:20:      <path transform={`translate(0 ${-h * 0.52}) scale(${w / 70})`} d="M0 -8C5 -2 8 1 8 5a8 8 0 0 1-16 0c0-4 4-6 5-10 2 2 3 3 3 5C1 -2 0 -5 0 -8z" fill="#fff" />
src/components/art.tsx:21:      <rect x={-w * 0.3} y={-h - 7} width={w * 0.6} height={9} rx={3} fill="#0b2a57" />
src/components/art.tsx:22:      <path d={`M${-w * 0.28} ${-h - 4}q0-15 ${w * 0.28}-15t${w * 0.28} 15`} fill="none" stroke="#0b2a57" strokeWidth={4} strokeLinecap="round" />
src/components/art.tsx:23:      <rect x={-5} y={-h - 22} width={10} height={14} rx={2} fill="#d9a521" />
src/components/art.tsx:24:      <rect x={-9} y={-h - 26} width={18} height={5} rx={2.5} fill="#b9871a" />
src/components/art.tsx:25:    </g>
src/components/art.tsx:26:  )
src/components/art.tsx:27:}
src/components/art.tsx:28:
src/components/art.tsx:29:export function Cylinder({ size, height = 110, shadow = true }: { size: Size; height?: number; shadow?: boolean }) {
src/components/art.tsx:30:  const { h } = SPEC[size]
src/components/art.tsx:31:  const total = h + 34
src/components/art.tsx:32:  return (
src/components/art.tsx:33:    <svg viewBox={`-40 ${-total} 80 ${total + 8}`} height={height} role="img" aria-label={`${size} LPG cylinder`} style={{ display: 'block' }}>
src/components/art.tsx:34:      <defs>{GRAD('fgBody')}</defs>
src/components/art.tsx:35:      {shadow && <ellipse cx={0} cy={3} rx={30} ry={4} fill="#0b2a57" opacity={0.18} />}
src/components/art.tsx:36:      <Glyph size={size} grad="fgBody" />
src/components/art.tsx:37:    </svg>
src/components/art.tsx:38:  )
src/components/art.tsx:39:}
src/components/art.tsx:40:
src/components/art.tsx:41:/** Rider on a scooter carrying cylinders, over a Pangasinan-flavoured landscape (rice fields, palms, Lingayen Gulf). */
src/components/art.tsx:42:export function HeroArt() {
src/components/art.tsx:43:  return (
src/components/art.tsx:44:    <svg viewBox="0 0 520 300" role="img" aria-label="Rider delivering LPG cylinders by scooter" style={{ width: '100%', height: 'auto', display: 'block' }}>
src/components/art.tsx:45:      <defs>
src/components/art.tsx:46:        {GRAD('fgHero')}
src/components/art.tsx:47:        <radialGradient id="sun"><stop offset="0" stopColor="#ffb347" stopOpacity=".95" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
src/components/art.tsx:48:        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0f57a6" /><stop offset="1" stopColor="#4f9be0" /></linearGradient>
src/components/art.tsx:49:      </defs>
src/components/art.tsx:50:      <rect width="520" height="300" fill="url(#sky)" />
src/components/art.tsx:51:      <circle cx="400" cy="120" r="120" fill="url(#sun)" />
src/components/art.tsx:52:      <circle cx="400" cy="120" r="34" fill="#ffd27a" />
src/components/art.tsx:53:      <g fill="#fff" opacity=".85"><ellipse cx="90" cy="60" rx="38" ry="11" /><ellipse cx="120" cy="52" rx="26" ry="10" /><ellipse cx="250" cy="90" rx="30" ry="9" /></g>
src/components/art.tsx:54:      <path d="M0 190 Q90 150 190 182 T380 176 T520 168 V300 H0Z" fill="#2f7fcf" opacity=".55" />
src/components/art.tsx:55:      <path d="M0 210 Q120 176 250 206 T520 196 V300 H0Z" fill="#1d9a5c" />
src/components/art.tsx:56:      <path d="M0 226 Q140 204 280 224 T520 216 V300 H0Z" fill="#157a48" />
src/components/art.tsx:57:      {[40, 80, 120, 160].map((x) => <path key={x} d={`M${x} 262 q${x / 6} -22 ${x} -22`} stroke="#4fc387" strokeWidth="1.5" fill="none" opacity=".5" />)}
src/components/art.tsx:58:      <g stroke="#0b2a57" strokeWidth="5" strokeLinecap="round" fill="none"><path d="M60 224V170M470 218V160" /></g>
src/components/art.tsx:59:      <g fill="#14803f"><path d="M60 172c-20-8-34-4-42 6 18-4 30-2 42-6zM60 172c18-14 34-12 44-4-18-2-30 0-44 4zM60 172c-6-16 0-30 10-34-4 14-4 24-10 34z" /><path d="M470 162c-20-8-34-4-42 6 18-4 30-2 42-6zM470 162c18-14 34-12 44-4-18-2-30 0-44 4zM470 162c-6-16 0-30 10-34-4 14-4 24-10 34z" /></g>
src/components/art.tsx:60:      <rect y="250" width="520" height="50" fill="#0b2a57" />
src/components/art.tsx:61:      <path d="M0 252H520" stroke="#fff" strokeWidth="2" strokeDasharray="22 16" opacity=".35" />
src/components/art.tsx:62:      <g stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".55"><path d="M120 214h40M100 228h50M130 240h30" /></g>
src/components/art.tsx:63:      <ellipse cx="320" cy="262" rx="120" ry="7" fill="#000" opacity=".25" />
src/components/art.tsx:64:      <g transform="translate(232 232) scale(.72)"><Glyph size="11kg" grad="fgHero" /></g>
src/components/art.tsx:65:      <g transform="translate(262 232) scale(.72)"><Glyph size="22kg" grad="fgHero" /></g>
src/components/art.tsx:66:      <rect x="226" y="228" width="62" height="7" rx="3" fill="#0b1b33" />
src/components/art.tsx:67:      <path d="M258 214c0-34 26-44 54-44h40c22 0 32 22 36 64h-52c-3-16-14-24-34-24h-44z" fill="#f04a2d" />
src/components/art.tsx:68:      <rect x="276" y="168" width="64" height="16" rx="8" fill="#0b1b33" />
src/components/art.tsx:69:      <path d="M392 236l-20-80" stroke="#d4dcea" strokeWidth="7" strokeLinecap="round" />
src/components/art.tsx:70:      <path d="M356 150h30" stroke="#0b1b33" strokeWidth="7" strokeLinecap="round" />
src/components/art.tsx:71:      <path d="M290 178l20-48 22 8-12 42z" fill="#fff" />
src/components/art.tsx:72:      <path d="M300 172l12-30 16 6-8 24z" fill="#0f57a6" opacity=".2" />
src/components/art.tsx:73:      <circle cx="326" cy="116" r="15" fill="#f2c6a0" />
src/components/art.tsx:74:      <path d="M311 114a15 15 0 0 1 30 0v3h-30z" fill="#f04a2d" />
src/components/art.tsx:75:      <path d="M326 140l42 14" stroke="#0f57a6" strokeWidth="9" strokeLinecap="round" />
src/components/art.tsx:76:      <path d="M300 186l34 26 4 22" stroke="#14213d" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
src/components/art.tsx:77:      {[[246, 238], [392, 238]].map(([x, y]) => <g key={x}><circle cx={x} cy={y} r="24" fill="#14213d" /><circle cx={x} cy={y} r="11" fill="#cfd8e6" /><circle cx={x} cy={y} r="4" fill="#14213d" /></g>)}
src/components/art.tsx:78:    </svg>
src/components/art.tsx:79:  )
src/components/art.tsx:80:}
src/components/art.tsx:81:
src/components/art.tsx:82:/** Compact mark used where a photo would be (customer banner, empty states). */
src/components/art.tsx:83:export function CylinderRow({ height = 90 }: { height?: number }) {
src/components/art.tsx:84:  return (
src/components/art.tsx:85:    <svg viewBox="-60 -170 260 180" height={height} role="img" aria-label="LPG cylinders" style={{ display: 'block' }}>
src/components/art.tsx:86:      <defs>{GRAD('fgRow')}</defs>
src/components/art.tsx:87:      <ellipse cx="45" cy="3" rx="105" ry="5" fill="#0b2a57" opacity=".18" />
src/components/art.tsx:88:      <g transform="translate(-10 0)"><Glyph size="11kg" grad="fgRow" /></g>
src/components/art.tsx:89:      <g transform="translate(50 0)"><Glyph size="22kg" grad="fgRow" /></g>
src/components/art.tsx:90:      <g transform="translate(118 0)"><Glyph size="50kg" grad="fgRow" /></g>
src/components/art.tsx:91:    </svg>
src/components/art.tsx:92:  )
src/components/art.tsx:93:}

exec
/bin/bash -lc 'nl -ba src/components/charts.tsx && nl -ba src/pages/owner/Dashboard.tsx && nl -ba src/pages/customer/Customer.tsx && nl -ba src/lib/seed.ts' in /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
 succeeded in 0ms:
     1	import { useState } from 'react'
     2	import type { ReactNode } from 'react'
     3	import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
     4	import type { LucideIcon } from 'lucide-react'
     5	
     6	// Palette (validated with the dataviz validator): brand blue = the series, orange = emphasis, slate = context.
     7	export const C = { blue: '#0f57a6', orange: '#f04a2d', slate: '#8696b0', grid: '#e1e6ef', ok: '#1f9d55', warn: '#e8a317', bad: '#d63a2f' }
     8	
     9	export function Spark({ data, color = C.blue }: { data: number[]; color?: string }) {
    10	  const max = Math.max(1, ...data), w = 120, h = 30
    11	  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * w},${h - 3 - (v / max) * (h - 6)}`).join(' ')
    12	  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden><polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" /></svg>
    13	}
    14	
    15	/** good = which direction is an improvement (so a faster delivery time shows green when it falls). */
    16	export function Tile({ icon: Icon, tone = '', label, value, sub, delta, good = 'up', spark }: {
    17	  icon: LucideIcon; tone?: '' | 'o' | 'g' | 'r'; label: string; value: string; sub?: string; delta?: number; good?: 'up' | 'down'; spark?: number[]
    18	}) {
    19	  const better = delta === undefined ? undefined : (delta >= 0) === (good === 'up')
    20	  return (
    21	    <div className="card tile lift">
    22	      <div className="top"><span className={`ic ${tone}`}><Icon size={16} /></span>{label}</div>
    23	      <div className="val">{value}</div>
    24	      <div className="row" style={{ gap: 6 }}>
    25	        {delta !== undefined && Math.abs(delta) >= 0.5 && <span className={`delta ${better ? 'up' : 'down'}`}>{delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(Math.round(delta))}%</span>}
    26	        <span className="mute">{sub}</span>
    27	      </div>
    28	      {spark && <Spark data={spark} color={tone === 'o' ? C.orange : C.blue} />}
    29	    </div>
    30	  )
    31	}
    32	
    33	export function Panel({ icon: Icon, title, sub, children }: { icon: LucideIcon; title: string; sub?: string; children: ReactNode }) {
    34	  return <div className="card lift"><div className="section-h"><Icon size={18} /><h2>{title}</h2></div>{sub && <div className="mute" style={{ marginTop: -6, marginBottom: 10 }}>{sub}</div>}{children}</div>
    35	}
    36	
    37	/** Single-series area/line chart with crosshair tooltip. */
    38	export function AreaChart({ values, labels, unit = '' }: { values: number[]; labels: string[]; unit?: string }) {
    39	  const [hi, setHi] = useState<number>()
    40	  const W = 640, H = 200, L = 30, B = 22, T = 10
    41	  const max = Math.max(4, Math.ceil(Math.max(...values) / 2) * 2)
    42	  const x = (i: number) => L + (i / (values.length - 1)) * (W - L - 8)
    43	  const y = (v: number) => T + (1 - v / max) * (H - T - B)
    44	  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('')
    45	  const ticks = [0, max / 2, max]
    46	  return (
    47	    <div className="chart">
    48	      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Orders per day, last ${values.length} days`}
    49	        onMouseLeave={() => setHi(undefined)} onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHi(Math.max(0, Math.min(values.length - 1, Math.round(((e.clientX - r.left) / r.width * W - L) / (W - L - 8) * (values.length - 1))))) }}>
    50	        {ticks.map((t) => <g key={t}><line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke={C.grid} /><text x={L - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill={C.slate}>{t}</text></g>)}
    51	        <path d={`${line}L${x(values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={C.blue} opacity={0.12} />
    52	        <path d={line} fill="none" stroke={C.blue} strokeWidth={2} strokeLinejoin="round" />
    53	        {[0, Math.floor(values.length / 2), values.length - 1].map((i) => <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === values.length - 1 ? 'end' : 'middle'} fontSize="10" fill={C.slate}>{labels[i]}</text>)}
    54	        {hi !== undefined && <g><line x1={x(hi)} x2={x(hi)} y1={T} y2={H - B} stroke={C.slate} strokeDasharray="3 3" /><circle cx={x(hi)} cy={y(values[hi])} r={5} fill={C.blue} stroke="#fff" strokeWidth={2} /></g>}
    55	      </svg>
    56	      {hi !== undefined && <div className="tip" style={{ left: `${(x(hi) / W) * 100}%`, top: `${(y(values[hi]) / H) * 100}%` }}>{labels[hi]} · <b>{values[hi]}{unit}</b></div>}
    57	    </div>
    58	  )
    59	}
    60	
    61	/** Weekly stacked columns: app (accent) vs staff-encoded (context gray), 2px gaps, rounded data end. */
    62	export function StackedCols({ weeks }: { weeks: { label: string; app: number; staff: number }[] }) {
    63	  const [hi, setHi] = useState<number>()
    64	  const max = Math.max(1, ...weeks.map((w) => w.app + w.staff))
    65	  const H = 150
    66	  return (
    67	    <div className="chart">
    68	      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: H, borderBottom: `1px solid ${C.grid}` }}>
    69	        {weeks.map((w, i) => (
    70	          <div key={w.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: 2 }} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(undefined)}>
    71	            <div title={`${w.label}: ${w.staff} encoded by staff`} style={{ height: `${(w.staff / max) * 100}%`, background: C.slate, borderRadius: '4px 4px 0 0', opacity: hi === undefined || hi === i ? 1 : 0.5 }} />
    72	            <div title={`${w.label}: ${w.app} placed in the app`} style={{ height: `${(w.app / max) * 100}%`, background: C.blue, borderRadius: '2px', opacity: hi === undefined || hi === i ? 1 : 0.5 }} />
    73	          </div>
    74	        ))}
    75	      </div>
    76	      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>{weeks.map((w) => <span key={w.label} className="mute" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>{w.label}</span>)}</div>
    77	      <div className="legend"><span><i style={{ background: C.blue }} />Placed in the app</span><span><i style={{ background: C.slate }} />Encoded by staff (call / text / walk-in)</span></div>
    78	      {hi !== undefined && <div className="mute" style={{ marginTop: 4 }}>{weeks[hi].label}: <b>{weeks[hi].app}</b> app · <b>{weeks[hi].staff}</b> staff-encoded</div>}
    79	    </div>
    80	  )
    81	}
    82	
    83	export function HBars({ rows, fmt = (n: number) => String(Math.round(n)), color = C.blue }: { rows: [string, number][]; fmt?: (n: number) => string; color?: string }) {
    84	  const sorted = [...rows].sort((a, b) => b[1] - a[1]), max = Math.max(1, ...sorted.map((r) => r[1]))
    85	  return (
    86	    <div className="stack" style={{ gap: 8 }}>
    87	      {sorted.map(([k, v], i) => (
    88	        <div key={k} title={`${k}: ${fmt(v)}`} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 10, alignItems: 'center', fontSize: 13 }}>
    89	          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k}</span>
    90	          <div style={{ height: 10, background: '#eef1f6', borderRadius: 5 }}><div style={{ width: `${(v / max) * 100}%`, height: '100%', background: color, borderRadius: '2px 5px 5px 2px', opacity: 1 - i * 0.07 }} /></div>
    91	          <b>{fmt(v)}</b>
    92	        </div>
    93	      ))}
    94	    </div>
    95	  )
    96	}
     1	import { AlertTriangle, BellRing, Boxes, CalendarClock, CheckCircle2, Clock, Megaphone, PackageX, Repeat, Route, Smartphone, Timer, TrendingUp, UserPlus, Wallet, Map as MapIcon, Truck } from 'lucide-react'
     2	import { Link } from 'react-router-dom'
     3	import { Cylinder } from '../../components/art'
     4	import { AreaChart, C, HBars, Panel, StackedCols, Tile } from '../../components/charts'
     5	import { avg, byId, delivered, mins, peso, refillRows } from '../../lib/derive'
     6	import { DAY } from '../../lib/refill'
     7	import { useDB } from '../../lib/store'
     8	import { SIZES } from '../../lib/types'
     9	
    10	const group = (a: [string, number][]) => Object.entries(a.reduce<Record<string, number[]>>((m, [k, v]) => ((m[k] ||= []).push(v), m), {}))
    11	const pct = (cur: number, prev: number) => (prev ? ((cur - prev) / prev) * 100 : undefined)
    12	
    13	export default function Dashboard() {
    14	  const d = useDB()
    15	  const today = new Date().setHours(0, 0, 0, 0)
    16	  const dayIdx = (t: number) => Math.floor((t - today) / DAY) // 0 = today, -1 = yesterday
    17	  const real = d.orders.filter((o) => o.status !== 'Cancelled')
    18	  const done = delivered(d)
    19	  const dTime = (o: (typeof done)[number]) => mins(o.placedAt, o.deliveredAt!)
    20	
    21	  const perDay = Array.from({ length: 30 }, (_, i) => real.filter((o) => dayIdx(o.placedAt) === i - 29).length)
    22	  const labels = Array.from({ length: 30 }, (_, i) => new Date(today + (i - 29) * DAY).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }))
    23	  const win = (from: number, to: number) => real.filter((o) => dayIdx(o.placedAt) >= from && dayIdx(o.placedAt) < to)
    24	  const cur = win(-29, 1), prev = win(-59, -29)
    25	  const revCur = cur.reduce((a, o) => a + o.amount, 0), revPrev = prev.reduce((a, o) => a + o.amount, 0)
    26	  const dtCur = avg(done.filter((o) => dayIdx(o.deliveredAt!) >= -29).map(dTime)), dtPrev = avg(done.filter((o) => dayIdx(o.deliveredAt!) < -29 && dayIdx(o.deliveredAt!) >= -59).map(dTime))
    27	  const dispatch = d.orders.filter((o) => o.assignedAt).map((o) => mins(o.placedAt, o.assignedAt!))
    28	
    29	  const rows = refillRows(d)
    30	  const mult = rows.filter((x) => x.r && x.r.source !== 'default')
    31	  const withOrders = rows.filter((x) => x.r).length
    32	  const status = { ok: rows.filter((x) => x.r?.status === 'ok').length, due: rows.filter((x) => x.r?.status === 'due').length, overdue: rows.filter((x) => x.r?.status === 'overdue').length }
    33	  const total = Math.max(1, status.ok + status.due + status.overdue)
    34	
    35	  const weeks = Array.from({ length: 8 }, (_, i) => {
    36	    const from = -7 * (7 - i) - 6, to = from + 7
    37	    const w = win(from, to)
    38	    return { label: new Date(today + from * DAY).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }), app: w.filter((o) => o.channel === 'app').length, staff: w.filter((o) => o.channel !== 'app').length }
    39	  })
    40	  const share = (w: { app: number; staff: number }) => Math.round((w.app / Math.max(1, w.app + w.staff)) * 100)
    41	
    42	  const townOf = (id: string) => byId(d.customers, id)!.town
    43	  const reasons = group(d.orders.filter((o) => o.failReason).map((o) => [o.failReason!, 1]))
    44	  const blastRows = d.blasts.map((b) => ({ b, n: d.orders.filter((o) => b.recipients.includes(o.customerId) && o.placedAt > b.at && o.placedAt < b.at + 7 * DAY).length }))
    45	  const units = Object.fromEntries(SIZES.map((s) => [s, done.filter((o) => o.size === s).reduce((a, o) => a + o.qty, 0)]))
    46	
    47	  return (
    48	    <div className="stack" style={{ gap: 14 }}>
    49	      <div className="row"><h1 className="grow">Business overview</h1><span className="mute">Last 30 days vs the 30 before</span></div>
    50	      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))' }}>
    51	        <Tile icon={TrendingUp} label="Orders" value={String(cur.length)} sub="vs prior 30 days" delta={pct(cur.length, prev.length)} spark={perDay} />
    52	        <Tile icon={Wallet} tone="g" label="Revenue" value={peso(revCur)} sub="vs prior 30 days" delta={pct(revCur, revPrev)} />
    53	        <Tile icon={Timer} tone="o" label="Avg delivery time" value={`${Math.round(dtCur)} min`} sub="placed → delivered" delta={pct(dtCur, dtPrev)} good="down" />
    54	        <Tile icon={Clock} label="Time to dispatch" value={`${Math.round(avg(dispatch))} min`} sub="placed → rider assigned" />
    55	        <Tile icon={Repeat} tone="g" label="Repeat rate" value={`${Math.round((mult.length / Math.max(1, withOrders)) * 100)}%`} sub="customers with 2+ orders" />
    56	        <Tile icon={CalendarClock} label="Avg refill cycle" value={`${Math.round(avg(mult.map((x) => x.r!.cycleDays)))} days`} sub={`${mult.length} customers`} />
    57	        <Tile icon={UserPlus} label="First → second order" value={`${Math.round(avg(mult.map((x) => x.r!.firstToSecond!)))} days`} sub="new-customer retention" />
    58	        <Link to="/owner/follow-ups" style={{ textDecoration: 'none', color: 'inherit' }}><Tile icon={BellRing} tone="r" label="Customers to call" value={String(status.due + status.overdue)} sub={`${status.overdue} overdue · ${status.due} due soon`} /></Link>
    59	      </div>
    60	
    61	      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))' }}>
    62	        <Panel icon={TrendingUp} title="Orders per day" sub="All channels, last 30 days. Hover for the day."><AreaChart values={perDay} labels={labels} /></Panel>
    63	        <Panel icon={Smartphone} title="Who places the orders?" sub={`App share grew from ${share(weeks[0])}% to ${share(weeks[7])}% in 8 weeks. Less manual work for the dispatcher.`}><StackedCols weeks={weeks} /></Panel>
    64	      </div>
    65	
    66	      <Panel icon={CheckCircle2} title="Customer refill health" sub="Based on each customer's own refill cycle. Overdue means past the expected date by the 3-day grace period.">
    67	        <div className="seg" role="img" aria-label={`${status.ok} on cycle, ${status.due} due soon, ${status.overdue} overdue`}>
    68	          <div style={{ flex: status.ok / total, background: C.ok }} /><div style={{ flex: status.due / total, background: C.warn }} /><div style={{ flex: status.overdue / total, background: C.bad }} />
    69	        </div>
    70	        <div className="legend"><span><i style={{ background: C.ok }} /><CheckCircle2 size={13} style={{ verticalAlign: -2 }} /> {status.ok} on cycle</span><span><i style={{ background: C.warn }} /><Clock size={13} style={{ verticalAlign: -2 }} /> {status.due} due soon</span><span><i style={{ background: C.bad }} /><AlertTriangle size={13} style={{ verticalAlign: -2 }} /> {status.overdue} overdue</span>
    71	          <Link to="/owner/follow-ups" style={{ marginLeft: 'auto', fontWeight: 600 }}>Open the follow-up list →</Link></div>
    72	      </Panel>
    73	
    74	      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
    75	        <Panel icon={Truck} title="Delivery minutes · by rider" sub="Lower is faster."><HBars rows={group(done.map((o) => [byId(d.riders, o.riderId)?.name ?? '?', dTime(o)])).map(([k, v]) => [k, avg(v)])} /></Panel>
    76	        <Panel icon={MapIcon} title="Delivery minutes · by town" sub="Where deliveries are slow."><HBars color={C.orange} rows={group(done.map((o) => [townOf(o.customerId), dTime(o)])).map(([k, v]) => [k, avg(v)])} /></Panel>
    77	        <Panel icon={Wallet} title="Revenue · by town"><HBars fmt={peso} rows={group(done.map((o) => [townOf(o.customerId), o.amount])).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0)])} /></Panel>
    78	        <Panel icon={Boxes} title="Units sold · by size">
    79	          <div className="row" style={{ alignItems: 'flex-end', justifyContent: 'space-around' }}>{SIZES.map((s) => <div key={s} style={{ textAlign: 'center' }}><Cylinder size={s} height={s === '11kg' ? 70 : s === '22kg' ? 84 : 100} /><div className="big" style={{ fontSize: 22 }}>{units[s]}</div><div className="mute">{s}</div></div>)}</div>
    80	        </Panel>
    81	        <Panel icon={PackageX} title="Failed deliveries" sub="Reasons point to address quality and rider issues."><HBars color={C.bad} rows={reasons.map(([k, v]) => [k, v.length])} /></Panel>
    82	        <Panel icon={Megaphone} title="Promo blasts" sub="Orders placed within 7 days of each blast.">
    83	          {blastRows.map(({ b, n }) => <div key={b.id} className="row" style={{ marginBottom: 6 }}><Route size={15} color={C.blue} /><span className="grow">{b.segment}</span><b>{n} orders</b><span className="mute">from {b.recipients.length}</span></div>)}
    84	        </Panel>
    85	      </div>
    86	    </div>
    87	  )
    88	}
     1	import { useState } from 'react'
     2	import { Link, useNavigate } from 'react-router-dom'
     3	import { Bike, MapPin, Repeat, ShieldCheck } from 'lucide-react'
     4	import { Cylinder, CylinderRow } from '../../components/art'
     5	import { Field, StatusPill } from '../../components/ui'
     6	import { DEPOSIT, REFILL_PRICE, town } from '../../lib/geo'
     7	import { ago, byId, mins, ordersOf, peso, refillOf } from '../../lib/derive'
     8	import { actions, OTP, useDB } from '../../lib/store'
     9	import { SIZES, type Order, type Payment, type Size } from '../../lib/types'
    10	
    11	const KEY = 'fiesta-gas-demo-customer'
    12	const read = () => { try { return localStorage.getItem(KEY) || 'c1' } catch { return 'c1' } }
    13	/** Demo persona: which customer is using the PWA (default Maria, c1). */
    14	function useMe() {
    15	  const d = useDB()
    16	  const id = d.customers.some((c) => c.id === read()) ? read() : 'c1'
    17	  const pick = (v: string) => { try { localStorage.setItem(KEY, v) } catch { /* ignore */ } actions.touch() }
    18	  return { id, pick, all: d.customers }
    19	}
    20	
    21	export function OrderPage() {
    22	  const d = useDB(); const nav = useNavigate(); const { id: ME, pick, all } = useMe()
    23	  const me = byId(d.customers, ME)!
    24	  const r = refillOf(d, me)
    25	  const last = ordersOf(d, ME).find((o) => o.status === 'Delivered')
    26	  const [size, setSize] = useState<Size>(me.size)
    27	  const [qty, setQty] = useState(1)
    28	  const [type, setType] = useState<'refill' | 'new'>('refill')
    29	  const [payment, setPayment] = useState<Payment>('cod')
    30	  const fee = town(me.town).fee
    31	  const total = (REFILL_PRICE[size] + (type === 'new' ? DEPOSIT[size] : 0)) * qty + fee
    32	  return (
    33	    <div className="stack">
    34	      <div className="banner">
    35	        <div style={{ paddingBottom: 14 }}><h1>Kumusta, {me.name.split(' ')[0]}!</h1><div className="mute row" style={{ gap: 5, flexWrap: 'nowrap', alignItems: 'flex-start' }}><MapPin size={14} style={{ flex: 'none', marginTop: 2 }} />{me.street}, {me.barangay}, {me.town}</div>
    36	        <div className="mute row" style={{ gap: 5, marginTop: 6, flexWrap: 'nowrap', alignItems: 'flex-start' }}><ShieldCheck size={14} style={{ flex: 'none', marginTop: 2 }} />Rider-verified delivery</div></div>
    37	        <CylinderRow height={96} /></div>
    38	      <div className="stack" style={{ gap: 4 }}>
    39	        <label className="mute">Demo as: <select aria-label="Demo customer" value={ME} onChange={(e) => pick(e.target.value)}>{all.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
    40	      {last && <div className="card reorder">
    41	        <Repeat size={22} color="var(--orange)" /><div className="grow"><b>Reorder your usual</b><div className="mute">{last.qty}× {last.size} {last.type === 'new' ? 'new tank' : 'refill'} · {last.payment.toUpperCase()}</div></div>
    42	        <button className="btn hot" onClick={() => { actions.placeOrder({ customerId: ME, size: last.size, qty: last.qty, type: last.type, payment: last.payment, channel: 'app' }); nav('/customer/orders') }}>Reorder</button></div>}
    43	      {r && r.status !== 'ok' && <div className="card" style={{ borderColor: 'var(--orange)' }}>
    44	        <b>{r.status === 'overdue' ? 'Baka paubos na ang gas ninyo.' : 'Malapit nang maubos ang gas.'}</b>
    45	        <div className="mute">Usually you refill every ~{Math.round(r.cycleDays)} days. Order now and we'll deliver today.</div>
    46	      </div>}
    47	      <div className="card stack">
    48	        <h2>Order a refill</h2>
    49	        <Field label="Cylinder size"><div className="sizes">{SIZES.map((s) => <button key={s} className={`size ${size === s ? 'on' : ''}`} onClick={() => setSize(s)} aria-label={s}>
    50	          <Cylinder size={s} height={s === '11kg' ? 70 : s === '22kg' ? 84 : 100} shadow={false} />{s}<small>{peso(REFILL_PRICE[s])}</small></button>)}</div></Field>
    51	        <Field label="Order type"><div className="chips">
    52	          <button className={`chip ${type === 'refill' ? 'on' : ''}`} onClick={() => setType('refill')}>Refill swap</button>
    53	          <button className={`chip ${type === 'new' ? 'on' : ''}`} onClick={() => setType('new')}>New tank + deposit</button></div></Field>
    54	        <Field label="Quantity"><div className="row">
    55	          <button className="btn alt" aria-label="Less" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b style={{ minWidth: 24, textAlign: 'center' }}>{qty}</b>
    56	          <button className="btn alt" aria-label="More" onClick={() => setQty(Math.min(5, qty + 1))}>+</button></div></Field>
    57	        <Field label="Payment"><div className="chips">{([['cod', 'Cash on delivery'], ['gcash', 'GCash'], ['maya', 'Maya']] as const).map(([k, l]) =>
    58	          <button key={k} className={`chip ${payment === k ? 'on' : ''}`} onClick={() => setPayment(k)}>{l}</button>)}</div></Field>
    59	        <div className="row"><span className="mute">{qty}× {size} {type === 'new' ? 'new tank' : 'refill'}{fee ? ` + ${peso(fee)} delivery` : ' · free delivery'}</span><b className="right big" style={{ fontSize: 22 }}>{peso(total)}</b></div>
    60	        <button className="btn hot block" onClick={() => { actions.placeOrder({ customerId: ME, size, qty, type, payment, channel: 'app' }); nav('/customer/orders') }}>Place order</button>
    61	        {payment !== 'cod' && <div className="mute">E-wallet is paid to the rider on delivery in this version. Online prepayment is an optional add-on.</div>}
    62	      </div>
    63	    </div>
    64	  )
    65	}
    66	
    67	const STEPS = ['Placed', 'Assigned', 'Out for delivery', 'Delivered'] as const
    68	
    69	function OrderCard({ o, d, live }: { o: Order; d: ReturnType<typeof useDB>; live?: boolean }) {
    70	  const rider = byId(d.riders, o.riderId)
    71	  const idx = STEPS.indexOf(o.status as (typeof STEPS)[number])
    72	  return (
    73	    <div className="card stack">
    74	      <div className="row"><b>{o.id}</b><StatusPill s={o.status} /><span className="right mute">{ago(o.placedAt)}</span></div>
    75	      <div>{o.qty}× {o.size} {o.type === 'new' ? 'new tank' : 'refill'} · {peso(o.amount)} · {o.payment.toUpperCase()}</div>
    76	      {live && <>
    77	        <div className="timeline">{STEPS.map((s, i) => <span key={s} className={i <= idx ? 'done' : ''}>{s === 'Out for delivery' ? 'On the way' : s}</span>)}</div>
    78	        {rider && <div className="mute row" style={{ gap: 6 }}><Bike size={15} />{rider.name} · {rider.phone}</div>}
    79	        {o.status === 'Out for delivery' && <div className="sms otp">Give the rider your delivery code: <b>{OTP}</b></div>}
    80	        {o.status === 'Failed' && <div className="mute">Delivery failed: {o.failReason}. We'll re-dispatch shortly.</div>}
    81	      </>}
    82	      {o.status === 'Delivered' && o.deliveredAt && <div className="mute">Delivered in {mins(o.placedAt, o.deliveredAt)} min</div>}
    83	    </div>
    84	  )
    85	}
    86	
    87	export function Orders() {
    88	  const d = useDB(); const { id: ME } = useMe()
    89	  const all = ordersOf(d, ME)
    90	  const live = all.filter((o) => ['Placed', 'Assigned', 'Out for delivery', 'Failed'].includes(o.status))
    91	  const past = all.filter((o) => !live.includes(o))
    92	  return (
    93	    <div className="stack">
    94	      <h1>My orders</h1>
    95	      {live.length ? live.map((o) => <OrderCard key={o.id} o={o} d={d} live />) : <div className="card mute">No active order. <Link to="/customer">Order a refill</Link></div>}
    96	      <h3>History</h3>
    97	      {past.map((o) => <OrderCard key={o.id} o={o} d={d} />)}
    98	    </div>
    99	  )
   100	}
   101	
   102	export function Inbox() {
   103	  const d = useDB(); const { id: ME } = useMe()
   104	  const me = byId(d.customers, ME)!
   105	  const mine = d.sms.filter((s) => s.to === me.phone)
   106	  return (
   107	    <div className="stack">
   108	      <h1>Messages</h1><div className="mute">What this customer's phone receives by SMS.</div>
   109	      {mine.length ? mine.map((s) => <div key={s.id} className={`sms ${s.kind === 'otp' ? 'otp' : ''}`}>{s.text}<div className="mute">{ago(s.at)}</div></div>)
   110	        : <div className="card mute">Nothing yet. Place an order to see the confirmation.</div>}
   111	    </div>
   112	  )
   113	}
     1	import { DEPOSIT, REFILL_PRICE, TOWNS, town } from './geo'
     2	import { DAY } from './refill'
     3	import type { Customer, DB, Order, Size } from './types'
     4	
     5	const FIRST = ['Mylene', 'Rogelio', 'Janice', 'Alvin', 'Cecilia', 'Domingo', 'Fe', 'Gener', 'Hazel', 'Isidro', 'Jocelyn', 'Kristoffer', 'Leonora', 'Marlon', 'Norma', 'Oscar',
     6	  'Perla', 'Quirino', 'Remedios', 'Saturnino', 'Teresita', 'Ulysses', 'Violeta', 'Wilfredo', 'Yolanda', 'Zaldy', 'Aileen', 'Bong', 'Corazon', 'Danilo', 'Edna', 'Fernando']
     7	const LAST = ['Gonzales', 'Javier', 'Castillo', 'Navarro', 'Ramos', 'Salazar', 'Tamayo', 'Uy', 'Velasco', 'Yap', 'Zamora', 'Aguilar', 'Bernardo', 'Carino', 'Dizon', 'Espino']
     8	const NAMES = ['Maria Santos', 'Jose dela Cruz', 'Ana Villanueva', 'Ramon Bautista', 'Liza Manuel', 'Pedro Ocampo', 'Grace Tolentino',
     9	  'Carlo Mendoza', 'Rosalie Pascual', 'Dennis Cabrera', 'Joy Fernandez', 'Mario Soriano', 'Elena Padilla', 'Ricky Aquino', 'Nena Abalos',
    10	  'Tonyo Sison', 'Marites Lopez', 'Benjie Cruz', 'Aling Cora Estrada', 'Noel Quiambao', 'Jessa Rivera', 'Arnel De Guzman', 'Lorna Macaraeg',
    11	  'Boy Caasi', 'Sheila Evangelista', 'Rodel Ventura', 'Cherry Soliven', 'Tita Baby Nava',
    12	  ...Array.from({ length: 92 }, (_, i) => `${FIRST[i % FIRST.length]} ${LAST[(i * 5 + Math.floor(i / FIRST.length) * 3) % LAST.length]}`)]
    13	const STREETS = ['Purok 3', 'Purok 5', 'Zone 2', 'Rizal St.', 'Quezon Ave.', 'Mabini St.', 'Purok 1', 'Sitio Centro']
    14	const LANDMARKS = ['Beside the barangay hall', 'Blue gate, near the chapel', 'Across the sari-sari store', 'Behind the elementary school',
    15	  'Near the basketball court', 'Green house with mango tree', 'Beside the vulcanizing shop']
    16	
    17	// Small deterministic PRNG so the demo data is the same on every reset.
    18	function rng(seed: number) {
    19	  return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
    20	}
    21	
    22	export function seed(now = Date.now()): DB {
    23	  const r = rng(42)
    24	  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)]
    25	  const riders = [
    26	    { id: 'r1', name: 'Kuya Berto', phone: '0917 555 0101' },
    27	    { id: 'r2', name: 'Jun Manaois', phone: '0918 555 0102' },
    28	    { id: 'r3', name: 'Mac Rosario', phone: '0919 555 0103' },
    29	  ]
    30	  const customers: Customer[] = NAMES.map((name, i) => {
    31	    const t = TOWNS[i < 8 ? 0 : i % TOWNS.length]
    32	    const b = t.barangays[Math.floor(r() * t.barangays.length)]
    33	    return {
    34	      id: `c${i + 1}`, name, phone: `09${17 + (i % 5)} ${String(100 + i * 7).padStart(3, '0')} ${String(1000 + i * 131).slice(-4)}`,
    35	      town: t.name, barangay: b, street: pick(STREETS), landmark: pick(LANDMARKS),
    36	      lat: t.lat + (r() - 0.5) * 0.04, lng: t.lng + (r() - 0.5) * 0.04,
    37	      size: ((x) => (x < 0.7 ? '11kg' : x < 0.93 ? '22kg' : '50kg'))(r()), promoConsent: r() < 0.85, heldCylinders: 1 + (r() < 0.2 ? 1 : 0),
    38	    }
    39	  })
    40	
    41	  const orders: Order[] = []
    42	  let n = 1
    43	  const mk = (c: Customer, placedAt: number, over: Partial<Order> = {}): Order => {
    44	    const qty = 1
    45	    const o: Order = {
    46	      id: `FG-${String(1000 + n++)}`, customerId: c.id, size: c.size, qty, type: 'refill',
    47	      // App share grows over time (adoption story): ~12% two months ago -> ~65% now.
    48	      channel: r() < 0.1 + 0.55 * Math.max(0, 1 - (now - placedAt) / (60 * DAY)) ? 'app' : pick(['call', 'call', 'text', 'walk-in'] as const), status: 'Delivered',
    49	      payment: pick(['cod', 'cod', 'gcash', 'maya'] as const),
    50	      amount: REFILL_PRICE[c.size] * qty + town(c.town).fee, placedAt, ...over,
    51	    }
    52	    return o
    53	  }
    54	  customers.forEach((c, i) => {
    55	    const cycle = (c.size === '11kg' ? 26 : c.size === '22kg' ? 16 : 10) + Math.floor(r() * 14)
    56	    // every 4th customer is new this month (growth story); every 7th has only ever ordered once
    57	    const count = i % 7 === 0 || i % 4 === 1 ? 1 : 2 + Math.floor(r() * 5)
    58	    // Last order lands between ~2 and ~cycle+9 days ago, so some customers are due/overdue.
    59	    let last = now - Math.floor(r() * (cycle + 7)) * DAY
    60	    const times: number[] = []
    61	    for (let k = 0; k < count; k++) { times.unshift(last); last -= (cycle + Math.floor(r() * 7) - 3) * DAY }
    62	    times.forEach((t, k) => {
    63	      const placedAt = t - 8 * 3600_000 + Math.floor(r() * 4) * 3600_000
    64	      const mins = 28 + Math.floor(r() * 70)
    65	      const rider = pick(riders).id
    66	      const o = mk(c, placedAt, {
    67	        riderId: rider, assignedAt: placedAt + (3 + Math.floor(r() * 14)) * 60_000, deliveredAt: placedAt + mins * 60_000,
    68	        empties: 1, cashCollected: 0,
    69	        pod: { kind: r() < 0.5 ? 'otp' : 'photo', at: placedAt + mins * 60_000, lat: c.lat, lng: c.lng },
    70	        type: k === 0 && count > 1 && r() < 0.3 ? 'new' : 'refill',
    71	      })
    72	      if (o.type === 'new') o.amount += DEPOSIT[c.size]
    73	      if (o.payment === 'cod') o.cashCollected = o.amount
    74	      orders.push(o)
    75	    })
    76	  })
    77	  // A handful of failed deliveries for the analytics reasons chart.
    78	  ;(['No one home', 'Wrong address', 'No one home', 'Customer cancelled at door', 'Wrong address'] as const).forEach((reason, i) => {
    79	    const c = customers[(i * 5 + 3) % customers.length]
    80	    orders.push(mk(c, (i ? now - (3 + i * 9) * DAY : now - 3 * 3600_000), { status: 'Failed', failReason: reason, riderId: pick(riders).id, assignedAt: (i ? now - (3 + i * 9) * DAY : now - 3 * 3600_000) + 600_000 }))
    81	  })
    82	  // Live board for the demo (today).
    83	  const live: [number, Partial<Order>][] = [
    84	    [8, { status: 'Placed', channel: 'text' }],
    85	    [20, { status: 'Placed', channel: 'call' }],
    86	    [34, { status: 'Assigned', riderId: 'r1', assignedAt: now - 28 * 60_000 }],
    87	    [52, { status: 'Out for delivery', riderId: 'r1', assignedAt: now - 45 * 60_000 }],
    88	    [61, { status: 'Out for delivery', riderId: 'r2', assignedAt: now - 50 * 60_000 }],
    89	  ]
    90	  live.forEach(([mAgo, over], i) => {
    91	    const c = customers[8 + i * 3]
    92	    orders.push(mk(c, now - mAgo * 60_000, { empties: undefined, cashCollected: undefined, deliveredAt: undefined, pod: undefined, payment: i === 3 ? 'gcash' : 'cod', ...over }))
    93	  })
    94	
    95	  const recipients = customers.filter((c) => c.promoConsent).slice(0, 9).map((c) => c.id)
    96	  return {
    97	    customers, riders, orders: orders.sort((a, b) => a.placedAt - b.placedAt),
    98	    sms: [], followUps: [],
    99	    blasts: [{ id: 'b1', message: 'Fiesta Gas promo: free delivery this weekend on any refill! Reply STOP to opt out.', segment: 'Weekend promo · consented customers', recipients, at: now - 10 * DAY }],
   100	    movements: [{ id: 'm1', at: now - 2 * DAY, kind: 'stock-in', size: '11kg', full: 40, empty: 0, note: 'Refilled cylinders from supplier (DR-20418)' }],
   101	    remits: [],
   102	    stock: { full: { '11kg': 42, '22kg': 14, '50kg': 6 }, empty: { '11kg': 30, '22kg': 9, '50kg': 4 } } as DB['stock'],
   103	    seededAt: now,
   104	  }
   105	}
   106	export type { Size }

exec
/bin/bash -lc "rg -n \"\\.tip|chart|banner|sizes|reorder|\\.size\" src" in /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
 succeeded in 0ms:
src/pages/customer/Customer.tsx:26:  const [size, setSize] = useState<Size>(me.size)
src/pages/customer/Customer.tsx:34:      <div className="banner">
src/pages/customer/Customer.tsx:40:      {last && <div className="card reorder">
src/pages/customer/Customer.tsx:41:        <Repeat size={22} color="var(--orange)" /><div className="grow"><b>Reorder your usual</b><div className="mute">{last.qty}× {last.size} {last.type === 'new' ? 'new tank' : 'refill'} · {last.payment.toUpperCase()}</div></div>
src/pages/customer/Customer.tsx:42:        <button className="btn hot" onClick={() => { actions.placeOrder({ customerId: ME, size: last.size, qty: last.qty, type: last.type, payment: last.payment, channel: 'app' }); nav('/customer/orders') }}>Reorder</button></div>}
src/pages/customer/Customer.tsx:49:        <Field label="Cylinder size"><div className="sizes">{SIZES.map((s) => <button key={s} className={`size ${size === s ? 'on' : ''}`} onClick={() => setSize(s)} aria-label={s}>
src/pages/customer/Customer.tsx:75:      <div>{o.qty}× {o.size} {o.type === 'new' ? 'new tank' : 'refill'} · {peso(o.amount)} · {o.payment.toUpperCase()}</div>
src/pages/Launcher.tsx:22:          <p>Customers reorder in a minute, riders prove every delivery, and the refill cycle tells you who to call before they switch supplier.</p>
src/index.css:66:.banner { border-radius: 18px; background: linear-gradient(135deg, #0f57a6, var(--navy)); color: #fff; padding: 16px 16px 0; display: flex; align-items: flex-end; justify-content: space-between; overflow: hidden; }
src/index.css:67:.banner h1 { color: #fff; font-size: 20px; } .banner .mute { color: #b9cdea; }
src/index.css:68:.sizes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; } .size { align-content: end; border: 2px solid var(--line); background: #fff; border-radius: 14px; padding: 8px 4px 10px; cursor: pointer; display: grid; justify-items: center; gap: 4px; font-weight: 700; }
src/index.css:69:.size small { color: var(--mute); font-weight: 600; } .size.on { border-color: var(--blue); background: #eef4fd; box-shadow: 0 0 0 3px rgba(15,87,166,.12); }
src/index.css:70:.reorder { display: flex; align-items: center; gap: 12px; border: 1.5px dashed var(--orange); background: #fff7f5; }
src/index.css:75:.chart { position: relative; } .tip { position: absolute; pointer-events: none; background: var(--navy); color: #fff; font-size: 12px; padding: 6px 9px; border-radius: 8px; transform: translate(-50%, -110%); white-space: nowrap; z-index: 2; }
src/pages/dispatcher/Customers.tsx:16:    (!sz || c.size === sz) && (!stale || lastOrderDays(d, c) > +stale)), [d, q, tw, bg, sz, stale])
src/pages/dispatcher/Customers.tsx:28:        <select aria-label="Size" value={sz} onChange={(e) => setSz(e.target.value)}><option value="">All sizes</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</select>
src/pages/dispatcher/Customers.tsx:43:              <div className="mute">Cylinder: {sc.size} · holding {sc.heldCylinders} · promo consent: {sc.promoConsent ? 'yes' : 'no'}</div>
src/pages/rider/Rider.tsx:31:          <div>{o.qty}× {o.size} · {o.payment === 'cod' ? `Collect ${peso(o.amount)}` : `${o.payment.toUpperCase()} ${peso(o.amount)}`}</div></Link>
src/pages/rider/Rider.tsx:77:        <div>{o.qty}× {o.size} {o.type === 'new' ? 'new tank + deposit' : 'refill swap'} · <b>{peso(o.amount)}</b> · {o.payment.toUpperCase()}</div>
src/pages/owner/Ops.tsx:28:        {d.movements.slice(0, 15).map((m) => <tr key={m.id}><td>{ago(m.at)}</td><td>{m.kind}</td><td>{m.size}</td><td>{m.full > 0 ? '+' : ''}{m.full}</td><td>{m.empty > 0 ? '+' : ''}{m.empty}</td><td>{m.note}</td></tr>)}</tbody></table></div>
src/pages/dispatcher/NewOrder.tsx:44:          {matches.map((c) => <button key={c.id} className={`chip ${cid === c.id ? 'on' : ''}`} style={{ textAlign: 'left', borderRadius: 12 }} onClick={() => { setCid(c.id); setSize(c.size) }}>{c.name} · {c.barangay}, {c.town}</button>)}
src/pages/owner/Dashboard.tsx:4:import { AreaChart, C, HBars, Panel, StackedCols, Tile } from '../../components/charts'
src/pages/owner/Dashboard.tsx:45:  const units = Object.fromEntries(SIZES.map((s) => [s, done.filter((o) => o.size === s).reduce((a, o) => a + o.qty, 0)]))
src/pages/dispatcher/Board.tsx:21:        <td>{o.qty}× {o.size}<div className="mute">{peso(o.amount)} · {o.payment.toUpperCase()}</div></td>
src/components/art.tsx:82:/** Compact mark used where a photo would be (customer banner, empty states). */
src/components/charts.tsx:37:/** Single-series area/line chart with crosshair tooltip. */
src/components/charts.tsx:47:    <div className="chart">
src/components/charts.tsx:67:    <div className="chart">
src/pages/owner/Engage.tsx:44:  const seg = rows.filter(({ c, r }) => (!tw || c.town === tw) && (!sz || c.size === sz) && (!overdue || r?.status === 'overdue') &&
src/pages/owner/Engage.tsx:47:  const label = [tw || 'All towns', sz || 'all sizes', overdue && 'overdue only', min && `${min}+ orders`, 'consented'].filter(Boolean).join(' · ')
src/lib/seed.ts:46:      id: `FG-${String(1000 + n++)}`, customerId: c.id, size: c.size, qty, type: 'refill',
src/lib/seed.ts:50:      amount: REFILL_PRICE[c.size] * qty + town(c.town).fee, placedAt, ...over,
src/lib/seed.ts:55:    const cycle = (c.size === '11kg' ? 26 : c.size === '22kg' ? 16 : 10) + Math.floor(r() * 14)
src/lib/seed.ts:72:      if (o.type === 'new') o.amount += DEPOSIT[c.size]
src/lib/seed.ts:77:  // A handful of failed deliveries for the analytics reasons chart.
src/lib/store.ts:32:      const amount = (REFILL_PRICE[i.size] + (i.type === 'new' ? DEPOSIT[i.size] : 0)) * i.qty + town(c.town).fee
src/lib/store.ts:35:      sms(d, c.phone, `Fiesta Gas: order ${o.id} received (${i.qty}x ${i.size}, ₱${amount.toLocaleString()}). We'll text you when a rider is on the way.`, 'status')
src/lib/store.ts:62:      d.stock.full[o.size] -= o.qty
src/lib/store.ts:63:      d.stock.empty[o.size] += p.empties
src/lib/store.ts:64:      d.movements.unshift({ id: uid('m'), at: Date.now(), kind: 'delivery', size: o.size, full: -o.qty, empty: p.empties, note: `Order ${o.id}` })
src/lib/derive.ts:20:    const r = computeRefill(t, c.size, undefined, Date.now())
src/lib/derive.ts:21:    if (r && r.source !== 'default') (out[`${c.town}|${c.size}`] ||= []).push(r.cycleDays)
src/lib/derive.ts:28:  return computeRefill(t, c.size, area[`${c.town}|${c.size}`], Date.now())

codex
1. [src/components/charts.tsx](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/components/charts.tsx:41) — `AreaChart` computes `Math.max(...values)` without handling an empty array; empty input produces invalid SVG coordinates, and hovering can set an invalid index. Render an empty state or return early when `values` is empty.

2. [src/components/charts.tsx](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/components/charts.tsx:42) — A one point series divides by zero when calculating x coordinates. Handle a single value explicitly, centering it or using a zero denominator fallback.

3. [src/pages/owner/Dashboard.tsx](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Dashboard.tsx:26) — The “Last 30 days vs the 30 before” delivery time delta compares all deliveries from the last 30 days with the previous period, but the current filter has no upper bound. Exclude deliveries with `dayIdx >= 1` so future dated records cannot inflate the current period.

4. [src/pages/owner/Dashboard.tsx](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Dashboard.tsx:63) — App share is computed from only the first and last weekly buckets, but each bucket is just seven days and the opening claim implies an eight week trend. Label the comparison with its actual week ranges, or calculate shares across the full eight week span.

5. [src/lib/seed.ts](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/seed.ts:79) — Empty `customers` makes the failed delivery seed lookup return `undefined`, then `mk` dereferences `c.size`. Skip failed and live order generation when there are no customers, or guard those groups before indexing.
tokens used
34,341
1. [src/components/charts.tsx](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/components/charts.tsx:41) — `AreaChart` computes `Math.max(...values)` without handling an empty array; empty input produces invalid SVG coordinates, and hovering can set an invalid index. Render an empty state or return early when `values` is empty.

2. [src/components/charts.tsx](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/components/charts.tsx:42) — A one point series divides by zero when calculating x coordinates. Handle a single value explicitly, centering it or using a zero denominator fallback.

3. [src/pages/owner/Dashboard.tsx](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Dashboard.tsx:26) — The “Last 30 days vs the 30 before” delivery time delta compares all deliveries from the last 30 days with the previous period, but the current filter has no upper bound. Exclude deliveries with `dayIdx >= 1` so future dated records cannot inflate the current period.

4. [src/pages/owner/Dashboard.tsx](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Dashboard.tsx:63) — App share is computed from only the first and last weekly buckets, but each bucket is just seven days and the opening claim implies an eight week trend. Label the comparison with its actual week ranges, or calculate shares across the full eight week span.

5. [src/lib/seed.ts](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/seed.ts:79) — Empty `customers` makes the failed delivery seed lookup return `undefined`, then `mk` dereferences `c.size`. Skip failed and live order generation when there are no customers, or guard those groups before indexing.
