export function getApiBaseUrl(): string {
  const raw = process.env.PLASMO_PUBLIC_API_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function oauthGoogleStartUrl(
  apiBase: string,
  userId: string,
  extensionRedirectUri?: string
): string {
  const query = new URLSearchParams({ userId })
  if (extensionRedirectUri) {
    query.set("extensionRedirectUri", extensionRedirectUri)
  }
  return `${apiBase}/oauth/google/start?${query.toString()}`
}

export async function disconnectGmail(apiBase: string, userId: string): Promise<void> {
  const res = await fetch(`${apiBase}/oauth/gmail/disconnect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    throw new Error(`Disconnect failed: ${res.status}`);
  }
}

export async function linkExtensionAccount(
  apiBase: string,
  code: string,
  extensionUserId: string
): Promise<{ userId: string }> {
  const res = await fetch(`${apiBase}/user/link-extension`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, extensionUserId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `Link failed: ${res.status}`);
  }
  return res.json() as Promise<{ userId: string }>;
}
