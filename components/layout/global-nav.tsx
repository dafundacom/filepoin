import * as React from "react"
import NextLink from "next/link"

import { Icon } from "@/components/ui/icon"
import { getI18n } from "@/lib/locales/server"

const GlobalNav: React.FC = async () => {
  const t = await getI18n()

  return (
    <aside id="global-navigation">
      <nav className="fixed bottom-0 left-0 z-50 flex w-full border-t border-border bg-background lg:top-0 lg:block lg:w-[92px] lg:border-r lg:pt-[4.5rem]">
        <NextLink
          className="group relative flex size-[92px] flex-1 flex-col items-center justify-center overflow-hidden text-base text-foreground transition-all hover:bg-muted"
          href="/"
        >
          <Icon.Home className="mb-2 size-[20px] text-inherit transition-all" />
          <span className="text-sm text-inherit transition-all">
            {t("home")}
          </span>
        </NextLink>
        <NextLink
          className="group relative flex size-[92px] flex-1 flex-col items-center justify-center overflow-hidden text-base text-foreground transition-all hover:bg-muted"
          href="/download"
        >
          <Icon.Download className="mb-2 size-[20px] text-inherit transition-all" />
          <span className="text-inherit transition-all">{t("download")}</span>
          <span className="absolute inset-x-auto bottom-[-4px] h-1 w-[72px] bg-primary"></span>
        </NextLink>
      </nav>
    </aside>
  )
}

export default GlobalNav
