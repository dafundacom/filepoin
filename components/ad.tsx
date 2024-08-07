import * as React from "react"

import type { SelectAd } from "@/lib/db/schema/ad"

interface AdProps extends React.HTMLAttributes<HTMLDivElement> {
  ad: SelectAd
}

const Ad: React.FunctionComponent<AdProps> = (props) => {
  const { ad } = props

  const { id, content } = ad

  return (
    <div
      key={id}
      className="my-10"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default Ad
