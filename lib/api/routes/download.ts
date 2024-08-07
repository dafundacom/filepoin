import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  downloadAuthors,
  downloadDownloadFiles,
  downloadFiles,
  downloads,
  downloadTopics,
  downloadTranslations,
  medias,
  topics,
  users,
} from "@/lib/db/schema"
import { cuid, slugify, trimText } from "@/lib/utils"
import {
  createDownloadSchema,
  DOWNLOAD_TYPE,
  translateDownloadSchema,
  updateDownloadSchema,
} from "@/lib/validation/download"
import { LANGUAGE_TYPE } from "@/lib/validation/language"

export const downloadRouter = createTRPCRouter({
  downloadTranslationById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const downloadTranslationData =
          await ctx.db.query.downloadTranslations.findFirst({
            where: (downloadTranslations, { eq }) =>
              eq(downloadTranslations.id, input),
            with: {
              downloads: {
                columns: {
                  id: true,
                  title: true,
                  language: true,
                  developer: true,
                  operatingSystem: true,
                  license: true,
                  officialWebsite: true,
                  schemaType: true,
                  slug: true,
                  type: true,
                },
                with: {
                  featuredImage: {
                    columns: {
                      id: true,
                      url: true,
                    },
                  },
                  authors: true,
                },
              },
            },
          })

        const downloadFilesData = await ctx.db
          .select({
            id: downloadFiles.id,
            title: downloadFiles.title,
            version: downloadFiles.version,
          })
          .from(downloadDownloadFiles)
          .leftJoin(
            downloads,
            eq(downloadDownloadFiles.downloadId, downloads.id),
          )
          .leftJoin(
            downloadFiles,
            eq(downloadDownloadFiles.downloadFileId, downloadFiles.id),
          )
          .orderBy(desc(downloadFiles.createdAt))
          .where(eq(downloads.id, downloadTranslationData?.downloads[0].id!))

        const downloadTopicsData = await ctx.db
          .select({ id: topics.id, title: topics.title })
          .from(downloadTopics)
          .leftJoin(downloads, eq(downloadTopics.downloadId, downloads.id))
          .leftJoin(topics, eq(downloadTopics.topicId, topics.id))
          .where(eq(downloads.id, downloadTranslationData?.downloads[0].id!))

        const downloadAuthorsData = await ctx.db
          .select({ id: users.id, name: users.name })
          .from(downloadAuthors)
          .leftJoin(downloads, eq(downloadAuthors.downloadId, downloads.id))
          .leftJoin(users, eq(downloadAuthors.userId, users.id))
          .where(eq(downloads.id, downloadTranslationData?.downloads[0].id!))

        const downloadData = downloadTranslationData?.downloads.map((item) => ({
          ...item,
          downloadFiles: downloadFilesData,
          topics: downloadTopicsData,
          authors: downloadAuthorsData,
        }))

        const data = {
          ...downloadTranslationData,
          downloads: downloadData,
        }

        return data
      } catch (error) {
        console.log("Error:", error)
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
        const downloadData = await ctx.db
          .select()
          .from(downloads)
          .leftJoin(medias, eq(medias.id, downloads.featuredImageId))
          .where(eq(downloads.id, input))
          .limit(1)

        const downloadFilesData = await ctx.db
          .select({
            id: downloadFiles.id,
            title: downloadFiles.title,
            version: downloadFiles.version,
          })
          .from(downloadDownloadFiles)
          .leftJoin(
            downloads,
            eq(downloadDownloadFiles.downloadId, downloads.id),
          )
          .leftJoin(
            downloadFiles,
            eq(downloadDownloadFiles.downloadFileId, downloadFiles.id),
          )
          .orderBy(desc(downloadFiles.createdAt))
          .where(eq(downloads.id, input))

        const downloadTopicsData = await ctx.db
          .select({ id: topics.id, title: topics.title })
          .from(downloadTopics)
          .leftJoin(downloads, eq(downloadTopics.downloadId, downloads.id))
          .leftJoin(topics, eq(downloadTopics.topicId, topics.id))
          .where(eq(downloads.id, input))

        const downloadAuthorsData = await ctx.db
          .select({ id: users.id, name: users.name })
          .from(downloadAuthors)
          .leftJoin(downloads, eq(downloadAuthors.downloadId, downloads.id))
          .leftJoin(users, eq(downloadAuthors.userId, users.id))
          .where(eq(downloads.id, input))

        const data = downloadData.map((item) => ({
          ...item.downloads,
          featuredImage: {
            id: item?.medias?.id!,
            url: item?.medias?.url!,
          },
          downloadFiles: downloadFilesData,
          topics: downloadTopicsData,
          authors: downloadAuthorsData,
        }))

        return data[0]
      } catch (error) {
        console.log("Error:", error)
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
  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        downloadFilePage: z.number(),
        downloadFilePerPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const downloadData = await ctx.db
          .select()
          .from(downloads)
          .leftJoin(medias, eq(medias.id, downloads.featuredImageId))
          .where(eq(downloads.slug, input.slug))
          .limit(1)

        const downloadFilesData = await ctx.db
          .select({
            id: downloadFiles.id,
            title: downloadFiles.title,
            version: downloadFiles.version,
            fileSize: downloadFiles.fileSize,
          })
          .from(downloadDownloadFiles)
          .leftJoin(
            downloads,
            eq(downloadDownloadFiles.downloadId, downloads.id),
          )
          .leftJoin(
            downloadFiles,
            eq(downloadDownloadFiles.downloadFileId, downloadFiles.id),
          )
          .orderBy(desc(downloadFiles.createdAt))
          .where(eq(downloads.id, downloadData[0].downloads.id))
          .limit(input.downloadFilePage)
          .offset((input.downloadFilePage - 1) * input.downloadFilePerPage)

        const downloadTopicsData = await ctx.db
          .select({ id: topics.id, title: topics.title, slug: topics.slug })
          .from(downloadTopics)
          .leftJoin(downloads, eq(downloadTopics.downloadId, downloads.id))
          .leftJoin(topics, eq(downloadTopics.topicId, topics.id))
          .where(eq(downloads.id, downloadData[0].downloads.id))

        const downloadAuthorsData = await ctx.db
          .select({ id: users.id, name: users.name, username: users.username })
          .from(downloadAuthors)
          .leftJoin(downloads, eq(downloadAuthors.downloadId, downloads.id))
          .leftJoin(users, eq(downloadAuthors.userId, users.id))
          .where(eq(downloads.id, downloadData[0].downloads.id))

        const data = downloadData.map((item) => ({
          ...item.downloads,
          featuredImage: {
            id: item?.medias?.id!,
            url: item?.medias?.url!,
          },
          downloadFiles: downloadFilesData,
          topics: downloadTopicsData,
          authors: downloadAuthorsData,
        }))

        return data[0]
      } catch (error) {
        console.log("Error:", error)
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
  byLanguage: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloads.findMany({
          where: (downloads, { eq, and }) =>
            and(
              eq(downloads.language, input.language),
              eq(downloads.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (downloads, { desc }) => [desc(downloads.updatedAt)],
          with: {
            featuredImage: true,
            downloadFiles: true,
          },
        })

        return data
      } catch (error) {
        console.log("Error:", error)
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
  byLanguageInfinite: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        type: z.enum(DOWNLOAD_TYPE),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50
        const data = await ctx.db.query.downloads.findMany({
          where: (downloads, { eq, and, lt }) =>
            and(
              eq(downloads.language, input.language),
              eq(downloads.status, "published"),
              input.cursor ? lt(downloads.updatedAt, input.cursor) : undefined,
            ),
          limit: limit + 1,
          with: {
            featuredImage: true,
            downloadFiles: true,
          },
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          downloads: data,
          nextCursor,
        }
      } catch (error) {
        console.log("Error:", error)
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
  relatedInfinite: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        topicId: z.string(),
        currentDownloadId: z.string(),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50
        const downloads = await ctx.db.query.downloads.findMany({
          where: (downloads, { eq, and, not, lt }) =>
            and(
              eq(downloads.language, input.language),
              eq(downloads.status, "published"),
              input.cursor ? lt(downloads.updatedAt, input.cursor) : undefined,
              not(eq(downloads.id, input.currentDownloadId)),
            ),
          limit: limit + 1,
          with: {
            featuredImage: true,
            topics: true,
          },
        })

        const data = downloads.filter((download) =>
          download.topics.some((topic) => topic.topicId === input.topicId),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          downloads: data,
          nextCursor,
        }
      } catch (error) {
        console.log("Error:", error)
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
  byType: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        type: z.enum(DOWNLOAD_TYPE),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloads.findMany({
          where: (downloads, { eq, and }) =>
            and(
              eq(downloads.type, input.type),
              eq(downloads.language, input.language),
              eq(downloads.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (downloads, { desc }) => [desc(downloads.updatedAt)],
          with: {
            featuredImage: true,
            downloadFiles: true,
          },
        })
        return data
      } catch (error) {
        console.log("Error:", error)
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
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        type: z.enum(DOWNLOAD_TYPE).nullable(),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloads.findMany({
          where: (downloads, { eq }) => eq(downloads.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (downloads, { desc }) => [desc(downloads.updatedAt)],
          with: {
            featuredImage: {
              columns: {
                id: true,
                url: true,
              },
            },
            downloadTranslation: {
              columns: {
                id: true,
              },
              with: {
                downloads: {
                  columns: {
                    id: true,
                    title: true,
                    language: true,
                  },
                },
              },
            },
          },
        })
        return data
      } catch (error) {
        console.log("Error:", error)
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
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloads.findMany({
          where: (downloads, { eq, and }) =>
            and(
              eq(downloads.language, input.language),
              eq(downloads.status, "published"),
            ),
          columns: {
            slug: true,
            updatedAt: true,
          },
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (downloads, { desc }) => [desc(downloads.id)],
        })
        return data
      } catch (error) {
        console.log("Error:", error)
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
        .from(downloads)
        .where(eq(downloads.status, "published"))
      return data[0].value
    } catch (error) {
      console.log("Error:", error)
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
  countByLanguage: publicProcedure
    .input(z.enum(LANGUAGE_TYPE))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ values: count() })
          .from(downloads)
          .where(
            and(
              eq(downloads.language, input),
              eq(downloads.status, "published"),
            ),
          )
        return data[0].values
      } catch (error) {
        console.log("Error:", error)
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
  search: publicProcedure
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), searchQuery: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloads.findMany({
          where: (downloads, { eq, and, or, ilike }) =>
            and(
              eq(downloads.language, input.language),
              eq(downloads.status, "published"),
              or(
                ilike(downloads.title, `%${input.searchQuery}%`),
                ilike(downloads.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            featuredImage: true,
          },
          limit: 10,
        })
        return data
      } catch (error) {
        console.log("Error:", error)
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
  searchDashboard: publicProcedure
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), searchQuery: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.downloads.findMany({
          where: (downloads, { eq, and, or, ilike }) =>
            and(
              eq(downloads.language, input.language),
              or(
                ilike(downloads.title, `%${input.searchQuery}%`),
                ilike(downloads.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            featuredImage: true,
          },
          limit: 10,
        })
        return data
      } catch (error) {
        console.log("Error:", error)
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
    .input(createDownloadSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = slugify(input.title)
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedExcerpt
          : input.metaDescription

        const downloadTranslationId = cuid()
        const downloadId = cuid()

        const downloadTranslation = await ctx.db
          .insert(downloadTranslations)
          .values({
            id: downloadTranslationId,
          })
          .returning()

        const data = await ctx.db
          .insert(downloads)
          .values({
            ...input,
            id: downloadId,
            slug: slug,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            downloadTranslationId: downloadTranslation[0].id,
          })
          .returning()

        const downloadFileValues = input.downloadFiles.map((downloadFile) => ({
          downloadId: data[0].id,
          downloadFileId: downloadFile,
        }))

        const topicValues = input.topics.map((topic) => ({
          downloadId: data[0].id,
          topicId: topic,
        }))

        const authorValues = input.authors.map((author) => ({
          downloadId: data[0].id,
          userId: author,
        }))

        await ctx.db.transaction(async () => {
          await ctx.db.insert(downloadDownloadFiles).values(downloadFileValues)
          await ctx.db.insert(downloadTopics).values(topicValues)
          await ctx.db.insert(downloadAuthors).values(authorValues)
        })

        return data
      } catch (error) {
        console.log("Error:", error)
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
  translate: adminProtectedProcedure
    .input(translateDownloadSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = slugify(input.title)
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedExcerpt
          : input.metaDescription

        const data = await ctx.db
          .insert(downloads)
          .values({
            ...input,
            id: cuid(),
            slug: slug,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
          })
          .returning()

        const topicValues = input.topics.map((topic) => ({
          downloadId: data[0].id,
          topicId: topic,
        }))

        const authorValues = input.authors.map((author) => ({
          downloadId: data[0].id,
          userId: author,
        }))

        await ctx.db.transaction(async () => {
          await ctx.db.insert(downloadTopics).values(topicValues)
          await ctx.db.insert(downloadAuthors).values(authorValues)
        })

        return data
      } catch (error) {
        console.log("Error:", error)
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
    .input(updateDownloadSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(downloads)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(downloads.id, input.id))
          .returning()

        await ctx.db.transaction(async () => {
          await ctx.db
            .delete(downloadDownloadFiles)
            .where(eq(downloadTopics.downloadId, input.id))
          await ctx.db
            .delete(downloadTopics)
            .where(eq(downloadTopics.downloadId, input.id))
          await ctx.db
            .delete(downloadAuthors)
            .where(eq(downloadAuthors.downloadId, input.id))
        })

        const downloadFileValues = input.downloadFiles.map((downloadFile) => ({
          downloadId: data[0].id,
          downloadFileId: downloadFile,
        }))

        const topicValues = input.topics.map((topic) => ({
          downloadId: data[0].id,
          topicId: topic,
        }))

        const authorValues = input.authors.map((author) => ({
          downloadId: data[0].id,
          userId: author,
        }))

        await ctx.db.transaction(async () => {
          await ctx.db.insert(downloadAuthors).values(authorValues)
          await ctx.db.insert(downloadTopics).values(topicValues)
          await ctx.db.insert(downloadDownloadFiles).values(downloadFileValues)
        })

        return data
      } catch (error) {
        console.log("Error:", error)
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
        const data = await ctx.db.transaction(async () => {
          await ctx.db
            .delete(downloadTopics)
            .where(eq(downloadTopics.downloadId, input))
          await ctx.db
            .delete(downloadAuthors)
            .where(eq(downloadAuthors.downloadId, input))
          await ctx.db.delete(downloads).where(eq(downloads.id, input))
        })
        return data
      } catch (error) {
        console.log("Error:", error)
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
        const data = await ctx.db.transaction(async () => {
          await ctx.db
            .delete(downloadTopics)
            .where(eq(downloadTopics.downloadId, input))
          await ctx.db
            .delete(downloadAuthors)
            .where(eq(downloadAuthors.downloadId, input))
          await ctx.db.delete(downloads).where(eq(downloads.id, input))
        })
        return data
      } catch (error) {
        console.log("Error:", error)
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
