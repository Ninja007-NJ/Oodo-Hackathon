import MiniSearch from 'minisearch'
import { screenNote, DISCLAIMER } from './legal'

/*
  Study assistant (retrieval first).
  It only uses notes the student can access. This version runs in the browser and does not
  call an AI model: it finds passages and builds simple notes by picking key sentences.
  To add a real language model, set VITE_CHAT_URL to your backend; it receives the
  question plus the retrieved passages only, and returns { reply }.
*/
const STOP = new Set('a an the and or of to in on for from with about is are was were be it its this that these those as at by my me i you please make create write give prepare simple short notes note summary summarise summarize what how why where when which who can could do does tell show find'.split(' '))
const words = (s) => (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => !STOP.has(w) && w.length > 2)
const sentences = (text) => text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [text.trim()]
const cleanQuery = (q) => words(q).join(' ') || q

function chunksOf(docs) {
  const out = []
  docs.forEach((d) => {
    const s = sentences(d.text)
    for (let i = 0; i < s.length; i += 2) {
      out.push({ cid: `${d.id}-${i}`, docId: d.id, title: d.title, topic: d.topic, text: s.slice(i, i + 2).join(' ') })
    }
  })
  return out
}

export function search(docs, query, boostTopic) {
  if (!docs.length) return []
  const ms = new MiniSearch({
    idField: 'cid', fields: ['text', 'title'], storeFields: ['docId', 'title', 'topic', 'text'],
    searchOptions: { prefix: true, fuzzy: 0.2, combineWith: 'OR', boost: { title: 2 } },
  })
  ms.addAll(chunksOf(docs))
  return ms.search(cleanQuery(query))
    .map((h) => ({ ...h, score: h.score * (h.topic === boostTopic ? 1.5 : 1) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
}

export function simpleNotes(text, n = 6) {
  const sents = sentences(text).filter((s) => s.length > 25)
  if (sents.length <= n) return sents.map((s) => `• ${s}`).join('\n')
  const freq = {}
  words(text).forEach((w) => { freq[w] = (freq[w] || 0) + 1 })
  return sents
    .map((s, i) => ({ s, i, score: words(s).reduce((a, w) => a + (freq[w] || 0), 0) / Math.sqrt(words(s).length || 1) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .sort((a, b) => a.i - b.i)
    .map((x) => `• ${x.s}`)
    .join('\n')
}

export async function respond(question, { docs, topic, links }) {
  const q = question.trim()
  const lower = q.toLowerCase()
  const here = docs.filter((d) => d.topic === topic.id)

  // 1. Legal check
  if (/(legal|copyright|allowed to share|safe to share|ok to share|permission|licen[cs]e)/.test(lower)) {
    const hit = search(docs, q, topic.id)[0]
    const doc = docs.find((d) => d.id === hit?.docId) ?? here[0]
    if (!doc) return { text: 'There is no readable note to check yet. Open or upload a note first.' }
    const res = screenNote({ text: doc.text, filename: doc.title, declaration: doc.declaration ?? 'own', source: doc.license ?? '' })
    const lines = res.flags.length ? res.flags.map((f) => `• ${f}`).join('\n') : '• No warning signs found in the text.'
    return { text: `Check on "${doc.title}":\n${lines}\n\n${DISCLAIMER}`, sources: [{ id: doc.id, title: doc.title }] }
  }

  // 2. Simple notes
  if (/(notes|summary|summar(ise|ize)|revision)/.test(lower) && /(make|create|write|give|prepare|simple|short|summar)/.test(lower)) {
    const hit = search(docs, q, topic.id)[0]
    const chosen = hit ? docs.filter((d) => d.id === hit.docId) : here.slice(0, 2)
    if (!chosen.length) return { text: 'I have no readable notes for this topic yet, so there is nothing to summarise. Upload notes first, or ask me for lesson links.', links: links.slice(0, 3) }
    const notes = simpleNotes(chosen.map((d) => d.text).join('\n\n'), 6)
    return {
      text: `Simple notes from ${chosen.map((d) => `"${d.title}"`).join(' and ')}:\n${notes}\n\nThese are key sentences taken from the notes, so check them against your syllabus.`,
      sources: chosen.map((d) => ({ id: d.id, title: d.title })),
      actions: [{ label: 'Add to my typed notes', text: notes }],
    }
  }

  // 3. What is missing
  if (/(missing|not covered|gaps?|what.*left)/.test(lower)) {
    return {
      text: topic.missing.length
        ? `For ${topic.title}, these parts still need material:\n${topic.missing.map((m) => `• ${m}`).join('\n')}\n\nThis is an estimate. Try the lesson links or ask the class for notes.`
        : `All required subtopics for ${topic.title} have supporting resources (an estimate, not proof you are exam-ready).`,
      links: links.slice(0, 3),
    }
  }

  // 4. Videos and free lessons
  if (/(video|youtube|lesson|watch|course|tutorial|channel)/.test(lower)) {
    return { text: `Free lessons for ${topic.title}. Check each one matches your syllabus:`, links }
  }

  // 5. Answer from the notes
  const hits = search(docs, q, topic.id)
  if (!hits.length) {
    return {
      text: `I couldn't find anything about that in the notes for ${topic.title}. Try searching all topics, or use the free lesson links below.`,
      links: links.slice(0, 3),
    }
  }

  const excerpt = hits.map((h) => `• "${h.text}"`).join('\n\n')
  return {
    text: `Here is what your notes say about that:\n\n${excerpt}`,
    sources: [...new Map(hits.map((h) => [h.docId, { id: h.docId, title: h.title }])).values()],
    actions: [{ label: 'Copy to my typed notes', text: hits.map((h) => h.text).join('\n\n') }],
  }
}
