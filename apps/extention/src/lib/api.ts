export function getApiBaseUrl(): string {
  const raw = process.env.PLASMO_PUBLIC_API_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function oauthGoogleStartUrl(apiBase: string, userId: string): string {
  return `${apiBase}/oauth/google/start?userId=${encodeURIComponent(userId)}`;
}
