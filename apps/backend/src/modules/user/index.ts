import { Elysia, status } from "elysia";
import { bearerToken, requireSupabaseUserId } from "../../libs/requireAuth";
import { getUserFromJwt } from "../../libs/supabaseAdmin";
import { UserModel } from "./model";
import { UserService } from "./service";

const app = new Elysia({ prefix: "/user" })
    .get("/health", () => console.log("User Route is Working"))
    .post("/bootstrap-extension", async () => {
        return UserService.bootstrapExtensionUser();
    })
    .post("/sync-supabase", async ({ request }) => {
        const token = bearerToken(request);
        if (!token) {
            return status(401, "Missing Bearer token");
        }
        let user;
        try {
            user = await getUserFromJwt(token);
        } catch {
            return status(503, "Supabase admin client not configured");
        }
        if (!user?.id || !user.email) {
            return status(401, "Invalid or expired token");
        }
        const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
        const name = meta?.full_name ?? meta?.name ?? user.email.split("@")[0];
        return UserService.syncFromSupabaseUser({
            id: user.id,
            email: user.email,
            name,
        });
    })
    .post("/link-code", async ({ request }) => {
        const userId = await requireSupabaseUserId(request);
        if (!userId) {
            return status(401, "Unauthorized");
        }
        return UserService.createLinkCode(userId);
    })
    .post(
        "/link-extension",
        async ({ body }) => UserService.linkExtensionUser(body),
        { body: UserModel.linkExtensionBody }
    )
    .get(
        "/byId",
        async ({ body }) => UserService.getUserById(body.userId),
        { body: UserModel.getUserById }
    )
    .get(
        "/conversations",
        async ({ body }) => UserService.getConversationsByUserId(body.userId),
        { body: UserModel.getConversationsByUserId }
    )
    .get(
        "/messages",
        async ({ body }) => UserService.getMessagesByConversationId(body.conversationId),
        { body: UserModel.getMessagesByConversationId }
    );

export { app };
