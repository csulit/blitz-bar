CREATE TABLE "identity_document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"document_type" text NOT NULL,
	"front_image_url" text NOT NULL,
	"back_image_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp,
	"verified_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "identity_document" ADD CONSTRAINT "identity_document_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_document" ADD CONSTRAINT "identity_document_verified_by_user_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "identity_document_userId_idx" ON "identity_document" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "identity_document_status_idx" ON "identity_document" USING btree ("status");