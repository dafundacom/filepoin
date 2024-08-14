import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import DashboardStatusBadge from "@/components/dashboard/dashboard-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectDownload, SelectMedia } from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"

interface DownloadsProps extends SelectDownload {
  downloadTranslation: {
    downloads: Partial<SelectDownload>[]
  }
  featuredImage: Partial<SelectMedia>
}

interface DownloadTableProps {
  downloads: DownloadsProps[]
  paramsName: string
  page: number
  lastPage: number
  updateDownloads: () => void
  updateDownloadsCount: () => void
}

export default function DownloadTable(props: DownloadTableProps) {
  const {
    downloads,
    paramsName,
    page,
    lastPage,
    updateDownloads,
    updateDownloadsCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("download")

  const { mutate: deleteDownload } = api.download.deleteByAdmin.useMutation({
    onSuccess: () => {
      updateDownloads()
      updateDownloadsCount()
      toast({ variant: "success", description: ts("delete_success") })
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
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <div className="relative w-full overflow-auto">
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("slug")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Status
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("published_date")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("last_modified")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {downloads.length > 0 &&
            downloads.map((download) => {
              return (
                <TableRow key={download.id}>
                  <TableCell className="max-w-[120px] align-middle">
                    <div className="flex flex-col">
                      <span className="line-clamp-3 font-medium">
                        {download.title}
                      </span>
                      <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                        <span>{download.slug}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <span className="overflow-hidden text-ellipsis font-medium">
                        {download.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <DashboardStatusBadge status={download.status}>
                        {download.status}
                      </DashboardStatusBadge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      {formatDate(download.createdAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      {formatDate(download.updatedAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    {download.downloadTranslation.downloads.length > 1 ? (
                      <DashboardShowOptions
                        onDelete={() => {
                          void deleteDownload(download.id)
                        }}
                        editUrl={`/dashboard/download/edit/${download.id}`}
                        viewUrl={`/download/${download.type}/${download.slug}`}
                        description={download.title}
                      />
                    ) : (
                      <DashboardShowOptions
                        onDelete={() => {
                          void deleteDownload(download.id)
                        }}
                        editUrl={`/dashboard/download/edit/${download.id}`}
                        translateUrl={
                          download.language === "id"
                            ? `/dashboard/download/translate/en/${download.downloadTranslationId}`
                            : `/dashboard/download/translate/id/${download.downloadTranslationId}`
                        }
                        viewUrl={`/download/${download.type}/${download.slug}`}
                        description={download.title}
                      />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
      {lastPage ? (
        <DashboardPagination
          currentPage={page}
          lastPage={lastPage ?? 1}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
