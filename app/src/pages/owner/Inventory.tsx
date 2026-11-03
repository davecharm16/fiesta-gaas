import { createContext, useContext, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Field, Pill } from '../../components/ui'
import { ago, dayKey, heldBySize, loadoutRecon, openingHeldTotal, openOrdersNeed, peso, stockOf, thresholdOf } from '../../lib/derive'
import { scopeDB, useAuth } from '../../lib/auth'
import { actions, useDB } from '../../lib/store'
import { SIZES, type LoadoutLine, type Size } from '../../lib/types'

/** Inventory works on one branch at a time. Everything below reads the branch picked at the top of the page. */
const InvBranch = createContext('')
function useInv() {
  const b = useContext(InvBranch); const raw = useDB()
  const d = useMemo(() => scopeDB(raw, [b]), [raw, b])
  return { d, b }
}
const num = (v: string) => (v === '' ? NaN : Number(v))
const run = (f: () => void, ok: string) => { try { f(); toast.success(ok) } catch (e) { toast.error((e as Error).message) } }
const sgn = (n: number) => (n > 0 ? '+' : '') + n

function CountRow({ size }: { size: Size }) {
  const { d, b } = useInv(); const st = stockOf(d, b)
  const [full, setFull] = useState(''); const [empty, setEmpty] = useState(''); const [reason, setReason] = useState(''); const [thr, setThr] = useState('')
  const valid = Number.isInteger(num(full)) && num(full) >= 0 && Number.isInteger(num(empty)) && num(empty) >= 0 && reason.trim() !== ''
  const n = openOrdersNeed(d)[size]; const t = thresholdOf(d, b, size); const low = st.full[size] <= t
  const thrNum = num(thr)
  return (
    <TableRow>
      <TableCell className="font-medium">{size.toUpperCase()}</TableCell>
      <TableCell className="text-right num" data-testid={`stock-full-${size.toUpperCase()}`}>{st.full[size]}</TableCell>
      <TableCell className="text-right num">{st.empty[size]}</TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          <Input className="w-20" type="number" min={0} aria-label={`Physical full count ${size}`} placeholder="Full" value={full} onChange={(e) => setFull(e.target.value)} />
          <Input className="w-20" type="number" min={0} aria-label={`Physical empty count ${size}`} placeholder="Empty" value={empty} onChange={(e) => setEmpty(e.target.value)} />
          <Input className="w-48" aria-label={`Adjustment reason ${size}`} placeholder="Reason (required)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <Button variant="outline" size="sm" disabled={!valid} onClick={() => run(() => { actions.adjust(b, size, { fullCount: num(full), emptyCount: num(empty), reason }); setFull(''); setEmpty(''); setReason('') }, `${size} count adjusted`)}>Adjust</Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Input className="w-20" type="number" min={0} aria-label={`Low-stock threshold ${size}`} placeholder={String(t)} value={thr} onChange={(e) => setThr(e.target.value)} />
          <Button variant="outline" size="sm" disabled={!Number.isInteger(thrNum) || thrNum < 0} onClick={() => run(() => { actions.setThreshold(b, size, thrNum); setThr('') }, `${size} threshold saved`)}>Save</Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="grid gap-1">
          {low ? <Pill tone="danger">Low stock (alert at {t})</Pill> : <Pill tone="success">OK (alert at {t})</Pill>}
          <span className={n.shortfall > 0 ? 'meta text-destructive' : 'meta'}>Open orders need {n.qty}; you have {n.fullAvailable}{n.shortfall > 0 ? ` (short by ${n.shortfall})` : ''}</span>
        </div>
      </TableCell>
    </TableRow>
  )
}

function LoadPanel() {
  const { d } = useInv()
  const [day, setDay] = useState(dayKey(Date.now()))
  const [riderId, setRiderId] = useState(d.riders[0]?.id ?? '')
  const [out, setOut] = useState<Record<string, string>>({})
  const [ret, setRet] = useState<Record<string, string>>({})
  const lo = d.loadouts?.find((l) => l.riderId === riderId && l.day === day)
  const recon = lo ? loadoutRecon(d, lo) : undefined
  const build = (src: Record<string, string>) => {
    const l: Partial<Record<Size, LoadoutLine>> = {}
    for (const s of SIZES) { const f = src[`${s}-f`], e = src[`${s}-e`]; if (f || e) l[s] = { full: Number(f || 0), empty: Number(e || 0) } }
    return l
  }
  const ok = (src: Record<string, string>) => { const l = Object.values(build(src)); return l.length > 0 && l.every((x) => Number.isInteger(x.full) && x.full >= 0 && Number.isInteger(x.empty) && x.empty >= 0) }
  const grid = (src: Record<string, string>, set: (v: Record<string, string>) => void, label: string) => (
    <div className="flex flex-wrap gap-4">
      {SIZES.map((s) => (
        <div key={s} className="flex items-end gap-2">
          <span className="w-12 pb-2 text-sm font-medium">{s.toUpperCase()}</span>
          <Field label="Full"><Input className="w-20" type="number" min={0} aria-label={`${label} full ${s}`} value={src[`${s}-f`] ?? ''} onChange={(e) => set({ ...src, [`${s}-f`]: e.target.value })} /></Field>
          <Field label="Empty"><Input className="w-20" type="number" min={0} aria-label={`${label} empty ${s}`} value={src[`${s}-e`] ?? ''} onChange={(e) => set({ ...src, [`${s}-e`]: e.target.value })} /></Field>
        </div>))}
    </div>)
  return (
    <Card>
      <CardHeader><CardTitle>Rider load-out and return</CardTitle></CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Rider"><NativeSelect value={riderId} onChange={(e) => setRiderId(e.target.value)}>{d.riders.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</NativeSelect></Field>
          <Field label="Date"><Input type="date" className="w-44" value={day} onChange={(e) => e.target.value && setDay(e.target.value)} /></Field>
        </div>
        {!lo ? (
          <>
            <p className="meta">No load-out recorded for this rider and day. Loading out moves tanks from depot stock to the truck.</p>
            {grid(out, setOut, 'Load-out')}
            <div><Button disabled={!ok(out)} onClick={() => run(() => { actions.loadOut(riderId, day, build(out)); setOut({}) }, 'Load-out recorded')}>Record load-out</Button></div>
          </>
        ) : (
          <>
            <Table stack>
              <TableHeader><TableRow><TableHead>Size</TableHead><TableHead className="text-right">Out (full / empty)</TableHead><TableHead className="text-right">Expected back</TableHead><TableHead className="text-right">Returned</TableHead><TableHead>Check</TableHead></TableRow></TableHeader>
              <TableBody>
                {SIZES.filter((s) => recon?.[s]).map((s) => { const r = recon![s]!; const o = lo.out![s]!; return (
                  <TableRow key={s}>
                    <TableCell className="font-medium">{s.toUpperCase()}</TableCell>
                    <TableCell className="text-right num">{o.full} / {o.empty}</TableCell>
                    <TableCell className="text-right num">{r.expected.full} / {r.expected.empty}</TableCell>
                    <TableCell className="text-right num">{r.returned ? `${r.returned.full} / ${r.returned.empty}` : '—'}</TableCell>
                    <TableCell>{!r.returned ? <Pill tone="info">On the road</Pill> : r.mismatch ? <Pill tone="danger" className="num">Mismatch: full {sgn(r.diff!.full)}, empty {sgn(r.diff!.empty)}</Pill> : <Pill tone="success">Matches</Pill>}</TableCell>
                  </TableRow>) })}
              </TableBody>
            </Table>
            {!lo.returnedAt && (
              <>
                <p className="meta">Count what the rider brings back. Expected back is load-out minus delivered tanks, plus empties collected.</p>
                {grid(ret, setRet, 'Return')}
                <div><Button disabled={!ok(ret)} onClick={() => run(() => { actions.returnLoad(riderId, day, build(ret)); setRet({}) }, 'Load return recorded')}>Record return</Button></div>
              </>)}
          </>)}
      </CardContent>
    </Card>
  )
}

function HeldCard() {
  const { d } = useInv()
  const h = heldBySize(d)
  const total = SIZES.reduce((a, s) => a + h[s].cylinders, 0)
  return (
    <Card>
      <CardHeader><CardTitle>Cylinders held by customers</CardTitle></CardHeader>
      <CardContent className="grid gap-3 overflow-x-auto">
        <Table stack>
          <TableHeader><TableRow><TableHead>Size</TableHead><TableHead className="text-right">Opening count</TableHead><TableHead className="text-right">Held now</TableHead><TableHead className="text-right">Customers</TableHead><TableHead className="text-right">Deposit estimate</TableHead></TableRow></TableHeader>
          <TableBody>
            {SIZES.map((s) => <TableRow key={s}><TableCell className="font-medium">{s.toUpperCase()}</TableCell><TableCell className="text-right num">{openingHeldTotal(d)[s] ?? '—'}</TableCell><TableCell className="text-right num">{h[s].cylinders}</TableCell><TableCell className="text-right num">{h[s].customers}</TableCell><TableCell className="text-right num">{peso(h[s].depositEstimate)}</TableCell></TableRow>)}
          </TableBody>
        </Table>
        <p className="meta">{total} cylinders in total. Deposit figures are an estimate (count times the standard deposit), not a recorded liability.</p>
      </CardContent>
    </Card>
  )
}

function ReceiptCard() {
  const { b: branch } = useInv()
  const [size, setSize] = useState<Size>('11kg'); const [qty, setQty] = useState('10'); const [dr, setDr] = useState(''); const [back, setBack] = useState('0'); const [note, setNote] = useState('')
  const q = num(qty), b = num(back)
  const valid = Number.isInteger(q) && q > 0 && Number.isInteger(b) && b >= 0 && dr.trim() !== ''
  return (
    <Card>
      <CardHeader><CardTitle>Stock-in from supplier</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <Field label="Size"><NativeSelect value={size} onChange={(e) => setSize(e.target.value as Size)}>{SIZES.map((s) => <option key={s}>{s}</option>)}</NativeSelect></Field>
        <Field label="Qty received"><Input className="w-24" type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
        <Field label="DR number"><Input className="w-36" value={dr} onChange={(e) => setDr(e.target.value)} placeholder="Delivery receipt" /></Field>
        <Field label="Empties handed back"><Input className="w-32" type="number" min={0} value={back} onChange={(e) => setBack(e.target.value)} /></Field>
        <Field label="Mismatch note (optional)" className="min-w-56 flex-1"><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. 2 fewer than the receipt" /></Field>
        <Button disabled={!valid} onClick={() => run(() => { actions.stockIn(branch, size, q, { drNumber: dr, emptiesHandedBack: b, mismatchNote: note || undefined }); setDr(''); setNote(''); setBack('0') }, 'Stock-in recorded')}>Record stock-in</Button>
      </CardContent>
    </Card>
  )
}

function TransferCard() {
  const { d: raw, scope } = useAuth(); const { b } = useInv()
  const others = raw.branches.filter((x) => x.active && x.id !== b)
  const [to, setTo] = useState(''); const [size, setSize] = useState<Size>('11kg'); const [qty, setQty] = useState(''); const [note, setNote] = useState('')
  const dest = others.find((x) => x.id === to)?.id ?? others[0]?.id ?? ''
  const q = num(qty)
  if (!others.length || !scope.includes(b)) return null
  return (
    <Card>
      <CardHeader><CardTitle>Transfer full tanks to another branch</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <Field label="To branch"><NativeSelect value={dest} onChange={(e) => setTo(e.target.value)}>{others.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</NativeSelect></Field>
        <Field label="Size"><NativeSelect value={size} onChange={(e) => setSize(e.target.value as Size)}>{SIZES.map((s) => <option key={s}>{s}</option>)}</NativeSelect></Field>
        <Field label="Quantity"><Input className="w-24" type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
        <Field label="Note (optional)" className="min-w-56 flex-1"><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Weekend stock for Alaminos" /></Field>
        <Button disabled={!Number.isInteger(q) || q <= 0} onClick={() => run(() => { actions.transferStock(b, dest, size, q, note || undefined); setQty(''); setNote('') }, 'Transfer recorded')}>Transfer</Button>
      </CardContent>
    </Card>
  )
}

export function Inventory() {
  const a = useAuth()
  const [pick, setPick] = useState('')
  const branch = a.scope.includes(pick) ? pick : a.view[0] ?? ''
  const manage = a.can('inventory.manage')
  return <InvBranch.Provider value={branch}><InventoryBody branches={a.scope} branch={branch} setBranch={setPick} manage={manage} /></InvBranch.Provider>
}

function InventoryBody({ branches, branch, setBranch, manage }: { branches: string[]; branch: string; setBranch: (b: string) => void; manage: boolean }) {
  const { d } = useInv()
  const all = useDB()
  const held = d.customers.reduce((a, c) => a + c.heldCylinders, 0)
  const rname = (id?: string) => d.riders.find((r) => r.id === id)?.name
  if (!branch) return <p className="meta">No branch is available to you.</p>
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
        <h1 className="page-title">Cylinder inventory</h1>
        <p className="meta">{held} cylinders are out with customers on deposit. Delivered orders deduct full tanks and add collected empties automatically; use a physical count to correct drift.{!manage && ' View only: your role cannot change stock.'}</p>
        </div>
        {branches.length > 1 ? <Field label="Branch"><NativeSelect value={branch} onChange={(e) => setBranch(e.target.value)}>{branches.map((id) => <option key={id} value={id}>{all.branches.find((x) => x.id === id)?.name}</option>)}</NativeSelect></Field> : <span className="text-sm font-medium">{all.branches.find((x) => x.id === branch)?.name}</span>}
      </div>
      <fieldset disabled={!manage} className="contents">
      <Card>
        <CardContent className="overflow-x-auto">
          <Table stack>
            <TableHeader><TableRow><TableHead>Size</TableHead><TableHead className="text-right">Full</TableHead><TableHead className="text-right">Empty</TableHead><TableHead>Physical count and reason</TableHead><TableHead>Alert threshold</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{SIZES.map((s) => <CountRow key={s} size={s} />)}</TableBody>
          </Table>
        </CardContent>
      </Card>
      <LoadPanel />
      <HeldCard />
      <ReceiptCard />
      <TransferCard />
      </fieldset>
      <Card>
        <CardHeader><CardTitle>Movements</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table stack>
            <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Type</TableHead><TableHead>Size</TableHead><TableHead className="text-right">Full</TableHead><TableHead className="text-right">Empty</TableHead><TableHead>Note</TableHead><TableHead>Reference</TableHead></TableRow></TableHeader>
            <TableBody>
              {d.movements.slice(0, 20).map((m) => <TableRow key={m.id}><TableCell className="num">{ago(m.at)}</TableCell><TableCell>{m.kind}{m.onTruck ? ' (from truck)' : ''}</TableCell><TableCell>{m.size}</TableCell><TableCell className="text-right num">{sgn(m.full)}</TableCell><TableCell className="text-right num">{sgn(m.empty)}</TableCell><TableCell>{m.note}</TableCell><TableCell>{[m.reason && `Reason: ${m.reason}`, rname(m.riderId), m.orderId, m.drNumber && `DR ${m.drNumber}`].filter(Boolean).join(' · ')}</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
