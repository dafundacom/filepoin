// TODO: translate

import * as React from "react"
import type { Metadata } from "next"

import DownloadDropdownTopics from "@/components/download/download-dropdown-topics"
import DownloadList from "@/components/download/download-list"
import DownloadListCategories from "@/components/download/download-list-categories"
import DownloadSearch from "@/components/download/download-search"
import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const Ad = React.lazy(() => import("@/components/ad"))

const InfiniteScrollDownload = React.lazy(
  () => import("@/components/download/infinite-scroll-download"),
)

export function generateMetadata({
  params,
}: {
  params: { slug: string; locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Download App",
    description: `${env.NEXT_PUBLIC_SITE_TITLE} Download App`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/download/app/`,
    },
    openGraph: {
      title: "Download App",
      description: `${env.NEXT_PUBLIC_SITE_TITLE} Download App`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/download/app/`,
      locale: locale,
    },
  }
}

export default async function DownloadAppPage({
  params,
}: {
  params: { locale: LanguageType }
}) {
  const { locale } = params

  const apps = await api.download.byType({
    language: locale,
    type: "app",
    page: 1,
    perPage: 10,
  })
  const topics = await api.topic.byType({
    language: locale,
    type: "download",
    page: 1,
    perPage: 10,
  })
  const adsBelowHeader = await api.ad.byPosition("download_below_header")

  return (
    <>
      {adsBelowHeader &&
        adsBelowHeader.length > 0 &&
        adsBelowHeader.map((ad) => {
          return <Ad ad={ad} key={ad.id} />
        })}
      <div className="fade-up-element mx-auto flex w-full flex-col max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
        <div className="flex flex-col space-y-8 rounded-md bg-muted/10 p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex space-x-2">
              <DownloadDropdownTopics topics={topics!} title="Categories" />
            </div>
            <div>
              <DownloadSearch />
            </div>
          </div>
          <div>
            <div className="mb-2">
              <h2>Pilih Kategori</h2>
            </div>
            {topics && <DownloadListCategories categories={topics} />}
          </div>
        </div>
        <div className="w-full px-4">
          <div className={"my-2 flex flex-row justify-start"}>
            <h2>Apps</h2>
          </div>
          <DownloadList downloads={apps!} />
        </div>
        <div className="w-full px-4">
          <div className={"my-2 flex flex-row justify-start"}>
            <h2>Newest</h2>
          </div>
          <InfiniteScrollDownload locale={locale} type="app" />
        </div>
      </div>
    </>
  )
}
