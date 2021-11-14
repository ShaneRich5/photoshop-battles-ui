import Layout from 'components/Layout'
import { useRouter } from 'next/dist/client/router'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import PageContainer from '../../components/PageContainer'
import PageHeader from '../../components/PageHeader'
import PageTitle from '../../components/PageTitle'
import { getAlbumImageUrl, getGalleryImageUrl, getPostDetail, getSingleImageUrl } from '../../libs/api'
import { Contest, ContestDetailResponse, Submission } from '../../libs/contracts'
import { parseTextFromCommentBody, parseImageUrlFromCommentBody, checkForValidImageExtension } from 'libs/utils'
import SubmissionGrid from 'components/SubmissionGrid'

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
      <PageTitle>/r/PhotoshopBattles</PageTitle>
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

export default ContestDetailPage