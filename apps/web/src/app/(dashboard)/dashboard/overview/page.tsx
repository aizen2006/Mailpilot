"use client"

import { fetchUsageSummary } from "@/app/actions/usage-summary"
import Link from "next/link"
import { motion } from "motion/react"
import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion"
import { use } from "react"

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div
      className="rounded-(--mp-radius-lg) p-6 transition-shadow duration-200"
      style={{
        background: "var(--mp-card)",
        boxShadow: "var(--mp-shadow-card)",
        borderTop: accent ? "2px solid var(--mp-primary)" : "2px solid var(--mp-border)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--mp-shadow-card-hover)" }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--mp-shadow-card)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--mp-text-soft)" }}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight" style={{ color: "var(--mp-text)" }}>
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs" style={{ color: "var(--mp-text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function LinkCard({ href, label, sub, tag }: { href: string; label: string; sub: string; tag: string }) {
  return (
    <Link
      href={href}
      className="group rounded-(--mp-radius-lg) p-6 transition-shadow duration-200"
      style={{
        background: "var(--mp-card)",
        boxShadow: "var(--mp-shadow-card)",
        borderTop: "2px solid transparent",
        display: "block",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--mp-shadow-card-hover)"
        e.currentTarget.style.borderTopColor = "var(--mp-primary)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--mp-shadow-card)"
        e.currentTarget.style.borderTopColor = "transparent"
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--mp-text-soft)" }}>
        {tag}
      </p>
      <p className="mt-2 text-base font-bold tracking-tight transition-colors" style={{ color: "var(--mp-text)" }}>
        {label} →
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--mp-text-muted)" }}>
        {sub}
      </p>
    </Link>
  )
}

export default function OverviewPage() {
  const usagePromise = fetchUsageSummary()

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
          Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
          Connect Gmail then use the Chrome extension to draft, summarize and send mail with AI.
        </p>
      </motion.div>

      <OverviewContent usagePromise={usagePromise} />
    </div>
  )
}

function OverviewContent({ usagePromise }: { usagePromise: Promise<Awaited<ReturnType<typeof fetchUsageSummary>>> }) {
  const usage = use(usagePromise)
  const totalEvents = usage.ok ? usage.rows.reduce((acc, r) => acc + Number(r.total), 0) : 0

  return (
    <>
      {/* Stat cards row */}
      <motion.div
        className="mb-8 grid gap-4 sm:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerItem}>
          <StatCard label="Last 30 days" value={totalEvents.toLocaleString()} sub="usage events recorded" accent />
        </motion.div>
        <motion.div variants={staggerItem}>
          <LinkCard href="/connect/gmail" tag="Gmail" label="Connect account" sub="OAuth from Google — one-click flow" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <LinkCard href="/dashboard/settings" tag="Extension" label="Link extension" sub="Generate a code for the Chrome extension" />
        </motion.div>
      </motion.div>

      {/* Usage by kind */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-(--mp-radius-lg) p-6"
        style={{ background: "var(--mp-card)", boxShadow: "var(--mp-shadow-card)" }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
            Usage by kind
          </h2>
          {usage.ok && usage.from && (
            <span className="text-xs" style={{ color: "var(--mp-text-soft)" }}>
              From {usage.from}
            </span>
          )}
        </div>

        {!usage.ok ? (
          <p className="mt-3 text-sm" style={{ color: "#b45309" }}>
            {usage.error}
          </p>
        ) : usage.rows.length === 0 ? (
          <p className="mt-4 text-sm" style={{ color: "var(--mp-text-muted)" }}>
            No usage events recorded yet. Start using the extension to see data here.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {usage.rows.map((row) => {
              const pct = totalEvents > 0 ? (Number(row.total) / totalEvents) * 100 : 0
              return (
                <li
                  key={row.kind}
                  className="flex items-center justify-between gap-4 rounded-(--mp-radius-sm) px-4 py-3"
                  style={{ background: "var(--mp-surface)" }}
                >
                  <span className="text-sm font-medium" style={{ color: "var(--mp-text)" }}>
                    {row.kind}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ background: "var(--mp-elevated)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: "var(--mp-primary)" }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-sm font-semibold" style={{ color: "var(--mp-primary)" }}>
                      {row.total}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </motion.div>
    </>
  )
}
