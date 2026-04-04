/*
Users Service
translate audio to english text ( using sarvam ai api ) -- Done
CRUD operations on the conversations 
the services will be connect the Gmail API or MCP which is better  ??? 
user persona ( needed later will , do it via a vector DB ) // Quadrant
Voice agent ( needed later ,  ) // try to create it using Sarvam  
*/
import { randomUUID } from "node:crypto";
import { status } from "elysia";
import db from "db";
import { UserTable, ConversationTable, MessageTable } from 'db/schema/schema';
import { eq } from 'drizzle-orm';


export abstract class UserService {
    /** Creates a local DB user for the extension (OAuth tokens reference `users.id`). */
    static async bootstrapExtensionUser() {
        try {
            const password = await Bun.password.hash(randomUUID());
            const email = `ext-${randomUUID()}@users.mailpilot.local`;
            const [row] = await db
                .insert(UserTable)
                .values({
                    name: "MailPilot Extension",
                    email,
                    password,
                })
                .returning({ id: UserTable.id });
            if (!row) {
                throw status(500, "Failed to create extension user");
            }
            return { userId: row.id };
        } catch (error) {
            throw status(500, `Error while bootstrapping extension user: ${error}`);
        }
    }

    static async getUserById(userId:string){
        try {
            const user = await db.select()
                                .from(UserTable)
                                .where(eq(UserTable.id,userId));
            if(!user){
                throw status(404,'User not found')
            }
            return user;
        } catch (error) {
            throw status(500,`Error while getting user by id: ${error}`);
        }
    }

    static async getConversationsByUserId(userId:string){
        try {
            const conversations = await db.select()
                                        .from(ConversationTable)
                                        .leftJoin(MessageTable,eq(ConversationTable.id,MessageTable.conversationId))
                                        .where(eq(ConversationTable.userId,userId));
            if(conversations){
                return conversations;
            }else{
                throw status(404,'Conversations not found')
            }
        } catch (error) {
            throw status(500,`Error while getting conversations by user id: ${error}`);
        }
    }
    static async getMessagesByConversationId(conversationId:string){
        try {
            const messages = await db.select()
                                    .from(MessageTable)
                                    .where(eq(MessageTable.conversationId,conversationId));
            if(messages){
                return messages;
            }else{
                throw status(404,'Messages not found')
            }
        } catch (error) {
            throw status(500,`Error while getting messages by conversation id: ${error}`);
        }
    }

}
