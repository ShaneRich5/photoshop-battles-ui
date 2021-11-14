import Layout from 'components/Layout'
import { useRouter } from 'next/dist/client/router'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import PageContainer from '../../components/PageContainer'
import { getPostDetail } from '../../libs/api'
import { ContestDetailResponse, FormattedSubmission } from '../../libs/contracts'
import SubmissionGrid from 'components/SubmissionGrid'
import ImageDialog from 'components/ImageDialog'
import { NOT_FOUND_INDEX, QueryKey, REDDIT_URL } from 'libs/constants'
import ContestDetail from 'components/ContestDetail'
import { GetServerSideProps } from 'next'
import EmptySubmissionState from 'components/EmptySubmissionState'
import { convertImgurAlbumSubmissionToDirectLink, convertImgurDirectSubmissionToDirectLink, convertImgurGallerySubmissionToDirectLink, generateUrlType, parseImageUrlFromCommentBody, parseTextFromCommentBody } from 'libs/utils'

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
  const [selectedEntity, setSelectedEntity] = useState<FormattedSubmission | null>(null)

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

  const getCurrentSelectedSubmissionIndex = () => {
    if (selectedEntity === null || formattedSubmissions === null) return null
    return formattedSubmissions.findIndex(({ id }) => id === selectedEntity.id)
  }

  const openNextSubmission = () => {
    const idx = getCurrentSelectedSubmissionIndex()
    if (idx === null) return

    let nextIdx = idx + 1

    if (formattedSubmissions.length === nextIdx) {
      nextIdx = 0
    }

    setSelectedEntity({ ...formattedSubmissions[nextIdx] })
  }

  const openPreviousSubmission = () => {
    const idx = getCurrentSelectedSubmissionIndex()
    if (idx === null) return

    let previousIdx = idx - 1

    if (previousIdx < 0) {
      previousIdx = formattedSubmissions.length - 1
    }

    setSelectedEntity({ ...formattedSubmissions[previousIdx] })
  }

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
            <ContestDetail contest={data.contest}/>
            <div className="pt-4">
              {formattedSubmissions === null
                ? <h4>Rendering submissions</h4>
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


export default ContestDetailPage