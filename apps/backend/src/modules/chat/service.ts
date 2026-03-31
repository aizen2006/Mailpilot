import { status } from 'elysia';
import { sarvam } from '../../libs/sarvam';
import { Buffer } from 'buffer';
import db from 'db';
import { ConversationTable, MessageTable } from 'db/schema/schema';
import audioTranslate from '../../libs/audioTranslate';
import { eq } from 'drizzle-orm';

export abstract class ChatService {

    static async chat_text(conversationId:string || null , userId:string , message:string){
        try {
            if(!conversationId){
                const conversation = await db.insert(ConversationTable).values({
                    userId:userId,
                    title:"New Conversation",
                }).returning({id:ConversationTable.id});
                if(!conversation){
                    throw status(400,'Error while creating conversation')
                }
                conversationId = conversation[0].id;
            }
            const message = await db.insert(MessageTable).values({
                conversationId:conversationId,
                content:message,
                role:"user"
            }).returning({id:MessageTable.id});
            if(!message){
                throw status(400,'Error while creating message')
            }
            const response = await sarvam.chat.completions({
                model:"sarvam-30b"
                messages:[{role:"user",content:message}],
                temperature:0.5,
                top_p:0.5,
                reasoning_effort:"medium"
            })
            const assistant_response = await db.insert(MessageTable).values({
                conversationId:conversationId,
                content:response.choices[0].message.content,
                role:"assistant"
            }).returning({id:MessageTable.id});
            if(!assistant_response){
                throw status(400,'Error while creating assistant response')
            }
            return status(200,'Conversation created successfully',{
                conversationId:conversationId,
                Response : response
            })
        } catch (error) {
            throw status(500,'Error while chatting with the assistant',error as Error)
        }
    }
    static async chat_audio(userId:string,conversationId:string || null , audio:Buffer){
        try {
            const text = await audioTranslate(audio);
            if(!conversationId){
                const conversation = await db.insert(ConversationTable).values({
                    userId:userId,
                    title:"New Conversation",
                }).returning({id:ConversationTable.id});
                if(!conversation){
                    throw status(400,'Error while creating conversation')
                }
                conversationId = conversation[0].id;
            }
            const message = await db.insert(MessageTable).values({
                conversationId:conversationId,
                content:text,
                role:"user"
            }).returning({id:MessageTable.id});
            if(!message){
                throw status(400,'Error while creating message')
            }
            const response = await sarvam.chat.completions({
                model:"sarvam-30b"
                messages:[{role:"user",content:text}],
                temperature:0.5,
                top_p:0.5,
                reasoning_effort:"medium"
            })
            const assistant_response = await db.insert(MessageTable).values({
                conversationId:conversationId,
                content:response.choices[0].message.content,
                role:"assistant"
            }).returning({id:MessageTable.id});
            if(!assistant_response){
                throw status(400,'Error while creating assistant response')
            }
            return status(200,'Conversation created successfully',{
                conversationId:conversationId,
                Response : response
            })
        } catch (error) {
            throw status(500,'Error while chatting with the assistant',error as Error)
        }
    }
}