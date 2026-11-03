export type Size = '11kg' | '22kg' | '50kg'
export const SIZES: Size[] = ['11kg', '22kg', '50kg']
export type Channel = 'app' | 'call' | 'text' | 'walk-in'
export type Status = 'Placed' | 'Assigned' | 'Out for delivery' | 'Delivered' | 'Failed' | 'Cancelled'
export type Payment = 'cod' | 'gcash' | 'maya'
export type Outcome = 'Reached' | 'Ordered' | 'Switched supplier' | 'Not interested' | 'Call back later'

export type FollowUpLossReason = 'Switched supplier' | 'Price' | 'Not due' | 'No response' | 'Other'
export type MovementKind = 'delivery' | 'stock-in' | 'adjustment' | 'load-out' | 'load-return' | 'transfer'

export interface Branch { id: string; name: string; town: string; address: string; lat: number; lng: number; active: boolean }
export type Stock = { full: Record<Size, number>; empty: Record<Size, number> }

export interface Customer {
  id: string
  /** Branch that serves this customer. */
  branchId: string
  name: string
  phone: string
  town: string
  barangay: string
  street: string
  landmark: string
  lat: number
  lng: number
  size: Size
  promoConsent: boolean
  heldCylinders: number
  /** Cylinders held by size. When absent, derive from `size` + `heldCylinders`. */
  heldBySize?: Partial<Record<Size, number>>
}
export interface Rider { id: string; name: string; phone: string; branchId: string }
export interface Order {
  id: string
  branchId: string
  customerId: string
  size: Size
  qty: number
  type: 'refill' | 'new'
  channel: Channel
  status: Status
  payment: Payment
  amount: number
  placedAt: number
  assignedAt?: number
  deliveredAt?: number
  riderId?: string
  failReason?: string
  cashCollected?: number
  empties?: number
  shortReason?: string
  walletRef?: string
  emptiesExpected?: number
  emptiesReturned?: number
  stopSeq?: number
  failedContact?: 'not-contacted' | 'contacted'
  nextAttempt?: number
  pod?: { kind: 'otp' | 'photo'; photo?: string; at: number; lat: number; lng: number }
}
export interface Sms { id: string; to: string; text: string; at: number; kind: 'status' | 'reminder' | 'blast' | 'otp' }
export interface FollowUp {
  id: string
  customerId: string
  outcome: Outcome
  at: number
  callbackAt?: number
  snoozedUntil?: number
  lostReason?: FollowUpLossReason
  /** Snooze-only record: not a real contact, ignored by the contact indicator. */
  noContact?: boolean
}
export interface Blast { id: string; message: string; segment: string; recipients: string[]; at: number }
export interface Movement {
  id: string
  branchId: string
  at: number
  kind: MovementKind
  size: Size
  full: number
  empty: number
  note: string
  reason?: string
  riderId?: string
  orderId?: string
  drNumber?: string
  emptiesHandedBack?: number
  /** Delivery made from a rider's load-out: recorded, but depot stock was already deducted at load-out. */
  onTruck?: boolean
}
export interface RemitOrderSnapshot {
  orderId: string
  amountDue: number
  payment: Payment
  cashReceived: number
  walletAmount: number
  walletRef?: string
  shortReason?: string
}
export interface Remit {
  riderId: string
  day: string
  /** Legacy field, kept equal to `cash` for new records. */
  turnedOver: number
  expected?: number
  cash?: number
  gcash?: number
  maya?: number
  receiver?: string
  at?: number
  /** Reason for a nonzero handover difference. */
  reason?: string
  edits?: { at: number; reason: string }[]
  orders?: RemitOrderSnapshot[]
}
export interface LoadoutLine { full: number; empty: number }
export interface Loadout {
  riderId: string
  day: string
  outAt?: number
  returnedAt?: number
  out?: Partial<Record<Size, LoadoutLine>>
  returned?: Partial<Record<Size, LoadoutLine>>
}
/** Money settings. `base` is the business default; a branch may override any single value. */
export interface Pricing {
  refill: Record<Size, number>
  deposit: Record<Size, number>
  /** Delivery fee by town name. */
  fees: Record<string, number>
  /** Cost of one SMS, for the blast estimate. */
  smsCost: number
}
export interface PricingOverride { refill?: Partial<Record<Size, number>>; deposit?: Partial<Record<Size, number>>; fees?: Record<string, number> }
export interface PricingSettings { base: Pricing; byBranch: Record<string, PricingOverride> }
export interface DB {
  pricing: PricingSettings
  customers: Customer[]
  riders: Rider[]
  orders: Order[]
  sms: Sms[]
  followUps: FollowUp[]
  blasts: Blast[]
  movements: Movement[]
  remits: Remit[]
  branches: Branch[]
  roles: RoleDef[]
  users: User[]
  /** Depot stock per branch id. */
  stocks: Record<string, Stock>
  seededAt: number
  loadouts?: Loadout[]
  /** Cylinders held by customers when the demo started, per branch id. */
  openingHeld?: Record<string, Partial<Record<Size, number>>>
  /** Owner low-stock alert level per branch id and size. */
  thresholds?: Record<string, Partial<Record<Size, number>>>
}

export type Perm =
  | 'orders.create' | 'orders.dispatch' | 'customers.manage'
  | 'followups.manage' | 'blast.send' | 'analytics.view'
  | 'inventory.view' | 'inventory.manage' | 'cash.view' | 'cash.record'
  | 'pricing.manage' | 'branches.manage' | 'users.manage' | 'app.rider' | 'app.customer'
export interface RoleDef { id: string; name: string; perms: Perm[]; system?: boolean }
export interface User {
  id: string
  name: string
  roleId: string
  /** Branch ids the user may work in, or 'all'. */
  branchIds: string[] | 'all'
  active: boolean
  riderId?: string
  customerId?: string
}
