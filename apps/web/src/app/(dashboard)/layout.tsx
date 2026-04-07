import { syncUserWithBackend } from "@/app/actions/sync-user"
import { DashboardNav } from "@/components/dashboard-nav"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await syncUserWithBackend()

  return (
    <div className="flex min-h-screen" style={{ background: "var(--mp-canvas)", color: "var(--mp-text)" }}>
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className="sticky top-0 flex h-screen w-60 shrink-0 flex-col px-4 py-8"
        style={{
          background: "var(--mp-card)",
          borderRight: "1px solid var(--mp-border)",
          boxShadow: "var(--mp-shadow-card)",
        }}
      >
        {/* Logo */}
        <Link className="flex items-center gap-3 px-2 mb-2" href="/dashboard/overview">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--mp-primary), var(--mp-primary-deep))",
              boxShadow: "0 4px 14px rgba(15, 118, 110, 0.3)",
            }}
          >
            M
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
              MailPilot
            </p>
            <p className="truncate text-xs" style={{ color: "var(--mp-text-soft)" }}>
              Dashboard
            </p>
          </div>
        </Link>

        {/* Nav */}
        <DashboardNav />

        {/* Footer */}
        <div className="mt-auto pt-6" style={{ borderTop: "1px solid var(--mp-border)" }}>
          <Link
            className="block rounded-(--mp-radius-md) px-3 py-2 text-xs font-medium transition-colors"
            style={{ color: "var(--mp-text-muted)" }}
            href="/"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--mp-surface)"
              e.currentTarget.style.color = "var(--mp-text)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = ""
              e.currentTarget.style.color = "var(--mp-text-muted)"
            }}
          >
            ← Back to home
          </Link>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <div className="min-w-0 flex-1 overflow-auto p-6 md:p-10">{children}</div>
    </div>
  )
}
