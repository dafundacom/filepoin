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

  const [showCountdown, setShowCountdown] = React.useState<boolean>(false)
  const [difference, setDifference] = React.useState<number>(10)

  const handleDownloadClick = () => {
    setShowCountdown(true)

    const countdownInterval = setInterval(() => {
      setDifference((prevDifference) => prevDifference - 1)
    }, 1000)

    setTimeout(() => {
      clearInterval(countdownInterval)
      window.open(downloadLink, "_blank")
      setShowCountdown(false)
      setDifference(10)
    }, 10000)
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <Button
          aria-label="Download"
          onClick={handleDownloadClick}
          disabled={showCountdown}
        >
          Download ({fileSize})
        </Button>
        {showCountdown && (
          <div className="w-full bg-success/10 p-7 text-foreground">
            {`Download will started in ${difference} second`}
          </div>
        )}
      </div>
    </div>
  )
}

export default DownloadButtonAction
