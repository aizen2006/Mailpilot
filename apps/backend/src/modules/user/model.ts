import { t, type UnwrapSchema } from 'elysia';

const UserModel = {
    getUserById: t.Object({
        userId: t.String(),
    }),
    getConversationsByUserId: t.Object({
        userId: t.String(),
    }),
    getMessagesByConversationId: t.Object({
        conversationId: t.String(),
    }),
    linkExtensionBody: t.Object({
        code: t.String({ minLength: 8 }),
        extensionUserId: t.String({ format: "uuid" }),
    }),
} as const;

export { UserModel };

export type UserModel = {
    [k in keyof typeof UserModel]: UnwrapSchema<typeof UserModel[k]>
}