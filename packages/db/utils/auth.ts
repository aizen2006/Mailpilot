import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../index";
import { authSchema } from "../schema/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema
  }),
  emailAndPassword: { 
    enabled: true, 
  } 
});
