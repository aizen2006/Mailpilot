import { UserService } from './service';
import { UserModel } from './model';
import { Elysia , status } from 'elysia';


const app = new Elysia({prefix:'/user'})
    .get('/health',()=>console.log("User Route is Working"))
    .post('/bootstrap-extension', async () => {
        return UserService.bootstrapExtensionUser();
    })
    .get('/byId',async({body})=>{
        const { userId } = body;
        const {data,error} = await UserService.getUserById(userId);
        if(error){
            return status(error.status,error.message)
        }
        return status(200,'User found successfully',data);
    },{body:UserModel.getUserById})
    .get('/conversations',async({body})=>{
        const { userId } = body;
        const {data,error} = await UserService.getConversationsByUserId(userId);
        if(error){
            return status(error.status,error.message)
        }
        return status(200,'Conversations found successfully',data);
    },{body:UserModel.getConversationsByUserId})
    .get('/messages',async({body})=>{
        const { conversationId } = body;
        const {data,error} = await UserService.getMessagesByConversationId(conversationId);
        if(error){
            return status(error.status,error.message)
        }
        return status(200,'Messages found successfully',data);
    },{body:UserModel.getMessagesByConversationId});


export { app };