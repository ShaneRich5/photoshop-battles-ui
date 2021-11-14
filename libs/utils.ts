import { IMGUR_ALBUM_URL } from "./constants"

export const parseWrappedText = (text: string, regex: RegExp) => {
  const parsedText = text.match(regex)[0]
  return parsedText.slice(1, parsedText.length - 1)
}

export const parseImageUrlFromCommentBody = (body: string) => {
  try {
    return parseWrappedText(body, /\(.*?\)/)
  } catch {
    return null
  }
}

export const parseTextFromCommentBody = (body: string) => {
  try {
    return parseWrappedText(body, /\[.*?\]/)
  } catch {
    return null
  }
}

export const isImgurAlbumUrl = (url: string) => url.includes(IMGUR_ALBUM_URL)

export const checkForValidImageExtension = (extension: string) =>
  ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'svg'].includes(extension)
