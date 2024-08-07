import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditDownloadForm = dynamicFn(
  async () => {
    const EditDownloadForm = await import("./form")
    return EditDownloadForm
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { downloadId: string; locale: LanguageType }
}): Promise<Metadata> {
  const { downloadId, locale } = params

  const download = await api.download.byId(downloadId)

  return {
    title: "Edit Download Dashboard",
    description: "Edit Download Dashboard",
    openGraph: {
      title: "Edit Download Dashboard",
      description: "Edit Download Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/download/edit/${download?.id}`,

      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/download/edit/${download?.id}/`,
    },
  }
}

interface EditDownloadsDashboardProps {
  params: { downloadId: string }
}

export default async function CreateDownloadsDashboard({
  params,
}: EditDownloadsDashboardProps) {
  const { downloadId } = params

  const download = await api.download.byId(downloadId)

  if (!download) {
    notFound()
  }

  // @ts-expect-error FIX: drizzle join return string | null
  return <EditDownloadForm download={download} />
}
