import { useState } from 'react'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChartCard, Kpi } from '@/components/charts'
import { Pill } from '@/components/ui'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ago, avg, byId, delivered, followUpIndicator, followUpState, mins, peso, pricingOf, refillRows, thresholdOf } from '../../lib/derive'
import { SIZES } from '../../lib/types'
import { DAY } from '../../lib/refill'
import { setBranch, useAuth, useScopedDB } from '@/lib/auth'

const pct = (cur: number, prev: number) => (prev ? ((cur - prev) / prev) * 100 : undefined)
const SLOW = 10 // minutes above the overall average that flags a rider or town
const num = 'text-right tabular-nums'

export default function Dashboard() {
  const d = useScopedDB()
  const auth = useAuth()
  const [by, setBy] = useState<'rider' | 'town'>('rider')
  const today = new Date().setHours(0, 0, 0, 0)
  const dayIdx = (t: number) => Math.floor((t - today) / DAY) // 0 = today, -1 = yesterday
  const real = d.orders.filter((o) => o.status !== 'Cancelled')
  const done = delivered(d)
  const dTime = (o: (typeof done)[number]) => mins(o.placedAt, o.deliveredAt!)
  const townOf = (id: string) => byId(d.customers, id)!.town

  const win = (from: number, to: number) => real.filter((o) => dayIdx(o.placedAt) >= from && dayIdx(o.placedAt) < to)
  const cur = win(-29, 1), prev = win(-59, -29)
  const revCur = cur.reduce((a, o) => a + o.amount, 0), revPrev = prev.reduce((a, o) => a + o.amount, 0)
  const inWin = (from: number, to: number) => done.filter((o) => dayIdx(o.placedAt) >= from && dayIdx(o.placedAt) < to).map(dTime)
  const doneCur = done.filter((o) => dayIdx(o.placedAt) >= -29)
  const failedCur = d.orders.filter((o) => o.status === 'Failed' && dayIdx(o.placedAt) >= -29)
  const dtCur = avg(inWin(-29, 1)), dtPrev = avg(inWin(-59, -29))

  const rows = refillRows(d)
  const mult = rows.filter((x) => x.r && x.r.source !== 'default')
  const withOrders = rows.filter((x) => x.r).length
  const due = rows.filter((x) => x.r && x.r.status !== 'ok')
  const callAll = [...due].sort((a, b) => a.r!.daysUntil - b.r!.daysUntil).map((x) => ({ ...x, st: followUpState(d, x.c.id) }))
  const active = callAll.filter((x) => !x.st.snoozed && !x.st.reorderedSinceContact) // same filter as the call list
  const toCall = active
  const overdue = toCall.filter((x) => x.r!.status === 'overdue')
  const callList = active.slice(0, 6)
  const ind = followUpIndicator(d, Date.now() - 30 * DAY, Date.now() + 1)

  // Money, kept apart: order value is what was ordered; cash, e-wallet and deposits are what was recorded on delivery.
  const doneWin = done.filter((o) => dayIdx(o.deliveredAt ?? o.placedAt) >= -29)
  const cashCur = doneWin.filter((o) => o.payment === 'cod').reduce((a, o) => a + (o.cashCollected ?? o.amount), 0)
  const walletCur = doneWin.filter((o) => o.payment !== 'cod').reduce((a, o) => a + o.amount, 0)
  const depositCur = doneWin.filter((o) => o.type === 'new').reduce((a, o) => a + pricingOf(d, o.branchId).deposit[o.size] * o.qty, 0)
  const lowStock = Object.keys(d.stocks).flatMap((b) => SIZES.filter((s) => d.stocks[b].full[s] <= thresholdOf(d, b, s)).map((s) => ({ b, s, full: d.stocks[b].full[s], at: thresholdOf(d, b, s) })))
  const bname = (id: string) => d.branches.find((x) => x.id === id)?.name ?? id
  // One row per branch in view, for the comparison table.
  const perBranch = Object.keys(d.stocks).map((b) => {
    const os = cur.filter((o) => o.branchId === b), dl = doneCur.filter((o) => o.branchId === b)
    return { b, orders: os.length, value: os.reduce((a, o) => a + o.amount, 0), time: avg(dl.map(dTime)), failed: failedCur.filter((o) => o.branchId === b).length, low: lowStock.filter((x) => x.b === b).length, riders: d.riders.filter((r) => r.branchId === b).length }
  })

  // Delivery performance: per rider or per customer town, with sample size and gap to the overall average.
  const overall = avg(doneCur.map(dTime))
  const keyOf = (o: (typeof done)[number]) => (by === 'rider' ? byId(d.riders, o.riderId)?.name ?? '?' : townOf(o.customerId))
  const perf = Object.entries(doneCur.reduce<Record<string, number[]>>((m, o) => ((m[keyOf(o)] ||= []).push(dTime(o)), m), {}))
    .map(([name, v]) => ({ name, n: v.length, a: avg(v), failed: failedCur.filter((o) => (by === 'rider' ? byId(d.riders, o.riderId)?.name === name : townOf(o.customerId) === name)).length }))
    .sort((x, y) => y.a - x.a)

  // Promo: order rate in the 7 days after a blast vs customers who were not messaged, same window.
  const blasts = d.blasts.map((b) => {
    const ordered = (id: string) => real.some((o) => o.customerId === id && o.placedAt > b.at && o.placedAt < b.at + 7 * DAY)
    const hit = b.recipients.filter(ordered).length
    const others = d.customers.filter((c) => c.promoConsent && !b.recipients.includes(c.id)) // same eligibility, just not messaged
    const rate = b.recipients.length ? hit / b.recipients.length : undefined, base = others.length ? others.filter((c) => ordered(c.id)).length / others.length : undefined
    return { b, hit, rate, base, nOthers: others.length }
  })

  // Chart data
  const daily = Array.from({ length: 30 }, (_, k) => { const i = k - 29; const os = real.filter((o) => dayIdx(o.placedAt) === i); return { day: new Date(today + i * DAY).toLocaleDateString([], { month: 'short', day: 'numeric' }), orders: os.length, value: os.reduce((a, o) => a + o.amount, 0) } })
  const weekly = Array.from({ length: 8 }, (_, k) => { const from = (k - 7) * 7 - 0; const os = real.filter((o) => dayIdx(o.placedAt) >= from - 6 && dayIdx(o.placedAt) <= from); return { week: new Date(today + from * DAY).toLocaleDateString([], { month: 'short', day: 'numeric' }), app: os.filter((o) => o.channel === 'app').length, staff: os.filter((o) => o.channel !== 'app').length } })
  const ordersCfg = { orders: { label: 'Orders', color: 'var(--chart-1)' } } satisfies ChartConfig
  const channelCfg = { app: { label: 'Customer app', color: 'var(--chart-1)' }, staff: { label: 'Staff-encoded (call, text, walk-in)', color: 'var(--chart-4)' } } satisfies ChartConfig
  const timeCfg = { a: { label: 'Avg minutes', color: 'var(--chart-1)' } } satisfies ChartConfig

  const reasons = Object.entries(failedCur.filter((o) => o.failReason).reduce<Record<string, number>>((m, o) => ((m[o.failReason!] = (m[o.failReason!] ?? 0) + 1), m), {})).sort((a, b) => b[1] - a[1])
  const failedTotal = reasons.reduce((a, [, n]) => a + n, 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="page-title">Business overview{auth.scope.length > 1 && <span className="font-normal text-muted-foreground"> · {auth.pick === 'all' ? 'All branches' : auth.d.branches.find((b) => b.id === auth.pick)?.name}</span>}</h1>
        <p className="meta">Last 30 days vs the 30 before</p>
        {auth.scope.length > 1 && (
          <div role="tablist" aria-label="Branch" className="mt-3 flex flex-wrap gap-2">
            {[['all', 'All branches'] as const, ...auth.scope.map((id) => [id, auth.d.branches.find((b) => b.id === id)?.name ?? id] as const)].slice(0, auth.scope.length > 5 ? 1 : undefined).map(([id, name]) => (
              <Button key={id} role="tab" aria-selected={auth.pick === id} size="sm" variant={auth.pick === id ? 'default' : 'outline'} onClick={() => setBranch(id)}>{name}</Button>))}
            {auth.scope.length > 5 && <NativeSelect aria-label="Pick a branch" className="w-52" value={auth.pick} onChange={(e) => setBranch(e.target.value)}><option value="all">Choose a branch…</option>{auth.scope.map((id) => <option key={id} value={id}>{auth.d.branches.find((b) => b.id === id)?.name}</option>)}</NativeSelect>}
          </div>)}
      </div>

      {lowStock.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Low stock</AlertTitle>
          <AlertDescription className="tabular-nums">
            {lowStock.map((x) => `${perBranch.length > 1 ? `${bname(x.b)} ${x.s}` : x.s}: ${x.full} full (alert at ${x.at})`).join(' · ')}.{' '}
            <Link to="/owner/inventory" className="font-medium underline underline-offset-4">Open inventory</Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        <Kpi label="Orders" value={String(cur.length)} sub="vs prior 30 days" delta={pct(cur.length, prev.length)} />
        <Kpi label="Order value" value={peso(revCur)} sub="ordered, not cash received" delta={pct(revCur, revPrev)} />
        <Kpi label="Cash collected" value={peso(cashCur)} sub="COD recorded on delivery" />
        <Kpi label="E-wallet recorded" value={peso(walletCur)} sub="GCash / Maya, recorded not verified" />
        <Kpi label="Deposits" value={peso(depositCur)} sub="estimate, new cylinders delivered" />
        <Kpi label="Avg delivery time" value={`${Math.round(dtCur)} min`} sub="placed → delivered" delta={pct(dtCur, dtPrev)} good="down" />
        <Kpi label="Repeat rate" value={`${Math.round((mult.length / Math.max(1, withOrders)) * 100)}%`} sub={mult.length ? `avg refill every ${Math.round(avg(mult.map((x) => x.r!.cycleDays)))} days` : 'no repeat customers yet'} />
        <Link to="/owner/follow-ups" className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Kpi label="Customers to call" value={String(toCall.length)} sub={`${overdue.length} overdue · ${toCall.length - overdue.length} due soon`} className="h-full" />
        </Link>
      </div>

      {perBranch.length > 1 && (
        <ChartCard title="Branch comparison" sub="Last 30 days. Click a branch name to see its full analytics.">
          <Table stack>
            <TableHeader><TableRow><TableHead>Branch</TableHead><TableHead className={num}>Orders</TableHead><TableHead className={num}>Order value</TableHead><TableHead className={num}>Avg delivery</TableHead><TableHead className={num}>Failed</TableHead><TableHead className={num}>Riders</TableHead><TableHead className={num}>Low stock</TableHead></TableRow></TableHeader>
            <TableBody>
              {perBranch.map((x) => (
                <TableRow key={x.b}>
                  <TableCell className="font-medium"><button type="button" className="underline-offset-4 hover:underline" aria-label={`View ${bname(x.b)} only`} onClick={() => setBranch(x.b)}>{bname(x.b)}</button></TableCell><TableCell className={num}>{x.orders}</TableCell><TableCell className={num}>{peso(x.value)}</TableCell>
                  <TableCell className={num}>{x.time ? `${Math.round(x.time)} min` : '—'}</TableCell><TableCell className={num}>{x.failed}</TableCell><TableCell className={num}>{x.riders}</TableCell>
                  <TableCell className={cn(num, x.low ? 'font-medium text-destructive' : 'text-muted-foreground')}>{x.low || '—'}</TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </ChartCard>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <ChartCard title="Orders per day" sub="Last 30 days, excluding cancelled">
          <ChartContainer config={ordersCfg} className="h-56 w-full">
            <AreaChart data={daily} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} interval={4} />
              <YAxis width={28} tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area dataKey="orders" type="monotone" stroke="var(--color-orders)" fill="var(--color-orders)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>
        <ChartCard title="Average delivery time" sub={`Minutes from order to delivery, by ${by}. Line = overall average (${Math.round(overall)} min).`}>
          <ChartContainer config={timeCfg} className="h-56 w-full">
            <BarChart data={perf.map((p) => ({ name: p.name, a: Math.round(p.a) }))} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 11 }} />
              <YAxis width={28} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={Math.round(overall)} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
              <Bar dataKey="a" fill="var(--color-a)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
      <ChartCard title="Customer app vs staff-encoded orders" sub="Weekly, last 8 weeks. A rising app share means less manual entry for staff.">
        <ChartContainer config={channelCfg} className="h-56 w-full">
          <BarChart data={weekly} margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <YAxis width={28} tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="app" stackId="c" fill="var(--color-app)" />
            <Bar dataKey="staff" stackId="c" fill="var(--color-staff)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="grid gap-4">
        <ChartCard title="Delivery time" sub={`Overall average ${Math.round(overall)} min. Flagged = ${SLOW}+ min slower than average.`}>
          <div className="mb-3 flex gap-2">
            {(['rider', 'town'] as const).map((k) => <Button key={k} size="sm" variant={by === k ? 'default' : 'outline'} aria-pressed={by === k} onClick={() => setBy(k)}>By {k}</Button>)}
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>{by === 'rider' ? 'Rider' : 'Town'}</TableHead><TableHead className={num}>Deliveries</TableHead><TableHead className={num}>Failed</TableHead><TableHead className={num}>Avg min</TableHead><TableHead className={num}>vs avg</TableHead></TableRow></TableHeader>
            <TableBody>
              {perf.map((p) => {
                const gap = Math.round(p.a - overall), slow = gap >= SLOW
                return (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}{slow && <Pill tone="danger" className="ml-2">Slow</Pill>}</TableCell>
                    <TableCell className={num}>{p.n}</TableCell><TableCell className={num}>{p.failed}</TableCell>
                    <TableCell className={cn(num, 'font-medium')}>{Math.round(p.a)}</TableCell>
                    <TableCell className={cn(num, slow ? 'font-medium text-destructive' : gap <= -SLOW ? 'font-medium text-success' : 'text-muted-foreground')}>{gap > 0 ? '+' : ''}{gap}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ChartCard>
        <ChartCard title="Failed deliveries" sub={failedTotal ? `${failedTotal} failed in the last 30 days. Most common reason: ${reasons[0][0]}.` : 'No failed deliveries.'}>
          <Table>
            <TableHeader><TableRow><TableHead>Reason</TableHead><TableHead className={num}>Count</TableHead><TableHead className={num}>Share</TableHead></TableRow></TableHeader>
            <TableBody>
              {reasons.map(([k, n]) => <TableRow key={k}><TableCell className="font-medium">{k}</TableCell><TableCell className={num}>{n}</TableCell><TableCell className={cn(num, 'text-muted-foreground')}>{Math.round((n / failedTotal) * 100)}%</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </ChartCard>
        </div>
        <ChartCard title="Who to call first" sub={ind.contacted ? `${ind.orderedWithin7Days} of ${ind.contacted} customers contacted in the last 30 days ordered within 7 days of contact. An indicator, not proof the call caused it.` : 'No follow-up calls logged yet.'}>
          <Table>
            <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead className={num}>Last order</TableHead><TableHead className={num}>Overdue</TableHead></TableRow></TableHeader>
            <TableBody>
              {callList.map(({ c, r, st }) => {
                const f = st.last, late = Math.round(-r!.daysUntil)
                return (
                  <TableRow key={c.id}>
                    <TableCell><span className="font-medium">{c.name}</span><div className="meta">{c.town} · {f ? `${f.outcome}, ${ago(f.at)}` : 'not called'}</div></TableCell>
                    <TableCell className={num}>{ago(r!.expectedNext - r!.cycleDays * DAY)}</TableCell>
                    <TableCell className={cn(num, late > 0 ? 'font-medium text-destructive' : 'text-muted-foreground')}>{late > 0 ? `${late} days` : late === 0 ? 'today' : `in ${-late} days`}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <Link to="/owner/follow-ups" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline">All {active.length} customers to call<ArrowRight className="size-4" /></Link>
        </ChartCard>
      </div>

      <div className="grid gap-4">
        <ChartCard title="Simulated order activity after blast" sub="Simulated data. Order rate in the 7 days after a blast vs consenting customers not messaged. Not causal proof that the blast drove orders.">
          {blasts.length ? (
            <Table stack>
              <TableHeader><TableRow><TableHead>Blast</TableHead><TableHead className={num}>Sent</TableHead><TableHead className={num}>Ordered</TableHead><TableHead className={num}>Not messaged</TableHead><TableHead className={num}>Difference</TableHead></TableRow></TableHeader>
              <TableBody>
                {blasts.map(({ b, hit, rate, base, nOthers }) => (
                  <TableRow key={b.id}>
                    <TableCell><span className="font-medium">{b.segment}</span><div className="text-xs text-muted-foreground">{ago(b.at)} · {b.recipients.length} recipients</div></TableCell>
                    <TableCell className={num}>{b.recipients.length}</TableCell>
                    <TableCell className={num}>{rate === undefined ? '—' : `${hit} · ${Math.round(rate * 100)}%`}</TableCell>
                    <TableCell className={cn(num, 'text-muted-foreground')}>{base === undefined ? '—' : `${Math.round(base * 100)}%`}<div className="text-xs">{nOthers} customers</div></TableCell>
                    <TableCell className={cn(num, 'font-medium', rate === undefined || base === undefined ? 'text-muted-foreground' : rate > base ? 'text-success' : 'text-destructive')}>{rate === undefined || base === undefined ? '—' : `${rate >= base ? '+' : ''}${Math.round((rate - base) * 100)} pts`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : <p className="text-sm text-muted-foreground">No blasts sent yet.</p>}
        </ChartCard>
      </div>
    </div>
  )
}
