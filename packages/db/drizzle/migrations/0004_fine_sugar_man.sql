ALTER TABLE "conversations" DROP CONSTRAINT "conversations_messages_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "conversation_id" uuid;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "messages";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "updated_at";