"use client";

import { openBillingPortal } from "@/app/actions/billing-portal";
import { useTransition } from "react";

export function BillingPortalButton() {
    const [pending, startTransition] = useTransition();

    return (
        <button
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            disabled={pending}
            onClick={() => {
                startTransition(async () => {
                    const r = await openBillingPortal();
                    if (r.ok) {
                        window.location.href = r.url;
                    } else {
                        alert(r.error);
                    }
                });
            }}
            type="button">
            {pending ? "Opening…" : "Open Stripe billing portal"}
        </button>
    );
}
