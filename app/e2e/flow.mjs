// End-to-end: ONE order through customer -> dispatcher -> rider -> customer -> owner. Run: npm run build && npm run preview, then npm run e2e
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import assert from 'node:assert/strict'

import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
// Use any Chromium already in the Playwright cache (avoids a fresh browser download); falls back to Playwright's own.
function findChrome() {
  const root = `${homedir()}/Library/Caches/ms-playwright`
  if (!existsSync(root)) return undefined
  for (const d of readdirSync(root).filter((x) => /^chromium-\d+$/.test(x)).sort().reverse()) {
    const p = `${root}/${d}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`
    if (existsSync(p)) return p
  }
}
const BASE = process.env.BASE ?? 'http://localhost:4173/'
const OUT = new URL('../../knowledge/design/references/e2e/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? findChrome() })
const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, serviceWorkers: 'block' })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))
let n = 0
const shot = async (name) => { await page.waitForTimeout(900); return page.screenshot({ path: `${OUT}${String(++n).padStart(2, '0')}-${name}.png` }) }
const NAMES = { customer: 'u-c1', dispatcher: 'u-d1', rider: 'u-r2', owner: 'u-owner' }
const RIDER_USER = { 'Kuya Berto': 'u-r1', 'Jun Manaois': 'u-r2', 'Mac Rosario': 'u-r3', 'Ben Dizon': 'u-r4' }
const ROLES = new Set(['customer', 'dispatcher', 'rider', 'owner'])
// Sessions are per tab (sessionStorage). Real sign-in is exercised once below; other hops seed the session directly.
const asRole = async (pg, role) => { await pg.goto(BASE); await pg.evaluate(([r, name]) => sessionStorage.setItem('fiesta-gas-session', JSON.stringify({ userId: name })), [role, NAMES[role]]) }
const asRider = async (name) => { await page.evaluate((n) => sessionStorage.setItem('fiesta-gas-session', JSON.stringify({ userId: n })), RIDER_USER[name]); await page.reload() }
const go = async (hash, w = 430) => { await page.setViewportSize({ width: w, height: 900 }); const role = hash.split('/')[1]; if (ROLES.has(role)) await asRole(page, role); await page.goto(`${BASE}#${hash}`) }
const step = (s) => console.log('•', s)

await go('/'); await page.evaluate(() => localStorage.clear()); await go('/'); await shot('landing')

step('guard: a signed-out visit to a role area is sent to sign-in')
await page.evaluate(() => sessionStorage.clear()); await page.goto(`${BASE}#/owner`); await page.waitForURL(/#\/signin/)
step('landing -> sign in page -> sign in as the dispatcher')
await go('/'); await page.getByRole('link', { name: 'Sign in to the demo' }).click(); await page.waitForURL(/#\/signin/); await shot('signin')
await page.getByRole('button', { name: /Ana Reyes/ }).click(); await page.waitForURL(/#\/dispatcher/)
await page.getByRole('link', { name: 'Switch user' }).waitFor(); await shot('signed-in-dispatcher')
await page.getByRole('link', { name: 'Switch user' }).click(); await page.waitForURL(/#\/signin/)
await page.goto(`${BASE}#/owner/team`); await page.getByText(/does not include access/).waitFor() // RBAC: a dispatcher has no Team permission

step('stock before')
await go('/owner/inventory', 1280)
const stock11 = async () => +(await page.getByTestId('stock-full-11KG').innerText()).trim()
const before = await stock11()

step('customer places an order')
await go('/customer')
await page.getByRole('button', { name: 'Place order' }).click()
await page.waitForURL(/orders/)
const id = (await page.locator('b', { hasText: /^FG-\d+$/ }).first().innerText()).trim()
assert.match(id, /^FG-\d+$/); await shot('customer-placed')

step('customer got SMS confirmation')
await page.getByRole('link', { name: 'Messages' }).click()
await page.getByText(`order ${id} received`).waitFor(); await shot('customer-sms')

step('dispatcher sees it as Placed, assigns nearest rider')
await go('/dispatcher', 1280)
const row = page.locator('tr', { hasText: id })
await row.getByText('Placed').waitFor()
await row.getByRole('button', { name: /^Assign/ }).click()
await page.locator('tr', { hasText: id }).getByText('Assigned').waitFor()
const riderName = (await page.locator('tr', { hasText: id }).locator('td').last().innerText()).replace('🛵', '').trim()
assert.ok(riderName, 'rider name shown'); await shot('dispatcher-assigned')

step(`rider ${riderName} starts and completes it`)
await go('/rider'); await asRider(riderName)
step('rider home: map first, numbered stops, Call / Navigate links')
await page.locator('.leaflet-container').waitFor()
const pickStop = async (n) => { const b = page.getByRole('button', { name: new RegExp(n) }); if (await b.count()) await b.first().click() }
await pickStop('Maria Santos')
await page.getByLabel(/^Stop \d/).first().waitFor()
assert.match(await page.getByRole('link', { name: 'Call Maria Santos' }).getAttribute('href'), /^tel:/)
assert.match(await page.getByRole('link', { name: 'Navigate to Maria Santos' }).getAttribute('href'), /google\.com\/maps/)
await page.getByRole('link', { name: 'Text Maria Santos' }).waitFor(); await shot('rider-list')
step('safety checklist gates Start delivery')
const start = page.getByRole('button', { name: /Start delivery/ })
await start.waitFor(); assert.equal(await start.isDisabled(), true)
const tickAll = async () => { const boxes = page.getByRole('checkbox'); const c = await boxes.count(); for (let i = 0; i < Math.min(c, 4); i++) if ((await boxes.nth(i).getAttribute('aria-checked')) !== 'true') await boxes.nth(i).click() }
await tickAll()
await pickStop('Maria Santos')
await start.waitFor(); assert.equal(await start.isDisabled(), false)
await start.click()
await page.getByRole('link', { name: 'Complete delivery' }).click()
await page.getByText('Complete delivery').first().waitFor(); await shot('rider-out-for-delivery')

step('customer sees delivery code')
const cust = await ctx.newPage(); await cust.setViewportSize({ width: 430, height: 900 })
await asRole(cust, 'customer'); await cust.goto(`${BASE}#/customer/orders`)
await cust.getByText('Give the rider your delivery code').waitFor()
const code = (await cust.getByText('Give the rider your delivery code').locator('b').innerText()).trim(); assert.match(code, /^\d{4}$/); await cust.close()

step('wrong code blocks, right code confirms')
await page.getByPlaceholder(/code/i).fill('0000')
assert.equal(await page.getByRole('button', { name: 'Confirm delivered' }).isDisabled(), true)
await page.getByPlaceholder(/code/i).fill(code)
step('rider: cash due shown; a shortfall needs a reason')
const cashIn = page.getByLabel('Cash received (₱)')
await page.getByText('Amount due').waitFor()
const due = +(await page.getByText('Amount due').locator('xpath=..').locator('b').innerText()).replace(/[^\d.]/g, '')
assert.ok(due > 0)
await cashIn.fill(String(due - 100))
await page.getByText(/Shortfall/).waitFor()
assert.equal(await page.getByRole('button', { name: 'Confirm delivered' }).isDisabled(), true, 'short cash without reason must block')
await page.getByLabel('Reason for shortfall').fill('Customer short, will pay next order')
assert.equal(await page.getByRole('button', { name: 'Confirm delivered' }).isDisabled(), false)
await cashIn.fill(String(due)); assert.equal(await page.getByLabel('Reason for shortfall').count(), 0, 'no reason field when paid in full')
await cashIn.fill(String(due - 100)); await page.getByLabel('Reason for shortfall').fill('Customer short, will pay next order')
await page.getByRole('button', { name: 'Confirm delivered' }).click()
await page.waitForURL(/#\/rider$/, { timeout: 8000 }); await shot('rider-done')

step('customer sees Delivered + SMS')
await go('/customer/orders')
await page.locator('[data-slot=card]', { hasText: id }).getByText('Delivered', { exact: true }).first().waitFor(); await shot('customer-delivered')

step('owner: stock dropped by exactly 1, movement logged')
await go('/owner/inventory', 1280)
assert.equal(await stock11(), before - 1)
await page.getByRole('cell', { name: `Order ${id}` }).waitFor(); await shot('owner-inventory')

step('owner: load-out panel; a count adjustment requires a reason')
await page.getByText('Rider load-out and return').waitFor()
await page.getByLabel(/^Load-out full /).first().fill('1')
await page.getByRole('button', { name: 'Record load-out' }).click()
await page.getByText('On the road').first().waitFor()
const adjFull = page.getByLabel(/^Physical full count/).first(), adjEmpty = page.getByLabel(/^Physical empty count/).first()
const adjBtn = page.getByRole('button', { name: 'Adjust' }).first()
await adjFull.fill('20'); await adjEmpty.fill('5')
assert.equal(await adjBtn.isDisabled(), true, 'adjustment without reason must block')
await page.getByLabel(/^Adjustment reason/).first().fill('Physical recount')
assert.equal(await adjBtn.isDisabled(), false); await adjBtn.click()
await page.getByText(/count adjusted/).first().waitFor(); await shot('owner-inventory-adjust')

step('owner: analytics, follow-ups, blast, remittance render with data')
await go('/owner', 1280); await page.getByText('Avg delivery time').waitFor(); await shot('owner-analytics')
await go('/owner/follow-ups', 1280); assert.ok((await page.locator('tbody tr').count()) > 0); await shot('owner-followups')
await page.locator('select[aria-label^="Outcome"]').first().selectOption('Reached')
await page.getByText('Reached').first().waitFor()
step('follow-ups: snooze removes the customer from the list')
const snz = page.locator('select[aria-label^="Snooze"]').first()
const snzName = (await snz.getAttribute('aria-label')).replace('Snooze ', '')
await snz.selectOption('1')
await page.locator(`select[aria-label="Snooze ${snzName}"]`).waitFor({ state: 'detached' })
await page.getByText(/Show \d+ snoozed or recently reordered/).waitFor(); await shot('owner-followups-snoozed')
await go('/owner/blast', 1280); await page.getByRole('button', { name: 'Send now' }).click(); await page.getByText(/Sent \(simulated\)/).waitFor(); await shot('owner-blast')
await go('/owner/remittance', 1280)
const rem = page.locator('tr', { hasText: riderName }); assert.ok((await rem.count()) === 1)
step('remittance: handover with a difference is Open until saved, then recorded')
await page.getByLabel(`Turned over ${riderName}`).fill(String(due - 100))
await rem.getByText('Open', { exact: true }).waitFor()
await page.getByLabel('Received by').fill('Ana Reyes')
await page.getByLabel(/^Reason for difference/).fill('Customer short, will pay next order')
await page.getByRole('button', { name: 'Save handover' }).click()
await page.getByText('Handover saved').first().waitFor()
await page.reload(); await page.getByLabel(`Turned over ${riderName}`).waitFor()
assert.equal(await page.getByLabel(`Turned over ${riderName}`).inputValue(), String(due - 100), 'handover persisted')
await page.getByText(/Received by Ana Reyes/).waitFor(); await shot('owner-remittance')

step('dispatcher encodes a phone order for a NEW customer')
await go('/dispatcher/new', 1280)
await page.getByRole('button', { name: 'New customer' }).click()
const f = page
await f.getByLabel('Name').fill('Test Customer'); await f.getByLabel('Mobile number').fill('0917 000 0000'); await f.getByLabel('Street / purok').fill('Purok 9')
await page.locator('.map').click({ position: { x: 300, y: 120 } })
await page.getByRole('button', { name: 'Create order' }).click()
await page.waitForURL(/#\/dispatcher$/); await page.getByText('Test Customer').first().waitFor(); await shot('dispatcher-new-order')

step('NewOrder warns on a duplicate active order')
await go('/dispatcher/new', 1280)
await page.getByLabel(/^Search name/).fill('Test Customer')
await page.getByRole('button', { name: /^Test Customer/ }).click()
await page.getByRole('alert').getByText(/already has an active order/).waitFor()
const mk = page.getByRole('button', { name: 'Create order' })
assert.equal(await mk.isDisabled(), true, 'duplicate must be acknowledged')
await page.getByLabel('This is a separate order').check(); assert.equal(await mk.isDisabled(), false); await shot('dispatcher-duplicate-warning')

step('failed delivery stays on the board with a next attempt')
await go('/dispatcher', 1280)
const row2 = page.locator('tr', { hasText: 'Test Customer' }).first()
await row2.getByRole('button', { name: /^Assign/ }).click()
await page.locator('tr', { hasText: 'Test Customer' }).first().getByText('Assigned').waitFor()
const rider2 = (await page.locator('tr', { hasText: 'Test Customer' }).first().locator('td').last().innerText()).replace('🛵', '').trim()
await go('/rider'); await asRider(rider2)
await tickAll()
await pickStop('Test Customer')
await page.getByRole('button', { name: /Start delivery/ }).click()
await page.getByRole('link', { name: 'Complete delivery' }).click()
await page.getByText('Complete delivery').first().waitFor()
await page.getByLabel("Can't deliver?").selectOption({ index: 1 })
await page.getByRole('checkbox', { name: 'I contacted the customer' }).click()
await page.getByLabel('Next attempt').selectOption({ index: 1 })
await page.getByRole('button', { name: 'Mark delivery failed' }).click()
await page.waitForURL(/#\/rider$/, { timeout: 8000 })
await go('/dispatcher', 1280)
const failed = page.locator('tr', { hasText: 'Test Customer' }).first()
await failed.getByText('Failed').first().waitFor()
await failed.getByText(/Next attempt/).waitFor(); await failed.getByText(/customer contacted/).waitFor()
await failed.getByRole('button', { name: /^Requeue/ }).waitFor(); await shot('dispatcher-failed-next-attempt')

step('owner registers a branch, creates a role, adds a person scoped to it')
await go('/owner', 1280); await page.goto(`${BASE}#/owner/branches`)
await page.getByLabel('Branch name').fill('Urdaneta Depot'); await page.getByLabel('Town or city').fill('Urdaneta City')
await page.getByRole('button', { name: 'Register branch' }).click(); await page.getByRole('cell', { name: /Urdaneta Depot/ }).first().waitFor(); await shot('owner-branches')
await page.goto(`${BASE}#/owner/team`); await page.getByRole('button', { name: 'Roles and permissions' }).click()
await page.getByLabel('Role name').last().fill('Cashier')
for (const p of ['View cash', 'Record cash']) await page.getByRole('checkbox', { name: new RegExp(`^${p}`) }).last().click()
await page.getByRole('button', { name: 'Create role' }).click(); await page.getByText('Cashier').first().waitFor()
await page.getByRole('button', { name: 'People' }).click()
await page.getByLabel('Name', { exact: true }).fill('Cora Cashier'); await page.locator('select').last().selectOption({ label: 'Cashier' })
await page.getByRole('button', { name: /^Branch access/ }).last().click(); await page.getByRole('checkbox', { name: /Urdaneta Depot/ }).last().click(); await page.getByRole('button', { name: 'Done' }).click()
await page.getByRole('button', { name: 'Add person' }).click(); await page.getByText('Cora Cashier').first().waitFor(); await shot('owner-team')
step('the cashier signs in: sees only cash, not stock or team')
await page.getByRole('link', { name: 'Switch user' }).click(); await page.waitForURL(/#\/signin/)
await page.getByRole('button', { name: /Cora Cashier/ }).click(); await page.waitForURL(/#\/owner\/remittance/)
assert.equal(await page.getByRole('link', { name: 'Inventory' }).count(), 0, 'cashier has no inventory nav')
assert.equal(await page.getByRole('link', { name: 'Team and roles' }).count(), 0, 'cashier has no team nav')
await page.goto(`${BASE}#/owner/inventory`); await page.getByText(/does not include access/).waitFor()
step('a Dagupan dispatcher cannot see the Alaminos branch')
await go('/dispatcher', 1280); assert.equal(await page.getByText('Alaminos').count(), 0, 'Alaminos hidden from the Dagupan dispatcher')

step('console clean')
assert.deepEqual(errors, [], 'console errors: ' + errors.join('\n'))
await browser.close()
console.log('E2E PASS, order', id)
