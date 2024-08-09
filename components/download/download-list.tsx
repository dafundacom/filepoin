"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import type {
  SelectDownload,
  SelectDownloadFile,
  SelectMedia,
} from "@/lib/db/schema"
import DownloadCard from "./download-card"

type DownloadDataProps = Partial<SelectDownload> & {
  featuredImage: Pick<SelectMedia, "url">
  downloadFiles?: Partial<SelectDownloadFile>[]
}

interface DownloadListProps extends React.HTMLAttributes<HTMLDivElement> {
  downloads: DownloadDataProps[]
}

const DownloadList: React.FunctionComponent<DownloadListProps> = (props) => {
  const { downloads } = props

  const [prevDisplay, setPrevDisplay] = React.useState<string>("md:hidden")
  const [nextDisplay, setNextDisplay] = React.useState<string>("md:flex")
  const [showArrow, setShowArrow] = React.useState<boolean>(false)

  const arrowClass =
    "hidden justify-center content-center bg-background hover:bg-muted/80 hover:text-background p-2 cursor-pointer ring-0 absolute rounded-full"

  const contentRef: React.RefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const content: HTMLDivElement | null = contentRef.current

    if (content && content.scrollWidth > content.offsetWidth) {
      setShowArrow(true)
    }
  }, [])

  function handleNextClick() {
    const content: HTMLDivElement | null = contentRef.current

    if (content) {
      content.scrollBy(250, 0)
      if (content.scrollLeft > 190) {
        setPrevDisplay("md:flex")
      }
      if (
        content.scrollLeft >=
        content.scrollWidth - content.offsetWidth - 200
      ) {
        setNextDisplay("md:hidden")
      }
    }
  }

  function handlePrevClick() {
    const content: HTMLDivElement | null = contentRef.current

    if (content) {
      content.scrollBy(-250, 0)
      if (content.scrollLeft < 200) {
        setPrevDisplay("md:hidden")
      }
      if (content.scrollLeft - 210) {
        setNextDisplay("md:flex")
      }
    }
  }

  return (
    <div className="relative">
      {showArrow && (
        <>
          <Button
            aria-label="Prev"
            onClick={handlePrevClick}
            id="prev"
            variant="outline"
            className={`${arrowClass} ${prevDisplay} left-0 top-1/2 z-[8] hidden -translate-y-2/4 translate-x-2/4`}
          >
            <Icon.ArrowBack aria-label="Prev" />
          </Button>
          <Button
            aria-label="Next"
            onClick={handleNextClick}
            id="next"
            variant="outline"
            className={`${arrowClass} md:flex ${nextDisplay} right-[40px] top-1/2 z-[8] -translate-y-2/4 translate-x-2/4`}
          >
            <Icon.ArrowForward aria-label="Next" />
          </Button>
        </>
      )}
      <div
        ref={contentRef}
        className="relative mb-4 block h-auto min-w-full space-x-5 overflow-auto whitespace-nowrap py-3"
      >
        {downloads?.map((download) => {
          return (
            <React.Fragment key={download.id}>
              <DownloadCard
                className="h-[280px] w-[200px]"
                download={download}
              />
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default DownloadList
