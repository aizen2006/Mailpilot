import { useCallback, useEffect, useState } from "react"
import {
  clearStoredSession,
  fetchMe,
  getStoredSession,
  signIn,
  signUp,
  type AuthUser,
} from "~lib/auth"

type AuthState = "loading" | "unauthenticated" | "authenticated"

export function useExtensionAuth() {
  const [state, setState] = useState<AuthState>("loading")
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const hydrate = useCallback(async () => {
    setState("loading")
    setError(null)
    try {
      const session = await getStoredSession()
      if (!session?.accessToken) {
        setUser(null)
        setState("unauthenticated")
        return
      }
      const me = await fetchMe(session.accessToken)
      setUser(me)
      setState("authenticated")
    } catch (e) {
      await clearStoredSession()
      setUser(null)
      setError(e instanceof Error ? e.message : "Authentication required")
      setState("unauthenticated")
    }
  }, [])

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const authenticate = useCallback(
    async (mode: "signIn" | "signUp", email: string, password: string) => {
      setState("loading")
      setError(null)
      try {
        const session =
          mode === "signIn" ? await signIn(email, password) : await signUp(email, password)
        const me = await fetchMe(session.accessToken)
        setUser(me)
        setState("authenticated")
      } catch (e) {
        setUser(null)
        setState("unauthenticated")
        setError(e instanceof Error ? e.message : "Authentication failed")
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    await clearStoredSession()
    setUser(null)
    setError(null)
    setState("unauthenticated")
  }, [])

  return {
    state,
    user,
    error,
    signIn: (email: string, password: string) => authenticate("signIn", email, password),
    signUp: (email: string, password: string) => authenticate("signUp", email, password),
    signOut,
    refresh: hydrate,
  }
}
