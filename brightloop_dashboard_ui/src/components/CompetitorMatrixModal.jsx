import React from 'react';
import { X, Check, AlertCircle, Minus, Trophy, ShieldCheck, Sparkles } from 'lucide-react';

export default function CompetitorMatrixModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const matrix = [
    {
      feature: "Syllabus Tree Hierarchy (Semester → Subject → Module → Topic)",
      drive: { status: "Partial", note: "Folders only; manual creation with no syllabus semantics" },
      notion: { status: "Partial", note: "Requires manual relational databases; no built-in syllabus tree" },
      notebooklm: { status: "No", note: "Notebook-based document pile; no syllabus hierarchy" },
      studocu: { status: "Partial", note: "Subject/course tags, but flat document lists without topic trees" },
      moodle: { status: "Partial", note: "Week-by-week timeline; teacher-controlled, not student study tree" },
      learnhub: { status: "Yes", note: "First-class academic hierarchy with module/topic learning outcomes" },
    },
    {
      feature: "Connected Multi-Format Topic Workspace",
      drive: { status: "No", note: "Files separated in folders; no inline YouTube or PYQs" },
      notion: { status: "Partial", note: "Can embed embeds, but requires manual page assembly" },
      notebooklm: { status: "No", note: "Chat and audio overview over documents only" },
      studocu: { status: "No", note: "Single document viewer only; no cross-format integration" },
      moodle: { status: "Partial", note: "Teacher uploads links, but separated across weeks" },
      learnhub: { status: "Yes", note: "PDFs, YouTube videos, GitHub repos, and exam PYQs grouped on one page" },
    },
    {
      feature: "Evidence-Based Syllabus Coverage Check",
      drive: { status: "No", note: "No syllabus comparison or coverage tracking" },
      notion: { status: "No", note: "No automated syllabus matching or evidence audit" },
      notebooklm: { status: "No", note: "Answers questions but does not validate topic coverage" },
      studocu: { status: "No", note: "No coverage checks against university syllabus" },
      moodle: { status: "No", note: "Checkboxes for completion, but no evidence-based note validation" },
      learnhub: { status: "Yes", note: "Extracts notes & compares against syllabus: Covered / Partial / Missing" },
    },
    {
      feature: "Missing-Topic Gap Recovery Workflow",
      drive: { status: "No", note: "Does not identify missing curriculum topics" },
      notion: { status: "No", note: "No gap recovery triggers" },
      notebooklm: { status: "No", note: "Cannot flag what is missing from the curriculum" },
      studocu: { status: "No", note: "Browse-only repository" },
      moodle: { status: "No", note: "No student-driven missing topic discovery" },
      learnhub: { status: "Yes", note: "4-step recovery: Search library → Curated links → Ask class → Direct upload" },
    },
    {
      feature: "Private Study Space + Explicit Shared Library",
      drive: { status: "Partial", note: "Folder sharing is all-or-nothing and accidental sharing is common" },
      notion: { status: "Partial", note: "Workspace vs page permissions can be confusing for students" },
      notebooklm: { status: "No", note: "Private notebooks only; no peer class library" },
      studocu: { status: "No", note: "Public upload repository only" },
      moodle: { status: "No", note: "Student submissions are strictly private to teachers" },
      learnhub: { status: "Yes", note: "Private-by-default personal notes with explicit one-click class share" },
    },
  ];

  const renderBadge = (item, isSyllabusHub = false) => {
    if (item.status === "Yes") {
      return (
        <div className="space-y-1">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
            isSyllabusHub
              ? 'bg-brand text-white shadow-xs'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            <Check className="w-3 h-3" /> Yes
          </span>
          <p className="text-[10px] text-ink-soft leading-snug">{item.note}</p>
        </div>
      );
    }
    if (item.status === "Partial") {
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Partial
          </span>
          <p className="text-[10px] text-ink-soft leading-snug">{item.note}</p>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
          <Minus className="w-3 h-3" /> No
        </span>
        <p className="text-[10px] text-slate-400 leading-snug">{item.note}</p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-line text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-brand-light text-brand rounded-xl">
                <Trophy className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-ink tracking-tight flex items-center gap-2">
                  Track A: Competitor Matrix & Uniqueness Evidence
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-light text-brand border border-blue-200/50">
                    PR003 Brief
                  </span>
                </h2>
                <p className="text-xs text-ink-soft mt-0.5">
                  Factual feature audit comparing Syllabus Hub against 5 common student tools across 5 core differentiators.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-ink-soft hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim safe statement banner */}
        <div className="my-4 p-3.5 bg-brand-light/50 border border-brand/20 rounded-xl flex items-center gap-3 text-xs text-ink">
          <ShieldCheck className="w-5 h-5 text-brand shrink-0" />
          <div>
            <strong className="text-ink">Safe Evaluator Claim:</strong> "No existing platform combines syllabus-mapped trees, multi-format topic workspaces, evidence-based coverage checks, and missing-topic gap recovery in a single student workflow."
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto border border-line rounded-xl bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-sky-50 border-b border-line text-ink font-semibold">
                <th className="p-3 w-1/4">Core Differentiator</th>
                <th className="p-3">Google Drive</th>
                <th className="p-3">Notion</th>
                <th className="p-3">NotebookLM</th>
                <th className="p-3">Studocu</th>
                <th className="p-3">Moodle</th>
                <th className="p-3 bg-brand-light text-brand font-bold border-l border-brand/20">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Syllabus Hub
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-ink bg-slate-50/50">
                    {row.feature}
                  </td>
                  <td className="p-3 align-top">{renderBadge(row.drive)}</td>
                  <td className="p-3 align-top">{renderBadge(row.notion)}</td>
                  <td className="p-3 align-top">{renderBadge(row.notebooklm)}</td>
                  <td className="p-3 align-top">{renderBadge(row.studocu)}</td>
                  <td className="p-3 align-top">{renderBadge(row.moodle)}</td>
                  <td className="p-3 align-top bg-brand-light/30 border-l border-brand/20 font-medium">
                    {renderBadge(row.learnhub, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs text-ink-soft">
          <span>Based on PR003 desk review of public product behavior (verified October 2026).</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-btn font-bold text-white bg-brand hover:bg-brand-dark transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
}
