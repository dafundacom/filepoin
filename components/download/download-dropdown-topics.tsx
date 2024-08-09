import * as React from "react"
import NextLink from "next/link"

import { Icon } from "@/components/ui/icon"
import type { SelectTopic } from "@/lib/db/schema"

interface DownloadDropdownSelectTopic {
  title: string
  topics: Partial<SelectTopic>[] | null
}

const DownloadDropdownTopics: React.FunctionComponent<
  DownloadDropdownSelectTopic
> = (props) => {
  const { topics, title } = props

  return (
    <details className="relative inline-block text-left">
      <summary className="cursor-pointer list-none" role="button">
        <span
          aria-label="Open Dropdown menu"
          className="inline-flex w-full justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/10 focus:outline-none focus:ring"
        >
          <span className="mr-2">{title}</span>
          <Icon.KeyboardArrowDown aria-label="Show List" className="size-6" />
        </span>
      </summary>

      <div className="absolute right-0 z-[2] mt-2 w-auto origin-bottom rounded-md bg-background shadow-lg ring-1 ring-black/5">
        <div className="py-1">
          {topics?.map((topic) => (
            <NextLink
              key={topic.id}
              aria-label={topic.title}
              href={`/download/topic/${topic.slug}`}
              className="block px-4 py-2 hover:bg-muted/10"
            >
              {topic.title}
            </NextLink>
          ))}
        </div>
      </div>
    </details>
  )
}

export default DownloadDropdownTopics
