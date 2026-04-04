import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ConnectGmailPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    const startUrl = api
        ? `${api}/oauth/google/start?userId=${encodeURIComponent(user.id)}`
        : null;

    return (
        <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Connect Gmail</h1>
            <p className="mt-2 max-w-lg text-sm text-zinc-600">
                You will be redirected to Google to grant MailPilot access. Your linked account id is{" "}
                <code className="rounded bg-zinc-100 px-1 text-xs">{user.id}</code> (same as Supabase user id).
            </p>
            {startUrl ? (
                <a
                    className="mt-6 inline-flex rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                    href={startUrl}>
                    Continue with Google
                </a>
            ) : (
                <p className="mt-4 text-sm text-red-600">Set NEXT_PUBLIC_API_URL to your MailPilot API origin.</p>
            )}
            <p className="mt-8 text-xs text-zinc-500">
                After connecting, install the extension and use the same account (or link the extension user in a
                later step).
            </p>
            <Link className="mt-4 block text-sm text-zinc-600 underline hover:text-zinc-900" href="/dashboard/overview">
                Back to overview
            </Link>
        </div>
    );
}
