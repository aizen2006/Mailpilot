import 'dotenv/config';
import { Pool } from 'pg';
import { createCorsair } from 'corsair';
import { gmail } from "@corsair-dev/gmail";
const db = new Pool({ connectionString: process.env.DATABASE_URL });
export const corsair = createCorsair({
    multiTenancy: true, 
    plugins: [
        gmail({
            authType: "oauth_2"
        }),
    ],
    database: db,
    kek: process.env.CORSAIR_KEK!,
});