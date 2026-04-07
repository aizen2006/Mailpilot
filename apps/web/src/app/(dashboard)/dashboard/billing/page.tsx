import { BillingPortalButton } from "./BillingPortalButton"

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
        Billing
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
        Manage subscriptions and payment methods through Stripe.
      </p>

      {/* Stripe portal card */}
      <div
        className="mt-8 max-w-lg rounded-(--mp-radius-lg) p-6"
        style={{ background: "var(--mp-card)", boxShadow: "var(--mp-shadow-card)" }}
      >
        <h2 className="text-sm font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
          Stripe Customer Portal
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
          Update payment methods, download invoices, and manage your subscription directly through our
          secure Stripe integration.
        </p>
        <div className="mt-5">
          <BillingPortalButton />
        </div>
        <p className="mt-3 text-xs" style={{ color: "var(--mp-text-soft)" }}>
          Requires{" "}
          <code
            className="rounded px-1 font-mono"
            style={{ background: "var(--mp-surface)", color: "var(--mp-text-muted)" }}
          >
            stripe_customer_id
          </code>{" "}
          on your user row and{" "}
          <code
            className="rounded px-1 font-mono"
            style={{ background: "var(--mp-surface)", color: "var(--mp-text-muted)" }}
          >
            STRIPE_SECRET_KEY
          </code>{" "}
          env var.
        </p>
      </div>

      {/* Current plan card */}
      <div
        className="mt-4 max-w-lg rounded-(--mp-radius-lg) p-6"
        style={{ background: "var(--mp-card)", boxShadow: "var(--mp-shadow-card)" }}
      >
        <h2 className="text-sm font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
          Current Plan
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "var(--mp-elevated)",
              color: "var(--mp-primary)",
              border: "1px solid var(--mp-primary)",
            }}
          >
            Free tier
          </span>
          <p className="text-sm" style={{ color: "var(--mp-text-muted)" }}>
            Your account is on the free plan.
          </p>
        </div>
      </div>
    </div>
  )
}
