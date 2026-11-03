import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { Brand } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { actions } from '@/lib/store'

const ROLES = [
  ['Customers', 'Reorder a refill in a minute, track the rider, see history. Installs from an SMS link, no app store.'],
  ['Dispatchers', 'Encode call and text orders, assign the nearest rider, manage the Pangasinan customer map.'],
  ['Riders', 'Delivery list, cash collected, proof of delivery with a customer code, and failed-delivery reasons.'],
  ['Owners', 'Delivery times, who to call before they switch supplier, promo results, stock and remittance.'],
] as const

const FACTS = [
  ['4', 'team roles'],
  ['SMS', 'order confirmations'],
  ['Cash + GCash', 'payment tracking'],
  ['Pangasinan', 'service coverage'],
] as const

const STEPS = [
  ['Customer', 'taps Reorder. An SMS confirmation lands in their inbox.'],
  ['Dispatcher', 'sees it on the board, assigns the suggested nearest rider, and encodes a phone-call order for a new customer.'],
  ['Rider', 'starts the delivery, collects cash, confirms with the customer\'s code (demo code 4821) and logs the empty collected.'],
  ['Owner', 'sees stock drop and the dashboard move, picks overdue customers to call, and sends a promo blast.'],
] as const

export default function Landing() {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto grid max-w-4xl gap-12 px-4 py-6 sm:py-8">
        <header className="flex items-center gap-3 border-b pb-4"><Brand className="text-lg" />        </header>

        <section className="grid gap-5 pt-4 sm:pt-8">
          <p className="meta font-medium uppercase tracking-wider">LPG delivery - Pangasinan</p>
          <h1 className="max-w-2xl text-[32px] font-semibold leading-tight tracking-tight">Delivery and customer management for LPG refills</h1>
          <p className="max-w-2xl text-base text-muted-foreground">Customers reorder in a minute, riders prove every delivery, and the refill cycle shows you who to call before they switch supplier. This prototype lets you walk the whole loop as each team member.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link to="/signin" />}>Sign in to the demo<ArrowRight /></Button>
            <span className="text-sm text-muted-foreground">No password. Pick a team member on the next screen.</span>
          </div>
        </section>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4" aria-label="At a glance">
          {FACTS.map(([v, k]) => (
            <div key={k} className="bg-card p-4"><dd className="text-lg font-semibold tracking-tight">{v}</dd><dt className="meta">{k}</dt></div>
          ))}
        </dl>

        <section className="grid gap-4" aria-label="Who it is for">
          <h2 className="text-2xl font-semibold tracking-tight">Built for four roles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ROLES.map(([name, blurb]) => (
              <Card key={name}>
                <CardHeader><CardTitle>{name}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">{blurb}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card>
          <CardHeader><CardTitle>Walk the whole loop in 5 minutes</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <ol className="grid gap-3 text-sm">
              {STEPS.map(([who, what], i) => <li key={who} className="flex gap-3"><span className="w-4 tabular-nums text-muted-foreground">{i + 1}.</span><span><b className="font-semibold">{who}</b> {what}</span></li>)}
            </ol>
            <p className="text-sm text-muted-foreground">Tip: each browser tab keeps its own signed-in user, so you can keep the customer in one tab and the dispatcher in another.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={actions.reset}><RotateCcw />Reset demo data</Button>
              <span className="meta">SMS, payments and GPS are simulated. Brand colours are placeholders pending Petron approval. Build {__BUILD__}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
