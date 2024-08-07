"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { populateTopUpProducts, populateTopUps } from "@/lib/top-up"

const DashboardSyncTopUpButton = () => {
  const ts = useScopedI18n("top_up")

  return (
    <div className="flex flex-row space-x-2">
      <Button
        onClick={async () => {
          const topUps = await populateTopUps()

          if (topUps.success) {
            toast({
              variant: "success",
              description: topUps.message,
            })
          } else {
            toast({
              variant: "danger",
              description: topUps.message,
            })
          }
        }}
      >
        {ts("sync")}
      </Button>
      <Button
        onClick={async () => {
          const topUpProducts = await populateTopUpProducts()

          if (topUpProducts.success) {
            toast({
              variant: "success",
              description: topUpProducts.message,
            })
          } else {
            toast({
              variant: "danger",
              description: topUpProducts.message,
            })
          }
        }}
      >
        {ts("sync_product")}
      </Button>
    </div>
  )
}

export default DashboardSyncTopUpButton
