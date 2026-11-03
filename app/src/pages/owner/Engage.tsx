import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { HealthBadge, Pill } from '@/components/ui'
import { Field } from '../../components/ui'
import { TOWNS } from '../../lib/geo'
import { toast } from 'sonner'
import { ago, byId, dayKey, delivered, followUpIndicator, followUpState, ordersOf, peso, refillRows } from '../../lib/derive'
import { DAY } from '../../lib/refill'
import { actions } from '../../lib/store'
import { useScopedDB } from '@/lib/auth'
import { SIZES, type FollowUpLossReason, type Outcome } from '../../lib/types'

const OUTCOMES: Outcome[] = ['Reached', 'Ordered', 'Switched supplier', 'Not interested', 'Call back later']
const LOST: Outcome[] = ['Switched supplier', 'Not interested']
const LOSS_REASONS: FollowUpLossReason[] = ['Switched supplier', 'Price', 'Not due', 'No response', 'Other']
const SNOOZE_DAYS = [1, 3, 7]
const dateFmt = (t: number) => new Date(t).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
const run = (fn: () => void) => { try { fn() } catch (e) { toast.error((e as Error).message) } }

function OutcomeCell({ id, name }: { id: string; name: string }) {
  const [outcome, setOutcome] = useState<Outcome | ''>('')
  const [callback, setCallback] = useState('')
  const [reason, setReason] = useState<FollowUpLossReason | ''>('')
  const needsDate = outcome === 'Call back later', needsReason = !!outcome && LOST.includes(outcome)
  // 9:00 on the chosen day; if that has already passed (today), default to one hour from now.
  const at9 = callback ? new Date(`${callback}T09:00`).getTime() : 0
  const callbackAt = at9 && at9 <= Date.now() && callback === new Date().toLocaleDateString('en-CA') ? Date.now() + 3600_000 : at9
  const ready = needsDate ? callbackAt > Date.now() : needsReason ? !!reason : false
  const reset = () => { setOutcome(''); setCallback(''); setReason('') }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <NativeSelect size="sm" aria-label={`Outcome ${name}`} value={outcome} onChange={(e) => {
        const o = e.target.value as Outcome | ''
        if (o && !LOST.includes(o) && o !== 'Call back later') { run(() => actions.logFollowUp(id, o)); reset() } else setOutcome(o)
      }}>
        <option value="">Log call…</option>{OUTCOMES.map((o) => <option key={o}>{o}</option>)}
      </NativeSelect>
      {needsDate && <Input type="date" className="h-8 w-40" aria-label={`Callback date ${name}`} min={dayKey(Date.now())} value={callback} onChange={(e) => setCallback(e.target.value)} />}
      {needsReason && (
        <NativeSelect size="sm" aria-label={`Lost reason ${name}`} value={reason} onChange={(e) => setReason(e.target.value as FollowUpLossReason)}>
          <option value="">Lost reason…</option>{LOSS_REASONS.map((r) => <option key={r}>{r}</option>)}
        </NativeSelect>
      )}
      {(needsDate || needsReason) && (
        <Button size="sm" disabled={!ready} onClick={() => { run(() => actions.logFollowUp(id, outcome as Outcome, needsDate ? { callbackAt } : { lostReason: reason as FollowUpLossReason })); reset() }}>Save outcome</Button>
      )}
    </div>
  )
}

export function FollowUps() {
  const d = useScopedDB()
  const [showHidden, setShowHidden] = useState(false)
  const now = Date.now()
  const all = refillRows(d).filter((x) => x.r && (x.r.status === 'due' || x.r.status === 'overdue')).sort((a, b) => a.r!.daysUntil - b.r!.daysUntil)
  const withState = all.map((x) => ({ ...x, st: followUpState(d, x.c.id, now) }))
  const hidden = withState.filter((x) => x.st.snoozed || x.st.reorderedSinceContact)
  const list = showHidden ? withState : withState.filter((x) => !x.st.snoozed && !x.st.reorderedSinceContact)
  const from = now - 30 * DAY
  const ind = followUpIndicator(d, from, now + 1)
  const lastOrder = (id: string) => ordersOf(d, id).find((o) => o.status !== 'Cancelled')
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="page-title">Daily follow-up list</h1>
          <p className="meta">Customers whose expected refill date is near or past (3-day grace). Reminders are simulated SMS. Recently reordered and snoozed customers are hidden.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone="success" className="tabular-nums">{ind.orderedWithin7Days} Ordered within 7 days of contact</Pill>
          <Pill tone="neutral" className="tabular-nums">{ind.notOrdered} Not ordered within 7 days</Pill>
          {ind.pending > 0 && <Pill tone="neutral" className="tabular-nums">{ind.pending} Still within 7 days</Pill>}
        </div>
      </div>
      <p className="meta">Contacts from {dateFmt(from)} to {dateFmt(now)}. This is an indicator only; it does not show the call caused the order.</p>
      <Card>
        <CardContent className="overflow-x-auto">
          {hidden.length > 0 && <label className="mb-3 flex items-center gap-2 text-sm font-medium"><Checkbox checked={showHidden} onCheckedChange={(v) => setShowHidden(v === true)} />Show {hidden.length} snoozed or recently reordered</label>}
          <Table stack>
            <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Last order</TableHead><TableHead>Status</TableHead><TableHead>Last contact</TableHead><TableHead>Log outcome</TableHead></TableRow></TableHeader>
            <TableBody>
              {list.map(({ c, r, st }) => { const f = st.last, lo = lastOrder(c.id); return (
                <TableRow key={c.id}>
                  <TableCell className="whitespace-normal"><span className="font-medium">{c.name}</span><div className="text-sm text-muted-foreground">{c.barangay}, {c.town} · <a className="underline-offset-4 hover:underline" href={`tel:${c.phone}`}>{c.phone}</a></div></TableCell>
                  <TableCell className="tabular-nums">{lo ? <>{dateFmt(lo.placedAt)}<div className="text-sm text-muted-foreground">{lo.qty} × {lo.size} · {peso(lo.amount)}</div></> : <span className="text-muted-foreground">none</span>}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {r!.status === 'overdue' ? <Pill tone="danger">overdue {Math.round(-r!.daysUntil)}d</Pill> : <HealthBadge s="due" />}
                      {st.snoozed && <Pill tone="neutral">Snoozed to {dateFmt(st.snoozedUntil!)}</Pill>}
                      {st.reorderedSinceContact && <Pill tone="success">Reordered</Pill>}
                    </div>
                    <div className="meta tabular-nums">~{Math.round(r!.cycleDays)} d cycle</div>
                  </TableCell>
                  <TableCell className="whitespace-normal">{f ? <>{f.outcome}<div className="text-sm text-muted-foreground">{ago(f.at)}</div>{st.callbackAt && <div className="text-sm tabular-nums">Callback {dateFmt(st.callbackAt)}</div>}{f.lostReason && <div className="text-sm text-muted-foreground">Reason: {f.lostReason}</div>}</> : <span className="text-muted-foreground">none</span>}</TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="grid gap-2">
                      <OutcomeCell id={c.id} name={c.name} />
                      <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => actions.sendReminder(c.id)}>Send reminder SMS</Button>
                        <NativeSelect size="sm" aria-label={`Snooze ${c.name}`} value="" onChange={(e) => e.target.value && run(() => actions.snoozeFollowUp(c.id, Date.now() + +e.target.value * DAY))}>
                          <option value="">Snooze…</option>{SNOOZE_DAYS.map((n) => <option key={n} value={n}>{n} {n === 1 ? 'day' : 'days'}</option>)}
                        </NativeSelect>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>) })}
            </TableBody>
          </Table>
          {!list.length && <p className="py-8 text-center text-sm text-muted-foreground"><b className="block text-foreground">Nobody is due.</b>Every customer is inside their refill cycle, snoozed or already reordered.</p>}
        </CardContent>
      </Card>
    </div>
  )
}

const TEMPLATES = ['Fiesta Gas promo: free delivery this weekend on any refill! Order here: fiestagas.example/order', 'Fiesta Gas: ₱30 off your next 11kg refill until Sunday. Order here: fiestagas.example/order', 'Fiesta Gas: It may be time for your next refill. Order in one minute: fiestagas.example/order']

export function Blast() {
  const d = useScopedDB()
  const [tw, setTw] = useState(''); const [sz, setSz] = useState(''); const [overdue, setOverdue] = useState(false); const [min, setMin] = useState(0)
  const [msg, setMsg] = useState(TEMPLATES[0]); const [sent, setSent] = useState(false)
  const rows = useMemo(() => refillRows(d), [d])
  const seg = rows.filter(({ c, r }) => (!tw || c.town === tw) && (!sz || c.size === sz) && (!overdue || r?.status === 'overdue') &&
    delivered(d).filter((o) => o.customerId === c.id).length >= min)
  const to = seg.filter(({ c }) => c.promoConsent)
  const label = [tw || 'All towns', sz || 'all sizes', overdue && 'overdue only', min && `${min}+ orders`, 'consented'].filter(Boolean).join(' · ')
  const full = `${msg} Reply STOP to opt out.`
  return (
    <div className="grid gap-4">
      <h1 className="page-title">SMS text blast</h1>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader><CardTitle>Audience and message</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Town"><NativeSelect value={tw} onChange={(e) => setTw(e.target.value)}><option value="">All</option>{TOWNS.map((t) => <option key={t.name}>{t.name}</option>)}</NativeSelect></Field>
              <Field label="Cylinder size"><NativeSelect value={sz} onChange={(e) => setSz(e.target.value)}><option value="">All</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</NativeSelect></Field>
              <Field label="Min. orders"><Input type="number" min={0} value={min} onChange={(e) => setMin(+e.target.value || 0)} /></Field>
              <label className="flex items-center gap-2 self-end pb-1.5 text-sm font-medium"><Checkbox checked={overdue} onCheckedChange={(v) => setOverdue(v === true)} />Overdue only</label>
            </div>
            <Field label="Saved templates"><span className="flex flex-wrap gap-2">{TEMPLATES.map((t, i) => <Button key={t} type="button" size="sm" variant={msg === t ? 'default' : 'outline'} onClick={() => setMsg(t)}>Template {i + 1}</Button>)}</span></Field>
            <Field label="Message"><Textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
            <p className="text-sm text-muted-foreground">Opt-out text is added automatically. Only customers who consented to promos are included ({seg.length - to.length} excluded).</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold tabular-nums">{to.length} recipients</span><span className="meta tabular-nums">≈ ₱{(to.length * d.pricing.base.smsCost).toFixed(2)} at ₱{d.pricing.base.smsCost}/SMS</span>
              <Button className="ml-auto" disabled={!to.length || !msg.trim() || sent} onClick={() => { actions.sendBlast(full, label, to.map((x) => x.c.id)); setSent(true); setTimeout(() => setSent(false), 2500) }}>Send now</Button>
            </div>
            {sent && <p role="status" className="text-sm text-success">Sent (simulated). Check the report on the right.</p>}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <Card><CardHeader><CardTitle>Preview</CardTitle></CardHeader><CardContent><p className="rounded-lg border border-border bg-muted p-3 text-sm">{full}</p></CardContent></Card>
          <Card>
            <CardHeader><CardTitle>Blast history</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              {d.blasts.map((b) => {
                const n = d.orders.filter((o) => b.recipients.includes(o.customerId) && o.placedAt > b.at && o.placedAt < b.at + 7 * DAY).length
                return <div key={b.id} className="border-b border-border/70 pb-3 last:border-0 last:pb-0"><span className="font-medium">{b.segment}</span><div className="meta tabular-nums">{ago(b.at)} · delivered to {b.recipients.length} · {n} orders within 7 days</div></div> })}
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Customers: {rows.length}. Example recipient: {to[0] ? byId(d.customers, to[0].c.id)!.name : '—'}.</p>
    </div>
  )
}
