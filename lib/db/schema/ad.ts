import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { AD_POSITION } from "@/lib/validation/ad"

export const adPositionEnum = pgEnum("ad_position", AD_POSITION)

export const ads = pgTable("ads", {
  id: text("id").primaryKey(),
  title: text("title").unique().notNull(),
  content: text("content").notNull(),
  position: adPositionEnum("position").notNull().default("home_below_header"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type InsertAd = typeof ads.$inferInsert
export type SelectAd = typeof ads.$inferSelect
