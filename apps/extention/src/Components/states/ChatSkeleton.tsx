export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-36 animate-pulse rounded bg-[var(--color-bg-muted)]" />
      <div className="h-16 w-full animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)]" />
      <div className="h-20 w-4/5 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)]" />
      <div className="h-16 w-3/5 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)]" />
    </div>
  )
}
