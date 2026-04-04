"use server";

import { createClient } from "@/lib/supabase/server";

export async function openBillingPortal(): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
    const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!api) {
        return { ok: false, error: "NEXT_PUBLIC_API_URL is not set" };
    }
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
        return { ok: false, error: "Not signed in" };
    }
    const res = await fetch(`${api}/billing/portal`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) {
        return { ok: false, error: (await res.text()) || res.statusText };
    }
    const data = (await res.json()) as { url: string };
    if (!data.url) {
        return { ok: false, error: "No portal URL returned" };
    }
    return { ok: true, url: data.url };
}
