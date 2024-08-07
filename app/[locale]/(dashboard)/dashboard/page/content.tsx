"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { Icon } from "@/components/ui/icon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardPageHeader from "./header"
import PageTable from "./table"

export default function DashboardPageContent() {
  const searchParams = useSearchParams()

  const pageLangIdPage = searchParams.get("pageLangIdPage")
  const pageLangEnPage = searchParams.get("pageLangEnPage")

  const ts = useScopedI18n("page")

  const { data: pagesCountLangId, refetch: updatePagesCountLangId } =
    api.page.countByLanguage.useQuery("id")
  const { data: pagesCountLangEn, refetch: updatePagesCountLangEn } =
    api.page.countByLanguage.useQuery("en")

  const perPage = 10

  const pageLangIdLastPage =
    pagesCountLangId && Math.ceil(pagesCountLangId / perPage)
  const pageLangEnLastPage =
    pagesCountLangEn && Math.ceil(pagesCountLangEn / perPage)

  const {
    data: pagesLangId,
    isLoading: pagesLangIdIsLoading,
    refetch: updatePagesLangId,
  } = api.page.dashboard.useQuery({
    language: "id",
    page: pageLangIdPage ? parseInt(pageLangIdPage) : 1,
    perPage: perPage,
  })

  const {
    data: pagesLangEn,
    isLoading: pagesLangEnIsLoading,
    refetch: updatePagesLangEn,
  } = api.page.dashboard.useQuery({
    language: "en",
    page: pageLangEnPage ? parseInt(pageLangEnPage) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (
      pageLangIdLastPage &&
      pageLangIdPage &&
      parseInt(pageLangIdPage) !== 1 &&
      parseInt(pageLangIdPage) > pageLangIdLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${pageLangIdLastPage.toString()}`,
      )
    }
  }, [pageLangIdLastPage, pageLangIdPage])

  React.useEffect(() => {
    if (
      pageLangEnLastPage &&
      pageLangEnPage &&
      parseInt(pageLangEnPage) !== 1 &&
      parseInt(pageLangEnPage) > pageLangEnLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${pageLangEnLastPage.toString()}`,
      )
    }
  }, [pageLangEnLastPage, pageLangEnPage])

  return (
    <>
      <DashboardPageHeader />
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
          {!pagesLangIdIsLoading &&
          pagesLangId !== undefined &&
          pagesLangId.length > 0 ? (
            <PageTable
              pages={pagesLangId}
              paramsName="pageLangIdPage"
              page={pageLangIdPage ? parseInt(pageLangIdPage) : 1}
              lastPage={pageLangIdLastPage ?? 2}
              updatePages={updatePagesLangId}
              updatePagesCount={updatePagesCountLangId}
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
          {!pagesLangEnIsLoading &&
          pagesLangEn !== undefined &&
          pagesLangEn.length > 0 ? (
            <PageTable
              pages={pagesLangEn}
              paramsName="pageLangEnPage"
              page={pageLangEnPage ? parseInt(pageLangEnPage) : 1}
              lastPage={pageLangEnLastPage ?? 3}
              updatePages={updatePagesLangEn}
              updatePagesCount={updatePagesCountLangEn}
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
