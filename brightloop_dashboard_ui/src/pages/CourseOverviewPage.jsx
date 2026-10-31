import React, { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  BookOpen,
  CheckCircle2,
  FileText,
  Video,
  Upload,
  Sparkles,
  HelpCircle
} from 'lucide-react'
import { ProgressRing, Badge, focusRing } from '../components/ui'
import { STATUS } from '../data'

const CONF_WEIGHT = { confident: 1, shaky: 0.5, not_started: 0 }

export default function CourseOverviewPage({
  subject,
  topics,
  resources,
  confidenceRatings = {},
  onUpdateConfidence,
  onSelectTopic,
  onBackToDashboard,
  onOpenSetup,
  onOpenMisconceptions,
  onOpenUpload,
}) {
  const [bannerMetric, setBannerMetric] = useState('confidence') // 'confidence' | 'evidence'
  const n = topics.length || 1
  const WEIGHT = { covered: 1, partial: 0.5, review: 0.25, missing: 0 }

  const evidencePct = Math.round((topics.reduce((a, t) => a + (WEIGHT[t.status] ?? 0), 0) / n) * 100)
  const confidencePct = Math.round(
    (topics.reduce((a, t) => a + (CONF_WEIGHT[confidenceRatings[t.id] || 'not_started'] ?? 0), 0) / n) * 100
  )

  const activePct = bannerMetric === 'confidence' ? confidencePct : evidencePct

  const modules = subject.modules || []
  const missingTopics = topics.filter((t) => t.status === 'missing' || t.status === 'partial')

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMisconceptions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:border-black text-xs font-bold text-black shadow-xs transition-colors cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Class Misconceptions</span>
          </button>

          <button
            onClick={onOpenSetup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:border-black text-xs font-bold text-black shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Edit Syllabus</span>
          </button>
        </div>
      </div>

      {/* Course Banner & Syllabus Evidence Summary */}
      <section className="rounded-3xl border border-neutral-300 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
              Semester 4 • {subject.code || 'CS304'}
            </span>
            <span className="text-xs text-neutral-400">• Accredited University Curriculum</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            {subject.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {subject.description || 'Core syllabus covering system architecture, process scheduling, memory virtualization, and storage management.'}
          </p>

          {/* Feature 1 Disclaimer */}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Honest Academic Metrics:</strong> Toggle between your own self-rated understanding and automated resource evidence. Not an official exam readiness certification.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-200 rounded-2xl p-4 shrink-0">
          <ProgressRing value={activePct} size={64} label={bannerMetric === 'confidence' ? 'Confidence' : 'Coverage'} />
          <div className="text-left space-y-1">
            <span className="block font-black text-xl text-black font-mono">{activePct}%</span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-neutral-200 text-[10px]">
              <button
                onClick={() => setBannerMetric('confidence')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                  bannerMetric === 'confidence' ? 'bg-black text-white' : 'text-neutral-600'
                }`}
              >
                My Rating
              </button>
              <button
                onClick={() => setBannerMetric('evidence')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                  bannerMetric === 'evidence' ? 'bg-black text-white' : 'text-neutral-600'
                }`}
              >
                Evidence
              </button>
            </div>
            <span className="block text-[10px] text-neutral-400">{topics.length} topics enrolled</span>
          </div>
        </div>
      </section>

      {/* Feature 1: Module-by-Module Syllabus-to-Evidence Map */}
      <section className="space-y-4" aria-label="Syllabus Evidence Map">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            Syllabus-to-Evidence Map
          </h2>
          <span className="text-xs text-neutral-400">
            Click any topic to open its unified workspace
          </span>
        </div>

        <div className="space-y-4">
          {modules.map((m) => {
            const moduleTopics = m.topics.filter((t) => topics.some((top) => top.id === t.id))
            if (moduleTopics.length === 0) return null

            return (
              <div key={m.id} className="rounded-2xl border border-neutral-300 bg-white overflow-hidden shadow-xs">
                {/* Module Bar */}
                <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-3 flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-black tracking-tight">
                    {m.title}
                  </h3>
                  <span className="text-xs font-semibold text-neutral-400">
                    {moduleTopics.length} topic{moduleTopics.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Topics List */}
                <div className="divide-y divide-neutral-100">
                  {moduleTopics.map((t) => {
                    const resCount = resources.filter((r) => r.topic === t.id).length
                    const conf = confidenceRatings[t.id] || 'not_started'

                    return (
                      <div
                        key={t.id}
                        onClick={() => onSelectTopic(t.id)}
                        className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 transition-colors cursor-pointer group"
                      >
                        <div className="space-y-2 min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h4 className="font-bold text-sm text-black group-hover:text-black">
                              {t.title}
                            </h4>
                            <Badge status={t.status} />
                            {t.pyqFreq && (
                              <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                                PYQ: {t.pyqFreq}
                              </span>
                            )}
                          </div>

                          {t.missing && t.missing.length > 0 ? (
                            <p className="text-xs text-amber-700 font-medium">
                              Missing subtopics: <span className="font-normal text-neutral-600">{t.missing.join(', ')}</span>
                            </p>
                          ) : (
                            <p className="text-xs text-emerald-700 font-medium">
                              Full coverage: <span className="font-normal text-neutral-500">Core learning objectives supported by class notes and past exam papers.</span>
                            </p>
                          )}

                          {/* 1-Click Topic Confidence Self-Rater */}
                          <div
                            className="flex items-center gap-1.5 pt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-1">
                              My Rating:
                            </span>
                            <button
                              onClick={() => onUpdateConfidence && onUpdateConfidence(t.id, 'confident')}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                conf === 'confident'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              }`}
                              title="Mark as Confident (Understood)"
                            >
                              🟢 Confident
                            </button>
                            <button
                              onClick={() => onUpdateConfidence && onUpdateConfidence(t.id, 'shaky')}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                conf === 'shaky'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              }`}
                              title="Mark as Shaky (Need Revision)"
                            >
                              🟡 Shaky
                            </button>
                            <button
                              onClick={() => onUpdateConfidence && onUpdateConfidence(t.id, 'not_started')}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                conf === 'not_started'
                                  ? 'bg-neutral-800 text-white shadow-xs'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              }`}
                              title="Mark as Not Started"
                            >
                              ⚪ Not Started
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-xs font-semibold text-neutral-500">
                            {resCount} resource{resCount === 1 ? '' : 's'}
                          </span>

                          <button className="px-3.5 py-1.5 rounded-xl border border-neutral-300 group-hover:border-black group-hover:bg-black group-hover:text-white bg-white text-xs font-bold text-black transition-all flex items-center gap-1.5 cursor-pointer">
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Missing Topics Action Strip */}
      {missingTopics.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <h3 className="font-bold text-xs sm:text-sm text-amber-900">
                {missingTopics.length} Syllabus Topics Need Materials
              </h3>
            </div>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Contribute Resource</span>
            </button>
          </div>

          <p className="text-xs text-amber-800">
            Topics like <strong>{missingTopics.map((t) => t.title).join(', ')}</strong> are missing complete lecture notes or solved past questions.
          </p>
        </section>
      )}
    </main>
  )
}
