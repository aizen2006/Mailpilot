import Link from "next/link";

type Props = { searchParams: Promise<{ connected?: string; error?: string }> };

export default async function ConnectGmailDonePage({ searchParams }: Props) {
    const q = await searchParams;
    const ok = q.connected === "1";
    const err = q.error;

    return (
        <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
            <h1 className="text-xl font-semibold text-zinc-900">Gmail connection</h1>
            {ok ? (
                <p className="text-sm text-zinc-600">
                    Gmail is connected. You can close this tab and return to the MailPilot extension or{" "}
                    <Link className="font-medium text-zinc-900 underline" href="/dashboard/overview">
                        open the dashboard
                    </Link>
                    .
                </p>
            ) : err ? (
                <p className="text-sm text-red-600">
                    Something went wrong ({err}). Try again from{" "}
                    <Link className="underline" href="/connect/gmail">
                        Connect Gmail
                    </Link>
                    .
                </p>
            ) : (
                <p className="text-sm text-zinc-600">You can close this tab.</p>
            )}
        </main>
    );
}
