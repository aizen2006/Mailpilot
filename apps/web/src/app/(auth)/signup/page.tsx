"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const supabase = createClient();
        const origin = window.location.origin;
        const { error: err } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });
        setLoading(false);
        if (err) {
            setError(err.message);
            return;
        }
        router.push("/dashboard/overview");
        router.refresh();
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900">Sign up</h1>
                <p className="mt-1 text-sm text-zinc-600">
                    Your account id matches your app user id (Supabase Auth).
                </p>
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
                        autoComplete="new-password"
                        className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
                        name="password"
                        minLength={8}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password"
                        value={password}
                    />
                </label>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button
                    className="rounded-md bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                    disabled={loading}
                    type="submit">
                    {loading ? "Creating account…" : "Create account"}
                </button>
            </form>
            <p className="text-center text-sm text-zinc-600">
                Already have an account?{" "}
                <Link className="font-medium text-zinc-900 underline" href="/login">
                    Log in
                </Link>
            </p>
        </main>
    );
}
