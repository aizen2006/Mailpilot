import { Button } from "~Components/ui/Button"

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = "Unable to load generated drafts right now. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state-enter rounded-[var(--radius-lg)] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1">{message}</p>
      {onRetry && (
        <Button className="mt-3" onClick={onRetry} size="sm" variant="subtle">
          Retry
        </Button>
      )}
    </div>
  )
}
