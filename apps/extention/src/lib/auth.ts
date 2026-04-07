import { Storage } from "@plasmohq/storage"
import { getApiBaseUrl } from "~lib/api"

const storage = new Storage({ area: "local" })

const ACCESS_TOKEN_KEY = "mailpilot_auth_access_token"
const REFRESH_TOKEN_KEY = "mailpilot_auth_refresh_token"

export type AuthSession = {
  accessToken: string
  refreshToken: string | null
}

type AuthPayload = {
  user: { id: string; email: string | null }
  session: {
    access_token: string
    refresh_token?: string | null
  } | null
}

export type AuthUser = {
  userId: string
  email: string
  name?: string
}

export async function getStoredSession(): Promise<AuthSession | null> {
  const accessToken = await storage.get<string>(ACCESS_TOKEN_KEY)
  if (!accessToken) return null
  const refreshToken = (await storage.get<string>(REFRESH_TOKEN_KEY)) ?? null
  return { accessToken, refreshToken }
}

export async function clearStoredSession(): Promise<void> {
  await storage.remove(ACCESS_TOKEN_KEY)
  await storage.remove(REFRESH_TOKEN_KEY)
}

async function persistSession(payload: AuthPayload): Promise<AuthSession> {
  const accessToken = payload.session?.access_token
  if (!accessToken) {
    throw new Error("Authentication response missing access token")
  }
  const refreshToken = payload.session?.refresh_token ?? null
  await storage.set(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) await storage.set(REFRESH_TOKEN_KEY, refreshToken)
  return { accessToken, refreshToken }
}

async function authPost(path: "/auth/signIn" | "/auth/signUp", email: string, password: string) {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message ?? `Auth failed: ${res.status}`)
  }
  const payload = (await res.json()) as AuthPayload
  return persistSession(payload)
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  return authPost("/auth/signIn", email, password)
}

export async function signUp(email: string, password: string): Promise<AuthSession> {
  return authPost("/auth/signUp", email, password)
}

export async function fetchMe(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message ?? `Unable to fetch account: ${res.status}`)
  }
  return (await res.json()) as AuthUser
}
