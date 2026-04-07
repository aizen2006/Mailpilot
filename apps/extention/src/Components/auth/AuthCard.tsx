import { useState } from "react"
import { Button } from "~Components/ui/Button"
import { Input } from "~Components/ui/Input"

type AuthCardProps = {
  mode?: "compact" | "full"
  loading?: boolean
  error?: string | null
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string) => Promise<void>
  onContinueGuest?: () => void
}

export function AuthCard({
  mode = "compact",
  loading = false,
  error,
  onSignIn,
  onSignUp,
  onContinueGuest,
}: AuthCardProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tab, setTab] = useState<"signIn" | "signUp">("signIn")

  const canSubmit = email.trim().length > 0 && password.trim().length >= 6 && !loading

  return (
    <div className="mx-auto w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-card">
      <h1 className="text-base font-semibold tracking-tight text-[var(--color-text)]">MailPilot</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Sign in to sync your account and send from your Gmail.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button onClick={() => setTab("signIn")} variant={tab === "signIn" ? "primary" : "ghost"}>
          Sign in
        </Button>
        <Button onClick={() => setTab("signUp")} variant={tab === "signUp" ? "primary" : "ghost"}>
          Sign up
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        <Input
          autoComplete="email"
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          value={email}
        />
        <Input
          autoComplete={tab === "signIn" ? "current-password" : "new-password"}
          disabled={loading}
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6 chars)"
          type="password"
          value={password}
        />
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!canSubmit}
        onClick={() => void (tab === "signIn" ? onSignIn(email, password) : onSignUp(email, password))}
        variant="primary">
        {loading ? "Please wait..." : tab === "signIn" ? "Sign in" : "Create account"}
      </Button>

      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      {onContinueGuest && mode === "full" ? (
        <Button className="mt-3 w-full" onClick={onContinueGuest} variant="ghost">
          Continue as guest
        </Button>
      ) : null}
      <Button
        className="mt-2 w-full"
        onClick={() => void chrome.runtime.openOptionsPage()}
        variant="ghost">
        Use existing link code
      </Button>
    </div>
  )
}
