import React, { useState } from 'react'
import { Button, focusRing } from './ui'
import { X, RotateCw, CheckCircle2, Sparkles, BookOpen, Layers, Check, ArrowRight } from 'lucide-react'

const SEED_FLASHCARDS = [
  {
    id: 'fc-1',
    topicId: 'os-paging',
    front: 'What is the key difference between internal and external fragmentation?',
    back: 'Internal fragmentation occurs when allocated fixed-size memory blocks (pages/frames) are larger than the data, leaving unused space inside. External fragmentation occurs when total free memory is sufficient but broken into scattered, non-contiguous variable chunks.',
    source: 'Paging Notes · Section 4',
    box: 1,
  },
  {
    id: 'fc-2',
    topicId: 'os-seg',
    front: 'How does the hardware prevent a process from accessing memory outside its segment?',
    back: 'The CPU checks if the logical offset d < limit. If d >= limit, the hardware raises an illegal memory protection trap (segmentation fault) to the operating system.',
    source: 'Silberschatz OS Concepts · Ch 8.4',
    box: 2,
  },
  {
    id: 'fc-3',
    topicId: 'os-paging',
    front: 'What does the Translation Lookaside Buffer (TLB) cache?',
    back: 'The TLB is a high-speed associative hardware cache that stores the most recently used Page Number to Frame Number translations to avoid extra RAM lookups.',
    source: '2021 Exam Q3 Solution Guide',
    box: 2,
  },
  {
    id: 'fc-4',
    topicId: 'os-sched',
    front: 'Why is Shortest Job First (SJF) rarely implemented in pure form for interactive systems?',
    back: 'It requires knowing the exact future CPU burst time in advance, and long-running processes can suffer starvation if short jobs continuously arrive.',
    source: 'CPU Scheduling Summary (Ravi)',
    box: 3,
  },
  {
    id: 'fc-5',
    topicId: 'os-vm',
    front: 'What causes thrashing in virtual memory systems?',
    back: 'Thrashing occurs when processes do not have enough frames to hold their working sets, causing continuous page faults where the OS spends more time swapping pages than executing instructions.',
    source: 'Demand Paging Review Note',
    box: 1,
  },
]

export default function FlashcardReviewModal({ isOpen, onClose, notify }) {
  const [cards, setCards] = useState(SEED_FLASHCARDS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const card = cards[currentIndex] || cards[0]

  const handleFlip = () => {
    setIsFlipped((f) => !f)
  }

  const handleRate = (advanceBoxes) => {
    // Update card box
    const newBox = Math.max(1, Math.min(4, advanceBoxes === 0 ? 1 : card.box + advanceBoxes))
    setCards((prev) =>
      prev.map((c, i) => (i === currentIndex ? { ...c, box: newBox } : c))
    )

    setIsFlipped(false)
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((idx) => idx + 1)
    } else {
      notify('Completed flashcard review session! Spaced repetition intervals updated.')
      setCurrentIndex(0)
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white border-2 border-black rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl border border-neutral-300 hover:border-black text-neutral-500 hover:text-black cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            Leitner 4-Box Spaced Repetition (SRS)
          </span>
          <h2 className="text-xl font-black text-black mt-1">
            Active Recall Flashcards
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Card {currentIndex + 1} of {cards.length} · Box {card.box} ({card.box === 1 ? 'Daily' : card.box === 2 ? '2 Days' : card.box === 3 ? '4 Days' : '8 Days'})
          </p>
        </div>

        {/* Leitner Box Status Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[1, 2, 3, 4].map((boxNum) => {
            const count = cards.filter((c) => c.box === boxNum).length
            return (
              <div
                key={boxNum}
                className={`p-2 rounded-xl border ${
                  card.box === boxNum
                    ? 'border-black bg-black text-white font-bold shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                }`}
              >
                <span className="text-[10px] block uppercase">Box {boxNum}</span>
                <span className="font-mono text-sm">{count} cards</span>
              </div>
            )
          })}
        </div>

        {/* The Flashcard Body (Click to Flip) */}
        <div
          onClick={handleFlip}
          className="min-h-[220px] p-6 rounded-3xl border-2 border-black bg-neutral-50 flex flex-col justify-between cursor-pointer hover:bg-neutral-100/60 transition-colors shadow-sm select-none"
        >
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono uppercase font-bold text-[10px]">
              {isFlipped ? 'Answer & Source Citation' : 'Question / Concept'}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Tap to flip</span>
            </span>
          </div>

          <div className="my-auto py-4">
            {isFlipped ? (
              <div className="space-y-3">
                <p className="text-base font-semibold text-neutral-900 leading-relaxed font-sans">
                  {card.back}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Source: {card.source}</span>
                </div>
              </div>
            ) : (
              <p className="text-lg font-bold text-black leading-snug font-sans">
                {card.front}
              </p>
            )}
          </div>

          <div className="text-[10px] text-neutral-400 text-right">
            Topic: <span className="font-bold text-black">{card.topicId}</span>
          </div>
        </div>

        {/* Spaced-Repetition Response Buttons (Visible when flipped) */}
        {isFlipped ? (
          <div className="grid grid-cols-3 gap-2 pt-2 animate-in fade-in duration-100">
            <button
              onClick={() => handleRate(0)}
              className="py-2.5 px-3 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-900 font-bold text-xs cursor-pointer text-center"
            >
              <span className="block font-black">Again (1 Day)</span>
              <span className="text-[10px] text-red-700 font-normal">Back to Box 1</span>
            </button>

            <button
              onClick={() => handleRate(1)}
              className="py-2.5 px-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs cursor-pointer text-center"
            >
              <span className="block font-black">Good (+1 Box)</span>
              <span className="text-[10px] text-neutral-500 font-normal">Remembered</span>
            </button>

            <button
              onClick={() => handleRate(2)}
              className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs cursor-pointer text-center"
            >
              <span className="block font-black">Easy (+2 Boxes)</span>
              <span className="text-[10px] text-emerald-700 font-normal">Mastered</span>
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-neutral-400">
            Click anywhere on the card to reveal the answer and syllabus source.
          </div>
        )}
      </div>
    </div>
  )
}
