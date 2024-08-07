import { TRPCError } from "@trpc/server"
import { and, count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/lib/api/trpc"
import { downloadComments } from "@/lib/db/schema/download-comment"
import { cuid } from "@/lib/utils"
import {
  createDownloadCommentSchema,
  updateDownloadCommentSchema,
} from "@/lib/validation/download-comment"

export const downloadCommentRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloadComments.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (downloadComments, { desc }) => [
            desc(downloadComments.createdAt),
          ],
          with: {
            download: true,
          },
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
  byDownloadId: publicProcedure
    .input(
      z.object({
        downloadId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloadComments.findMany({
          where: (downloadComments, { eq }) =>
            eq(downloadComments.downloadId, input.downloadId),
          orderBy: (downloadComments, { desc }) => [
            desc(downloadComments.createdAt),
          ],
          with: {
            author: true,
            replies: {
              with: {
                author: true,
              },
            },
          },
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
  byDownloadIdInfinite: publicProcedure
    .input(
      z.object({
        downloadId: z.string(),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.downloadComments.findMany({
          where: (downloadComments, { eq, and, lt }) =>
            and(
              eq(downloadComments.downloadId, input.downloadId),
              eq(downloadComments.replyToId, ""),
              input.cursor
                ? lt(downloadComments.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (downloadComments, { desc }) => [
            desc(downloadComments.createdAt),
          ],
          with: {
            author: true,
            replies: {
              with: {
                author: true,
              },
            },
          },
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.createdAt) {
            nextCursor = nextItem.createdAt
          }
        }

        return {
          downloadComments: data,
          nextCursor,
        }
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
  byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.downloadComments.findMany({
        where: (downloadComments, { eq }) => eq(downloadComments.id, input),
        with: {
          replies: {
            with: {
              author: true,
            },
          },
        },
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
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select({ value: count() })
        .from(downloadComments)

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
  countByDownloadId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ value: count() })
          .from(downloadComments)
          .where(
            and(
              eq(downloadComments.id, input),
              eq(downloadComments.replyToId, ""),
            ),
          )

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
  create: protectedProcedure
    .input(createDownloadCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.insert(downloadComments).values({
          id: cuid(),
          downloadId: input.downloadId,
          content: input.content,
          replyToId: input.replyToId ?? "",
          authorId: ctx.session.user.id,
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
  update: protectedProcedure
    .input(updateDownloadCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const downloadComment = await ctx.db.query.downloadComments.findFirst({
          where: (downloadComments, { eq }) =>
            eq(downloadComments.id, input.id),
          with: {
            author: true,
          },
        })

        const isUserAuthor = downloadComment?.author?.id === ctx.session.user.id

        if (!isUserAuthor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Only the author of the download comment is allowed to update it.",
          })
        }

        const data = await ctx.db
          .update(downloadComments)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(downloadComments.id, input.id))

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
  updateByAdmin: adminProtectedProcedure
    .input(updateDownloadCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(downloadComments)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(downloadComments.id, input.id))

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
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const downloadComment = await ctx.db.query.downloadComments.findFirst({
          where: (downloadComments, { eq }) => eq(downloadComments.id, input),
          with: {
            author: true,
          },
        })

        const isUserAuthor = downloadComment?.author?.id === ctx.session.user.id

        if (!isUserAuthor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Only the author of the download comment is allowed to delete it.",
          })
        }

        const data = await ctx.db
          .delete(downloadComments)
          .where(eq(downloadComments.id, input))

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
  deleteByAdmin: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(downloadComments)
          .where(eq(downloadComments.id, input))

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
