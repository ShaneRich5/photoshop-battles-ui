import Layout from 'components/Layout'
import { useCallback, useEffect, useState } from 'react'
import { getPosts } from 'libs/api'
import Link from 'next/link'


interface Contest {
  id: string
  title: string
  imageUrl: string
  upvoteCount: number
}
export default function Home() {
  const [contests, setContests] = useState([])

  const loadInitialData = useCallback(async () => {
    const response = await getPosts()
    const { data: { data: { children } } } = response
    const posts = children.map(({ data }) => data)
      .filter((post: any) => post.title.startsWith('PsBattle:'))
      
    const parsedContests: Contest[] = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      imageUrl: post.url,
      upvoteCount: post.ups,
      submissionEndpoint: post.permalink,
    }))

    setContests(parsedContests)
  
    console.log('response:', response)
    console.log('children:', children)
    console.log('posts:', posts)
    console.log('tmp:', posts.map(post => post.title))
    console.log('parsedContests:', parsedContests)
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  return (
    <Layout>
      <div className="container mx-auto sm:px-6 lg:px-8">
        
        <div className="flex-1 min-w-0 py-4">
          <h1 className="text-2xl font-bold leading-7 text-gray-500 sm:text-3xl sm:truncate">Photoshop Battles</h1>
        </div>

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
      </div>
    </Layout>
  )
}
