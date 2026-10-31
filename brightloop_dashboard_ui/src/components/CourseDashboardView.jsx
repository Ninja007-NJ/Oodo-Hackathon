import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  ArrowRight, 
  FileText, 
  Video, 
  HelpCircle, 
  Code, 
  BookMarked, 
  Clock, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function CourseDashboardView({
  stats,
  treeData,
  onSelectTopic,
  onOpenCompetitorMatrix,
  onOpenMissingTopics,
}) {
  const currentSemester = treeData[0];
  const currentSubject = currentSemester?.subjects[0];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Top Welcome & Subject Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2">
            <span>Semester {currentSemester?.number || 4}</span>
            <span>•</span>
            <span>{currentSubject?.code || 'CS304'}</span>
            <span>•</span>
            <span className="bg-blue-500/30 px-2 py-0.5 rounded text-white">Academic Year 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {currentSubject?.name || 'Operating Systems'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {currentSubject?.description || 'Centralised syllabus-aware study workspace connecting lecture notes, videos, past exam questions, and code repositories.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onSelectTopic(7)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
            >
              <span>Jump to Module 3 (Paging Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCompetitorMatrix}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-xs border border-white/10 transition-all cursor-pointer"
            >
              <span>📊 View Track A Competitor Matrix</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Syllabus Readiness & Coverage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Overall Coverage</span>
            <span className="text-blue-600 font-bold font-mono">{stats?.coverage_percent || 70}%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats?.covered || 7} / {stats?.total_topics || 10}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Syllabus topics with verified evidence</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-emerald-200/70 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Covered Topics</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">
            {stats?.covered || 7}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Sufficient notes & lectures present</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-amber-200/70 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
            <span>Partial Coverage</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">
            {stats?.partially_covered || 2}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Missing subtopics or numericals</p>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={onOpenMissingTopics}
          className="bg-white border border-rose-200/70 rounded-xl p-4 shadow-xs hover:border-rose-400 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-medium">
            <span>Missing Topics (Gaps)</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-2">
            {stats?.not_found || 1}
          </div>
          <p className="text-[11px] text-rose-700 mt-1 font-semibold flex items-center gap-1">
            <span>Needs Recovery Action</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Mandatory PR003 Evaluation Disclaimer */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Audit Label:</strong> Coverage indicators are calculated as an automated estimate based on student-attached notes and URLs. They are not a guarantee of exam readiness.
        </span>
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Curriculum Modules Overview
          </h2>
          <span className="text-xs text-slate-400">4 Modules • 10 Learning Outcomes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSubject?.modules.map((mod) => (
            <div
              key={mod.id}
              className={`border rounded-xl p-5 bg-white transition-all shadow-xs ${
                mod.module_number === 3 ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Module {mod.module_number}
                </span>
                {mod.module_number === 3 && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Hero Demo Module
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {mod.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {mod.description}
              </p>

              {/* Topics inside this module */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                {mod.topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelectTopic(t.id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between text-xs text-slate-700 cursor-pointer"
                  >
                    <span className="truncate pr-2 font-medium">{t.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      t.coverage_status === 'Covered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : t.coverage_status === 'Partially Covered'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {t.coverage_status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
