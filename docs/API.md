# MailPilot backend API

HTTP API for the MailPilot monorepo: **Bun** + **Elysia** (`apps/backend`). Default local base URL: `http://localhost:3000`.

## Interactive docs (OpenAPI)

When the backend is running:

| Resource        | URL                        |
| --------------- | -------------------------- |
| Scalar UI       | `http://localhost:3000/swagger` |
| OpenAPI JSON    | `http://localhost:3000/swagger/json` |

Schemas and paths are generated from route definitions; use the UI to try requests where safe.

> [!NOTE]
> **`POST /billing/webhooks/stripe`** is **not** a normal JSON API. Stripe sends a **raw** body and a **`Stripe-Signature`** header. Only Stripe should call it, with the signing secret configured on the server.

## CORS

`Access-Control-Allow-Origin` reflects the request origin (`origin: true`). Allowed methods include `GET`, `POST`, `OPTIONS`, etc. Allowed request headers include:

- `Content-Type`
- `Authorization` (Bearer JWT)
- `Stripe-Signature` (webhooks)

## Authentication

| Mechanism | Usage |
| --------- | ----- |
| **Supabase JWT** | `Authorization: Bearer <access_token>`. Verified with the Supabase **service role** client (`SUPABASE_SERVICE_ROLE_KEY`). The subject `sub` / user id matches `public.users.id` for web accounts (see `POST /user/sync-supabase`). |
| **None** | Public or extension-only flows where noted (e.g. extension bootstrap, Gmail OAuth browser redirects, Stripe webhook). |

## Routes by prefix

### `GET /health`

Liveness: returns plain text.

---

### `/auth` — Supabase via backend client

| Method | Path | Body | Auth | Description |
| ------ | ---- | ---- | ---- | ----------- |
| GET | `/auth/health` | — | — | Dev log hook |
| POST | `/auth/signUp` | `{ email, password }` | — | `supabase.auth.signUp` |
| POST | `/auth/signIn` | `{ email, password }` | — | `supabase.auth.signInWithPassword` |
| POST | `/auth/signOut` | — | — | Server-side sign-out (limited without client session) |

---

### `/user`

| Method | Path | Body / query | Auth | Description |
| ------ | ---- | ------------ | ---- | ----------- |
| GET | `/user/health` | — | — | Dev log hook |
| POST | `/user/bootstrap-extension` | — | — | Creates anonymous `users` row for the Chrome extension |
| POST | `/user/sync-supabase` | — | Bearer | Upserts `public.users` from JWT (`id` = Supabase user id) |
| POST | `/user/link-code` | — | Bearer | Returns one-time code (15m) to link extension user → web account |
| POST | `/user/link-extension` | `{ code, extensionUserId }` | — | Merges extension user into owner; consumes code |
| GET | `/user/byId` | body `{ userId }` | — | Load user rows (legacy shape: GET with body) |
| GET | `/user/conversations` | body `{ userId }` | — | Conversations (+ messages join) |
| GET | `/user/messages` | body `{ conversationId }` | — | Messages for conversation |

> [!TIP]
> Prefer **`POST /user/sync-supabase`** from the Next.js app after Supabase login so `users.id` stays aligned with `auth.users.id`.

---

### `/oauth` — Gmail (Google OAuth)

| Method | Path | Query | Auth | Description |
| ------ | ---- | ----- | ---- | ----------- |
| GET | `/oauth/health` | — | — | Health |
| GET | `/oauth/google/start` | `userId` (UUID) | — | **302** to Google consent (`state` = `userId`) |
| GET | `/oauth/google/url` | `userId` | — | JSON `{ url }` for debugging |
| GET | `/oauth/google/callback` | `code`, `state`, optional `error` | — | Google redirect; exchanges code; **302** to success URL |
| GET | `/oauth/success` | — | — | HTML fallback success page |
| GET | `/oauth/gmail/status` | `userId` | — | JSON `{ connected, email? }` |

Configure **`GOOGLE_REDIRECT_URI`** to match the callback URL registered in Google Cloud (typically `…/oauth/google/callback` on this API). Set **`OAUTH_SUCCESS_URL`** to your web app (e.g. `http://localhost:3001/connect/gmail/done`).

---

### `/usage`

| Method | Path | Query | Auth | Description |
| ------ | ---- | ----- | ---- | ----------- |
| GET | `/usage/summary` | `from` (ISO date, optional) | Bearer | Aggregates `usage_events` by `kind` since `from` (default ~30 days) |

---

### `/billing`

| Method | Path | Body | Auth | Description |
| ------ | ---- | ---- | ---- | ----------- |
| GET | `/billing/portal` | — | Bearer | Stripe Customer Portal URL (`users.stripe_customer_id` required) |
| POST | `/billing/webhooks/stripe` | **Raw** payload | `Stripe-Signature` | Stripe webhooks; verifies signature |

---

### `/chat`

| Method | Path | Body | Auth | Description |
| ------ | ---- | ---- | ---- | ----------- |
| GET | `/chat/health` | — | — | Dev log hook |
| POST | `/chat/text` | `{ userId, message }` | — | Text chat / agents |
| POST | `/chat/audio` | `{ userId, audio }` | — | Audio chat |

---

## Environment variables

See **[apps/backend/.env.example](../apps/backend/.env.example)** for:

- Database, Google OAuth, Supabase, Stripe, and optional success redirect URLs.

## Related apps

- **Web:** `apps/web` — calls this API with `NEXT_PUBLIC_API_URL` and Bearer tokens from Supabase sessions.
- **Extension:** `apps/extention` — uses `PLASMO_PUBLIC_API_URL`; Gmail connect may open this API’s `/oauth/google/start` in a tab.
