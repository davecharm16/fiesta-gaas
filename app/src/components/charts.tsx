import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Plain KPI card: label, value, delta text with arrow. `good` = which direction is an improvement. */
export function Kpi({ label, value, sub, delta, good = 'up', className }: {
  label: string; value: string; sub?: string; delta?: number; good?: 'up' | 'down'; className?: string
}) {
  const shown = delta !== undefined && Math.abs(delta) >= 0.5
  const better = delta !== undefined && (delta >= 0) === (good === 'up')
  const Arrow = delta !== undefined && delta < 0 ? ArrowDownRight : ArrowUpRight
  return (
    <Card className={cn('gap-1 py-4', className)}>
      <CardHeader><CardDescription className="text-xs font-medium">{label}</CardDescription><CardTitle className="text-[28px] font-semibold leading-tight tracking-tight tabular-nums">{value}</CardTitle></CardHeader>
      <CardContent className="mt-0 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground tabular-nums">
        {shown && <span className={cn('inline-flex items-center gap-0.5 font-medium', better ? 'text-success' : 'text-destructive')}><Arrow className="size-3.5" />{Math.abs(Math.round(delta))}%{better ? ' better' : ' worse'}</span>}
        {sub && <span>{sub}</span>}
      </CardContent>
    </Card>
  )
}

export function ChartCard({ title, sub, children, className }: { title: string; sub?: string; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle>{sub && <CardDescription className="text-xs">{sub}</CardDescription>}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
