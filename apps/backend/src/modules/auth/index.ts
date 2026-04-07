import { Elysia, status } from "elysia";
import { Auth } from "./model";
import { Auth as AuthService } from "./service";
import { bearerToken } from "../../libs/requireAuth";

const app = new Elysia({ prefix: "/auth" })
    .get("/health", () => console.log("Auth Route is Working"))
    .post(
        "/signUp",
        async ({ body }) => {
            const result = await AuthService.signUpNewUser(body.email, body.password);
            if (result.error) {
                return status(400, result.error);
            }
            return { user: result.user, session: result.session };
        },
        { body: Auth.signUpBody }
    )
    .post(
        "/signIn",
        async ({ body }) => {
            const result = await AuthService.signInWithEmail(body.email, body.password);
            if (result.error) {
                return status(400, result.error);
            }
            return { user: result.user, session: result.session };
        },
        { body: Auth.signInBody }
    )
    .post("/signOut", async () => {
        const result = await AuthService.signOut();
        if (result.error) {
            return status(500, result.error);
        }
        return { ok: true };
    })
    .get("/me", async ({ request }) => {
        const token = bearerToken(request);
        if (!token) {
            return status(401, "Missing Bearer token");
        }

        try {
            const result = await AuthService.me(token);
            if (result.error) {
                return status(401, result.error);
            }
            return result.user;
        } catch {
            return status(503, "Supabase admin client not configured");
        }
    });

export { app };
