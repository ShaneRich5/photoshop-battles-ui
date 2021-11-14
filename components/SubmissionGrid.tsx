import { getAlbumImageUrl, getGalleryImageUrl, getSingleImageUrl } from "libs/api"
import { FormattedSubmission, Submission, SubmissionUrlType } from "libs/contracts"
import { checkForValidImageExtension, parseImageUrlFromCommentBody, parseTextFromCommentBody } from "libs/utils"
import { useCallback, useEffect, useState } from "react"

const generateUrlType = (title: string, imageUrl: string): SubmissionUrlType => {
  if (imageUrl === null || title === 'deleted') return null

  const urlEndpoint = imageUrl.split('/').pop()
  const extension = urlEndpoint.split('.').pop()

  if (checkForValidImageExtension(extension)) return 'direct-link'
  if (imageUrl.includes('imgur.com/gallery/')) return 'imgur-gallery'
  if (imageUrl.includes('imgur.com/a/')) return 'imgur-album'
  if (imageUrl.includes('imgur.com/')) return 'imgur-direct'

  return null
}

const convertImgurAlbumSubmissionToDirectLink = async (submission: FormattedSubmission): Promise<FormattedSubmission> => {
  const { imageUrl } = submission
  const albumHash = imageUrl.split('/').pop()
  const url = await getAlbumImageUrl(albumHash)

  return { ...submission, imageUrl: url }
}

const convertImgurGallerySubmissionToDirectLink = async (submission: FormattedSubmission): Promise<FormattedSubmission> => {
  const { imageUrl } = submission
  const galleryHash = imageUrl.split('/').pop()
  const url = await getGalleryImageUrl(galleryHash)

  return { ...submission, imageUrl: url }
}

const convertImgurDirectSubmissionToDirectLink = async (submission: FormattedSubmission): Promise<FormattedSubmission> => {
  const { imageUrl } = submission
  const imageHash = imageUrl.split('/').pop()
  const url = await getSingleImageUrl(imageHash)

  return { ...submission, imageUrl: url }
}

interface SubmissionGridProps {
  submissions: Submission[]
  onSubmissionClick: (submission: FormattedSubmission) => void
}

const SubmissionGrid: React.FC<SubmissionGridProps> = ({ submissions, onSubmissionClick }) => {
  const [formattedSubmissions, setFormattedSubmissions] = useState<FormattedSubmission[]>([])
  
  const createFormattedSubmissions = useCallback(async () => {
    const promises = submissions.map((submission) => {
      const title = parseTextFromCommentBody(submission.body)
      const imageUrl = parseImageUrlFromCommentBody(submission.body)
      const urlType = generateUrlType(title, imageUrl)

      const formattedSubmission: FormattedSubmission = {
        ...submission,
        title,
        imageUrl,
        urlType,
      }

      switch (urlType) {
        case 'direct-link':
          return Promise.resolve(formattedSubmission)
        case 'imgur-direct':
          return convertImgurDirectSubmissionToDirectLink(formattedSubmission)
        case 'imgur-album':
          return convertImgurAlbumSubmissionToDirectLink(formattedSubmission)
        case 'imgur-gallery':
          return convertImgurGallerySubmissionToDirectLink(formattedSubmission)
        default:
          return Promise.resolve(formattedSubmission)
      }
    })

    const results = await Promise.all(promises)

    setFormattedSubmissions(results.filter(({ urlType }) => urlType !== null))
  }, [submissions])

  useEffect(() => {
    createFormattedSubmissions()
  }, [createFormattedSubmissions])
  
  return (
    <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {formattedSubmissions.map((formattedSubmission: FormattedSubmission) => (
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