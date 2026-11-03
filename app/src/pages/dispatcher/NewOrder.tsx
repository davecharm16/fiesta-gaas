import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapView } from '../../components/MapView'
import { Field, StatusPill } from '../../components/ui'
import { TOWNS, town } from '../../lib/geo'
import { toast } from 'sonner'
import { km, orderAmount, ordersOf, peso, pricingOf } from '../../lib/derive'
import { useAuth, useScopedDB } from '../../lib/auth'
import { actions } from '../../lib/store'
import { SIZES, type Channel, type Payment, type Size } from '../../lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

/** Labelled radio group; options are [value, label]. */
function Choice<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: readonly (readonly [T, string])[] }) {
  return (
    <div role="group" aria-label={label} className="grid gap-1.5 text-sm font-medium">
      {label}
      <RadioGroup value={value} onValueChange={(v) => onChange(v as T)} className="flex w-auto flex-wrap gap-x-4 gap-y-2">
        {options.map(([v, l]) => <label key={v} className="flex items-center gap-2 font-normal capitalize"><RadioGroupItem value={v} />{l}</label>)}
      </RadioGroup>
    </div>
  )
}

export default function NewOrder() {
  const d = useScopedDB(); const nav = useNavigate(); const { d: all, scope } = useAuth()
  const [q, setQ] = useState('')
  const [cid, setCid] = useState<string>('')
  const [isNew, setIsNew] = useState(false)
  const [f, setF] = useState({ name: '', phone: '', town: TOWNS[0].name, barangay: TOWNS[0].barangays[0], street: '', landmark: '' })
  const [pin, setPin] = useState<[number, number] | undefined>()
  const [channel, setChannel] = useState<Channel>('call')
  const [size, setSize] = useState<Size>('11kg')
  const [qty, setQty] = useState(1)
  const [type, setType] = useState<'refill' | 'new'>('refill')
  const [payment, setPayment] = useState<Payment>('cod')
  const matches = useMemo(() => q.length < 2 ? [] : d.customers.filter((c) => (c.name + c.phone + c.barangay + c.town + c.landmark + c.street).toLowerCase().includes(q.toLowerCase())).slice(0, 5), [q, d.customers])
  const cust = d.customers.find((c) => c.id === cid)
  const t = town(isNew ? f.town : cust?.town ?? TOWNS[0].name)
  // Price at the branch that will serve the order: the customer's branch, or the nearest branch for a new customer.
  const pBranch = isNew ? (pin ? scope.map((b) => all.branches.find((x) => x.id === b)!).sort((a, b) => km({ lat: pin[0], lng: pin[1] }, a) - km({ lat: pin[0], lng: pin[1] }, b))[0]?.id : scope[0]) : cust?.branchId
  const prices = pricingOf(all, pBranch)
  const fee = prices.fees[t.name] ?? 0
  const total = orderAmount(all, pBranch ?? scope[0] ?? '', { size, qty, type, town: t.name })
  const ready = isNew ? !!(f.name && f.phone && f.street && pin) : !!cid

  const active = !isNew && cid ? ordersOf(d, cid).filter((o) => !['Delivered', 'Cancelled', 'Failed'].includes(o.status)) : []
  const [confirmDup, setConfirmDup] = useState(false)
  function submit() {
    try {
      let id = cid
      // A new customer joins the nearest branch this user works in.
      const branchId = scope.map((b) => all.branches.find((x) => x.id === b)!).sort((a, b) => km({ lat: pin![0], lng: pin![1] }, a) - km({ lat: pin![0], lng: pin![1] }, b))[0]?.id
      if (isNew) id = actions.addCustomer({ ...f, branchId, lat: pin![0], lng: pin![1], size, promoConsent: false })
      actions.placeOrder({ customerId: id, size, qty, type, payment, channel })
      nav('/dispatcher')
    } catch (e) { toast.error((e as Error).message) }
  }
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value })
  return (
    <div className="grid max-w-3xl gap-4">
      <div>
        <h1 className="page-title">Encode a call / text / walk-in order</h1>
        <p className="meta">Pick or add the customer, then enter the order details.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex gap-2">
            <Button variant={!isNew ? 'default' : 'outline'} aria-pressed={!isNew} onClick={() => setIsNew(false)}>Existing customer</Button>
            <Button variant={isNew ? 'default' : 'outline'} aria-pressed={isNew} onClick={() => setIsNew(true)}>New customer</Button>
          </div>
          {!isNew ? <>
            <Field label="Search name, mobile number, town, barangay or landmark"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Pantal or 0917…" /></Field>
            {matches.length > 0 && (
              <div className="grid gap-1.5">
                {matches.map((c) => (
                  <Button key={c.id} variant={cid === c.id ? 'default' : 'outline'} aria-pressed={cid === c.id} className="justify-start" onClick={() => { setCid(c.id); setSize(c.size); setConfirmDup(false) }}>
                    {c.name} · {c.barangay}, {c.town}{cid === c.id && ' (selected)'}
                    <span className="num ml-2 text-xs font-normal opacity-80">{c.phone}{c.landmark ? ` · near ${c.landmark}` : ''} · {(() => { const lo = ordersOf(d, c.id)[0]; return lo ? `last order ${lo.id}, ${new Date(lo.placedAt).toLocaleDateString()}` : 'no orders yet' })()}</span>
                  </Button>
                ))}
              </div>
            )}
          </> : <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name"><Input value={f.name} onChange={set('name')} /></Field>
              <Field label="Mobile number"><Input value={f.phone} onChange={set('phone')} inputMode="tel" /></Field>
              <Field label="Town"><NativeSelect className="w-full" value={f.town} onChange={(e) => setF({ ...f, town: e.target.value, barangay: town(e.target.value).barangays[0] })}>{TOWNS.map((x) => <NativeSelectOption key={x.name}>{x.name}</NativeSelectOption>)}</NativeSelect></Field>
              <Field label="Barangay (standard list)"><NativeSelect className="w-full" value={f.barangay} onChange={set('barangay')}>{town(f.town).barangays.map((b) => <NativeSelectOption key={b}>{b}</NativeSelectOption>)}</NativeSelect></Field>
              <Field label="Street / purok"><Input value={f.street} onChange={set('street')} /></Field>
              <Field label="Landmark"><Input value={f.landmark} onChange={set('landmark')} /></Field>
            </div>
            <p className="text-sm text-muted-foreground">Click the map to drop the customer's pin {pin ? '(pin set)' : '(required)'}</p>
            <MapView pins={[]} onPick={(la, ln) => setPin([la, ln])} picked={pin} height={240} />
          </>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Order</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <Choice<Channel> label="How did the order come in?" value={channel} onChange={setChannel} options={[['call', 'call'], ['text', 'text'], ['walk-in', 'walk-in']]} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Choice<Size> label="Size" value={size} onChange={setSize} options={SIZES.map((s) => [s, s] as const)} />
            <Choice<'refill' | 'new'> label="Type" value={type} onChange={setType} options={[['refill', 'Refill swap'], ['new', 'New tank']]} />
            <Field label="Qty"><Input className="w-20 tabular-nums" type="number" min={1} max={5} value={qty} onChange={(e) => setQty(Math.min(5, Math.max(1, Math.floor(+e.target.value) || 1)))} /></Field>
            <Field label="Payment"><NativeSelect className="w-full sm:w-56" value={payment} onChange={(e) => setPayment(e.target.value as Payment)}><NativeSelectOption value="cod">Cash on delivery</NativeSelectOption><NativeSelectOption value="gcash">GCash</NativeSelectOption><NativeSelectOption value="maya">Maya</NativeSelectOption></NativeSelect></Field>
          </div>
          {active.length > 0 && (
            <div role="alert" className="grid gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning-foreground">
              <p className="font-medium">This customer already has an active order. Check it is not a duplicate before creating another.</p>
              {active.map((o) => <div key={o.id} className="flex flex-wrap items-center gap-2"><b className="num">{o.id}</b><span className="num">{o.qty}× {o.size}</span><StatusPill s={o.status} /><span className="meta">placed {new Date(o.placedAt).toLocaleString([], { hour: 'numeric', minute: '2-digit' })}</span></div>)}
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4" checked={confirmDup} onChange={(e) => setConfirmDup(e.target.checked)} />This is a separate order</label>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <b className="text-2xl font-semibold tabular-nums tracking-tight">{peso(total)}</b><span className="text-sm text-muted-foreground">incl. {peso(fee)} delivery</span>
            <Button size="lg" className="ml-auto" disabled={!ready || (active.length > 0 && !confirmDup)} onClick={submit}>Create order</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
