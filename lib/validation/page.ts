import { z } from "zod"

import { LANGUAGE_TYPE } from "./language"
import { STATUS_TYPE } from "./status"

export const pageInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(3),
  language: z
    .enum(LANGUAGE_TYPE, {
      invalid_type_error: "only id and en are accepted",
    })
    .optional(),
  content: z
    .string({
      invalid_type_error: "Content must be a string",
    })
    .min(10),
  excerpt: z
    .string({
      invalid_type_error: "Content must be a string",
    })
    .optional(),
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
  status: z
    .enum(STATUS_TYPE, {
      invalid_type_error:
        "only published, draft, rejected and in_review are accepted",
    })
    .optional(),
}

const translatePageInput = {
  ...pageInput,
  pageTranslationId: z.string({
    required_error: "Page Translation ID is required",
    invalid_type_error: "Page Translation ID must be a string",
  }),
}

const updatePageInput = {
  ...pageInput,
  id: z
    .string({
      required_error: "ID is required",
      invalid_type_error: "ID must be a string",
    })
    .min(1),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
    }),
}

export const createPageSchema = z.object({
  ...pageInput,
})

export const translatePageSchema = z.object({
  ...translatePageInput,
})

export const updatePageSchema = z.object({
  ...updatePageInput,
})
