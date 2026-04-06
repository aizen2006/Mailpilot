import { Agent , tool, webSearchTool , run } from '@openai/agents';
import { eq, type InferSelectModel } from "drizzle-orm";
import { UserTable , MessageTable, UserGmailTokensTable } from "db/schema/schema";
import { status } from "elysia";
import db from "db";

// corsair intiatiation
import { corsair } from 'db/corsair/client';
import { OpenAIAgentsProvider } from '@corsair-dev/mcp';

export type Tokens = InferSelectModel<typeof UserGmailTokensTable>;

type HttpError = ReturnType<typeof status>;

function clientError(message: string): HttpError {
    return status(400, message) as HttpError;
}

type DbResult<T> = { ok: true; data: T } | { ok: false; response: HttpError };

function redactTokenRows(rows: Tokens[]): Omit<Tokens, "accessToken" | "refreshToken">[] {
    return rows.map(({ accessToken: _a, refreshToken: _r, ...rest }) => rest);
}

/* 
 * Get the user by id
 * @param userId - The id of the user
 * @returns The user details
 */

async function getUserById(userId: string): Promise<DbResult<InferSelectModel<typeof UserTable>[]>> {
    try {
        const rows = await db.select().from(UserTable).where(eq(UserTable.id, userId));
        if (rows.length === 0) return { ok: false, response: clientError("No user Found with this UserId") };
        return { ok: true, data: rows };
    } catch {
        return { ok: false, response: clientError("Unable to Get the user details") };
    }
}

/* 
 * Get the conversations for the user
 * @param conversationsId - The id of the conversations
 * @returns The conversations for the user
 */

async function getConversationsById(
    conversationId: string,
): Promise<DbResult<InferSelectModel<typeof MessageTable>[]>> {
    try {
        const rows = await db
            .select()
            .from(MessageTable)
            .where(eq(MessageTable.conversationId, conversationId));
        if (rows.length === 0)
            return { ok: false, response: clientError("No conversations found with this conversation Id") };
        return { ok: true, data: rows };
    } catch {
        return { ok: false, response: clientError("Unable to get the user's conversations") };
    }
}

/* 
 * Get the tokens for the user
 * @param userId - The id of the user
 * @returns The tokens for the user
 */
async function getTokensById(userId: string): Promise<DbResult<Tokens[]>> {
    try {
        const rows = await db
            .select()
            .from(UserGmailTokensTable)
            .where(eq(UserGmailTokensTable.userId, userId));
        if (rows.length === 0) return { ok: false, response: clientError("No tokens found with this user Id") };
        return { ok: true, data: rows };
    } catch {
        return { ok: false, response: clientError("Unable to get the user's tokens") };
    }
}


export default async function emailAgent(userId: string, conversationId: string , userMessage: string) {
    const provider = new OpenAIAgentsProvider();
    const corsairForUser = corsair.withTenant(userId);
    const corsair_tools = provider.build({ corsair: corsairForUser, tool: tool as never }) as Awaited<
        ReturnType<OpenAIAgentsProvider["build"]>
    >;

    const userResult = await getUserById(userId);
    if (!userResult.ok) return userResult.response;

    const conversationsResult = await getConversationsById(conversationId);
    if (!conversationsResult.ok) return conversationsResult.response;

    const tokensResult = await getTokensById(userId);
    if (!tokensResult.ok) return tokensResult.response;

    const user = userResult.data;
    const conversations = conversationsResult.data;
    const tokens = tokensResult.data;

    const contextForModel = JSON.stringify({
        user,
        conversations,
        tokens: redactTokenRows(tokens),
    });

    const agent = new Agent({
        name: "Email Assistant",
        instructions: `You are an expert AI assistant that helps the user write high-quality emails. Use this context (JSON; access tokens are not included): ${contextForModel}.
        Your responsibilities are:
        - Gather all necessary information for composing each email, such as context, content, tone, recipients, and other relevant details by asking the user questions as needed.
        - Draft clear and effective emails based on user input and context.
        - Use the provided tools (such as readEmail, sendEmail, createDraft, getThread, listThreads, sendEmailWithAttachments) to interact with the user's Gmail account for reading, writing, and sending emails.
        - Never display or share the user's access tokens or refresh tokens with the user or in your messages; use them only via the provided tools as required.
        - Before sending or reading sensitive emails, always verify with the user and confirm their intent.
        Focus on providing helpful, privacy-minded interactions using the available tools.`,

        modelSettings: { temperature: 0.7, toolChoice: 'auto' },

        model: "gpt-5.4-nano",

        tools: [
            webSearchTool({ searchContextSize: "medium" }),
            ...corsair_tools,
        ] as ConstructorParameters<typeof Agent>[0]["tools"],
    });

    const result = await run(agent, userMessage);
    if (!result.finalOutput) {
        throw status(502, "Empty model response");
    }
    return result.finalOutput;
}
