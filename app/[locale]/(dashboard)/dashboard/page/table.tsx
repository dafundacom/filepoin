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
import type { SelectPage } from "@/lib/db/schema/page"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"

interface PagesProps extends SelectPage {
  pageTranslation: {
    pages: Partial<SelectPage>[]
  }
}

interface PageTableProps {
  pages: PagesProps[]
  paramsName: string
  page: number
  lastPage: number
  updatePages: () => void
  updatePagesCount: () => void
}

export default function PageTable(props: PageTableProps) {
  const { pages, paramsName, page, lastPage, updatePages, updatePagesCount } =
    props

  const t = useI18n()
  const ts = useScopedI18n("page")

  const { mutate: deletePage } = api.page.delete.useMutation({
    onSuccess: () => {
      updatePages()
      updatePagesCount()
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
          {pages.length > 0 &&
            pages.map((page) => {
              return (
                <TableRow key={page.id}>
                  <TableCell className="max-w-[120px] align-middle">
                    <div className="flex flex-col">
                      <span className="line-clamp-3 font-medium">
                        {page.title}
                      </span>
                      <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                        <span>{page.slug}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <span className="overflow-hidden text-ellipsis font-medium">
                        {page.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      <DashboardStatusBadge status={page.status}>
                        {page.status}
                      </DashboardStatusBadge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      {formatDate(page.createdAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                    <div className="flex">
                      {formatDate(page.updatedAt, "LL")}
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    {page.pageTranslation.pages.length > 1 ? (
                      <DashboardShowOptions
                        onDelete={() => {
                          void deletePage(page.id)
                        }}
                        editUrl={`/dashboard/page/edit/${page.id}`}
                        viewUrl={`/p/${page.slug}`}
                        description={page.title}
                      />
                    ) : (
                      <DashboardShowOptions
                        onDelete={() => {
                          void deletePage(page.id)
                        }}
                        editUrl={`/dashboard/page/edit/${page.id}`}
                        translateUrl={
                          page.language === "id"
                            ? `/dashboard/page/translate/en/${page.pageTranslationId}`
                            : `/dashboard/page/translate/id/${page.pageTranslationId}`
                        }
                        viewUrl={`/p/${page.slug}`}
                        description={page.title}
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
