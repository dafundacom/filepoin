"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"

interface DownloadSearchProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (_query: string) => void
}

const DownloadSearch: React.FunctionComponent<DownloadSearchProps> = (
  props,
) => {
  const { onSearch } = props

  const [query, setQuery] = React.useState<string>("")

  const router = useRouter()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/download/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Input
          type="search"
          name="q"
          onChange={handleChange}
          autoComplete="off"
          placeholder="Search..."
        />
      </form>
    </div>
  )
}

export default DownloadSearch
