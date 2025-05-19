CREATE TABLE "linktree-clone_link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"user_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "linktree-clone_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"first_name" varchar(256),
	"last_name" varchar(256),
	"image_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "linktree-clone_user_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE INDEX "name_idx" ON "linktree-clone_link" USING btree ("name");