import "./style.css"

function IndexOptions() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] p-6 text-[var(--color-text)]">
      <section className="mx-auto max-w-xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
        <h1 className="text-lg font-semibold tracking-tight">MailPilot Settings</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Settings panel is reserved for account and personalization controls.
        </p>
      </section>
    </main>
  )
}

export default IndexOptions
