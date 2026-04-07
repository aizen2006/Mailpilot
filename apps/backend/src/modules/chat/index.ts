import { Buffer } from "buffer";
import { Elysia } from "elysia";
import { chatSchemas } from "./model";
import { ChatService } from "./service";

const app = new Elysia({ prefix: "/chat" })
    .get("/health", () => console.log("Chat Route is Working"))
    .post(
        "/text",
        async ({ body }) => {
            const { userId, message, conversationId } = body;
            return ChatService.chat_text(userId, message, conversationId ?? null);
        },
        {
            body: chatSchemas.chat_text,
        },
    )
    .post(
        "/audio",
        async ({ body }) => {
            const { userId, audio } = body;
            const buf = Buffer.from(await audio.arrayBuffer());
            return ChatService.chat_audio(userId, buf);
        },
        {
            body: chatSchemas.chat_audio,
        },
    );

export { app };
