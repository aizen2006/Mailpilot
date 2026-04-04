import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { app as auth } from "./modules/auth/index";
import { app as billing } from "./modules/billing/index";
import { app as chat } from "./modules/chat/index";
import { app as gmailOAuth } from "./modules/gmail_oauth/index";
import { app as usage } from "./modules/usage/index";
import { app as user } from "./modules/user/index";

const app = new Elysia()
    .use(
        cors({
            origin: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
        })
    )
    .use(
        swagger({
            path: "/swagger",
            documentation: {
                info: {
                    title: "MailPilot API",
                    version: "1.0.0",
                    description: [
                        "REST API for MailPilot: Gmail OAuth, chat, Postgres-backed users, usage metering, and Stripe billing.",
                        "",
                        "**JWT (Supabase):** Some routes require `Authorization: Bearer <supabase_access_token>`. Obtain tokens via Supabase Auth (e.g. the Next.js web app) or `/auth/signIn` when using the server-side Supabase client.",
                        "",
                        "**Stripe webhook:** `POST /billing/webhooks/stripe` is **only for Stripe**. It expects the **raw** request body (do not pre-parse JSON) and the `Stripe-Signature` header for verification.",
                    ].join("\n"),
                },
                tags: [
                    { name: "Health", description: "Liveness checks" },
                    { name: "Auth", description: "Supabase Auth via backend" },
                    { name: "User", description: "Users, extension bootstrap, sync, linking" },
                    { name: "OAuth", description: "Google / Gmail OAuth" },
                    { name: "Usage", description: "Usage aggregates" },
                    { name: "Billing", description: "Stripe portal and webhooks" },
                    { name: "Chat", description: "AI chat endpoints" },
                ],
            },
        })
    )
    .get("/health", () => "Hello Elysia")
    .use(auth)
    .use(billing)
    .use(gmailOAuth)
    .use(usage)
    .use(chat)
    .use(user)
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
