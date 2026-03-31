import { t, type UnwrapSchema } from 'elysia';

const ChatModel = {
    chat_text:t.Object({
        userId:t.String(),
        message:t.String(),
    }),
    chat_audio:t.Object({
        userId:t.String(),
        audio:t.File(),
    }),
    chat_response:t.Object({
        userId:t.String(),
        message:t.String(),
    }),
    chat_error:t.Object({
        userId:t.String(),
        message:t.String(),
    })
} as const 

export type ChatModel = {
    [k in keyof typeof ChatModel]: UnwrapSchema<typeof ChatModel[k]>
}