import { status } from 'elysia';
import { supabase } from '../../libs/supabase';

export abstract class Auth {
    
    static async signUpNewUser( email:string , password:string ){
        try {
            const { data , error } = await supabase.auth.signUp({
                email:email,
                password:password,
            })
            if(error){
                throw status(400,'Error while signing Up User', error )
            }
            return data , status(200,'User SignUp successfully')
        } catch (error) {
            throw status(500,'Error while signing Up User', error )
        }
    }

    static async signInWithEmail( email:string , password:string ){
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email:email,
                password:password
            })
            if(error){
                throw status(400," Error while SignIn user :",error)
            }
        } catch (error) {
            throw status(500," Error while SignIn user :",error)
        }
        return data , status(200,'User SignIn successfully')
    }
    static async signOut() {
        try {
            const { error } = await supabase.auth.signOut()
            if(error){
                throw status(500, 'Error while signOut the user')
            }
            return status(200,'User SignOut successfully')
        } catch (error) {
            throw status(500, 'Error while signOut the user')
        }
    }

} 