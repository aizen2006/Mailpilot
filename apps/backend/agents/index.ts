import { Agent , tool, webSearchTool , run } from '@openai/agents';
import { eq, type InferSelectModel } from "drizzle-orm";
import { UserTable , MessageTable } from "db/schema/schema";
import { status } from "elysia";
import db from "db";

// corsair intiatiation
import { corsair } from 'db/corsair/client';
import { OpenAIAgentsProvider } from '@corsair-dev/mcp';

type HttpError = ReturnType<typeof status>;

function clientError(message: string): HttpError {
    return status(400, message) as HttpError;
}

type DbResult<T> = { ok: true; data: T } | { ok: false; response: HttpError };

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

export default async function emailAgent(userId: string, conversationId: string , userMessage: string) {
    const provider = new OpenAIAgentsProvider();
    const corsairForUser = corsair.withTenant(userId);
    const builtTools = await provider.build({ corsair: corsairForUser, tool: tool as never });
    const maybeToolsObject = builtTools as { tools?: unknown };
    const corsairTools = Array.isArray(builtTools)
        ? builtTools
        : Array.isArray(maybeToolsObject?.tools)
            ? maybeToolsObject.tools
            : [];

    const userResult = await getUserById(userId);
    if (!userResult.ok) throw userResult.response;

    const conversationsResult = await getConversationsById(conversationId);
    if (!conversationsResult.ok) throw conversationsResult.response;

    const user = userResult.data;
    const conversations = conversationsResult.data;

    const contextForModel = JSON.stringify({
        user,
        conversations,
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
            ...corsairTools,
        ] as ConstructorParameters<typeof Agent>[0]["tools"],
    });

    const result = await run(agent, userMessage);
    if (!result.finalOutput) {
        throw status(502, "Empty model response");
    }
    return result.finalOutput;
}
