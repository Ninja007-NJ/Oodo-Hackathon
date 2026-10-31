import React, { useState } from 'react';
import { AlertCircle, PlusCircle, UserPlus, Sparkles, Search, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

export default function MissingTopicsView({
  treeData,
  onSelectTopic,
  onOpenAddModal,
}) {
  const [requestedTopics, setRequestedTopics] = useState({});
  const [draftedTopics, setDraftedTopics] = useState({});

  // Collect all topics that are "Not Found" or "Partially Covered"
  const missingItems = [];
  if (treeData && treeData.length > 0) {
    for (const sem of treeData) {
      for (const sub of sem.subjects) {
        for (const mod of sub.modules) {
          for (const top of mod.topics) {
            if (top.coverage_status === 'Not Found' || top.coverage_status === 'Partially Covered') {
              missingItems.push({
                subjectName: sub.name,
                subjectCode: sub.code,
                moduleNumber: mod.module_number,
                moduleTitle: mod.title,
                topic: top,
              });
            }
          }
        }
      }
    }
  }

  const toggleRequest = (id) => {
    setRequestedTopics((prev) => ({ ...prev, [id]: true }));
  };

  const toggleDraft = (id) => {
    setDraftedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            Missing Topic Recovery Hub (Stage 7)
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          These required syllabus learning outcomes have either zero notes or partial coverage in your library.
          Use the 4 recovery steps to close the gap before exams.
        </p>
      </div>

      {missingItems.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-emerald-950">Full Syllabus Covered!</h3>
          <p className="text-xs text-emerald-800 mt-1">All topics in this course have verified learning resources attached.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {missingItems.map(({ subjectName, subjectCode, moduleNumber, moduleTitle, topic }) => {
            const isMissing = topic.coverage_status === 'Not Found';
            const isRequested = !!requestedTopics[topic.id];
            const isDrafted = !!draftedTopics[topic.id];

            return (
              <div
                key={topic.id}
                className={`border rounded-2xl p-5 bg-white transition-all shadow-xs ${
                  isMissing ? 'border-rose-200' : 'border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-1">
                      <span>{subjectCode}</span>
                      <span>›</span>
                      <span>Module {moduleNumber}: {moduleTitle}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {topic.description}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 self-start ${
                      isMissing
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isMissing ? 'bg-rose-600' : 'bg-amber-600'}`} />
                    {isMissing ? 'Not Found in Library' : 'Partially Covered'}
                  </span>
                </div>

                {/* Evidence Note */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 mb-4">
                  <strong className="text-slate-900 block mb-0.5">Coverage Audit:</strong>
                  {topic.coverage_evidence || 'No verified lecture notes or past year questions found for this topic.'}
                </div>

                {/* 4-Step Recovery Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  {/* Step 1: Jump to Topic */}
                  <button
                    onClick={() => onSelectTopic(topic.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Topic Workspace</span>
                  </button>

                  {/* Step 2: Attach Link / Upload */}
                  <button
                    onClick={() => onOpenAddModal(topic.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs cursor-pointer transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Upload Notes / Paste URL</span>
                  </button>

                  {/* Step 3: Ask Classmates */}
                  <button
                    onClick={() => toggleRequest(topic.id)}
                    disabled={isRequested}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      isRequested
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isRequested ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Request Sent to Class</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ask Class for Notes</span>
                      </>
                    )}
                  </button>

                  {/* Step 4: AI Study Brief */}
                  <button
                    onClick={() => toggleDraft(topic.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>{isDrafted ? 'Hide AI Brief' : 'Draft AI Study Brief'}</span>
                  </button>
                </div>

                {/* Collapsible AI Study Brief */}
                {isDrafted && (
                  <div className="mt-3.5 p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-purple-200">
                      <span className="font-bold flex items-center gap-1.5 text-purple-900">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        AI Study Summary Draft • {topic.title}
                      </span>
                      <span className="text-[10px] font-mono bg-purple-200/80 px-2 py-0.5 rounded text-purple-900 font-semibold">
                        Grounded Syllabus Draft
                      </span>
                    </div>
                    <p className="leading-relaxed text-slate-800">
                      <strong>Core Exam Concept:</strong> {topic.description}.
                      This topic frequently appears in university end-semester exams under 6-to-10 mark conceptual and architecture questions.
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-purple-100 text-[11px] text-slate-700">
                      <strong>Recommended Open Learning Resources:</strong>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5">
                        <li>Silberschatz, Galvin: <em>Operating System Concepts (10th Ed)</em></li>
                        <li>NPTEL / Gate Smashers Video Lecture Series</li>
                      </ul>
                    </div>
                    <p className="text-[10px] text-purple-700 italic">
                      * Clearly marked AI draft. Review and verify against your department syllabus before exam submission.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
