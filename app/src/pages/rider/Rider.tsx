import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, Camera, CheckCircle2, MapPin, MapPinned, MessageSquare, Minus, Navigation, Phone, Plus, ShieldCheck } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { MapView } from '../../components/MapView'
import { Field, StatusPill } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { activeStops, byId, dayKey, depotOf, loadoutRecon, ordersForRemit, peso, remitSnapshot, remitTotals } from '../../lib/derive'
import { actions, OTP, useDB } from '../../lib/store'
import { useAuth } from '@/lib/auth'
import { SIZES, type Order } from '../../lib/types'

const CHECKS = ['Valve and hose checked on every cylinder', 'No leak smell on the truck / motorcycle', 'Cylinders strapped upright', 'Phone charged and GPS on']
const H1 = 'page-title'
const BIG = 'h-12 w-full text-base font-medium'

const mapsUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
const ckKey = (rid: string) => `fg-rider-checklist-${rid}-${dayKey(Date.now())}`
/** Checklist progress is kept per rider per day so the Start lock survives moving between screens. */
function useChecklist(rid: string) {
  const read = () => { try { const v = JSON.parse(sessionStorage.getItem(ckKey(rid)) ?? 'null'); if (Array.isArray(v) && v.length === CHECKS.length) return v.map(Boolean) as boolean[] } catch { /* ignore */ } return CHECKS.map(() => false) }
  const [checks, setChecks] = useState<boolean[]>(read)
  useEffect(() => { setChecks(read()) }, [rid]) // eslint-disable-line react-hooks/exhaustive-deps
  const set = (v: boolean[]) => { setChecks(v); try { sessionStorage.setItem(ckKey(rid), JSON.stringify(v)) } catch { /* ignore */ } }
  return [checks, set] as const
}

const ACT = 'h-11 min-w-0 flex-1 text-sm'
const clock = (t?: number) => (t ? new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '')
const payLabel = (o: Pick<Order, 'payment' | 'amount'>) => (o.payment === 'cod' ? `Collect ${peso(o.amount)}` : `${o.payment.toUpperCase()} ${peso(o.amount)} (paid)`)

/** The signed-in rider (demo accounts are matched by name). */
function useRiderId() {
  return useAuth().user?.riderId ?? ''
}

export function Jobs() {
  const d = useDB()
  const rid = useRiderId()
  const [checks, setChecks] = useChecklist(rid)
  const [sel, setSel] = useState<string>()
  const all = activeStops(d, rid)
  const stops = [...all.filter((o) => o.status === 'Out for delivery'), ...all.filter((o) => o.status === 'Assigned')]
  const assigned = stops.filter((o) => o.status === 'Assigned')
  const t = remitTotals(d, rid, dayKey(Date.now()))
  const allChecked = checks.every(Boolean)
  const depot = depotOf(d, d.riders.find((x) => x.id === rid)?.branchId)
  const nextId = stops[0]?.id
  const activeId = stops.some((o) => o.id === sel) ? sel : nextId
  const o = stops.find((x) => x.id === activeId)
  const i = o ? stops.indexOf(o) : -1
  const c = o && byId(d.customers, o.customerId)
  const move = (dir: -1 | 1) => {
    const ids = assigned.map((x) => x.id); const a = ids.indexOf(o!.id); const j = a + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[a], ids[j]] = [ids[j], ids[a]]
    try { actions.reorderStops(rid, [...stops.filter((x) => x.status !== 'Assigned').map((x) => x.id), ...ids]) } catch (e) { toast((e as Error).message) }
  }
  const pins = stops.map((x, k) => { const cc = byId(d.customers, x.customerId)!; return { id: x.id, lat: cc.lat, lng: cc.lng, label: `${k + 1}. ${cc.name}`, color: 'var(--primary)', n: k + 1, active: x.id === activeId } })
  const route = useMemo<[number, number][]>(() => [[depot.lat, depot.lng], ...pins.map((p) => [p.lat, p.lng] as [number, number])], [pins]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        {([['To deliver', stops.length], ['Delivered', t.deliveries], ['Cash to turn over', peso(t.expectedCash)]] as const).map(([k, v]) => (
          <div key={k} className="rounded-lg border bg-card px-2 py-2"><div className="num text-lg font-semibold">{v}</div><div className="meta">{k}</div></div>))}
      </div>
      {stops.length === 0 ? <Card><CardContent className="text-sm text-muted-foreground">No deliveries assigned right now. New jobs from the dispatcher appear here.</CardContent></Card> : <>
        <MapView pins={pins} route={route} onSelect={setSel} height={300} />
        <p className="meta">Dashed line shows your stop order from the depot (straight lines, not road directions). Tap a pin to see that stop.</p>
        {o && c && <Card className="ring-2 ring-primary">
          <CardContent className="grid gap-3">
            <Link to={`/rider/job/${o.id}`} className="flex gap-3">
              <span className="num flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground" aria-label={`Stop ${i + 1}`}>{i + 1}</span>
              <div className="grid min-w-0 flex-1 gap-1.5">
                <div className="flex items-center justify-between gap-2"><b className="truncate text-base">{c.name}</b><StatusPill s={o.status} /></div>
                <div className="text-sm font-medium text-primary">{o.id === nextId ? (o.status === 'Out for delivery' ? 'Current stop' : 'Next stop') : `Stop ${i + 1} of ${stops.length}`}</div>
                <div className="text-sm">{c.street}, {c.barangay}, {c.town}</div>
                <div className="text-sm text-muted-foreground">Landmark: {c.landmark}</div>
                <div className="num text-sm font-medium">{o.qty}× {o.size} · {payLabel(o)}</div>
              </div>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" className={ACT} nativeButton={false} render={<a role="link" href={`tel:${c.phone}`} aria-label={`Call ${c.name}`} />}><Phone />Call</Button>
              <Button variant="outline" className={ACT} nativeButton={false} render={<a role="link" href={`sms:${c.phone}`} aria-label={`Text ${c.name}`} />}><MessageSquare />Text</Button>
              <Button variant="outline" className={ACT} nativeButton={false} render={<a role="link" target="_blank" rel="noreferrer" href={mapsUrl(c.lat, c.lng)} aria-label={`Navigate to ${c.name}`} />}><Navigation />Navigate</Button>
            </div>
            {o.status === 'Assigned'
              ? <><Button className={BIG} disabled={!allChecked} onClick={() => actions.startDelivery(o.id)}>Start delivery (texts customer)</Button>{!allChecked && <div className="text-sm text-muted-foreground">Finish the safety check below to start.</div>}</>
              : <Button className={BIG} nativeButton={false} render={<Link role="link" to={`/rider/job/${o.id}`} />}>Complete delivery</Button>}
            {o.status === 'Assigned' && assigned.length > 1 && <div className="flex gap-2">
              <Button variant="ghost" className={ACT} disabled={assigned[0].id === o.id} aria-label={`Move ${c.name} up`} onClick={() => move(-1)}><ArrowUp />Move up</Button>
              <Button variant="ghost" className={ACT} disabled={assigned[assigned.length - 1].id === o.id} aria-label={`Move ${c.name} down`} onClick={() => move(1)}><ArrowDown />Move down</Button>
            </div>}
          </CardContent>
        </Card>}
        {!allChecked ? (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2">Safety check before you start <span className="num text-sm font-normal text-muted-foreground">({checks.filter(Boolean).length}/{CHECKS.length})</span></CardTitle></CardHeader>
                  <CardContent className="grid gap-1">
                    {CHECKS.map((x, k) => <label key={x} className="flex min-h-11 items-center gap-3 text-base"><Checkbox checked={checks[k]} onCheckedChange={(v) => setChecks(checks.map((y, j) => (j === k ? !!v : y)))} />{x}</label>)}
                    <div className="text-sm text-muted-foreground">Complete the checklist to unlock Start delivery.</div>
                  </CardContent>
                </Card>
              ) : <div className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="size-4" />Safety check done for today</div>}
        {stops.length > 1 && <div className="grid gap-2">
          <h2 className="text-sm font-medium">All stops</h2>
          {stops.map((x, k) => { const cc = byId(d.customers, x.customerId)!; return (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} className={cn('flex min-h-14 items-center gap-3 rounded-lg border bg-card px-3 text-left', x.id === activeId && 'border-primary')}>
              <span className={cn('num flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold', x.id === nextId ? 'bg-primary text-primary-foreground' : 'bg-muted')}>{k + 1}</span>
              <span className="min-w-0 flex-1"><b className="block truncate text-sm">{cc.name}</b><span className="meta block truncate">{cc.barangay}, {cc.town}</span></span>
              <StatusPill s={x.status} />
            </button>) })}
        </div>}
      </>}
    </div>
  )
}

export function Cash() {
  const d = useDB(); const rid = useRiderId()
  const day = dayKey(Date.now())
  const t = remitTotals(d, rid, day)
  const rows = t.remit?.orders ?? remitSnapshot(ordersForRemit(d, rid, day))
  return (
    <div className="grid gap-4">
      <h1 className={H1}>Cash today</h1>
      <Card>
        <CardContent className="grid gap-2 text-base">
          <div className="flex justify-between"><span>Cash to turn over</span><b className="num">{peso(t.expectedCash)}</b></div>
          <div className="flex justify-between text-sm text-muted-foreground"><span>Cash received from customers</span><span className="num">{peso(t.cashReceived)}</span></div>
          <div className="flex justify-between text-sm text-muted-foreground"><span>GCash / Maya (recorded, not verified)</span><span className="num">{peso(t.gcash + t.maya)}</span></div>
          <Separator />
          {t.remit
            ? <div className="text-sm">Handed over <b className="num">{peso(t.handedOver ?? 0)}</b>{t.remit.receiver ? ` to ${t.remit.receiver}` : ''}{t.remit.at ? ` at ${clock(t.remit.at)}` : ''}.{t.difference ? <span className="num font-medium text-warning"> Difference {peso(t.difference)}{t.remit.reason ? ` (${t.remit.reason})` : ''}.</span> : ' Balanced.'}</div>
            : <div className="text-sm text-muted-foreground">{t.deliveries ? 'Not handed over yet. Give the cash to the owner or dispatcher at the end of your shift; they record it.' : 'No deliveries yet today.'}</div>}
        </CardContent>
      </Card>
      {rows.length > 0 && <div className="grid gap-2">
        <h2 className="text-sm font-medium">By order</h2>
        {rows.map((s) => { const o = byId(d.orders, s.orderId); const c = byId(d.customers, o?.customerId); return (
          <div key={s.orderId} className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 text-sm">
            <div className="min-w-0"><b className="num">{s.orderId}</b> · {c?.name}<div className="meta">{s.payment === 'cod' ? (s.cashReceived < s.amountDue ? `Short ${peso(s.amountDue - s.cashReceived)}${s.shortReason ? `: ${s.shortReason}` : ''}` : 'Cash on delivery') : `${s.payment.toUpperCase()}${s.walletRef ? ` ref ${s.walletRef}` : ''}`}</div></div>
            <b className="num">{peso(s.payment === 'cod' ? s.cashReceived : s.walletAmount)}</b>
          </div>) })}
      </div>}
    </div>
  )
}

export function Truck() {
  const d = useDB(); const rid = useRiderId()
  const day = dayKey(Date.now())
  const lo = d.loadouts?.find((l) => l.riderId === rid && l.day === day)
  const recon = lo ? loadoutRecon(d, lo) : undefined
  const sold = ordersForRemit(d, rid, day)
  return (
    <div className="grid gap-4">
      <h1 className={H1}>My truck</h1>
      {!lo || !recon ? <Card><CardContent className="text-sm text-muted-foreground">No load-out recorded for today. The owner records the tanks you take from the depot (Inventory), then your expected return shows here.</CardContent></Card> : <>
        <p className="meta">Loaded {clock(lo.outAt)}. Should still be on the truck = loaded − delivered, plus empties collected.</p>
        {SIZES.filter((s) => recon[s]).map((s) => { const r = recon[s]!; const l = lo.out![s]!; const n = sold.filter((x) => x.size === s).reduce((a, x) => a + x.qty, 0); return (
          <Card key={s}><CardContent className="grid gap-1 text-sm">
            <b className="text-base">{s.toUpperCase()}</b>
            <div className="flex justify-between"><span>Loaded (full / empty)</span><span className="num">{l.full} / {l.empty}</span></div>
            <div className="flex justify-between"><span>Delivered today</span><span className="num">{n}</span></div>
            <div className="flex justify-between font-medium"><span>On the truck now (full / empty)</span><span className="num">{r.expected.full} / {r.expected.empty}</span></div>
            {r.returned && <div className="flex justify-between"><span>Returned to depot</span><span className="num">{r.returned.full} / {r.returned.empty} {r.mismatch ? '· mismatch' : '· matches'}</span></div>}
          </CardContent></Card>) })}
      </>}
    </div>
  )
}

export function Done() {
  const d = useDB(); const rid = useRiderId()
  const today = dayKey(Date.now())
  const ok = ordersForRemit(d, rid, today)
  const failed = d.orders.filter((o) => o.riderId === rid && o.status === 'Failed' && dayKey(o.assignedAt ?? o.placedAt) === today)
  const line = (o: Order, right: ReactNode, sub: string) => { const c = byId(d.customers, o.customerId); return (
    <div key={o.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 text-sm">
      <div className="min-w-0"><b className="num">{o.id}</b> · {c?.name}<div className="meta">{c?.barangay}, {c?.town} · {sub}</div></div>{right}
    </div>) }
  return (
    <div className="grid gap-4">
      <h1 className={H1}>Done today</h1>
      {ok.length === 0 && failed.length === 0 && <Card><CardContent className="text-sm text-muted-foreground">Nothing completed yet today.</CardContent></Card>}
      {ok.map((o) => line(o, <StatusPill s="Delivered" />, `${clock(o.deliveredAt)} · ${o.qty}× ${o.size}`))}
      {failed.map((o) => line(o, <StatusPill s="Failed" />, `${o.failReason ?? ''}${o.nextAttempt ? ` · next try ${clock(o.nextAttempt)}` : ''}`))}
    </div>
  )
}

const REASONS = ['No one home', 'Wrong address', 'Customer cancelled at door']
const RETRY = { later: ['Later today (in 3 hours)', 3 * 3_600_000], tmrAm: ['Tomorrow morning (9:00)', 0], tmrPm: ['Tomorrow afternoon (14:00)', 0], in2: ['In two days (9:00)', 0] } as const
const retryAt = (k: keyof typeof RETRY) => {
  if (k === 'later') return Date.now() + RETRY.later[1]
  const t = new Date(); t.setDate(t.getDate() + (k === 'in2' ? 2 : 1)); t.setHours(k === 'tmrPm' ? 14 : 9, 0, 0, 0); return t.getTime()
}

/** Downscale a camera photo so it fits localStorage. */
const shrink = (file: File) => new Promise<string>((res) => {
  const img = new Image(); const url = URL.createObjectURL(file)
  img.onload = () => { const s = 240 / Math.max(img.width, img.height); const cv = document.createElement('canvas'); cv.width = img.width * s; cv.height = img.height * s
    cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url); res(cv.toDataURL('image/jpeg', 0.6)) }
  img.src = url
})

export function Job() {
  const d = useDB(); const { id } = useParams(); const nav = useNavigate()
  const o = byId(d.orders, id) as Order | undefined
  const [checks] = useChecklist(o?.riderId ?? 'r1')
  const [mode, setMode] = useState<'otp' | 'photo'>('otp')
  const [code, setCode] = useState('')
  const [photo, setPhoto] = useState<string>()
  const [empties, setEmpties] = useState<number>()
  const [cash, setCash] = useState<number>()
  const [short, setShort] = useState('')
  const [wref, setWref] = useState('')
  const [reason, setReason] = useState('')
  const [contacted, setContacted] = useState(false)
  const [retry, setRetry] = useState<keyof typeof RETRY>('tmrAm')
  const [busy, setBusy] = useState(false)
  if (!o) return <Card><CardContent className="text-sm">Order not found. <Link to="/rider" className="text-primary underline-offset-4 hover:underline">Back</Link></CardContent></Card>
  const c = byId(d.customers, o.customerId)!
  const back = '/rider'
  const cod = o.payment === 'cod'
  const expected = o.type === 'refill' ? o.qty : 0
  const ret = empties ?? expected
  const cashNow = cash ?? o.amount
  const cashValid = Number.isInteger(cashNow) && cashNow >= 0
  const diff = cashNow - o.amount
  const needShort = cod && cashValid && diff !== 0
  const owed = Math.max(0, expected - ret)
  const checklistDone = checks.every(Boolean)
  const formOk = (mode === 'otp' ? code === OTP : !!photo) && (cod ? cashValid && (!needShort || !!short.trim()) : !!wref.trim())
  // Real device GPS when allowed; falls back to the customer pin (labelled in the demo) if blocked or slow.
  const confirmDelivery = () => {
    setBusy(true)
    const done = (lat: number, lng: number) => {
      try {
        actions.deliver(o.id, { pod: { kind: mode, photo, at: Date.now(), lat, lng }, cashReceived: cod ? cashNow : 0, shortReason: needShort ? short.trim() : undefined, walletRef: cod ? undefined : wref.trim(), emptiesReturned: ret })
        toast.success('Delivery confirmed'); nav(back)
      } catch (e) { toast((e as Error).message); setBusy(false) }
    }
    if (!navigator.geolocation) return done(c.lat, c.lng)
    navigator.geolocation.getCurrentPosition((p) => done(p.coords.latitude, p.coords.longitude), () => done(c.lat, c.lng), { timeout: 2000 })
  }
  const markFailed = () => {
    try { actions.fail(o.id, { reason, contacted, nextAttempt: retryAt(retry) }); toast('Delivery marked failed'); nav(back) } catch (e) { toast((e as Error).message) }
  }
  return (
    <div className="grid gap-4">
      <Link to={back} className="text-sm text-primary underline-offset-4 hover:underline">← Deliveries</Link>
      <Card>
        <CardHeader><CardTitle className="flex items-center justify-between gap-2"><h1 className={H1}>{c.name}</h1><StatusPill s={o.status} /></CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1 text-base">
            <div className="flex min-h-11 items-center gap-2"><Phone className="size-4 shrink-0 text-muted-foreground" /><a role="link" href={`tel:${c.phone}`} className="num font-medium text-primary">{c.phone}</a></div>
            <div className="flex items-start gap-2"><MapPin className="mt-1 size-4 shrink-0 text-muted-foreground" /><span>{c.street}, {c.barangay}, {c.town}</span></div>
            <span className="text-muted-foreground">Landmark: {c.landmark}</span>
          </div>
          <MapView pins={[{ id: c.id, lat: c.lat, lng: c.lng, label: c.name, color: 'var(--brand)' }]} height={180} />
          <div className="flex gap-2">
            <Button variant="outline" className={ACT} nativeButton={false} render={<a role="link" href={`sms:${c.phone}`} />}><MessageSquare />Text</Button>
            <Button variant="outline" className={ACT} nativeButton={false} render={<a role="link" target="_blank" rel="noreferrer" href={mapsUrl(c.lat, c.lng)} />}><Navigation />Open directions</Button>
          </div>
          <div className="num text-sm">{o.qty}× {o.size} {o.type === 'new' ? 'new tank + deposit' : 'refill swap'} · <b>{peso(o.amount)}</b> · {o.payment.toUpperCase()}</div>
        </CardContent>
      </Card>

      {o.status === 'Assigned' && <>
        <Button className={BIG} disabled={!checklistDone} onClick={() => actions.startDelivery(o.id)}>Start delivery (texts customer)</Button>
        {!checklistDone && <div className="text-sm text-muted-foreground">Complete the pre-shift safety checklist on the deliveries screen to unlock Start delivery.</div>}
      </>}

      {o.status === 'Out for delivery' && <Card>
        <CardHeader><CardTitle>Complete delivery</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between text-base"><span>Amount due</span><b className="num">{peso(o.amount)}</b></div>
          {cod ? <>
            <Field label="Cash received (₱)"><Input className="h-11 text-base" type="number" inputMode="numeric" min={0} value={cash ?? o.amount} onChange={(e) => setCash(e.target.value === '' ? NaN : +e.target.value)} /></Field>
            {needShort && <>
              <div className="num text-sm font-medium text-warning">{diff < 0 ? `Shortfall ${peso(-diff)}` : `Overage ${peso(diff)}`}</div>
              <Field label={diff < 0 ? 'Reason for shortfall' : 'Reason for overage'}><Input className="h-11 text-base" value={short} onChange={(e) => setShort(e.target.value)} placeholder="Required when cash differs from the amount due" /></Field>
            </>}
          </> : <>
            <div className="num text-sm">{o.payment.toUpperCase()} amount recorded: <b>{peso(o.amount)}</b></div>
            <Field label={`${o.payment === 'gcash' ? 'GCash' : 'Maya'} reference number`}><Input className="h-11 text-base" value={wref} onChange={(e) => setWref(e.target.value)} placeholder="From the customer's payment screen" /></Field>
            <div className="text-sm text-muted-foreground">Recorded, not verified. The reference is checked later by the owner.</div>
          </>}
          <div className="grid gap-2 text-sm font-medium">Proof of delivery
            <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'otp' | 'photo')} className="grid-cols-2">
              <label className="flex h-12 items-center gap-2 rounded-lg border bg-card px-3 font-normal"><RadioGroupItem value="otp" />Customer code</label>
              <label className="flex h-12 items-center gap-2 rounded-lg border bg-card px-3 font-normal"><RadioGroupItem value="photo" /><Camera className="size-4" />Photo</label>
            </RadioGroup>
          </div>
          {mode === 'otp' ? <Field label="4-digit code the customer received by SMS"><Input className="h-11 text-base" value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={4} placeholder="demo code: 4821" /></Field>
            : <div className="grid gap-2"><Input className="h-11 text-base" type="file" accept="image/*" capture="environment" aria-label="Delivery photo" onChange={async (e) => e.target.files?.[0] && setPhoto(await shrink(e.target.files[0]))} />{photo && <img src={photo} alt="Delivered cylinder" className="max-w-40 rounded-lg" />}</div>}
          <div className="grid gap-1.5 text-sm font-medium">
            <div className="flex items-center justify-between"><span>Empties expected</span><b className="num text-base">{expected}</b></div>
            <span>Empties returned</span>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="size-12" aria-label="Fewer empties" onClick={() => setEmpties(Math.max(0, ret - 1))}><Minus /></Button>
              <b className="num min-w-8 text-center text-lg">{ret}</b>
              <Button variant="outline" className="size-12" aria-label="More empties" onClick={() => setEmpties(ret + 1)}><Plus /></Button>
            </div>
            {owed > 0 && <div className="num font-normal text-warning">{owed} {owed === 1 ? 'tank' : 'tanks'} still owed by the customer. This is recorded on their account.</div>}
            {ret > expected && <div className="num font-normal text-muted-foreground">{ret - expected} extra returned. The customer's held count is reduced.</div>}
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground"><MapPinned className="mt-0.5 size-4 shrink-0" />Time and GPS location are recorded with the confirmation. If location is blocked, the customer's saved pin is used (demo).</div>
          <Button className={BIG} disabled={!formOk || busy} onClick={confirmDelivery}>{busy ? 'Confirming…' : 'Confirm delivered'}</Button>
          <Separator />
          <Field label="Can't deliver?"><NativeSelect className="h-11 w-full text-base" value={reason} onChange={(e) => setReason(e.target.value)}><option value="">Choose a reason…</option>{REASONS.map((r) => <option key={r}>{r}</option>)}</NativeSelect></Field>
          {reason && <>
            <label className="flex min-h-11 items-center gap-3 text-base"><Checkbox checked={contacted} onCheckedChange={(v) => setContacted(!!v)} />I contacted the customer</label>
            <Field label="Next attempt"><NativeSelect className="h-11 w-full text-base" value={retry} onChange={(e) => setRetry(e.target.value as keyof typeof RETRY)}>{(Object.keys(RETRY) as (keyof typeof RETRY)[]).map((k) => <option key={k} value={k}>{RETRY[k][0]}</option>)}</NativeSelect></Field>
            <div className="text-sm text-muted-foreground">The customer is texted this next attempt time (simulated). The dispatcher confirms the re-dispatch.</div>
          </>}
          <Button variant="outline" className={BIG} disabled={!reason} onClick={markFailed}>Mark delivery failed</Button>
        </CardContent>
      </Card>}

      {o.status === 'Delivered' && <Card><CardContent className="flex items-center gap-2 text-sm"><ShieldCheck className="size-4 text-success" />Delivered. {o.pod && `Proof: ${o.pod.kind}.`}</CardContent></Card>}
    </div>
  )
}
