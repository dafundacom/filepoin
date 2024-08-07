import { relations } from "drizzle-orm"
import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { DOWNLOAD_SCHEMA_JSON, DOWNLOAD_TYPE } from "@/lib/validation/download"
import { downloadComments } from "./download-comment"
import { downloadFiles } from "./download-file"
import { languageEnum } from "./language"
import { medias } from "./media"
import { statusEnum } from "./status"
import { topics } from "./topic"
import { users } from "./user"

export const downloadType = pgEnum("download_type", DOWNLOAD_TYPE)

export const downloadSchemaJsonEnum = pgEnum(
  "download_schema_json",
  DOWNLOAD_SCHEMA_JSON,
)

export const downloadTranslations = pgTable("download_translations", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const downloads = pgTable("downloads", {
  id: text("id").primaryKey(),
  language: languageEnum("language").notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  developer: text("developer").notNull(),
  operatingSystem: text("operating_system").notNull(),
  license: text("license").notNull(),
  officialWebsite: text("official_website").notNull(),
  schemaType: downloadSchemaJsonEnum("schema_type")
    .notNull()
    .default("DownloadApp"),
  type: downloadType("type").notNull().default("app"),
  currency: text("currency").notNull(),
  price: text("price").notNull(),
  status: statusEnum("status").notNull().default("draft"),
  downloadTranslationId: text("download_translation_id")
    .notNull()
    .references(() => downloadTranslations.id),
  featuredImageId: text("featured_image_id")
    .notNull()
    .references(() => medias.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const downloadsRelations = relations(downloads, ({ one, many }) => ({
  downloadTranslation: one(downloadTranslations, {
    fields: [downloads.downloadTranslationId],
    references: [downloadTranslations.id],
  }),
  featuredImage: one(medias, {
    fields: [downloads.featuredImageId],
    references: [medias.id],
  }),
  downloadFiles: many(downloadDownloadFiles),
  topics: many(downloadTopics),
  authors: many(downloadAuthors),
  comments: many(downloadComments),
}))

export const downloadTranslationsRelations = relations(
  downloadTranslations,
  ({ many }) => ({
    downloads: many(downloads),
  }),
)

export const downloadDownloadFiles = pgTable(
  "_download_download_files",
  {
    downloadId: text("download_id")
      .notNull()
      .references(() => downloads.id),
    downloadFileId: text("download_file_id")
      .notNull()
      .references(() => downloadFiles.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.downloadId, t.downloadFileId],
    }),
  }),
)

export const downloadDownloadFilesRelations = relations(
  downloadDownloadFiles,
  ({ one }) => ({
    download: one(downloads, {
      fields: [downloadDownloadFiles.downloadId],
      references: [downloads.id],
    }),
    downloadFile: one(downloadFiles, {
      fields: [downloadDownloadFiles.downloadFileId],
      references: [downloadFiles.id],
    }),
  }),
)

export const downloadAuthors = pgTable(
  "_download_authors",
  {
    downloadId: text("download_id")
      .notNull()
      .references(() => downloads.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.downloadId, t.userId],
    }),
  }),
)

export const downloadAuthorsRelations = relations(
  downloadAuthors,
  ({ one }) => ({
    download: one(downloads, {
      fields: [downloadAuthors.downloadId],
      references: [downloads.id],
    }),
    user: one(users, {
      fields: [downloadAuthors.userId],
      references: [users.id],
    }),
  }),
)

export const downloadTopics = pgTable(
  "_download_topics",
  {
    downloadId: text("download_id")
      .notNull()
      .references(() => downloads.id),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.downloadId, t.topicId],
    }),
  }),
)

export const downloadTopicsRelations = relations(downloadTopics, ({ one }) => ({
  download: one(downloads, {
    fields: [downloadTopics.downloadId],
    references: [downloads.id],
  }),
  topic: one(topics, {
    fields: [downloadTopics.topicId],
    references: [topics.id],
  }),
}))

export type InsertDownload = typeof downloads.$inferInsert
export type SelectDownload = typeof downloads.$inferSelect

export type InsertDownloadTranslation = typeof downloadTranslations.$inferInsert
export type SelectDownloadTranslation = typeof downloadTranslations.$inferSelect
