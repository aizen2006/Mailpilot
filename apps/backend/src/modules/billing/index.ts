import { Elysia, status } from "elysia";
import { requireSupabaseUserId } from "../../libs/requireAuth";
import { BillingService } from "./service";

const app = new Elysia({ prefix: "/billing" })
    .get("/portal", async ({ request }) => {
        const userId = await requireSupabaseUserId(request);
        if (!userId) {
            return status(401, "Unauthorized");
        }
        try {
            return await BillingService.createPortalSession(userId);
        } catch (e) {
            if (typeof e === "object" && e !== null && "message" in e) {
                const msg = String((e as { message?: string }).message);
                if (msg.includes("No Stripe customer")) {
                    return status(400, msg);
                }
            }
            throw e;
        }
    })
    .post("/webhooks/stripe", async ({ request }) => {
        const signature = request.headers.get("stripe-signature");
        const body = await request.text();
        return BillingService.handleStripeWebhook(body, signature);
    });

export { app };
