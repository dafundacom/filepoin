DO $$ BEGIN
 CREATE TYPE "public"."ad_type" AS ENUM('plain_ad', 'adsense');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "type" "ad_type" DEFAULT 'plain_ad' NOT NULL;