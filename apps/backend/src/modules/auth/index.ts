import { Elysia } from 'elysia';
import { Auth } from './model';
import { Auth as AuthService } from './service';


const app = new Elysia({prefix:'/auth'})
    .get('/health',()=>console.log("Auth Route is Working"))
    .post('/signUp', async({body})=>{
        const {data,status} = await AuthService.signUpNewUser(body.email,body.password)
        if(error){
            return status(error.status,error.message)
        }
        return status(200,'User SignUp successfully')
    },{
        body:Auth.signUpBody,
    })
    .post('/signIn', async({body})=>{
        const {data,status} = await AuthService.signInWithEmail(body.email,body.password)
        if(error){
            return status(error.status,error.message)
        }
        return status(200,'User SignIn successfully')
    },{
        body:Auth.signInBody,
    })
    .post('/signOut', async()=>{
        const {status} = await AuthService.signOut()
        return status(200,'User SignOut successfully')
    });

export { app };