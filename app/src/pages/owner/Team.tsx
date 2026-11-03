import { useEffect, useRef, useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { Field, Pill } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PERMS } from '../../lib/rbac'
import { actions, useDB } from '../../lib/store'
import type { DB, Perm, RoleDef, User } from '../../lib/types'

const run = (f: () => void, ok: string) => { try { f(); toast.success(ok) } catch (e) { toast.error((e as Error).message) } }

/** Compact multi-select: a button that summarises the choice, opening a searchable, scrollable list. Scales to many branches. */
function BranchPicker({ d, value, onChange, locked, single }: { d: DB; value: string[] | 'all'; onChange: (v: string[] | 'all') => void; locked?: boolean; single?: boolean }) {
  const [open, setOpen] = useState(false); const [q, setQ] = useState('')
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const off = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', off); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', off); document.removeEventListener('keydown', esc) }
  }, [open])
  const live = d.branches.filter((b) => b.active)
  const all = value === 'all'
  const chosen = all ? live : live.filter((b) => (value as string[]).includes(b.id))
  const label = all ? 'All branches' : chosen.length === 0 ? 'Choose branches' : chosen.length <= 2 ? chosen.map((b) => b.name).join(', ') : `${chosen.length} branches`
  const shown = live.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase()))
  const toggle = (id: string, on: boolean) => single ? onChange([id]) : onChange(on ? [...(value as string[]), id] : (value as string[]).filter((x) => x !== id))
  return (
    <div ref={box} className="relative w-full max-w-64">
      <Button type="button" variant="outline" disabled={locked} aria-haspopup="listbox" aria-expanded={open} aria-label={`Branch access: ${label}`} className="w-full justify-between font-normal" onClick={() => setOpen(!open)}>
        <span className="truncate">{label}</span><ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </Button>
      {open && (
        <div className="absolute left-0 z-30 mt-1 grid w-72 max-w-[85vw] gap-1 rounded-lg border bg-popover p-2 text-popover-foreground shadow-md">
          {live.length > 6 && <Input autoFocus placeholder="Search branches" aria-label="Search branches" value={q} onChange={(e) => setQ(e.target.value)} />}
          {!single && !q && <label className="flex min-h-9 items-center gap-2 rounded px-2 text-sm font-medium hover:bg-accent"><Checkbox checked={all} onCheckedChange={(v) => onChange(v ? 'all' : [])} />All branches</label>}
          <div role="listbox" aria-multiselectable={!single} className="max-h-56 overflow-y-auto">
            {shown.map((b) => (
              <label key={b.id} className="flex min-h-9 items-center gap-2 rounded px-2 text-sm hover:bg-accent">
                <Checkbox checked={all || value.includes(b.id)} disabled={all} onCheckedChange={(v) => toggle(b.id, !!v)} />
                <span className="truncate">{b.name}</span><span className="meta ml-auto shrink-0">{b.town}</span>
              </label>))}
            {shown.length === 0 && <p className="meta px-2 py-2">No branch matches.</p>}
          </div>
          <div className="flex items-center justify-between border-t px-2 pt-2"><span className="meta">{all ? 'Every branch, including new ones' : `${chosen.length} selected`}</span><Button type="button" size="sm" onClick={() => { setOpen(false); setQ('') }}>Done</Button></div>
        </div>)}
    </div>
  )
}

function UserRow({ u }: { u: User }) {
  const d = useDB()
  const [branches, setBranches] = useState<string[] | 'all'>(u.branchIds)
  const dirty = JSON.stringify(branches) !== JSON.stringify(u.branchIds)
  const isOwner = u.roleId === 'role-owner'
  return (
    <TableRow>
      <TableCell className="font-medium">{u.name}{!u.active && <Pill tone="neutral" className="ml-2">Inactive</Pill>}</TableCell>
      <TableCell>
        <NativeSelect aria-label={`Role for ${u.name}`} value={u.roleId} onChange={(e) => run(() => actions.updateUser(u.id, { roleId: e.target.value }), 'Role changed')}>
          {d.roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </NativeSelect>
      </TableCell>
      <TableCell>
        <div className="grid gap-2"><BranchPicker d={d} value={branches} onChange={setBranches} locked={isOwner} single={!!u.riderId} />
          {dirty && <div><Button size="sm" onClick={() => run(() => actions.updateUser(u.id, { branchIds: branches }), 'Branch access saved')}>Save access</Button></div>}</div>
      </TableCell>
      <TableCell><Button variant="outline" size="sm" aria-label={`${u.active ? 'Deactivate' : 'Activate'} ${u.name}`} onClick={() => run(() => actions.updateUser(u.id, { active: !u.active }), u.active ? 'User deactivated' : 'User activated')}>{u.active ? 'Deactivate' : 'Activate'}</Button></TableCell>
    </TableRow>
  )
}

function RoleCard({ r }: { r: RoleDef }) {
  const d = useDB()
  const [name, setName] = useState(r.name); const [perms, setPerms] = useState<Perm[]>(r.perms)
  const fixed = r.id === 'role-owner'
  const dirty = name !== r.name || [...perms].sort().join() !== [...r.perms].sort().join()
  const isApp = perms.some((p) => p.startsWith('app.'))
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2">{r.name}{fixed && <Pill tone="info">Fixed: every admin permission</Pill>}{r.system && !fixed && <Pill tone="neutral">Built in</Pill>}<span className="meta ml-auto font-normal">{d.users.filter((u) => u.roleId === r.id).length} users</span></CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {!fixed && <Field label="Role name" className="max-w-sm"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>}
        <div className="grid gap-1 sm:grid-cols-2">
          {PERMS.map(([p, label, hint]) => (
            <label key={p} className="flex items-start gap-2 text-sm"><Checkbox className="mt-0.5" checked={fixed ? !p.startsWith('app.') : perms.includes(p)} disabled={fixed || (isApp ? !p.startsWith('app.') : p.startsWith('app.') && perms.length > 0)} onCheckedChange={(v) => setPerms(v ? [...perms, p] : perms.filter((x) => x !== p))} /><span><span className="font-medium">{label}</span><span className="meta block">{hint}</span></span></label>
          ))}
        </div>
        {!fixed && <div className="flex gap-2">
          <Button disabled={!dirty} onClick={() => run(() => actions.saveRole({ id: r.id, name, perms }), 'Role saved')}>Save role</Button>
          {!r.system && <Button variant="outline" onClick={() => run(() => actions.deleteRole(r.id), 'Role deleted')}>Delete role</Button>}
        </div>}
      </CardContent>
    </Card>
  )
}

export function Team() {
  const d = useDB()
  const [tab, setTab] = useState<'users' | 'roles'>('users')
  const [nu, setNu] = useState<{ name: string; roleId: string; branchIds: string[] | 'all' }>({ name: '', roleId: 'role-dispatcher', branchIds: [] })
  const [nr, setNr] = useState({ name: '', perms: [] as Perm[] })
  const roleOf = (id: string) => d.roles.find((r) => r.id === id)
  const needsOne = !!roleOf(nu.roleId)?.perms.includes('app.rider')
  const okUser = nu.name.trim() && (nu.branchIds === 'all' ? !needsOne : nu.branchIds.length > 0 && (!needsOne || nu.branchIds.length === 1))
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="page-title">Team and roles</h1>
        <p className="meta">A role says what a person can do. Branch access says where. Both are enforced on every action, not only hidden in the menu.</p>
      </div>
      <div className="flex gap-2">
        {(['users', 'roles'] as const).map((k) => <Button key={k} variant={tab === k ? 'default' : 'outline'} aria-pressed={tab === k} onClick={() => setTab(k)}>{k === 'users' ? 'People' : 'Roles and permissions'}</Button>)}
      </div>
      {tab === 'users' ? <>
        <Card><CardContent className="overflow-x-auto">
          <Table stack>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Branch access</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
            <TableBody>{d.users.map((u) => <UserRow key={`${u.id}-${u.roleId}-${JSON.stringify(u.branchIds)}`} u={u} />)}</TableBody>
          </Table>
        </CardContent></Card>
        <Card>
          <CardHeader><CardTitle>Add a person</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex flex-wrap items-end gap-3">
              <Field label="Name" className="min-w-56 flex-1"><Input value={nu.name} onChange={(e) => setNu({ ...nu, name: e.target.value })} /></Field>
              <Field label="Role"><NativeSelect value={nu.roleId} onChange={(e) => setNu({ ...nu, roleId: e.target.value, branchIds: e.target.value === 'role-owner' ? 'all' : [] })}>{d.roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</NativeSelect></Field>
            </div>
            <div className="grid gap-1.5"><span className="text-sm font-medium">Branch access{needsOne ? ' (a rider works from one branch)' : ''}</span><BranchPicker d={d} value={nu.branchIds} onChange={(v) => setNu({ ...nu, branchIds: v })} locked={nu.roleId === 'role-owner'} single={needsOne} /></div>
            <div><Button disabled={!okUser} onClick={() => run(() => { actions.addUser(nu); setNu({ ...nu, name: '', branchIds: [] }) }, 'Person added. They can sign in now.')}>Add person</Button></div>
          </CardContent>
        </Card>
      </> : <>
        {d.roles.map((r) => <RoleCard key={`${r.id}-${r.name}-${r.perms.join()}`} r={r} />)}
        <Card>
          <CardHeader><CardTitle>Create a role</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <Field label="Role name" className="max-w-sm"><Input value={nr.name} onChange={(e) => setNr({ ...nr, name: e.target.value })} placeholder="e.g. Cashier" /></Field>
            <div className="grid gap-1 sm:grid-cols-2">
              {PERMS.filter(([p]) => !p.startsWith('app.')).map(([p, label, hint]) => (
                <label key={p} className="flex items-start gap-2 text-sm"><Checkbox className="mt-0.5" checked={nr.perms.includes(p)} onCheckedChange={(v) => setNr({ ...nr, perms: v ? [...nr.perms, p] : nr.perms.filter((x) => x !== p) })} /><span><span className="font-medium">{label}</span><span className="meta block">{hint}</span></span></label>
              ))}
            </div>
            <div><Button disabled={!nr.name.trim() || nr.perms.length === 0} onClick={() => run(() => { actions.saveRole(nr); setNr({ name: '', perms: [] }) }, 'Role created')}>Create role</Button></div>
          </CardContent>
        </Card>
      </>}
    </div>
  )
}
