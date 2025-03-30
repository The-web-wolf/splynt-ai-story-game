import { ALLOWED_HTML_TAGS } from "./constants";
import DOMPurify from "dompurify"

export const purifyText = (text) => {
  if(!text) return

  return DOMPurify.sanitize(text, {ALLOWED_TAGS: ALLOWED_HTML_TAGS})
}
