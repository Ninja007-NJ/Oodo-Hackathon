import React, { useState } from 'react'
import { STATUS } from '../data'
import { SECTIONS } from '../lib'
import { ProgressRing, focusRing } from './ui'
import { ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react'

// Coverage weights for resources
const WEIGHT = { covered: 1, partial: 0.5, review: 0.25, missing: 0 }
const CONF_WEIGHT = { confident: 1, shaky: 0.5, not_started: 0 }

const BAR_BG = {
  covered: 'bg-emerald-500',
  partial: 'bg-amber-400',
  missing: 'bg-neutral-300',
  review: 'bg-purple-500',
}

export default function InsightsCard({
  subject,
  topics,
  resources,
  user,
  confidenceRatings = {},
  onOpenTopic,
}) {
  const [open, setOpen] = useState(false)
  const [ringMode, setRingMode] = useState('confidence') // 'confidence' | 'evidence'

  const n = topics.length || 1

  // 1. Evidence Coverage calculation
  const evidencePct = Math.round(
    (topics.reduce((a, t) => a + (WEIGHT[t.status] ?? 0), 0) / n) * 100
  )

  // 2. Student Self-Rated Confidence calculation
  const confidencePct = Math.round(
    (topics.reduce((a, t) => a + (CONF_WEIGHT[confidenceRatings[t.id] || 'not_started'] ?? 0), 0) / n) * 100
  )

  const activePct = ringMode === 'confidence' ? confidencePct : evidencePct

  const counts = Object.keys(STATUS).map((k) => ({
    key: k,
    n: topics.filter((t) => t.status === k).length,
  }))

  const confCounts = {
    confident: topics.filter((t) => confidenceRatings[t.id] === 'confident').length,
    shaky: topics.filter((t) => confidenceRatings[t.id] === 'shaky').length,
    not_started: topics.filter((t) => !confidenceRatings[t.id] || confidenceRatings[t.id] === 'not_started').length,
  }

  const byType = SECTIONS.map((s) => ({
    ...s,
    n: resources.filter((r) => r.type === s.id).length,
  }))

  const next = [...topics]
    .map((t) => ({ t, c: resources.filter((r) => r.topic === t.id).length }))
    .sort((a, b) => (WEIGHT[a.t.status] ?? 0) - (WEIGHT[b.t.status] ?? 0) || a.c - b.c)
    .slice(0, 3)

  return (
    <section
      className="border border-neutral-300 rounded-2xl bg-white p-4 shadow-xs transition-all duration-200"
      aria-label="Your progress"
    >
      {/* Compact Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Progress Ring */}
        <div className="flex items-center gap-4 min-w-0">
          <ProgressRing value={activePct} size={54} label={ringMode === 'confidence' ? 'Confidence' : 'Coverage'} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-black truncate">
                {ringMode === 'confidence' ? 'Your Confidence' : 'Resource Evidence'} <span className="font-normal text-neutral-400">·</span> {subject?.title || 'Operating Systems'}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 truncate mt-0.5">
              {ringMode === 'confidence'
                ? `Personal understanding rating (${confCounts.confident} confident, ${confCounts.shaky} shaky)`
                : `Estimated evidence coverage across ${n} topics`}
            </p>
          </div>
        </div>

        {/* Right: Switch Mode & Toggle Details */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-[11px]">
            <button
              onClick={() => setRingMode('confidence')}
              className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                ringMode === 'confidence' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
              title="Show progress based on your self-rated understanding"
            >
              My Rating
            </button>
            <button
              onClick={() => setRingMode('evidence')}
              className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                ringMode === 'evidence' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
              title="Show progress based on attached notes & resources"
            >
              Evidence
            </button>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className={`flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer ${focusRing}`}
            aria-expanded={open}
          >
            <span>{open ? 'Hide' : 'Details'}</span>
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Breakdown */}
      {open && (
        <div className="mt-4 pt-4 border-t border-neutral-200 grid md:grid-cols-[auto_1fr] gap-6 text-xs animate-in fade-in duration-150">
          <div className="text-neutral-500 max-w-[150px] leading-relaxed">
            <span className="font-bold text-black block mb-1">Honest Metrics:</span>
            Your rating measures subjective understanding. Evidence measures notes, code, and questions attached to syllabus topics.
          </div>

          <div className="space-y-4 min-w-0">
            {/* Status Bars */}
            <div className="space-y-2">
              {counts.map(({ key, n: c }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-black font-medium flex items-center gap-1.5">
                    <span>{STATUS[key].icon}</span>
                    <span>{STATUS[key].label.replace(' (estimate)', '')}</span>
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${BAR_BG[key]} transition-all duration-300`}
                      style={{ width: `${(c / n) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-neutral-500 font-bold">{c}</span>
                </div>
              ))}
            </div>

            {/* Resource types count */}
            <div className="flex flex-wrap gap-2 pt-1">
              {byType.map((s) => (
                <span key={s.id} className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium">
                  {s.icon} {s.label} ({s.n})
                </span>
              ))}
            </div>

            {/* Study next */}
            <div>
              <p className="font-bold text-black mb-1.5">Recommended next focus:</p>
              <ul className="space-y-1.5">
                {next.map(({ t, c }) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                    <span className="text-black font-semibold truncate">
                      {t.title} <span className="text-neutral-400 font-normal">({c} resources)</span>
                    </span>
                    <button
                      onClick={() => onOpenTopic(t.id)}
                      className="text-xs font-bold text-black hover:underline px-2 py-0.5 rounded bg-white border border-neutral-300 hover:border-black cursor-pointer"
                    >
                      Open topic ↗
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
