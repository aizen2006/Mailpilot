import { useCallback, useEffect, useState } from "react"
import { Button } from "~Components/ui/Button"
import { Card } from "~Components/ui/Card"
import { useGmailStatus } from "~hooks/useGmailStatus"
import { disconnectGmail, getApiBaseUrl, oauthGoogleStartUrl } from "~lib/api"
import { openMailPilotSidePanel } from "~lib/sidePanel"

type PopupDashboardProps = {
  userId: string
  onSignOut?: () => void
}

export function PopupDashboard({ userId, onSignOut }: PopupDashboardProps) {
  const gmail = useGmailStatus(userId)
  const [oauthPending, setOauthPending] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  const onConnect = useCallback(() => {
    if (!userId) return
    const extRedirect = chrome.identity.getRedirectURL("mailpilot")
    const url = oauthGoogleStartUrl(getApiBaseUrl(), userId, extRedirect)
    setOauthPending(true)
    void chrome.identity
      .launchWebAuthFlow({
        url,
        interactive: true,
      })
      .then(async (resultUrl) => {
        const responseUrl = new URL(resultUrl ?? extRedirect)
        const connected = responseUrl.searchParams.get("connected") === "1"
        setOauthPending(false)
        if (connected) {
          await gmail.refetch()
        }
      })
      .catch(() => {
        setOauthPending(false)
      })
  }, [userId])

  const onOpenSidebar = useCallback(() => {
    void openMailPilotSidePanel()
  }, [])

  const onDisconnect = useCallback(async () => {
    if (!userId) return
    setDisconnecting(true)
    try {
      await disconnectGmail(getApiBaseUrl(), userId)
      await gmail.refetch()
    } finally {
      setDisconnecting(false)
    }
  }, [userId, gmail])

  useEffect(() => {
    if (!oauthPending) return
    const handleWindowFocus = () => {
      void gmail.refetch()
    }
    window.addEventListener("focus", handleWindowFocus)
    return () => window.removeEventListener("focus", handleWindowFocus)
  }, [oauthPending, gmail])

  return (
    <div className="flex h-full flex-col gap-3">
      <header className="shrink-0 space-y-0.5">
        <h1 className="text-base font-semibold tracking-tight text-[var(--color-text)]">
          MailPilot
        </h1>
        <p className="text-xs text-[var(--color-text-soft)]">Email assistant</p>
      </header>

      <Card className="card-interactive flex flex-col gap-2 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Gmail
        </p>

        {oauthPending ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            Waiting for Gmail authorisation…
          </p>
        ) : gmail.loading && !gmail.connected ? (
          <p className="text-sm text-[var(--color-text-muted)]">Checking connection…</p>
        ) : gmail.connected ? (
          <div className="flex flex-col gap-2">
            <p className="truncate text-sm text-[var(--color-text)]">
              {gmail.email ? (
                <>
                  Connected as <span className="font-medium">{gmail.email}</span>
                </>
              ) : (
                <span className="font-medium text-[var(--color-text-muted)]">Connected</span>
              )}
            </p>
            <Button
              className="w-full"
              disabled={disconnecting}
              onClick={() => void onDisconnect()}
              size="sm"
              variant="ghost">
              {disconnecting ? "Disconnecting…" : "Disconnect Gmail"}
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--color-text-muted)]">Not connected</p>
            <Button
              className="w-full"
              disabled={!userId}
              onClick={onConnect}
              size="md"
              variant="ghost">
              Connect Gmail
            </Button>
          </>
        )}
      </Card>
      {onSignOut ? (
        <Button className="w-full" onClick={onSignOut} size="sm" variant="ghost">
          Sign out
        </Button>
      ) : null}

      <Button
        className="mt-auto w-full shadow-sm"
        onClick={onOpenSidebar}
        size="lg"
        variant="primary">
        Open MailPilot sidebar
      </Button>

      <p className="text-center text-xs text-[var(--color-text-soft)]">
        Chat lives in the sidebar—use the button above when you are ready.
      </p>
    </div>
  )
}
