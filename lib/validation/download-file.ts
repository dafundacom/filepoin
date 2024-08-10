import { z } from "zod"

const downloadFileInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(2),
  version: z
    .string({
      required_error: "Version is required",
      invalid_type_error: "Version must be a string",
    })
    .min(1),
  downloadLink: z
    .string({
      required_error: "Download Link is required",
      invalid_type_error: "Download Link must be a string",
    })
    .min(1),
  fileSize: z
    .string({
      required_error: "File Size is required",
      invalid_type_error: "File Size must be a string",
    })
    .min(1),
}

const updateDownloadFileInput = {
  ...downloadFileInput,
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  }),
}

export const createDownloadFileSchema = z.object({
  ...downloadFileInput,
})

export const updateDownloadFileSchema = z.object({
  ...updateDownloadFileInput,
})

export type CreateDownloadFile = z.infer<typeof createDownloadFileSchema>
export type UpdateDownloadFile = z.infer<typeof updateDownloadFileSchema>
