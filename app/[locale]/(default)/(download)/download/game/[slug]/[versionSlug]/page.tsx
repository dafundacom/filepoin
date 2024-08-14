// TODO: translate

import * as React from "react"
import type { Metadata } from "next"
import { notFound, redirect, RedirectType } from "next/navigation"
import { ArticleJsonLd, BreadcrumbJsonLd, SoftwareAppJsonLd } from "next-seo"

import DownloadButtonAction from "@/components/download/download-button-action"
import DownloadCardSide from "@/components/download/download-card-side"
import DownloadList from "@/components/download/download-list"
import Image from "@/components/image"
import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const Ad = React.lazy(() => import("@/components/ad"))

export async function generateMetadata({
  params,
}: {
  params: { slug: string; versionSlug: string; locale: LanguageType }
}): Promise<Metadata> {
  const { locale, slug, versionSlug } = params

  const download = await api.download.bySlug({
    slug: slug,
    downloadFilePage: 1,
    downloadFilePerPage: 10,
  })

  const downloadFile = await api.downloadFile.byDownloadIdAndVersionSlug({
    downloadId: download?.id!,
    versionSlug: versionSlug,
  })

  return {
    title: `Download ${download?.metaTitle ?? download?.title} ${downloadFile?.version} untuk ${download?.operatingSystem}`,
    description: download?.metaDescription ?? download.excerpt,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/download/game/${download?.slug}/${downloadFile?.versionSlug}`,
    },
    openGraph: {
      title: `Download ${download?.metaTitle ?? download?.title} ${downloadFile?.version} untuk ${download?.operatingSystem}`,
      description: download?.metaDescription ?? download?.excerpt,
      url: `${env.NEXT_PUBLIC_SITE_URL}/download/game/${download?.slug}/${downloadFile?.versionSlug}`,
      images: [
        {
          url: download?.featuredImage.url!,
          width: 1280,
          height: 720,
        },
      ],
      locale: locale,
    },
    twitter: {
      title: env.NEXT_PUBLIC_X_USERNAME,
      card: "summary_large_image",
      images: [
        {
          url: download?.featuredImage.url!,
          width: 1280,
          height: 720,
        },
      ],
    },
  }
}

interface SingleDownloadFileGamePageProps {
  params: {
    locale: LanguageType
    slug: string
    versionSlug: string
  }
}

export default async function SingleDownloadFileGamePage({
  params,
}: SingleDownloadFileGamePageProps) {
  const { slug, locale, versionSlug } = params
  const downloads = await api.download.byType({
    language: locale,
    type: "game",
    page: 1,
    perPage: 10,
  })
  const download = await api.download.bySlug({
    slug: slug,
    downloadFilePage: 1,
    downloadFilePerPage: 10,
  })

  const downloadFile = await api.downloadFile.byDownloadIdAndVersionSlug({
    downloadId: download?.id!,
    versionSlug: versionSlug,
  })

  const adsDownloadingPage = await api.ad.byPosition("downloading_page")

  const language = download?.language

  if (!download) {
    notFound()
  }

  if (!downloadFile) {
    notFound()
  }

  const downloadTranslation = await api.download.downloadTranslationById(
    download.downloadTranslationId,
  )

  const otherLanguageDownload = downloadTranslation?.downloads?.find(
    (download) => download.language !== language,
  )

  const otherDownloadFilesLanguage = otherLanguageDownload?.downloadFiles.find(
    (downloadFile) => downloadFile.versionSlug === versionSlug,
  )

  if (language !== locale) {
    if (otherLanguageDownload && otherDownloadFilesLanguage)
      redirect(
        `/download/game/${otherLanguageDownload.slug}/${otherDownloadFilesLanguage.versionSlug}`,
        RedirectType.replace,
      )
    else notFound()
  }

  return (
    <>
      <ArticleJsonLd
        useAppDir={true}
        url={`${env.NEXT_PUBLIC_SITE_URL}/download/game/${download.slug}/${downloadFile?.version}`}
        title={download.metaTitle ?? download.title}
        images={[download?.featuredImage?.url!]}
        datePublished={download.createdAt as unknown as string}
        dateModified={download.createdAt as unknown as string}
        authorName={[
          {
            name: env.NEXT_PUBLIC_SITE_TITLE,
            url: env.NEXT_PUBLIC_SITE_URL,
          },
        ]}
        publisherName={env.NEXT_PUBLIC_SITE_TITLE}
        publisherLogo={env.NEXT_PUBLIC_LOGO_URL}
        description={download.metaDescription ?? download.excerpt}
        isAccessibleForFree={true}
      />
      <SoftwareAppJsonLd
        useAppDir={true}
        name={download.metaTitle ?? download.title}
        price={download.price}
        priceCurrency={download.currency}
        aggregateRating={{ ratingValue: "4.9", reviewCount: "5" }}
        operatingSystem={download.operatingSystem}
        applicationCategory={download.schemaType}
      />
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
            item: env.NEXT_PUBLIC_SITE_URL,
          },
          {
            position: 2,
            name: "Download",
            item: `${env.NEXT_PUBLIC_SITE_URL}/download`,
          },
        ]}
      />
      <section className="fade-up-element flex w-full flex-col pt-5">
        <div className="mx-auto flex w-full flex-row max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
          <div className="flex w-full flex-col overflow-x-hidden px-4 lg:mr-4">
            <div
              className={"my-5 flex flex-col space-x-2 space-y-2 lg:flex-row"}
            >
              <div className="w-full space-y-4">
                <div
                  id="download"
                  className="rounded-xl bg-background p-7 shadow-md"
                >
                  <div className={"flex flex-col"}>
                    <div className="flex w-full space-x-6">
                      <div className={"w-2/12"}>
                        <div className="relative h-[100px] w-full">
                          <Image
                            fill
                            src={download?.featuredImage?.url!}
                            alt={download?.title as string}
                            className="rounded-lg"
                            sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                            quality={60}
                          />
                        </div>
                      </div>
                      <div className={"w-10/12 space-y-1"}>
                        <h2 className="line-clamp-1 text-xl md:text-3xl">
                          {download?.title}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          <p>{downloadFile?.version}</p>
                        </div>

                        <p>{download?.developer}</p>
                      </div>
                    </div>
                    <div className={"inline-flex w-full space-x-2 pt-12"}>
                      <DownloadButtonAction
                        downloadLink={downloadFile?.downloadLink}
                        fileSize={downloadFile?.fileSize}
                      />
                    </div>
                    {adsDownloadingPage &&
                      adsDownloadingPage.length > 0 &&
                      adsDownloadingPage.map((ad) => {
                        return <Ad ad={ad} key={ad.id} />
                      })}
                  </div>
                </div>
                <div className="w-full px-4">
                  <div className={"my-2 flex flex-row justify-start"}>
                    <h2>Related</h2>
                  </div>
                  <DownloadList downloads={downloads!} />
                </div>
              </div>
            </div>
          </div>
          <aside className="hidden w-4/12 px-4 lg:block">
            <div className="sticky top-8 rounded-xl border border-border p-4">
              <div className="mb-4">
                <h4 className="text-transparent">
                  <span className="after:absolute after:left-1/2 after:top-[40px] after:ml-[-25px] after:h-[3px] after:w-[50px] after:border">
                    Trending
                  </span>
                </h4>
              </div>
              {downloads?.map((download) => {
                return (
                  <DownloadCardSide
                    key={download.id}
                    src={download.featuredImage?.url!}
                    title={download.title}
                    slug={`/download/${download.type}/${download.slug}`}
                  />
                )
              })}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
