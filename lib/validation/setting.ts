import { z } from "zod"

const settingInput = {
  key: z
    .string({
      required_error: "Key is required",
      invalid_type_error: "Key must be a string",
    })
    .min(1),
  value: z
    .string({
      required_error: "Value is required",
      invalid_type_error: "Value must be a string",
    })
    .min(1),
}

export const upsertSettingSchema = z.object({
  ...settingInput,
})

export type UpsertSetting = z.infer<typeof upsertSettingSchema>
