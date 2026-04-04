import { getUserFromJwt } from "./supabaseAdmin";

export function bearerToken(request: Request): string | null {
    const h = request.headers.get("authorization");
    if (!h?.startsWith("Bearer ")) {
        return null;
    }
    return h.slice(7).trim() || null;
}

/** Returns app user id (matches Supabase `auth.users.id` for web accounts). */
export async function requireSupabaseUserId(request: Request): Promise<string | null> {
    const token = bearerToken(request);
    if (!token) {
        return null;
    }
    try {
        const user = await getUserFromJwt(token);
        return user?.id ?? null;
    } catch {
        return null;
    }
}
