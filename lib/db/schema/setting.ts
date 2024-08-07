import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type InsertSetting = typeof settings.$inferInsert
export type SelectSetting = typeof settings.$inferSelect
