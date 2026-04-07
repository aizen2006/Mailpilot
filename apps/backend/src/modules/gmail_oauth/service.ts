import { corsair } from "db/corsair/client";
import { status } from "elysia";
import { google } from "googleapis";
import { Buffer } from "buffer";

function createOAuthClient() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
}

type OAuthState = {
    userId: string;
    extensionRedirectUri?: string;
};

export abstract class GmailOAuthService {
    static encodeState(state: OAuthState): string {
        return Buffer.from(JSON.stringify(state), "utf-8").toString("base64url");
    }

    static decodeState(raw: string): OAuthState {
        try {
            const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf-8")) as OAuthState;
            if (parsed?.userId) {
                return parsed;
            }
        } catch {
            // legacy state support below
        }
        return { userId: raw };
    }

    static buildGoogleAuthUrl(userId: string, extensionRedirectUri?: string): string {
        try {
            const oauth2Client = createOAuthClient();
            return oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: [
                    "https://www.googleapis.com/auth/gmail.send",
                    "https://www.googleapis.com/auth/gmail.readonly",
                ],
                prompt: "consent",
                state: GmailOAuthService.encodeState({ userId, extensionRedirectUri }),
            });
        } catch (error) {
            throw status(500, `Error while building Google OAuth URL: ${error}`);
        }
    }

    static async exchangeAndSaveTokens(code: string, userId: string) {
        try {
            const oauth2Client = createOAuthClient();
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

    static async getGmailStatus(userId: string): Promise<{ connected: boolean; email?: string }> {
        try {
            const tenant = corsair.withTenant(userId);
            const accountKeys = tenant.gmail.keys as unknown as {
                get_access_token: () => Promise<string | null>;
                get_refresh_token: () => Promise<string | null>;
            };
            const accessToken = await accountKeys.get_access_token();
            if (!accessToken) {
                return { connected: false };
            }
            const refreshToken = await accountKeys.get_refresh_token();
            try {
                const client = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET,
                    process.env.GOOGLE_REDIRECT_URI
                );
                client.setCredentials({
                    access_token: accessToken,
                    refresh_token: refreshToken ?? undefined,
                });
                const gmail = google.gmail({ version: "v1", auth: client });
                const profile = await gmail.users.getProfile({ userId: "me" });
                return { connected: true, email: profile.data.emailAddress ?? undefined };
            } catch {
                return { connected: true };
            }
        } catch {
            return { connected: false };
        }
    }

    static async disconnectGmail(userId: string): Promise<void> {
        try {
            const tenant = corsair.withTenant(userId);
            const accountKeys = tenant.gmail.keys as unknown as {
                set_access_token: (value: string | null) => Promise<void>;
                set_refresh_token: (value: string | null) => Promise<void>;
            };
            await accountKeys.set_access_token(null);
            await accountKeys.set_refresh_token(null);
        } catch (error) {
            throw status(500, `Error while disconnecting Gmail: ${error}`);
        }
    }
}
