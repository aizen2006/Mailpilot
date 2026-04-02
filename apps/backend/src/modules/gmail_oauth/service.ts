import db from "db";
import { UserGmailTokensTable } from "db/schema/schema";
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
    static async getGoogleOAuthUrl(userId: string) {
        try {
            const url = await oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: [
                    "https://www.googleapis.com/auth/gmail.send",
                    "https://www.googleapis.com/auth/gmail.readonly",
                ],
                prompt: "consent",
                state: userId,
            });
            return Response.redirect(url);
        } catch (error) {
            throw status(500, `Error while getting Google OAuth URL : ${error}`);
        }
    }

    static async getGoogleOAuthToken(code: string, userId: string) {
        try {
            const { tokens } = await oauth2Client.getToken(code);
            if (!tokens?.access_token) {
                throw status(400, "No tokens found with this code");
            }
            if (!tokens.refresh_token) {
                throw status(400, "No refresh token; revoke app access and sign in again with prompt=consent");
            }
            const response = await db.insert(UserGmailTokensTable).values({
                userId,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresIn: accessTokenExpiresInSeconds(tokens),
            });
            if (!response) {
                throw status(500, `Error while saving Google OAuth Token`);
            }
            return status(200, "Google OAuth Token saved successfully");
        } catch (error) {
            throw status(500, `Error while getting Google OAuth Token : ${error}`);
        }
    }
}
