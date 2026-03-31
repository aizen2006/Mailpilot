import { defineConfig } from "drizzle-kit";
import "dotenv/config";
export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
