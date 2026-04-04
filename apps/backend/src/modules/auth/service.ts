import { supabase } from "../../libs/supabase";

export abstract class Auth {
    static async signUpNewUser(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            return { error: error.message, user: null as null, session: null as null };
        }
        return { error: null as null, user: data.user, session: data.session };
    }

    static async signInWithEmail(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            return { error: error.message, user: null as null, session: null as null };
        }
        return { error: null as null, user: data.user, session: data.session };
    }

    static async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { error: error.message };
        }
        return { error: null as null };
    }
}
