import { t, type UnwrapSchema } from 'elysia';

export const GmailOAuthModel = {
    BodyOAuthUrl:t.Object({
        userId:t.String(),
    }),
    OAuthToken: t.Object({
        code: t.String(),
        state: t.String(),
    })
} as const;

export type GmailOAuthModel = {
    [k in keyof typeof GmailOAuthModel]: UnwrapSchema<typeof GmailOAuthModel[k]>
}