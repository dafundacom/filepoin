import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const TranslateDownloadForm = dynamicFn(
  async () => {
    const TranslateDownloadForm = await import("./form")
    return TranslateDownloadForm
  },
  {
    ssr: false,
  },
)

interface TranslateDownloadMetaDataProps {
  params: {
    locale: LanguageType
    downloadTranslationId: string
    language: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslateDownloadMetaDataProps): Promise<Metadata> {
  const { locale, downloadTranslationId, language } = params

  const downloadTranslation = await api.download.downloadTranslationById(
    downloadTranslationId,
  )

  return {
    title: "Translate Download Dashboard",
    description: "Translate Download Dashboard",
    openGraph: {
      title: "Translate Download Dashboard",
      description: "Translate Download Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/download/translate/${language}/${downloadTranslation?.id}`,
      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/download/translate/${language}/${downloadTranslation?.id}/`,
    },
  }
}

interface TranslateDownloadDashboardProps {
  params: {
    downloadTranslationId: string
    language: LanguageType
  }
}

export default async function TranslateDownloadDashboardPage({
  params,
}: TranslateDownloadDashboardProps) {
  const { downloadTranslationId, language } = params

  const downloadTranslation = await api.download.downloadTranslationById(
    downloadTranslationId,
  )

  const selectedDownload = downloadTranslation?.downloads?.find(
    (download) => download.language !== language,
  )
  const otherLanguageDownload = downloadTranslation?.downloads?.find(
    (download) => download.language === language,
  )

  if (otherLanguageDownload) {
    redirect(`/dashboard/download/edit/${otherLanguageDownload.id}`)
  }

  return (
    <TranslateDownloadForm
      downloadTranslationId={downloadTranslationId}
      // @ts-expect-error FIX: drizzle join return string | null
      initialDownloadData={selectedDownload}
      language={language}
    />
  )
}
