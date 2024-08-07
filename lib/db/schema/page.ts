import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { languageEnum } from "./language"
import { statusEnum } from "./status"

export const pageTranslations = pgTable("page_translations", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const pages = pgTable("pages", {
  id: text("id").primaryKey(),
  language: languageEnum("language").notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: statusEnum("status").notNull().default("draft"),
  pageTranslationId: text("page_translation_id")
    .notNull()
    .references(() => pageTranslations.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const pagesRelations = relations(pages, ({ one }) => ({
  pageTranslation: one(pageTranslations, {
    fields: [pages.pageTranslationId],
    references: [pageTranslations.id],
  }),
}))

export const pageTranslationsRelations = relations(
  pageTranslations,
  ({ many }) => ({
    pages: many(pages),
  }),
)

export type InsertPage = typeof pages.$inferInsert
export type SelectPage = typeof pages.$inferSelect

export type InsertPageTranslation = typeof pageTranslations.$inferInsert
export type SelectPageTranslation = typeof pageTranslations.$inferSelect
