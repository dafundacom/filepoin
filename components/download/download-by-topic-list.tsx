"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import DownloadCard from "./download-card"

interface DownloadByTopicListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  topicId: string
  locale: LanguageType
}

const DownloadByTopicList: React.FunctionComponent<DownloadByTopicListProps> = (
  props,
) => {
  const { topicId, locale } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.download.byTopicIdInfinite.useInfiniteQuery(
      { topicId: topicId, limit: 10, language: locale },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    )
  const handleObserver = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target?.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage],
  )

  React.useEffect(() => {
    const lmRef = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)

    if (lmRef) observer.observe(lmRef)
    return () => {
      if (lmRef) {
        observer.unobserve(lmRef)
      }
    }
  }, [handleObserver, loadMoreRef, topicId])

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data?.pages?.map((page, indexPage) => {
          return (
            <React.Fragment key={indexPage}>
              {page?.downloads?.length && page?.downloads?.length > 0
                ? page?.downloads?.map((download) => {
                    return (
                      <DownloadCard download={download} key={download.slug} />
                    )
                  })
                : indexPage === 0 && (
                    <h3 className="my-16 text-center text-3xl">
                      No Downloads have been posted
                    </h3>
                  )}
            </React.Fragment>
          )
        })}
      </div>
      {hasNextPage && (
        <div ref={loadMoreRef}>
          <Button
            aria-label="No More Posts"
            loading={hasNextPage}
            className="w-full cursor-default"
          >
            No More Posts
          </Button>
        </div>
      )}
    </div>
  )
}

export default DownloadByTopicList
