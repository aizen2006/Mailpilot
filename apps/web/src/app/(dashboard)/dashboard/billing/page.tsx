import { BillingPortalButton } from "./BillingPortalButton";

export default function BillingPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Billing</h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-600">
                Requires <code className="rounded bg-zinc-100 px-1 text-xs">stripe_customer_id</code> on your user
                row (set via Stripe checkout or webhook). Configure{" "}
                <code className="rounded bg-zinc-100 px-1 text-xs">STRIPE_SECRET_KEY</code> on the API.
            </p>
            <div className="mt-6">
                <BillingPortalButton />
            </div>
        </div>
    );
}
