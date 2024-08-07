import { z } from "zod"

import { LANGUAGE_TYPE } from "./language"
import { STATUS_TYPE } from "./status"

export const DOWNLOAD_TYPE = ["app", "game"] as const

export const downloadType = z.enum(DOWNLOAD_TYPE)

export const DOWNLOAD_SCHEMA_JSON = [
  "DownloadApp",
  "BusinessApp",
  "MultimediaApp",
  "MobileApp",
  "WebApp",
  "SocialNetworkingApp",
  "TravelApp",
  "ShoppingApp",
  "SportsApp",
  "LifeStyleApp",
  "DesignApp",
  "DeveloperApp",
  "DriverApp",
  "EducationalApp",
  "HealthApp",
  "FinanceApp",
  "SecurityApp",
  "BrowserApp",
  "CommunicationApp",
  "HomeApp",
  "UtilitiesApp",
  "RefereceApp",
  "GameApp",
] as const

export const downloadSchemaJson = z.enum(DOWNLOAD_SCHEMA_JSON)

const downloadInput = {
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(2),
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
  downloadFiles: z
    .string({
      required_error: "Download File Id is required",
      invalid_type_error: "Download File Id must be a string",
    })
    .array(),
  featuredImageId: z.string({
    required_error: "Featured Image is required",
    invalid_type_error: "Featured Image must be a string",
  }),
  developer: z
    .string({
      required_error: "Developer is required",
      invalid_type_error: "Developer must be a string",
    })
    .min(1),
  operatingSystem: z
    .string({
      required_error: "Operation System is required",
      invalid_type_error: "Operation System must be a string",
    })
    .min(1),
  license: z
    .string({
      required_error: "License is required",
      invalid_type_error: "License must be a string",
    })
    .min(1),
  officialWebsite: z
    .string({
      required_error: "Official Website is required",
      invalid_type_error: "Official Website must be a string",
    })
    .min(1),
  schemaType: z.enum(DOWNLOAD_SCHEMA_JSON, {
    required_error: "Schema Type is required",
    invalid_type_error: "Schema Type must be a string",
  }),
  type: z.enum(DOWNLOAD_TYPE, {
    required_error: "Download Type is required",
    invalid_type_error: "your download type doesnt exist on available option.",
  }),
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
  topics: z
    .string({
      required_error: "Topic Id is required",
      invalid_type_error: "Topic Id must be a string",
    })
    .array(),
  authors: z
    .string({
      required_error: "Author Id is required",
      invalid_type_error: "Author Id must be a string",
    })
    .array(),
}

const translateDownloadInput = {
  ...downloadInput,
  downloadTranslationId: z.string({
    required_error: "Download Translation ID is required",
    invalid_type_error: "Download Translation ID must be a string",
  }),
}

const updateDownloadInput = {
  ...downloadInput,
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

export const createDownloadSchema = z.object({
  ...downloadInput,
})

export const translateDownloadSchema = z.object({
  ...translateDownloadInput,
})

export const updateDownloadSchema = z.object({
  ...updateDownloadInput,
})

export type DownloadType = z.infer<typeof downloadType>
export type DownloadSchemaJson = z.infer<typeof downloadSchemaJson>
export type CreateDownload = z.infer<typeof createDownloadSchema>
export type UpdateDownload = z.infer<typeof updateDownloadSchema>
export type TranslateDownload = z.infer<typeof translateDownloadSchema>
