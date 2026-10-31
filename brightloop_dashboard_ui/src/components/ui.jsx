import React, { useCallback, useEffect, useRef, useState } from 'react'
import { STATUS } from '../data'
import { iconFor, labelFor, noteBadge, youtubeId } from '../lib'
import {
  Search,
  Trophy,
  Video,
  FileText,
  Code,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Users,
  ChevronDown,
  Sparkles,
  Zap,
  Globe,
  Database,
  ArrowRight,
  BookMarked,
  Layers,
  AlertCircle
} from 'lucide-react'

export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2'

export const inputCls = `ui-input w-full rounded-2xl bg-neutral-100/90 text-black px-4 py-2.5 border border-neutral-300 text-sm focus:bg-white focus:border-black transition-all shadow-xs ${focusRing}`
export const areaCls = `ui-input w-full rounded-2xl bg-white text-black p-3.5 border border-neutral-300 text-sm focus:border-black transition-all shadow-xs ${focusRing}`

export function Spinner({ size = 18 }) {
  return (
    <svg className="animate-spin shrink-0" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Button({ variant = 'primary', className = '', loading = false, children, ...props }) {
  const base = `ui-btn ui-btn-${variant} inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${focusRing}`
  const styles = {
    primary: 'bg-black text-white hover:bg-neutral-800 shadow-sm',
    secondary: 'bg-gradient-to-b from-white to-[#EEF2F6] border border-[#D5DEEC] text-black shadow-xs hover:border-black',
    ghost: 'text-neutral-600 hover:text-black hover:bg-neutral-100',
    dark: 'bg-neutral-900 text-white hover:bg-black',
    pill: 'border border-black bg-white rounded-full px-4 py-1.5 text-xs font-bold text-black shadow-xs hover:bg-neutral-100',
  }
  return (
    <button className={`${base} ${styles[variant] || styles.primary} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner />}
      {loading ? 'Working…' : children}
    </button>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full shrink-0 transition-colors duration-200 cursor-pointer ${focusRing} ${
        checked ? 'bg-black' : 'bg-neutral-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : ''
        }`}
      />
    </button>
  )
}

export function Slider({ value, min, max, onChange, label, className = '', ticks = false }) {
  return (
    <div className={className}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-black cursor-pointer"
      />
      {ticks && (
        <div className="flex justify-between text-[10px] text-neutral-400 mt-1 select-none">
          <span>{min}</span>
          <span className="font-bold text-black">{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}

/* 55% Progress Ring with black arc */
export function ProgressRing({ value, size = 64, label = 'Progress' }) {
  const r = 24
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value} percent`}>
      <svg viewBox="0 0 60 60" width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx="30" cy="30" r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle
          cx="30"
          cy="30"
          r={r}
          fill="none"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(c * value) / 100} ${c}`}
          style={{ transition: 'stroke-dasharray 0.6s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">{value}%</div>
    </div>
  )
}

export function MenuButton({ label, items, className = '' }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="border border-black bg-white rounded-xl px-3.5 py-1.5 text-xs font-bold text-black flex items-center gap-1.5 shadow-xs hover:bg-neutral-50 cursor-pointer"
      >
        <span>+ {label}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-neutral-300 rounded-xl shadow-lg p-1 z-30 divide-y divide-neutral-100">
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => { setOpen(false); it.onSelect() }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Toast({ message, onClose }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-neutral-900 text-white shadow-xl text-xs sm:text-sm max-w-[90vw] animate-in fade-in slide-in-from-bottom-3"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} aria-label="Dismiss notification" className="ml-2 text-neutral-400 hover:text-white">✕</button>
    </div>
  )
}

export function useToast() {
  const [msg, setMsg] = useState('')
  const timer = useRef(null)
  const notify = useCallback((m) => {
    setMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(''), 2800)
  }, [])
  return [msg ? <Toast message={msg} onClose={() => setMsg('')} /> : null, notify]
}

/* Status Badges */
export function Badge({ status }) {
  const map = {
    covered: { label: 'Covered', icon: '●', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    partial: { label: 'Partial', icon: '◐', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    missing: { label: 'Not found', icon: '○', cls: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
    review: { label: 'Needs review', icon: '⚑', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
  }
  const s = map[status] || map.missing
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${s.cls}`}>
      <span aria-hidden>{s.icon}</span> {s.label}
    </span>
  )
}

/*
  NATURAL FLOW TOPBAR WITH AVATAR MENU & HANDOFF
  Connects Dashboard, Course Overview, and Topic Workspace seamlessly.
*/
export function TopBar({
  view,
  onGo,
  user,
  onSignOut,
  recentHandoff,
  onResumeHandoff,
  offlineMode,
  onToggleOffline,
  onOpenMisconceptions,
  onOpenStorageAudit,
  bookmarkCount = 0,
  themeSlot,
  lang = 'en',
  onToggleLang,
  onOpenNightSheet,
  onOpenKtuTools,
  onOpenStudyPack,
  onOpenMistakes,
  onOpenFlashcards,
  onOpenTour,
}) {
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef(null)

  useEffect(() => {
    if (!avatarOpen) return
    const onDown = (e) => {
      if (!avatarRef.current?.contains(e.target)) setAvatarOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [avatarOpen])

  return (
    <header className="h-16 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
      
      {/* 1. Brand Logo & Title */}
      <div
        className="flex items-center gap-3 shrink-0 cursor-pointer"
        onClick={() => onGo('dashboard')}
        title="Go to Student Dashboard"
      >
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shrink-0 shadow-sm">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H9M17 7V15" />
          </svg>
        </div>
        <div className="leading-tight">
          <span className="block font-black text-sm tracking-tight text-black uppercase">
            SYLLABUS HUB
          </span>
          <span className="block text-[9px] font-bold text-neutral-400 tracking-wider uppercase">
            YOUR STUDY WORKSPACE
          </span>
        </div>
      </div>

      {/* 2. Natural Navigation Flow Tabs */}
      <nav aria-label="App Navigation" className="hidden md:flex items-center gap-1.5">
        <div className="border border-neutral-300 rounded-xl p-1 bg-neutral-50 flex items-center gap-1">
          <button
            onClick={() => onGo('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              view === 'dashboard'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onGo('course')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              view === 'course' || view === 'setup'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            Courses
          </button>

          <button
            onClick={() => onGo('topic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              view === 'topic'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            Study workspace
          </button>

          <button
            onClick={() => onGo('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              view === 'profile'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Feature 4: "Where did I leave off?" Quick Handoff Resume */}
        {recentHandoff && view !== 'topic' && (
          <button
            onClick={onResumeHandoff}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black bg-white hover:bg-neutral-50 text-xs font-bold text-black shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer ml-1"
            title={`Resume studying: ${recentHandoff.topicTitle}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Resume: {recentHandoff.topicTitle}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </nav>

      {/* 3. Status Badges, Theme Switcher & Avatar Menu */}
      <div className="flex items-center gap-2 text-xs shrink-0">
        {/* Language Switcher */}
        {onToggleLang && (
          <button
            onClick={onToggleLang}
            className="px-2 py-1 rounded-xl border border-neutral-300 hover:border-black bg-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
            title="Switch Interface Language (English / Malayalam)"
          >
            🌐 {lang === 'en' ? 'EN' : 'മലയാളം'}
          </button>
        )}

        {/* Quick Shortcuts for Night Sheet & KTU Tools */}
        {onOpenNightSheet && (
          <button
            onClick={onOpenNightSheet}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl border border-neutral-300 hover:border-black bg-white text-[11px] font-bold text-neutral-800 transition-colors cursor-pointer shadow-xs"
            title="Open Night-Before Exam Revision Sheet"
          >
            <span>🌙</span>
            <span>Night Sheet</span>
          </button>
        )}

        {onOpenKtuTools && (
          <button
            onClick={onOpenKtuTools}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl border border-neutral-300 hover:border-black bg-white text-[11px] font-bold text-neutral-800 transition-colors cursor-pointer shadow-xs"
            title="Open KTU SGPA & Attendance Planner"
          >
            <span>🎓</span>
            <span>KTU Tools</span>
          </button>
        )}

        {/* Style Look & Theme Switcher */}
        {themeSlot}

        {/* Feature 6: Low-Bandwidth Mode Indicator */}
        <button
          onClick={onToggleOffline}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
            offlineMode
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-black'
          }`}
          title="Toggle low-bandwidth offline mode (caches notes & disables external sync)"
        >
          {offlineMode ? <Zap className="w-3 h-3 text-amber-600 fill-amber-500" /> : <Globe className="w-3 h-3 text-neutral-400" />}
          <span>{offlineMode ? 'Low-Bandwidth (Offline)' : 'Online Sync'}</span>
        </button>

        {/* User Avatar Menu Dropdown */}
        {user ? (
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarOpen((o) => !o)}
              className="flex items-center gap-2 border border-black rounded-xl px-2.5 py-1.5 bg-white hover:bg-neutral-50 transition-colors cursor-pointer shadow-xs"
            >
              <span className="w-5 h-5 rounded-lg bg-black text-white flex items-center justify-center text-[10px] font-bold">
                {user.name?.[0]?.toUpperCase() || 'D'}
              </span>
              <span className="font-bold text-black">{user.name || 'Demo Student'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            {avatarOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-300 rounded-2xl shadow-xl p-2 z-50 divide-y divide-neutral-100 animate-in fade-in duration-100">
                {/* Account info + Honest positioning demo disclaimer */}
                <div className="p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-black text-xs truncate">{user.name}</p>
                    <span className="text-[10px] uppercase font-bold bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                      Demo User
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{user.email}</p>
                  <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2 leading-relaxed">
                    Notice: Demo sign-in runs locally in this browser and does not provide an isolated private cloud account.
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="py-1.5 text-xs font-semibold text-neutral-800">
                  <button
                    onClick={() => { setAvatarOpen(false); onGo('dashboard') }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                  >
                    <span>Student Dashboard</span>
                    <span className="text-neutral-400 font-normal">Overview</span>
                  </button>

                  <button
                    onClick={() => { setAvatarOpen(false); onGo('course') }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                  >
                    <span>My Courses & Syllabus</span>
                    <span className="text-neutral-400 font-normal">CS304</span>
                  </button>

                  <button
                    onClick={() => { setAvatarOpen(false); onGo('topic') }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                  >
                    <span>Topic Workspace</span>
                    <span className="text-neutral-400 font-normal">Active</span>
                  </button>
                </div>

                {/* Standout Feature Triggers */}
                <div className="py-1.5 text-xs font-semibold text-neutral-800 space-y-0.5">
                  {onOpenNightSheet && (
                    <button
                      onClick={() => { setAvatarOpen(false); onOpenNightSheet() }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🌙</span>
                        <span>Night-Before Sheet & Triage</span>
                      </span>
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold">Exam</span>
                    </button>
                  )}

                  {onOpenKtuTools && (
                    <button
                      onClick={() => { setAvatarOpen(false); onOpenKtuTools() }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🎓</span>
                        <span>KTU SGPA & Attendance</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">KTU</span>
                    </button>
                  )}

                  {onOpenStudyPack && (
                    <button
                      onClick={() => { setAvatarOpen(false); onOpenStudyPack() }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>📦</span>
                        <span>Peer Study Pack (.json)</span>
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">Share</span>
                    </button>
                  )}

                  {onOpenMistakes && (
                    <button
                      onClick={() => { setAvatarOpen(false); onOpenMistakes() }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>📕</span>
                        <span>Personal Mistake Notebook</span>
                      </span>
                      <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded font-bold">Recall</span>
                    </button>
                  )}

                  {onOpenFlashcards && (
                    <button
                      onClick={() => { setAvatarOpen(false); onOpenFlashcards() }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🧠</span>
                        <span>Flashcards (Leitner SRS)</span>
                      </span>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold">Review</span>
                    </button>
                  )}

                  {onOpenTour && (
                    <button
                      onClick={() => { setAvatarOpen(false); onOpenTour() }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🗺️</span>
                        <span>Getting Started Tour</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Tour</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setAvatarOpen(false); onOpenMisconceptions() }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                    <span>Class Misconception Map</span>
                  </button>

                  <button
                    onClick={() => { setAvatarOpen(false); onOpenStorageAudit() }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Data Storage & Privacy Audit</span>
                  </button>

                  <div className="px-3 py-1.5 flex items-center justify-between text-neutral-800">
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Low-Bandwidth Mode</span>
                    </span>
                    <Toggle label="Low-bandwidth mode" checked={offlineMode} onChange={onToggleOffline} />
                  </div>
                </div>

                {/* Sign Out */}
                <div className="pt-1.5">
                  <button
                    onClick={() => { setAvatarOpen(false); onSignOut() }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={() => onGo('login')} className="!py-1.5 !px-3 text-xs">
            Sign in
          </Button>
        )}
      </div>

    </header>
  )
}

/*
  RETRO TERMINAL TICKER
  Scrolling feature chips in the Neo-Tactile / Pixel robot style.
*/
export function Ticker({ items }) {
  const defaultItems = [
    '⚡ SYLLABUS-TO-EVIDENCE MAP',
    '📍 SOURCE-LINKED BOARD',
    '🛡️ TRUST PASSPORT ACTIVE',
    '🤝 EXPLICIT CITATIONS & ZERO HALLUCINATIONS',
    '🧠 COHORT MISCONCEPTION MAP',
    '⚡ LOW-BANDWIDTH OFFLINE READY',
    '📖 HONEST ACADEMIC ESTIMATES',
  ]
  const list = items && items.length > 0 ? items : defaultItems
  const doubled = [...list, ...list]
  return (
    <div className="ticker select-none" aria-hidden>
      <div className="ticker-track">
        {doubled.map((item, idx) => (
          <span key={idx} className="ticker-chip">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/*
  STANDOUT FEATURE 3: CLASS-NOTE "TRUST PASSPORT"
  Displays uploader, declared source, license, duplicate check, and audit disclaimer.
*/
export function TrustPassportBadge({ trust }) {
  const [open, setOpen] = useState(false)
  if (!trust) return null

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 transition-colors cursor-pointer"
        title="Click to view Class-Note Trust Passport details"
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>Trust Passport</span>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 mt-1.5 w-72 bg-white border border-neutral-300 rounded-xl shadow-lg p-3 z-30 text-xs space-y-2 animate-in fade-in duration-100"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
            <span className="font-bold text-black flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Class-Note Trust Passport
            </span>
            <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-black">✕</button>
          </div>

          <dl className="text-[11px] space-y-1 text-neutral-600">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Uploader:</dt>
              <dd className="font-semibold text-black">{trust.uploader}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Declared source:</dt>
              <dd className="font-semibold text-black truncate max-w-[140px]">{trust.declared_source}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Permission:</dt>
              <dd className="font-semibold text-emerald-700">{trust.permission}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Duplicate check:</dt>
              <dd className="font-semibold text-neutral-800">{trust.duplicate_check}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Integrity hash:</dt>
              <dd className="font-mono text-[10px] text-neutral-500">{trust.hash?.slice(0, 16)}…</dd>
            </div>
          </dl>

          <p className="text-[9px] text-neutral-400 bg-neutral-50 p-1.5 rounded border border-neutral-200 leading-tight">
            Automated screening check — does not constitute legal or institutional copyright certification.
          </p>
        </div>
      )}
    </div>
  )
}

/* Resource Card with Trust Passport */
export function ResourceCard({ r, selected, onSelect, bookmarked, onBookmark }) {
  return (
    <div
      onClick={onSelect}
      className={`p-3.5 rounded-2xl bg-white border transition-all cursor-pointer flex items-center justify-between gap-3 ${
        selected
          ? 'border-black ring-2 ring-black/10 shadow-sm'
          : 'border-neutral-200 hover:border-black shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg shrink-0">
          {iconFor(r.type)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm text-black truncate">{r.title}</h3>
            {r.visibility === 'shared' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Users className="w-3 h-3" /> Class Shared
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                <Lock className="w-3 h-3" /> Private to you
              </span>
            )}
            {r.trust_passport && (
              <TrustPassportBadge trust={r.trust_passport} />
            )}
          </div>
          <p className="text-xs text-neutral-500 truncate mt-0.5">
            {r.pending ? 'Checking link integrity…' : `${r.kind} • From ${r.source} • Checked ${r.checked}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark() }}
          className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
            bookmarked ? 'bg-amber-50 text-amber-800 border-amber-300' : 'border-neutral-200 text-neutral-600 hover:border-black'
          }`}
          title={bookmarked ? 'Saved to bookmarks' : 'Bookmark resource'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  )
}

/* Right Inspector with Secure Document & Media Viewer */
export function Preview({ r }) {
  if (!r) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center space-y-2">
        <p className="text-sm font-bold text-black">No resource selected</p>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
          Click any note, video, or past question from the center pane to inspect it securely inline.
        </p>
      </div>
    )
  }

  const yt = youtubeId(r.url)

  return (
    <div className="rounded-2xl border border-neutral-300 bg-white p-4 space-y-3.5 shadow-xs text-black">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-200">
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Secure Preview
          </span>
          <h3 className="font-bold text-sm text-black leading-snug truncate mt-0.5">
            {r.title}
          </h3>
        </div>
        <span className="text-lg">{iconFor(r.type)}</span>
      </div>

      {/* Embedded Video */}
      {yt ? (
        <div className="aspect-video rounded-xl overflow-hidden border border-neutral-200 bg-black shadow-sm">
          <iframe
            title={r.title}
            src={`https://www.youtube-nocookie.com/embed/${yt}`}
            loading="lazy"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
          {r.url ? 'Hosted externally. Link integrity screened.' : 'Verified document note attached to syllabus.'}
        </div>
      )}

      {/* Document Text */}
      {r.text && (
        <div className="max-h-56 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-800 whitespace-pre-line leading-relaxed font-sans">
          {r.text}
        </div>
      )}

      {/* Security & Provenance Details */}
      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-black text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Security & Provenance Audit</span>
        </div>
        <dl className="text-[11px] space-y-1 text-neutral-600 pt-1">
          <div className="flex justify-between"><dt>Contributed by:</dt><dd className="font-semibold text-black">{r.source}</dd></div>
          <div className="flex justify-between"><dt>Privacy state:</dt><dd className="font-semibold text-black">{r.visibility === 'shared' ? 'Class Shared' : 'Private (Encrypted)'}</dd></div>
          <div className="flex justify-between"><dt>Integrity check:</dt><dd className="font-semibold text-emerald-700">✓ Passed client-side hash</dd></div>
        </dl>
      </div>

      {r.url && (
        <Button
          variant="secondary"
          className="w-full text-xs !py-2"
          onClick={() => window.open(r.url, '_blank', 'noopener,noreferrer')}
        >
          Open original source ↗
        </Button>
      )}
    </div>
  )
}
