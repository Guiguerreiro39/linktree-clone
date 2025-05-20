CREATE TABLE "linktree-clone_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tag" varchar(30),
	"bio" varchar(160),
	"page_image_url" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "linktree-clone_link" RENAME COLUMN "user_id" TO "page_id";--> statement-breakpoint
ALTER TABLE "linktree-clone_user" RENAME COLUMN "image_url" TO "profile_image_url";--> statement-breakpoint
ALTER TABLE "linktree-clone_link" ADD COLUMN "url" text NOT NULL;