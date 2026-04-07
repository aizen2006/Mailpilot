import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function ConnectGmailPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  const startUrl = api ? `${api}/oauth/google/start?userId=${encodeURIComponent(user.id)}` : null

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
        Connect Gmail
      </h1>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm" style={{ color: "var(--mp-text-muted)" }}>
          Your account ID:
        </span>
        <code
          className="rounded-(--mp-radius-sm) px-2 py-0.5 font-mono text-xs"
          style={{
            background: "var(--mp-elevated)",
            color: "var(--mp-primary)",
            border: "1px solid var(--mp-border)",
          }}
        >
          {user.id}
        </code>
      </div>

      {/* Auth card */}
      <div
        className="mt-8 max-w-lg rounded-(--mp-radius-lg) p-6"
        style={{ background: "var(--mp-card)", boxShadow: "var(--mp-shadow-card)" }}
      >
        <h2 className="text-base font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
          Authorize with Google
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
          Click below to start the Google OAuth flow. You will be redirected to Google to grant MailPilot
          read access to your Gmail.
        </p>

        <div className="mt-6">
          {startUrl ? (
            <a
              className="flex items-center justify-center gap-2.5 rounded-(--mp-radius-md) px-5 py-3 text-sm font-semibold text-white transition-shadow active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, var(--mp-primary), var(--mp-primary-deep))",
                boxShadow: "0 4px 16px rgba(15,118,110,0.28)",
              }}
              href={startUrl}
            >
              {/* Google G icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </a>
          ) : (
            <p className="text-sm" style={{ color: "#b91c1c" }}>
              Set{" "}
              <code className="rounded px-1 font-mono" style={{ background: "var(--mp-surface)" }}>
                NEXT_PUBLIC_API_URL
              </code>{" "}
              to your MailPilot API origin.
            </p>
          )}
        </div>

        <p className="mt-4 text-xs" style={{ color: "var(--mp-text-soft)" }}>
          We only request read access. Your credentials are never stored.
        </p>
      </div>

      <Link
        className="mt-8 inline-flex items-center gap-1 text-sm font-medium transition-colors"
        style={{ color: "var(--mp-primary)" }}
        href="/dashboard/overview"
      >
        ← Back to overview
      </Link>
    </div>
  )
}
