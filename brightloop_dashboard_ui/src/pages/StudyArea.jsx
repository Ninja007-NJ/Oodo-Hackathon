import React, { useEffect, useReducer, useRef, useState } from 'react'
import { load, save, iconFor, canSee } from '../lib'
import { Button, Preview, Slider, Toggle, areaCls, focusRing, inputCls } from '../components/ui'
import AssistantPanel from '../components/AssistantPanel'

const W = 2000
const H = 1400
const COLORS = ['#000000', '#2563EB', '#DC2626', '#16A34A', '#D97706', '#9333EA']
const PAPER = {
  blank: { label: 'Blank', style: {} },
  grid: {
    label: 'Grid',
    style: {
      backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    },
  },
  lines: {
    label: 'Lined',
    style: {
      backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px)',
      backgroundSize: '100% 36px',
    },
  },
}
const TOOLS = [
  ['pen', '✏', 'Pen'],
  ['highlighter', '🖍', 'Highlighter'],
  ['eraser', '⌫', 'Eraser'],
  ['text', 'T', 'Text'],
]

function paint(ctx, s) {
  ctx.save()
  if (s.type === 'text') {
    ctx.fillStyle = s.color
    ctx.font = `${s.size}px Inter, system-ui, sans-serif`
    ctx.textBaseline = 'top'
    ctx.fillText(s.text, s.x, s.y)
    ctx.restore()
    return
  }
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = s.color
  ctx.lineWidth = s.size
  if (s.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = s.size * 4
  }
  if (s.tool === 'highlighter') {
    ctx.globalAlpha = 0.3
    ctx.lineWidth = s.size * 4
  }
  const p = s.points
  ctx.beginPath()
  ctx.moveTo(p[0].x, p[0].y)
  if (p.length === 1) {
    ctx.lineTo(p[0].x + 0.01, p[0].y)
  } else {
    for (let i = 1; i < p.length - 1; i++) {
      ctx.quadraticCurveTo(p[i].x, p[i].y, (p[i].x + p[i + 1].x) / 2, (p[i].y + p[i + 1].y) / 2)
    }
    ctx.lineTo(p[p.length - 1].x, p[p.length - 1].y)
  }
  ctx.stroke()
  ctx.restore()
}

function boardReducer(state, a) {
  switch (a.type) {
    case 'add':
      return { strokes: [...state.strokes, a.item], redo: [] }
    case 'undo':
      return state.strokes.length
        ? { strokes: state.strokes.slice(0, -1), redo: [...state.redo, state.strokes[state.strokes.length - 1]] }
        : state
    case 'redo':
      return state.redo.length
        ? { strokes: [...state.strokes, state.redo[state.redo.length - 1]], redo: state.redo.slice(0, -1) }
        : state
    case 'clear':
      return { strokes: [], redo: [] }
    default:
      return state
  }
}

function Board({ topicId, topicTitle, notify }) {
  const key = `hub2.board.${topicId}`
  const canvasRef = useRef(null)
  const live = useRef(null)
  const textRef = useRef(null)
  const [{ strokes, redo }, dispatch] = useReducer(boardReducer, null, () => ({
    strokes: load(key, []),
    redo: [],
  }))
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState(COLORS[0])
  const [size, setSize] = useState(3)
  const [paper, setPaper] = useState('grid')
  const [textBox, setTextBox] = useState(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, W, H)
    strokes.forEach((s) => paint(ctx, s))
    save(key, strokes)
  }, [strokes, key])

  const undo = () => dispatch({ type: 'undo' })
  const redoIt = () => dispatch({ type: 'redo' })
  const clearAll = () => {
    if (window.confirm('Clear this whole page? This cannot be undone.')) dispatch({ type: 'clear' })
  }

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && tag !== 'TEXTAREA' && tag !== 'INPUT') {
        e.preventDefault()
        dispatch({ type: e.shiftKey ? 'redo' : 'undo' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const point = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height }
  }

  const down = (e) => {
    const p = point(e)
    if (tool === 'text') {
      setTextBox(p)
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    const ctx = canvasRef.current.getContext('2d')
    live.current = { tool, color, size, points: [p], snap: ctx.getImageData(0, 0, W, H) }
    paint(ctx, live.current)
  }
  const move = (e) => {
    const l = live.current
    if (!l) return
    l.points.push(point(e))
    const ctx = canvasRef.current.getContext('2d')
    ctx.putImageData(l.snap, 0, 0)
    paint(ctx, l)
  }
  const up = () => {
    const l = live.current
    if (!l) return
    live.current = null
    dispatch({ type: 'add', item: { tool: l.tool, color: l.color, size: l.size, points: l.points } })
  }

  const commitText = () => {
    const box = textBox
    const value = textRef.current?.value ?? ''
    setTextBox(null)
    if (box && value.trim()) {
      dispatch({ type: 'add', item: { type: 'text', text: value, x: box.x, y: box.y, color, size: 14 + size * 3 } })
    }
  }

  const download = () => {
    const out = document.createElement('canvas')
    out.width = W
    out.height = H
    const ctx = out.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, W, H)
    ctx.drawImage(canvasRef.current, 0, 0)
    const name = `${topicTitle.replace(/\s+/g, '-').toLowerCase()}-notes.png`
    out.toBlob((blob) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = name
      a.click()
      URL.revokeObjectURL(a.href)
      notify(`Saved ${name}`)
    })
  }

  return (
    <div className="flex flex-col min-w-0 min-h-0 flex-1 bg-[#F1F5F9]">
      {/* Toolbar */}
      <div className="px-4 py-2 flex flex-wrap items-center gap-3 border-b border-neutral-200 bg-white" role="toolbar" aria-label="Drawing tools">
        <div className="flex items-center gap-1 rounded-xl bg-neutral-100 p-1 border border-neutral-300">
          {TOOLS.map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              aria-pressed={tool === id}
              aria-label={label}
              title={label}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                tool === id ? 'bg-black text-white shadow-xs' : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5" role="group" aria-label="Colour">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Colour ${c}`}
              aria-pressed={color === c}
              style={{ background: c }}
              className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                color === c ? 'ring-2 ring-black ring-offset-2 scale-110' : 'border border-neutral-300'
              }`}
            />
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
          Size
          <Slider label="Pen size" min={1} max={12} value={size} onChange={setSize} className="w-20 sm:w-28" />
        </label>

        <div className="flex gap-1" role="group" aria-label="Paper style">
          {Object.entries(PAPER).map(([id, p]) => (
            <button
              key={id}
              onClick={() => setPaper(id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                paper === id ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <Button variant="secondary" className="!py-1 !px-2.5 text-xs font-bold" onClick={undo} disabled={!strokes.length}>
          Undo
        </Button>
        <Button variant="secondary" className="!py-1 !px-2.5 text-xs font-bold" onClick={redoIt} disabled={!redo.length}>
          Redo
        </Button>
        <Button variant="secondary" className="!py-1 !px-2.5 text-xs font-bold" onClick={clearAll} disabled={!strokes.length}>
          Clear
        </Button>
        <Button variant="primary" className="!py-1 !px-3 text-xs font-bold" onClick={download}>
          Download PNG
        </Button>
      </div>

      {/* Board */}
      <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6">
        <div
          className="relative bg-white rounded-2xl border border-neutral-300 shadow-md overflow-hidden mx-auto"
          style={{ width: W, height: H, ...PAPER[paper].style }}
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            aria-label={`Drawing board for ${topicTitle}`}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            style={{
              width: W,
              height: H,
              touchAction: 'none',
              cursor: tool === 'text' ? 'text' : tool === 'eraser' ? 'cell' : 'crosshair',
            }}
          />
          {textBox && (
            <input
              ref={textRef}
              autoFocus
              aria-label="Type text, press Enter to place it"
              placeholder="Type, then press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitText()
                if (e.key === 'Escape') setTextBox(null)
              }}
              onBlur={commitText}
              style={{
                position: 'absolute',
                left: textBox.x,
                top: textBox.y,
                color,
                font: `${14 + size * 3}px Inter, system-ui, sans-serif`,
                minWidth: 180,
              }}
              className="border border-black rounded-lg px-2 py-1 bg-white text-black outline-none shadow-md"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function StudyArea({
  user,
  subject,
  topics,
  topicId,
  setTopicId,
  resources,
  notes,
  setNotes,
  onBack,
  notify,
}) {
  const topic = topics.find((t) => t.id === topicId) ?? topics[0]
  const topicSet = new Set(topics.map((t) => t.id))
  const visible = resources.filter((r) => topicSet.has(r.topic) && canSee(r, user))
  const list = visible.filter((r) => r.topic === topic.id)
  const [showRefs, setShowRefs] = useState(() => window.innerWidth >= 1280)
  const [showSide, setShowSide] = useState(true)
  const [tab, setTab] = useState('assistant')
  const [refId, setRefId] = useState(null)
  const ref = list.find((r) => r.id === refId) ?? null

  const noteDocs = visible.filter((r) => r.type === 'notes')
  const docs = [
    ...noteDocs
      .filter((r) => r.text?.trim())
      .map((r) => ({ id: r.id, title: r.title, topic: r.topic, text: r.text, declaration: r.declaration, license: r.license })),
    ...topics
      .filter((t) => (notes[t.id] ?? '').trim())
      .map((t) => ({ id: `typed-${t.id}`, title: `My typed notes (${t.title})`, topic: t.id, text: notes[t.id] })),
  ]
  const unreadable = noteDocs.filter((r) => !r.text?.trim()).length

  const selectDoc = (id) => {
    const r = visible.find((x) => x.id === id)
    if (!r) return
    if (r.topic !== topic.id) setTopicId(r.topic)
    setRefId(id)
    setShowRefs(true)
  }
  const addToNotes = (text) => {
    setNotes((n) => ({
      ...n,
      [topic.id]: `${(n[topic.id] ?? '').trim() ? `${n[topic.id].trim()}\n\n` : ''}${text}`,
    }))
    setTab('notes')
    notify('Added to your typed notes')
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#F8FAFC]">
      {/* Sub-header Navigation */}
      <div className="bg-white border-b border-neutral-200 px-4 py-2.5 flex flex-wrap items-center gap-3">
        <Button variant="secondary" className="!py-1.5 !px-3 text-xs font-bold" onClick={onBack}>
          ← Back to resources
        </Button>
        <div className="h-4 w-[1px] bg-neutral-300" />
        <label className="flex items-center gap-2 text-xs font-bold text-neutral-700">
          <span>Topic:</span>
          <select
            value={topic.id}
            onChange={(e) => {
              setTopicId(e.target.value)
              setRefId(null)
            }}
            className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-xs font-bold text-black cursor-pointer focus:border-black"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <div className="flex-1" />
        <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
          <span>Resources</span>
          <Toggle label="Show resources" checked={showRefs} onChange={setShowRefs} />
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
          <span>Assistant & notes</span>
          <Toggle label="Show assistant and notes panel" checked={showSide} onChange={setShowSide} />
        </label>
      </div>

      <div className="flex-1 min-h-0 flex relative">
        {showRefs && (
          <aside className="absolute lg:static inset-y-0 left-0 z-20 w-72 max-w-[85%] shrink-0 bg-white border-r border-neutral-200 p-3 overflow-y-auto" aria-label="Resources for this topic">
            <h2 className="font-bold text-xs text-neutral-400 uppercase tracking-wider mb-2">
              Resources for {topic.title}
            </h2>
            {list.length === 0 && <p className="text-xs text-neutral-500">None yet. Add some on the resources page.</p>}
            <ul className="space-y-1 mb-3">
              {list.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setRefId(r.id === refId ? null : r.id)}
                    aria-pressed={r.id === refId}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs truncate transition-colors cursor-pointer ${
                      r.id === refId
                        ? 'bg-black text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{iconFor(r.type)}</span> {r.title}
                  </button>
                </li>
              ))}
            </ul>
            {ref && <Preview r={ref} />}
          </aside>
        )}

        <Board key={topic.id} topicId={topic.id} topicTitle={topic.title} notify={notify} />

        {showSide && (
          <aside className="absolute lg:static inset-y-0 right-0 z-20 w-80 max-w-[92%] shrink-0 bg-white border-l border-neutral-200 p-3 flex flex-col min-h-0" aria-label="Assistant and notes">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setTab('assistant')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  tab === 'assistant' ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-300'
                }`}
              >
                🤖 Study assistant
              </button>
              <button
                onClick={() => setTab('notes')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  tab === 'notes' ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-300'
                }`}
              >
                ✏ Typed notes
              </button>
            </div>

            {tab === 'assistant' ? (
              <AssistantPanel
                key={topic.id}
                subject={subject}
                topic={topic}
                docs={docs}
                unreadable={unreadable}
                onSelectDoc={selectDoc}
                onAddToNotes={addToNotes}
              />
            ) : (
              <div className="flex-1 min-h-0 flex flex-col">
                <p className="text-xs text-neutral-500 mb-2">Private notes, saved automatically per topic in My Space.</p>
                <textarea
                  value={notes[topic.id] ?? ''}
                  onChange={(e) => setNotes((n) => ({ ...n, [topic.id]: e.target.value }))}
                  placeholder={`Write what you learn about ${topic.title}…`}
                  aria-label={`Typed notes on ${topic.title}`}
                  className={`${areaCls} flex-1 resize-none text-xs sm:text-sm leading-relaxed`}
                />
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
