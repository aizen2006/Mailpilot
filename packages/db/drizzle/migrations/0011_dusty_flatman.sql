ALTER TABLE "users" ALTER COLUMN "stripe_customer_id" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "stripe_customer_id" SET NOT NULL;