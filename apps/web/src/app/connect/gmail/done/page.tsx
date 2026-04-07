import Link from "next/link"

type Props = { searchParams: Promise<{ connected?: string; error?: string }> }

export default async function ConnectGmailDonePage({ searchParams }: Props) {
  const q = await searchParams
  const ok = q.connected === "1"
  const err = q.error

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-12"
      style={{ background: "var(--mp-canvas)" }}
    >
      <div
        className="w-full max-w-sm rounded-(--mp-radius-xl) p-8 text-center"
        style={{
          background: "var(--mp-card)",
          border: "1px solid var(--mp-border)",
          boxShadow: "var(--mp-shadow-card)",
        }}
      >
        {ok ? (
          <>
            {/* Success */}
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl"
              style={{ background: "var(--mp-elevated)", color: "var(--mp-primary)" }}
            >
              ✓
            </div>
            <h1 className="mt-5 text-xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
              Gmail connected!
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
              Your Gmail account is now linked to MailPilot. You can close this tab or go to your dashboard.
            </p>
            <Link
              href="/dashboard/overview"
              className="mt-6 flex items-center justify-center rounded-(--mp-radius-md) py-3 text-sm font-semibold text-white transition-shadow active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, var(--mp-primary), var(--mp-primary-deep))",
                boxShadow: "0 4px 16px rgba(15,118,110,0.28)",
              }}
            >
              Go to dashboard
            </Link>
          </>
        ) : err ? (
          <>
            {/* Error */}
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl"
              style={{ background: "#fef2f2", color: "#b91c1c" }}
            >
              ✕
            </div>
            <h1 className="mt-5 text-xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
              Connection failed
            </h1>
            <p
              className="mt-2 rounded-(--mp-radius-md) px-4 py-2.5 text-sm leading-relaxed"
              style={{ background: "#fef2f2", color: "#b91c1c" }}
            >
              {err}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/connect/gmail"
                className="flex items-center justify-center rounded-(--mp-radius-md) py-2.5 text-sm font-semibold transition-colors active:scale-[0.97]"
                style={{
                  background: "var(--mp-surface)",
                  color: "var(--mp-text)",
                  border: "1px solid var(--mp-border)",
                }}
              >
                Try again
              </Link>
              <Link
                href="/dashboard/overview"
                className="flex items-center justify-center py-2.5 text-sm font-medium transition-colors"
                style={{ color: "var(--mp-text-muted)" }}
              >
                Back to overview
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Default */}
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl"
              style={{ background: "var(--mp-elevated)", color: "var(--mp-primary)" }}
            >
              ✓
            </div>
            <h1 className="mt-5 text-xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
              All done
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--mp-text-muted)" }}>
              You can close this tab.
            </p>
            <Link
              href="/dashboard/overview"
              className="mt-6 flex items-center justify-center rounded-(--mp-radius-md) py-2.5 text-sm font-medium transition-colors"
              style={{ color: "var(--mp-primary)" }}
            >
              Go to dashboard
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
