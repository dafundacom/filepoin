"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import env from "@/env.mjs"
import { useI18n } from "@/lib/locales/client"

interface FooterDescriptionProps {
  footerTagline: string
  footerDescription: string
  footerFAQ: string
}

const FooterDescription: React.FC<FooterDescriptionProps> = (props) => {
  const { footerTagline, footerDescription, footerFAQ } = props

  const [visibleContent, setVisibleContent] = React.useState<boolean>(false)

  const t = useI18n()

  const handleShowMore = () => {
    setVisibleContent((prevContent) => !prevContent)
  }

  return (
    <div className="bg-muted/50 py-4 lg:pt-8">
      <div className="relative space-y-2 px-4 lg:space-y-3 lg:px-24 2xl:px-56">
        <h1 className="text-sm font-bold lg:text-base">{footerTagline}</h1>
        <div
          className="text-xs lg:text-sm"
          dangerouslySetInnerHTML={{ __html: footerDescription }}
        />
        <h1 className="text-sm font-bold lg:text-base">
          Mengapa Top Up dan Beli Voucher di {env.NEXT_PUBLIC_SITE_TITLE}?
        </h1>
        {visibleContent ? (
          <>
            <div
              className="footer-content mb-4 space-y-2"
              dangerouslySetInnerHTML={{ __html: footerFAQ }}
            />
            <div className="flex justify-center">
              <Button
                onClick={handleShowMore}
                variant="ghost"
                className="rounded-xl text-xs font-bold text-blue-500 hover:text-blue-600 lg:text-sm"
              >
                {t("hide")}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <Button
              onClick={handleShowMore}
              variant="ghost"
              className="rounded-xl text-xs font-bold text-blue-500 hover:text-blue-600 lg:text-sm"
            >
              {t("see_more")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FooterDescription
