import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { TOPIC_TYPE, TOPIC_VISIBILITY } from "@/lib/validation/topic"
import { articleTopics } from "./article"
import { languageEnum } from "./language"
import { medias } from "./media"
import { statusEnum } from "./status"

export const topicTypeEnum = pgEnum("topic_type", TOPIC_TYPE)
export const topicVisibilityEnum = pgEnum("topic_visibility", TOPIC_VISIBILITY)

export const topicTranslations = pgTable("topic_translations", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const topics = pgTable("topics", {
  id: text("id").primaryKey(),
  language: languageEnum("language").notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  type: text("type", { enum: TOPIC_TYPE }).notNull().default("all"),
  status: statusEnum("status").notNull().default("draft"),
  visibility: topicVisibilityEnum("visibility").notNull().default("public"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  topicTranslationId: text("topic_translation_id")
    .notNull()
    .references(() => topicTranslations.id),
  featuredImageId: text("featured_image_id").references(() => medias.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const topicsRelations = relations(topics, ({ one, many }) => ({
  topicTranslation: one(topicTranslations, {
    fields: [topics.topicTranslationId],
    references: [topicTranslations.id],
  }),
  featuredImage: one(medias, {
    fields: [topics.featuredImageId],
    references: [medias.id],
  }),
  articles: many(articleTopics),
}))

export const topicTranslationsRelations = relations(
  topicTranslations,
  ({ many }) => ({
    topics: many(topics),
  }),
)

export type InsertTopic = typeof topics.$inferInsert
export type SelectTopic = typeof topics.$inferSelect

export type InsertTopicTranslation = typeof topicTranslations.$inferInsert
export type SelectTopicTranslation = typeof topicTranslations.$inferSelect
