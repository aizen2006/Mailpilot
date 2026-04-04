"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") ?? "/dashboard/overview";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const supabase = createClient();
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (err) {
            setError(err.message);
            return;
        }
        router.push(next);
        router.refresh();
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900">Log in</h1>
                <p className="mt-1 text-sm text-zinc-600">Use your MailPilot account.</p>
            </div>
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <label className="flex flex-col gap-1 text-sm">
                    <span className="text-zinc-700">Email</span>
                    <input
                        autoComplete="email"
                        className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type="email"
                        value={email}
                    />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                    <span className="text-zinc-700">Password</span>
                    <input
                        autoComplete="current-password"
                        className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password"
                        value={password}
                    />
                </label>
                {searchParams.get("error") === "auth" ? (
                    <p className="text-sm text-red-600">Sign-in failed. Try again.</p>
                ) : null}
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button
                    className="rounded-md bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                    disabled={loading}
                    type="submit">
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </form>
            <p className="text-center text-sm text-zinc-600">
                No account?{" "}
                <Link className="font-medium text-zinc-900 underline" href="/signup">
                    Sign up
                </Link>
            </p>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <main className="mx-auto flex min-h-screen max-w-sm items-center justify-center px-6">
                    <p className="text-sm text-zinc-500">Loading…</p>
                </main>
            }>
            <LoginForm />
        </Suspense>
    );
}
