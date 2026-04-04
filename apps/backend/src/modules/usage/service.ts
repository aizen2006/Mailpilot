import db from "db";
import { UsageEventTable } from "db/schema/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { status } from "elysia";

export abstract class UsageService {
    static async recordEvent(params: {
        userId: string;
        kind: string;
        quantity: number;
        unit?: string | null;
        metadata?: Record<string, unknown> | null;
    }) {
        await db.insert(UsageEventTable).values({
            userId: params.userId,
            kind: params.kind,
            quantity: String(params.quantity),
            unit: params.unit ?? null,
            metadata: params.metadata ?? null,
        });
    }

    static async getSummary(userId: string, fromIso?: string) {
        const from = fromIso ? new Date(fromIso) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        if (Number.isNaN(from.getTime())) {
            throw status(400, "Invalid from date");
        }

        const rows = await db
            .select({
                kind: UsageEventTable.kind,
                total: sql<string>`coalesce(sum(${UsageEventTable.quantity}), 0)::text`.as("total"),
            })
            .from(UsageEventTable)
            .where(and(eq(UsageEventTable.userId, userId), gte(UsageEventTable.createdAt, from)))
            .groupBy(UsageEventTable.kind);

        return { from: from.toISOString(), rows };
    }
}
