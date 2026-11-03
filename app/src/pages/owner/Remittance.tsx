import { Fragment, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Field, Pill } from '../../components/ui'
import { byId, dayKey, ordersForRemit, peso, remitSnapshot, remitTotals } from '../../lib/derive'
import { actions } from '../../lib/store'
import { useScopedDB } from '@/lib/auth'
import type { Rider } from '../../lib/types'

const time = (t?: number) => (t ? new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '')

function RiderRows({ rider, day }: { rider: Rider; day: string }) {
  const d = useScopedDB()
  const t = remitTotals(d, rider.id, day)
  const rem = t.remit
  const snap = rem?.orders ?? remitSnapshot(ordersForRemit(d, rider.id, day))
  const [cash, setCash] = useState(rem ? String(t.handedOver) : '')
  const [receiver, setReceiver] = useState(rem?.receiver ?? '')
  const [reason, setReason] = useState(rem?.reason ?? '')
  const [editReason, setEditReason] = useState('')
  const [open, setOpen] = useState(false)

  const cashNum = cash === '' ? undefined : Number(cash)
  const diff = cashNum === undefined ? undefined : cashNum - t.expectedCash
  const valid = cashNum !== undefined && Number.isFinite(cashNum) && cashNum >= 0 && receiver.trim() !== ''
    && (diff === 0 || reason.trim() !== '') && (!rem || editReason.trim() !== '')
  const needsReason = diff !== undefined && diff !== 0
  const showDetail = open || needsReason || !!rem

  const save = () => {
    try {
      actions.remit(rider.id, day, { cash: cashNum!, receiver, reason: reason || undefined, editReason: rem ? editReason : undefined })
      setEditReason(''); toast.success('Handover saved')
    } catch (e) { toast.error((e as Error).message) }
  }

  const status = !t.saved ? (t.open ? <Pill tone="danger">Open</Pill> : <Pill tone="neutral">Nothing to hand over</Pill>)
    : t.open ? <Pill tone="danger">Open</Pill>
    : t.difference === 0 ? <Pill tone="success">Balanced</Pill> : <Pill tone="warning">Explained</Pill>

  return (
    <Fragment>
      <TableRow>
        <TableCell className="font-medium">{rider.name}</TableCell>
        <TableCell className="text-right num">{t.deliveries}</TableCell>
        <TableCell className="text-right num">{peso(t.expectedCash)}</TableCell>
        <TableCell className="text-right num">{peso(t.cashReceived)}</TableCell>
        <TableCell className="text-right num">{peso(t.gcash + t.maya)}</TableCell>
        <TableCell><Input className="w-24" aria-label={`Turned over ${rider.name}`} type="number" min={0} value={cash} onChange={(e) => setCash(e.target.value)} /></TableCell>
        <TableCell>{t.difference === undefined && diff === undefined ? '—' : (diff ?? t.difference) === 0 ? <Pill tone="success">Balanced</Pill> : <Pill tone="danger" className="num">{peso((diff ?? t.difference)!)}</Pill>}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell><Button variant="outline" size="sm" aria-expanded={showDetail} onClick={() => setOpen(!open)}>{showDetail ? 'Hide' : 'Orders'}</Button></TableCell>
      </TableRow>
      {showDetail && (
        <TableRow>
          <TableCell colSpan={10} className="whitespace-normal bg-muted/40">
            <div className="grid gap-4 py-2">
              <div className="flex flex-wrap items-end gap-3">
                <Field label="Received by"><Input className="w-48" value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="Receiver name" /></Field>
                <Field label={needsReason ? 'Reason for difference (required)' : 'Reason for difference'} className="min-w-64 flex-1"><Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Customer short, to be collected" /></Field>
                {rem && <Field label="Reason for edit (required)" className="min-w-56 flex-1"><Input value={editReason} onChange={(e) => setEditReason(e.target.value)} placeholder="Why this saved handover changes" /></Field>}
                <Button disabled={!valid} onClick={save}>{rem ? 'Update handover' : 'Save handover'}</Button>
              </div>
              {rem && <p className="meta">Received by {rem.receiver ?? 'unknown'} · {time(rem.at)}{rem.reason ? ` · Reason: ${rem.reason}` : ''}{rem.edits?.length ? ` · Edited ${rem.edits.length} time(s): ${rem.edits.map((e) => `${time(e.at)} (${e.reason})`).join('; ')}` : ''}</p>}
              <p className="meta">GCash and Maya amounts are recorded, not verified.</p>
              {snap.length === 0 ? <p className="meta">No deliveries on this day.</p> : (
                <Table stack>
                  <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Payment</TableHead><TableHead className="text-right">Due</TableHead><TableHead className="text-right">Received / wallet</TableHead><TableHead>Reference or reason</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {snap.map((s) => {
                      const o = byId(d.orders, s.orderId); const c = byId(d.customers, o?.customerId)
                      return (
                        <TableRow key={s.orderId}>
                          <TableCell className="num">{s.orderId}</TableCell>
                          <TableCell>{c?.name ?? '—'}</TableCell>
                          <TableCell>{s.payment === 'cod' ? 'Cash on delivery' : s.payment === 'gcash' ? 'GCash (recorded, not verified)' : 'Maya (recorded, not verified)'}</TableCell>
                          <TableCell className="text-right num">{peso(s.amountDue)}</TableCell>
                          <TableCell className="text-right num">{peso(s.payment === 'cod' ? s.cashReceived : s.walletAmount)}</TableCell>
                          <TableCell>{s.payment === 'cod' ? s.shortReason ?? (s.cashReceived === s.amountDue ? '' : 'No reason recorded') : s.walletRef ?? 'No reference'}</TableCell>
                        </TableRow>)
                    })}
                  </TableBody>
                </Table>)}
            </div>
          </TableCell>
        </TableRow>)}
    </Fragment>
  )
}

export function Remittance() {
  const d = useScopedDB()
  const today = dayKey(Date.now())
  const [day, setDay] = useState(today)
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Rider remittance · {day === today ? 'today' : day}</h1>
          <p className="meta">Expected cash from delivered cash-on-delivery orders vs. cash the rider turned over. GCash and Maya are recorded, not verified.</p>
        </div>
        <Field label="Date"><Input type="date" className="w-44" value={day} max={today} onChange={(e) => e.target.value && setDay(e.target.value)} /></Field>
      </div>
      <Card>
        <CardContent className="overflow-x-auto">
          <Table stack>
            <TableHeader><TableRow><TableHead>Rider</TableHead><TableHead className="text-right">Deliveries</TableHead><TableHead className="text-right">Expected cash</TableHead><TableHead className="text-right">Cash received</TableHead><TableHead className="text-right">E-wallet</TableHead><TableHead>Turned over</TableHead><TableHead>Difference</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Orders</span></TableHead></TableRow></TableHeader>
            <TableBody>
              {d.riders.map((r) => <RiderRows key={`${day}-${r.id}-${d.remits.find((x) => x.riderId === r.id && x.day === day)?.at ?? 0}`} rider={r} day={day} />)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
