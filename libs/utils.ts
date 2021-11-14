import { IMGUR_ALBUM_URL, TEXT_WRAPPER_EXPRESSION, URL_WRAPPER_EXPRESSION } from "./constants"

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
