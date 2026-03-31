import { t, type UnwrapSchema } from 'elysia';

const UserModel = {
    getUserById:t.Object({
        userId:t.String(),
    }),
    getConversationsByUserId:t.Object({
        userId:t.String(),
    }),
    getMessagesByConversationId:t.Object({
        conversationId:t.String(),
    }),
} as const 

export type UserModel = {
    [k in keyof typeof UserModel]: UnwrapSchema<typeof UserModel[k]>
}