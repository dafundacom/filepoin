import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"

import DownloadCard from "@/components/download/download-card"
import DownloadDropdownTopics from "@/components/download/download-dropdown-topics"
import DownloadList from "@/components/download/download-list"
import DownloadSearch from "@/components/download/download-search"
import env from "@/env.mjs"
import { getI18n } from "@/lib/locales/server"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const Ad = React.lazy(() => import("@/components/ad"))

export function generateMetadata({
  params,
}: {
  params: { slug: string; locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Download",
    description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/download/`,
    },
    openGraph: {
      title: "Download",
      description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
      url: `${env.NEXT_PUBLIC_SITE_URL}/download/`,
      locale: locale,
    },
  }
}

export default async function ShopDashboardPage({
  params,
}: {
  params: { locale: LanguageType }
}) {
  const { locale } = params

  const t = await getI18n()

  const downloads = await api.download.byLanguage({
    language: locale,
    page: 1,
    perPage: 10,
  })
  const apps = await api.download.byType({
    language: locale,
    type: "app",
    page: 1,
    perPage: 10,
  })
  const games = await api.download.byType({
    language: locale,
    type: "game",
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
        <div className="flex flex-col rounded-md bg-muted/10 p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex space-x-2">
              <DownloadDropdownTopics topics={topics!} title="Categories" />
            </div>
            <div>
              <DownloadSearch />
            </div>
          </div>
        </div>

        <div className="w-full px-4">
          <div className={"my-2 flex flex-row justify-between"}>
            <h2>Games</h2>
            <NextLink aria-label="See More Download" href="/download/game/">
              <p className="text-sm text-primary">{t("see_more")}</p>
            </NextLink>
          </div>
          <DownloadList downloads={games!} />
        </div>
        <div className="w-full px-4">
          <div className={"my-2 flex flex-row justify-between"}>
            <h2>Apps</h2>
            <NextLink aria-label="See More Download" href="/download/app/">
              <p className="text-sm text-primary">{t("see_more")}</p>
            </NextLink>
          </div>
          <DownloadList downloads={apps!} />
        </div>
        <div className="w-full px-4">
          <div className={"my-2 flex flex-row justify-start"}>
            <h2>Newest</h2>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {downloads?.map((download) => {
              return <DownloadCard download={download} key={download.id} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}
