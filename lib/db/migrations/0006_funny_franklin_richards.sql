ALTER TABLE "download_files" ALTER COLUMN "version_slug" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "download_files" ADD CONSTRAINT "download_files_version_slug_unique" UNIQUE("version_slug");