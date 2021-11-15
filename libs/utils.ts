import { getAlbumImageUrl, getGalleryImageUrl, getSingleImageUrl } from "./api"
import { IMGUR_ALBUM_URL, TEXT_WRAPPER_EXPRESSION, URL_WRAPPER_EXPRESSION } from "./constants"
import { FormattedSubmission, SubmissionUrlType } from "./contracts"

export const safelyParseWrappedText = (text: string, regex: RegExp) => {
  try {
    const parsedText = text.match(regex)[0]
    return parsedText.slice(1, parsedText.length - 1)
  } catch {
    return null
  }
}

export const parseImageUrlFromCommentBody = (body: string) =>
  safelyParseWrappedText(body, URL_WRAPPER_EXPRESSION)

export const parseTextFromCommentBody = (body: string) =>
  safelyParseWrappedText(body, TEXT_WRAPPER_EXPRESSION)

export const isImgurAlbumUrl = (url: string) => url.includes(IMGUR_ALBUM_URL)

export const checkForValidImageExtension = (extension: string) =>
  ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'svg'].includes(extension)

export const generateUrlType = (title: string, imageUrl: string): SubmissionUrlType => {
  if (imageUrl === null || title === 'deleted') return null

  const urlEndpoint = imageUrl.split('/').pop()
  const extension = urlEndpoint.split('.').pop()

  if (checkForValidImageExtension(extension)) return 'direct-link'
  if (imageUrl.includes('imgur.com/gallery/')) return 'imgur-gallery'
  if (imageUrl.includes('imgur.com/a/')) return 'imgur-album'
  if (imageUrl.includes('imgur.com/')) return 'imgur-direct'

  return null
}

export const convertImgurAlbumSubmissionToDirectLink = async (submission: FormattedSubmission): Promise<FormattedSubmission> => {
  const { imageUrl } = submission
  const albumHash = imageUrl.split('/').pop()
  const url = await getAlbumImageUrl(albumHash)

  return { ...submission, imageUrl: url }
}

export const convertImgurGallerySubmissionToDirectLink = async (submission: FormattedSubmission): Promise<FormattedSubmission> => {
  const { imageUrl } = submission
  const galleryHash = imageUrl.split('/').pop()
  const url = await getGalleryImageUrl(galleryHash)

  return { ...submission, imageUrl: url }
}

export const convertImgurDirectSubmissionToDirectLink = async (submission: FormattedSubmission): Promise<FormattedSubmission> => {
  const { imageUrl } = submission
  const imageHash = imageUrl.split('/').pop()
  const url = await getSingleImageUrl(imageHash)

  return { ...submission, imageUrl: url }
}

export function debounce(func: Function, wait: number, immediate = null) {
	let timeout: NodeJS.Timeout
	return function() {
		let context = this, args = arguments
		let later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		let callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}