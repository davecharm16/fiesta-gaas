import { useMemo, useSyncExternalStore } from 'react'
import { can, permsOf, roleOf, scopeOf } from './rbac'
import { currentUserId, saveBranch, savedBranch } from './session'
import { useDB } from './store'
import type { DB, Perm } from './types'

const subs = new Set<() => void>()
export const setBranch = (id: string) => { saveBranch(id); subs.forEach((f) => f()) }
const useBranchPick = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), savedBranch)

/** The signed-in user, what they may do, and which branches they are looking at. */
export function useAuth() {
  const d = useDB()
  const pick = useBranchPick()
  const id = currentUserId()
  const user = d.users.find((u) => u.id === id && u.active)
  const scope = scopeOf(d, user)
  const view = pick !== 'all' && scope.includes(pick) ? [pick] : scope
  return { d, user, role: user && roleOf(d, user), perms: user ? permsOf(d, user) : [], can: (p: Perm) => can(d, user, p), scope, view, pick: view.length === 1 && scope.length > 1 ? view[0] : 'all' }
}

/** A copy of the DB limited to the branches in view: used by every admin screen so each one is branch-scoped. */
export function scopeDB(d: DB, view: string[]): DB {
  const inV = new Set(view)
  const custs = d.customers.filter((c) => inV.has(c.branchId))
  const cIds = new Set(custs.map((c) => c.id)), phones = new Set(custs.map((c) => c.phone))
  const riders = d.riders.filter((r) => inV.has(r.branchId)), rIds = new Set(riders.map((r) => r.id))
  const pick = <T,>(m: Record<string, T> | undefined) => Object.fromEntries(Object.entries(m ?? {}).filter(([k]) => inV.has(k))) as Record<string, T>
  return {
    ...d, customers: custs, riders,
    orders: d.orders.filter((o) => inV.has(o.branchId)),
    movements: d.movements.filter((m) => inV.has(m.branchId)),
    sms: d.sms.filter((s) => phones.has(s.to)),
    followUps: d.followUps.filter((f) => cIds.has(f.customerId)),
    blasts: d.blasts.map((b) => ({ ...b, recipients: b.recipients.filter((id) => cIds.has(id)) })).filter((b) => b.recipients.length),
    remits: d.remits.filter((r) => rIds.has(r.riderId)),
    loadouts: d.loadouts?.filter((l) => rIds.has(l.riderId)),
    stocks: pick(d.stocks), thresholds: pick(d.thresholds), openingHeld: pick(d.openingHeld),
  }
}
export function useScopedDB(): DB {
  const { d, view } = useAuth()
  const key = view.join(',')
  return useMemo(() => scopeDB(d, view), [d, key]) // eslint-disable-line react-hooks/exhaustive-deps
}
