import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import env from "@/env.mjs"
import type { SelectDownload, SelectMedia } from "@/lib/db/schema"

type DownloadDataProps = Pick<SelectDownload, "title" | "slug"> & {
  featuredImage: Pick<SelectMedia, "url">
}

interface DownloadCardSearchProps {
  download: DownloadDataProps
}

const DownloadCardSearch: React.FunctionComponent<DownloadCardSearchProps> = (
  props,
) => {
  const { download } = props

  const { title, slug, featuredImage } = download

  return (
    <NextLink
      aria-label={title}
      href={`${env.NEXT_PUBLIC_SITE_URL}/download/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden rounded-md">
          <Image src={featuredImage.url} className="object-cover" alt={title} />
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default DownloadCardSearch
