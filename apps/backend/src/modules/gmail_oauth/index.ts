import { Elysia, status } from "elysia";
import { GmailOAuthModel } from "./model";
import { GmailOAuthService } from "./service";

function successRedirectBase(): string {
    return (
        process.env.OAUTH_SUCCESS_URL?.replace(/\/$/, "") ??
        "http://localhost:3000/oauth/success"
    );
}

const successPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MailPilot — Gmail connected</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 28rem; margin: 3rem auto; padding: 0 1.25rem; color: #111827; }
    h1 { font-size: 1.25rem; }
    p { color: #4b5563; line-height: 1.5; }
    .ok { color: #0f766e; font-weight: 600; }
    .err { color: #b91c1c; font-weight: 600; }
  </style>
</head>
<body>
  <h1>MailPilot</h1>
  <p id="msg">Loading…</p>
  <script>
    const p = new URLSearchParams(location.search);
    const msg = document.getElementById("msg");
    if (p.get("error")) {
      msg.className = "err";
      msg.textContent = "Could not connect Gmail (" + (p.get("error") || "error") + "). You can close this tab.";
    } else if (p.get("connected") === "1") {
      msg.className = "ok";
      msg.textContent = "Gmail is connected. Return to the MailPilot extension and open the sidebar.";
    } else {
      msg.textContent = "You can close this tab.";
    }
  </script>
</body>
</html>`;

const app = new Elysia({ prefix: "/oauth" })
    .get("/health", () => status(200, "Gmail OAuth Route is Working"))
    .get(
        "/google/start",
        ({ query }) => {
            const url = GmailOAuthService.buildGoogleAuthUrl(query.userId);
            return Response.redirect(url, 302);
        },
        { query: GmailOAuthModel.QueryUserId }
    )
    .get(
        "/google/url",
        ({ query }) => {
            return { url: GmailOAuthService.buildGoogleAuthUrl(query.userId) };
        },
        { query: GmailOAuthModel.QueryUserId }
    )
    .get(
        "/google/callback",
        async ({ query }) => {
            const base = successRedirectBase();
            if (query.error) {
                const q = new URLSearchParams({ error: query.error });
                return Response.redirect(`${base}?${q}`, 302);
            }
            const code = query.code;
            const state = query.state;
            if (!code || !state) {
                return Response.redirect(`${base}?error=missing_params`, 302);
            }
            try {
                await GmailOAuthService.exchangeAndSaveTokens(code, state);
            } catch {
                return Response.redirect(`${base}?error=token_exchange`, 302);
            }
            return Response.redirect(`${base}?connected=1`, 302);
        },
        { query: GmailOAuthModel.QueryOAuthCallback }
    )
    .get("/success", () => {
        return new Response(successPageHtml, {
            headers: { "content-type": "text/html; charset=utf-8" },
        });
    })
    .get(
        "/gmail/status",
        async ({ query }) => {
            return GmailOAuthService.getGmailStatus(query.userId);
        },
        { query: GmailOAuthModel.QueryUserId }
    );

export { app };
