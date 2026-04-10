import { sanitizeNextPath } from "@/lib/auth-errors";
import { getServerOrigin } from "@/lib/site-url";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function redirectToLogin(request: Request, params: Record<string, string>) {
    const origin = getServerOrigin(request);
    const url = new URL(`${origin}/login`);
    for (const [k, v] of Object.entries(params)) {
        if (v) url.searchParams.set(k, v);
    }
    return NextResponse.redirect(url);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const next = sanitizeNextPath(searchParams.get("next"));

    const oauthError = searchParams.get("error");
    const oauthDesc = searchParams.get("error_description");
    if (oauthError) {
        const details = oauthDesc?.replace(/\+/g, " ").slice(0, 280) ?? "";
        return redirectToLogin(request, {
            error: "oauth",
            details,
        });
    }

    if (!code) {
        return redirectToLogin(request, { error: "auth" });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
        return redirectToLogin(request, {
            error: "callback",
            details: error.message.slice(0, 280),
        });
    }

    const origin = getServerOrigin(request);
    return NextResponse.redirect(`${origin}${next}`);
}
