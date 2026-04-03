export function EmptyState() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 p-5 text-sm backdrop-blur-[2px]">
      <p className="font-display text-base font-medium text-[var(--color-text)]">No messages yet</p>
      <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
        Describe the reply you want and MailPilot will draft a clean, on-brand message.
      </p>
    </div>
  )
}
