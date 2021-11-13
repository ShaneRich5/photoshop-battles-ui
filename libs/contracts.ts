export interface Contest {
  id: string
  title: string
  author: string
  imageUrl: string
  permalink: string
  upvoteCount: number
}

export interface Submission {
  id: string
  body: string
  author: string
  permalink: string
  upvoteCount: number
}

export type ContestListResponse = Contest[]

export interface ContestDetailResponse {
  contest: Contest
  submissions: Submission[]
}