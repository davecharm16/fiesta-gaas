import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2, Flame, WifiOff, Phone, MessageSquare, Smartphone, Store, Users, type LucideIcon } from 'lucide-react'
import type { Channel, Perm, Status } from '../lib/types'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { setBranch, useAuth } from '@/lib/auth'
import { NativeSelect } from '@/components/ui/native-select'
import { cn } from '@/lib/utils'

export const Brand = ({ className }: { className?: string }) => (
  <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight', className)}>
    <span className="grid size-6 place-items-center rounded-md bg-brand-strong"><Flame className="size-3.5 fill-white text-white" /></span>Fiesta Gas
  </span>
)

type Tone = 'warning' | 'info' | 'success' | 'danger' | 'neutral'
const TONE: Record<Tone, { pill: string; dot: string }> = {
  warning: { pill: 'bg-warning-soft text-warning-foreground border-warning/20', dot: 'bg-warning' },
  info: { pill: 'bg-info-soft text-info-foreground border-info/20', dot: 'bg-info' },
  success: { pill: 'bg-success-soft text-success-foreground border-success/20', dot: 'bg-success' },
  danger: { pill: 'bg-destructive/10 text-destructive border-destructive/20', dot: 'bg-destructive' },
  neutral: { pill: 'bg-muted text-foreground border-border', dot: 'bg-muted-foreground' },
}
/** Status badge: soft tone + dot + explicit label. Pages can reuse for any custom status. */
export const Pill = ({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) => (
  <Badge variant="outline" className={cn(TONE[tone].pill, className)}><span className={cn('size-1.5 rounded-full', TONE[tone].dot)} />{children}</Badge>
)

const STATUS: Record<Status, Tone> = { Placed: 'warning', Assigned: 'info', 'Out for delivery': 'info', Delivered: 'success', Failed: 'danger', Cancelled: 'neutral' }
export const StatusPill = ({ s }: { s: Status }) => <Pill tone={STATUS[s]}>{s}</Pill>

/** Refill-health badge: on cycle / due / overdue. */
export const HealthBadge = ({ s }: { s: 'ok' | 'due' | 'overdue' }) => (
  <Pill tone={s === 'ok' ? 'success' : s === 'due' ? 'warning' : 'danger'}>{s === 'ok' ? 'On cycle' : s === 'due' ? 'Due' : 'Overdue'}</Pill>
)

const CH_ICON: Record<Channel, LucideIcon> = { app: Smartphone, call: Phone, text: MessageSquare, 'walk-in': Store }
export const ChannelTag = ({ c }: { c: Channel }) => { const I = CH_ICON[c]; return <span className="inline-flex items-center gap-1.5 capitalize"><I className="size-3.5 text-muted-foreground" />{c}</span> }

export const Field = ({ label, children, className }: { label: string; children: ReactNode; className?: string }) => (
  <label className={cn('grid gap-1.5 text-sm font-medium text-foreground', className)}>{label}{children}</label>
)
export const Done = ({ children }: { children: ReactNode }) => <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-[18px]" />{children}</div>

function useOnline() {
  const [on, set] = useState(navigator.onLine)
  useEffect(() => { const f = () => set(navigator.onLine); addEventListener('online', f); addEventListener('offline', f); return () => { removeEventListener('online', f); removeEventListener('offline', f) } }, [])
  return on
}
const OfflineBanner = () => useOnline() ? null : (
  <Alert className="rounded-none border-x-0 border-t-0"><WifiOff /><AlertDescription>Offline. The app shell still works; rider actions would sync when back online (simulated).</AlertDescription></Alert>
)

export type Tab = [to: string, label: string, icon: LucideIcon, perm?: Perm]
const href = (base: string, to: string) => `${base}/${to}`.replace(/\/$/, '')

/** Customer + rider: phone-width shell, bottom navigation. Dispatcher + owner: sidebar admin shell. */
export function Shell({ title, base, tabs, phone, right }: { title: string; base: string; tabs: Tab[]; phone?: boolean; right?: ReactNode }) {
  const { pathname } = useLocation()
  const here = tabs.find(([to]) => href(base, to) === pathname.replace(/\/$/, '')) ?? tabs.find(([to]) => to && pathname.startsWith(href(base, to)))
  const auth = useAuth(); const user = auth.user
  const allowed = tabs.filter(([, , , p]) => !p || auth.can(p))
  const header = (
    <header className={cn('sticky top-0 z-10 flex h-14 items-center gap-3 border-b px-4', phone ? 'border-primary bg-primary text-primary-foreground' : 'bg-card md:px-6')}>
      {!phone && <SidebarTrigger className="-ml-1" />}
      <Link to="/" aria-label="Home" className={phone ? 'text-primary-foreground' : 'md:hidden'}><Brand /></Link>
      <span className={phone ? 'text-base font-semibold' : 'text-sm font-medium text-foreground'}>{phone ? title : here?.[1] ?? title}</span>
      <div className="ml-auto flex items-center gap-2">{right}{!phone && auth.scope.length > 1 && <NativeSelect aria-label="Branch" className="w-44" value={auth.pick} onChange={(e) => setBranch(e.target.value)}><option value="all">All branches</option>{auth.scope.map((id) => <option key={id} value={id}>{auth.d.branches.find((b) => b.id === id)?.name}</option>)}</NativeSelect>}{!phone && auth.scope.length === 1 && <Badge variant="outline">{auth.d.branches.find((b) => b.id === auth.scope[0])?.name}</Badge>}{!phone && <Badge variant="secondary" className="hidden sm:inline-flex">Demo</Badge>}{user && <span className={cn('hidden text-sm font-medium', phone ? 'min-[480px]:hidden' : 'sm:inline')}>{user.name}</span>}<Button variant={phone ? 'ghost' : 'outline'} size={phone ? 'icon' : 'sm'} className={phone ? 'size-11 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground' : undefined} aria-label="Switch user" render={<Link to="/signin" />}><Users /><span className={phone ? 'sr-only' : 'hidden sm:inline'}>Switch user</span></Button></div>
    </header>
  )
  if (phone) return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col border-x border-border bg-background">
      {header}<OfflineBanner />
      <main className="flex-1 p-4 pb-24 text-base"><Outlet /></main>
      <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
        {allowed.map(([to, label, Icon]) => (
          <NavLink key={to} end={to === ''} to={href(base, to)} className={({ isActive }) => cn('relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium', isActive ? 'text-primary before:absolute before:inset-x-4 before:top-0 before:h-0.5 before:bg-primary' : 'text-muted-foreground hover:text-foreground')}>
            <Icon className="size-5" /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <Toaster />
    </div>
  )
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-4"><Link to="/" aria-label="Home"><Brand /></Link></SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/70">{title}</p>
            <SidebarGroupContent>
              <SidebarMenu>
                {allowed.map(([to, label, Icon]) => (
                  <SidebarMenuItem key={to}>
                    <NavLink end={to === ''} to={href(base, to)}>
                      {({ isActive }) => <SidebarMenuButton isActive={isActive} render={<span />}><Icon /><span>{label}</span></SidebarMenuButton>}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{header}<OfflineBanner /><main className="mx-auto w-full max-w-[1200px] flex-1 p-4 md:p-6"><Outlet /></main></SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
