import { Button } from "~Components/ui/Button"

export function ErrorState() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1">Unable to load generated drafts right now. Please try again.</p>
      <Button className="mt-3" size="sm" variant="subtle">
        Retry
      </Button>
    </div>
  )
}
