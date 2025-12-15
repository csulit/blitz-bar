CREATE TABLE "user_verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp,
	"verified_at" timestamp,
	"verified_by" uuid,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_verification_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_verification" ADD CONSTRAINT "user_verification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_verification" ADD CONSTRAINT "user_verification_verified_by_user_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_verification_userId_idx" ON "user_verification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_verification_status_idx" ON "user_verification" USING btree ("status");