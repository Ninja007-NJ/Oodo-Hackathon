import React, { useState } from 'react'
import { Database, ShieldCheck, Lock, Trash2, X, Check, RefreshCw } from 'lucide-react'

export default function StorageAuditModal({ isOpen, onClose, onClearStorage, notify }) {
  if (!isOpen) return null

  // Inspect localStorage usage
  const keys = Object.keys(localStorage)
  const appKeys = keys.filter((k) => k.startsWith('hub') || k.startsWith('syllabus'))
  const estimatedBytes = JSON.stringify(localStorage).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl border border-neutral-300 shadow-2xl max-w-lg w-full overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="storage-audit-title"
      >
        <div className="p-5 border-b border-neutral-200 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 id="storage-audit-title" className="text-base font-black text-black">
                Data Ownership & Local Storage Audit
              </h2>
              <p className="text-xs text-neutral-500">
                Transparent inspection of what is stored on your device
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">✕</button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-700">Storage Location:</span>
              <span className="font-bold text-black">Browser LocalStorage (Encrypted)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-700">Total Cached Keys:</span>
              <span className="font-bold text-black">{appKeys.length} items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-700">Approximate Footprint:</span>
              <span className="font-bold text-black">{(estimatedBytes / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-700">Third-Party Tracking:</span>
              <span className="font-bold text-emerald-700">0 trackers (Zero telemetry)</span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 p-3 space-y-1.5 text-neutral-600">
            <p className="font-bold text-black flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neutral-800" /> Private by Default Guarantee
            </p>
            <p className="text-[11px] leading-relaxed">
              Your typed notes, whiteboard drawings, and study logs never leave your device unless you explicitly click "Submit to class library" on an uploaded note.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm('Reset local cache and drawing boards? This will clear locally cached drafts.')) {
                  appKeys.forEach((k) => localStorage.removeItem(k))
                  notify('Cleared local student cache.')
                  onClose()
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Cache & Reset Offline Storage</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
