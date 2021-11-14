import Layout from 'components/Layout'
import { useRouter } from 'next/dist/client/router'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import PageContainer from '../../components/PageContainer'
import PageHeader from '../../components/PageHeader'
import PageTitle from '../../components/PageTitle'
import { getAlbumImageUrl, getGalleryImageUrl, getPostDetail, getSingleImageUrl } from '../../libs/api'
import { Contest, ContestDetailResponse, Submission } from '../../libs/contracts'
import Link from 'next/link'
import { parseTextFromCommentBody, parseImageUrlFromCommentBody, checkForValidImageExtension } from 'libs/utils'

const ContestDetailPage = () => {
  const router = useRouter()
  const contestId = router.query.contestId as string

  const { isLoading, error, data } = useQuery<ContestDetailResponse, Error>(
    'contest-details',
    () => getPostDetail(contestId)
  )

  return (
    <Layout>
      <PageContainer>
        {isLoading && <h3>Loading...</h3>}
        {error && <h3>An error has occured: ' {error.message}</h3>}
        {data &&
          <Fragment>
            <ContestDetail contest={data.contest}/>
            <div className="pt-4r6T">
              <SubmissionGrid submissions={data.submissions.splice(1)}/>
            </div>
          </Fragment>
        }
      </PageContainer>

    </Layout>
  )
}

interface ContestDetailProps {
  contest: Contest
}

const ContestDetail: React.FC<ContestDetailProps> = ({ contest }) => (
  <div>
    <PageHeader>
      <PageTitle>{contest.title}</PageTitle>
    </PageHeader>
    <div className="flex">
      <div className="w-6/12">
        <img src={contest.imageUrl} className="shadow-lg rounded max-w-full h-auto align-middle border-none"/>
      </div>
      <div className="px-2">
        <PageTitle>{contest.title}</PageTitle>
        by {contest.author}
      </div>
    </div>
  </div>
)

interface SubmissionGridProps {
  submissions: Submission[]
}
type DirectLink = 'direct-link'
type ImgurAlbum = 'imgur-album'
type ImgurGallery = 'imgur-gallery'
type ImgurDirect = 'imgur-direct'
type SubmissionUrlType = DirectLink | ImgurAlbum | ImgurGallery | ImgurDirect | null

interface FormattedSubmission extends Submission {
  title: string
  imageUrl: string
  urlType: SubmissionUrlType
}

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

const SubmissionGrid: React.FC<SubmissionGridProps> = ({ submissions }) => {
  const [formattedSubmissions, setFormattedSubmissions] = useState<FormattedSubmission[]>([])
  
  const createFormattedSubmissions = useCallback(async () => {
    const promises = submissions.slice(1).map((submission) => {
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
        <li key={formattedSubmission.id} className="relative">
          <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <img
              src={formattedSubmission.imageUrl}
              alt="submission image"
              className="object-cover pointer-events-none group-hover:opacity-75"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <SubmissionImage commentBody={submission.body}/>
            <Link href={`submissions/${submission.id}`}>
              <a type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details for {submission.id}</span>
              </a>
            </Link>
          </div> */}
          
        </li>
      ))}
    </ul>
  )
}

interface SubmissionImageProps {
  commentBody: string
}

type NullableString = string | null

const SubmissionImage: React.FC<SubmissionImageProps> = ({ commentBody }) => {
  const PLACEHOLDER_IMAGE_URL = "https://images.unsplash.com/photo-1507207611509-ec012433ff52?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80"
  
  const [text, setText] = useState<NullableString>(null)
  const [imageUrl, setImageUrl] = useState<NullableString>(PLACEHOLDER_IMAGE_URL)

  const parseContentFromCommentBody = useCallback(() => {
    setText(parseTextFromCommentBody(commentBody))
    setImageUrl(parseImageUrlFromCommentBody(commentBody))
  }, [])

  useEffect(() => {
    parseContentFromCommentBody()
  }, [parseContentFromCommentBody])

  return (
    <img src={imageUrl} alt="submission image" className="object-cover pointer-events-none group-hover:opacity-75"/>
  )
}

export default ContestDetailPage