import "./style.css"

import { useState } from "react"
import { AuthCard } from "~Components/auth/AuthCard"
import { PopupDashboard } from "~Components/layout/PopupDashboard"
import { PageShell } from "~Components/layout/PageShell"
import { useExtensionAuth } from "~hooks/useExtensionAuth"
import { useExtensionUser } from "~hooks/useExtensionUser"

function IndexPopup() {
  const auth = useExtensionAuth()
  const allowGuest = process.env.PLASMO_PUBLIC_ALLOW_GUEST_EXTENSION === "1"
  const [guestMode, setGuestMode] = useState(false)
  const guest = useExtensionUser(guestMode)

  const effectiveUserId = guestMode ? guest.userId : auth.user?.userId
  const isLoading = auth.state === "loading" || (guestMode && guest.loading)

  return (
    <PageShell mode="popup">
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-muted)]">
          Loading account...
        </div>
      ) : effectiveUserId ? (
        <PopupDashboard userId={effectiveUserId} onSignOut={guestMode ? undefined : auth.signOut} />
      ) : (
        <AuthCard
          error={auth.error}
          loading={auth.state === "loading"}
          mode={allowGuest ? "full" : "compact"}
          onContinueGuest={allowGuest ? () => setGuestMode(true) : undefined}
          onSignIn={auth.signIn}
          onSignUp={auth.signUp}
        />
      )}
    </PageShell>
  )
}

export default IndexPopup
