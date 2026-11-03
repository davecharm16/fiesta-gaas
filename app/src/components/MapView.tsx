import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface Pin { id: string; lat: number; lng: number; label: string; color: string; n?: number; active?: boolean }
const COLORS = { ok: 'var(--success)', due: 'var(--warning)', overdue: 'var(--destructive)', new: 'var(--primary)' }
/** Leaflet writes SVG attributes, so resolve a `var(--token)` to its computed value. */
const tok = (v: string) => { const n = /^var\((--[\w-]+)\)$/.exec(v)?.[1]; return n ? getComputedStyle(document.documentElement).getPropertyValue(n).trim() : v }
export const pinColor = (s?: string) => COLORS[(s as keyof typeof COLORS) ?? 'new'] ?? COLORS.new

/** Leaflet over OpenStreetMap (no API key). Production swaps in Google Maps / Mapbox per the proposal. */
export function MapView({ pins, onSelect, onPick, picked, height, route }: {
  pins: Pin[]; route?: [number, number][]; onSelect?: (id: string) => void; onPick?: (lat: number, lng: number) => void; picked?: [number, number]; height?: number
}) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const cb = useRef({ onSelect, onPick }); cb.current = { onSelect, onPick }

  useEffect(() => {
    const m = L.map(el.current!, { scrollWheelZoom: false }).setView([16.02, 120.34], 10)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 18 }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    m.on('click', (e) => cb.current.onPick?.(e.latlng.lat, e.latlng.lng))
    map.current = m
    return () => { m.stop(); m.remove(); map.current = null }
  }, [])

  useEffect(() => {
    const g = layer.current!; g.clearLayers()
    pins.forEach((p) => p.n !== undefined ? L.marker([p.lat, p.lng], { zIndexOffset: p.active ? 1000 : 0, icon: L.divIcon({ className: '', iconSize: [p.active ? 36 : 30, p.active ? 36 : 30],
      html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:9999px;font:600 ${p.active ? 15 : 13}px/1 sans-serif;font-variant-numeric:tabular-nums;color:${tok('var(--primary-foreground)')};background:${tok(p.color)};border:${p.active ? 4 : 2}px solid ${tok('var(--card)')};box-shadow:0 0 0 ${p.active ? 2 : 1}px ${tok(p.color)}">${p.n}</div>` }) })
      .bindTooltip(p.label).on('click', () => cb.current.onSelect?.(p.id)).addTo(g) : L.circleMarker([p.lat, p.lng], { radius: 8, color: tok('var(--card)'), weight: 2, fillColor: tok(p.color), fillOpacity: 1 })
      .bindTooltip(p.label).on('click', () => cb.current.onSelect?.(p.id)).addTo(g))
    if (route && route.length > 1) L.polyline(route, { color: tok('var(--primary)'), weight: 3, opacity: 0.6, dashArray: '6 8' }).addTo(g)
    if (picked) L.marker(picked).addTo(g)
    if (pins.length && !picked) map.current!.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number])), { padding: [30, 30], maxZoom: 14, animate: false })
    if (picked) map.current!.setView(picked, Math.max(map.current!.getZoom(), 13), { animate: false })
  }, [pins, picked, route])

  return <div ref={el} className={cn('map z-0 w-full overflow-hidden rounded-xl border border-border bg-muted shadow-[0_1px_2px_rgb(28_25_23/0.04)]', height ? '' : 'h-96')} style={height ? { height } : undefined} />
}
