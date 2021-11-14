import Layout from 'components/Layout'
import { useRouter } from 'next/dist/client/router'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import PageContainer from '../../components/PageContainer'
import PageHeader from '../../components/PageHeader'
import PageTitle from '../../components/PageTitle'
import { getAlbumImageUrl, getGalleryImageUrl, getPostDetail, getSingleImageUrl } from '../../libs/api'
import { Contest, ContestDetailResponse, FormattedSubmission, Submission } from '../../libs/contracts'
import { parseTextFromCommentBody, parseImageUrlFromCommentBody, checkForValidImageExtension } from 'libs/utils'
import SubmissionGrid from 'components/SubmissionGrid'
import ImageDialog from 'components/ImageDialog'

const ContestDetailPage = () => {
  const router = useRouter()
  const contestId = router.query.contestId as string
  const [selectedEntity, setSelectedEntity] = useState<FormattedSubmission | null>(null)

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
            <ImageDialog
              open={selectedEntity !== null}
              setOpen={() => setSelectedEntity(null)}
              submission={selectedEntity}
            />
            <ContestDetail contest={data.contest}/>
            <div className="pt-4">
              <SubmissionGrid
                submissions={data.submissions.splice(1)}
                onSubmissionClick={(submission) => setSelectedEntity(submission)}
              />
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
    <div className="flex">
      <div className="w-6/12">
        <img src={contest.imageUrl} className="shadow-lg rounded max-w-full h-auto align-middle border-none"/>
      </div>
      <div className="px-2 flex flex-col justify-center items-center">
        <div className="w-full">
          <PageTitle>{contest.title}</PageTitle>
          <h4 className="text-base font-semibold leading-7 text-gray-700 sm:truncate">by {contest.author}</h4>
        </div>
      </div>
    </div>
  </div>
)

export default ContestDetailPage