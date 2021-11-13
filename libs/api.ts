import axios from 'axios'

const REDDIT_URL = 'https://www.reddit.com'
const PHOTOSHOP_BATTLES_ENDPOINT = '/r/photoshopbattles'

export const redditApi = axios.create({
  baseURL: REDDIT_URL + PHOTOSHOP_BATTLES_ENDPOINT
})


export const getPosts = async () => {
  return await redditApi.get('/.json')
}