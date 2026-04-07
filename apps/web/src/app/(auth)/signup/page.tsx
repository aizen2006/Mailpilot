"use client"

import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "motion/react"
import { scaleFade } from "@/lib/motion"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const origin = window.location.origin
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    router.push("/dashboard/overview")
    router.refresh()
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12"
      style={{ background: "var(--mp-canvas)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(15,118,110,0.18), transparent)",
        }}
      />

      <div className="relative w-full max-w-md">
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
            Create your account
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mp-text-muted)" }}>
            Start using AI-powered email in minutes.
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
                autoComplete="new-password"
                className="rounded-(--mp-radius-md) px-4 py-2.5 text-sm outline-none transition-shadow"
                style={{
                  background: "var(--mp-surface)",
                  border: "1px solid var(--mp-border)",
                  color: "var(--mp-text)",
                }}
                minLength={8}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                type="password"
                value={password}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--mp-focus)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.15)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--mp-border)"; e.currentTarget.style.boxShadow = "" }}
              />
            </label>

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
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--mp-text-muted)" }}>
            Already have an account?{" "}
            <Link className="font-semibold hover:underline" style={{ color: "var(--mp-primary)" }} href="/login">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
