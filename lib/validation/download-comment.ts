import { z } from "zod"

const downloadCommentInput = {
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(1)
    .max(600),
  downloadId: z.string({
    required_error: "Download Id is required",
    invalid_type_error: "Download Id must be a string",
  }),
  replyToId: z
    .string({
      invalid_type_error: "Download Comment Id must be a string",
    })
    .optional()
    .nullish(),
}

const updateDownloadCommentInput = {
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  }),
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(1)
    .max(600),
}

export const createDownloadCommentSchema = z.object({
  ...downloadCommentInput,
})

export const updateDownloadCommentSchema = z.object({
  ...updateDownloadCommentInput,
})

export type CreateDownloadComment = z.infer<typeof createDownloadCommentSchema>
export type UpdateDownloadComment = z.infer<typeof updateDownloadCommentSchema>
