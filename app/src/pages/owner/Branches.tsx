import { useState } from 'react'
import { toast } from 'sonner'
import { MapView } from '@/components/MapView'
import { Field, Pill } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TOWNS } from '../../lib/geo'
import { actions, useDB } from '../../lib/store'
import type { Branch } from '../../lib/types'

const run = (f: () => void, ok: string) => { try { f(); toast.success(ok) } catch (e) { toast.error((e as Error).message) } }
const OPEN = ['Placed', 'Assigned', 'Out for delivery']

function Row({ b }: { b: Branch }) {
  const d = useDB()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(b.name); const [address, setAddress] = useState(b.address)
  const riders = d.riders.filter((r) => r.branchId === b.id).length
  const customers = d.customers.filter((c) => c.branchId === b.id).length
  const open = d.orders.filter((o) => o.branchId === b.id && OPEN.includes(o.status)).length
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{b.name}<div className="meta">{b.address || b.town}</div></TableCell>
        <TableCell>{b.town}</TableCell>
        <TableCell className="text-right num">{riders}</TableCell>
        <TableCell className="text-right num">{customers}</TableCell>
        <TableCell className="text-right num">{open}</TableCell>
        <TableCell>{b.active ? <Pill tone="success">Active</Pill> : <Pill tone="neutral">Inactive</Pill>}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" aria-label={`Edit ${b.name}`} onClick={() => setEdit(!edit)}>{edit ? 'Close' : 'Edit'}</Button>
            <Button variant="outline" size="sm" aria-label={`${b.active ? 'Deactivate' : 'Activate'} ${b.name}`} onClick={() => run(() => actions.setBranchActive(b.id, !b.active), b.active ? `${b.name} deactivated` : `${b.name} activated`)}>{b.active ? 'Deactivate' : 'Activate'}</Button>
          </div>
        </TableCell>
      </TableRow>
      {edit && (
        <TableRow>
          <TableCell colSpan={7} className="whitespace-normal bg-muted/40">
            <div className="flex flex-wrap items-end gap-3 py-2">
              <Field label="Branch name" className="min-w-56 flex-1"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="Address" className="min-w-64 flex-1"><Input value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
              <Button onClick={() => run(() => { actions.updateBranch(b.id, { name, address }); setEdit(false) }, 'Branch saved')}>Save</Button>
            </div>
          </TableCell>
        </TableRow>)}
    </>
  )
}

export function Branches() {
  const d = useDB()
  const [f, setF] = useState({ name: '', town: '', address: '' })
  const [pin, setPin] = useState<[number, number]>()
  const known = TOWNS.find((t) => t.name.toLowerCase() === f.town.trim().toLowerCase())
  const pos = pin ?? (known ? ([known.lat, known.lng] as [number, number]) : undefined)
  const ok = f.name.trim() && f.town.trim() && pos
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="page-title">Branches</h1>
        <p className="meta">Each branch has its own depot stock, riders, customers and cash. A new branch is usable immediately. Give staff access to it in Team and roles.</p>
      </div>
      <Card>
        <CardContent className="overflow-x-auto">
          <Table stack>
            <TableHeader><TableRow><TableHead>Branch</TableHead><TableHead>Town</TableHead><TableHead className="text-right">Riders</TableHead><TableHead className="text-right">Customers</TableHead><TableHead className="text-right">Open orders</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
            <TableBody>{d.branches.map((b) => <Row key={b.id} b={b} />)}</TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Register a branch</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-3">
            <Field label="Branch name" className="min-w-56 flex-1"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Urdaneta Depot" /></Field>
            <Field label="Town or city" className="min-w-56 flex-1"><Input list="branch-towns" value={f.town} onChange={(e) => { setF({ ...f, town: e.target.value }); setPin(undefined) }} placeholder="Pick or type any town" /></Field>
            <datalist id="branch-towns">{TOWNS.map((t) => <option key={t.name} value={t.name} />)}</datalist>
            <Field label="Street address" className="min-w-full flex-1"><Input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></Field>
          </div>
          <div className="grid gap-1.5">
            <span className="text-sm font-medium">Depot location</span>
            <span className="meta">{pos ? `Pin at ${pos[0].toFixed(4)}, ${pos[1].toFixed(4)}. Click the map to move it.` : 'Pick a known town, or click the map to place the depot.'}</span>
            <MapView pins={d.branches.map((b) => ({ id: b.id, lat: b.lat, lng: b.lng, label: b.name, color: 'var(--primary)' }))} picked={pos} onPick={(lat, lng) => setPin([lat, lng])} height={220} />
          </div>
          <div><Button disabled={!ok} onClick={() => run(() => { actions.addBranch({ ...f, lat: pos![0], lng: pos![1] }); setF({ name: '', town: '', address: '' }); setPin(undefined) }, 'Branch registered')}>Register branch</Button></div>
        </CardContent>
      </Card>
    </div>
  )
}
