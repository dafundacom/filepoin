import * as React from "react"
import { useForm } from "react-hook-form"

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
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  title: string
  version: string
  downloadLink: string
  fileSize: string
}

export type SelectedDownloadFilesProps = Pick<
  FormValues,
  "title" | "version" | "fileSize"
> & { id: string }

interface DashboardAddDownloadFilesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  updateDownloadFiles: (_data: SelectedDownloadFilesProps[]) => void
}

const DashboardAddDownloadFiles: React.FunctionComponent<
  DashboardAddDownloadFilesProps
> = (props) => {
  const { updateDownloadFiles } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("download")

  const form = useForm<FormValues>()

  const { mutate: createDownloadFileAction } =
    api.downloadFile.create.useMutation({
      onSuccess: (data) => {
        if (data) {
          updateDownloadFiles(data)
          toast({
            variant: "success",
            description: ts("file_create_success"),
          })
          form.reset()
        }
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
            description: ts("file_create_failed"),
          })
        }
      },
    })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    createDownloadFileAction(values)
    setLoading(false)
  }

  return (
    <div className="flex-1 space-y-4">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex max-w-2xl flex-col space-y-4">
            <FormField
              control={form.control}
              name="title"
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
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("version")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("version_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="downloadLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("download_link")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={ts("download_link_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("file_size")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("file_size_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              aria-label={t("submit")}
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              loading={loading}
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default DashboardAddDownloadFiles
