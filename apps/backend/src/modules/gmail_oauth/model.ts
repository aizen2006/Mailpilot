import { t, type UnwrapSchema } from "elysia";

export const GmailOAuthModel = {
    QueryUserId: t.Object({
        userId: t.String({ format: "uuid" }),
        extensionRedirectUri: t.Optional(t.String()),
    }),
    BodyUserId: t.Object({
        userId: t.String({ format: "uuid" }),
    }),
    QueryOAuthCallback: t.Object(
        {
            code: t.Optional(t.String()),
            state: t.Optional(t.String()),
            error: t.Optional(t.String()),
            error_description: t.Optional(t.String()),
        },
        { additionalProperties: true }
    ),
} as const;

export type GmailOAuthModel = {
    [k in keyof typeof GmailOAuthModel]: UnwrapSchema<(typeof GmailOAuthModel)[k]>;
};
