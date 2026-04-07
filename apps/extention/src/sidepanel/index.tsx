import "../style.css"

import { useState } from "react"
import { AuthCard } from "~Components/auth/AuthCard"
import { ExtensionChat } from "~Components/layout/ExtensionChat"
import { PageShell } from "~Components/layout/PageShell"
import { useExtensionAuth } from "~hooks/useExtensionAuth"
import { useExtensionUser } from "~hooks/useExtensionUser"

function SidePanel() {
  const auth = useExtensionAuth()
  const allowGuest = process.env.PLASMO_PUBLIC_ALLOW_GUEST_EXTENSION === "1"
  const [guestMode, setGuestMode] = useState(false)
  const guest = useExtensionUser(guestMode)
  const effectiveUserId = guestMode ? guest.userId : auth.user?.userId
  const isLoading = auth.state === "loading" || (guestMode && guest.loading)

  return (
    <PageShell mode="sidebar">
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-muted)]">
          Loading account...
        </div>
      ) : effectiveUserId ? (
        <ExtensionChat userId={effectiveUserId} />
      ) : (
        <div className="mx-auto my-8 w-full max-w-md">
          <AuthCard
            error={auth.error}
            loading={auth.state === "loading"}
            mode={allowGuest ? "full" : "compact"}
            onContinueGuest={allowGuest ? () => setGuestMode(true) : undefined}
            onSignIn={auth.signIn}
            onSignUp={auth.signUp}
          />
        </div>
      )}
    </PageShell>
  )
}

export default SidePanel
