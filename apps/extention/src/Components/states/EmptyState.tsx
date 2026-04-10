export function EmptyState() {
  return (
    <div className="state-enter rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 p-5 text-sm backdrop-blur-[2px]">
      <p className="text-base font-medium text-[var(--color-text)]">Start your first thread</p>
      <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
        Ask for a reply draft, thread summary, or tone rewrite and MailPilot will generate it here.
      </p>
    </div>
  )
}
