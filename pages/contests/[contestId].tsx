import Layout from 'components/Layout'
import { useRouter } from 'next/dist/client/router'
import { Fragment } from 'react'
import { useQuery } from 'react-query'
import PageContainer from '../../components/PageContainer'
import PageHeader from '../../components/PageHeader'
import PageTitle from '../../components/PageTitle'
import { getPostDetail } from '../../libs/api'
import { Contest, ContestDetailResponse, Submission } from '../../libs/contracts'
import Link from 'next/link'

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

const SubmissionGrid: React.FC<SubmissionGridProps> = ({ submissions }) => (
  <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
    {submissions.map((submission: Submission) => (
      <li key={submission.id} className="relative">
        {submission.body}
        <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1507207611509-ec012433ff52?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80" alt="submission image" className="object-cover pointer-events-none group-hover:opacity-75"/>
          <Link href={`submissions/${submission.id}`}>
            <a type="button" className="absolute inset-0 focus:outline-none">
              <span className="sr-only">View details for {submission.id}</span>
            </a>
          </Link>
        </div>
      </li>
    ))}
  </ul>
) 

export default ContestDetailPage