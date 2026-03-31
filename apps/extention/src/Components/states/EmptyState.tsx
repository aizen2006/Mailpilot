export function EmptyState() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm">
      <p className="font-medium">No messages yet</p>
      <p className="mt-1 text-[var(--color-text-muted)]">
        Start by describing the response you want, and MailPilot will generate a clean draft.
      </p>
    </div>
  )
}
