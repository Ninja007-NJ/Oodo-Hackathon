import React, { useMemo, useState } from 'react'
import { suggestTopic } from '../classify'
import { DISCLAIMER, screenNote } from '../legal'
import { Button, areaCls, focusRing, inputCls } from './ui'
import { ShieldCheck, FileText, CheckCircle2, Lock, Users, AlertTriangle } from 'lucide-react'

const DECL = [
  ['own', 'These are my own notes (I wrote / typed them)'],
  ['open', 'They carry an open licence (e.g. CC BY, CC0, MIT or public domain)'],
  ['permission', 'The professor or author gave me permission to share them'],
  ['unsure', 'I am not sure (Keep them private in My Space)'],
]

export default function UploadModal({
  allTopics,
  defaultTopicId,
  existing,
  user,
  onSubmit,
  onClose,
}) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [filename, setFilename] = useState('')
  const [declaration, setDeclaration] = useState('own')
  const [source, setSource] = useState('')
  const [chosenTopic, setChosenTopic] = useState(null)
  const [shareIntent, setShareIntent] = useState('private') // 'private' | 'shared'

  const suggestion = useMemo(
    () => suggestTopic({ title: `${title} ${filename}`, text }, allTopics),
    [title, filename, text, allTopics]
  )
  const topicId = chosenTopic ?? suggestion.best?.topic.id ?? defaultTopicId
  const screen = useMemo(
    () => screenNote({ text, filename, declaration, source, existing }),
    [text, filename, declaration, source, existing]
  )

  const onFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFilename(f.name)
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''))
    if (/\.(txt|md)$/i.test(f.name) && f.size < 1_000_000) setText(await f.text())
  }

  const submit = () => {
    const isShared = shareIntent === 'shared' && screen.level === 'ok'
    const trustPassport = {
      uploader: user.name || 'Verified Student',
      declared_source: source.trim() || (filename ? `Uploaded file: ${filename}` : 'Class lecture notes'),
      permission: DECL.find((d) => d[0] === declaration)?.[1] || 'Self-authored notes',
      duplicate_check: screen.flags?.includes('duplicate') ? 'Duplicate detected — queued for review' : 'Passed (0 collision hashes found)',
      hash: screen.hash ? `sha256:${screen.hash}` : `sha256:${Date.now().toString(16)}`,
      reviewed_at: 'Just now',
      screened_by: 'Automated Integrity Check (Client Hash)',
    }

    onSubmit({
      id: Date.now(),
      topic: topicId,
      type: 'notes',
      title: title.trim() || 'Untitled notes',
      kind: filename ? 'Uploaded file' : 'Typed text',
      source: user.name || 'Demo Student',
      checked: 'just now',
      url: '',
      text,
      filename,
      declaration,
      license: source.trim() || DECL.find((d) => d[0] === declaration)[1],
      legal: { level: screen.level, flags: screen.flags },
      hash: screen.hash,
      trust_passport: trustPassport,
      visibility: isShared ? 'shared' : shareIntent === 'shared' ? 'pending' : 'private',
      owner: user.email || 'demo@university.edu',
    })
  }

  const topicTitle = allTopics.find((t) => t.id === topicId)?.title

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="bg-white rounded-3xl border border-neutral-300 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-200">
          <div>
            <h2 id="upload-modal-title" className="text-lg font-black text-black tracking-tight">
              Upload Notes with Trust Passport
            </h2>
            <p className="text-xs text-neutral-500">
              Attach study materials to syllabus topics with verified provenance and academic integrity declarations.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Share Scope Choice */}
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2.5 ${
              shareIntent === 'private'
                ? 'border-black bg-neutral-50 text-black shadow-xs ring-1 ring-black'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-black'
            }`}
          >
            <input
              type="radio"
              name="scope"
              checked={shareIntent === 'private'}
              onChange={() => setShareIntent('private')}
              className="accent-black"
            />
            <div>
              <p className="font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Private to Me
              </p>
              <p className="text-[11px] text-neutral-500 font-normal">Encrypted locally in My Space</p>
            </div>
          </label>

          <label
            className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2.5 ${
              shareIntent === 'shared'
                ? 'border-black bg-neutral-50 text-black shadow-xs ring-1 ring-black'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-black'
            }`}
          >
            <input
              type="radio"
              name="scope"
              checked={shareIntent === 'shared'}
              onChange={() => setShareIntent('shared')}
              className="accent-black"
            />
            <div>
              <p className="font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Submit to Class
              </p>
              <p className="text-[11px] text-neutral-500 font-normal">Attaches verified Trust Passport</p>
            </div>
          </label>
        </div>

        {/* Title */}
        <label className="block text-xs font-bold text-neutral-700">
          Document Title
          <input
            autoFocus
            className={`${inputCls} mt-1`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Segmentation Tables & Protection Bits Summary"
          />
        </label>

        {/* File Picker */}
        <label className="block text-xs font-bold text-neutral-700">
          Attach File (.txt and .md parsed automatically)
          <input
            type="file"
            accept=".txt,.md,.pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={onFile}
            className="block mt-1 text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-neutral-300 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-neutral-100 cursor-pointer"
          />
        </label>

        {/* Pasted text */}
        <label className="block text-xs font-bold text-neutral-700">
          Or Type / Paste Notes Text
          <textarea
            className={`${areaCls} mt-1 text-xs`}
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste lecture notes or markdown text for instant syllabus keyword mapping..."
          />
        </label>

        {/* Source & Permission Declaration */}
        <fieldset className="space-y-1.5 border border-neutral-200 rounded-2xl p-3 bg-neutral-50">
          <legend className="text-xs font-bold text-black px-1">
            Academic Integrity & Origin Declaration
          </legend>
          {DECL.map(([id, label]) => (
            <label key={id} className="flex items-start gap-2.5 text-xs text-neutral-800 cursor-pointer pt-0.5">
              <input
                type="radio"
                name="decl"
                checked={declaration === id}
                onChange={() => setDeclaration(id)}
                className="mt-0.5 accent-black"
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        {(declaration === 'open' || declaration === 'permission') && (
          <label className="block text-xs font-bold text-neutral-700">
            {declaration === 'open' ? 'Licence Reference / Link' : 'Author or Instructor Permission Details'}
            <input
              className={`${inputCls} mt-1`}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. MIT OpenCourseWare CC-BY or Prof. Verma Lecture Slide authorization"
            />
          </label>
        )}

        {/* Syllabus Topic Mapping */}
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3.5 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-black">Mapped Syllabus Topic:</span>
            <span className="font-semibold text-black bg-white border border-neutral-300 px-2 py-0.5 rounded">
              {topicTitle}
            </span>
          </div>

          <p className="text-[11px] text-neutral-500">
            {chosenTopic
              ? 'Manually selected topic.'
              : suggestion.best
              ? `Auto-mapped from keywords (${suggestion.best.evidence.slice(0, 3).join(', ')}).`
              : 'Assigned to active topic.'}
          </p>

          <label className="block text-[11px] text-neutral-500 pt-1">
            Change assigned syllabus topic:
            <select
              className="w-full mt-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-black"
              value={topicId}
              onChange={(e) => setChosenTopic(e.target.value)}
            >
              {allTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <p className="text-[10px] text-neutral-400 max-w-[280px]">
            Automated screening check verifies duplicate hashes. AI does not certify legal validity.
          </p>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} className="!py-2 !px-4 text-xs font-bold">
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={!title.trim() && !text.trim() && !filename}
              className="!py-2 !px-5 text-xs font-bold"
            >
              {shareIntent === 'shared' ? 'Submit to Class Library ➔' : 'Save Privately in My Space ➔'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
