import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  downloadDownloadFiles,
  downloadFiles,
  downloads,
} from "@/lib/db/schema"
import { cuid } from "@/lib/utils"
import {
  createDownloadFileSchema,
  updateDownloadFileSchema,
} from "@/lib/validation/download-file"

export const downloadFileRouter = createTRPCRouter({
  all: publicProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloadFiles.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
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
  dashboard: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloadFiles.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
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
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloadFiles.findFirst({
          where: (downloadFile, { eq }) => eq(downloadFile.id, input),
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
  sitemap: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const downloadFilesData = await ctx.db.query.downloadFiles.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          columns: {
            id: true,
            version: true,
            updatedAt: true,
          },
        })

        const downloadFileDownloadsData = await ctx.db
          .select({
            id: downloads.id,
            type: downloads.type,
            slug: downloads.slug,
          })
          .from(downloadDownloadFiles)
          .leftJoin(
            downloadFiles,
            eq(downloadDownloadFiles.downloadFileId, downloadFiles.id),
          )
          .leftJoin(
            downloadDownloadFiles,
            eq(downloadDownloadFiles.downloadId, downloads.id),
          )
          .where(eq(downloadFiles.id, downloadFilesData[0].id!))

        const data = {
          ...downloadFilesData,
          downloads: downloadFileDownloadsData,
        }

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
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(downloadFiles)
      return data[0].value
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
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.downloadFiles.findMany({
        where: (downloadFiles, { and, or, like: ilike }) =>
          and(
            or(
              ilike(downloadFiles.title, `%${input}%`),
              ilike(downloadFiles.version, `%${input}%`),
              ilike(downloadFiles.downloadLink, `%${input}%`),
            ),
          ),
        limit: 10,
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
  create: adminProtectedProcedure
    .input(createDownloadFileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const downloadFileId = cuid()

        const data = await ctx.db
          .insert(downloadFiles)
          .values({
            ...input,
            id: downloadFileId,
          })
          .returning()

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
  update: adminProtectedProcedure
    .input(updateDownloadFileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(downloadFiles)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(downloadFiles.id, input.id))
          .returning()
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
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(downloadFiles)
          .where(eq(downloadFiles.id, input))
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
  deleteByAdmin: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(downloadFiles)
          .where(eq(downloadFiles.id, input))
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
