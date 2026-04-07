"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { staggerContainer, staggerItem, fadeUp, EASE_OUT } from "@/lib/motion"

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    title: "Smart Drafting",
    body: "AI writes emails matching your tone — just describe what you need and send in seconds.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
    title: "Instant Summaries",
    body: "Get the gist of long threads instantly — no more reading walls of text.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
    ),
    title: "One-click Send",
    body: "Review and send without leaving your browser — the extension lives right in Gmail.",
  },
]

const howItWorks = [
  { step: "01", heading: "Install the extension", body: "Add MailPilot to Chrome in one click from the Web Store." },
  { step: "02", heading: "Connect your Gmail", body: "Grant read access and the AI learns your writing style." },
  { step: "03", heading: "Draft with AI", body: "Open any email thread and let MailPilot handle the reply." },
]

export default function HomePage() {
  return (
    <div style={{ background: "var(--mp-canvas)", color: "var(--mp-text)" }}>
      {/* ── Nav ──────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 px-6 backdrop-blur-md"
        style={{
          background: "rgba(244,246,249,0.85)",
          borderBottom: "1px solid var(--mp-border)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--mp-primary), var(--mp-primary-deep))" }}
            >
              M
            </span>
            <span className="text-sm font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
              MailPilot
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-(--mp-radius-md) px-4 py-2 text-sm font-medium transition-colors"
              style={{ color: "var(--mp-text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--mp-text)"; e.currentTarget.style.background = "var(--mp-surface)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--mp-text-muted)"; e.currentTarget.style.background = "" }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-(--mp-radius-md) px-4 py-2 text-sm font-semibold text-white transition-shadow"
              style={{
                background: "linear-gradient(135deg, var(--mp-primary), var(--mp-primary-deep))",
                boxShadow: "0 2px 8px rgba(15,118,110,0.25)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,118,110,0.35)" }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,118,110,0.25)" }}
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-28">
        {/* Decorative radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
          style={{ paddingTop: "60px" }}
        >
          <div
            className="h-[400px] w-[700px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(ellipse, var(--mp-primary-soft), transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span
            className="mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "var(--mp-elevated)", color: "var(--mp-primary)" }}
          >
            AI-powered email assistant
          </span>
          <h1
            className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
            style={{ color: "var(--mp-text)" }}
          >
            Your inbox,{" "}
            <span style={{ color: "var(--mp-primary)" }}>handled by AI</span>
          </h1>
          <p
            className="mx-auto mb-10 max-w-xl text-lg leading-relaxed"
            style={{ color: "var(--mp-text-muted)" }}
          >
            Draft, summarize and send emails in seconds — right from your browser. No tab switching, no context loss.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-(--mp-radius-md) px-6 py-3 text-sm font-semibold text-white transition-shadow active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, var(--mp-primary), var(--mp-primary-deep))",
                boxShadow: "0 4px 20px rgba(15,118,110,0.3)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(15,118,110,0.42)" }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,118,110,0.3)" }}
            >
              Get started free
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-(--mp-radius-md) px-6 py-3 text-sm font-semibold transition-colors"
              style={{
                background: "var(--mp-card)",
                color: "var(--mp-text)",
                border: "1px solid var(--mp-border)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--mp-surface)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--mp-card)" }}
            >
              See how it works
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Feature cards ────────────────────────────────────────── */}
      <section className="px-6 py-16" style={{ background: "var(--mp-surface)" }}>
        <div className="mx-auto max-w-6xl">
          <motion.p
            className="mb-12 text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--mp-text-soft)" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            What MailPilot does for you
          </motion.p>
          <motion.div
            className="grid gap-6 sm:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                className="rounded-(--mp-radius-lg) p-7 transition-shadow duration-200"
                style={{
                  background: "var(--mp-card)",
                  boxShadow: "var(--mp-shadow-card)",
                  borderTop: "2px solid var(--mp-primary)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--mp-shadow-card-hover)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--mp-shadow-card)" }}
              >
                <span
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-(--mp-radius-md)"
                  style={{ background: "var(--mp-elevated)", color: "var(--mp-primary)" }}
                >
                  {f.icon}
                </span>
                <h3 className="mb-2 text-base font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
                  {f.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-14 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
              Works where you work
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--mp-text-muted)" }}>
              Three steps from install to AI-assisted inbox.
            </p>
          </motion.div>
          <motion.div
            className="grid gap-8 sm:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {howItWorks.map((s) => (
              <motion.div key={s.step} variants={staggerItem} className="flex flex-col gap-3">
                <span
                  className="text-4xl font-black tabular-nums leading-none"
                  style={{ color: "var(--mp-primary-soft)" }}
                >
                  {s.step}
                </span>
                <h3 className="text-base font-bold" style={{ color: "var(--mp-text)" }}>
                  {s.heading}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
                  {s.body}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Gmail integration badge */}
          <motion.div
            className="mt-14 flex items-center justify-center gap-3"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div
              className="flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-medium"
              style={{ background: "var(--mp-card)", boxShadow: "var(--mp-shadow-card)", border: "1px solid var(--mp-border)" }}
            >
              <span className="text-base">✉</span>
              <span style={{ color: "var(--mp-text-muted)" }}>
                Integrated with <strong style={{ color: "var(--mp-text)" }}>Gmail</strong>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer
        className="px-6 py-8 text-center text-xs"
        style={{ borderTop: "1px solid var(--mp-border)", color: "var(--mp-text-soft)" }}
      >
        © {new Date().getFullYear()} MailPilot. All rights reserved.
      </footer>
    </div>
  )
}
