ALTER TABLE "user" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "middle_initial" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "middle_initial";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "last_name";