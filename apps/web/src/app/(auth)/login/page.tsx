"use client"

import { loginRedirectMessage, sanitizeNextPath } from "@/lib/auth-errors"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { motion } from "motion/react"
import { scaleFade } from "@/lib/motion"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = sanitizeNextPath(searchParams.get("next"))
  const urlError = loginRedirectMessage(searchParams.get("error"), searchParams.get("details"))
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12"
      style={{ background: "var(--mp-canvas)" }}
    >
      {/* Radial teal glow behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(15,118,110,0.18), transparent)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link className="mb-8 flex items-center justify-center gap-2" href="/">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--mp-primary), var(--mp-primary-deep))" }}
          >
            M
          </span>
          <span className="text-lg font-bold" style={{ color: "var(--mp-text)" }}>
            MailPilot
          </span>
        </Link>

        {/* Card — Emil: scale(0.98)→scale(1) entrance, infrequent so delight is justified */}
        <motion.div
          variants={scaleFade}
          initial="hidden"
          animate="visible"
          className="rounded-(--mp-radius-xl) p-8"
          style={{
            background: "var(--mp-card)",
            border: "1px solid var(--mp-border)",
            boxShadow: "var(--mp-shadow-card)",
          }}
        >
          <h1 className="text-xl font-bold" style={{ color: "var(--mp-text)" }}>
            Welcome back
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mp-text-muted)" }}>
            Sign in to your MailPilot account.
          </p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium" style={{ color: "var(--mp-text)" }}>
                Email
              </span>
              <input
                autoComplete="email"
                className="rounded-(--mp-radius-md) px-4 py-2.5 text-sm outline-none transition-shadow"
                style={{
                  background: "var(--mp-surface)",
                  border: "1px solid var(--mp-border)",
                  color: "var(--mp-text)",
                }}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                type="email"
                value={email}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--mp-focus)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.15)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--mp-border)"; e.currentTarget.style.boxShadow = "" }}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium" style={{ color: "var(--mp-text)" }}>
                Password
              </span>
              <input
                autoComplete="current-password"
                className="rounded-(--mp-radius-md) px-4 py-2.5 text-sm outline-none transition-shadow"
                style={{
                  background: "var(--mp-surface)",
                  border: "1px solid var(--mp-border)",
                  color: "var(--mp-text)",
                }}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--mp-focus)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.15)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--mp-border)"; e.currentTarget.style.boxShadow = "" }}
              />
            </label>

            {urlError && (
              <p className="rounded-(--mp-radius-md) px-3 py-2 text-sm" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                {urlError}
              </p>
            )}
            {error && (
              <p className="rounded-(--mp-radius-md) px-3 py-2 text-sm" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                {error}
              </p>
            )}

            <button
              className="mt-2 rounded-(--mp-radius-md) py-3 text-sm font-semibold text-white transition-[box-shadow,transform] duration-160 active:scale-[0.97] disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, var(--mp-primary), var(--mp-primary-deep))",
                boxShadow: "0 4px 16px rgba(15,118,110,0.28)",
              }}
              disabled={loading}
              type="submit"
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(15,118,110,0.4)" }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,118,110,0.28)" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--mp-text-muted)" }}>
            No account?{" "}
            <Link className="font-semibold hover:underline" style={{ color: "var(--mp-primary)" }} href="/signup">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center" style={{ background: "var(--mp-canvas)" }}>
          <p className="text-sm" style={{ color: "var(--mp-text-muted)" }}>Loading…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
