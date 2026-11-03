import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { Brand } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { homeOf } from '@/lib/rbac'
import { signIn } from '@/lib/session'
import type { User } from '@/lib/types'

export default function SignIn() {
  const nav = useNavigate()
  const { d, user: me } = useAuth()
  const go = (u: User) => { signIn(u); nav(homeOf(d, u)) }
  const sub = (u: User) => `${d.roles.find((r) => r.id === u.roleId)?.name ?? 'No role'} · ${u.branchIds === 'all' ? 'All branches' : u.branchIds.map((b) => d.branches.find((x) => x.id === b)?.name).filter(Boolean).join(', ')}`
  return (
    <div className="mx-auto grid min-h-dvh w-full max-w-md content-center gap-6 px-4 py-8">
      <Link to="/" aria-label="Back to the landing page" className="justify-self-center"><Brand className="text-xl" /></Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>Choose a demo team member. No password is needed in the prototype.{me && <> You are signed in as <b>{me.name}</b>.</>}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {d.users.filter((u) => u.active).map((a) => (
            <button key={a.id} type="button" onClick={() => go(a)} aria-current={me?.id === a.id || undefined} className={cn('flex min-h-14 w-full items-center gap-3 rounded-lg border bg-card p-3 text-left outline-none transition-colors hover:border-primary hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35', me?.id === a.id && 'border-primary bg-accent')}>
              <span className="grid"><span className="text-base font-medium">{a.name}</span><span className="text-sm text-muted-foreground">{sub(a)}</span></span>
              {me?.id === a.id ? <Check className="ml-auto size-4 text-primary" /> : <ChevronRight className="ml-auto size-4 text-muted-foreground" />}
            </button>
          ))}
        </CardContent>
      </Card>
      <p className="meta text-center">Prototype. Data lives in this browser only; reset it from the landing page.</p>
    </div>
  )
}
