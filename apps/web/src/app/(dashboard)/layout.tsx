import { syncUserWithBackend } from "@/app/actions/sync-user";
import Link from "next/link";

export const dynamic = "force-dynamic";

const nav = [
    { href: "/dashboard/overview", label: "Overview" },
    { href: "/dashboard/usage", label: "Usage" },
    { href: "/dashboard/spending", label: "Spending" },
    { href: "/dashboard/billing", label: "Billing" },
    { href: "/dashboard/settings", label: "Settings" },
    { href: "/connect/gmail", label: "Connect Gmail" },
] as const;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    await syncUserWithBackend();

    return (
        <div className="flex min-h-screen">
            <aside className="w-52 shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-6">
                <Link className="block px-2 text-sm font-semibold text-zinc-900" href="/dashboard/overview">
                    MailPilot
                </Link>
                <nav className="mt-6 flex flex-col gap-1">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            className="rounded-md px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-900"
                            href={item.href}>
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <Link className="mt-8 block px-2 text-xs text-zinc-500 hover:text-zinc-800" href="/">
                    Back to home
                </Link>
            </aside>
            <div className="min-w-0 flex-1 bg-white p-8">{children}</div>
        </div>
    );
}
