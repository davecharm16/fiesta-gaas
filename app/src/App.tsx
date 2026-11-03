import { BarChart3, ClipboardList, Boxes, Banknote, BellRing, Building2, CircleDollarSign, Megaphone, Home, Inbox as InboxIcon, Map, PlusCircle, Receipt, Bike, CheckCircle2, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Shell, type Tab } from './components/ui'
import { Card, CardContent } from '@/components/ui/card'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import { useAuth } from './lib/auth'
import type { Perm } from './lib/types'
import { Inbox, OrderPage, Orders } from './pages/customer/Customer'
import Board from './pages/dispatcher/Board'
import Customers from './pages/dispatcher/Customers'
import NewOrder from './pages/dispatcher/NewOrder'
import Dashboard from './pages/owner/Dashboard'
import { Blast, FollowUps } from './pages/owner/Engage'
import { Inventory } from './pages/owner/Inventory'
import { Remittance } from './pages/owner/Remittance'
import { Branches } from './pages/owner/Branches'
import { Team } from './pages/owner/Team'
import { Pricing } from './pages/owner/Pricing'
import { Cash, Done, Job, Jobs, Truck } from './pages/rider/Rider'

const OWNER_PERMS: Perm[] = ['pricing.manage', 'analytics.view', 'followups.manage', 'blast.send', 'inventory.view', 'cash.view', 'branches.manage', 'users.manage']
const DISPATCH_PERMS: Perm[] = ['orders.dispatch', 'orders.create', 'customers.manage']

/** Sign-in and permission gate. Wrong or missing sign-in goes to the single sign-in page; a missing permission shows a clear message. */
function Guard({ any, children }: { any: Perm[]; children: ReactNode }) {
  const a = useAuth()
  return a.user && any.some((p) => a.can(p)) ? children : <Navigate to="/signin" replace />
}
function Need({ perm, children }: { perm: Perm; children: ReactNode }) {
  const a = useAuth()
  return a.can(perm) ? children : <Card><CardContent className="flex items-center gap-2 text-sm"><ShieldCheck className="size-4 text-muted-foreground" />Your role ({a.role?.name}) does not include access to this page. Ask the owner to change your role in Team.</CardContent></Card>
}
const OWNER_TABS: Tab[] = [['', 'Analytics', BarChart3, 'analytics.view'], ['follow-ups', 'Follow-ups', BellRing, 'followups.manage'], ['blast', 'SMS blast', Megaphone, 'blast.send'], ['inventory', 'Inventory', Boxes, 'inventory.view'], ['remittance', 'Remittance', Banknote, 'cash.view'], ['pricing', 'Prices and fees', CircleDollarSign, 'pricing.manage'], ['branches', 'Branches', Building2, 'branches.manage'], ['team', 'Team and roles', ShieldCheck, 'users.manage']]
/** Owner home: Analytics when allowed, otherwise the first page the role can open. */
function OwnerHome() {
  const a = useAuth()
  const first = OWNER_TABS.find(([, , , p]) => a.can(p!))
  return !first ? <Navigate to="/signin" replace /> : first[0] === '' ? <Dashboard /> : <Navigate to={`/owner/${first[0]}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/customer" element={<Guard any={['app.customer']}><Shell phone title="Customer app" base="/customer" tabs={[['', 'Order', Home], ['orders', 'My orders', Receipt], ['inbox', 'Messages', InboxIcon]]} /></Guard>}>
        <Route index element={<OrderPage />} /><Route path="orders" element={<Orders />} /><Route path="inbox" element={<Inbox />} />
      </Route>
      <Route path="/dispatcher" element={<Guard any={DISPATCH_PERMS}><Shell title="Dispatcher" base="/dispatcher" tabs={[['', 'Order board', ClipboardList, 'orders.dispatch'], ['new', 'New order', PlusCircle, 'orders.create'], ['customers', 'Customers & map', Map, 'customers.manage']]} /></Guard>}>
        <Route index element={<Need perm="orders.dispatch"><Board /></Need>} /><Route path="new" element={<Need perm="orders.create"><NewOrder /></Need>} /><Route path="customers" element={<Need perm="customers.manage"><Customers /></Need>} />
      </Route>
      <Route path="/rider" element={<Guard any={['app.rider']}><Shell phone title="Rider app" base="/rider" tabs={[['', 'Route', Bike], ['truck', 'Truck', Boxes], ['cash', 'Cash', Banknote], ['done', 'Done', CheckCircle2]]} /></Guard>}>
        <Route index element={<Jobs />} /><Route path="truck" element={<Truck />} /><Route path="cash" element={<Cash />} /><Route path="done" element={<Done />} /><Route path="job/:id" element={<Job />} />
      </Route>
      <Route path="/owner" element={<Guard any={OWNER_PERMS}><Shell title="Management" base="/owner" tabs={OWNER_TABS} /></Guard>}>
        <Route index element={<OwnerHome />} />
        <Route path="follow-ups" element={<Need perm="followups.manage"><FollowUps /></Need>} />
        <Route path="blast" element={<Need perm="blast.send"><Blast /></Need>} />
        <Route path="inventory" element={<Need perm="inventory.view"><Inventory /></Need>} />
        <Route path="remittance" element={<Need perm="cash.view"><Remittance /></Need>} />
        <Route path="pricing" element={<Need perm="pricing.manage"><Pricing /></Need>} />
        <Route path="branches" element={<Need perm="branches.manage"><Branches /></Need>} />
        <Route path="team" element={<Need perm="users.manage"><Team /></Need>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
