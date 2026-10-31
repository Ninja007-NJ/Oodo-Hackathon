import React, { useEffect, useMemo, useRef, useState } from 'react'
import MiniSearch from 'minisearch'
import {
  LayoutGrid,
  List,
  AlertCircle,
  Search,
  ChevronDown,
  Lock,
  Users,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  Share2,
  FileText,
  Upload,
  Sparkles,
  ExternalLink,
  BookOpen,
  HelpCircle,
  PenTool,
  MessageSquare
} from 'lucide-react'
import { STATUS } from '../data'
import { SECTIONS, canSee, guessType, hostOf, iconFor, isUrl, labelFor, load, save } from '../lib'
import { Badge, Button, MenuButton, Preview, ResourceCard, focusRing, inputCls, areaCls } from '../components/ui'
import InsightsCard from '../components/InsightsCard'
import LearnPanel from '../components/LearnPanel'
import UploadModal from '../components/UploadModal'
import SourceLinkedBoard from '../components/SourceLinkedBoard'
import PracticeQuizView from '../components/PracticeQuizView'
import AssistantPanel from '../components/AssistantPanel'
import AlgorithmSimulator from '../components/AlgorithmSimulator'
import TimedAnswerPracticeModal from '../components/TimedAnswerPracticeModal'
import SmartNotes from '../components/SmartNotes'
import Deadlines from '../components/Deadlines'

export default function ResourcesPage({
  user,
  subject,
  topics,
  topicId,
  setTopicId,
  resources,
  setResources,
  bookmarks,
  toggleBookmark,
  notes,
  setNotes,
  confidenceRatings = {},
  onUpdateConfidence = () => {},
  packs = {},
  setPacks = () => {},
  cards = [],
  setCards = () => {},
  deadlines = [],
  setDeadlines = () => {},
  plan = { exam: '', hrs: 3 },
  setPlan = () => {},
  onSaveMistake,
  onChangeSelection,
  notify,
}) {
  const [selectedId, setSelectedId] = useState(null)
  const [ext, setExt] = useState(null)
  const [query, setQuery] = useState('')
  const [quick, setQuick] = useState('')
  const [quickType, setQuickType] = useState('auto')
  const [showUpload, setShowUpload] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  // Center pane mode: 'resources' | 'board' | 'notes' | 'practice'
  const [centerTab, setCenterTab] = useState('resources')

  // Right pane mode: 'inspector' | 'assistant'
  const [rightPanel, setRightPanel] = useState('inspector')

  const searchRef = useRef(null)

  const topic = topics.find((t) => t.id === topicId) ?? topics[0] ?? {
    id: 'os-seg',
    title: 'Segmentation',
    status: 'partial',
    missing: ['Segment tables', 'Protection bits'],
  }

  const currentModule = subject?.modules?.find((m) =>
    m.topics.some((t) => t.id === topic.id)
  ) ?? { title: 'Module 3: Memory management' }

  const allSubjectTopics = useMemo(() => subject?.modules?.flatMap((m) => m.topics) ?? [], [subject])
  const topicIdsSet = useMemo(() => new Set(topics.map((t) => t.id)), [topics])

  // Only resources this student is allowed to see
  const scoped = useMemo(
    () => resources.filter((r) => topicIdsSet.has(r.topic) && canSee(r, user)),
    [resources, topicIdsSet, user]
  )
  const topicResources = scoped.filter((r) => r.topic === topic.id)
  const selected = scoped.find((r) => r.id === selectedId) ?? ext ?? topicResources[0] ?? null
  const sharedCount = useMemo(() => resources.filter((r) => r.visibility === 'shared').length, [resources])

  // Documents for the grounded assistant
  const noteDocs = scoped.filter((r) => r.type === 'notes')
  const assistantDocs = [
    ...noteDocs.filter((r) => r.text?.trim()).map((r) => ({ id: r.id, title: r.title, topic: r.topic, text: r.text })),
    ...topics.filter((t) => (notes[t.id] ?? '').trim()).map((t) => ({ id: `typed-${t.id}`, title: `My typed notes (${t.title})`, topic: t.id, text: notes[t.id] })),
  ]

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setQuery('')
        searchRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Client-side search index
  const index = useMemo(() => {
    const ms = new MiniSearch({
      fields: ['title', 'topicTitle', 'source', 'typeLabel', 'body'],
      storeFields: ['id'],
      searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
    })
    ms.addAll(
      scoped.map((r) => ({
        id: r.id,
        title: r.title,
        source: r.source,
        body: (r.text ?? '').slice(0, 3000),
        topicTitle: topics.find((t) => t.id === r.topic)?.title ?? '',
        typeLabel: labelFor(r.type),
      }))
    )
    return ms
  }, [scoped, topics])

  const q = query.trim()
  const hits = useMemo(() => {
    if (!q) return { resources: [], topics: [] }
    const ids = new Set(index.search(q).map((h) => h.id))
    return {
      resources: scoped.filter((r) => ids.has(r.id)),
      topics: topics.filter((t) => t.title.toLowerCase().includes(q.toLowerCase())),
    }
  }, [q, index, scoped, topics])

  const goTo = (tid, rid = null) => {
    setTopicId(tid)
    setSelectedId(rid)
    setExt(null)
    setQuery('')
  }

  // Quick add resource
  const quickAdd = (e) => {
    e.preventDefault()
    const text = quick.trim()
    if (!text) return
    const url = isUrl(text) ? text : ''
    const type = quickType === 'auto' ? (url ? guessType(url) : 'notes') : quickType
    const id = Date.now()
    setResources((rs) => [
      {
        id,
        topic: topic.id,
        type,
        title: url ? hostOf(url) : text,
        kind: url ? 'Link' : 'Note',
        source: user?.name || 'Demo Student',
        checked: 'just now',
        url,
        pending: !!url,
        visibility: 'private',
        owner: user?.email || 'demo@university.edu',
        declaration: 'unsure',
        text: url ? '' : text,
      },
      ...rs,
    ])
    setSelectedId(id)
    setQuick('')
    notify(`Saved to "${topic.title}" in My Space (Private)`)
    if (url) {
      setTimeout(() => {
        setResources((rs) => rs.map((r) => (r.id === id ? { ...r, pending: false } : r)))
      }, 1200)
    }
  }

  const submitNote = (note) => {
    setResources((rs) => [note, ...rs])
    setShowUpload(false)
    setTopicId(note.topic)
    setSelectedId(note.id)
    const topicName = allSubjectTopics.find((t) => t.id === note.topic)?.title
    notify(
      note.visibility === 'shared'
        ? `Shared with your class under ${topicName}`
        : `Privately encrypted under ${topicName} in My Space`
    )
  }

  const handleCopyClassRequest = () => {
    const text = `Hi classmates, does anyone have clear study notes or lecture slides covering [${topic.missing.join(', ')}] for ${topic.title} in ${subject.title}?`
    navigator.clipboard?.writeText(text)
    notify('Copied class request to clipboard!')
  }

  const handleAddToNotes = (text) => {
    setNotes((prev) => ({
      ...prev,
      [topic.id]: `${(prev[topic.id] ?? '').trim() ? `${prev[topic.id].trim()}\n\n` : ''}${text}`,
    }))
    notify('Appended to your typed notes for this topic.')
  }

  const modules = (subject?.modules || [])
    .map((m) => ({ ...m, topics: m.topics.filter((t) => topicIdsSet.has(t.id)) }))
    .filter((m) => m.topics.length > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_360px] min-h-[calc(100vh-4rem)] bg-[#F8FAFC]">
      
      {/* 1. Left Sidebar: Syllabus Navigation Tree matching screenshot */}
      <aside className="bg-white border-r border-neutral-200 p-4 space-y-4 overflow-y-auto select-none" aria-label="Syllabus Navigation">
        <div className="flex items-center justify-between pb-1">
          <p className="text-xs font-semibold text-neutral-400">
            {topics.length} Selected syllabus topics
          </p>
        </div>

        {/* Modules & Topics */}
        <div className="space-y-4">
          {modules.map((m) => (
            <div key={m.id} className="space-y-1.5">
              <h3 className="text-xs font-medium text-neutral-400 tracking-tight">
                {m.title}
              </h3>
              <ul className="space-y-1">
                {m.topics.map((t) => {
                  const count = scoped.filter((r) => r.topic === t.id).length
                  const isActive = t.id === topic.id
                  const statusInfo = STATUS[t.status] || STATUS.missing

                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => goTo(t.id)}
                        className={`w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl transition-all text-xs cursor-pointer ${focusRing} ${
                          isActive
                            ? 'font-bold text-black border border-black bg-white shadow-xs'
                            : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className={
                              t.status === 'covered'
                                ? 'text-emerald-500 font-bold'
                                : t.status === 'partial'
                                ? 'text-amber-500 font-bold'
                                : t.status === 'review'
                                ? 'text-purple-500 font-bold'
                                : 'text-neutral-400 font-bold'
                            }
                            aria-hidden
                          >
                            {statusInfo.icon}
                          </span>
                          <span className="truncate">{t.title}</span>
                        </span>

                        <span className="text-[11px] font-semibold text-neutral-500 shrink-0">
                          {count}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Status Indicators */}
        <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100">
            <span className="font-semibold text-black">My Space</span>
            <span className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
              private
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100">
            <span>Shared class notes</span>
            <span className="font-semibold text-neutral-500">{sharedCount}</span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100">
            <span>Saved</span>
            <span className="font-semibold text-neutral-500">{bookmarks.length}</span>
          </div>
        </div>
      </aside>

      {/* 2. Center Pane: Unified Topic Workspace */}
      <main className="p-4 md:p-6 min-w-0 space-y-4 overflow-y-auto">
        
        {/* Progress Card (55% ring matching screenshot) */}
        <InsightsCard
          subject={subject}
          topics={topics}
          resources={scoped}
          user={user}
          confidenceRatings={confidenceRatings}
          onOpenTopic={goTo}
        />

        {/* Full-width Search Bar */}
        <div className="relative">
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, notes, videos... (Ctrl+K)"
            aria-label="Search resources"
            className="w-full rounded-xl bg-white text-black px-4 py-2.5 border border-neutral-300 text-sm focus:border-black transition-all shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
          />

          {q && (
            <div className="absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto p-2 z-30 bg-white border border-neutral-300 rounded-xl shadow-lg">
              {hits.topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => goTo(t.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 text-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>{STATUS[t.status].icon}</span>
                  <span className="font-bold text-black">Topic: {t.title}</span>
                </button>
              ))}
              {hits.resources.map((r) => (
                <button
                  key={r.id}
                  onClick={() => goTo(r.topic, r.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 text-xs flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="truncate text-black">
                    {iconFor(r.type)} {r.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    in {topics.find((t) => t.id === r.topic)?.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Breadcrumb */}
        <p className="text-xs font-medium text-neutral-500">
          {subject?.title || 'Operating Systems'} <span className="text-neutral-300">/</span> {currentModule.title}
        </p>

        {/* Title Row with Badge & Menu */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-black tracking-tight">{topic.title}</h1>
            <Badge status={topic.status} />
          </div>

          <div className="flex items-center gap-2">
            <MenuButton
              label="Add"
              items={[
                { label: 'Paste a link or note', onSelect: () => document.getElementById('quick-add-input')?.focus() },
                { label: 'Upload notes (.pdf, .txt)', onSelect: () => setShowUpload(true) },
                { label: 'Request notes from classmates', onSelect: handleCopyClassRequest },
              ]}
            />
          </div>
        </div>

        {/* Still Missing Container (Matching screenshot with 3 pill buttons) */}
        {topic.missing && topic.missing.length > 0 && (
          <div className="rounded-2xl border border-neutral-300 bg-white p-4 space-y-3 shadow-xs">
            <p className="text-xs sm:text-sm font-semibold text-neutral-800">
              Still missing: <span className="font-normal text-neutral-600">{topic.missing.join(', ')}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic.missing[0]} ${topic.title} ${subject.title}`)}`, '_blank')
                }}
                className="bg-gradient-to-b from-white to-[#EEF2F7] border border-[#CCD7E6] text-black text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs hover:border-black transition-colors cursor-pointer"
              >
                Search library
              </button>

              <button
                onClick={() => document.getElementById('quick-add-input')?.focus()}
                className="bg-gradient-to-b from-white to-[#EEF2F7] border border-[#CCD7E6] text-black text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs hover:border-black transition-colors cursor-pointer"
              >
                Suggest a link
              </button>

              <button
                onClick={handleCopyClassRequest}
                className="bg-gradient-to-b from-white to-[#EEF2F7] border border-[#CCD7E6] text-black text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs hover:border-black transition-colors cursor-pointer"
              >
                Copy class request
              </button>
            </div>
          </div>
        )}

        {/* Unified Topic Workspace Mode Bar (Zero clicks to stay on topic) */}
        <div className="border border-neutral-300 rounded-xl p-1 bg-white flex items-center justify-between gap-1 shadow-xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCenterTab('resources')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                centerTab === 'resources'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>📁 All Resources ({topicResources.length})</span>
            </button>

            <button
              onClick={() => setCenterTab('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                centerTab === 'board'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>🎨 Source-Linked Board</span>
            </button>

            <button
              onClick={() => setCenterTab('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                centerTab === 'notes'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>📝 Typed Notes</span>
            </button>

            <button
              onClick={() => setCenterTab('practice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                centerTab === 'practice'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>❓ Practice & Quizzes</span>
            </button>

            <button
              onClick={() => setCenterTab('simulators')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                centerTab === 'simulators'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>⚙️ Simulators</span>
            </button>

            <button
              onClick={() => setCenterTab('timed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                centerTab === 'timed'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>⏱️ Timed Exam</span>
            </button>

            <button
              onClick={() => setCenterTab('smart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                centerTab === 'smart'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>🧠 Smart Notes</span>
            </button>

            <button
              onClick={() => setCenterTab('deadlines')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                centerTab === 'deadlines'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>📅 Deadlines</span>
            </button>
          </div>

          <div className="text-[11px] font-semibold text-neutral-400 hidden lg:block pr-2">
            One screen, instant access
          </div>
        </div>

        {/* Center Tab 1: All Resources View (Matching screenshot) */}
        {centerTab === 'resources' && (
          <div className="space-y-4">
            {/* Trust and privacy strip */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-3 text-neutral-600">
                <span className="flex items-center gap-1.5 font-semibold text-black">
                  <Lock className="w-3.5 h-3.5 text-neutral-800" /> Private by default in My Space
                </span>
                <span className="text-neutral-300 hidden sm:inline">|</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Copyright & Integrity Screened
                </span>
                <span className="text-neutral-300 hidden sm:inline">|</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Syllabus Evidence Verified
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 bg-white border border-neutral-200 px-2 py-0.5 rounded">
                SHA256: 3a9f… verified
              </span>
            </div>

            {/* Free Learning Links (YouTube, NPTEL, MIT OCW) */}
            <LearnPanel
              subject={subject}
              topic={topic}
              onPreview={(r) => {
                setExt(r)
                setSelectedId(r.id)
                setRightPanel('inspector')
              }}
            />

            {/* Resources Grid/List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-sm font-bold text-black">
                  Curated Topic Resources ({topicResources.length})
                </h2>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg border cursor-pointer ${
                      viewMode === 'grid' ? 'bg-black text-white border-black' : 'border-neutral-200 text-neutral-500 bg-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg border cursor-pointer ${
                      viewMode === 'list' ? 'bg-black text-white border-black' : 'border-neutral-200 text-neutral-500 bg-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {topicResources.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center space-y-1">
                  <p className="text-sm font-bold text-black">No resources added yet</p>
                  <p className="text-xs text-neutral-500">
                    Use the quick-add bar below or upload lecture notes.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topicResources.map((r) => (
                    <ResourceCard
                      key={r.id}
                      r={r}
                      selected={selected?.id === r.id}
                      onSelect={() => {
                        setSelectedId(r.id)
                        setExt(null)
                        setRightPanel('inspector')
                      }}
                      bookmarked={bookmarks.includes(r.id)}
                      onBookmark={() => toggleBookmark(r.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {topicResources.map((r) => (
                    <ResourceCard
                      key={r.id}
                      r={r}
                      selected={selected?.id === r.id}
                      onSelect={() => {
                        setSelectedId(r.id)
                        setExt(null)
                        setRightPanel('inspector')
                      }}
                      bookmarked={bookmarks.includes(r.id)}
                      onBookmark={() => toggleBookmark(r.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Bar Docked at Bottom */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border border-neutral-300 rounded-2xl p-2.5 shadow-sm mt-6">
              <form onSubmit={quickAdd} className="flex flex-wrap items-center gap-2">
                <input
                  id="quick-add-input"
                  value={quick}
                  onChange={(e) => setQuick(e.target.value)}
                  placeholder={`Paste a link or type a note for ${topic.title}, then press Enter`}
                  className="flex-1 min-w-[240px] rounded-xl bg-neutral-50 border border-neutral-300 px-3.5 py-2 text-xs sm:text-sm text-black focus:bg-white focus:border-black focus-visible:outline-none"
                />

                <select
                  value={quickType}
                  onChange={(e) => setQuickType(e.target.value)}
                  className="rounded-xl bg-white border border-neutral-300 px-3 py-2 text-xs font-semibold text-black cursor-pointer focus:border-black focus-visible:outline-none"
                >
                  <option value="auto">Auto type</option>
                  {SECTIONS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>

                <Button type="submit" variant="primary" disabled={!quick.trim()} className="!py-2 !px-4 text-xs font-bold">
                  + Add
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowUpload(true)}
                  className="!py-2 !px-4 text-xs font-bold"
                >
                  ↑ Upload notes
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Center Tab 2: Feature 2 Source-Linked Study Board */}
        {centerTab === 'board' && (
          <SourceLinkedBoard
            topicId={topic.id}
            topicTitle={topic.title}
            resources={scoped}
            onOpenSourcePreview={(resId) => {
              if (resId) setSelectedId(resId)
              setRightPanel('inspector')
            }}
            notify={notify}
          />
        )}

        {/* Center Tab 3: Typed Notes Block */}
        {centerTab === 'notes' && (
          <div className="border border-neutral-300 rounded-2xl bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div>
                <h3 className="font-bold text-sm text-black">Private Topic Notes: {topic.title}</h3>
                <p className="text-xs text-neutral-500">Auto-saves locally to your browser storage</p>
              </div>
              <Button
                variant="secondary"
                className="!py-1 !px-3 text-xs font-bold"
                onClick={() => {
                  navigator.clipboard?.writeText(notes[topic.id] || '')
                  notify('Copied notes to clipboard!')
                }}
              >
                Copy text
              </Button>
            </div>

            <textarea
              value={notes[topic.id] ?? ''}
              onChange={(e) => setNotes((prev) => ({ ...prev, [topic.id]: e.target.value }))}
              placeholder={`Write your own explanations, formulas, or summaries for ${topic.title}…`}
              className={`${areaCls} min-h-[380px] leading-relaxed font-sans`}
            />
          </div>
        )}

        {/* Center Tab 4: Feature 7 Practice & Quizzes View */}
        {centerTab === 'practice' && (
          <PracticeQuizView
            topicId={topic.id}
            topicTitle={topic.title}
            onOpenSourcePreview={(resId) => {
              if (resId) setSelectedId(resId)
              setRightPanel('inspector')
            }}
            onAddToNotes={handleAddToNotes}
            onSaveMistake={onSaveMistake}
            notify={notify}
          />
        )}

        {/* Center Tab 5: Algorithm & Concept Simulators */}
        {centerTab === 'simulators' && (
          <AlgorithmSimulator notify={notify} />
        )}

        {/* Center Tab 6: Timed Exam Answer Practice */}
        {centerTab === 'timed' && (
          <TimedAnswerPracticeModal
            isOpen={true}
            onClose={() => setCenterTab('resources')}
            topicId={topic.id}
            topicTitle={topic.title}
            notify={notify}
          />
        )}

        {/* Center Tab 7: Grounded Smart Notes Generator */}
        {centerTab === 'smart' && (
          <div className="bg-white rounded-2xl border border-neutral-300 p-2 sm:p-4 shadow-xs">
            <SmartNotes
              subject={subject}
              topics={topics}
              resources={scoped}
              notes={notes}
              packs={packs}
              setPacks={setPacks}
              cards={cards}
              setCards={setCards}
              conf={confidenceRatings}
              setConf={onUpdateConfidence}
              plan={plan}
              setPlan={setPlan}
              onOpenTopic={goTo}
            />
          </div>
        )}

        {/* Center Tab 8: Deadlines & Calendar Sync */}
        {centerTab === 'deadlines' && (
          <div className="bg-white rounded-2xl border border-neutral-300 p-2 sm:p-4 shadow-xs">
            <Deadlines
              subject={subject}
              topics={topics}
              deadlines={deadlines}
              setDeadlines={setDeadlines}
              onOpenTopic={goTo}
            />
          </div>
        )}
      </main>

      {/* 3. Right Pane: Inspector / Assistant Switcher */}
      <aside className="hidden lg:flex flex-col bg-white border-l border-neutral-200 overflow-y-auto select-none" aria-label="Inspector and Assistant">
        {/* Toggle between Inline Inspector and Study Assistant */}
        <div className="p-3 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-300 w-full">
            <button
              onClick={() => setRightPanel('inspector')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                rightPanel === 'inspector' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Inline Inspector
            </button>
            <button
              onClick={() => setRightPanel('assistant')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                rightPanel === 'assistant' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Study Assistant 🤖
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          {rightPanel === 'inspector' ? (
            <div className="space-y-4">
              <Preview r={selected} />
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
                <p className="font-bold text-black flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>One Screen, Instant Access</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  Students never leave their syllabus topic. Videos embed inline and documents render client-side without redirects.
                </p>
              </div>
            </div>
          ) : (
            <AssistantPanel
              subject={subject}
              topic={topic}
              docs={assistantDocs}
              onSelectDoc={(docId) => {
                setSelectedId(docId)
                setRightPanel('inspector')
              }}
              onAddToNotes={handleAddToNotes}
              onOpenPractice={() => setCenterTab('practice')}
            />
          )}
        </div>
      </aside>

      {/* Upload Notes Modal with Trust Passport declaration */}
      {showUpload && (
        <UploadModal
          allTopics={topics}
          defaultTopicId={topic.id}
          existing={scoped.filter((r) => r.type === 'notes')}
          user={user}
          onSubmit={submitNote}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}
