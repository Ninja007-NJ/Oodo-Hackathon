/* Safe localStorage helpers (never crash if storage is blocked) */
export const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
export const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

export const SECTIONS = [
  { id: 'notes', label: 'Notes', icon: '📄' },
  { id: 'videos', label: 'Videos', icon: '▶' },
  { id: 'code', label: 'Code', icon: '💻' },
  { id: 'textbook', label: 'Textbook', icon: '📘' },
  { id: 'pyqs', label: 'Past questions', icon: '❓' },
]
export const iconFor = (t) => SECTIONS.find((s) => s.id === t)?.icon ?? '📄'
export const labelFor = (t) => SECTIONS.find((s) => s.id === t)?.label ?? t

export const youtubeId = (url) => {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    if (u.hostname.endsWith('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v')
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2]
    }
  } catch { /* not a URL */ }
  return null
}
export const guessType = (url) => {
  if (youtubeId(url)) return 'videos'
  if (/github\.com|gitlab\.com/.test(url)) return 'code'
  return 'notes'
}
export const hostOf = (url) => { try { return new URL(url).hostname.replace('www.', '') } catch { return 'link' } }
export const isUrl = (s) => /^https?:\/\/\S+$/i.test(s.trim())

/* Visibility: shared notes are visible to everyone; pending and private ones only to their owner */
export const canSee = (r, user) => !r.visibility || r.visibility === 'shared' || r.owner === user?.email

/* Small badge describing where a note stands legally (a screening label, never a legal ruling) */
export const noteBadge = (r) => {
  if (r.visibility === 'pending') return { text: 'Under review (only you can see it)', tone: 'review' }
  if (r.visibility === 'private') return { text: 'Private', tone: 'private' }
  if (r.owner === 'seed') return { text: 'Sample note', tone: 'sample' }
  const text = { own: 'Declared original', open: 'Open licence', permission: 'Permission stated' }[r.declaration] ?? 'Shared'
  return { text, tone: 'ok' }
}

/* Free learning links for a topic. YouTube links are search pages (no API key needed). */
const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
export const learningLinks = (subject, topic) => ({
  channels: (subject.channels ?? []).map((c) => ({ label: c, url: yt(`${topic.title} ${subject.title} ${c}`) })),
  general: { label: 'All YouTube results', url: yt(`${topic.title} ${subject.title} lecture`) },
  platforms: [
    { label: 'NPTEL', url: `https://www.google.com/search?q=${encodeURIComponent(`site:nptel.ac.in ${topic.title} ${subject.title}`)}` },
    { label: 'MIT OpenCourseWare', url: `https://ocw.mit.edu/search/?q=${encodeURIComponent(topic.title)}` },
    { label: 'Wikipedia', url: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(`${topic.title} ${subject.title}`)}` },
  ],
})

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')

/* Optional: real video results through the official YouTube Data API (set VITE_YOUTUBE_API_KEY).
   For production, call this from your backend so the key is not exposed in the browser. */
export const YT_ENABLED = Boolean(typeof import.meta !== 'undefined' && import.meta.env?.VITE_YOUTUBE_API_KEY)
export async function fetchVideos(query) {
  const apiKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_YOUTUBE_API_KEY : ''
  const u = new URL('https://www.googleapis.com/youtube/v3/search')
  u.search = new URLSearchParams({
    part: 'snippet', type: 'video', maxResults: '4', videoEmbeddable: 'true', safeSearch: 'strict',
    q: query, key: apiKey,
  })
  const res = await fetch(u)
  if (!res.ok) throw new Error('YouTube request failed')
  const json = await res.json()
  return (json.items ?? []).map((i) => ({ id: i.id.videoId, title: decode(i.snippet.title), channel: decode(i.snippet.channelTitle) }))
}

const STOP_WORDS = new Set(['the','and','for','with','from','that','this','notes','note','chapter','module','unit','lecture','study','materials','subject'])
export const suggestTopic = (filename, text, topics, fallbackId) => {
  const searchable = `${filename} ${String(text ?? '').slice(0, 50000)}`.toLowerCase()
  const ranked = topics.map((topic) => {
    const words = `${topic.title} ${topic.module ?? ''}`.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    const score = words.reduce((total, word) => {
      const safe = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const hits = (searchable.match(new RegExp(`\\b${safe}\\b`, 'g')) ?? []).length
      const fileHits = (filename.toLowerCase().match(new RegExp(`\\b${safe}\\b`, 'g')) ?? []).length
      return total + hits + fileHits * 5
    }, 0)
    return { id: topic.id, score }
  }).sort((a, b) => b.score - a.score)
  return ranked[0]?.score > 0 ? ranked[0] : { id: fallbackId ?? topics[0]?.id, score: 0 }
}
