CREATE TABLE "verification_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"verification_id" uuid NOT NULL,
	"admin_user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"reason" text,
	"previous_status" text NOT NULL,
	"new_status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verification_audit_log" ADD CONSTRAINT "verification_audit_log_verification_id_user_verification_id_fk" FOREIGN KEY ("verification_id") REFERENCES "public"."user_verification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_audit_log" ADD CONSTRAINT "verification_audit_log_admin_user_id_user_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "verification_audit_log_verificationId_idx" ON "verification_audit_log" USING btree ("verification_id");--> statement-breakpoint
CREATE INDEX "verification_audit_log_adminUserId_idx" ON "verification_audit_log" USING btree ("admin_user_id");