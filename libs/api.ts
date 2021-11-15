import axios from 'axios'
import { Contest, ContestDetailResponse, ContestListResponse } from './contracts'

const REDDIT_URL = 'https://www.reddit.com'
const PHOTOSHOP_BATTLES_ENDPOINT = '/r/photoshopbattles'
const JSON_EXTENSION = '.json'

export const redditApi = axios.create({
  baseURL: REDDIT_URL + PHOTOSHOP_BATTLES_ENDPOINT
})

export const imgurApi = axios.create({
  baseURL: 'https://api.imgur.com/3',
  headers: {
    'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
  }
})

export const getAlbumImageUrl = async (albumHash: string): Promise<string> => {
  const { data: { data: [{ link }] } } = await imgurApi.get(`/album/${albumHash}/images`)
  return link
}

export const getGalleryImageUrl = async (galleryHash: string): Promise<string> => {
  const { data: { data: [{ link }] } } = await imgurApi.get(`/gallery/album/${galleryHash}/images`)
  return link
}

export const getSingleImageUrl = async (imageHash: string): Promise<string> => {
  const { data: { data: { link } } } = await imgurApi.get(`/image/${imageHash}`)
  return link
}

const parsePostToContest = (post: any): Contest => ({
  id: post.id,
  title: post.title,
  imageUrl: post.url,
  author: post.author,
  upvoteCount: post.ups,
  permalink: post.permalink,
})

export const getContestList = async ({ pageParam = null }): Promise<ContestListResponse> => {
  const response = await redditApi.get(`/${JSON_EXTENSION}?after=${pageParam}`)
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
    .slice(1)

  return { contest, submissions }
}
