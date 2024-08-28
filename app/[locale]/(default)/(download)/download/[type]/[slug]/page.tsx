import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound, redirect, RedirectType } from "next/navigation"
import { ArticleJsonLd, BreadcrumbJsonLd, SoftwareAppJsonLd } from "next-seo"

import DownloadCardSide from "@/components/download/download-card-side"
import DownloadDetailBox from "@/components/download/download-detail-box"
import DownloadList from "@/components/download/download-list"
import Image from "@/components/image"
import TransformContent from "@/components/transform-content"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import { formatDate, splitReactNodes } from "@/lib/utils"
import type { DownloadType } from "@/lib/validation/download"
import type { LanguageType } from "@/lib/validation/language"

const Ad = React.lazy(() => import("@/components/ad"))

export async function generateMetadata({
  params,
}: {
  params: { type: DownloadType; slug: string; locale: LanguageType }
}): Promise<Metadata> {
  const { locale, type, slug } = params

  const download = await api.download.bySlug(slug)

  return {
    title: `Download ${download?.metaTitle ?? download?.title} untuk ${download?.operatingSystem} Versi Terbaru`,
    description: download?.metaDescription ?? download?.excerpt,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/download/${type}/${slug}`,
    },
    openGraph: {
      title: `Download ${download?.metaTitle ?? download?.title} untuk ${download?.operatingSystem} Versi Terbaru`,
      description: download?.metaDescription ?? download?.excerpt,
      url: `${env.NEXT_PUBLIC_SITE_URL}/download/${type}/${slug}`,
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

interface SingleDownloadAppPageProps {
  params: {
    locale: LanguageType
    type: DownloadType
    slug: string
  }
}

export default async function SigleDownloadAppPage({
  params,
}: SingleDownloadAppPageProps) {
  const { type, slug, locale } = params

  const downloads = await api.download.byType({
    language: locale,
    type: type,
    page: 1,
    perPage: 10,
  })

  const download = await api.download.bySlug(slug)

  const language = download?.language

  if (!download) {
    notFound()
  }

  const downloadTranslation = await api.download.downloadTranslationById(
    download.downloadTranslationId,
  )

  const otherLanguageDownload = downloadTranslation?.downloads?.find(
    (download) => download.language !== language,
  )

  if (language !== locale) {
    if (otherLanguageDownload)
      redirect(
        `/download/${type}/${otherLanguageDownload.slug}`,
        RedirectType.replace,
      )
    else notFound()
  }

  const relatedDownloads = await api.download.relatedInfinite({
    limit: 10,
    topicId: download?.topics?.[0]?.id ?? "",
    language: locale,
    currentDownloadId: download?.id,
  })

  const adsSingleDownloadAbove = await api.ad.byPosition(
    "single_download_above_content",
  )
  const adsSingleDownloadBelow = await api.ad.byPosition(
    "single_download_below_content",
  )
  const adsSingleDownloadInline = await api.ad.byPosition(
    "single_download_middle_content",
  )

  const downloadFile =
    download && download.downloadFiles.length > 0
      ? download?.downloadFiles[0]
      : undefined

  const parsedContent = TransformContent({
    htmlInput: download?.content!,
    title: download?.title!,
  })

  const { firstContent, secondContent } = splitReactNodes(
    React.Children.toArray(parsedContent),
  )
  return (
    <>
      <ArticleJsonLd
        useAppDir={true}
        url={`${env.NEXT_PUBLIC_SITE_URL}/download/${type}/${download.slug}`}
        title={`Download ${download?.metaTitle ?? download?.title} untuk ${download?.operatingSystem} Versi Terbaru`}
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
          {
            position: 3,
            name: download.type,
            item: `${env.NEXT_PUBLIC_SITE_URL}/download/${download.type}`,
          },
          {
            position: 4,
            name: download.topics?.[0]?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/download/topic/${download?.topics[0]?.slug}`,
          },
          {
            position: 5,
            name: download.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/download/${download.type}/${download.slug}`,
          },
        ]}
      />
      <div className="fade-up-element mx-auto flex w-full flex-row pt-5 md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
        <div className="flex w-full flex-col overflow-x-hidden px-4 lg:mr-4">
          <div className={"my-5 flex flex-col space-x-2 space-y-2 lg:flex-row"}>
            <div className={"w-full space-y-4"}>
              <div className="rounded-xl bg-background p-3 shadow-md lg:p-7">
                <div className={"flex space-x-3 lg:space-x-6"}>
                  <div className={"w-4/12 lg:w-2/12"}>
                    <div className="relative h-[100px] w-full">
                      <Image
                        fill
                        src={download?.featuredImage?.url!}
                        alt={download?.title!}
                        className="rounded-lg object-cover"
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        quality={60}
                      />
                    </div>
                  </div>
                  <div className={"w-8/12 space-y-1 lg:w-10/12"}>
                    <h2 className="line-clamp-1 text-xl md:text-3xl">
                      {download?.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {download && download.downloadFiles.length > 0 && (
                        <>
                          <p>{downloadFile?.version}</p>
                          <NextLink
                            aria-label="Show All Version Page"
                            href={`/download/app/${download.slug}#all-version`}
                            className="text-success"
                          >
                            Show All Version
                          </NextLink>
                        </>
                      )}
                    </div>
                    <p>{download?.developer}</p>
                    <Button type="button" aria-label="Official Web">
                      <a
                        href={download?.officialWebsite}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Official Web
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="article-content space-y-4">
                {adsSingleDownloadAbove &&
                  adsSingleDownloadAbove.length > 0 &&
                  adsSingleDownloadAbove.map((ad) => {
                    return <Ad ad={ad} key={ad.id} />
                  })}
                {firstContent}
                {adsSingleDownloadInline &&
                  adsSingleDownloadInline.length > 0 &&
                  adsSingleDownloadInline.map((ad) => {
                    return <Ad ad={ad} key={ad.id} />
                  })}
                {secondContent}
                {adsSingleDownloadBelow &&
                  adsSingleDownloadBelow.length > 0 &&
                  adsSingleDownloadBelow.map((ad) => {
                    return <Ad ad={ad} key={ad.id} />
                  })}
              </div>
              <div className="grid grid-cols-2 grid-rows-2 rounded-lg bg-background shadow dark:bg-muted/80 md:grid-cols-3">
                {download?.operatingSystem && (
                  <DownloadDetailBox
                    icon={
                      <Icon.Windows
                        className="m-1 size-5"
                        aria-label="Sistem Operasi"
                      />
                    }
                    title="Sistem Operasi"
                    value={download?.operatingSystem}
                  />
                )}
                {download?.developer && (
                  <DownloadDetailBox
                    icon={
                      <Icon.Code
                        className="m-1 size-5"
                        aria-label="Developer"
                      />
                    }
                    title="Developer"
                    value={download?.developer}
                  />
                )}
                {download?.topics?.[0]?.title && (
                  <DownloadDetailBox
                    icon={
                      <Icon.Category
                        className="m-1 size-5"
                        aria-label="Category"
                      />
                    }
                    title="Category"
                    value={download?.topics?.[0]?.title}
                  />
                )}
                {download?.createdAt && (
                  <DownloadDetailBox
                    icon={
                      <Icon.Update
                        className="m-1 size-5"
                        aria-label="Last Update"
                      />
                    }
                    title="Last Update"
                    value={formatDate(
                      download?.createdAt as unknown as string,
                      "LL",
                    )}
                  />
                )}
                {download && download.downloadFiles.length > 0 && (
                  <DownloadDetailBox
                    icon={
                      <Icon.Folder
                        className="m-1 size-5"
                        aria-label="File Size"
                      />
                    }
                    title="File Size"
                    value={downloadFile?.fileSize!}
                  />
                )}
                {download?.license && (
                  <DownloadDetailBox
                    icon={
                      <Icon.VpnKey
                        className="m-1 size-5"
                        aria-label="License"
                      />
                    }
                    title="License"
                    value={download?.license}
                  />
                )}
              </div>
              <div id="all-version" className="mb-5 space-y-2">
                <h2 className="text-xl">All version</h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {download &&
                    download.downloadFiles.length > 0 &&
                    download.downloadFiles.map((downloadFile) => {
                      return (
                        <div
                          className="cursor-pointer rounded-lg bg-foreground/80 p-4 shadow-lg transition-shadow duration-200 ease-in-out hover:shadow-xl"
                          key={downloadFile.id}
                        >
                          <NextLink
                            href={`/download/${type}/${download.slug}/${downloadFile.versionSlug!}`}
                            className="text-background"
                          >
                            <p className="text-lg font-semibold">
                              {downloadFile.version}
                            </p>
                            <p className="text-xl font-bold">
                              {downloadFile.title}
                            </p>
                            <p className="text-sm">{downloadFile.fileSize}</p>
                            <p className="text-xs text-muted/90">
                              {formatDate(downloadFile.createdAt, "LL")}
                            </p>
                          </NextLink>
                        </div>
                      )
                    })}
                </div>
              </div>
              <h2 className="text-xl">{`Download ${download.title}`}</h2>
              <div className="my-12 flex flex-col space-y-2 rounded-xl bg-background p-5 shadow">
                {download &&
                  download.downloadFiles.length > 0 &&
                  download.downloadFiles.map((downloadFile) => {
                    return (
                      <Button
                        asChild
                        aria-label="Download"
                        key={downloadFile.id}
                      >
                        <NextLink
                          aria-label="Download"
                          target="_blank"
                          href={`/download/app/${download.slug}/${downloadFile?.versionSlug}/downloading`}
                        >
                          {`Download ${downloadFile.title} (${downloadFile.fileSize})`}
                        </NextLink>
                      </Button>
                    )
                  })}
              </div>
              {/* <React.Suspense> */}
              {/*   <section className="my-5" id="comment"> */}
              {/*     <div className="mb-5 flex flex-col justify-center"> */}
              {/*       <DownloadComment */}
              {/*         locale={locale} */}
              {/*         download_id={download.id} */}
              {/*       /> */}
              {/*     </div> */}
              {/*   </section> */}
              {/* </React.Suspense> */}
              <div className="w-full px-4">
                <div className="my-2 flex flex-row justify-start">
                  <h2 className="text-xl">Related</h2>
                </div>
                {<DownloadList downloads={relatedDownloads?.downloads!} />}
              </div>
            </div>
          </div>
        </div>
        <aside className="hidden w-4/12 lg:block">
          <div className="sticky top-8 rounded-xl border border-muted/10 p-4">
            <div className="mb-4">
              <h4 className="text-transparent">
                <span className="after:absolute after:left-1/2 after:top-[40px] after:ml-[-25px] after:h-[3px] after:w-[50px] after:border">
                  You may also like
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
    </>
  )
}
