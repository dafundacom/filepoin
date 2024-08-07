import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const UpsertSettingForm = dynamicFn(
  async () => {
    const UpsertSettingForm = await import("./form")
    return UpsertSettingForm
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
    title: "Settings Dashboard",
    description: "Settings Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/setting/`,
    },
    openGraph: {
      title: "Settings Dashboard",
      description: "Settings Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/setting`,
      locale: locale,
    },
  }
}

export default async function UpsertSettingDashboard() {
  const settings = await api.setting.byKey("settings")

  let settingsData

  if (settings) {
    const parsedData = JSON.parse(settings.value)
    settingsData = parsedData
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <UpsertSettingForm settings={settingsData} />
      </div>
    </div>
  )
}
