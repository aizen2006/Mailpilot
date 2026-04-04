import { useCallback } from "react";
import { Button } from "~Components/ui/Button"
import { Card } from "~Components/ui/Card"
import { useExtensionUser } from "~hooks/useExtensionUser"
import { useGmailStatus } from "~hooks/useGmailStatus"
import { getApiBaseUrl, oauthGoogleStartUrl } from "~lib/api"
import { openMailPilotSidePanel } from "~lib/sidePanel"

export function PopupDashboard() {
  const { userId, error: userError, loading: userLoading } = useExtensionUser()
  const gmail = useGmailStatus(userId)

  const onConnect = useCallback(() => {
    if (!userId) {
      return
    }
    const url = oauthGoogleStartUrl(getApiBaseUrl(), userId)
    void chrome.tabs.create({ url })
  }, [userId])

  const onOpenSidebar = useCallback(() => {
    void openMailPilotSidePanel()
  }, [])

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
        {userLoading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Preparing account…</p>
        ) : userError ? (
          <p className="text-sm text-red-600">{userError}</p>
        ) : gmail.loading && !gmail.connected ? (
          <p className="text-sm text-[var(--color-text-muted)]">Checking connection…</p>
        ) : gmail.connected ? (
          <p className="truncate text-sm text-[var(--color-text)]">
            {gmail.email ? (
              <>
                Connected as <span className="font-medium">{gmail.email}</span>
              </>
            ) : (
              <span className="font-medium text-[var(--color-text-muted)]">Connected</span>
            )}
          </p>
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

      <Button className="mt-auto w-full shadow-sm" onClick={onOpenSidebar} size="lg" variant="primary">
        Open MailPilot sidebar
      </Button>

      <p className="text-center text-xs text-[var(--color-text-soft)]">
        Chat lives in the sidebar—use the button above when you are ready.
      </p>
    </div>
  )
}
