import React from 'react'
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Plus,
  Layers,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  HelpCircle,
  Trophy
} from 'lucide-react'
import { ProgressRing, focusRing } from '../components/ui'
import { CURRICULUM, OS, DBMS, DS } from '../data'

export default function DashboardView({
  user,
  recentHandoff,
  onResumeHandoff,
  onOpenCourse,
  onSelectTopic,
  onOpenSetup,
  onOpenMisconceptions,
  onOpenCompetitorMatrix,
  offlineMode,
}) {
  const firstName = user?.name?.split(' ')[0] || 'Student'

  const courses = [
    {
      subject: OS,
      semester: 4,
      coverage: 55,
      coveredCount: 2,
      partialCount: 1,
      missingCount: 2,
      totalTopics: 5,
      lastStudied: 'Segmentation',
      lastStudiedId: 'os-seg',
    },
    {
      subject: DBMS,
      semester: 4,
      coverage: 33,
      coveredCount: 1,
      partialCount: 1,
      missingCount: 1,
      totalTopics: 3,
      lastStudied: 'SQL joins',
      lastStudiedId: 'db-joins',
    },
    {
      subject: DS,
      semester: 3,
      coverage: 67,
      coveredCount: 2,
      partialCount: 1,
      missingCount: 0,
      totalTopics: 3,
      lastStudied: 'Stacks and queues',
      lastStudiedId: 'ds-stack',
    },
  ]

  const weakestTopics = [
    { title: 'Virtual memory', subject: 'Operating Systems', topicId: 'os-vm', status: 'Not found', reason: 'Zero notes attached' },
    { title: 'ACID and concurrency', subject: 'DBMS', topicId: 'db-acid', status: 'Not found', reason: 'Missing transaction locks' },
    { title: 'Segmentation', subject: 'Operating Systems', topicId: 'os-seg', status: 'Partial', reason: 'Segment tables & protection bits missing' },
  ]

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* 1. Feature 4: "Where did I leave off?" Handoff Card */}
      {recentHandoff ? (
        <section
          className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
          aria-label="Continue Studying Handoff"
        >
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Where you left off
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                • {recentHandoff.timeAgo || 'Recently active'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              Resume {recentHandoff.topicTitle}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {recentHandoff.recap || 'You were reviewing syllabus resources and notes for this topic. 2 subtopics are still missing.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onResumeHandoff}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-black text-white hover:bg-neutral-800 text-xs sm:text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer ${focusRing}`}
            >
              <span>Continue Studying</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      ) : null}

      {/* 2. Welcome Banner & Fast Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Hi {firstName}, your study dashboard
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track syllabus progress across courses, view evidence gaps, and dive into your workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenMisconceptions}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:border-black text-xs font-bold text-black shadow-xs transition-colors cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Class Misconception Map</span>
          </button>

          <button
            onClick={onOpenSetup}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a Course / Edit Syllabus</span>
          </button>
        </div>
      </div>

      {/* 3. Enrolled Courses Grid */}
      <section className="space-y-3" aria-label="Current Courses">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">
            Current Enrolled Courses ({courses.length})
          </h3>
          <span className="text-xs text-neutral-400">
            {offlineMode ? '⚡ Offline Cache Active' : 'Syllabus Mapped'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div
              key={c.subject.id}
              className="rounded-2xl border border-neutral-300 bg-white p-5 flex flex-col justify-between hover:border-black transition-all shadow-xs hover:shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400">
                      Semester {c.semester} • {c.subject.code}
                    </span>
                    <h4 className="text-base font-bold text-black mt-0.5">
                      {c.subject.title}
                    </h4>
                  </div>
                  <ProgressRing value={c.coverage} size={48} label={`${c.subject.title} Coverage`} />
                </div>

                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {c.subject.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-semibold text-neutral-600">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {c.coveredCount} covered
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    {c.partialCount} partial
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
                    {c.missingCount} missing
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-neutral-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectTopic(c.lastStudiedId)}
                  className="text-xs font-bold text-black hover:underline cursor-pointer"
                >
                  Resume {c.lastStudied} ➔
                </button>

                <button
                  onClick={() => onOpenCourse(c.subject.id)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-black bg-neutral-50 text-xs font-semibold text-black transition-colors cursor-pointer"
                >
                  Overview
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Upcoming Focus: Topics Needing Attention */}
      <section className="rounded-2xl border border-neutral-300 bg-white p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-black">
              Recommended Focus (Weakest Syllabus Evidence)
            </h3>
          </div>
          <span className="text-xs text-neutral-400">
            Focus here to raise exam readiness
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {weakestTopics.map((w) => (
            <div
              key={w.topicId}
              onClick={() => onSelectTopic(w.topicId)}
              className="p-3.5 rounded-xl border border-neutral-200 hover:border-black bg-neutral-50 hover:bg-white transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-black truncate">{w.title}</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  {w.status}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">{w.subject}</p>
              <p className="text-[10px] text-neutral-400 italic">{w.reason}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
