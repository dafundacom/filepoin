import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import type { SelectDownload, SelectMedia } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

function getIconOperatingSystem(operatingSystem: string) {
  switch (operatingSystem) {
    case "Windows":
      return <Icon.Windows aria-label="Windows" />
    case "macOS":
      return <Icon.Apple aria-label="macOS" />
    case "Linux":
      return <Icon.Linux aria-label="Linux" />
    case "Android":
      return <Icon.Android aria-label="Android" />
    case "iOS":
      return <Icon.AppleAlt aria-label="iOS" />
    case "Xbox One":
      return <Icon.Xbox aria-label="Xbox One" />
    case "PlayStation 4":
      return <Icon.PlayStation aria-label="PlayStation 4" />
    case "Nintendo Switch":
      return <Icon.NintendoSwitch aria-label="Nintendo Switch" />
    default:
      return <Icon.Windows aria-label="Windows" />
  }
}

interface DownloadCardProps extends React.HTMLAttributes<HTMLDivElement> {
  download: Partial<SelectDownload> & {
    featuredImage: Pick<SelectMedia, "url">
  }
  className?: string
}

const DownloadCard: React.FunctionComponent<DownloadCardProps> = (props) => {
  const { download, className } = props

  const { operatingSystem, slug, title, type, featuredImage } = download

  const icon = getIconOperatingSystem(operatingSystem!)

  return (
    <div
      key={slug}
      className={cn(
        "inline-block max-h-[250px] w-[200px] flex-col overflow-hidden rounded-lg shadow-lg",
        className,
      )}
    >
      <div className="relative">
        <NextLink aria-label={title} href={`/download/${type}/${slug}`}>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={featuredImage?.url!}
              className="object-cover"
              alt={title!}
            />
          </div>
        </NextLink>
        <Button
          size={null}
          variant="outline"
          aria-label="Operating System"
          className="absolute right-[5px] top-[5px] size-10 rounded-full bg-background p-px"
        >
          {icon}
        </Button>
      </div>
      <NextLink aria-label={title} href={`/download/${type}/${slug}`}>
        <h3 className="my-3 line-clamp-4 whitespace-normal p-3 text-base">
          {title}
        </h3>
      </NextLink>
    </div>
  )
}

export default DownloadCard
