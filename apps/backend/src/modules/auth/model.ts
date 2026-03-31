import { t, type UnwrapSchema } from 'elysia';

const Auth ={
    signUpBody:t.Object({
        email:t.String(),
        password:t.String(),
    }),
    signInBody:t.Object({
        email:t.String(),
        password:t.String(),
    }),
    signOut:t.Object({
        message:t.Literal('User SignOut successfully'),
    }),
} as const 

export type Auth = {
    [k in keyof typeof Auth]: UnwrapSchema<typeof Auth[k]>
}