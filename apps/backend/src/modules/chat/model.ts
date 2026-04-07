import { t, type UnwrapSchema } from "elysia";

export const chatSchemas = {
    chat_text: t.Object({
        userId: t.String(),
        message: t.String(),
        conversationId: t.Optional(t.String()),
    }),
    chat_audio: t.Object({
        userId: t.String(),
        audio: t.File(),
        conversationId: t.Optional(t.String()),
    }),
    chat_response: t.Object({
        userId: t.String(),
        message: t.String(),
    }),
    chat_error: t.Object({
        userId: t.String(),
        message: t.String(),
    }),
} as const;

export type ChatBodies = {
    [k in keyof typeof chatSchemas]: UnwrapSchema<(typeof chatSchemas)[k]>;
};