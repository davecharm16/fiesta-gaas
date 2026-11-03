import type { Size } from './types'

// Demo subset of the PSA PSGC list for Pangasinan. Production imports the full official list.
export interface Town { name: string; lat: number; lng: number; fee: number; barangays: string[] }
export const TOWNS: Town[] = [
  { name: 'Dagupan City', lat: 16.043, lng: 120.334, fee: 0, barangays: ['Pantal', 'Bonuan Gueset', 'Lucao', 'Tapuac'] },
  { name: 'Calasiao', lat: 16.0128, lng: 120.3563, fee: 0, barangays: ['Poblacion East', 'Nalsian', 'Buenlag'] },
  { name: 'Lingayen', lat: 16.0214, lng: 120.2318, fee: 30, barangays: ['Poblacion', 'Libsong East', 'Domalandan Center'] },
  { name: 'San Carlos City', lat: 15.9281, lng: 120.3489, fee: 30, barangays: ['Poblacion', 'Bolingit', 'Doyong'] },
  { name: 'Urdaneta City', lat: 15.9758, lng: 120.5711, fee: 50, barangays: ['Poblacion', 'Nancayasan', 'Anonas', 'Camantiles'] },
  { name: 'Alaminos City', lat: 16.1556, lng: 119.9816, fee: 80, barangays: ['Poblacion', 'Pocal-pocal', 'Palamis', 'Telbang'] },
]
export const town = (name: string) => TOWNS.find((t) => t.name === name)!

// Mock price list (placeholder, confirm in discovery).
export const REFILL_PRICE: Record<Size, number> = { '11kg': 880, '22kg': 1760, '50kg': 4000 }
export const DEPOSIT: Record<Size, number> = { '11kg': 2500, '22kg': 4500, '50kg': 8000 }
export const SMS_COST = 0.56
export const LOW_STOCK: Record<Size, number> = { '11kg': 15, '22kg': 8, '50kg': 3 }

/** Which branch serves a town in the demo seed (Alaminos City is served by the Alaminos branch). */
export const branchOfTown = (t: string) => (t === 'Alaminos City' ? 'b2' : 'b1')

/** Factory defaults for a new install. The live values are `DB.pricing` (edited in Management → Prices). */
export const defaultPricing = () => ({
  refill: { ...REFILL_PRICE }, deposit: { ...DEPOSIT }, smsCost: SMS_COST,
  fees: Object.fromEntries(TOWNS.map((t) => [t.name, t.fee])),
})
