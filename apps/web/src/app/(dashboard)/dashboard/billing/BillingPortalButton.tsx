"use client";

import { openBillingPortal } from "@/app/actions/billing-portal";
import { MpButton } from "@/components/mp-button";
import { useTransition } from "react";

export function BillingPortalButton() {
    const [pending, startTransition] = useTransition();

    return (
        <MpButton
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
            variant="primary">
            {pending ? "Opening…" : "Open Stripe billing portal"}
        </MpButton>
    );
}
