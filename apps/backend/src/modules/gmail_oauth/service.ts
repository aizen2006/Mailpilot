import db from "db";
import { corsair } from "db/corsair/client";
import { UserGmailTokensTable } from "db/schema/schema";
import { eq } from "drizzle-orm";
import { status } from "elysia";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export abstract class GmailOAuthService {
    static buildGoogleAuthUrl(userId: string): string {
        try {
            return oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: [
                    "https://www.googleapis.com/auth/gmail.send",
                    "https://www.googleapis.com/auth/gmail.readonly",
                ],
                prompt: "consent",
                state: userId,
            });
        } catch (error) {
            throw status(500, `Error while building Google OAuth URL: ${error}`);
        }
    }

    static async exchangeAndSaveTokens(code: string, userId: string) {
        try {
            const { tokens } = await oauth2Client.getToken(code);
            if (!tokens?.access_token) {
                throw status(400, "No tokens found with this code");
            }
            if (!tokens.refresh_token) {
                throw status(
                    400,
                    "No refresh token; revoke app access and sign in again with prompt=consent"
                );
            }
            const integrationKeys = corsair.keys.gmail as unknown as {
                set_client_id: (value: string | null) => Promise<void>;
                set_client_secret: (value: string | null) => Promise<void>;
            };
            await integrationKeys.set_client_id(process.env.GOOGLE_CLIENT_ID ?? null);
            await integrationKeys.set_client_secret(process.env.GOOGLE_CLIENT_SECRET ?? null);
            const tenant = corsair.withTenant(userId);
            const accountKeys = tenant.gmail.keys as unknown as {
                set_access_token: (value: string | null) => Promise<void>;
                set_refresh_token: (value: string | null) => Promise<void>;
            };
            await accountKeys.set_access_token(tokens.access_token);
            await accountKeys.set_refresh_token(tokens.refresh_token);
        } catch (error) {
            throw status(500, `Error while exchanging Google OAuth code: ${error}`);
        }
    }

    // static async getGmailStatus(userId: string): Promise<{ connected: boolean; email?: string }> {
    //     const rows = await db
    //         .select()
    //         .from(UserGmailTokensTable)
    //         .where(eq(UserGmailTokensTable.userId, userId))
    //         .limit(1);
    //     if (!rows.length) {
    //         return { connected: false };
    //     }
    //     const row = rows[0];
    //     try {
    //         const client = new google.auth.OAuth2(
    //             process.env.GOOGLE_CLIENT_ID,
    //             process.env.GOOGLE_CLIENT_SECRET,
    //             process.env.GOOGLE_REDIRECT_URI
    //         );
    //         client.setCredentials({
    //             access_token: row.accessToken,
    //             refresh_token: row.refreshToken,
    //         });
    //         const gmail = google.gmail({ version: "v1", auth: client });
    //         const profile = await gmail.users.getProfile({ userId: "me" });
    //         return { connected: true, email: profile.data.emailAddress ?? undefined };
    //     } catch {
    //         return { connected: true };
    //     }
    // }
}
