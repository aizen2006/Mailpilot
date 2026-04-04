import { Elysia, status } from "elysia";
import { requireSupabaseUserId } from "../../libs/requireAuth";
import { UsageService } from "./service";

const app = new Elysia({ prefix: "/usage" }).get("/summary", async ({ request, query }) => {
    const userId = await requireSupabaseUserId(request);
    if (!userId) {
        return status(401, "Unauthorized");
    }
    const from = typeof query.from === "string" ? query.from : undefined;
    return UsageService.getSummary(userId, from);
});

export { app };
