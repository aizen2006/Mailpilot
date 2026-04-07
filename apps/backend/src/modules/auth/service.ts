import { supabase } from "../../libs/supabase";
import db from "db";
import { UserTable } from "db/schema/schema";


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
        const nameFromMetadata =
            typeof data.user.user_metadata?.name === "string"
                ? data.user.user_metadata.name.trim()
                : "";
        const fallbackName = (data.user.email ?? email).split("@")[0] ?? "User";
        const safeName = nameFromMetadata || fallbackName || "User";
        const hashedPassword = await Bun.password.hash(password);

        const [user] = await db.insert(UserTable).values({
            id: data.user.id,
            email: data.user.email as string,
            name: safeName,
            password: hashedPassword,
        }).onConflictDoUpdate({
            target: UserTable.email,
            set: { name: safeName, password: hashedPassword },
        });
        return { error: null as null, user: user, session: data.session };
    }

    static async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { error: error.message };
        }
        return { error: null as null };
    }
}
