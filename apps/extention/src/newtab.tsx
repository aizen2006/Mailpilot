import "./style.css"

function IndexNewtab() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] p-8 text-[var(--color-text)]">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold tracking-tight">MailPilot</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
          Your new tab is ready. Open the extension popup to draft and send email with context from Gmail.
        </p>
        <p className="mt-6 text-xs text-[var(--color-text-soft)]">
          Tip: pin the extension for faster access.
        </p>
      </div>
    </div>
  )
}

export default IndexNewtab
