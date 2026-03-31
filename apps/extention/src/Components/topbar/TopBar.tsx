import { Badge } from "~Components/ui/Badge"
import { Button } from "~Components/ui/Button"

export function TopBar() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">MailPilot</h1>
        <div className="flex items-center gap-2">
          <Badge variant="status">Connected to Gmail</Badge>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button aria-label="Settings" size="sm" variant="ghost">
          ⚙
        </Button>
        <Button aria-label="Close" size="sm" variant="ghost">
          ✕
        </Button>
      </div>
    </div>
  )
}
