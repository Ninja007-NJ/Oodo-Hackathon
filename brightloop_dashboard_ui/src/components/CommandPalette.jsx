import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search,
  BookOpen,
  FileText,
  Video,
  Code,
  HelpCircle,
  Sparkles,
  Palette,
  Upload,
  Trophy,
  ArrowRight,
  X,
  Compass
} from 'lucide-react'
import { STATUS } from '../data'
import { labelFor } from '../lib'

export default function CommandPalette({
  isOpen,
  onClose,
  topics = [],
  resources = [],
  onSelectTopic,
  onOpenStudy,
  onOpenUpload,
  onOpenMatrix,
  onSetTheme,
}) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Build searchable items
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()

    // 1. Actions
    const actionItems = [
      {
        id: 'action-study',
        type: 'action',
        title: 'Open Study Studio Whiteboard',
        subtitle: 'Interactive canvas, pen, diagrams & notes',
        icon: <BookOpen className="w-4 h-4 text-glow" />,
        run: onOpenStudy,
      },
      {
        id: 'action-upload',
        type: 'action',
        title: 'Upload / Submit Notes',
        subtitle: 'Auto-categorise and screen notes for syllabus',
        icon: <Upload className="w-4 h-4 text-brand-hi" />,
        run: onOpenUpload,
      },
      {
        id: 'action-matrix',
        type: 'action',
        title: 'View Uniqueness Matrix (Track A)',
        subtitle: 'Factual differentiator comparison against 5 platforms',
        icon: <Trophy className="w-4 h-4 text-amber-400" />,
        run: onOpenMatrix,
      },
      {
        id: 'action-theme-cyan',
        type: 'theme',
        title: 'Switch Theme: Neon Cyan',
        subtitle: 'Electric cyan accent and blue glow',
        icon: <Palette className="w-4 h-4 text-cyan-400" />,
        run: () => onSetTheme?.('cyan'),
      },
      {
        id: 'action-theme-lime',
        type: 'theme',
        title: 'Switch Theme: Neon Lime',
        subtitle: 'Vibrant terminal green accent',
        icon: <Palette className="w-4 h-4 text-lime-400" />,
        run: () => onSetTheme?.('lime'),
      },
      {
        id: 'action-theme-magenta',
        type: 'theme',
        title: 'Switch Theme: Neon Magenta',
        subtitle: 'Cyberpunk violet-pink accent',
        icon: <Palette className="w-4 h-4 text-pink-400" />,
        run: () => onSetTheme?.('magenta'),
      },
      {
        id: 'action-theme-violet',
        type: 'theme',
        title: 'Switch Theme: Neon Violet',
        subtitle: 'Deep galactic indigo accent',
        icon: <Palette className="w-4 h-4 text-violet-400" />,
        run: () => onSetTheme?.('violet'),
      },
    ]

    // 2. Topics
    const topicItems = topics.map((t) => ({
      id: `topic-${t.id}`,
      type: 'topic',
      title: t.title,
      subtitle: `${t.module || 'Syllabus Topic'} · ${STATUS[t.status]?.label?.replace(' (estimate)', '') || t.status}`,
      status: t.status,
      icon: <Compass className="w-4 h-4 text-mist" />,
      run: () => onSelectTopic(t.id),
    }))

    // 3. Resources
    const resourceItems = resources.map((r) => {
      const topicName = topics.find((t) => t.id === r.topic)?.title || r.topic
      const getIcon = () => {
        if (r.type === 'videos') return <Video className="w-4 h-4 text-rose-400" />
        if (r.type === 'code') return <Code className="w-4 h-4 text-emerald-400" />
        if (r.type === 'pyqs') return <HelpCircle className="w-4 h-4 text-amber-400" />
        return <FileText className="w-4 h-4 text-cyan-400" />
      }
      return {
        id: `res-${r.id}`,
        type: 'resource',
        title: r.title,
        subtitle: `${labelFor(r.type)} · in ${topicName} · ${r.source}`,
        icon: getIcon(),
        run: () => onSelectTopic(r.topic, r.id),
      }
    })

    if (!q) {
      // Default: top actions, top topics, first few resources
      return [
        ...actionItems.slice(0, 3),
        ...topicItems.slice(0, 5),
        ...resourceItems.slice(0, 4),
      ]
    }

    const matches = (str) => (str || '').toLowerCase().includes(q)

    const filteredActions = actionItems.filter(
      (a) => matches(a.title) || matches(a.subtitle)
    )
    const filteredTopics = topicItems.filter(
      (t) => matches(t.title) || matches(t.subtitle)
    )
    const filteredResources = resourceItems.filter(
      (r) => matches(r.title) || matches(r.subtitle)
    )

    return [...filteredActions, ...filteredTopics, ...filteredResources]
  }, [query, topics, resources, onOpenStudy, onOpenUpload, onOpenMatrix, onSetTheme, onSelectTopic])

  // Reset active index if out of range
  useEffect(() => {
    setActiveIndex(0)
  }, [items.length])

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.children[activeIndex]
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % (items.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + items.length) % (items.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = items[activeIndex]
      if (item) {
        item.run?.()
        onClose()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0E1526]/95 border border-white/20 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_40px_rgb(var(--glow)/0.25)] overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/5">
          <Search className="w-5 h-5 text-glow shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, topic (Paging, Scheduling), or resource..."
            className="flex-1 bg-transparent text-mist placeholder:text-fog/70 text-sm sm:text-base outline-none border-none ring-0 focus:ring-0 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-fog hover:text-mist hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-fog bg-white/10 rounded border border-white/15">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 space-y-1 no-scrollbar divide-y divide-white/5"
        >
          {items.length === 0 ? (
            <div className="py-12 text-center text-fog space-y-2">
              <Sparkles className="w-8 h-8 text-glow/50 mx-auto" />
              <p className="text-sm font-medium text-mist">No results found for "{query}"</p>
              <p className="text-xs text-fog max-w-xs mx-auto">
                Try searching for "Paging", "Video", "Study", or "Matrix".
              </p>
            </div>
          ) : (
            items.map((item, idx) => {
              const isSelected = idx === activeIndex
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.run?.()
                    onClose()
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand/40 to-white/10 text-white ring-1 ring-glow/60 shadow-[0_0_15px_rgb(var(--glow)/0.2)]'
                      : 'text-mist hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-glow/20 shadow-[0_0_10px_rgb(var(--glow)/0.4)]'
                          : 'bg-white/10'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-semibold truncate text-mist">
                          {item.title}
                        </p>
                        {item.type === 'topic' && item.status && (
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full border ${
                              STATUS[item.status]?.badge || 'bg-white/10'
                            }`}
                          >
                            {STATUS[item.status]?.icon} {STATUS[item.status]?.label?.replace(' (estimate)', '')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-fog truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] text-glow font-medium">
                        Jump <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-fog">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px]">ESC</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  )
}
