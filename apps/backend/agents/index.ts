import { Agent , webSearchTool } from '@openai/agents';
import { eq } from "drizzle-orm";
import { UserTable , MessageTable, UserGmailTokensTable } from "db/schema/schema";
import { status } from "elysia";
import { timestamp } from "drizzle-orm/pg-core";
import db from "db";
import { readEmail , sendEmail , createDraft , getThread , listThreads , sendEmailWithAttachments } from "./tools/gmailTools";



export interface Tokens {
    id : string,
    accessToken: string,
    refreshToken:string,
    createdAt: typeof timestamp,
    updatedAt: typeof timestamp 
}

/* 
 * Get the user by id
 * @param userId - The id of the user
 * @returns The user details
 */

async function getUserById(userId: string) {
    try {
        const user = await db.select().from(UserTable).where(eq(UserTable.id, userId));
        if (!user) return status(400, "No user Found with this UserId");
        return user;
    } catch (error) {
        return status(400, "Unable to Get the user details");
    }
}

/* 
 * Get the conversations for the user
 * @param conversationsId - The id of the conversations
 * @returns The conversations for the user
 */

async function getConversationsById(conversationsId: string) {
    try {
        const conversations = await db.select().from(MessageTable).where(eq(MessageTable.conversationId, conversationsId));
        if (!conversations) return status(400, "No conversations found with this conversation Id");
        return conversations;
    } catch (error) {
        return status(400, "Unable to get the user's conversations");
    }
}

/* 
 * Get the tokens for the user
 * @param userId - The id of the user
 * @returns The tokens for the user
 */
async function getTokensById(userId: string) {
    try {
        const tokens = await db.select().from(UserGmailTokensTable).where(eq(UserGmailTokensTable.userId, userId));
        if(!tokens) return status(400,"No tokens found with this user Id");
        return tokens;
    } catch (error) {
        return status(400, "Unable to get the user's tokens");
    }
}


export default async function emailAgent( userId : string , converstionsId : string) {
    
    // get User detailes
    const user = await getUserById(userId);
    if(!user) return status(400,"No user found with this user Id");
    
    // get the Users converstions for Context
    const conversations = await getConversationsById(converstionsId);
    if(!conversations) return status(400,"No conversations found with this conversation Id");
    
    // get the Users tokens
    const tokens = await getTokensById(userId);
    if(!tokens) return status(400,"No tokens found with this user Id");

    // Defining Agent Logic For the Email Agent 
    const agent = new Agent({
        name:'Email Assiatant',
        instructions: `You are an expert AI assistant that helps the user write high-quality emails, using the following user details: ${user}, previous conversations: ${conversations}, and credential tokens: ${tokens}.
        Your responsibilities are:
        - Gather all necessary information for composing each email, such as context, content, tone, recipients, and other relevant details by asking the user questions as needed.
        - Draft clear and effective emails based on user input and context.
        - Use the provided tools (such as readEmail, sendEmail, createDraft, getThread, listThreads, sendEmailWithAttachments) to interact with the user's Gmail account for reading, writing, and sending emails.
        - Never display or share the user's access tokens or refresh tokens with the user or in your messages; use them only via the provided tools as required.
        - Before sending or reading sensitive emails, always verify with the user and confirm their intent.
        Focus on providing helpful, privacy-minded interactions using the available tools.`,

        modelSettings: { temperature: 0.7, toolChoice: 'auto' },

        model:'gpt-5.4-nano',
        
        tools:[
            webSearchTool({ searchContextSize: 'medium' }),
            readEmail,
            sendEmail,
            createDraft,
            getThread,
            listThreads,
            sendEmailWithAttachments,
        ],
    })
} 