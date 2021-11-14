import { getAlbumImageUrl, getGalleryImageUrl, getSingleImageUrl } from "libs/api"
import { FormattedSubmission, Submission, SubmissionUrlType } from "libs/contracts"
import { checkForValidImageExtension, parseImageUrlFromCommentBody, parseTextFromCommentBody } from "libs/utils"
import { useCallback, useEffect, useState } from "react"

interface SubmissionGridProps {
  submissions: FormattedSubmission[]
  onSubmissionClick: (submission: FormattedSubmission) => void
}

const SubmissionGrid: React.FC<SubmissionGridProps> = ({ submissions, onSubmissionClick }) => {
  return (
    <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {submissions.map((formattedSubmission: FormattedSubmission) => (
        <li
          key={formattedSubmission.id}
          className="relative"
          onClick={() => onSubmissionClick(formattedSubmission)}
        >
          <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <img
              src={formattedSubmission.imageUrl}
              alt="submission image"
              className="object-cover pointer-events-none group-hover:opacity-75"
              referrerPolicy="no-referrer"
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default SubmissionGrid