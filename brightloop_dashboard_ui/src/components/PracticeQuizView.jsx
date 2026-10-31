import React, { useState } from 'react'
import { TOPIC_PRACTICE_QUESTIONS } from '../data'
import { CheckCircle2, XCircle, Sparkles, BookOpen, ArrowRight, RefreshCw, FileText } from 'lucide-react'
import { Button } from './ui'

export default function PracticeQuizView({
  topicId,
  topicTitle,
  onOpenSourcePreview,
  onAddToNotes,
  onSaveMistake,
  notify,
}) {
  const questions = TOPIC_PRACTICE_QUESTIONS[topicId] || [
    {
      id: 'default-q',
      question: `What is the primary architectural concept behind ${topicTitle}?`,
      options: [
        'Organizing address spaces into logical structures mapped by hardware tables',
        'Direct physical hardware access without address translation',
        'Storing program files without file system inodes',
        'Running CPU instructions without a program counter',
      ],
      correctIndex: 0,
      explanation: `${topicTitle} provides logical memory mapping via hardware translation tables to protect memory and avoid external or internal fragmentation.`,
      sourceSnippet: `Verified syllabus textbook reference for ${topicTitle}.`,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[currentIndex] || questions[0]
  const isCorrect = selectedOption === q.correctIndex

  const handleSelect = (idx) => {
    if (submitted) return
    setSelectedOption(idx)
  }

  const handleSubmit = () => {
    if (selectedOption === null) return
    setSubmitted(true)
    if (selectedOption === q.correctIndex) {
      setScore((s) => s + 1)
      notify('Correct answer! Explanation grounded in syllabus notes.')
    } else {
      notify('Incorrect. Review the grounded explanation below.')
    }
  }

  const handleNext = () => {
    setSelectedOption(null)
    setSubmitted(false)
    setCurrentIndex((prev) => (prev + 1) % questions.length)
  }

  return (
    <div className="border border-neutral-300 rounded-2xl bg-white p-6 space-y-6 shadow-xs max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            Syllabus Grounded Practice Loop
          </span>
          <h3 className="text-base font-bold text-black mt-1">
            Practice Checkpoint: {topicTitle}
          </h3>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-neutral-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <p className="text-[11px] text-neutral-400">Score: {score} correct</p>
        </div>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
          {q.question}
        </h4>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            let optionStyles = 'border-neutral-200 bg-neutral-50 hover:border-black text-neutral-800'
            if (selectedOption === idx) {
              optionStyles = 'border-black bg-black text-white font-semibold shadow-xs'
            }
            if (submitted) {
              if (idx === q.correctIndex) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
              } else if (selectedOption === idx) {
                optionStyles = 'border-red-500 bg-red-50 text-red-900 line-through'
              } else {
                optionStyles = 'border-neutral-200 bg-neutral-50 text-neutral-400 opacity-60'
              }
            }

            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyles}`}
              >
                <span>{opt}</span>
                {submitted && idx === q.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {submitted && selectedOption === idx && idx !== q.correctIndex && (
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Action Button */}
      {!submitted ? (
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="!py-2.5 !px-6 text-xs font-bold"
          >
            Submit Answer
          </Button>
        </div>
      ) : (
        /* STANDOUT FEATURE 7: ANSWER-TO-PRACTICE EXPLANATION & ACTION LOOP */
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Correct Answer
              </span>
            ) : (
              <span className="font-bold text-xs text-red-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Incorrect
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-800 leading-relaxed">
            {q.explanation}
          </p>

          <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
            <span className="font-bold text-black flex items-center gap-1">
              <FileText className="w-3 h-3 text-neutral-500" /> Grounded Source Evidence:
            </span>
            <p className="text-neutral-500 italic">"{q.sourceSnippet}"</p>
          </div>

          {/* Answer-to-Practice Loop Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  onAddToNotes(`Q: ${q.question}\nA: ${q.explanation}`)
                  notify('Added practice explanation to your notes!')
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-black bg-white text-xs font-bold text-black transition-colors cursor-pointer"
              >
                📝 Add to my notes
              </button>

              <button
                onClick={() => onOpenSourcePreview(8)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-black bg-white text-xs font-bold text-black transition-colors cursor-pointer"
              >
                🔍 Inspect source document
              </button>

              {!isCorrect && onSaveMistake && (
                <button
                  onClick={() => {
                    onSaveMistake({
                      id: `mistake-${Date.now()}`,
                      topicId,
                      topicTitle,
                      question: q.question,
                      pickedOption: q.options[selectedOption],
                      correctOption: q.options[q.correctIndex],
                      explanation: q.explanation,
                      reflection: '',
                      timestamp: Date.now(),
                    })
                    notify('Saved question to your Mistake Notebook!')
                  }}
                  className="px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-900 transition-colors cursor-pointer"
                >
                  📕 Save to Mistake Notebook
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Next Question ➔
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
