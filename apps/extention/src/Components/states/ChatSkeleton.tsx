export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton-stagger-1 h-4 w-36 animate-pulse rounded bg-[var(--color-bg-muted)]" />
      <div className="skeleton-stagger-2 h-16 w-full animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)]" />
      <div className="skeleton-stagger-3 h-20 w-4/5 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)]" />
      <div className="skeleton-stagger-4 h-16 w-3/5 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)]" />
    </div>
  )
}
