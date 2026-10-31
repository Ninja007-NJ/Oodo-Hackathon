import React, { useEffect, useRef, useState } from 'react'
import { PIXEL, THEMES, defaultSettings } from '../theme'
import { Button, Slider, Toggle, focusRing } from './ui'

export default function ThemePanel({ settings, onChange }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const btn = useRef(null)
  const pixel = settings.look === 'pixel'

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const set = (patch) => onChange({ ...settings, ...patch })
  const choice = (active) => `flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-left rounded-xl transition-all duration-200 cursor-pointer ${focusRing} ${active ? 'bg-black text-white font-bold shadow-xs' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'}`
  const palette = pixel ? PIXEL : THEMES
  const current = pixel ? settings.pixel : settings.theme

  return (
    <div ref={wrap} className="relative" onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }}>
      <button
        ref={btn}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-neutral-300 hover:border-black bg-white text-black transition-colors shadow-xs cursor-pointer ${focusRing}`}
        title="Switch Look (Pixel Robot vs Neon Glass)"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden />
        <span>Look</span>
      </button>

      {open && (
        <div role="dialog" aria-label="Look and theme settings" className="absolute right-0 mt-2 w-72 bg-white border border-neutral-300 rounded-2xl p-4 shadow-xl text-black z-50 space-y-4 animate-in fade-in duration-100">
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Style Look</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => set({ look: 'pixel' })} aria-pressed={pixel} className={choice(pixel)}>
                🤖 Pixel robot
              </button>
              <button onClick={() => set({ look: 'neon' })} aria-pressed={!pixel} className={choice(!pixel)}>
                ✨ Neon glass
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">{pixel ? 'Accent Colour' : 'Neon Theme'}</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(palette).map(([id, t]) => (
                <button key={id} onClick={() => set(pixel ? { pixel: id } : { theme: id })} aria-pressed={current === id} className={choice(current === id)}>
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: `rgb(${pixel ? t.vars['--brand'] : t.vars['--glow']})` }} aria-hidden />
                  <span className="truncate">{t.name.replace('Neon ', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {!pixel && (
            <label className="block text-xs font-bold text-neutral-600">Glow intensity
              <Slider label="Glow intensity" min={0} max={150} value={settings.intensity} onChange={(v) => set({ intensity: v })} ticks className="mt-2" />
            </label>
          )}

          <div className="flex items-center gap-3 text-xs pt-1 border-t border-neutral-200">
            <span className="flex-1">
              <span className="font-bold block">Blur & ticker motion</span>
              <span className="text-[10px] text-neutral-400">Turn off on slow devices.</span>
            </span>
            <Toggle label="Blur and motion" checked={settings.effects} onChange={(v) => set({ effects: v })} />
          </div>

          <Button variant="secondary" className="w-full !py-1.5 text-xs font-bold" onClick={() => onChange(defaultSettings())}>
            Reset Default Look
          </Button>
        </div>
      )}
    </div>
  )
}
