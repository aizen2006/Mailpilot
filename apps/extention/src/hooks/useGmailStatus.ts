import { useCallback, useEffect, useState } from "react";
import { getApiBaseUrl } from "~lib/api";

export type GmailStatus = {
  connected: boolean;
  email?: string;
};

export function useGmailStatus(userId: string | null): GmailStatus & {
  loading: boolean;
  refetch: () => Promise<void>;
} {
  const apiBase = getApiBaseUrl();
  const [data, setData] = useState<GmailStatus>({ connected: false });
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!userId) {
      setData({ connected: false });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${apiBase}/oauth/gmail/status?userId=${encodeURIComponent(userId)}`
      );
      if (!res.ok) {
        setData({ connected: false });
        return;
      }
      const json = (await res.json()) as GmailStatus;
      setData(json);
    } catch {
      setData({ connected: false });
    } finally {
      setLoading(false);
    }
  }, [apiBase, userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const onFocus = () => void refetch();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch]);

  return { ...data, loading, refetch };
}
