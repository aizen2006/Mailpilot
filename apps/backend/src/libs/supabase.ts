import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.SUPABASE_URL;
const anon =
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ;

if (!url || !anon) {
    console.warn(
        "[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY — auth routes may fail until env is set."
    );
}

export const supabase = createClient(url ?? "", anon ?? "");