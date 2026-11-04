const SESSION_KEY = 'spotify:adminSession'

export type AdminSession = {
  username: string
  role: 'superadmin'
  loggedInAt: string
}

const SUPERUSER = {
  username: 'admin',
  password: 'admin',
} as const

export function loginAdmin(username: string, password: string): AdminSession | null {
  const u = username.trim().toLowerCase()
  const p = password
  if (u !== SUPERUSER.username || p !== SUPERUSER.password) return null
  const session: AdminSession = {
    username: SUPERUSER.username,
    role: 'superadmin',
    loggedInAt: new Date().toISOString(),
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AdminSession
  } catch {
    return null
  }
}

export function isAdminAuthenticated() {
  return Boolean(getAdminSession())
}
