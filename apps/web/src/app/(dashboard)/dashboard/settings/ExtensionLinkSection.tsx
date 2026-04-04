"use client";

import { createExtensionLinkCode } from "@/app/actions/link-code";
import { useState, useTransition } from "react";

export function ExtensionLinkSection() {
    const [code, setCode] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    return (
        <section className="mt-8 max-w-xl rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <h2 className="text-sm font-semibold text-zinc-900">Link Chrome extension</h2>
            <p className="mt-2 text-sm text-zinc-600">
                If the extension created an anonymous account, generate a one-time code here and enter it in the
                extension (call{" "}
                <code className="rounded bg-white px-1 text-xs">POST {`{API}/user/link-extension`}</code> with{" "}
                <code className="rounded bg-white px-1 text-xs">code</code> and{" "}
                <code className="rounded bg-white px-1 text-xs">extensionUserId</code>
                ). Codes expire in 15 minutes.
            </p>
            <button
                className="mt-3 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-50"
                disabled={pending}
                onClick={() => {
                    setError(null);
                    setCode(null);
                    startTransition(async () => {
                        const r = await createExtensionLinkCode();
                        if (r.ok) {
                            setCode(r.code);
                            setExpiresAt(r.expiresAt);
                        } else {
                            setError(r.error);
                        }
                    });
                }}
                type="button">
                {pending ? "Generating…" : "Generate link code"}
            </button>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            {code ? (
                <div className="mt-3 rounded-md border border-zinc-200 bg-white p-3">
                    <p className="text-xs font-medium uppercase text-zinc-500">Your code</p>
                    <p className="mt-1 font-mono text-sm break-all text-zinc-900">{code}</p>
                    {expiresAt ? (
                        <p className="mt-2 text-xs text-zinc-500">Expires: {new Date(expiresAt).toLocaleString()}</p>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}
