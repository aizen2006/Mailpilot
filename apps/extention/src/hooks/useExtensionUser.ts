import { useEffect, useState } from "react";
import { getApiBaseUrl } from "~lib/api";
import { ensureExtensionUserId } from "~lib/extensionUser";

export function useExtensionUser(enabled: boolean = true): {
  userId: string | null;
  error: string | null;
  loading: boolean;
} {
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    let cancelled = false;
    (async () => {
      try {
        const id = await ensureExtensionUserId(getApiBaseUrl());
        if (!cancelled) {
          setUserId(id);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load account");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { userId, error, loading };
}
