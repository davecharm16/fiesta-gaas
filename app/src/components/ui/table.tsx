import * as React from "react"
import { cn } from "@/lib/utils"

/** `stack`: below md each row becomes a card; cell labels come from the header row. */
function Table({ className, stack, ...props }: React.ComponentProps<"table"> & { stack?: boolean }) {
  const ref = React.useRef<HTMLTableElement>(null)
  React.useEffect(() => {
    const t = ref.current
    if (!stack || !t) return
    const label = () => {
      const heads = [...t.querySelectorAll("thead th")].map((h) => h.textContent?.trim() ?? "")
      t.querySelectorAll("tbody tr").forEach((r) => {
        if (r.closest("table") !== t) return
        ;[...r.children].forEach((c, i) => {
          const v = (c as HTMLTableCellElement).colSpan > 1 ? "" : heads[i] ?? ""
          if (c.getAttribute("data-label") !== v) c.setAttribute("data-label", v)
        })
      })
    }
    label()
    const mo = new MutationObserver(label)
    mo.observe(t, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [stack])
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        ref={ref}
        data-slot="table"
        data-stack={stack ? "" : undefined}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border/70 transition-colors hover:bg-accent/50 has-aria-expanded:bg-accent/50 data-[state=selected]:bg-accent",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 bg-muted px-3 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-11 px-3 py-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
