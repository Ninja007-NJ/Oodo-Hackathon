import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, UserPlus, PlusCircle, ChevronRight, Edit3, Check } from 'lucide-react';

export default function CoverageBanner({
  topic,
  onOpenAddModal,
  onUpdateCoverage,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(topic?.coverage_status || 'Not Found');
  const [evidenceText, setEvidenceText] = useState(topic?.coverage_evidence || '');
  const [showAiDraft, setShowAiDraft] = useState(false);
  const [communityRequested, setCommunityRequested] = useState(false);

  const handleSaveCoverage = async () => {
    await onUpdateCoverage(topic.id, selectedStatus, evidenceText);
    setIsEditing(false);
  };

  const status = topic?.coverage_status || 'Not Found';

  return (
    <div className="mb-6">
      {/* 1. COVERED STATE */}
      {status === 'Covered' && (
        <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-4 text-emerald-900 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-emerald-900">
                    Syllabus Topic Covered
                  </h3>
                  <span className="text-[10px] font-medium bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full">
                    Evidence Verified
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  {topic.coverage_evidence || 'Sufficient learning resources and lecture materials are attached to this topic.'}
                </p>
                <span className="text-[10px] text-emerald-700/80 italic block mt-1">
                  * Automated coverage estimate based on attached resources (PR003 Audit Guideline).
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium hover:underline shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PARTIALLY COVERED STATE */}
      {status === 'Partially Covered' && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-4 text-amber-900 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-900">
                    Partial Topic Coverage
                  </h3>
                  <span className="text-[10px] font-medium bg-amber-200/70 text-amber-800 px-2 py-0.5 rounded-full">
                    Gaps Detected
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {topic.coverage_evidence || 'Some subtopics or numerical derivations appear missing from your study files.'}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAddModal}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Missing Note</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. NOT FOUND (MISSING TOPIC RECOVERY) */}
      {status === 'Not Found' && (
        <div className="bg-rose-50/90 border border-rose-200/90 rounded-xl p-4 text-rose-900 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-rose-900">
                  Missing Topic Detected
                </h3>
                <span className="text-[10px] font-semibold bg-rose-200/80 text-rose-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gap Recovery Active
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                {topic.coverage_evidence || 'No verified notes or lecture links have been mapped to this required syllabus topic.'}
              </p>

              {/* Recovery Action Buttons */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-rose-200/70">
                <button
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Attach Video or Note</span>
                </button>

                <button
                  onClick={() => setCommunityRequested(true)}
                  disabled={communityRequested}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    communityRequested
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  {communityRequested ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Request Posted to Class</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ask Classmates for Notes</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowAiDraft(!showAiDraft)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{showAiDraft ? 'Hide AI Study Draft' : 'Draft AI Study Brief'}</span>
                </button>
              </div>

              {/* AI Study Draft Drawer */}
              {showAiDraft && (
                <div className="mt-3 p-3.5 bg-white border border-purple-200 rounded-lg text-slate-800 text-xs space-y-2 shadow-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-purple-100">
                    <span className="font-semibold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      AI Study Summary Brief • {topic.title}
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Unverified Draft (Silberschatz Ch 9 Reference)
                    </span>
                  </div>
                  <p className="leading-relaxed text-slate-700">
                    <strong>Concept:</strong> In an inverted page table, there is only one page table for physical memory, indexed by frame number rather than virtual page number. Each entry contains the virtual address of the page stored in that real memory location, with information about the process that owns that page.
                  </p>
                  <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-600">
                    <strong>Advantages:</strong> Decreases memory required to track virtual-to-physical address translations.<br/>
                    <strong>Drawback:</strong> Increases lookup time because searching requires scanning or hashing across the entire table.
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    Note: This is an automatically prepared study brief. You can save this draft into your private notes or upload an instructor note.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Status Review / Edit Form */}
      {isEditing && (
        <div className="mt-3 p-4 bg-white border border-slate-300 rounded-xl shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Update Coverage State
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Covered', 'Partially Covered', 'Not Found', 'Needs Review'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Evidence Note (e.g. page numbers, missing subtopics):
            </label>
            <textarea
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              rows={2}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              placeholder="Explain where evidence was found or what is missing..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCoverage}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Save Coverage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
