// TODO: translate

import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound, redirect, RedirectType } from "next/navigation"

import DownloadButtonAction from "@/components/download/download-button-action"
import Image from "@/components/image"
import TransformContent from "@/components/transform-content"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { DownloadType } from "@/lib/validation/download"
import type { LanguageType } from "@/lib/validation/language"

const Ad = React.lazy(() => import("@/components/ad"))

export async function generateMetadata({
  params,
}: {
  params: {
    type: DownloadType
    slug: string
    versionSlug: string
    locale: LanguageType
  }
}): Promise<Metadata> {
  const { locale, type, slug, versionSlug } = params

  const download = await api.download.bySlug(slug)

  const downloadFile = await api.downloadFile.byDownloadIdAndVersionSlug({
    downloadId: download?.id!,
    versionSlug: versionSlug,
  })

  return {
    title: `Download ${download?.metaTitle ?? download?.title} ${downloadFile?.version} untuk ${download?.operatingSystem}`,
    description: download?.metaDescription ?? download.excerpt,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/download/${type}/${download?.slug}/${downloadFile?.versionSlug}`,
    },
    openGraph: {
      title: `Download ${download?.metaTitle ?? download?.title} ${downloadFile?.version} untuk ${download?.operatingSystem}`,
      description: download?.metaDescription ?? download?.excerpt,
      url: `${env.NEXT_PUBLIC_SITE_URL}/download/${type}/${download?.slug}/${downloadFile?.versionSlug}`,
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

interface SingleDownloadFileAppPageProps {
  params: {
    locale: LanguageType
    type: DownloadType
    slug: string
    versionSlug: string
  }
}

export default async function SingleDownloadFileAppPage({
  params,
}: SingleDownloadFileAppPageProps) {
  const { type, slug, versionSlug, locale } = params

  const download = await api.download.bySlug(slug)

  const downloadFile = await api.downloadFile.byDownloadIdAndVersionSlug({
    downloadId: download?.id!,
    versionSlug: versionSlug,
  })

  const parsedContent = TransformContent({
    htmlInput: download?.content!,
    title: download?.title!,
    maxWords: 100,
    readMoreLink: `/download/${type}/${slug}`,
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
        `/download/${type}/${otherLanguageDownload.slug}/${otherDownloadFilesLanguage.versionSlug}`,
        RedirectType.replace,
      )
    else notFound()
  }

  return (
    <>
      <div className="absolute left-0 top-0 items-center p-5 align-top">
        <NextLink href={`/download/${type}/${slug}`}>
          <Button size="icon" className="mr-1.5 rounded-full" asChild>
            <Icon.ArrowBack className="size-10 p-2" />
          </Button>
          <span className="items-center justify-center text-xl">
            Back to Post
          </span>
        </NextLink>
      </div>
      <section className="flex w-full max-w-sm flex-col items-center justify-center space-y-4 p-5 lg:max-w-2xl lg:p-0">
        {adsDownloadingPage &&
          adsDownloadingPage.length > 0 &&
          adsDownloadingPage.map((ad) => {
            return <Ad ad={ad} key={ad.id} />
          })}
        <div className="h-full w-[250px] overflow-hidden rounded-xl object-cover lg:w-[500px]">
          <Image
            className="!relative"
            src={download.featuredImage.url}
            alt={download.title}
          />
        </div>
        <h1 className="text-xl lg:text-4xl">{`Download ${download.title} ${downloadFile.version}`}</h1>
        <div className="my-4 rounded-xl border border-border bg-background p-5 shadow-lg">
          {parsedContent}
        </div>
        <DownloadButtonAction
          downloadLink={downloadFile.downloadLink}
          fileSize={downloadFile.fileSize}
        />
      </section>
    </>
  )
}
