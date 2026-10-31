/* Suggest which syllabus topic a note belongs to, by counting topic keywords in its title and text. */
export function suggestTopic({ title = '', text = '' }, topics) {
  const head = title.toLowerCase()
  const body = text.toLowerCase()
  const ranking = topics
    .map((topic) => {
      let score = 0
      const evidence = []
      ;[topic.title, ...topic.keywords].forEach((k) => {
        const key = k.toLowerCase()
        const inTitle = head.includes(key) ? 3 : 0
        const count = Math.min(body.split(key).length - 1, 5)
        if (inTitle + count > 0) { score += inTitle + count; evidence.push(k) }
      })
      return { topic, score, evidence: evidence.slice(0, 4) }
    })
    .sort((a, b) => b.score - a.score)

  const total = ranking.reduce((n, r) => n + r.score, 0)
  const best = ranking[0]
  const share = total ? best.score / total : 0
  const confidence = best.score >= 4 && share >= 0.6 ? 'high' : best.score >= 2 ? 'medium' : 'low'
  return { best: best.score >= 2 ? best : null, confidence, ranking: ranking.slice(0, 3) }
}
