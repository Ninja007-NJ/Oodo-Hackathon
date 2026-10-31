import React, { useState } from 'react'
import { Button, focusRing, inputCls } from '../components/ui'
import {
  User,
  Mail,
  Download,
  Database,
  Lock,
  ShieldCheck,
  Check,
  ArrowLeft,
  Trash2,
  Sparkles
} from 'lucide-react'
import BackupPanel from '../components/BackupPanel'
import PrivacySupportPanel from '../components/PrivacySupportPanel'

export default function ProfilePage({
  user,
  onSaveUser,
  topics,
  resources,
  notes,
  bookmarks,
  onBack,
  notify,
  onRestoredProfile = () => {},
  onCleared = () => {},
}) {
  const [name, setName] = useState(user?.name || 'Demo Student')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSaveUser({ ...user, name: name.trim() })
    setSavedSuccess(true)
    notify('Profile updated on this device.')
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  // Export all study data to JSON
  const handleExportData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      studentProfile: {
        name: user.name,
        email: user.email,
        mode: 'Demo Student (Browser-Local)',
      },
      enrolledTopics: topics.map((t) => ({ id: t.id, title: t.title, status: t.status })),
      personalNotes: notes,
      bookmarkedResourceIds: bookmarks,
      savedResourcesCount: resources.length,
      storageNote: 'This data was exported from Syllabus Hub client-side storage.',
    }

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `syllabus-hub-study-data-${(user.name || 'student').toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    notify('Your study data export (.json) has downloaded.')
  }

  const personalNotesCount = Object.values(notes).filter((n) => n?.trim()).length

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to dashboard</span>
        </button>
      </div>

      {/* Header */}
      <section className="rounded-3xl border border-neutral-300 bg-white p-6 sm:p-8 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
            Account & Privacy
          </span>
          <span className="text-xs text-neutral-400">• Browser-Local Profile</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Student Profile & Data Ownership
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Manage your student display name, inspect local storage footprints, and download a complete copy of your notes and syllabus data.
        </p>
      </section>

      {/* Profile Form */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Left Column: Edit Profile */}
        <section className="rounded-2xl border border-neutral-300 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
            <User className="w-4 h-4 text-black" />
            <h2 className="text-sm font-bold text-black">Profile Details</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <label className="block text-xs font-bold text-neutral-700">
              Display Name
              <input
                className={`${inputCls} mt-1`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student Name"
              />
            </label>

            <label className="block text-xs font-bold text-neutral-700">
              Email Address (Read-only in Demo)
              <input
                className={`${inputCls} mt-1 bg-neutral-100 text-neutral-500 cursor-not-allowed`}
                value={user.email}
                readOnly
              />
            </label>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" className="!py-2 !px-5 text-xs font-bold">
                Save Profile
              </Button>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved!
                </span>
              )}
            </div>
          </form>

          <p className="text-[11px] text-neutral-400 pt-2 leading-relaxed">
            Changing your name updates all locally generated session summaries and Trust Passport declarations.
          </p>
        </section>

        {/* Right Column: Data Export & Storage Explanation */}
        <section className="rounded-2xl border border-neutral-300 bg-white p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
              <Database className="w-4 h-4 text-black" />
              <h2 className="text-sm font-bold text-black">Your Data & Privacy</h2>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              This demo stores your profile, typed notes, and whiteboard drawings inside this browser's local storage. It does not send your private notes to a third-party server.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="block font-black text-sm text-black">{topics.length}</span>
                <span className="block text-[10px] text-neutral-500 font-medium">Topics</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="block font-black text-sm text-black">{personalNotesCount}</span>
                <span className="block text-[10px] text-neutral-500 font-medium">Notes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="block font-black text-sm text-black">{bookmarks.length}</span>
                <span className="block text-[10px] text-neutral-500 font-medium">Bookmarks</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 space-y-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleExportData}
              className="w-full !py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download My Study Data (.json)</span>
            </Button>
            <p className="text-[10px] text-neutral-400 text-center">
              Includes full syllabus notes, bookmarks, and topic coverage records.
            </p>
          </div>
        </section>
      </div>

      {/* Profile-Scoped Backup, Restore & Storage Footprint */}
      <BackupPanel
        user={user}
        onRestoredProfile={onRestoredProfile}
        onCleared={onCleared}
      />

      {/* Privacy Notice, Gemini Data Custody & Pilot Takedown / Feedback Panel */}
      <PrivacySupportPanel />

      {/* Honest Positioning & Architecture Notice */}
      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-2 text-xs">
        <h3 className="font-bold text-black flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Notice on Multi-Student Cloud Synchronization</span>
        </h3>
        <p className="text-neutral-600 leading-relaxed">
          The current frontend is an interactive client-side workspace. For real-time multi-student synchronization across devices, this UI connects to the FastAPI backend with per-course permissions, authenticated user accounts, and database storage.
        </p>
      </section>

    </main>
  )
}
