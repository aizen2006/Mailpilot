import { ElysiaCustomStatusResponse, status } from "elysia";
import type { Buffer } from "buffer";
import db from "db";
import { ConversationTable, MessageTable } from "db/schema/schema";
import audioTranslate from "../../libs/audioTranslate";
import emailAgent from "../../../agents";

export abstract class ChatService {
    static async chat_text(
        userId: string,
        userMessage: string,
        conversationId: string | null = null,
    ) {
        try {
            let activeConversationId = conversationId;
            if (!activeConversationId) {
                const [row] = await db
                    .insert(ConversationTable)
                    .values({
                        userId,
                        title: "New Conversation",
                    })
                    .returning({ id: ConversationTable.id });
                if (!row?.id) {
                    throw status(400, "Error while creating conversation");
                }
                activeConversationId = row.id;
            }
            const insertedUserMessage = await db
                .insert(MessageTable)
                .values({
                    conversationId: activeConversationId,
                    content: userMessage,
                    role: "user",
                })
                .returning({ id: MessageTable.id });
            if (!insertedUserMessage?.length) {
                throw status(400, "Error while creating message");
            }
            // Agent Logic 
            const content = await emailAgent(userId, activeConversationId, userMessage);
            if (typeof content !== "string" || content.trim().length === 0) {
                throw status(502, "Invalid model response");
            }
            const assistantRows = await db
                .insert(MessageTable)
                .values({
                    conversationId: activeConversationId,
                    content,
                    role: "assistant",
                })
                .returning({ id: MessageTable.id });
            if (!assistantRows?.length) {
                throw status(400, "Error while creating assistant response");
            }
            return status(200, {
                message: "Conversation created successfully",
                conversationId: activeConversationId,
                Response: content,
            });
        } catch (error) {
            if (error instanceof ElysiaCustomStatusResponse) throw error;
            throw status(
                500,
                error instanceof Error ? error.message : "Error while chatting with the assistant",
            );
        }
    }

    static async chat_audio(
        userId: string,
        audio: Buffer,
        conversationId: string | null = null,
    ) {
        try {
            const text = await audioTranslate(audio);
            if (typeof text !== "string" || text.trim().length === 0) {
                throw status(502, "Failed to translate audio");
            }
            let activeConversationId = conversationId;
            if (!activeConversationId) {
                const [row] = await db
                    .insert(ConversationTable)
                    .values({
                        userId,
                        title: "New Conversation",
                    })
                    .returning({ id: ConversationTable.id });
                if (!row?.id) {
                    throw status(400, "Error while creating conversation");
                }
                activeConversationId = row.id;
            }
            const insertedUserMessage = await db
                .insert(MessageTable)
                .values({
                    conversationId: activeConversationId,
                    content: text,
                    role: "user",
                })
                .returning({ id: MessageTable.id });
            if (!insertedUserMessage?.length) {
                throw status(400, "Error while creating message");
            }
            // agent logic 
            const content = await emailAgent(userId, activeConversationId, text);
            if (typeof content !== "string" || content.trim().length === 0) {
                throw status(502, "Invalid model response");
            }
            const assistantRows = await db
                .insert(MessageTable)
                .values({
                    conversationId: activeConversationId,
                    content,
                    role: "assistant",
                })
                .returning({ id: MessageTable.id });
            if (!assistantRows?.length) {
                throw status(400, "Error while creating assistant response");
            }
            return status(200, {
                message: "Conversation created successfully",
                conversationId: activeConversationId,
                Response: content,
            });
        } catch (error) {
            if (error instanceof ElysiaCustomStatusResponse) throw error;
            throw status(
                500,
                error instanceof Error ? error.message : "Error while chatting with the assistant",
            );
        }
    }
}
