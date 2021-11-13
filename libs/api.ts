import axios from 'axios'
import { Contest } from './contracts'

const REDDIT_URL = 'https://www.reddit.com'
const PHOTOSHOP_BATTLES_ENDPOINT = '/r/photoshopbattles'
const JSON_EXTENSION = '.json'

export const redditApi = axios.create({
  baseURL: REDDIT_URL + PHOTOSHOP_BATTLES_ENDPOINT
})

export const getContestList = async (): Promise<Contest[]> => {
  const response = await redditApi.get('/' + JSON_EXTENSION)
  const { data: { data: { children } } } = response
  
  return children.map(({ data }) => data)
    .filter((post: any) => post.title.startsWith('PsBattle:'))
    .map((post: any) => ({
      id: post.id,
      title: post.title,
      imageUrl: post.url,
      upvoteCount: post.ups,
      submissionEndpoint: post.permalink,
    }))
}

export const getPostDetail = async (postId: string) => {
  return await redditApi.get(`/comments/${postId}/${JSON_EXTENSION}`)
}