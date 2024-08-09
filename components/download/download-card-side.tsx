import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"

interface DownloadCardSideProps {
  title: string
  slug: string
  src: string
}

const DownloadCardSide: React.FunctionComponent<DownloadCardSideProps> = (
  props,
) => {
  const { src, slug, title } = props

  return (
    <NextLink aria-label={title} href={slug}>
      <article className="mb-4 flex w-full border-separate flex-col rounded-lg">
        <div className="relative flex max-w-xs flex-col space-y-3 md:max-w-3xl md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative aspect-[1/1] h-[75px] w-auto max-w-[unset] overflow-hidden rounded-md">
            <Image
              className="object-cover"
              src={src}
              alt={title}
              sizes="(max-width: 768px) 50px, 100px"
              priority={true}
            />
          </div>
          <div className="flex w-full flex-col space-y-2 md:w-2/3">
            <h3 className="line-clamp-3 text-sm leading-5 hover:text-primary/40">
              {title}
            </h3>
          </div>
        </div>
      </article>
    </NextLink>
  )
}

export default DownloadCardSide
