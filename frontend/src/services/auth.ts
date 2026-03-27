export type UserRole = 'user' | 'admin'

export type AuthUser = {
  name: string
  email: string
  role: UserRole
}

const USER_KEY = 'qls_user'
const AUTH_EVENT = 'qls_auth_change'

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as any
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.name !== 'string' || typeof parsed.email !== 'string') return null
    const role = parsed.role === 'admin' ? 'admin' : 'user'
    return { name: parsed.name, email: parsed.email, role }
  } catch {
    return null
  }
}

export function setAuthUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function clearAuthUser() {
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function onAuthChange(cb: () => void) {
  const handler = () => cb()
  window.addEventListener(AUTH_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(AUTH_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export function inferRoleFromEmail(email: string): UserRole {
  const e = email.trim().toLowerCase()
  if (!e) return 'user'
  // Demo rule: any email containing "admin" becomes admin.
  if (e.includes('admin')) return 'admin'
  return 'user'
}

