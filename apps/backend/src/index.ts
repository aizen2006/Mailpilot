import { Elysia } from "elysia";
import { app as chat} from "./modules/chat/index";
import { app as user} from "./modules/user/index";
import { app as auth} from "./modules/auth/index";

const app = new Elysia()
    .get("/health", () => "Hello Elysia")
    .use(auth)
    .use(chat)
    .use(user)
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
