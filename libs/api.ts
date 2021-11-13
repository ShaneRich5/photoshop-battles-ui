import axios from 'axios'
import { Contest, ContestDetailResponse, ContestListResponse } from './contracts'

const REDDIT_URL = 'https://www.reddit.com'
const PHOTOSHOP_BATTLES_ENDPOINT = '/r/photoshopbattles'
const JSON_EXTENSION = '.json'

export const redditApi = axios.create({
  baseURL: REDDIT_URL + PHOTOSHOP_BATTLES_ENDPOINT
})

const parsePostToContest = (post: any): Contest => ({
  id: post.id,
  title: post.title,
  imageUrl: post.url,
  author: post.author,
  upvoteCount: post.ups,
  permalink: post.permalink,
})

export const getContestList = async (): Promise<ContestListResponse> => {
  const response = await redditApi.get('/' + JSON_EXTENSION)
  const { data: { data: { children } } } = response
  
  return children.map(({ data }) => data)
    .filter((post: any) => post.title.startsWith('PsBattle:'))
    .map(parsePostToContest)
}

export const getPostDetail = async (postId: string): Promise<ContestDetailResponse> => {
  const response = await redditApi.get(`/comments/${postId}/${JSON_EXTENSION}`)
  const { data: [ postData, commentData ]} = response
  const { data: { children: [{ data: post }] } } = postData
  const contest = parsePostToContest(post)
  const { data: { children } } = commentData

  const submissions = children.map(({ data }) => data)
    .map((comment: any) => ({
      id: comment.id,
      author: comment.author,
      body: comment.body,
      permalink: comment.permalink,
      upvoteCount: comment.ups,
    }))

  return { contest, submissions }
}
