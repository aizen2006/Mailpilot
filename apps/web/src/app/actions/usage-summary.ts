"use server";

import { createClient } from "@/lib/supabase/server";

export type UsageSummaryRow = { kind: string; total: string };

export async function fetchUsageSummary(): Promise<
    | { ok: true; from: string; rows: UsageSummaryRow[] }
    | { ok: false; error: string }
> {
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
    const res = await fetch(`${api}/usage/summary`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) {
        return { ok: false, error: (await res.text()) || res.statusText };
    }
    const json = (await res.json()) as { from: string; rows: UsageSummaryRow[] };
    return { ok: true, from: json.from, rows: json.rows };
}
