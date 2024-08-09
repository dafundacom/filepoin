import * as React from "react"

interface DownloadDetailBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  value?: string
}

const DownloadDetailBox: React.FunctionComponent<DownloadDetailBoxProps> = (
  props,
) => {
  const { icon, title, value } = props

  return (
    <div className="flex flex-row space-x-2 p-5">
      {icon}
      <div className="flex-col">
        <h2 className="text-lg">{title}</h2>
        <p>{value}</p>
      </div>
    </div>
  )
}

export default DownloadDetailBox
