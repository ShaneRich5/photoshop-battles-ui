import Link from 'next/link'
import { useRef } from 'react'
import Layout from 'components/Layout'
import { QueryKey } from 'libs/constants'
import PageTitle from 'components/PageTitle'
import RedditIcon from 'components/RedditIcon'
import PageHeader from 'components/PageHeader'
import { PlusIcon } from '@heroicons/react/solid'
import PageContainer from 'components/PageContainer'
import LoadingIndicator from 'components/LoadingIndicator'
import { getContestList, getPrefetchContestList } from 'libs/api'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { dehydrate, QueryClient, useInfiniteQuery } from 'react-query'
import { Contest, ContestListResponse, PaginatedContests } from 'libs/contracts'

export async function getServerSideProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(QueryKey.CONTEST_LIST, getPrefetchContestList)

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export default function Home() {
  const { hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, error, data: { pages } } = useInfiniteQuery<ContestListResponse, Error>(
    QueryKey.CONTEST_LIST,
    getContestList,
    {
      getNextPageParam: (lastPage) => `t3_${lastPage[lastPage.length - 1].id}`
    }
  )

  const loadMoreButtonRef = useRef()

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage
  })
  
  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle><Link href="/">/r/PhotoshopBattles</Link></PageTitle>
          <div className="flex space-x-2">
            <a
              type="button"
              target="_blank"
              href="https://www.reddit.com/r/photoshopbattles/submit"
              className="hidden sm:inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
              Contest
            </a>
            <a
              href="https://www.reddit.com/r/photoshopbattles/"
              target="_blank"
              className="relative inline"
            >
              <RedditIcon/>
            </a>
          </div>
        </PageHeader>
        {error && <h3>An error has occured: ' {error.message}</h3>}
        {pages && <ContestGrid paginatedContests={pages}/>}
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed my-4 w-full h-12 transition-colors duration-150 focus:shadow-outline bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          ref={loadMoreButtonRef}
          disabled={isFetching || isFetchingNextPage}
          onClick={() => fetchNextPage}
        >
          Load More
        </button>
        {(isFetching || isFetchingNextPage) && 
          <div className="flex justify-center items-center my-4">
            <LoadingIndicator/>
          </div>
        }
      </PageContainer>
    </Layout>
  )
}

interface ContestGridProps {
  paginatedContests: PaginatedContests
}

const ContestGrid: React.FC<ContestGridProps> = ({ paginatedContests }) => (
  <ul role="list" className="grid grid-cols-2 xs:grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
    {paginatedContests.map(contests => (
      contests.map((contest: Contest) => (
        <li key={contest.id} className="relative">
          <div className="">
            <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              <img
                src={contest.imageUrl}
                alt="contest image"
                className="object-cover pointer-events-none group-hover:opacity-75"
                referrerPolicy="no-referrer"
              />
              <Link href={`contests/${contest.id}`}>
                <a type="button" className="absolute inset-0 focus:outline-none">
                  <span className="sr-only">View details for {contest.title}</span>
                </a>
              </Link>
            </div>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{contest.title}</p>
            <p className="block text-sm font-medium text-gray-500 pointer-events-none">{contest.author}</p>
          </div>
        </li>
      ))
    ))}
  </ul>
)
