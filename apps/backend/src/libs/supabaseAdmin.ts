import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function supabaseUrl(): string {
    const url = process.env.SUPABASE_URL;
    if (!url) {
        throw new Error("Missing SUPABASE_URL");
    }
    return url;
}

function serviceRoleKey(): string {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }
    return key;
}

let adminClient: SupabaseClient | null = null;

/** Service-role client for verifying JWTs and admin operations. */
export function getSupabaseAdmin(): SupabaseClient {
    if (!adminClient) {
        adminClient = createClient(supabaseUrl(), serviceRoleKey(), {
            auth: { autoRefreshToken: false, persistSession: false },
        });
    }
    return adminClient;
}

export async function getUserFromJwt(jwt: string) {
    const { data, error } = await getSupabaseAdmin().auth.getUser(jwt);
    if (error || !data.user) {
        return null;
    }
    return data.user;
}
