import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import type { LanguageType } from "@/lib/validation/language"

const DashboardDownloadContent = dynamicFn(
  async () => {
    const DashboardDownloadContent = await import("./content")
    return DashboardDownloadContent
  },
  {
    ssr: false,
  },
)

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Download Dashboard",
    description: "Download Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
    },
    openGraph: {
      title: "Download Dashboard",
      description: "Download Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
      locale: locale,
    },
  }
}

export default function DashboardDownloadage() {
  return <DashboardDownloadContent />
}
