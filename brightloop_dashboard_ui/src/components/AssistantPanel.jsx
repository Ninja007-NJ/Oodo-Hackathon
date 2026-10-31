import React, { useEffect, useRef, useState } from 'react'
import { respond } from '../assistant'
import { learningLinks } from '../lib'
import { Button, Spinner, focusRing, inputCls } from './ui'
import { Sparkles, HelpCircle, FileText, ArrowRight, BookOpen, Check, ShieldCheck } from 'lucide-react'

const CHIPS = [
  'Explain Segmentation in simple terms',
  'What is missing in this topic?',
  'Make a practice question for this',
  'Compare Paging vs Segmentation',
]

export default function AssistantPanel({
  subject,
  topic,
  docs,
  unreadable = 0,
  onSelectDoc,
  onAddToNotes,
  onOpenPractice,
}) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)
  const links = learningLinks(subject, topic)
  const flat = [...links.channels.slice(0, 2), links.general, ...links.platforms.slice(0, 1)]

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, busy])

  const ask = async (question) => {
    const q = question.trim()
    if (!q || busy) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setBusy(true)

    try {
      const reply = await respond(q, { docs, topic, links: flat })
      setMessages((m) => [...m, { role: 'assistant', ...reply }])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'I can only answer questions grounded in your syllabus notes. No verified notes matched your query.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  // Answer-to-practice loop action triggers
  const handleExplainSimply = (originalText) => {
    ask(`Explain more simply: "${originalText.slice(0, 80)}…"`)
  }

  const handleMakePracticeQuestion = () => {
    if (onOpenPractice) {
      onOpenPractice()
    } else {
      ask(`Generate a practice question with 4 options and an explanation based on ${topic.title} notes.`)
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white p-3 space-y-3">
      {/* Grounding Status Header */}
      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-black text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Source-Grounded Study Assistant</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Searches {docs.length} verified notes attached to {topic.title}. All answers cite supporting passages.
        </p>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1" aria-live="polite">
        {messages.length === 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-black">Ask about {topic.title}, or pick a prompt:</p>
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => ask(c)}
                className="w-full text-left text-xs p-2.5 rounded-xl border border-neutral-200 hover:border-black bg-neutral-50 hover:bg-white text-neutral-800 transition-all cursor-pointer font-medium"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'space-y-2'}>
            <div
              className={`max-w-[95%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-black text-white font-medium ml-auto'
                  : 'bg-neutral-50 border border-neutral-200 text-black shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Source Citations */}
              {m.sources?.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-neutral-200/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-400">SOURCES:</span>
                  {m.sources.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelectDoc(s.id)}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-neutral-300 hover:border-black text-black transition-colors cursor-pointer"
                    >
                      📄 {s.title}
                    </button>
                  ))}
                </div>
              )}

              {/* STANDOUT FEATURE 7: ANSWER-TO-PRACTICE LOOP CONTROLS */}
              {m.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-neutral-200 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleExplainSimply(m.text)}
                    className="px-2.5 py-1 rounded-lg border border-neutral-300 hover:border-black bg-white text-[11px] font-bold text-neutral-800 transition-colors cursor-pointer"
                  >
                    💡 Explain simply
                  </button>

                  <button
                    onClick={handleMakePracticeQuestion}
                    className="px-2.5 py-1 rounded-lg border border-neutral-300 hover:border-black bg-white text-[11px] font-bold text-neutral-800 transition-colors cursor-pointer"
                  >
                    ❓ Practice question
                  </button>

                  <button
                    onClick={() => onAddToNotes(m.text)}
                    className="px-2.5 py-1 rounded-lg border border-neutral-300 hover:border-black bg-white text-[11px] font-bold text-neutral-800 transition-colors cursor-pointer"
                  >
                    📝 Add to my notes
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <p className="flex items-center gap-2 text-xs text-neutral-500 p-2">
            <Spinner /> Grounding answer in {topic.title} syllabus notes…
          </p>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); ask(input) }} className="flex gap-2 pt-2 border-t border-neutral-200">
        <input
          className={`${inputCls} !py-2 text-xs`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${topic.title}…`}
          aria-label="Ask the study assistant"
        />
        <Button type="submit" disabled={!input.trim() || busy} className="!px-4 !py-2 text-xs font-bold">
          Ask
        </Button>
      </form>
    </div>
  )
}
