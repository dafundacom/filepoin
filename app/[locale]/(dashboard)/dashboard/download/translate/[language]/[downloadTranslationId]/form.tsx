"use client"

import * as React from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import DashboardAddAuthors from "@/components/dashboard/dashboard-add-authors"
import DashboardAddDownloadFiles, {
  type SelectedDownloadFilesProps,
} from "@/components/dashboard/dashboard-add-download-files"
import DashboardAddTopics from "@/components/dashboard/dashboard-add-topics"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import Image from "@/components/image"
import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import TextEditorExtended from "@/components/text-editor/text-editor-extended"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import { useDisclosure } from "@/hooks/use-disclosure"
import type {
  SelectDownload,
  SelectDownloadFile,
  SelectMedia,
  SelectUser,
} from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type {
  DownloadSchemaJson,
  DownloadType,
} from "@/lib/validation/download"
import type { LanguageType } from "@/lib/validation/language"
import type { StatusType } from "@/lib/validation/status"

interface FormValues {
  id: string
  content: string
  title: string
  slug: string
  topics: string[]
  language?: LanguageType
  excerpt?: string
  developer: string
  operatingSystem: string
  license: string
  officialWebsite: string
  schemaType: DownloadSchemaJson
  type: DownloadType
  currency: string
  price: string
  metaTitle?: string
  metaDescription?: string
  status?: StatusType
  downloadTranslationId: string
}

interface TranslateDownloadFormProps {
  downloadTranslationId: string
  language: LanguageType
  initialDownloadData?: Pick<
    SelectDownload,
    | "id"
    | "title"
    | "excerpt"
    | "content"
    | "language"
    | "slug"
    | "type"
    | "developer"
    | "operatingSystem"
    | "license"
    | "officialWebsite"
    | "schemaType"
    | "currency"
    | "price"
    | "metaTitle"
    | "metaDescription"
    | "status"
    | "downloadTranslationId"
  > & {
    featuredImage: Pick<SelectMedia, "id" | "url">
    downloadFiles: Pick<
      SelectDownloadFile,
      "id" | "title" | "version" | "fileSize" | "downloadLink"
    >[]
    authors: Pick<SelectUser, "id" | "name">[]
  }
}

const TranslateDownloadForm = (props: TranslateDownloadFormProps) => {
  const { downloadTranslationId, language, initialDownloadData } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [openDialogDownloadFile, setOpenDialogDownloadFile] =
    React.useState<boolean>(false)
  const [showMetaData, setShowMetaData] = React.useState<boolean>(false)
  const [topics, setTopics] = React.useState<string[]>([])
  const [clearContent, setClearContent] = React.useState<boolean>(false)

  const [authors, setAuthors] = React.useState<string[]>(
    initialDownloadData?.authors
      ? initialDownloadData.authors.map((author) => {
          return author.id
        })
      : [],
  )
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>(
      initialDownloadData?.featuredImage
        ? initialDownloadData.featuredImage.id
        : "",
    )
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>(
      initialDownloadData?.featuredImage
        ? initialDownloadData.featuredImage.url
        : "",
    )
  const [selectedTopics, setSelectedTopics] = React.useState<
    { id: string; title: string }[] | []
  >([])
  const [selectedDownloadFile, setSelectedDownloadFile] = React.useState<
    SelectedDownloadFilesProps[]
  >(
    initialDownloadData?.downloadFiles
      ? initialDownloadData.downloadFiles.map((downloadFile) => {
          return {
            id: downloadFile.id,
            title: downloadFile.title,
            version: downloadFile.version,
            fileSize: downloadFile.fileSize,
            downloadLink: downloadFile.downloadLink,
          }
        })
      : [],
  )
  const [selectedDownloadFileId, setSelectedDownloadFileId] = React.useState<
    string[]
  >(
    initialDownloadData
      ? initialDownloadData.downloadFiles.map((downloadFile) => {
          return downloadFile.id
        })
      : [],
  )
  const [selectedAuthors, setSelectedAuthors] = React.useState<
    { id: string; name: string }[] | []
  >(
    initialDownloadData?.authors
      ? initialDownloadData.authors.map((author) => {
          return { id: author.id, name: author.name! }
        })
      : [],
  )

  const t = useI18n()
  const ts = useScopedI18n("download")
  const router = useRouter()
  const { isOpen: isOpenSidebar, onToggle: onToggleSidebar } = useDisclosure()

  const handleUpdateDownloadFile = React.useCallback(
    (values: SelectedDownloadFilesProps[]) => {
      setSelectedDownloadFile((prev) => [
        ...(prev as SelectedDownloadFilesProps[]),
        ...values,
      ])
      const downloadFileId = values.map((value) => {
        return value.id
      })
      setSelectedDownloadFileId((prev) => [...prev, ...downloadFileId])
    },
    [],
  )

  const handleDeleteDownloadFile = React.useCallback(
    (value: SelectedDownloadFilesProps) => {
      const downloadFileData = selectedDownloadFile?.filter(
        (item) => item.id !== value.id,
      )
      const downloadFileId = selectedDownloadFileId.filter(
        (item) => item !== value.id,
      )
      setSelectedDownloadFile(downloadFileData)
      setSelectedDownloadFileId(downloadFileId)
    },
    [selectedDownloadFile, selectedDownloadFileId],
  )

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectedFeaturedImageId(data.id)
    setSelectedFeaturedImageUrl(data.url)
    setOpenDialog(false)
    toast({ variant: "success", description: t("featured_image_selected") })
  }

  const handleDeleteFeaturedImage = () => {
    setSelectedFeaturedImageId("")
    setSelectedFeaturedImageUrl("")
    toast({
      variant: "success",
      description: t("featured_image_deleted"),
    })
  }

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      language: language,
      downloadTranslationId: downloadTranslationId,
    },
  })

  const valueLanguage = form.watch("language") as LanguageType | undefined

  const { mutate: translateDownloadAction } =
    api.download.translate.useMutation({
      onSuccess: () => {
        form.reset()
        setClearContent((prev) => !prev)
        setSelectedTopics([])
        setSelectedFeaturedImageUrl("")
        toast({
          variant: "success",
          description: ts("translate_success"),
        })
        router.push("/dashboard/download")
      },
      onError: (error) => {
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

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    const mergedValues = {
      ...values,
      featuredImageId: selectedFeaturedImageId,
      downloadFiles: selectedDownloadFileId,
      authors: authors,
    }
    translateDownloadAction(mergedValues)
    setLoading(false)
  }

  return (
    <div className="flex w-full flex-col">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className="space-y-4"
        >
          <div className="sticky top-0 z-20 w-full">
            <div className="flex items-center justify-between bg-background px-3 py-5">
              <Button aria-label="Back To Downloads" variant="ghost">
                <NextLink
                  className="flex items-center"
                  aria-label="Back To Downloads"
                  href="/dashboard/download"
                >
                  <Icon.ChevronLeft aria-label={t("downloads")} />
                  {t("downloads")}
                </NextLink>
              </Button>
              <div>
                <Button
                  aria-label={t("save_as_draft")}
                  type="submit"
                  onClick={() => {
                    form.setValue("status", "draft")
                    form.handleSubmit(onSubmit)()
                  }}
                  variant="ghost"
                  loading={loading}
                >
                  {t("save_as_draft")}
                </Button>
                <Button
                  aria-label={t("publish")}
                  type="submit"
                  onClick={() => {
                    form.setValue("status", "published")
                    form.handleSubmit(onSubmit)()
                  }}
                  variant="ghost"
                  loading={loading}
                >
                  {t("publish")}
                </Button>
                <Button
                  type="button"
                  aria-label="View Sidebar"
                  variant="ghost"
                  onClick={onToggleSidebar}
                >
                  <Icon.ViewSidebar />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex min-h-screen flex-row flex-wrap">
            <div className="order-1 w-full md:px-56 lg:w-10/12">
              <div className="relative mt-4 flex items-center justify-center">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{
                      required: t("title_required"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            onInput={(event) => {
                              const textarea = event.currentTarget
                              const currentFocus = document.activeElement
                              const totalHeight =
                                textarea.scrollHeight -
                                parseInt(
                                  getComputedStyle(textarea).paddingTop,
                                ) -
                                parseInt(
                                  getComputedStyle(textarea).paddingBottom,
                                )
                              textarea.style.height = totalHeight + "px"
                              if (textarea.value === "") {
                                textarea.style.height = "40px"
                                textarea.focus()
                              }
                              if (currentFocus === textarea) {
                                textarea.focus()
                              }
                            }}
                            variant="plain"
                            className="h-10 resize-none overflow-hidden text-[40px] font-bold leading-10"
                            placeholder={t("title_placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormControl>
                    <React.Suspense>
                      <TextEditorExtended
                        control={form.control}
                        name="content"
                        isClear={clearContent}
                      />
                    </React.Suspense>
                  </FormControl>
                </div>
              </div>
            </div>
            <div
              className={`${
                isOpenSidebar == false
                  ? "hidden"
                  : "relative z-20 mt-16 flex flex-row overflow-x-auto bg-background py-4 pt-14 opacity-100"
              } `}
            >
              <div className="fixed bottom-[95px] right-0 top-[90px]">
                {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                <div className="scrollbar-hide h-[calc(100vh-180px)] max-w-[300px] overflow-y-auto rounded border py-4 max-sm:max-w-full lg:w-[400px] lg:max-w-[400px]">
                  <div className="flex flex-col bg-background p-2">
                    <div className="my-2 flex flex-col space-y-4 px-4">
                      <FormField
                        control={form.control}
                        name="language"
                        rules={{
                          required: t("language_required"),
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("language")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("language_placeholder")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="id">Indonesia</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("excerpt")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("excerpt_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {valueLanguage && (
                        <div className="my-2 max-w-xl">
                          <DashboardAddTopics
                            locale={valueLanguage}
                            fieldName="topics"
                            control={form.control}
                            topics={topics}
                            addTopics={setTopics}
                            selectedTopics={selectedTopics}
                            addSelectedTopics={setSelectedTopics}
                            topicType="download"
                          />
                        </div>
                      )}
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
                      <FormField
                        control={form.control}
                        name="type"
                        rules={{
                          required: t("type_required"),
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("type")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("type_placeholder")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="app">App</SelectItem>
                                <SelectItem value="game">Game</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DashboardAddAuthors
                        authors={authors}
                        addAuthors={setAuthors}
                        selectedAuthors={selectedAuthors}
                        addSelectedAuthors={setSelectedAuthors}
                      />
                      <FormField
                        control={form.control}
                        name="developer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("developer")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("developer_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="operatingSystem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("operating_system")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("operating_system_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="license"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("license")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("license_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="officialWebsite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("official_website")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("official_website_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("currency")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("currency_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("price")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("price_placeholder")}
                                defaultValue="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="schemaType"
                        rules={{
                          required: ts("schema_type_required"),
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ts("schema_type")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={ts("schema_type_placeholder")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="DownloadApp">
                                  Download
                                </SelectItem>
                                <SelectItem value="BusinessApp">
                                  Business
                                </SelectItem>
                                <SelectItem value="MultimediaApp">
                                  Multimedia
                                </SelectItem>
                                <SelectItem value="MobileApp">
                                  Mobile
                                </SelectItem>
                                <SelectItem value="WebApp">Web</SelectItem>
                                <SelectItem value="SocialNetworkingApp">
                                  Social
                                </SelectItem>
                                <SelectItem value="TravelApp">
                                  Travel
                                </SelectItem>
                                <SelectItem value="ShoppingApp">
                                  Shopping
                                </SelectItem>
                                <SelectItem value="SportsApp">
                                  Sports
                                </SelectItem>
                                <SelectItem value="LifeStyleApp">
                                  Lifestyle
                                </SelectItem>
                                <SelectItem value="DesignApp">
                                  Design
                                </SelectItem>
                                <SelectItem value="DeveloperApp">
                                  Developer
                                </SelectItem>
                                <SelectItem value="DriverApp">
                                  Driver
                                </SelectItem>
                                <SelectItem value="EducationalApp">
                                  Education
                                </SelectItem>
                                <SelectItem value="HealthApp">
                                  Health
                                </SelectItem>
                                <SelectItem value="FinanceApp">
                                  Finance
                                </SelectItem>
                                <SelectItem value="SecurityApp">
                                  Security
                                </SelectItem>
                                <SelectItem value="BrowserApp">
                                  Browser
                                </SelectItem>
                                <SelectItem value="CommunicationApp">
                                  Communication
                                </SelectItem>
                                <SelectItem value="HomeApp">Home</SelectItem>
                                <SelectItem value="UtilitiesApp">
                                  Utilities
                                </SelectItem>
                                <SelectItem value="RefereceApp">
                                  Referece
                                </SelectItem>
                                <SelectItem value="GameApp">Game</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="rounded-lg bg-muted p-3 lg:p-5">
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
                            className="border-none p-0"
                            onClick={() => setShowMetaData(!showMetaData)}
                          >
                            {showMetaData ? (
                              <Icon.Close />
                            ) : (
                              <Icon.ChevronDown />
                            )}
                          </Button>
                        </div>
                        <div
                          className={showMetaData ? "flex flex-col" : "hidden"}
                        >
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
                                    placeholder={t(
                                      "meta_description_placeholder",
                                    )}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
      <div className="border-t p-4">
        <div className="flex justify-between pb-2">
          <h2>{t("download_files")}</h2>
          <Dialog
            open={openDialogDownloadFile}
            onOpenChange={setOpenDialogDownloadFile}
          >
            <DialogTrigger asChild aria-label={ts("add_file")}>
              <Button>{ts("add_file")}</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl">
              <div className="overflow-y-auto">
                <div className="space-y-5 px-4">
                  <DialogTitle>{ts("add_file")}</DialogTitle>
                  <DashboardAddDownloadFiles
                    updateDownloadFiles={(data) => {
                      handleUpdateDownloadFile(data)
                    }}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {selectedDownloadFile && selectedDownloadFile.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead>{t("version")}</TableHead>
                  <TableHead>{t("file_size")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDownloadFile.map(
                  (downloadFile: SelectedDownloadFilesProps) => (
                    <TableRow key={downloadFile.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex">
                          <span className="font-medium">
                            {downloadFile.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex">
                          <span className="font-medium">
                            {downloadFile.version}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{downloadFile.fileSize}</TableCell>
                      <TableCell align="right">
                        <DashboardShowOptions
                          onDelete={() => {
                            void handleDeleteDownloadFile(downloadFile)
                          }}
                          editUrl={`/dashboard/download/file/edit/${downloadFile.id}`}
                          description={downloadFile.title}
                        />
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}

export default TranslateDownloadForm
