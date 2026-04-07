export default function SpendingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
        Spending
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
        Understand your AI token costs. Cost breakdowns by model and API will surface here once billing hooks are wired.
      </p>

      {/* Coming soon card */}
      <div
        className="mt-8 flex flex-col items-center justify-center rounded-(--mp-radius-lg) px-8 py-16 text-center"
        style={{
          background: "var(--mp-card)",
          boxShadow: "var(--mp-shadow-card)",
          border: "2px dashed var(--mp-border)",
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-(--mp-radius-lg) text-xl"
          style={{ background: "var(--mp-elevated)", color: "var(--mp-primary)" }}
        >
          ◎
        </div>
        <h2 className="mt-5 text-base font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
          Spending insights coming soon
        </h2>
        <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--mp-text-muted)" }}>
          Token usage breakdown, cost estimates and trend data will appear here.
        </p>
      </div>

      {/* Metric placeholder row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total tokens", icon: "⬡" },
          { label: "Est. cost", icon: "◎" },
          { label: "Avg per request", icon: "◈" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-(--mp-radius-lg) p-5"
            style={{ background: "var(--mp-card)", boxShadow: "var(--mp-shadow-card)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-(--mp-radius-sm) text-sm"
                style={{ background: "var(--mp-elevated)", color: "var(--mp-primary)" }}
              >
                {m.icon}
              </span>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--mp-text-soft)" }}>
                {m.label}
              </p>
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums" style={{ color: "var(--mp-text)" }}>
              —
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
