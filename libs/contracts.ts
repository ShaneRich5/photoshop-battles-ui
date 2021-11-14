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

export type DirectLink = 'direct-link'
export type ImgurAlbum = 'imgur-album'
export type ImgurGallery = 'imgur-gallery'
export type ImgurDirect = 'imgur-direct'
export type SubmissionUrlType = DirectLink | ImgurAlbum | ImgurGallery | ImgurDirect | null

export interface FormattedSubmission extends Submission {
  title: string
  imageUrl: string
  urlType: SubmissionUrlType
}

export type ContestListResponse = Contest[]

export interface ContestDetailResponse {
  contest: Contest
  submissions: Submission[]
}

export type Previewable = FormattedSubmission | Contest