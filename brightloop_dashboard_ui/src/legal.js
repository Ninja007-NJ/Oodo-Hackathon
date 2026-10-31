/*
  Automatic screening of uploaded notes.
  IMPORTANT: this looks for warning signs only. It cannot confirm who owns the copyright
  or whether sharing is legal. Anything suspicious goes to a person (moderator) for review.
*/
export const DISCLAIMER = 'This is an automatic screen for warning signs, not a legal ruling.'

const MARKERS = [
  [/©|\(c\)\s*\d{4}|copyright\s+\d{4}/i, 'Contains a copyright notice'],
  [/all rights reserved/i, 'Says "all rights reserved"'],
  [/\bisbn[\s:-]*[\dxX-]{10,17}/i, 'Contains an ISBN, so it may be book content'],
  [/no part of this (publication|book|document)/i, 'Contains a publisher reproduction restriction'],
  [/(downloaded from|scribd|course ?hero|chegg|studocu)/i, 'Mentions a document-sharing site, so it may be copied'],
  [/(solution manual|answer key|instructor'?s? edition)/i, 'Looks like restricted teaching material'],
]

export const normalise = (t) => t.toLowerCase().replace(/\s+/g, ' ').trim()
export const hashText = (t) => {
  let h = 5381
  for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0
  return String(h)
}

export function screenNote({ text = '', filename = '', declaration, source = '', existing = [] }) {
  const flags = []
  const scanned = text.trim().length > 0
  const words = text.split(/\s+/).filter(Boolean).length

  if (scanned) MARKERS.forEach(([re, msg]) => { if (re.test(text)) flags.push(msg) })
  if (words > 6000) flags.push('Very long text, so it may be a full chapter or book')
  if (/(solution|textbook|full[-_ ]?book|ebook)/i.test(filename)) flags.push('The file name suggests a textbook or solution manual')
  if (filename && !scanned) flags.push('The file content could not be read here, so it was not checked')
  if ((declaration === 'open' || declaration === 'permission') && !source.trim()) flags.push('No licence or source was named')

  const hash = scanned ? hashText(normalise(text)) : null
  if (hash && existing.some((e) => e.hash === hash)) flags.push('The same text is already in the library (duplicate)')

  let level = 'ok'
  if (!declaration || declaration === 'unsure') level = 'private'
  else if (flags.length) level = 'review'

  const summary = {
    ok: 'No warning signs found. It can be shared on your declaration.',
    review: 'A moderator needs to look at it before classmates can see it.',
    private: 'Saved privately. Share it only when you are sure it is yours or you have permission.',
  }[level]

  return { level, flags, hash, scanned, words, summary }
}
