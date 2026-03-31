import { ChatModel } from './model';
import { ChatService } from './service';
import { Elysia ,status } from 'elysia';



const app = new Elysia({prefix:'/chat'})
    .get('/health',()=>console.log("Chat Route is Working"))
    .post('/text',async({body})=>{
        const { userId , message } = body;
        const {data,error} = await ChatService.chat_text(userId,message);
        if(error){
            return status(error.status,error.message)
        }
        return status(200,'Conversation created successfully',data);
    },{
        body:ChatModel.chat_text,
    })
    .post('/audio',async({body})=>{
        const { userId , audio } = body;
        const {data,error} = await ChatService.chat_audio(userId,audio);
        if(error){
            return status(error.status,error.message)
        }
        return status(200,'Conversation created successfully',data);
    },{
        body:ChatModel.chat_audio
    });

export { app };