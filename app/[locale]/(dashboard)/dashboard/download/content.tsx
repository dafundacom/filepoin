"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { Icon } from "@/components/ui/icon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardDownloadHeader from "./header"
import DownloadTable from "./table"

export default function DashboardDownloadContent() {
  const searchParams = useSearchParams()

  const downloadLangIdPage = searchParams.get("downloadLangIdPage")
  const downloadLangEnPage = searchParams.get("downloadLangEnPage")

  const ts = useScopedI18n("download")

  const { data: downloadsCountLangId, refetch: updateDownloadsCountLangId } =
    api.download.countByLanguage.useQuery("id")
  const { data: downloadsCountLangEn, refetch: updateDownloadsCountLangEn } =
    api.download.countByLanguage.useQuery("en")

  const perPage = 10

  const downloadLangIdLastPage =
    downloadsCountLangId && Math.ceil(downloadsCountLangId / perPage)
  const downloadLangEnLastPage =
    downloadsCountLangEn && Math.ceil(downloadsCountLangEn / perPage)

  const {
    data: downloadsLangId,
    isLoading: downloadsLangIdIsLoading,
    refetch: updateDownloadsLangId,
  } = api.download.dashboard.useQuery({
    language: "id",
    page: downloadLangIdPage ? parseInt(downloadLangIdPage) : 1,
    perPage: perPage,
  })

  const {
    data: downloadsLangEn,
    isLoading: downloadsLangEnIsLoading,
    refetch: updateDownloadsLangEn,
  } = api.download.dashboard.useQuery({
    language: "en",
    page: downloadLangEnPage ? parseInt(downloadLangEnPage) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (
      downloadLangIdLastPage &&
      downloadLangIdPage &&
      parseInt(downloadLangIdPage) !== 1 &&
      parseInt(downloadLangIdPage) > downloadLangIdLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${downloadLangIdLastPage.toString()}`,
      )
    }
  }, [downloadLangIdLastPage, downloadLangIdPage])

  React.useEffect(() => {
    if (
      downloadLangEnLastPage &&
      downloadLangEnPage &&
      parseInt(downloadLangEnPage) !== 1 &&
      parseInt(downloadLangEnPage) > downloadLangEnLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${downloadLangEnLastPage.toString()}`,
      )
    }
  }, [downloadLangEnLastPage, downloadLangEnPage])

  return (
    <>
      <DashboardDownloadHeader />
      {/* TODO: assign tab to link params */}
      <Tabs defaultValue="id">
        <TabsList>
          <TabsTrigger value="id">
            <Icon.IndonesiaFlag className="mr-2 size-4" />
            Indonesia
          </TabsTrigger>
          <TabsTrigger value="en">
            <Icon.USAFlag className="mr-2 size-4" />
            English
          </TabsTrigger>
        </TabsList>
        <TabsContent value="id">
          {!downloadsLangIdIsLoading &&
          downloadsLangId !== undefined &&
          downloadsLangId.length > 0 ? (
            <DownloadTable
              downloads={downloadsLangId}
              paramsName="downloadLangIdPage"
              page={downloadLangIdPage ? parseInt(downloadLangIdPage) : 1}
              lastPage={downloadLangIdLastPage ?? 2}
              updateDownloads={updateDownloadsLangId}
              updateDownloadsCount={updateDownloadsCountLangId}
            />
          ) : (
            <div className="my-64 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          )}
        </TabsContent>
        <TabsContent value="en">
          {!downloadsLangEnIsLoading &&
          downloadsLangEn !== undefined &&
          downloadsLangEn.length > 0 ? (
            <DownloadTable
              downloads={downloadsLangEn}
              paramsName="downloadLangEnPage"
              page={downloadLangEnPage ? parseInt(downloadLangEnPage) : 1}
              lastPage={downloadLangEnLastPage ?? 3}
              updateDownloads={updateDownloadsLangEn}
              updateDownloadsCount={updateDownloadsCountLangEn}
            />
          ) : (
            <div className="my-64 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
