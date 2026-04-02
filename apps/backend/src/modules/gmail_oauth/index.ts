import { Elysia } from "elysia";
import { GmailOAuthService } from "./service";
import { GmailOAuthModel } from "./model";
import { status } from "elysia";

const app = new Elysia({prefix:'/oauth'})
    .get('/health',()=>status(200,'Gmail OAuth Route is Working'))
    .get('/google',async({body})=>{
        const url = await GmailOAuthService.getGoogleOAuthUrl(body.userId) || null;
        if(!url){
            return status(500,'Error while getting Google OAuth URL')
        }
        return status(200,'Google OAuth URL generated successfully');
    },{
        body:GmailOAuthModel.BodyOAuthUrl,
    })
    .post('/google/callback',async({query})=>{
        const { code, state } = query as {
            code: string;
            state: string;
        };
        await GmailOAuthService.getGoogleOAuthToken(code, state);

        return status(200,'Google OAuth Token saved successfully');
    },{
        query:GmailOAuthModel.OAuthToken,
    })


export { app };