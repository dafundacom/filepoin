import * as React from "react"
import dynamicFn from "next/dynamic"
import NextLink from "next/link"

import Image from "@/components/image"
import LanguageSwitcher from "@/components/language/language-switcher"
import Logo from "@/components/logo"
import ThemeSwitcher from "@/components/theme/theme-switcher"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { getI18n } from "@/lib/locales/server"
import { api } from "@/lib/trpc/server"
import { cn } from "@/lib/utils"

const FooterDescription = dynamicFn(
  async () => {
    const FooterDescription = await import("./footer-description")
    return FooterDescription
  },
  {
    ssr: false,
  },
)

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer: React.FunctionComponent<FooterProps> = async (props) => {
  const { className } = props

  const t = await getI18n()

  const setting = await api.setting.byKey("settings")

  let settingValues

  if (setting) {
    const parsedSetting = JSON.parse(setting.value)
    settingValues = { ...parsedSetting }
  }

  const footerTagline = settingValues?.footer_tagline
  const footerDescription = settingValues?.footer_description
  const footerFAQ = settingValues?.footer_faq
  const siteTitle = settingValues?.site_title ?? env.NEXT_PUBLIC_SITE_TITLE
  const siteTagline =
    settingValues?.site_tagline ?? env.NEXT_PUBLIC_SITE_TAGLINE
  const supportEmail = settingValues?.support_email ?? "support@toko.com"
  const supportWhatsApp = settingValues?.support_whatsapp ?? "6283112345678"

  return (
    <footer>
      <FooterDescription
        footerTagline={footerTagline}
        footerDescription={footerDescription}
        footerFAQ={footerFAQ}
      />
      <div
        className={cn(
          "sticky top-[100vh] z-40 mt-auto bg-muted px-4 pb-[100px] pt-4 lg:px-24 lg:pb-12 lg:pt-12 2xl:px-56",
          className,
        )}
      >
        <div className="flex flex-col justify-start lg:flex-row lg:space-x-20">
          <div className="flex flex-col space-y-4 pb-4 lg:space-x-3 lg:space-y-6 lg:pb-0">
            <Logo />
            <div className="flex flex-col">
              <span className="font-bold">{siteTitle}</span>
              <span className="text-sm">{siteTagline}</span>
            </div>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          <div className="flex flex-col space-y-4 lg:space-y-12">
            <div className="space-y-2">
              <h2 className="text-base lg:text-lg">{t("safe_payment")}</h2>
              <div className="flex flex-row gap-2">
                <Image
                  src="/payment/gopay.webp"
                  className="!relative !h-3 !w-auto lg:!h-5"
                  alt="Dana"
                />
                <Image
                  src="/payment/dana.webp"
                  className="!relative !h-3 !w-auto lg:!h-5"
                  alt="Dana"
                />
                <Image
                  src="/payment/shopeepay.webp"
                  className="!relative !h-3 !w-auto lg:!h-5"
                  alt="Dana"
                />
                <Image
                  src="/payment/ovo.webp"
                  className="!relative !h-3 !w-auto lg:!h-5"
                  alt="Dana"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-12 lg:space-y-0">
              <div className="flex flex-col space-y-2 lg:space-y-3">
                <h2 className="text-base">{t("contact_us")}</h2>
                <NextLink
                  href={`mailto:${supportEmail}`}
                  target="_blank"
                  className="text-xs lg:text-sm"
                >
                  <Icon.Email className="mr-2 inline-flex size-3" />
                  {supportEmail}
                </NextLink>
                <NextLink
                  href={`https://api.whatsapp.com/send?phone=${supportWhatsApp}`}
                  target="_blank"
                  className="text-xs lg:text-sm"
                >
                  <Icon.WhatsApp className="mr-2 inline-flex size-3" />
                  {supportWhatsApp}
                </NextLink>
              </div>
              <div className="flex flex-col space-y-2 lg:space-y-3">
                <h2 className="text-base">{t("information")}</h2>
                <NextLink
                  href="/p/term-and-condition"
                  className="text-xs lg:text-sm"
                >
                  {t("term_and_condition")}
                </NextLink>
                <NextLink
                  href="/p/privacy-policy"
                  className="text-xs lg:text-sm"
                >
                  {t("privacy_policy")}
                </NextLink>
                <NextLink href="/article" className="text-xs lg:text-sm">
                  {t("article")}
                </NextLink>
              </div>
              <div>
                <h2 className="text-base">{t("follow_us")}</h2>
                <div className="space-x-2 space-y-2 lg:space-y-3">
                  <Button
                    asChild
                    aria-label="Facebook"
                    variant="outline"
                    size="icon"
                  >
                    <NextLink
                      aria-label="X"
                      href={`https://facebook.com/${env.NEXT_PUBLIC_FACEBOOK_USERNAME}`}
                      target="_blank"
                    >
                      <Icon.Facebook />
                    </NextLink>
                  </Button>
                  <Button
                    asChild
                    aria-label="Instagram"
                    variant="outline"
                    size="icon"
                  >
                    <NextLink
                      aria-label="Instagram"
                      href={`https://instagram.com/${env.NEXT_PUBLIC_INSTAGRAM_USERNAME}`}
                      target="_blank"
                    >
                      <Icon.Instagram />
                    </NextLink>
                  </Button>
                  <Button
                    asChild
                    aria-label="Tiktok"
                    variant="outline"
                    size="icon"
                  >
                    <NextLink
                      aria-label="X"
                      href={`https://tiktok.com/${env.NEXT_PUBLIC_TIKTOK_USERNAME}`}
                      target="_blank"
                    >
                      <Icon.Tiktok />
                    </NextLink>
                  </Button>
                  <Button
                    asChild
                    aria-label="WhatsApp"
                    variant="outline"
                    size="icon"
                  >
                    <NextLink
                      aria-label="X"
                      href={`https://whatsapp.com/${env.NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME}`}
                      target="_blank"
                    >
                      <Icon.WhatsApp />
                    </NextLink>
                  </Button>
                  <Button asChild aria-label="X" variant="outline" size="icon">
                    <NextLink
                      aria-label="X"
                      href={`https://twitter.com/${env.NEXT_PUBLIC_X_USERNAME}`}
                      target="_blank"
                    >
                      <Icon.X />
                    </NextLink>
                  </Button>
                </div>
              </div>
              <p className="text-xs font-semibold lg:text-sm">
                {t("made_with")} &#10084; {siteTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
