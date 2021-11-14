import Layout from 'components/Layout'
import { useRouter } from 'next/dist/client/router'
import { Fragment, useState } from 'react'
import { useQuery } from 'react-query'
import PageContainer from '../../components/PageContainer'
import { getPostDetail } from '../../libs/api'
import { ContestDetailResponse, FormattedSubmission } from '../../libs/contracts'
import SubmissionGrid from 'components/SubmissionGrid'
import ImageDialog from 'components/ImageDialog'
import { QueryKey } from 'libs/constants'
import ContestDetail from 'components/ContestDetail'

const ContestDetailPage = () => {
  const router = useRouter()
  const contestId = router.query.contestId as string
  const [selectedEntity, setSelectedEntity] = useState<FormattedSubmission | null>(null)

  const { isLoading, error, data } = useQuery<ContestDetailResponse, Error>(
    QueryKey.CONTEST_DETAILS,
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


export default ContestDetailPage