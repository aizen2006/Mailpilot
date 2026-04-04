import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { app as chat} from "./modules/chat/index";
import { app as user} from "./modules/user/index";
import { app as auth} from "./modules/auth/index";
import {app as gmailOAuth} from "./modules/gmail_oauth/index";

const app = new Elysia()
    .use(
        cors({
            origin: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type"],
        })
    )
    .get("/health", () => "Hello Elysia")
    .use(auth)
    .use(gmailOAuth)
    .use(chat)
    .use(user)
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
