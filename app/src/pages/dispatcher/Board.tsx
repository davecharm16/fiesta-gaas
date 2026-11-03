import { toast } from 'sonner'
import { Bike } from 'lucide-react'
import { ChannelTag, StatusPill } from '../../components/ui'
import { ago, byId, nearestRider, peso, unresolvedFailed } from '../../lib/derive'
import { actions } from '../../lib/store'
import { useScopedDB } from '@/lib/auth'
import type { Order } from '../../lib/types'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function Board() {
  const d = useScopedDB()
  // failed orders older than 2 days are history (analytics only), not board work
  const unresolved = new Set(unresolvedFailed(d).map((o) => o.id))
  const run = (fn: () => void) => { try { fn() } catch (e) { toast.error((e as Error).message) } }
  const live = d.orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status) && !(o.status === 'Failed' && !unresolved.has(o.id) && Date.now() - o.placedAt > 2 * 86_400_000)).sort((a, b) => a.placedAt - b.placedAt)
  const queue = live.filter((o) => o.status === 'Placed' || o.status === 'Failed')
  const rest = live.filter((o) => !queue.includes(o))
  const row = (o: Order) => {
    const c = byId(d.customers, o.customerId)!
    const rider = byId(d.riders, o.riderId)
    const near = !o.riderId || o.status === 'Failed' ? nearestRider(d, o) : null
    return (
      <TableRow key={o.id}>
        <TableCell><b className="font-semibold tabular-nums">{o.id}</b><div className="flex items-center gap-1.5 text-xs text-muted-foreground">{ago(o.placedAt)} · <ChannelTag c={o.channel} /></div></TableCell>
        <TableCell>{c.name}<div className="text-xs text-muted-foreground">{c.barangay}, {c.town}</div></TableCell>
        <TableCell>{o.qty}× {o.size}<div className="text-xs tabular-nums text-muted-foreground">{peso(o.amount)} · {o.payment.toUpperCase()}</div></TableCell>
        <TableCell><StatusPill s={o.status} />{o.failReason && <div className="mt-1 text-xs text-muted-foreground">{o.failReason}</div>}
          {o.status === 'Failed' && o.nextAttempt && <div className="num mt-1 text-xs text-muted-foreground">Next attempt {new Date(o.nextAttempt).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })} · {o.failedContact === 'contacted' ? 'customer contacted' : 'customer not contacted'}</div>}</TableCell>
        <TableCell>
          {near ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={() => run(() => actions.assign(o.id, near.r.id))}>Assign {near.r.name} ({near.km.toFixed(1)} km)</Button>
              <NativeSelect size="sm" aria-label={`Assign ${o.id}`} defaultValue="" onChange={(e) => { const v = e.target.value; e.target.value = ''; if (v) run(() => actions.assign(o.id, v)) }}>
                <NativeSelectOption value="">Other rider…</NativeSelectOption>
                {d.riders.filter((r) => r.branchId === o.branchId).map((r) => <NativeSelectOption key={r.id} value={r.id}>{r.name}</NativeSelectOption>)}
              </NativeSelect>
              {o.status === 'Failed' && <>
                <Button variant="outline" size="sm" onClick={() => run(() => { actions.requeue(o.id); toast.success(`${o.id} returned to the queue`) })}>Requeue {o.id}</Button>
                {o.failedContact !== 'contacted' && <Button variant="outline" size="sm" onClick={() => run(() => actions.markContacted(o.id))}>Mark {o.id} contacted</Button>}
              </>}
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>Cancel</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel order {o.id}?</AlertDialogTitle>
                    <AlertDialogDescription>{c.name}'s order will be marked Cancelled and removed from the board.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep order</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => run(() => actions.cancel(o.id))}>Cancel order</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : <span className="inline-flex items-center gap-1.5"><Bike className="size-4 text-muted-foreground" />{rider?.name}</span>}
        </TableCell>
      </TableRow>
    )
  }
  const head = (last: string) => (
    <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead><TableHead>Status</TableHead><TableHead>{last}</TableHead></TableRow></TableHeader>
  )
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="page-title">Order board</h1>
        <p className="meta">Suggested rider = nearest to the customer pin (demo positions)</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Needs a rider ({queue.length})</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto px-0">
          <Table stack>{head('Action')}<TableBody>{queue.map(row)}</TableBody></Table>
          {!queue.length && <p className="px-4 pt-3 text-sm text-muted-foreground">All orders are assigned.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>In progress ({rest.length})</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto px-0">
          <Table stack>{head('Rider')}<TableBody>{rest.map(row)}</TableBody></Table>
        </CardContent>
      </Card>
    </div>
  )
}
