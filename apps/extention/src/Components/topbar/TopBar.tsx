import type { SVGProps } from "react"
import { Badge } from "~Components/ui/Badge"
import { Button } from "~Components/ui/Button"

function IconGear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.7 3.6l.06.06a1.65 1.65 0 0 0 1.82.33H10a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V10a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
      />
    </svg>
  )
}

function IconClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

type TopBarProps = {
  gmailConnected?: boolean
  gmailEmail?: string
  gmailLoading?: boolean
}

export function TopBar({ gmailConnected, gmailEmail, gmailLoading }: TopBarProps) {
  const badgeLabel = gmailLoading
    ? "Checking Gmail…"
    : gmailConnected
      ? gmailEmail
        ? `Connected as ${gmailEmail}`
        : "Connected to Gmail"
      : "Gmail not connected"

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--color-text)] sm:text-xl">
          MailPilot
        </h1>
        <div className="flex min-w-0 items-center gap-2">
          <Badge className="max-w-full truncate" title={badgeLabel} variant="status">
            {badgeLabel}
          </Badge>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button aria-label="Settings" size="sm" variant="ghost">
          <IconGear className="h-4 w-4 text-[var(--color-text-muted)]" />
        </Button>
        <Button aria-label="Close" size="sm" variant="ghost">
          <IconClose className="h-4 w-4 text-[var(--color-text-muted)]" />
        </Button>
      </div>
    </div>
  )
}
