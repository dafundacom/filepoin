import { relations } from "drizzle-orm"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { downloadDownloadFiles } from "./download"

export const downloadFiles = pgTable("download_files", {
  id: text("id").primaryKey(),
  title: text("title").unique().notNull(),
  version: text("version").notNull(),
  versionSlug: text("version_slug").notNull(),
  downloadLink: text("download_link").notNull(),
  fileSize: text("file_size").notNull(),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const downloadFilesRelations = relations(downloadFiles, ({ many }) => ({
  downloads: many(downloadDownloadFiles),
}))

export type InsertDownloadFile = typeof downloadFiles.$inferInsert
export type SelectDownloadFile = typeof downloadFiles.$inferSelect
