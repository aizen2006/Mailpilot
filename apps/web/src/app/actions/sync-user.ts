"use server";

import { createClient } from "@/lib/supabase/server";

export async function syncUserWithBackend(): Promise<{ ok: boolean; error?: string }> {
    const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!api) {
        return { ok: false, error: "NEXT_PUBLIC_API_URL is not set" };
    }
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
        return { ok: false, error: "No session" };
    }
    const res = await fetch(`${api}/user/sync-supabase`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) {
        const text = await res.text();
        return { ok: false, error: text || res.statusText };
    }
    return { ok: true };
}
