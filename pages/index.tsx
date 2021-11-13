import Layout from 'components/Layout'
import { getContestList } from 'libs/api'
import Link from 'next/link'
import { Contest, ContestListResponse } from 'libs/contracts'
import { useQuery } from 'react-query'
import PageTitle from 'components/PageTitle'
import PageContainer from 'components/PageContainer'
import PageHeader from '../components/PageHeader'

export default function Home() {
  const { isLoading, error, data: contests } = useQuery<ContestListResponse, Error>(
    'contest-list',
    getContestList
  )

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>/r/PhotoshopBattles</PageTitle>
        </PageHeader>
        {isLoading && <h3>Loading...</h3>}
        {error && <h3>An error has occured: ' {error.message}</h3>}
        {contests && <ContestGrid contests={contests}/>}
      </PageContainer>
    </Layout>
  )
}

interface ContestGridProps {
  contests: Contest[]
}

const ContestGrid: React.FC<ContestGridProps> = ({ contests }) => (
  <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
    {contests.map((contest: Contest) => (
      <li key={contest.id} className="relative">
        <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
          <img src={contest.imageUrl} alt="contest image" className="object-cover pointer-events-none group-hover:opacity-75"/>
          <Link href={`contests/${contest.id}`}>
            <a type="button" className="absolute inset-0 focus:outline-none">
              <span className="sr-only">View details for {contest.title}</span>
            </a>
          </Link>
        </div>
      </li>
    ))}
  </ul>
)