import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import { getSession } from "@/lib/auth/utils"
import type { LanguageType } from "@/lib/validation/language"

const CreateDownloadForm = dynamicFn(
  async () => {
    const CreateDownloadForm = await import("./form")
    return CreateDownloadForm
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
    title: "Create Download Dashboard",
    description: "Create Download Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/download/new/`,
    },
    openGraph: {
      title: "Create Download Dashboard",
      description: "Create Download Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/download/new`,
      locale: locale,
    },
  }
}

export default async function CreateDownloadsDashboard() {
  const { session } = await getSession()

  return <CreateDownloadForm session={session} />
}
