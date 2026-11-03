import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Field, Pill } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/lib/auth'
import { pricingOf } from '../../lib/derive'
import { actions } from '../../lib/store'
import { SIZES, type Size } from '../../lib/types'

const peso = (n: number) => '₱' + n.toLocaleString()
type Key = `refill:${Size}` | `deposit:${Size}` | `fee:${string}`

/** One number input. Branch scope shows the inherited value as a placeholder and marks overridden values. */
function Cell({ k, value, inherited, branch, draft, setDraft }: { k: Key; value: number; inherited?: number; branch: boolean; draft: Record<string, string>; setDraft: (d: Record<string, string>) => void }) {
  const overridden = branch && inherited !== undefined && value !== inherited
  return (
    <div className="flex items-center gap-2">
      <Input className="w-28 text-right" type="number" min={0} aria-label={k.replace(':', ' ')} placeholder={String(inherited ?? value)} value={draft[k] ?? String(value)} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
      {branch && (overridden ? <Pill tone="info">Branch price</Pill> : <span className="meta">Default</span>)}
    </div>
  )
}

export function Pricing() {
  const a = useAuth()
  const { d } = a
  const everything = a.user?.branchIds === 'all'
  const scopes = [...(everything ? [['base', 'Business default (all branches)'] as const] : []), ...a.scope.map((id) => [id, d.branches.find((b) => b.id === id)?.name ?? id] as const)]
  const [pick, setPick] = useState<string>(scopes[0]?.[0] ?? 'base')
  const scope = scopes.some(([id]) => id === pick) ? pick : scopes[0]?.[0] ?? 'base'
  const branch = scope !== 'base'
  const eff = pricingOf(d, branch ? scope : undefined), base = d.pricing.base
  const towns = Object.keys(base.fees)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [sms, setSms] = useState<string>()
  const key = `${scope}-${JSON.stringify(d.pricing)}`
  // Reset the form whenever the scope changes or a save lands.
  const [seen, setSeen] = useState(key)
  if (seen !== key) { setSeen(key); setDraft({}); setSms(undefined) }
  const dirty = useMemo(() => Object.keys(draft).length > 0 || sms !== undefined, [draft, sms])

  const save = () => {
    try {
      const refill: Partial<Record<Size, number>> = {}, deposit: Partial<Record<Size, number>> = {}, fees: Record<string, number> = {}
      for (const [k, v] of Object.entries(draft)) {
        const n = Number(v); if (v.trim() === '' || !Number.isFinite(n)) throw new Error('Enter a number for every price you change')
        const [kind, name] = [k.slice(0, k.indexOf(':')), k.slice(k.indexOf(':') + 1)]
        if (kind === 'refill') refill[name as Size] = n; else if (kind === 'deposit') deposit[name as Size] = n; else fees[name] = n
      }
      actions.setPricing(scope, { refill, deposit, fees, ...(sms !== undefined && !branch ? { smsCost: Number(sms) } : {}) })
      toast.success('Prices saved. New orders use them from now on.')
    } catch (e) { toast.error((e as Error).message) }
  }
  const resetBranch = () => {
    try {
      const o = d.pricing.byBranch[scope] ?? {}
      actions.setPricing(scope, { refill: Object.fromEntries(Object.keys(o.refill ?? {}).map((s) => [s, null])), deposit: Object.fromEntries(Object.keys(o.deposit ?? {}).map((s) => [s, null])), fees: Object.fromEntries(Object.keys(o.fees ?? {}).map((s) => [s, null])) })
      toast.success('This branch now follows the business default')
    } catch (e) { toast.error((e as Error).message) }
  }
  const hasOverride = branch && Object.values(d.pricing.byBranch[scope] ?? {}).some((x) => x && Object.keys(x).length)

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Prices and fees</h1>
          <p className="meta">Set the business default once. A branch can override any single price; everything else keeps following the default. Existing orders keep the price they were placed at.</p>
        </div>
        <Field label="Editing"><NativeSelect value={scope} onChange={(e) => setPick(e.target.value)}>{scopes.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</NativeSelect></Field>
      </div>
      {!everything && <p className="meta">You can edit prices for your own branches. Only someone with access to all branches can change the business default.</p>}
      <Card>
        <CardHeader><CardTitle>Refill price and cylinder deposit</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table stack>
            <TableHeader><TableRow><TableHead>Size</TableHead><TableHead>Refill price</TableHead><TableHead>Deposit (new cylinder)</TableHead></TableRow></TableHeader>
            <TableBody>
              {SIZES.map((s) => (
                <TableRow key={s}>
                  <TableCell className="font-medium">{s.toUpperCase()}</TableCell>
                  <TableCell><Cell k={`refill:${s}`} value={eff.refill[s]} inherited={base.refill[s]} branch={branch} draft={draft} setDraft={setDraft} /></TableCell>
                  <TableCell><Cell k={`deposit:${s}`} value={eff.deposit[s]} inherited={base.deposit[s]} branch={branch} draft={draft} setDraft={setDraft} /></TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Delivery fee by town</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table stack>
            <TableHeader><TableRow><TableHead>Town</TableHead><TableHead>Delivery fee</TableHead></TableRow></TableHeader>
            <TableBody>
              {towns.map((t) => (
                <TableRow key={t}><TableCell className="font-medium">{t}</TableCell><TableCell><Cell k={`fee:${t}`} value={eff.fees[t]} inherited={base.fees[t]} branch={branch} draft={draft} setDraft={setDraft} /></TableCell></TableRow>))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {!branch && (
        <Card>
          <CardHeader><CardTitle>SMS cost</CardTitle></CardHeader>
          <CardContent className="flex items-end gap-3">
            <Field label="Cost of one SMS (₱), used for the blast estimate"><Input className="w-32 text-right" type="number" step="0.01" min={0} value={sms ?? String(base.smsCost)} onChange={(e) => setSms(e.target.value)} /></Field>
          </CardContent>
        </Card>)}
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={!dirty} onClick={save}>Save prices</Button>
        {dirty && <Button variant="outline" onClick={() => { setDraft({}); setSms(undefined) }}>Discard changes</Button>}
        {hasOverride && <Button variant="outline" onClick={resetBranch}>Reset this branch to the default</Button>}
        {branch && <span className="meta">Example: an 11kg refill here costs {peso(eff.refill['11kg'])}{eff.refill['11kg'] !== base.refill['11kg'] ? ` (default ${peso(base.refill['11kg'])})` : ''}.</span>}
      </div>
    </div>
  )
}
