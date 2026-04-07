import "./style.css"

import { useCallback, useState } from "react"
import { Button } from "~Components/ui/Button"
import { Input } from "~Components/ui/Input"
import { useExtensionUser } from "~hooks/useExtensionUser"
import { getApiBaseUrl, linkExtensionAccount } from "~lib/api"

type LinkStatus = "idle" | "loading" | "success" | "error"

function LinkAccountSection() {
  const { userId, loading: userLoading } = useExtensionUser()
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<LinkStatus>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const onLink = useCallback(async () => {
    if (!userId || !code.trim()) return
    setStatus("loading")
    setErrorMsg("")
    try {
      await linkExtensionAccount(getApiBaseUrl(), code.trim(), userId)
      setStatus("success")
      setCode("")
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Linking failed")
      setStatus("error")
    }
  }, [userId, code])

  if (userLoading) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading account…</p>
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Link web account</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Generate a link code in the MailPilot web app under Settings, then paste it here to
          connect your Gmail and conversation history.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          disabled={status === "loading"}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste link code…"
          value={code}
        />
        <Button
          disabled={status === "loading" || !code.trim()}
          onClick={() => void onLink()}
          size="md"
          variant="primary">
          {status === "loading" ? "Linking…" : "Link"}
        </Button>
      </div>

      {status === "success" && (
        <p className="text-sm font-medium text-[var(--color-primary)]">
          Account linked successfully. Your Gmail and history are now available.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <p className="text-xs text-[var(--color-text-soft)]">
        Extension user ID: <span className="font-mono">{userId ?? "—"}</span>
      </p>
    </div>
  )
}

function IndexOptions() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] p-6 text-[var(--color-text)]">
      <section className="mx-auto max-w-xl space-y-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
        <h1 className="text-lg font-semibold tracking-tight">MailPilot Settings</h1>
        <hr className="border-[var(--color-border)]" />
        <LinkAccountSection />
      </section>
    </main>
  )
}

export default IndexOptions
