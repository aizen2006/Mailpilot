import { supabase } from "../../libs/supabase";
import db from "db";
import { UserTable } from "db/schema/schema";
import { getUserFromJwt } from "../../libs/supabaseAdmin";
import { UserService } from "../user/service";


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

    static async me(accessToken: string) {
        const user = await getUserFromJwt(accessToken);
        if (!user?.id || !user.email) {
            return { error: "Invalid or expired token", user: null as null };
        }

        const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
        const name = meta?.full_name ?? meta?.name ?? user.email.split("@")[0];
        const sync = await UserService.syncFromSupabaseUser({
            id: user.id,
            email: user.email,
            name,
        });

        return {
            error: null as null,
            user: {
                userId: sync.userId,
                email: user.email,
                name,
            },
        };
    }
}
