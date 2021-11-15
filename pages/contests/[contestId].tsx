import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import { Fragment, useCallback, useEffect, useState } from 'react'
import Layout from 'components/Layout'
import PageContainer from 'components/PageContainer'
import { getPostDetail } from 'libs/api'
import SubmissionGrid from 'components/SubmissionGrid'
import ImageDialog from 'components/ImageDialog'
import { QueryKey, REDDIT_URL } from 'libs/constants'
import ContestDetail from 'components/ContestDetail'
import EmptySubmissionState from 'components/EmptySubmissionState'
import PageTitle from 'components/PageTitle'
import PageHeader from 'components/PageHeader'
import {
  ContestDetailResponse,
  FormattedSubmission,
  Previewable
} from 'libs/contracts'
import {
  convertImgurAlbumSubmissionToDirectLink,
  convertImgurDirectSubmissionToDirectLink,
  convertImgurGallerySubmissionToDirectLink,
  generateUrlType, parseImageUrlFromCommentBody,
  parseTextFromCommentBody
} from 'libs/utils'
import SubmissionLoadState from 'components/SubmissionLoadState'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const contestId = context.params.contestId as string
  const queryClient = new QueryClient()
 
  await queryClient.prefetchQuery(QueryKey.CONTEST_DETAILS, () => getPostDetail(contestId))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

const ContestDetailPage = () => {
  const router = useRouter()
  const contestId = router.query.contestId as string
  const [selectedEntity, setSelectedEntity] = useState<Previewable | null>(null)

  const { isLoading, error, data } = useQuery<ContestDetailResponse, Error>(
    QueryKey.CONTEST_DETAILS,
    () => getPostDetail(contestId)
  )

  const [formattedSubmissions, setFormattedSubmissions] = useState<FormattedSubmission[] | null>(null)
  
  const createFormattedSubmissions = useCallback(async () => {
    const promises = data.submissions.map((submission) => {
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
  }, [data.submissions])

  useEffect(() => {
    createFormattedSubmissions()
  }, [createFormattedSubmissions])

  const getCurrentSelectedSubmissionIndex = useCallback(() => {
    if (selectedEntity === null || formattedSubmissions === null) return null
    return formattedSubmissions.findIndex(({ id }) => id === selectedEntity.id)
  }, [formattedSubmissions, selectedEntity])

  const openNextSubmission = useCallback(() => {
    const idx = getCurrentSelectedSubmissionIndex()
    
    if (idx === null) return

    let nextIdx = idx + 1

    if (formattedSubmissions.length === nextIdx) {
      setSelectedEntity({ ...data.contest })
      return
    }

    setSelectedEntity({ ...formattedSubmissions[nextIdx] })
  }, [formattedSubmissions, getCurrentSelectedSubmissionIndex])

  const openPreviousSubmission = useCallback(() => {
    const idx = getCurrentSelectedSubmissionIndex()
    if (idx === null) return

    let previousIdx = idx - 1

    if (previousIdx === -1) {
      setSelectedEntity({ ...data.contest })
      return
    }

    if (previousIdx < -1) {
      previousIdx = formattedSubmissions.length - 1
    }

    setSelectedEntity({ ...formattedSubmissions[previousIdx] })
  }, [formattedSubmissions, getCurrentSelectedSubmissionIndex])

  return (
    <Layout>
      <PageContainer>
        {isLoading && <h3>Loading...</h3>}
        {error && <h3>An error has occured: ' {error.message}</h3>}
        {data &&
          <Fragment>
            <ImageDialog
              open={selectedEntity !== null}
              setOpen={() => setSelectedEntity(null)}
              submission={selectedEntity}
              onNextClick={() => openNextSubmission()}
              onPreviousClick={() => openPreviousSubmission()}
            />
            <PageHeader>
          <PageTitle><Link href="/">/r/PhotoshopBattles</Link></PageTitle>
        </PageHeader>
            <ContestDetail contest={data.contest} onContestImageClick={() => setSelectedEntity({ ...data.contest })} />
            <div className="pt-4">
              {formattedSubmissions === null
                ? <SubmissionGridLoadingState/>
                : <Fragment>
                    {formattedSubmissions.length === 0 &&
                      <EmptySubmissionState submissionLink={REDDIT_URL + data.contest.permalink}/>
                    }
                    <SubmissionGrid
                      submissions={formattedSubmissions}
                      onSubmissionClick={(submission) => setSelectedEntity(submission)}
                    />
                  </Fragment>
              }
            </div>
          </Fragment>
        }
      </PageContainer>
    </Layout>
  )
}

const SubmissionGridLoadingState = () =>
  <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
    <li>
      <SubmissionLoadState/>
      <SubmissionLoadState/>
      <SubmissionLoadState/>
      <SubmissionLoadState/>
    </li>
  </ul>

export default ContestDetailPage