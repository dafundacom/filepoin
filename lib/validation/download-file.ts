import { z } from "zod"

import { STATUS_TYPE } from "./status"

const downloadFileInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(2),
  metaTitle: z
    .string({
      invalid_type_error: "Meta Title must be a string",
    })
    .optional(),
  metaDescription: z
    .string({
      invalid_type_error: "Meta Description must be a string",
    })
    .optional(),
  featuredImageId: z.string({
    required_error: "Featured Image is required",
    invalid_type_error: "Featured Image must be a string",
  }),
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
  currency: z
    .string({
      required_error: "Currency is required",
      invalid_type_error: "Currency must be a string",
    })
    .min(1),
  price: z
    .string({
      required_error: "Price is required",
      invalid_type_error: "Price must be a string",
    })
    .min(1),
  status: z
    .enum(STATUS_TYPE, {
      invalid_type_error:
        "only published, draft, rejected and in_review are accepted",
    })
    .optional(),
  authors: z
    .string({
      required_error: "Author Id is required",
      invalid_type_error: "Author Id must be a string",
    })
    .array(),
}

const updateDownloadFileInput = {
  ...downloadFileInput,
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  }),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
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
