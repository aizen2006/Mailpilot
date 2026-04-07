"use client"

import { createExtensionLinkCode } from "@/app/actions/link-code"
import { useState, useTransition } from "react"

export function ExtensionLinkSection() {
  const [code, setCode] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <section
      className="mt-8 max-w-2xl rounded-(--mp-radius-lg) p-6"
      style={{ background: "var(--mp-card)", boxShadow: "var(--mp-shadow-card)" }}
    >
      <h2 className="text-sm font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
        Link Extension
      </h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
        Generate a one-time code and enter it in the extension settings to connect your account.
        Codes expire in{" "}
        <strong style={{ color: "var(--mp-text)" }}>15 minutes</strong>.
      </p>

      <button
        className="mt-5 rounded-(--mp-radius-md) px-4 py-2.5 text-sm font-semibold transition-[box-shadow,transform] duration-160 active:scale-[0.97] disabled:opacity-50"
        style={{
          background: "var(--mp-surface)",
          color: "var(--mp-text)",
          border: "1px solid var(--mp-border)",
        }}
        disabled={pending}
        onClick={() => {
          setError(null)
          setCode(null)
          startTransition(async () => {
            const r = await createExtensionLinkCode()
            if (r.ok) {
              setCode(r.code)
              setExpiresAt(r.expiresAt)
            } else {
              setError(r.error)
            }
          })
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--mp-elevated)" }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--mp-surface)" }}
        type="button"
      >
        {pending ? "Generating…" : "Generate link code"}
      </button>

      {error && (
        <p className="mt-3 text-sm" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      {code && (
        <div
          className="mt-5 rounded-(--mp-radius-md) p-5"
          style={{
            background: "var(--mp-elevated)",
            border: "1px solid var(--mp-border)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--mp-text-soft)" }}>
            Your one-time code
          </p>
          <p
            className="mt-3 break-all rounded-(--mp-radius-sm) px-4 py-3 font-mono text-base font-semibold"
            style={{
              background: "var(--mp-card)",
              color: "var(--mp-primary)",
              border: "1px solid var(--mp-border)",
              letterSpacing: "0.08em",
            }}
          >
            {code}
          </p>
          {expiresAt && (
            <p className="mt-2 text-xs" style={{ color: "var(--mp-text-muted)" }}>
              Expires: {new Date(expiresAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
