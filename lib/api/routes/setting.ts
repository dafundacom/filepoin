import { TRPCError } from "@trpc/server"
import { sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { settings } from "@/lib/db/schema/setting"
import { cuid } from "@/lib/utils"
import { upsertSettingSchema } from "@/lib/validation/setting"

export const settingRouter = createTRPCRouter({
  all: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.settings.findMany({
        orderBy: (settings, { asc }) => asc(settings.createdAt),
      })

      return data
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  byKey: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.settings.findFirst({
        where: (setting, { eq }) => eq(setting.key, input),
      })

      return data
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  upsert: adminProtectedProcedure
    .input(upsertSettingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .insert(settings)
          .values({
            ...input,
            id: cuid(),
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: { value: input.value, updatedAt: sql`CURRENT_TIMESTAMP` },
          })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
})
