import React, { useState } from 'react'
import { Button, focusRing } from './ui'
import { X, Package, Download, Upload, CheckCircle2, AlertTriangle, FileText, Share2, Info } from 'lucide-react'

export default function StudyPackModal({
  isOpen,
  onClose,
  subject,
  topics,
  notes,
  user,
  onImportPack,
  notify,
}) {
  const [tab, setTab] = useState('export') // 'export' | 'import'
  const [importedPack, setImportedPack] = useState(null)
  const [importError, setImportError] = useState('')

  // ==========================================
  // EXPORT LOGIC
  // ==========================================
  const handleExport = () => {
    const pack = {
      app: 'SyllabusHub',
      formatVersion: '1.0',
      exportedAt: new Date().toISOString(),
      author: user?.name || 'Anonymous Student',
      subject: {
        id: subject?.id || 'os',
        code: subject?.code || 'CS304',
        title: subject?.title || 'Operating Systems',
      },
      topicCount: topics.length,
      topics: topics.map((t) => ({ id: t.id, title: t.title })),
      notes: notes,
      peerDisclaimer: 'Peer-to-peer study pack. Created by a student; not certified by university faculty.',
    }

    const jsonStr = JSON.stringify(pack, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${subject?.code || 'CS304'}_${user?.name?.split(' ')[0] || 'Study'}.studypack.json`
    a.click()
    URL.revokeObjectURL(url)
    notify('Study pack exported! You can share this file with classmates via WhatsApp or Drive.')
  }

  // ==========================================
  // IMPORT LOGIC
  // ==========================================
  const handleFileChange = (e) => {
    setImportError('')
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (!parsed.app || !parsed.subject) {
          throw new Error('Invalid study pack file format.')
        }
        setImportedPack(parsed)
      } catch (err) {
        setImportError('Could not parse study pack. Ensure it is a valid .studypack.json file.')
        setImportedPack(null)
      }
    }
    reader.readAsText(file)
  }

  const handleConfirmMerge = () => {
    if (!importedPack) return
    onImportPack(importedPack)
    notify(`Successfully merged notes from ${importedPack.author} into your study space!`)
    onClose()
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
            Serverless Peer Study Packs
          </span>
          <h2 className="text-xl font-black text-black mt-1">
            Share Notes as Study Pack Files
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Bundle and share your notes and flashcards directly with friends via WhatsApp or Drive without requiring a central database.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
          <button
            onClick={() => setTab('export')}
            className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'export' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export My Notes</span>
          </button>

          <button
            onClick={() => setTab('import')}
            className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'import' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Classmate's Pack</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: EXPORT STUDY PACK */}
        {/* ========================================================= */}
        {tab === 'export' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="p-4 bg-neutral-50 border-2 border-black rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-black text-sm">{subject?.title || 'Operating Systems'}</span>
                  <span className="text-neutral-400 block text-[11px]">{subject?.code || 'CS304'}</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white border border-neutral-300 px-2 py-1 rounded">
                  {Object.keys(notes).length} topics with notes
                </span>
              </div>

              <div className="text-neutral-600 space-y-1">
                <p>• Bundles your typed notes for all active syllabus topics.</p>
                <p>• Includes citation anchors and study timestamps.</p>
                <p>• Completely private; nothing is uploaded to external servers.</p>
              </div>
            </div>

            <Button onClick={handleExport} className="w-full !py-3">
              <Download className="w-4 h-4" />
              <span>Download .studypack.json</span>
            </Button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: IMPORT STUDY PACK */}
        {/* ========================================================= */}
        {tab === 'import' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {/* File Dropzone */}
            <label className="border-2 border-dashed border-neutral-300 hover:border-black rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-neutral-50 hover:bg-neutral-100/50 transition-colors">
              <Package className="w-8 h-8 text-neutral-400 mb-2" />
              <span className="font-bold text-black text-sm">Choose a .studypack.json file</span>
              <span className="text-neutral-500 text-[11px] mt-0.5">Received from a classmate</span>
              <input
                type="file"
                accept=".json,.studypack.json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {importError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-2.5 font-semibold">
                {importError}
              </p>
            )}

            {/* Imported Preview */}
            {importedPack && (
              <div className="p-4 border-2 border-black rounded-2xl bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <h3 className="font-black text-black text-sm">{importedPack.subject?.title}</h3>
                    <p className="text-[11px] text-neutral-500">
                      Author: <span className="font-bold text-black">{importedPack.author}</span> · {new Date(importedPack.exportedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
                    Unverified Peer Note
                  </span>
                </div>

                <div className="text-[11px] text-neutral-600">
                  Contains notes for {Object.keys(importedPack.notes || {}).length} topics. Merging will enrich your workspace without deleting your existing notes.
                </div>

                <Button onClick={handleConfirmMerge} className="w-full !py-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Merge into My Workspace</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Peer Safety Notice */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-start gap-2 text-xs text-neutral-600">
          <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold text-black">Peer Integrity Notice:</span> Study packs are intended for collaborative student review. Always cross-check peer formulas and explanations against your university's official syllabus and prescribed textbooks.
          </p>
        </div>
      </div>
    </div>
  )
}
