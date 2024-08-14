"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

interface DownloadButtonActionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  downloadLink: string
  fileSize: string
}

const DownloadButtonAction: React.FunctionComponent<
  DownloadButtonActionProps
> = (props) => {
  const { downloadLink, fileSize } = props

  const [showCountdown, setShowCountdown] = React.useState<boolean>(true)
  const [difference, setDifference] = React.useState<number>(20)

  React.useEffect(() => {
    const countdownInterval = setInterval(() => {
      setDifference((prevDifference) => {
        if (prevDifference <= 1) {
          clearInterval(countdownInterval)
          setShowCountdown(false)
          return 0
        }
        return prevDifference - 1
      })
    }, 2000)

    return () => clearInterval(countdownInterval) // Cleanup on unmount
  }, [downloadLink])

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div>
        {showCountdown ? (
          <div className="w-full rounded-xl bg-success/10 p-7 text-lg font-semibold text-foreground lg:text-xl">
            {`Download will start in ${difference} seconds`}
          </div>
        ) : (
          <Button aria-label="Download" asChild>
            <a href={downloadLink}>Download ({fileSize})</a>
          </Button>
        )}
      </div>
    </div>
  )
}

export default DownloadButtonAction
