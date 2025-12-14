CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"level" text NOT NULL,
	"school_name" text NOT NULL,
	"school_address" text,
	"degree" text,
	"course" text,
	"track" text,
	"strand" text,
	"year_started" text,
	"year_graduated" text,
	"is_currently_enrolled" boolean DEFAULT false,
	"honors" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "education_userId_idx" ON "education" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "education_level_idx" ON "education" USING btree ("level");