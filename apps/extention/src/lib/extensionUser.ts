/**
 * Anonymous extension user id. To use your Supabase account instead: open the web app Settings,
 * generate a link code, then POST `{API}/user/link-extension` with `{ code, extensionUserId }`
 * (or add UI in the extension that calls the same).
 */
import { Storage } from "@plasmohq/storage";

const storage = new Storage({ area: "local" });

const USER_KEY = "mailpilot_user_id";

let bootstrapPromise: Promise<string> | null = null;

export async function ensureExtensionUserId(apiBase: string): Promise<string> {
  const cached = await storage.get<string>(USER_KEY);
  if (cached) {
    return cached;
  }
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const res = await fetch(`${apiBase}/user/bootstrap-extension`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`bootstrap-extension failed: ${res.status}`);
      }
      const data = (await res.json()) as { userId: string };
      if (!data.userId) {
        throw new Error("bootstrap-extension: missing userId");
      }
      await storage.set(USER_KEY, data.userId);
      return data.userId;
    })().finally(() => {
      bootstrapPromise = null;
    });
  }
  return bootstrapPromise;
}
