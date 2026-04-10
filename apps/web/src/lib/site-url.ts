/**
 * Canonical public URL for redirects and Supabase email links.
 * Set NEXT_PUBLIC_SITE_URL on Vercel (e.g. https://mailformee-web.vercel.app) so
 * confirmation emails and OAuth callbacks never use localhost.
 */
function trimBase(url: string): string {
    return url.trim().replace(/\/$/, "");
}

export function getSiteUrl(): string {
    const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (env) return trimBase(env);
    if (typeof window !== "undefined") return window.location.origin;
    return "http://localhost:3000";
}

export function getServerOrigin(request: Request): string {
    const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (env) return trimBase(env);
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    if (forwardedHost) {
        const host = forwardedHost.split(",")[0]?.trim();
        if (host) return `${forwardedProto}://${host}`;
    }
    return new URL(request.url).origin;
}
