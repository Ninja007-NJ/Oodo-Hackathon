import React, { useState, useEffect, useRef } from 'react'
import { Button, focusRing } from './ui'
import { X, Clock, Play, Pause, RotateCcw, CheckCircle2, FileText, AlertTriangle, BookOpen } from 'lucide-react'

const EXAM_PROMPTS = {
  'os-seg': {
    partA: {
      marks: 3,
      duration: 300, // 5 minutes
      question: 'Define Segmentation in Operating Systems. Specify the two components that make up a logical address in segmentation, and write the condition that triggers a protection trap.',
      modelAnswer: `1. Definition: Segmentation is a memory management scheme that divides logical address space into variable-sized logical units (code, heap, stack) instead of fixed blocks. (1 Mark)
2. Logical Address Components: Composed of a tuple <segment-number (s), offset (d)>. (1 Mark)
3. Protection Trap Condition: The hardware compares the offset against the segment table limit. If offset >= limit, an illegal memory protection violation trap (segmentation fault) is generated. (1 Mark)`,
    },
    partB: {
      marks: 14,
      duration: 1200, // 20 minutes
      question: 'With a neat architectural diagram, explain hardware address translation in segmentation. Discuss the fields of a segment table entry, explain protection bits, and compare fragmentation in segmentation versus paging.',
      modelAnswer: `1. Architectural Diagram & Flow (4 Marks):
   - CPU generates logical address <s, d>.
   - Segment number s indexes the Segment Table to retrieve <base, limit>.
   - Hardware validates: Is d < limit?
     * If YES: physical address = base + d. Access physical RAM.
     * If NO: Trap to OS (Addressing Exception / Segmentation fault).

2. Segment Table Fields & Protection (4 Marks):
   - Base address: Starting physical address of the segment.
   - Limit: Length/size of the segment.
   - Protection bits: Read, Write, Execute flags; Privileged mode bits.

3. Fragmentation Comparison with Paging (6 Marks):
   - Segmentation uses variable-sized blocks, causing External Fragmentation (scattered free memory holes between allocated segments). Compaction or Best-Fit/First-Fit required.
   - Paging uses fixed-size blocks (pages and frames), completely eliminating external fragmentation. However, unused space in the final frame causes Internal Fragmentation.`,
    },
  },
  default: {
    partA: {
      marks: 3,
      duration: 300,
      question: 'Explain the core architectural purpose of this syllabus topic. State the main formula and provide one concrete practical example.',
      modelAnswer: '1. Clear definition (1 Mark)\n2. Correct mathematical formula or state transition (1 Mark)\n3. Concrete engineering example (1 Mark)',
    },
    partB: {
      marks: 14,
      duration: 1200,
      question: 'Provide a detailed explanation of the system architecture, step-by-step mathematical working, failure edge cases, and performance tradeoffs.',
      modelAnswer: '1. Architecture & Diagram (4 Marks)\n2. Mathematical Execution Walkthrough (4 Marks)\n3. Edge Cases & Protection (3 Marks)\n4. Tradeoff Analysis & Comparison (3 Marks)',
    },
  },
}

export default function TimedAnswerPracticeModal({
  isOpen,
  onClose,
  topicId,
  topicTitle,
  notify,
}) {
  const [examType, setExamType] = useState('partA') // 'partA' (3 marks) | 'partB' (14 marks)
  const prompts = EXAM_PROMPTS[topicId] || EXAM_PROMPTS.default
  const currentPrompt = prompts[examType]

  const [timeLeft, setTimeLeft] = useState(currentPrompt.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [draft, setDraft] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Reset timer when exam type changes
  useEffect(() => {
    setTimeLeft(currentPrompt.duration)
    setIsRunning(false)
    setDraft('')
    setSubmitted(false)
  }, [examType, topicId])

  // Timer interval
  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      setSubmitted(true)
      notify('Time is up! Review your answer against the model rubric.')
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSubmit = () => {
    setIsRunning(false)
    setSubmitted(true)
    notify('Draft submitted. Self-evaluate against the model answer key below.')
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white border-2 border-black rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl border border-neutral-300 hover:border-black text-neutral-500 hover:text-black cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            KTU Exam-Format Timed Practice
          </span>
          <h2 className="text-xl font-black text-black mt-1">
            Timed Question Practice: {topicTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Practice writing concise 3-mark definitions or structured 14-mark university essays under exam time pressure.
          </p>
        </div>

        {/* Format Switcher & Timer Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-100 p-3 rounded-2xl border border-neutral-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExamType('partA')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                examType === 'partA' ? 'bg-black text-white shadow-xs' : 'bg-white text-neutral-700'
              }`}
            >
              Part A (3 Marks · 5 Mins)
            </button>

            <button
              onClick={() => setExamType('partB')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                examType === 'partB' ? 'bg-black text-white shadow-xs' : 'bg-white text-neutral-700'
              }`}
            >
              Part B (14 Marks · 20 Mins)
            </button>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-xl font-mono text-lg font-black flex items-center gap-1.5 border ${
                timeLeft < 60
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-white text-black border-neutral-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {!submitted && (
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 rounded-xl bg-black text-white hover:bg-neutral-800 cursor-pointer shadow-xs"
                title={isRunning ? 'Pause Timer' : 'Start Timer'}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Exam Question Box */}
        <div className="p-4 bg-neutral-50 border-2 border-black rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider">
            <span>Question Paper Item</span>
            <span className="text-black font-black font-mono">[{currentPrompt.marks} Marks]</span>
          </div>
          <p className="text-sm font-bold text-black leading-snug font-sans">
            {currentPrompt.question}
          </p>
        </div>

        {/* Answer Drafting Area */}
        {!submitted ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span className="font-semibold">Write your answer draft:</span>
              <span className="text-neutral-400 font-mono">
                {draft.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your structured answer here (Definition, Diagram description, Step-by-step working, Example)..."
              rows={8}
              className="w-full p-4 border-2 border-black rounded-2xl font-sans text-xs sm:text-sm leading-relaxed bg-white focus:outline-none shadow-xs"
            />

            <div className="flex justify-end gap-3 pt-1">
              <Button onClick={handleSubmit} className="!py-2.5 !px-5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Self-Score</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Side-by-Side Model Comparison */
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              {/* Your Draft */}
              <div className="p-4 border-2 border-black rounded-2xl bg-neutral-50 space-y-2">
                <h3 className="font-bold text-black text-sm pb-1 border-b border-neutral-200">
                  Your Answer Draft
                </h3>
                <p className="whitespace-pre-wrap text-neutral-800 leading-relaxed font-sans">
                  {draft || '(No response drafted)'}
                </p>
              </div>

              {/* Model Syllabus Answer Key */}
              <div className="p-4 border-2 border-emerald-600 rounded-2xl bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                  <h3 className="font-bold text-emerald-900 text-sm">
                    Model Marking Rubric
                  </h3>
                  <span className="font-mono font-bold text-emerald-800">
                    Max: {currentPrompt.marks} Marks
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-emerald-950 font-mono text-[11px] leading-relaxed">
                  {currentPrompt.modelAnswer}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-xs text-neutral-500">
                Compare your points against each marking sub-item.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setTimeLeft(currentPrompt.duration)
                  setDraft('')
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 hover:border-black text-xs font-bold bg-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
