import React from 'react'
import { AlertCircle, BookOpen, ArrowRight, ShieldCheck, CheckCircle2, X } from 'lucide-react'
import { CLASS_MISCONCEPTIONS } from '../data'

export default function MisconceptionModal({ isOpen, onClose, onSelectTopic }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl border border-neutral-300 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="misconception-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Cohort Insights (Privacy-Preserved)
              </span>
            </div>
            <h2 id="misconception-modal-title" className="text-xl font-black text-black tracking-tight mt-1">
              Class Misconception Map
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Identifies which syllabus topics generate the most confusion on practice questions. Individual scores are completely private.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 flex items-center gap-2.5 text-xs text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero Individual Surveillance:</strong> Only aggregate frequencies across 30+ students are analyzed to suggest focused revision.
            </span>
          </div>

          <div className="space-y-3">
            {CLASS_MISCONCEPTIONS.map((item) => (
              <div
                key={item.id}
                className="border border-neutral-200 rounded-2xl p-4 bg-white hover:border-black transition-all space-y-2.5 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-black">{item.concept}</span>
                    <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      in {item.topicTitle}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                    {item.incorrectRate}% incorrect answers
                  </span>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed">
                  <strong>Common Pitfall:</strong> {item.pitfall}
                </p>

                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-purple-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Recommended Revision:</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    {item.recommendation}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono pt-0.5">
                    Source: {item.sourceCitation}
                  </p>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      onClose()
                      onSelectTopic(item.topicId)
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-black hover:underline cursor-pointer"
                  >
                    <span>Open {item.topicTitle} workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Updated from last week's class practice session
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  )
}
