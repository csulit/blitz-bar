ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "user_type" text DEFAULT 'Employee';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "user_verified" boolean DEFAULT false;