import * as React from "react"
import NextLink from "next/link"

import { Icon } from "@/components/ui/icon"
import { getSession } from "@/lib/auth/utils"
import { getI18n } from "@/lib/locales/server"

const GlobalNav: React.FC = async () => {
  const t = await getI18n()
  const { session } = await getSession()

  return (
    <aside id="global-navigation">
      <nav className="fixed bottom-0 left-0 z-50 flex w-full border-t border-border bg-background lg:top-0 lg:block lg:w-[92px] lg:border-r lg:pt-[4.5rem]">
        <NextLink
          className="group relative flex h-[92px] w-[92px] flex-1 flex-col items-center justify-center overflow-hidden text-base text-foreground transition-all hover:bg-muted"
          href="/"
        >
          <Icon.Home className="mb-2 h-[20px] w-[20px] text-inherit transition-all" />
          <span className="text-sm text-inherit transition-all">
            {t("home")}
          </span>
        </NextLink>
        <NextLink
          className="group relative flex h-[92px] w-[92px] flex-1 flex-col items-center justify-center overflow-hidden text-base text-foreground transition-all hover:bg-muted"
          href={session ? "/user/order" : "/top-up/order"}
        >
          <Icon.Transaction className="mb-2 h-[20px] w-[20px] text-inherit transition-all" />
          <span className="text-inherit transition-all">{t("order")}</span>
          <span className="absolute bottom-[-4px] left-auto right-auto h-1 w-[72px] bg-primary"></span>
        </NextLink>
        <NextLink
          className="group relative flex h-[92px] w-[92px] flex-1 flex-col items-center justify-center overflow-hidden text-base text-foreground transition-all hover:bg-muted"
          href="/promo"
        >
          <Icon.Discount className="mb-2 h-[20px] w-[20px] text-inherit transition-all" />
          <span className="text-inherit transition-all">{t("promo")}</span>
          <span className="absolute bottom-[-4px] left-auto right-auto h-1 w-[72px] bg-primary"></span>
        </NextLink>
      </nav>
    </aside>
  )
}

export default GlobalNav
