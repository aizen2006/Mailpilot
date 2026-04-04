/*
Users Service
translate audio to english text ( using sarvam ai api ) -- Done
CRUD operations on the conversations 
the services will be connect the Gmail API or MCP which is better  ??? 
user persona ( needed later will , do it via a vector DB ) // Quadrant
Voice agent ( needed later ,  ) // try to create it using Sarvam  
*/
import { createHash, randomBytes, randomUUID } from "node:crypto";
import db from "db";
import {
    ConversationTable,
    LinkCodeTable,
    MessageTable,
    UserGmailTokensTable,
    UserTable,
} from "db/schema/schema";
import { and, eq, gt, isNull } from "drizzle-orm";
import { status } from "elysia";


export abstract class UserService {
    /** Creates a local DB user for the extension (OAuth tokens reference `users.id`). */
    static async bootstrapExtensionUser() {
        try {
            const id = randomUUID();
            const password = await Bun.password.hash(randomUUID());
            const email = `ext-${id}@users.mailpilot.local`;
            const [row] = await db
                .insert(UserTable)
                .values({
                    id,
                    name: "MailPilot Extension",
                    email,
                    password,
                })
                .returning({ id: UserTable.id });
            if (!row) {
                throw status(500, "Failed to create extension user");
            }
            return { userId: row.id };
        } catch (error) {
            throw status(500, `Error while bootstrapping extension user: ${error}`);
        }
    }

    /** Upsert `public.users` with `id` = Supabase `auth.users.id` (option 1). */
    static async syncFromSupabaseUser(params: {
        id: string;
        email: string;
        name?: string | null;
    }) {
        try {
            const placeholderPassword = await Bun.password.hash(randomUUID());
            const name = params.name?.trim() || "MailPilot user";
            await db
                .insert(UserTable)
                .values({
                    id: params.id,
                    email: params.email,
                    name,
                    password: placeholderPassword,
                })
                .onConflictDoUpdate({
                    target: UserTable.id,
                    set: {
                        email: params.email,
                        name,
                        updatedAt: new Date(),
                    },
                });
            return { userId: params.id };
        } catch (error) {
            throw status(500, `Error while syncing user from Supabase: ${error}`);
        }
    }

    static async createLinkCode(ownerUserId: string): Promise<{ code: string; expiresAt: string }> {
        const raw = randomBytes(18).toString("hex");
        const codeHash = createHash("sha256").update(raw).digest("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await db.insert(LinkCodeTable).values({
            codeHash,
            userId: ownerUserId,
            expiresAt,
        });
        return { code: raw, expiresAt: expiresAt.toISOString() };
    }

    static async linkExtensionUser(params: { code: string; extensionUserId: string }) {
        const { code, extensionUserId } = params;
        const codeHash = createHash("sha256").update(code.trim()).digest("hex");

        const linkRows = await db
            .select()
            .from(LinkCodeTable)
            .where(
                and(
                    eq(LinkCodeTable.codeHash, codeHash),
                    isNull(LinkCodeTable.consumedAt),
                    gt(LinkCodeTable.expiresAt, new Date())
                )
            )
            .limit(1);
        const link = linkRows[0];
        if (!link) {
            throw status(404, "Invalid or expired link code");
        }
        const ownerId = link.userId;
        if (ownerId === extensionUserId) {
            throw status(400, "Extension is already this account");
        }

        const extUsers = await db
            .select({ id: UserTable.id })
            .from(UserTable)
            .where(eq(UserTable.id, extensionUserId))
            .limit(1);
        if (!extUsers[0]) {
            throw status(404, "Extension user not found");
        }

        await db.transaction(async (tx) => {
            await tx.delete(UserGmailTokensTable).where(eq(UserGmailTokensTable.userId, ownerId));
            await tx
                .update(UserGmailTokensTable)
                .set({ userId: ownerId, updatedAt: new Date() })
                .where(eq(UserGmailTokensTable.userId, extensionUserId));
            await tx
                .update(ConversationTable)
                .set({ userId: ownerId, updatedAt: new Date() })
                .where(eq(ConversationTable.userId, extensionUserId));

            await tx.delete(UserTable).where(eq(UserTable.id, extensionUserId));

            await tx
                .update(LinkCodeTable)
                .set({
                    consumedAt: new Date(),
                    consumedFromExtensionUserId: extensionUserId,
                })
                .where(eq(LinkCodeTable.id, link.id));
        });

        return { userId: ownerId };
    }

    static async getUserById(userId: string) {
        try {
            const user = await db.select().from(UserTable).where(eq(UserTable.id, userId));
            if (!user.length) {
                throw status(404, "User not found");
            }
            return user;
        } catch (error) {
            throw status(500, `Error while getting user by id: ${error}`);
        }
    }

    static async getConversationsByUserId(userId: string) {
        try {
            const conversations = await db
                .select()
                .from(ConversationTable)
                .leftJoin(MessageTable, eq(ConversationTable.id, MessageTable.conversationId))
                .where(eq(ConversationTable.userId, userId));
            return conversations;
        } catch (error) {
            throw status(500, `Error while getting conversations by user id: ${error}`);
        }
    }
    static async getMessagesByConversationId(conversationId: string) {
        try {
            const messages = await db
                .select()
                .from(MessageTable)
                .where(eq(MessageTable.conversationId, conversationId));
            return messages;
        } catch (error) {
            throw status(500, `Error while getting messages by conversation id: ${error}`);
        }
    }

}
