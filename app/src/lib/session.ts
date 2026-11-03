import type { User } from './types'

/** Which customer the PWA acts as. Signing in as a customer resets it to that customer. */
export const PERSONA_KEY = 'fiesta-gas-demo-customer'

// Per-tab (sessionStorage) so a presenter can keep a customer tab and a dispatcher tab open side by side.
// Only the user id is stored; what the user may do is always read from the live DB (lib/auth.ts).
const KEY = 'fiesta-gas-session'
const BRANCH_KEY = 'fiesta-gas-branch'
export const currentUserId = (): string | null => { try { return JSON.parse(sessionStorage.getItem(KEY) ?? 'null')?.userId ?? null } catch { return null } }
export const signIn = (u: User) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ userId: u.id })); sessionStorage.removeItem(BRANCH_KEY)
    if (u.customerId) localStorage.setItem(PERSONA_KEY, u.customerId)
  } catch { /* private mode: guard will bounce to sign-in */ }
}
export const signOut = () => { try { sessionStorage.removeItem(KEY); sessionStorage.removeItem(BRANCH_KEY) } catch { /* ignore */ } }

/** Admin screens show one branch or 'all' of the user's branches. */
export const savedBranch = (): string => { try { return sessionStorage.getItem(BRANCH_KEY) ?? 'all' } catch { return 'all' } }
export const saveBranch = (id: string) => { try { sessionStorage.setItem(BRANCH_KEY, id) } catch { /* ignore */ } }
