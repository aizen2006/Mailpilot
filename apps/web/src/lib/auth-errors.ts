/** Safe redirect path after login/callback (blocks open redirects). */
export function sanitizeNextPath(next: string | null, fallback = "/dashboard/overview"): string {
    if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
    return next;
}

export function loginRedirectMessage(error: string | null, details: string | null): string | null {
    if (!error) return null;
    switch (error) {
        case "auth":
            return "Sign-in failed. Try again or use the link from your confirmation email.";
        case "callback":
            return details?.trim() || "Could not complete sign-in. The link may have expired — request a new one.";
        case "oauth":
            return details?.trim() || "Sign-in was cancelled or denied.";
        default:
            return details?.trim() || "Something went wrong. Please try again.";
    }
}
