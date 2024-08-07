"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import TextEditor from "@/components/text-editor/text-editor"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  site_title: string
  site_tagline: string
  site_description: string
  support_email: string
  support_whatsapp: string
  footer_description: string
  footer_faq: string
  footer_tagline: string
  facebook_username: string
  x_username: string
  instagram_username: string
  tiktok_username: string
  whatsapp_channel: string
  youtube_channel: string
  profit_percentage: string
}

interface UpsertSettingFormProps {
  settings: Record<string, string>
}

export default function UpsertSettingForm(props: UpsertSettingFormProps) {
  const { settings } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const tsSetting = useScopedI18n("setting")
  const tsTopUp = useScopedI18n("top_up")

  const { mutate: upsertSetting } = api.setting.upsert.useMutation({
    onSuccess: () => {
      form.reset()
      toast({ variant: "success", description: tsSetting("upsert_success") })
    },
    onError: (error) => {
      setLoading(false)
      const errorData = error?.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            errorData[field]?.forEach((errorMessage) => {
              toast({
                variant: "danger",
                description: errorMessage,
              })
            })
          }
        }
      } else {
        toast({
          variant: "danger",
          description: tsSetting("upsert_failed"),
        })
      }
    },
  })

  const form = useForm<FormValues>({ defaultValues: settings })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    const mergedValues = {
      ...values,
    }
    const upsertValues = {
      key: "settings",
      value: JSON.stringify(mergedValues),
    }
    upsertSetting(upsertValues)
    setLoading(false)
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="pb-2 lg:pb-5">{t("setting")}</h1>
          <div className="flex max-w-2xl flex-col space-y-4">
            <FormField
              control={form.control}
              name="site_title"
              rules={{
                required: tsSetting("site_title_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("site_title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("site_title_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site_tagline"
              rules={{
                required: tsSetting("site_tagline_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("site_tagline")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("site_tagline_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site_description"
              rules={{
                required: tsSetting("site_description_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("site_description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={tsSetting("site_description_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebook_username"
              rules={{
                required: tsSetting("facebook_username_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("facebook_username")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("facebook_username_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="x_username"
              rules={{
                required: tsSetting("x_username_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("x_username")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("x_username_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram_username"
              rules={{
                required: tsSetting("instagram_username_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("instagram_username")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("instagram_username_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tiktok_username"
              rules={{
                required: tsSetting("tiktok_username_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("tiktok_username")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("tiktok_username_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp_channel"
              rules={{
                required: tsSetting("whatsapp_channel_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("whatsapp_channel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("whatsapp_channel_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtube_channel"
              rules={{
                required: tsSetting("youtube_channel_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("youtube_channel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("youtube_channel_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footer_tagline"
              rules={{
                required: tsSetting("footer_tagline_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsSetting("footer_tagline")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tsSetting("footer_tagline_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>{tsSetting("footer_description")}</FormLabel>
              <TextEditor control={form.control} name="footer_description" />
            </div>
            <div className="space-y-2">
              <FormLabel>{tsSetting("footer_faq")}</FormLabel>
              <TextEditor control={form.control} name="footer_faq" />
            </div>
            <FormField
              control={form.control}
              name="support_email"
              rules={{
                required: t("support_email_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("support_email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("support_email_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="support_whatsapp"
              rules={{
                required: t("support_whatsapp_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("support_whatsapp")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("support_whatsapp_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profit_percentage"
              rules={{
                required: tsTopUp("profit_percentage_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tsTopUp("profit_percentage")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={tsTopUp("profit_percentage_required")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button aria-label="Submit" type="submit" loading={loading}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
