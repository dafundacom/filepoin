import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import NextLink from "next/link"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import DownloadCard from "@/components/download/download-card"
import DownloadList from "@/components/download/download-list"
import env from "@/env.mjs"
import { getI18n } from "@/lib/locales/server"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const Ad = dynamicFn(
  async () => {
    const Ad = await import("@/components/ad")
    return Ad
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Promise<Metadata> {
  const { locale } = params

  const data = await api.setting.byKey("settings")

  let settings

  if (data) {
    const parsedData = JSON.parse(data.value)
    settings = { ...parsedData }
  }

  return {
    title: {
      absolute: `${settings?.site_title ?? env.NEXT_PUBLIC_SITE_TITLE} | ${
        settings?.site_tagline ?? env.NEXT_PUBLIC_SITE_TAGLINE
      }`,
    },
    description: settings?.site_description ?? env.NEXT_PUBLIC_SITE_DESCRIPTION,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/`,
    },
    openGraph: {
      title: `${
        settings?.site_title ?? env.NEXT_PUBLIC_SITE_TITLE
      } | ${settings?.site_tagline}`,
      description:
        settings?.site_description ?? env.NEXT_PUBLIC_SITE_DESCRIPTION,
      url: `${env.NEXT_PUBLIC_SITE_URL}/`,
      locale: locale,
    },
  }
}

export default async function Home({
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

  const adsBelowHeader = await api.ad.byPosition("home_below_header")

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
            item: env.NEXT_PUBLIC_SITE_URL,
          },
        ]}
      />
      <SiteLinksSearchBoxJsonLd
        useAppDir={true}
        url={env.NEXT_PUBLIC_SITE_URL}
        potentialActions={[
          {
            target: `${env.NEXT_PUBLIC_SITE_URL}/search?q`,
            queryInput: "search_term_string",
          },
        ]}
      />
      <section className="fade-up-element">
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        <div className="mx-auto flex w-full flex-col max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
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
      </section>
    </>
  )
}
