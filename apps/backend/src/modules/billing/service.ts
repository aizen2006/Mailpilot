import db from "db";
import { InvoiceTable, PlanTable, SubscriptionTable, UserTable } from "db/schema/schema";
import { eq } from "drizzle-orm";
import { status } from "elysia";
import Stripe from "stripe";

function getStripe(): Stripe | null {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        return null;
    }
    return new Stripe(key);
}

export abstract class BillingService {
    static async createPortalSession(userId: string): Promise<{ url: string }> {
        const stripe = getStripe();
        if (!stripe) {
            throw status(503, "Stripe is not configured (STRIPE_SECRET_KEY)");
        }
        const rows = await db
            .select({ stripeCustomerId: UserTable.stripeCustomerId })
            .from(UserTable)
            .where(eq(UserTable.id, userId))
            .limit(1);
        const customerId = rows[0]?.stripeCustomerId;
        if (!customerId) {
            throw status(
                400,
                "No Stripe customer on file. Subscribe or complete checkout first."
            );
        }
        const returnUrl =
            process.env.STRIPE_PORTAL_RETURN_URL ?? "http://localhost:3001/dashboard/billing";
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
        return { url: session.url };
    }

    static async handleStripeWebhook(rawBody: string, signature: string | null) {
        const stripe = getStripe();
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!stripe || !secret) {
            throw status(503, "Stripe webhook not configured");
        }
        if (!signature) {
            throw status(400, "Missing stripe-signature header");
        }
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, secret);
        } catch (e) {
            throw status(400, `Webhook signature verification failed: ${e}`);
        }

        switch (event.type) {
            case "customer.subscription.updated":
            case "customer.subscription.created": {
                const sub = event.data.object as Stripe.Subscription;
                const cust = sub.customer;
                const customerId =
                    typeof cust === "string"
                        ? cust
                        : cust && typeof cust === "object" && "id" in cust
                          ? cust.id
                          : null;
                if (!customerId) {
                    break;
                }
                const users = await db
                    .select({ id: UserTable.id })
                    .from(UserTable)
                    .where(eq(UserTable.stripeCustomerId, customerId))
                    .limit(1);
                const userId = users[0]?.id;
                if (!userId) {
                    break;
                }
                await db
                    .update(UserTable)
                    .set({ stripeCustomerId: customerId, updatedAt: new Date() })
                    .where(eq(UserTable.id, userId));
                const priceId = sub.items.data[0]?.price?.id;
                const planKey = priceId ? await BillingService.planKeyForStripePrice(priceId) : "free";
                const statusMap: Record<
                    string,
                    | "active"
                    | "trialing"
                    | "past_due"
                    | "canceled"
                    | "unpaid"
                    | "incomplete"
                    | "incomplete_expired"
                > = {
                    active: "active",
                    trialing: "trialing",
                    past_due: "past_due",
                    canceled: "canceled",
                    unpaid: "unpaid",
                    incomplete: "incomplete",
                    incomplete_expired: "incomplete_expired",
                };
                const st = statusMap[sub.status] ?? "incomplete";
                await db
                    .insert(SubscriptionTable)
                    .values({
                        userId,
                        planKey,
                        stripeCustomerId: customerId,
                        stripeSubscriptionId: sub.id,
                        status: st,
                        currentPeriodStart: sub.current_period_start
                            ? new Date(sub.current_period_start * 1000)
                            : null,
                        currentPeriodEnd: sub.current_period_end
                            ? new Date(sub.current_period_end * 1000)
                            : null,
                        cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
                    })
                    .onConflictDoUpdate({
                        target: SubscriptionTable.stripeSubscriptionId,
                        set: {
                            status: st,
                            planKey,
                            currentPeriodStart: sub.current_period_start
                                ? new Date(sub.current_period_start * 1000)
                                : null,
                            currentPeriodEnd: sub.current_period_end
                                ? new Date(sub.current_period_end * 1000)
                                : null,
                            cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
                            updatedAt: new Date(),
                        },
                    });
                break;
            }
            case "invoice.paid":
            case "invoice.payment_succeeded": {
                const inv = event.data.object as Stripe.Invoice;
                const invCust = inv.customer;
                const customerId =
                    typeof invCust === "string"
                        ? invCust
                        : invCust && typeof invCust === "object" && "id" in invCust
                          ? invCust.id
                          : null;
                if (!customerId || !inv.id) {
                    break;
                }
                const users = await db
                    .select({ id: UserTable.id })
                    .from(UserTable)
                    .where(eq(UserTable.stripeCustomerId, customerId))
                    .limit(1);
                const userId = users[0]?.id;
                if (!userId) {
                    break;
                }
                await db
                    .insert(InvoiceTable)
                    .values({
                        userId,
                        stripeInvoiceId: inv.id,
                        amountDue: inv.amount_due ?? 0,
                        currency: inv.currency ?? "usd",
                        status: inv.status ?? "unknown",
                        hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
                        periodStart: inv.period_start
                            ? new Date(inv.period_start * 1000)
                            : null,
                        periodEnd: inv.period_end ? new Date(inv.period_end * 1000) : null,
                    })
                    .onConflictDoUpdate({
                        target: InvoiceTable.stripeInvoiceId,
                        set: {
                            amountDue: inv.amount_due ?? 0,
                            status: inv.status ?? "unknown",
                            hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
                        },
                    });
                break;
            }
            default:
                break;
        }

        return { received: true };
    }

    private static async planKeyForStripePrice(priceId: string): Promise<string> {
        const rows = await db
            .select({ key: PlanTable.key })
            .from(PlanTable)
            .where(eq(PlanTable.stripePriceId, priceId))
            .limit(1);
        return rows[0]?.key ?? "free";
    }
}
