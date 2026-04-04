import Link from "next/link";

export default function HomePage() {
    return (
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">MailPilot</h1>
                <p className="mt-3 text-lg text-zinc-600">
                    Email assistant in your browser. Connect Gmail from the web app, then use the Chrome
                    extension for chat.
                </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Link
                    className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                    href="/signup">
                    Get started
                </Link>
                <Link
                    className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                    href="/login">
                    Log in
                </Link>
                <Link className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900" href="/dashboard/overview">
                    Dashboard
                </Link>
            </div>
        </main>
    );
}
