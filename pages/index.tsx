import Layout from 'components/Layout'
import { useCallback, useEffect, useState } from 'react'
import { getContestList } from 'libs/api'
import Link from 'next/link'
import { Contest } from 'libs/contracts'
import { useQuery } from 'react-query'

export default function Home() {
  const { isLoading, error, data: contests } = useQuery(
    'contest-list',
    getContestList
  )

  return (
    <Layout>
      <div className="container mx-auto sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0 py-4">
          <h1 className="text-2xl font-bold leading-7 text-gray-500 sm:text-3xl sm:truncate">/r/photoshopbattles</h1>
        </div>
        {isLoading && <h3>Loading...</h3>}
        {error && <h3>An error has occured: ' {error}</h3>}
        {contests && <ContestGrid contests={contests}/>}
      </div>
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