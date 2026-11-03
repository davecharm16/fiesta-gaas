import { MapPin, Phone } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MapView, pinColor } from '../../components/MapView'
import { Pill, StatusPill } from '../../components/ui'
import { TOWNS, town } from '../../lib/geo'
import { byId, lastOrderDays, ordersOf, peso, refillRows } from '../../lib/derive'
import { useScopedDB } from '@/lib/auth'
import { SIZES } from '../../lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const HEALTH = { new: 'New', ok: 'On cycle', due: 'Due soon', overdue: 'Overdue' } as const

export default function Customers() {
  const d = useScopedDB()
  const [q, setQ] = useState(''); const [tw, setTw] = useState(''); const [bg, setBg] = useState(''); const [sz, setSz] = useState(''); const [stale, setStale] = useState('')
  const [sel, setSel] = useState<string>()
  const rows = useMemo(() => refillRows(d).filter(({ c }) =>
    (!q || (c.name + c.phone + c.town + c.barangay).toLowerCase().includes(q.toLowerCase())) && (!tw || c.town === tw) && (!bg || c.barangay === bg) &&
    (!sz || c.size === sz) && (!stale || lastOrderDays(d, c) > +stale)), [d, q, tw, bg, sz, stale])
  const sc = byId(d.customers, sel)
  const sr = rows.find((r) => r.c.id === sel)?.r
  // barangay concentration for the coverage view
  const conc = Object.entries(rows.reduce<Record<string, number>>((a, { c }) => ((a[`${c.barangay}, ${c.town}`] = (a[`${c.barangay}, ${c.town}`] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 6)
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="page-title">Customer map &amp; directory</h1>
        <p className="meta">{rows.length} of {d.customers.length} customers</p>
      </div>
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Input aria-label="Search" placeholder="Search name, mobile, town, barangay" value={q} onChange={(e) => setQ(e.target.value)} className="min-w-56 flex-1" />
          <NativeSelect aria-label="Town" value={tw} onChange={(e) => { setTw(e.target.value); setBg('') }}><NativeSelectOption value="">All towns</NativeSelectOption>{TOWNS.map((t) => <NativeSelectOption key={t.name}>{t.name}</NativeSelectOption>)}</NativeSelect>
          <NativeSelect aria-label="Barangay" value={bg} onChange={(e) => setBg(e.target.value)}><NativeSelectOption value="">All barangays</NativeSelectOption>{(tw ? town(tw).barangays : [...new Set(TOWNS.flatMap((t) => t.barangays))]).map((b) => <NativeSelectOption key={b}>{b}</NativeSelectOption>)}</NativeSelect>
          <NativeSelect aria-label="Size" value={sz} onChange={(e) => setSz(e.target.value)}><NativeSelectOption value="">All sizes</NativeSelectOption>{SIZES.map((s) => <NativeSelectOption key={s}>{s}</NativeSelectOption>)}</NativeSelect>
          <NativeSelect aria-label="Last order" value={stale} onChange={(e) => setStale(e.target.value)}><NativeSelectOption value="">Any last order</NativeSelectOption><NativeSelectOption value="14">&gt; 14 days ago</NativeSelectOption><NativeSelectOption value="30">&gt; 30 days ago</NativeSelectOption><NativeSelectOption value="45">&gt; 45 days ago</NativeSelectOption></NativeSelect>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid content-start gap-4">
          <MapView pins={rows.map(({ c, r }) => ({ id: c.id, lat: c.lat, lng: c.lng, label: `${c.name}${r ? ` (${HEALTH[r.status]})` : ''}`, color: pinColor(r?.status) }))} onSelect={setSel} />
          <p className="meta">Pin colour matches refill status (green on cycle, amber due soon, red overdue). Hover a pin or see the table for the status in text.</p>
          <Card>
            <CardHeader><CardTitle>Where customers are concentrated</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {conc.map(([k, n]) => (
                <div key={k} className="flex items-center justify-between gap-2 border-b border-border/70 pb-2 text-sm last:border-0 last:pb-0">
                  <span className="truncate">{k}</span>
                  <b className="font-semibold tabular-nums">{n}</b>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="grid content-start gap-4">
          {sc ? (
            <Card>
              <CardHeader><CardTitle>{sc.name}</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" />{sc.phone}</div>
                <div className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{sc.street}, {sc.barangay}, {sc.town}</div>
                <p className="text-muted-foreground">Landmark: {sc.landmark}</p>
                <p className="text-muted-foreground">Cylinder: {sc.size} · holding {sc.heldCylinders} · promo consent: {sc.promoConsent ? 'yes' : 'no'}</p>
                {sr && <div className="flex flex-wrap items-center gap-2">Refill cycle ~{Math.round(sr.cycleDays)} days ({sr.source}) <Pill tone={sr.status === 'overdue' ? 'danger' : sr.status === 'due' ? 'warning' : 'success'}>{sr.status === 'overdue' ? `overdue ${Math.round(-sr.daysUntil)}d` : sr.status === 'due' ? 'due soon' : `next in ${Math.round(sr.daysUntil)}d`}</Pill></div>}
                <h3 className="pt-2 text-sm font-semibold">Order history</h3>
                {ordersOf(d, sc.id).slice(0, 6).map((o) => (
                  <div key={o.id} className="flex items-center gap-2"><span>{o.id}</span><StatusPill s={o.status} /><span className="ml-auto tabular-nums text-muted-foreground">{peso(o.amount)} · {new Date(o.placedAt).toLocaleDateString()}</span></div>
                ))}
              </CardContent>
            </Card>
          ) : <Card><CardContent className="text-sm text-muted-foreground">Select a pin or a row to open the customer profile.</CardContent></Card>}
          <Card>
            <CardContent className="max-h-[420px] overflow-auto">
              <Table><TableBody>{rows.map(({ c, r }) => (
                <TableRow key={c.id} onClick={() => setSel(c.id)} aria-selected={sel === c.id} className={cn('cursor-pointer', sel === c.id && 'bg-accent')}>
                  <TableCell>{c.name}<div className="text-xs text-muted-foreground">{c.barangay}, {c.town}</div></TableCell>
                  <TableCell>{r && <Pill tone={r.status === 'overdue' ? 'danger' : r.status === 'due' ? 'warning' : r.status === 'ok' ? 'success' : 'info'}>{HEALTH[r.status]}</Pill>}</TableCell>
                </TableRow>
              ))}</TableBody></Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
