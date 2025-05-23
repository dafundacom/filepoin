"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import Image from "@/components/image"
import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
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
import type { LanguageType } from "@/lib/validation/language"
import type { StatusType } from "@/lib/validation/status"
import type { TopicType, TopicVisibility } from "@/lib/validation/topic"

interface FormValues {
  id: string
  title: string
  description?: string
  metaTitle?: string
  metaDescription?: string
  language: LanguageType
  visibility: TopicVisibility
  type: TopicType
  status: StatusType
  topicTranslationId: string
}

interface TranslateTopicFormProps {
  topicTranslationId: string
  language: LanguageType
  visibility?: TopicVisibility
  type?: TopicType
}

export default function TranslateTopicForm(props: TranslateTopicFormProps) {
  const { topicTranslationId, language, visibility, type } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [selectFeaturedImageId, setSelectFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [showMetaData, setShowMetaData] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("topic")

  const router = useRouter()

  const { mutate: translateTopic } = api.topic.translate.useMutation({
    onSuccess: () => {
      form.reset()
      router.push("/dashboard/topic")
      toast({ variant: "success", description: ts("translate_success") })
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
          description: ts("translate_failed"),
        })
      }
    },
  })

  const form = useForm<FormValues>({
    defaultValues: {
      language: language,
      visibility: visibility,
      type: type,
      topicTranslationId: topicTranslationId,
    },
  })

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      featuredImageId: selectFeaturedImageId,
    }

    setLoading(true)
    translateTopic(selectFeaturedImageId ? mergedValues : values)
    setLoading(false)
    router.push("/dashboard/topic")
  }

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectFeaturedImageId(data.id)
    setSelectedFeaturedImageUrl(data.url)
    setOpenDialog(false)
    toast({ variant: "success", description: t("featured_image_selected") })
  }

  const handleDeleteFeaturedImage = () => {
    setSelectFeaturedImageId("")
    setSelectedFeaturedImageUrl("")
    toast({
      variant: "success",
      description: t("featured_image_deleted"),
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
        className="mx-0 space-y-4 lg:mx-8 lg:p-5"
      >
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="w-full lg:w-6/12 lg:space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{
                required: t("title_required"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("title_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("description_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-6/12 lg:space-y-4">
            <FormLabel>{t("featured_image")}</FormLabel>
            {selectedFeaturedImageUrl ? (
              <div className="relative overflow-hidden rounded-[18px]">
                <DeleteMediaButton
                  description="Featured Image"
                  onDelete={() => handleDeleteFeaturedImage()}
                />
                <SelectMediaDialog
                  handleSelectUpdateMedia={handleUpdateMedia}
                  open={openDialog}
                  setOpen={setOpenDialog}
                >
                  <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
                    <Image
                      src={selectedFeaturedImageUrl}
                      className="rounded-lg object-cover"
                      fill
                      alt={t("featured_image")}
                      onClick={() => setOpenDialog(true)}
                      sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                    />
                  </div>
                </SelectMediaDialog>
              </div>
            ) : (
              <SelectMediaDialog
                handleSelectUpdateMedia={handleUpdateMedia}
                open={openDialog}
                setOpen={setOpenDialog}
              >
                <div
                  onClick={() => setOpenDialog(true)}
                  className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                >
                  <p>{t("featured_image_placeholder")}</p>
                </div>
              </SelectMediaDialog>
            )}
          </div>
        </div>
        <div className="bg-muted p-3 lg:p-5">
          <div className="flex justify-between">
            <div className={showMetaData ? "pb-4" : "pb-0"}>
              <span className="flex align-top text-base font-semibold">
                Meta Data
              </span>
              <span className="text-xs">
                {t("extra_content_search_engine")}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMetaData(!showMetaData)}
            >
              {showMetaData ? t("close") : t("expand")}
            </Button>
          </div>
          <div className={showMetaData ? "flex flex-col" : "hidden"}>
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("meta_title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("meta_title_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("meta_description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("meta_description_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            aria-label={t("submit")}
            type="submit"
            onClick={() => {
              form.setValue("status", "published")
              form.handleSubmit(onSubmit)()
            }}
            loading={loading}
          >
            {t("submit")}
          </Button>
          <Button
            aria-label={t("save_as_draft")}
            type="submit"
            onClick={() => {
              form.setValue("status", "draft")
              form.handleSubmit(onSubmit)()
            }}
            loading={loading}
          >
            {t("save_as_draft")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
