import db from "db";
import { UserGmailTokensTable } from "db/schema/schema";
import { eq } from "drizzle-orm";
import { status } from "elysia";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

/** Maps Google OAuth credentials to remaining lifetime in seconds (DB `expires_in`). */
function accessTokenExpiresInSeconds(tokens: { expiry_date?: number | null }): number {
    if (tokens.expiry_date != null) {
        return Math.max(0, Math.floor((tokens.expiry_date - Date.now()) / 1000));
    }
    return 3600;
}

export abstract class GmailOAuthService {
    /** Browser redirect URL to Google consent (state carries `userId`). */
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
            await db.transaction(async (tx) => {
                await tx.delete(UserGmailTokensTable).where(eq(UserGmailTokensTable.userId, userId));
                await tx.insert(UserGmailTokensTable).values({
                    userId,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expiresIn: accessTokenExpiresInSeconds(tokens),
                });
            });
        } catch (error) {
            throw status(500, `Error while exchanging Google OAuth code: ${error}`);
        }
    }

    static async getGmailStatus(userId: string): Promise<{ connected: boolean; email?: string }> {
        const rows = await db
            .select()
            .from(UserGmailTokensTable)
            .where(eq(UserGmailTokensTable.userId, userId))
            .limit(1);
        if (!rows.length) {
            return { connected: false };
        }
        const row = rows[0];
        try {
            const client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI
            );
            client.setCredentials({
                access_token: row.accessToken,
                refresh_token: row.refreshToken,
            });
            const gmail = google.gmail({ version: "v1", auth: client });
            const profile = await gmail.users.getProfile({ userId: "me" });
            return { connected: true, email: profile.data.emailAddress ?? undefined };
        } catch {
            return { connected: true };
        }
    }
}
