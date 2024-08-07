import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const TranslatePageForm = dynamicFn(
  async () => {
    const TranslatePageForm = await import("./form")
    return TranslatePageForm
  },
  {
    ssr: false,
  },
)

interface TranslatePageMetaDataProps {
  params: {
    locale: LanguageType
    pageTranslationId: string
    language: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslatePageMetaDataProps): Promise<Metadata> {
  const { locale, pageTranslationId, language } = params

  const pageTranslation = await api.page.pageTranslationById(pageTranslationId)

  return {
    title: "Translate Page Dashboard",
    description: "Translate Page Dashboard",
    openGraph: {
      title: "Translate Page Dashboard",
      description: "Translate Page Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/page/translate/${language}/${pageTranslation?.id}`,
      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/page/translate/${language}/${pageTranslation?.id}/`,
    },
  }
}

interface TranslatePageDashboardProps {
  params: {
    pageTranslationId: string
    language: LanguageType
  }
}

export default async function TranslatePageDashboardPage({
  params,
}: TranslatePageDashboardProps) {
  const { pageTranslationId, language } = params

  const pageTranslation = await api.page.pageTranslationById(pageTranslationId)

  const otherLanguagePage = pageTranslation?.pages?.find(
    (page) => page.language === language,
  )

  if (otherLanguagePage) {
    redirect(`/dashboard/page/edit/${otherLanguagePage.id}`)
  }

  return (
    <TranslatePageForm
      pageTranslationId={pageTranslationId}
      language={language}
    />
  )
}
