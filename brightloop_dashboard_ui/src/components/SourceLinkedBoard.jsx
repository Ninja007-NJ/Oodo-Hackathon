import React, { useEffect, useReducer, useRef, useState } from 'react'
import { load, save } from '../lib'
import { Button, Slider, focusRing } from './ui'
import { MapPin, FileText, Download, RotateCcw, RotateCw, Trash2 } from 'lucide-react'

const W = 1600
const H = 1000
const COLORS = ['#000000', '#2563EB', '#DC2626', '#16A34A', '#D97706', '#9333EA']
const PAPER = {
  blank: { label: 'Blank', style: {} },
  grid: {
    label: 'Grid',
    style: {
      backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    },
  },
  lines: {
    label: 'Lined',
    style: {
      backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px)',
      backgroundSize: '100% 32px',
    },
  },
}

const TOOLS = [
  ['pen', '✏', 'Pen'],
  ['highlighter', '🖍', 'Highlighter'],
  ['eraser', '⌫', 'Eraser'],
  ['text', 'T', 'Text'],
  ['pin', '📍', 'Pin Source Citation'],
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
    case 'add_stroke':
      return { ...state, strokes: [...state.strokes, a.item], redo: [] }
    case 'add_pin':
      return { ...state, pins: [...state.pins, a.pin] }
    case 'remove_pin':
      return { ...state, pins: state.pins.filter((p) => p.id !== a.id) }
    case 'undo':
      return state.strokes.length
        ? { ...state, strokes: state.strokes.slice(0, -1), redo: [...state.redo, state.strokes[state.strokes.length - 1]] }
        : state
    case 'redo':
      return state.redo.length
        ? { ...state, strokes: [...state.strokes, state.redo[state.redo.length - 1]], redo: state.redo.slice(0, -1) }
        : state
    case 'clear':
      return { ...state, strokes: [], pins: [], redo: [] }
    default:
      return state
  }
}

export default function SourceLinkedBoard({
  topicId,
  topicTitle,
  resources,
  onOpenSourcePreview,
  notify,
}) {
  const key = `hub.board.${topicId}`
  const canvasRef = useRef(null)
  const live = useRef(null)
  const textRef = useRef(null)

  const [state, dispatch] = useReducer(boardReducer, null, () => ({
    strokes: load(`${key}.strokes`, []),
    pins: load(`${key}.pins`, [
      {
        id: 'pin-default-1',
        x: 180,
        y: 120,
        title: 'Hardware Address Translation Diagram',
        resourceTitle: 'Segmentation summary (Anu)',
        resourceId: 8,
      },
    ]),
    redo: [],
  }))

  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState(COLORS[0])
  const [size, setSize] = useState(3)
  const [paper, setPaper] = useState('grid')
  const [textBox, setTextBox] = useState(null)
  const [selectedPinResource, setSelectedPinResource] = useState(resources[0]?.id || 8)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, W, H)
    state.strokes.forEach((s) => paint(ctx, s))
    save(`${key}.strokes`, state.strokes)
    save(`${key}.pins`, state.pins)
  }, [state.strokes, state.pins, key])

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
    if (tool === 'pin') {
      const targetRes = resources.find((r) => r.id === Number(selectedPinResource)) || resources[0]
      const newPin = {
        id: `pin-${Date.now()}`,
        x: p.x,
        y: p.y,
        title: `${targetRes?.title || 'Lecture Note'} citation`,
        resourceTitle: targetRes?.title || 'Lecture Note',
        resourceId: targetRes?.id || null,
      }
      dispatch({ type: 'add_pin', pin: newPin })
      notify(`Attached citation pin for "${targetRes?.title}". Click the pin to open source.`)
      setTool('pen')
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
    dispatch({ type: 'add_stroke', item: { tool: l.tool, color: l.color, size: l.size, points: l.points } })
  }

  const commitText = () => {
    const box = textBox
    const value = textRef.current?.value ?? ''
    setTextBox(null)
    if (box && value.trim()) {
      dispatch({
        type: 'add_stroke',
        item: { type: 'text', text: value, x: box.x, y: box.y, color, size: 14 + size * 3 },
      })
    }
  }

  const download = () => {
    const out = document.createElement('canvas')
    out.width = W
    out.height = H
    const ctx = out.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)
    ctx.drawImage(canvasRef.current, 0, 0)
    const name = `${topicTitle.replace(/\s+/g, '-').toLowerCase()}-board.png`
    out.toBlob((blob) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = name
      a.click()
      URL.revokeObjectURL(a.href)
      notify(`Downloaded study board as PNG`)
    })
  }

  return (
    <div className="flex flex-col h-full min-h-[550px] border border-neutral-300 rounded-2xl bg-white overflow-hidden shadow-xs">
      
      {/* Standout Feature 2 Toolbar: Source-Linked Board Controls */}
      <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Tool Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-300">
          {TOOLS.map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              aria-pressed={tool === id}
              title={label}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                tool === id ? 'bg-black text-white shadow-xs' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline text-[11px]">{label}</span>
            </button>
          ))}
        </div>

        {/* Pin Source Dropdown (visible when pin tool is chosen) */}
        {tool === 'pin' && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 p-1.5 rounded-xl animate-in fade-in duration-100">
            <span className="text-[11px] font-bold text-amber-900">Pin Target:</span>
            <select
              value={selectedPinResource}
              onChange={(e) => setSelectedPinResource(e.target.value)}
              className="bg-white border border-neutral-300 rounded-lg px-2 py-0.5 text-xs font-medium text-black focus:border-black cursor-pointer"
            >
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-amber-700 font-semibold hidden md:inline">
              (Click on board to drop pin)
            </span>
          </div>
        )}

        {/* Colors & Pen Size */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" role="group" aria-label="Palette">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ background: c }}
                className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                  color === c ? 'ring-2 ring-black ring-offset-2 scale-110' : 'border border-neutral-300'
                }`}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>

          <Slider
            label="Pen size"
            min={1}
            max={10}
            value={size}
            onChange={setSize}
            className="w-16 sm:w-20 hidden sm:block"
          />
        </div>

        {/* Paper style & Action buttons */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            {Object.entries(PAPER).map(([id, p]) => (
              <button
                key={id}
                onClick={() => setPaper(id)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                  paper === id
                    ? 'bg-neutral-800 text-white border-neutral-800'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => dispatch({ type: 'undo' })}
            disabled={!state.strokes.length}
            className="p-1.5 rounded-lg border border-neutral-300 hover:border-black text-neutral-700 bg-white disabled:opacity-40 cursor-pointer"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => dispatch({ type: 'redo' })}
            disabled={!state.redo.length}
            className="p-1.5 rounded-lg border border-neutral-300 hover:border-black text-neutral-700 bg-white disabled:opacity-40 cursor-pointer"
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={download}
            className="px-2.5 py-1 rounded-lg bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Board Canvas with Interactive Citation Pins */}
      <div className="flex-1 min-h-0 overflow-auto p-4 bg-neutral-100 relative">
        <div
          className="relative bg-white rounded-xl border border-neutral-300 shadow-sm mx-auto"
          style={{ width: W, height: H, ...PAPER[paper].style }}
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            aria-label={`Study board for ${topicTitle}`}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            style={{
              width: W,
              height: H,
              touchAction: 'none',
              cursor: tool === 'text' ? 'text' : tool === 'pin' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'crosshair',
            }}
          />

          {/* Interactive Source Citation Pins Overlay */}
          {state.pins.map((pin) => (
            <div
              key={pin.id}
              style={{ left: pin.x, top: pin.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              <button
                onClick={() => onOpenSourcePreview(pin.resourceId)}
                className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 border-2 border-black text-black shadow-md flex items-center justify-center text-sm font-bold transition-transform hover:scale-110 cursor-pointer animate-bounce"
                title={`Click to open source: ${pin.resourceTitle}`}
              >
                📍
              </button>

              {/* Pin Hover Card */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-56 p-2 rounded-xl bg-black text-white text-[11px] shadow-xl z-30 pointer-events-none">
                <span className="font-bold flex items-center gap-1 text-amber-300">
                  <MapPin className="w-3 h-3" /> Source Citation
                </span>
                <span className="font-semibold truncate mt-0.5">{pin.resourceTitle}</span>
                <span className="text-[10px] text-neutral-400">Click pin to open note in inspector</span>
              </div>
            </div>
          ))}

          {/* Text Input Overlay */}
          {textBox && (
            <input
              ref={textRef}
              autoFocus
              aria-label="Type text, press Enter to place on board"
              placeholder="Type note, then press Enter"
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
                minWidth: 160,
              }}
              className="border border-black rounded-lg px-2 py-1 bg-white text-black outline-none shadow-md z-30"
            />
          )}
        </div>
      </div>
    </div>
  )
}
