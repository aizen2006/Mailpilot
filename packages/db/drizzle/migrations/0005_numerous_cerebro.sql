ALTER TABLE "users" DROP CONSTRAINT "users_conversations_conversations_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "conversations";