export default function UsagePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
        Usage
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
        Track how you use MailPilot over time. Metered usage and per-feature breakdowns will appear here.
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
          ◈
        </div>
        <h2 className="mt-5 text-base font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
          Charts coming soon
        </h2>
        <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--mp-text-muted)" }}>
          Detailed usage charts and export options will be available here.
        </p>
        <span
          className="mt-5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
          style={{ background: "var(--mp-elevated)", color: "var(--mp-primary)" }}
        >
          Coming soon
        </span>
      </div>

      {/* Sample table */}
      <div
        className="mt-6 rounded-(--mp-radius-lg) p-6"
        style={{ background: "var(--mp-card)", boxShadow: "var(--mp-shadow-card)" }}
      >
        <h2 className="mb-4 text-sm font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
          Recent activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--mp-border)" }}>
                {["Kind", "Count", "Last used"].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--mp-text-soft)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { kind: "AI Draft", count: "—", last: "—" },
                { kind: "Summarize", count: "—", last: "—" },
                { kind: "Send", count: "—", last: "—" },
              ].map((row) => (
                <tr key={row.kind} style={{ borderBottom: "1px solid var(--mp-border)" }}>
                  <td className="py-3" style={{ color: "var(--mp-text)" }}>
                    {row.kind}
                  </td>
                  <td className="py-3 font-mono" style={{ color: "var(--mp-text-muted)" }}>
                    {row.count}
                  </td>
                  <td className="py-3" style={{ color: "var(--mp-text-muted)" }}>
                    {row.last}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
