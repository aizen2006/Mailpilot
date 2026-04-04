import { tool, Tool } from "@openai/agents";
import { z } from "zod";
import { status } from "elysia";
import { randomBytes } from "node:crypto";

const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

function toBase64Url(raw: string): string {
  return Buffer.from(raw, "utf8").toString("base64url");
}

function encodeSubject(subject: string): string {
  if (/^[\x20-\x7E]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function wrapBase64ForMime(b64: string): string {
  const cleaned = b64.replace(/\s/g, "");
  return cleaned.replace(/(.{76})/g, "$1\r\n").replace(/\r\n$/, "");
}

type AddressHeaders = {
  from?: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
};

/** Plain text body as UTF-8 (Gmail accepts this in raw MIME). */
function buildPlainTextRfc2822Simple(
  { from, to, cc, bcc, subject, body }: AddressHeaders & { body: string },
): string {
  const lines: string[] = [];
  if (from) lines.push(`From: ${from}`);
  lines.push(`To: ${to}`);
  if (cc) lines.push(`Cc: ${cc}`);
  if (bcc) lines.push(`Bcc: ${bcc}`);
  lines.push(`Subject: ${encodeSubject(subject)}`);
  lines.push("MIME-Version: 1.0");
  lines.push('Content-Type: text/plain; charset="UTF-8"');
  lines.push("");
  lines.push(body.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"));
  return lines.join("\r\n");
}

function buildMultipartMixed(
  { from, to, cc, bcc, subject, body }: AddressHeaders & { body: string },
  attachments: { filename: string; mimeType: string; contentBase64: string }[],
): string {
  const boundary = `----=_Part_${randomBytes(12).toString("hex")}`;
  const lines: string[] = [];
  if (from) lines.push(`From: ${from}`);
  lines.push(`To: ${to}`);
  if (cc) lines.push(`Cc: ${cc}`);
  if (bcc) lines.push(`Bcc: ${bcc}`);
  lines.push(`Subject: ${encodeSubject(subject)}`);
  lines.push("MIME-Version: 1.0");
  lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
  lines.push("");
  lines.push(`--${boundary}`);
  lines.push('Content-Type: text/plain; charset="UTF-8"');
  lines.push("");
  lines.push(body.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"));
  for (const att of attachments) {
    lines.push(`--${boundary}`);
    lines.push(
      `Content-Type: ${att.mimeType}; name="${att.filename.replace(/"/g, "")}"`,
    );
    lines.push(
      `Content-Disposition: attachment; filename="${att.filename.replace(/"/g, "")}"`,
    );
    lines.push("Content-Transfer-Encoding: base64");
    lines.push("");
    lines.push(wrapBase64ForMime(att.contentBase64));
  }
  lines.push(`--${boundary}--`);
  return lines.join("\r\n");
}

export const readEmail: Tool = tool({
  name: "read-email",
  description: "Read the email from the user's inbox",
  parameters: z.object({
    emailId: z.string(),
    accessToken: z.string(),
  }),
  execute: async ({ accessToken }) => {
    try {
      const query = encodeURIComponent("in:sent after:2014/01/01 before:2014/02/01");
      const url = `https://www.googleapis.com/gmail/v1/users/me/messages?q=${query}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: { message?: string } };
        return status(
          response.status,
          `Failed to fetch emails: ${errorData.error?.message || "Unknown error"}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return status(500, `Error while reading the email : ${error}`);
    }
  },
});

function buildThreadsListUrl(params: {
  q?: string;
  maxResults?: number;
  pageToken?: string;
  labelIds?: string[];
  includeSpamTrash?: boolean;
}): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.maxResults != null) search.set("maxResults", String(params.maxResults));
  if (params.pageToken) search.set("pageToken", params.pageToken);
  if (params.labelIds) for (const id of params.labelIds) search.append("labelIds", id);
  if (params.includeSpamTrash) search.set("includeSpamTrash", "true");
  const qs = search.toString();
  return qs ? `${GMAIL_BASE}/threads?${qs}` : `${GMAIL_BASE}/threads`;
}

/** List conversation threads (threads.list). Same `q` search syntax as messages; any matching message includes the whole thread. */
export const listThreads: Tool = tool({
  name: "list-threads",
  description:
    "List Gmail threads via users/me/threads. Use optional q (same as message search), labelIds, maxResults, pageToken. Returns thread ids and snippets; use get-thread for full ordered messages.",
  parameters: z.object({
    accessToken: z.string(),
    q: z
      .string()
      .optional()
      .describe("Gmail search query (e.g. in:inbox, from:x, newer_than:7d)"),
    maxResults: z.number().int().min(1).max(500).optional(),
    pageToken: z.string().optional(),
    labelIds: z.array(z.string()).optional().describe("e.g. INBOX, UNREAD"),
    includeSpamTrash: z.boolean().optional(),
  }),
  execute: async ({ accessToken, q, maxResults, pageToken, labelIds, includeSpamTrash }) => {
    try {
      const url = buildThreadsListUrl({ q, maxResults, pageToken, labelIds, includeSpamTrash });
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        return status(
          response.status,
          `Failed to list threads: ${errorData.error?.message || response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      return status(500, `Error listing threads: ${error}`);
    }
  },
});

/** One thread with messages in conversation order (threads.get). */
export const getThread: Tool = tool({
  name: "get-thread",
  description:
    "Get a single Gmail thread by id (threads.get). Returns all messages in the conversation in order, with payloads (subject/headers/body) when format is full.",
  parameters: z.object({
    accessToken: z.string(),
    threadId: z.string().describe("Thread id from list-threads or message.threadId"),
    format: z
      .enum(["full", "metadata", "minimal", "raw"])
      .optional()
      .describe("full = headers + body; metadata = ids/labels/headers; minimal = basic fields"),
    metadataHeaders: z
      .array(z.string())
      .optional()
      .describe("When format is metadata, which headers to include (e.g. Subject, From)"),
  }),
  execute: async ({ accessToken, threadId, format, metadataHeaders }) => {
    try {
      const search = new URLSearchParams();
      if (format) search.set("format", format);
      if (metadataHeaders?.length) {
        for (const h of metadataHeaders) search.append("metadataHeaders", h);
      }
      const qs = search.toString();
      const url = qs
        ? `${GMAIL_BASE}/threads/${encodeURIComponent(threadId)}?${qs}`
        : `${GMAIL_BASE}/threads/${encodeURIComponent(threadId)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        return status(
          response.status,
          `Failed to get thread: ${errorData.error?.message || response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      return status(500, `Error getting thread: ${error}`);
    }
  },
});

export const createDraft: Tool = tool({
  name: "create-draft",
  description:
    "Create a Gmail draft. Builds an RFC 2822 message, base64url-encodes it, and POSTs to users/me/drafts.",
  parameters: z.object({
    accessToken: z.string(),
    to: z.string().describe("Recipient email address(es), comma-separated if multiple"),
    subject: z.string(),
    body: z.string(),
    from: z.string().optional().describe("Optional From header; defaults to authenticated user if omitted"),
    cc: z.string().optional(),
    bcc: z.string().optional(),
  }),
  execute: async ({ accessToken, to, subject, body, from, cc, bcc }) => {
    try {
      const raw = toBase64Url(
        buildPlainTextRfc2822Simple({ from, to, cc, bcc, subject, body }),
      );
      const response = await fetch(`${GMAIL_BASE}/drafts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: { raw } }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return status(
          response.status,
          `Failed to create draft: ${(errorData as { error?: { message?: string } }).error?.message || response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      return status(500, `Error creating draft: ${error}`);
    }
  },
});

export const createDraftWithAttachments: Tool = tool({
  name: "create-draft-with-attachments",
  description:
    "Create a Gmail draft with one or more attachments. Pass each file as base64 (standard) with filename and optional MIME type.",
  parameters: z.object({
    accessToken: z.string(),
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    from: z.string().optional(),
    cc: z.string().optional(),
    bcc: z.string().optional(),
    attachments: z
      .array(
        z.object({
          filename: z.string(),
          mimeType: z.string().optional().default("application/octet-stream"),
          contentBase64: z
            .string()
            .describe("File bytes encoded as standard base64 (not base64url)"),
        }),
      )
      .min(1),
  }),
  execute: async ({ accessToken, to, subject, body, from, cc, bcc, attachments }) => {
    try {
      const mime = buildMultipartMixed(
        { from, to, cc, bcc, subject, body },
        attachments.map((a) => ({
          filename: a.filename,
          mimeType: a.mimeType ?? "application/octet-stream",
          contentBase64: a.contentBase64,
        })),
      );
      const raw = toBase64Url(mime);
      const response = await fetch(`${GMAIL_BASE}/drafts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: { raw } }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return status(
          response.status,
          `Failed to create draft with attachments: ${(errorData as { error?: { message?: string } }).error?.message || response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      return status(500, `Error creating draft with attachments: ${error}`);
    }
  },
});

export const sendEmail: Tool = tool({
  name: "send-email",
  description:
    "Send an email immediately via Gmail messages.send. Same as a draft but uses users/me/messages/send with a base64url-encoded raw RFC 2822 message.",
  parameters: z.object({
    accessToken: z.string(),
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    from: z.string().optional(),
    cc: z.string().optional(),
    bcc: z.string().optional(),
  }),
  execute: async ({ accessToken, to, subject, body, from, cc, bcc }) => {
    try {
      const raw = toBase64Url(
        buildPlainTextRfc2822Simple({ from, to, cc, bcc, subject, body }),
      );
      const response = await fetch(`${GMAIL_BASE}/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return status(
          response.status,
          `Failed to send message: ${(errorData as { error?: { message?: string } }).error?.message || response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      return status(500, `Error sending message: ${error}`);
    }
  },
});

export const sendEmailWithAttachments: Tool = tool({
  name: "send-email-with-attachments",
  description: "Send an email with attachments via messages.send (multipart MIME, raw base64url).",
  parameters: z.object({
    accessToken: z.string(),
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    from: z.string().optional(),
    cc: z.string().optional(),
    bcc: z.string().optional(),
    attachments: z
      .array(
        z.object({
          filename: z.string(),
          mimeType: z.string().optional().default("application/octet-stream"),
          contentBase64: z.string(),
        }),
      )
      .min(1),
  }),
  execute: async ({ accessToken, to, subject, body, from, cc, bcc, attachments }) => {
    try {
      const mime = buildMultipartMixed(
        { from, to, cc, bcc, subject, body },
        attachments.map((a) => ({
          filename: a.filename,
          mimeType: a.mimeType ?? "application/octet-stream",
          contentBase64: a.contentBase64,
        })),
      );
      const raw = toBase64Url(mime);
      const response = await fetch(`${GMAIL_BASE}/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return status(
          response.status,
          `Failed to send message with attachments: ${(errorData as { error?: { message?: string } }).error?.message || response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      return status(500, `Error sending message with attachments: ${error}`);
    }
  },
});
