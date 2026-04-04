import { fetchUsageSummary } from "@/app/actions/usage-summary";

export default async function OverviewPage() {
    const usage = await fetchUsageSummary();

    return (
        <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Overview</h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-600">
                Your Postgres user row stays in sync with Supabase on each dashboard load. Gmail connect lives under{" "}
                <strong>Connect Gmail</strong> in the sidebar.
            </p>
            <div className="mt-8">
                <h2 className="text-sm font-semibold text-zinc-800">Usage (last 30 days)</h2>
                {!usage.ok ? (
                    <p className="mt-2 text-sm text-amber-700">{usage.error}</p>
                ) : usage.rows.length === 0 ? (
                    <p className="mt-2 text-sm text-zinc-500">No usage events recorded yet.</p>
                ) : (
                    <ul className="mt-3 max-w-md divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white text-sm">
                        {usage.rows.map((row) => (
                            <li className="flex justify-between px-3 py-2" key={row.kind}>
                                <span className="text-zinc-700">{row.kind}</span>
                                <span className="font-mono text-zinc-900">{row.total}</span>
                            </li>
                        ))}
                    </ul>
                )}
                {usage.ok ? (
                    <p className="mt-2 text-xs text-zinc-500">From {usage.from}</p>
                ) : null}
            </div>
        </div>
    );
}
