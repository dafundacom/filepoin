//TODO: translate

"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import DownloadCard from "@/components/download/download-card"
import DownloadSearch from "@/components/download/download-search"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"

interface SearchProps {
  locale: LanguageType
}

export function DownloadSearchContent(props: SearchProps) {
  const { locale } = props

  const searchParams = useSearchParams()
  const search = searchParams?.get("q")

  const { data: resultsData } = api.download.search.useQuery({
    searchQuery: search!,
    language: locale,
  })

  return (
    <section className="fade-up-element flex w-full flex-col">
      <div className="relative mb-10 flex flex-col bg-gradient-to-r py-10">
        <div className="self-center">
          <h2>
            {search !== undefined || null
              ? `Search results for "${search}"`
              : "Search"}
          </h2>
        </div>
      </div>
      <div className="mx-4 flex w-full flex-row px-4 md:mx-auto md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
        <div className="flex w-full flex-col lg:mr-4">
          <div className="mb-4 rounded-md p-2">
            <DownloadSearch />
          </div>
          <div className="w-full px-4">
            {resultsData !== undefined ? (
              <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {resultsData?.map((download) => {
                  return <DownloadCard key={download.id} download={download} />
                })}
              </div>
            ) : (
              <>
                <div>{search} not found. Please try with another keyword</div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
