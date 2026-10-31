import React, { useState } from 'react'
import { Button, focusRing } from './ui'
import { X, BookX, Trash2, Edit3, CheckCircle2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'

export default function MistakeNotebookModal({
  isOpen,
  onClose,
  mistakes = [],
  onUpdateReflection,
  onRemoveMistake,
  onJumpToTopic,
  notify,
}) {
  const [editingId, setEditingId] = useState(null)
  const [reflectionText, setReflectionText] = useState('')

  const handleStartEdit = (m) => {
    setEditingId(m.id)
    setReflectionText(m.reflection || '')
  }

  const handleSaveEdit = (id) => {
    onUpdateReflection(id, reflectionText)
    setEditingId(null)
    notify('Saved personal reflection to mistake notebook.')
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white border-2 border-black rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl border border-neutral-300 hover:border-black text-neutral-500 hover:text-black cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
            Active Recall & Trap Prevention
          </span>
          <h2 className="text-xl font-black text-black mt-1">
            Personal Mistake Notebook
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Reviewing questions you got wrong and recording why is more effective for exam readiness than re-reading notes.
          </p>
        </div>

        {/* Empty State */}
        {mistakes.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-neutral-50 rounded-2xl border border-neutral-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-black text-black text-sm">Mistake Notebook is Empty!</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Whenever you answer a practice quiz question incorrectly, save it here with your reasoning to review before exams.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {mistakes.map((m) => (
              <div
                key={m.id}
                className="p-4 border-2 border-black rounded-2xl bg-neutral-50 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {m.topicTitle || 'Syllabus Topic'}
                    </span>
                    <h3 className="font-bold text-black text-sm mt-1.5 leading-snug">
                      {m.question}
                    </h3>
                  </div>

                  <button
                    onClick={() => onRemoveMistake(m.id)}
                    className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove from notebook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Answer Options comparison */}
                <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-900">
                    <span className="font-bold block text-red-700">What you picked:</span>
                    <span>{m.pickedOption}</span>
                  </div>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                    <span className="font-bold block text-emerald-700">Correct syllabus answer:</span>
                    <span>{m.correctOption}</span>
                  </div>
                </div>

                {/* Reflection Note */}
                <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Why I got this wrong & what to remember:</span>
                    </span>

                    {editingId !== m.id && (
                      <button
                        onClick={() => handleStartEdit(m)}
                        className="text-neutral-500 hover:text-black font-semibold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit note</span>
                      </button>
                    )}
                  </div>

                  {editingId === m.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        placeholder="e.g. Confused Convoy Effect with Starvation..."
                        className="w-full p-2 border border-black rounded-lg text-xs"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-[11px] text-neutral-600 hover:text-black cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(m.id)}
                          className="px-3 py-1 bg-black text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-700 italic">
                      {m.reflection ? `"${m.reflection}"` : 'No reflection written yet. Click edit note to record your thought.'}
                    </p>
                  )}
                </div>

                {/* Topic Jump Link */}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-neutral-400 font-mono text-[10px]">
                    Added: {new Date(m.timestamp || Date.now()).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => {
                      onJumpToTopic(m.topicId)
                      onClose()
                    }}
                    className="inline-flex items-center gap-1 font-bold text-black hover:underline cursor-pointer"
                  >
                    <span>Review in Topic Workspace</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
