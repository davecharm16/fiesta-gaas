import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bike, Check, MapPin, ShieldCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NativeSelect } from '@/components/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Field, StatusPill } from '../../components/ui'
import { ago, byId, mins, orderAmount, ordersOf, peso, pricingOf, refillOf } from '../../lib/derive'
import { PERSONA_KEY } from '../../lib/session'
import { actions, OTP, useDB } from '../../lib/store'
import { SIZES, type Order, type Payment, type Size } from '../../lib/types'

const KEY = PERSONA_KEY
const read = () => { try { return localStorage.getItem(KEY) || 'c1' } catch { return 'c1' } }
/** Demo persona: which customer is using the PWA (default Maria, c1). */
function useMe() {
  const d = useDB()
  const id = d.customers.some((c) => c.id === read()) ? read() : 'c1'
  const pick = (v: string) => { try { localStorage.setItem(KEY, v) } catch { /* ignore */ } actions.touch() }
  return { id, pick, all: d.customers }
}

/** Labelled radio group: each option is a full-width selectable row. */
function Choice<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string; hint?: string }[] }) {
  return (
    <fieldset className="grid gap-1.5">
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as T)} aria-label={label}>
        {options.map((o) => (
          <label key={o.value} className={cn('flex cursor-pointer items-center gap-3 min-h-12 rounded-lg border bg-card p-3 text-base', value === o.value && 'border-primary bg-accent text-accent-foreground')}>
            <RadioGroupItem value={o.value} />
            <span className="font-medium">{o.label}</span>
            {o.hint && <span className="num ml-auto text-sm text-muted-foreground">{o.hint}</span>}
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  )
}

export function OrderPage() {
  const d = useDB(); const nav = useNavigate(); const { id: ME, pick, all } = useMe()
  const me = byId(d.customers, ME)!
  const r = refillOf(d, me)
  const last = ordersOf(d, ME).find((o) => o.status === 'Delivered')
  const [size, setSize] = useState<Size>(me.size)
  useEffect(() => setSize(me.size), [ME, me.size]) // persona switch: follow that customer's usual size
  const [qty, setQty] = useState(1)
  const [type, setType] = useState<'refill' | 'new'>('refill')
  const [payment, setPayment] = useState<Payment>('cod')
  const prices = pricingOf(d, me.branchId) // prices of the branch that serves this customer
  const fee = prices.fees[me.town] ?? 0
  const total = orderAmount(d, me.branchId, { size, qty, type, town: me.town })
  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h1 className="page-title">Good day, {me.name.split(' ')[0]}</h1>
        <p className="flex items-start gap-1.5 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" />{me.street}, {me.barangay}, {me.town}</p>
        <p className="flex items-start gap-1.5 text-sm text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0" />Rider-verified delivery</p>
      </div>
      <label className="meta flex items-center gap-2">Demo customer
        <NativeSelect className="h-11 text-base" aria-label="Demo customer" value={ME} onChange={(e) => pick(e.target.value)}>{all.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</NativeSelect></label>
      {last && <Card size="sm">
        <CardContent className="flex items-center gap-3">
          <div className="grow"><div className="font-semibold">Reorder your usual</div><div className="num text-sm text-muted-foreground">{last.qty}× {last.size} {last.type === 'new' ? 'new tank' : 'refill'} · {last.payment.toUpperCase()}</div></div>
          <Button size="lg" onClick={() => { actions.placeOrder({ customerId: ME, size: last.size, qty: last.qty, type: last.type, payment: last.payment, channel: 'app' }); nav('/customer/orders') }}>Reorder</Button>
        </CardContent></Card>}
      {r && r.status !== 'ok' && <Alert>
        <AlertTitle>{r.status === 'overdue' ? 'Your refill is overdue.' : 'Your refill is coming due.'}</AlertTitle>
        <AlertDescription>You usually refill every ~{Math.round(r.cycleDays)} days. Order now and we will deliver today.</AlertDescription>
      </Alert>}
      <Card>
        <CardHeader><CardTitle>Order a refill</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <Choice label="Cylinder size" value={size} onChange={setSize} options={SIZES.map((s) => ({ value: s, label: s, hint: peso(prices.refill[s]) }))} />
          <Choice label="Order type" value={type} onChange={setType} options={[{ value: 'refill', label: 'Refill swap' }, { value: 'new', label: 'New tank + deposit' }]} />
          <Field label="Quantity"><div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="size-11" aria-label="Less" onClick={() => setQty(Math.max(1, qty - 1))}>−</Button><b className="num min-w-8 text-center text-lg">{qty}</b>
            <Button variant="outline" size="icon" className="size-11" aria-label="More" onClick={() => setQty(Math.min(5, qty + 1))}>+</Button></div></Field>
          <Choice label="Payment" value={payment} onChange={setPayment} options={[{ value: 'cod', label: 'Cash on delivery' }, { value: 'gcash', label: 'GCash' }, { value: 'maya', label: 'Maya' }]} />
          <div className="flex items-baseline justify-between gap-3 border-t pt-4"><span className="num text-sm text-muted-foreground">{qty}× {size} {type === 'new' ? 'new tank' : 'refill'}{fee ? ` + ${peso(fee)} delivery` : ' · free delivery'}</span><b className="num text-2xl font-semibold">{peso(total)}</b></div>
          <Button size="lg" className="w-full" onClick={() => { actions.placeOrder({ customerId: ME, size, qty, type, payment, channel: 'app' }); nav('/customer/orders') }}>Place order</Button>
          {payment !== 'cod' && <p className="text-sm text-muted-foreground">E-wallet is paid to the rider on delivery in this version. Online prepayment is an optional add-on.</p>}
        </CardContent>
      </Card>
    </div>
  )
}

const STEPS = ['Placed', 'Assigned', 'Out for delivery', 'Delivered'] as const

function OrderCard({ o, d, live }: { o: Order; d: ReturnType<typeof useDB>; live?: boolean }) {
  const rider = byId(d.riders, o.riderId)
  const idx = STEPS.indexOf(o.status as (typeof STEPS)[number])
  return (
    <Card size="sm">
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-2"><b className="num">{o.id}</b><StatusPill s={o.status} /><span className="num ml-auto text-sm text-muted-foreground">{ago(o.placedAt)}</span></div>
        <div className="num text-sm">{o.qty}× {o.size} {o.type === 'new' ? 'new tank' : 'refill'} · {peso(o.amount)} · {o.payment.toUpperCase()}</div>
        {live && <>
          {idx >= 0 && <ol aria-label="Order progress" className="grid gap-0 border-l-2 border-border pl-0">{STEPS.map((st, i) => {
            const done = i < idx, cur = i === idx
            return <li key={st} className="relative flex items-center gap-3 py-1.5 pl-5">
              <span className={cn('absolute -left-[9px] grid size-4 place-items-center rounded-full border-2 bg-card', done && 'border-success bg-success text-white', cur && 'border-primary bg-primary')}>{done && <Check className="size-3" />}</span>
              <span className={cn('text-sm', cur ? 'font-semibold text-foreground' : done ? 'text-foreground' : 'text-muted-foreground')}>{st === 'Out for delivery' ? 'On the way' : st}</span>
              {(i === 0 ? o.placedAt : i === 1 ? o.assignedAt : undefined) && i <= idx && <span className="num meta ml-auto">{ago((i === 0 ? o.placedAt : o.assignedAt)!)}</span>}
              {cur && <span className="meta ml-auto">Now</span>}
            </li>
          })}</ol>}
          {rider && <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Bike className="size-4" />{rider.name} · {rider.phone}</div>}
          {o.status === 'Out for delivery' && <div className="rounded-lg border border-primary bg-accent p-3 text-base text-accent-foreground">Give the rider your delivery code: <b className="num text-lg tracking-widest">{OTP}</b></div>}
          {o.status === 'Failed' && <div className="rounded-lg bg-warning-soft p-3 text-sm text-warning-foreground">Delivery failed: {o.failReason}. {o.nextAttempt ? <>Next attempt: <b className="num">{new Date(o.nextAttempt).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</b>.</> : 'We will confirm the next attempt by text.'}</div>}
        </>}
        {o.status === 'Delivered' && o.deliveredAt && <div className="num text-sm text-muted-foreground">Delivered in {mins(o.placedAt, o.deliveredAt)} min</div>}
      </CardContent>
    </Card>
  )
}

export function Orders() {
  const d = useDB(); const { id: ME } = useMe()
  const all = ordersOf(d, ME)
  const live = all.filter((o) => ['Placed', 'Assigned', 'Out for delivery', 'Failed'].includes(o.status))
  const past = all.filter((o) => !live.includes(o))
  return (
    <div className="grid gap-4">
      <h1 className="page-title">My orders</h1>
      {live.length ? live.map((o) => <OrderCard key={o.id} o={o} d={d} live />) : <Card size="sm"><CardContent className="text-sm text-muted-foreground">No active order. <Link className="text-primary underline underline-offset-4" to="/customer">Order a refill</Link></CardContent></Card>}
      <h2 className="text-base font-semibold pt-2">History</h2>
      {past.map((o) => <OrderCard key={o.id} o={o} d={d} />)}
    </div>
  )
}

export function Inbox() {
  const d = useDB(); const { id: ME } = useMe()
  const me = byId(d.customers, ME)!
  const mine = d.sms.filter((s) => s.to === me.phone)
  return (
    <div className="grid gap-4">
      <div className="grid gap-1"><h1 className="page-title">Messages</h1><p className="text-sm text-muted-foreground">What this customer's phone receives by SMS.</p></div>
      {mine.length ? mine.map((s) => <Card key={s.id} size="sm" className={cn(s.kind === 'otp' && 'border-primary bg-accent')}>
        <CardContent className="grid gap-1 text-sm">{s.text}<div className="meta num">{ago(s.at)}</div></CardContent></Card>)
        : <Card size="sm"><CardContent className="text-sm text-muted-foreground">Nothing yet. Place an order to see the confirmation.</CardContent></Card>}
    </div>
  )
}
