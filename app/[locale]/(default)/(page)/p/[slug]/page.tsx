import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import TransformContent from "@/components/transform-content"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import { formatDate } from "@/lib/utils"
import type { LanguageType } from "@/lib/validation/language"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params

  const page = await api.page.bySlug(slug)

  return {
    title: page?.metaTitle ?? page?.title,
    description: page?.metaDescription ?? page?.excerpt,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/p/${page?.slug}/`,
    },
    openGraph: {
      title: page?.title,
      description: page?.metaDescription ?? page?.excerpt,
      url: `${env.NEXT_PUBLIC_SITE_URL}/p/${page?.slug}`,
      locale: page?.language,
    },
    twitter: {
      title: env.NEXT_PUBLIC_X_USERNAME,
      card: "summary_large_image",
    },
  }
}

interface PageSlugPageProps {
  params: {
    slug: string
    locale: LanguageType
  }
}

export default async function PageSlugPage({ params }: PageSlugPageProps) {
  const { slug } = params

  const page = await api.page.bySlug(slug)

  if (!page) {
    notFound()
  }

  const pageContent = TransformContent({
    htmlInput: page?.content,
    title: page?.title!,
  })

  return (
    <>
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
            name: page?.metaTitle ?? page?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/p/${page?.slug}`,
          },
        ]}
      />
      <SiteLinksSearchBoxJsonLd
        useAppDir={true}
        url={env.NEXT_PUBLIC_SITE_URL}
        potentialActions={[
          {
            target: `${env.NEXT_PUBLIC_SITE_URL}/search?q`,
            queryInput: "search_term_string",
          },
        ]}
      />
      <section className="fade-up-element">
        <div className="mb-5 md:mb-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild aria-label="Home">
                  <NextLink href="/">
                    <Icon.Home />
                  </NextLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{page.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl">{page.title}</h1>
          <p className="text-xs text-muted-foreground">
            {formatDate(page.createdAt, "LL")}
          </p>
          <div className="article-content" id="content">
            {pageContent}
          </div>
        </div>
      </section>
    </>
  )
}
