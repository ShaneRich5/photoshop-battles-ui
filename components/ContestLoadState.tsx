import { Fragment } from "react"

const ContestLoadState = () => (
  <Fragment>
    {/* image */}
    <div className="w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-200 rounded-tr rounded-tl animate-pulse"></div>
    <div className="mt-2">
      {/* title */}
      <div className="h-4 rounded-sm bg-gray-200 animate-pulse mb-1"></div>
      {/* content */}
      <div className="grid grid-cols-4 gap-1">
        <div className="h-4 rounded-sm bg-gray-200 animate-pulse"></div>
        <div className="col-span-2 h-4 rounded-sm bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  </Fragment>
)

export default ContestLoadState