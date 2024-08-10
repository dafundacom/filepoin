import * as React from "react"
import type { Metadata } from "next"

import LoadingProgress from "@/components/loading-progress"
import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"
import { DownloadSearchContent } from "./content"

export const revalidate = 0

export function generateMetadata({
  params,
}: {
  params: { slug: string; locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Search Download",
    description: `${env.NEXT_PUBLIC_SITE_TITLE} Search Download`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/download/search`,
    },
    openGraph: {
      title: "Search Download",
      description: `${env.NEXT_PUBLIC_SITE_TITLE} Search Download`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/download/search`,
      locale: locale,
    },
  }
}

export default function SearchDownloadPage({
  params,
}: {
  params: { locale: LanguageType }
}) {
  const { locale } = params

  return (
    <>
      <React.Suspense fallback={<LoadingProgress />}>
        <DownloadSearchContent locale={locale} />
      </React.Suspense>
    </>
  )
}
