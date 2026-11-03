import type { DB, Perm, RoleDef, User } from './types'

export const PERMS: [Perm, string, string][] = [
  ['orders.create', 'Take orders', 'Enter phone and walk-in orders'],
  ['orders.dispatch', 'Dispatch', 'Assign riders, requeue and cancel orders'],
  ['customers.manage', 'Customers', 'Add and edit customers'],
  ['followups.manage', 'Follow-ups', 'Call list, log outcomes, snooze'],
  ['blast.send', 'SMS blasts', 'Send promotions'],
  ['analytics.view', 'Analytics', 'View the business overview'],
  ['inventory.view', 'View stock', 'See stock and movements'],
  ['inventory.manage', 'Manage stock', 'Receive, count, load-out, transfer, thresholds'],
  ['cash.view', 'View cash', 'See rider remittance'],
  ['cash.record', 'Record cash', 'Save rider handovers'],
  ['pricing.manage', 'Prices and fees', 'Edit refill prices, deposits and delivery fees'],
  ['branches.manage', 'Branches', 'Register and edit branches'],
  ['users.manage', 'Team and roles', 'Add users, edit roles'],
  ['app.rider', 'Rider app', 'Deliver orders'],
  ['app.customer', 'Customer app', 'Order gas as a customer'],
]
const ALL = PERMS.map(([p]) => p)
const ADMIN = ALL.filter((p) => !p.startsWith('app.'))

export const SYSTEM_ROLES: RoleDef[] = [
  { id: 'role-owner', name: 'Owner', perms: ADMIN, system: true },
  { id: 'role-manager', name: 'Branch manager', perms: ADMIN.filter((p) => p !== 'branches.manage' && p !== 'users.manage') },
  { id: 'role-dispatcher', name: 'Dispatcher', perms: ['orders.create', 'orders.dispatch', 'customers.manage', 'inventory.view'] },
  { id: 'role-rider', name: 'Rider', perms: ['app.rider'] },
  { id: 'role-customer', name: 'Customer', perms: ['app.customer'] },
]

export const roleOf = (d: DB, u: User) => d.roles.find((r) => r.id === u.roleId)
/** Owner role is locked to every admin permission so the business can never lock itself out. */
export const permsOf = (d: DB, u: User): Perm[] => (u.roleId === 'role-owner' ? ADMIN : roleOf(d, u)?.perms ?? [])
export const can = (d: DB, u: User | undefined | null, p: Perm) => !!u && u.active && permsOf(d, u).includes(p)
/** Branch ids the user may work in (active branches only). */
export const scopeOf = (d: DB, u: User | undefined | null): string[] => {
  if (!u || !u.active) return []
  const live = d.branches.filter((b) => b.active).map((b) => b.id)
  return u.branchIds === 'all' ? live : live.filter((id) => (u.branchIds as string[]).includes(id))
}
/** Where a user lands after sign-in. */
export const homeOf = (d: DB, u: User) =>
  can(d, u, 'app.rider') ? '/rider' : can(d, u, 'app.customer') ? '/customer'
  : can(d, u, 'analytics.view') || can(d, u, 'inventory.view') && !can(d, u, 'orders.dispatch') ? '/owner' : can(d, u, 'orders.dispatch') || can(d, u, 'orders.create') ? '/dispatcher' : '/owner'
