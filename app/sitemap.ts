import type { MetadataRoute } from "next"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"

interface RouteProps {
  url: string
  lastModified: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perPage = 1000

  const articlesCount = await api.article.countByLanguage("id")
  const articlePageCount = Math.ceil(articlesCount! / perPage)
  const articles: RouteProps[] = []

  const articlesEnCount = await api.article.countByLanguage("en")
  const articleEnPageCount = Math.ceil(articlesEnCount! / perPage)
  const articlesEn: RouteProps[] = []

  const promosCount = await api.promo.countByLanguage("id")
  const promoPageCount = Math.ceil(promosCount! / perPage)
  const promos: RouteProps[] = []

  const promosEnCount = await api.promo.countByLanguage("id")
  const promoEnPageCount = Math.ceil(promosEnCount! / perPage)
  const promosEn: RouteProps[] = []

  const topUpsCount = await api.topUp.count()
  const topUpPageCount = Math.ceil(topUpsCount! / perPage)
  const topUps: RouteProps[] = []

  if (typeof articlePageCount === "number") {
    for (let i = 0; i < articlePageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/article/${i + 1}`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      articles.push(obj)
    }
  }

  if (typeof articleEnPageCount === "number") {
    for (let i = 0; i < articleEnPageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/article/en/${i + 1}`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      articlesEn.push(obj)
    }
  }

  if (typeof promoPageCount === "number") {
    for (let i = 0; i < promoPageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/promo/${i + 1}`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      promos.push(obj)
    }
  }

  if (typeof promoEnPageCount === "number") {
    for (let i = 0; i < promoEnPageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/promo/en/${i + 1}`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      promosEn.push(obj)
    }
  }

  if (typeof topUpPageCount === "number") {
    for (let i = 0; i < topUpPageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/top-up/${i + 1}`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      topUps.push(obj)
    }
  }

  const routes = ["", "/article", "/promo", "/top-up"].map((route) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [
    ...routes,
    ...articles,
    ...articlesEn,
    ...promos,
    ...promosEn,
    ...topUps,
  ]
}

export const dynamic = "force-dynamic"
