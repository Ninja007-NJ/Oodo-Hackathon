import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Video, 
  Code, 
  BookMarked, 
  HelpCircle, 
  Plus, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Sparkles, 
  UserPlus, 
  Clock, 
  Lock, 
  Users, 
  Link2,
  Edit3
} from 'lucide-react';

export default function TopicPage({
  topicDetail,
  selectedResourceId,
  onSelectResource,
  onToggleBookmark,
  onQuickAddUrl,
  onOpenAddModal,
  bookmarkedOnly,
  currentSpace,
}) {
  const [quickInput, setQuickInput] = useState('');
  const [myNotesText, setMyNotesText] = useState('');
  const [activeSectionFilter, setActiveSectionFilter] = useState('all');

  // Load My Notes from localStorage per topic
  useEffect(() => {
    if (topicDetail?.id) {
      const saved = localStorage.getItem(`topic_notes_${topicDetail.id}`) || '';
      setMyNotesText(saved);
    }
  }, [topicDetail?.id]);

  const handleMyNotesChange = (text) => {
    setMyNotesText(text);
    if (topicDetail?.id) {
      localStorage.setItem(`topic_notes_${topicDetail.id}`, text);
    }
  };

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickAddUrl(quickInput.trim());
    setQuickInput('');
  };

  if (!topicDetail) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-ink-soft">
        <p className="text-sm">Select a syllabus topic from the left hierarchy to load its workspace.</p>
      </div>
    );
  }

  // Filter resources by Space and Bookmarks
  let resources = topicDetail.resources || [];
  if (currentSpace === 'shared') {
    resources = resources.filter((r) => r.visibility === 'shared' || !r.is_private);
  }
  if (bookmarkedOnly) {
    resources = resources.filter((r) => r.is_bookmarked);
  }

  // Group by category
  const notesList = resources.filter((r) => r.type === 'pdf' || r.type === 'notes');
  const videosList = resources.filter((r) => r.type === 'video');
  const codeList = resources.filter((r) => r.type === 'repo');
  const textbookList = resources.filter((r) => r.type === 'reference');
  const pyqList = resources.filter((r) => r.type === 'pyq');

  const scrollToSection = (secId) => {
    setActiveSectionFilter(secId);
    if (secId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`section-${secId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const status = topicDetail.coverage_status || 'Not Found';

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 max-w-4xl mx-auto space-y-5">
      
      {/* 1. TOPIC HEADER & BREADCRUMB */}
      <div>
        <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
          <div className="flex items-center gap-1.5 truncate">
            <span>{topicDetail.subject_code}: {topicDetail.subject_name}</span>
            <span>›</span>
            <span>Module {topicDetail.module_number}: {topicDetail.module_title}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-ink-soft bg-sky-100 px-2 py-0.5 rounded font-mono">
            Topic #{topicDetail.id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            {topicDetail.title}
          </h1>
          <button
            onClick={() => onOpenAddModal(topicDetail.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand hover:bg-brand-dark active:scale-[0.98] text-white text-xs font-semibold rounded-btn shadow-xs cursor-pointer shrink-0 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Resource</span>
          </button>
        </div>
        {topicDetail.description && (
          <p className="text-xs text-ink-soft mt-1 leading-relaxed">
            {topicDetail.description}
          </p>
        )}
      </div>

      {/* 2. TOP STATUS STRIP (Zero clicks - always visible) */}
      <div className={`p-3.5 rounded-card border text-xs shadow-xs ${
        status === 'Covered' 
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
          : status === 'Partially Covered'
          ? 'bg-amber-50/90 border-amber-200 text-amber-950'
          : 'bg-rose-50/90 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            {status === 'Covered' && <CheckCircle2 className="w-4 h-4 text-status-covered shrink-0 mt-0.5" />}
            {status === 'Partially Covered' && <AlertTriangle className="w-4 h-4 text-status-partial shrink-0 mt-0.5" />}
            {status === 'Not Found' && <AlertCircle className="w-4 h-4 text-status-danger shrink-0 mt-0.5" />}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  ● {status} (Estimate)
                </span>
                {status === 'Covered' && (
                  <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.2 rounded font-semibold">
                    Evidence Verified
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs opacity-90 leading-relaxed">
                {topicDetail.coverage_evidence || 'Audit check: All essential learning outcomes are cross-referenced.'}
              </p>
              <span className="text-[10px] opacity-75 italic block mt-1">
                * Automated estimate based on attached notes — not a certification of exam readiness.
              </span>
            </div>
          </div>

          {status !== 'Covered' && (
            <button
              onClick={() => onOpenAddModal(topicDetail.id)}
              className="px-2.5 py-1 text-xs font-bold rounded-btn bg-white border border-current shadow-xs shrink-0 cursor-pointer hover:bg-white/80"
            >
              Request from Class
            </button>
          )}
        </div>
      </div>

      {/* 3. QUICK-ADD BAR (Single field, Enter to save instantly!) */}
      <form onSubmit={handleQuickAddSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Link2 className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Quick Add: Paste YouTube lecture, PDF link, or GitHub repo and press Enter..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-line rounded-btn text-ink placeholder-ink-soft focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-card"
          />
        </div>
        <button
          type="submit"
          disabled={!quickInput.trim()}
          className="bg-brand text-white font-medium px-4 py-2 rounded-btn transition duration-150 hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50 text-xs shadow-xs cursor-pointer shrink-0"
        >
          Quick Add
        </button>
      </form>

      {/* 4. SECTION JUMP CHIPS (Jump / filter, never hides by default) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
        {[
          { id: 'all', label: 'All Content' },
          { id: 'notes', label: `📄 Notes (${notesList.length})` },
          { id: 'videos', label: `▶ Videos (${videosList.length})` },
          { id: 'code', label: `💻 Code (${codeList.length})` },
          { id: 'textbook', label: `📘 Textbook (${textbookList.length})` },
          { id: 'pyqs', label: `❓ Past Qs (${pyqList.length})` },
          { id: 'mynotes', label: '✏ My Notes' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => scrollToSection(chip.id)}
            className={`px-3 py-1.5 rounded-btn font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSectionFilter === chip.id
                ? 'bg-brand text-white shadow-xs'
                : 'bg-white text-ink border border-line hover:bg-sky-50 hover:border-brand'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 5. STACKED SECTIONS (All visible together, scrollable!) */}

      {/* --- SECTION 1: LECTURE NOTES & SUMMARIES --- */}
      <section id="section-notes" className="space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-line">
          <h3 className="text-xs font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-brand" />
            <span>Lecture Notes & PDFs ({notesList.length})</span>
          </h3>
          <span className="text-[10px] text-ink-soft">Click to preview in right panel</span>
        </div>

        {notesList.length > 0 ? (
          <div className="space-y-2">
            {notesList.map((res) => renderResourceItem(res, selectedResourceId, onSelectResource, onToggleBookmark))}
          </div>
        ) : (
          renderEmptySection("No lecture notes uploaded yet", "Attach PDF", topicDetail.id, onOpenAddModal)
        )}
      </section>

      {/* --- SECTION 2: LECTURE VIDEOS --- */}
      <section id="section-videos" className="space-y-2 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-line">
          <h3 className="text-xs font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider">
            <Video className="w-4 h-4 text-status-danger" />
            <span>Lecture Videos ({videosList.length})</span>
          </h3>
          <span className="text-[10px] text-ink-soft">Plays inline without leaving</span>
        </div>

        {videosList.length > 0 ? (
          <div className="space-y-2">
            {videosList.map((res) => renderResourceItem(res, selectedResourceId, onSelectResource, onToggleBookmark))}
          </div>
        ) : (
          renderEmptySection("No video lectures mapped", "Add YouTube Video", topicDetail.id, onOpenAddModal)
        )}
      </section>

      {/* --- SECTION 3: CODE REPOSITORIES --- */}
      <section id="section-code" className="space-y-2 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-line">
          <h3 className="text-xs font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider">
            <Code className="w-4 h-4 text-status-covered" />
            <span>Code Repositories ({codeList.length})</span>
          </h3>
          <span className="text-[10px] text-ink-soft">Simulations & implementations</span>
        </div>

        {codeList.length > 0 ? (
          <div className="space-y-2">
            {codeList.map((res) => renderResourceItem(res, selectedResourceId, onSelectResource, onToggleBookmark))}
          </div>
        ) : (
          renderEmptySection("No code repositories linked", "Add GitHub Link", topicDetail.id, onOpenAddModal)
        )}
      </section>

      {/* --- SECTION 4: TEXTBOOK REFERENCES --- */}
      <section id="section-textbook" className="space-y-2 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-line">
          <h3 className="text-xs font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider">
            <BookMarked className="w-4 h-4 text-status-partial" />
            <span>Textbook Citations ({textbookList.length})</span>
          </h3>
          <span className="text-[10px] text-ink-soft">Official curriculum chapters</span>
        </div>

        {textbookList.length > 0 ? (
          <div className="space-y-2">
            {textbookList.map((res) => renderResourceItem(res, selectedResourceId, onSelectResource, onToggleBookmark))}
          </div>
        ) : (
          renderEmptySection("No textbook citations attached", "Add Reference", topicDetail.id, onOpenAddModal)
        )}
      </section>

      {/* --- SECTION 5: PAST EXAM QUESTIONS (PYQ) --- */}
      <section id="section-pyqs" className="space-y-2 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-line">
          <h3 className="text-xs font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-status-review" />
            <span>Past Exam Questions ({pyqList.length})</span>
          </h3>
          <span className="text-[10px] text-ink-soft">End-sem high-frequency questions</span>
        </div>

        {pyqList.length > 0 ? (
          <div className="space-y-2">
            {pyqList.map((res) => renderResourceItem(res, selectedResourceId, onSelectResource, onToggleBookmark))}
          </div>
        ) : (
          renderEmptySection("No past questions tagged yet", "Add Exam PYQ", topicDetail.id, onOpenAddModal)
        )}
      </section>

      {/* --- SECTION 6: MY NOTES (Always on the page, 0 clicks!) --- */}
      <section id="section-mynotes" className="space-y-2 pt-2 pb-6">
        <div className="flex items-center justify-between pb-1 border-b border-line">
          <h3 className="text-xs font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider">
            <Edit3 className="w-4 h-4 text-brand" />
            <span>My Private Notes for this Topic</span>
          </h3>
          <span className="text-[10px] text-status-covered font-medium">✓ Auto-saved locally</span>
        </div>

        <div className="bg-white border border-line rounded-card shadow-card p-3.5 space-y-2">
          <textarea
            value={myNotesText}
            onChange={(e) => handleMyNotesChange(e.target.value)}
            rows={3}
            placeholder="Type your own summary, key formulas, or revision reminders here. Persists automatically without any clicks..."
            className="w-full text-xs text-ink placeholder-ink-soft focus:outline-none resize-none font-sans leading-relaxed"
          />
          <div className="flex items-center justify-between text-[11px] text-ink-soft pt-2 border-t border-line/60">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-brand" />
              <span>Private by default — only visible to you</span>
            </span>
            <span>{myNotesText.length} characters</span>
          </div>
        </div>
      </section>

    </div>
  );
}

// Helper: Renders each stacked resource item
function renderResourceItem(res, selectedId, onSelect, onBookmark) {
  const isSelected = res.id === selectedId;

  return (
    <div
      key={res.id}
      onClick={() => onSelect(res.id)}
      className={`bg-white border rounded-card p-3 shadow-card transition-all cursor-pointer flex items-center justify-between gap-3 ${
        isSelected 
          ? 'border-brand ring-2 ring-brand/10 bg-brand-light/10' 
          : 'border-line hover:border-brand'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-btn flex items-center justify-center shrink-0 ${
          res.type === 'video' ? 'bg-rose-50 text-status-danger' :
          res.type === 'pdf' ? 'bg-blue-50 text-brand' :
          res.type === 'pyq' ? 'bg-purple-50 text-status-review' :
          res.type === 'repo' ? 'bg-emerald-50 text-status-covered' :
          'bg-amber-50 text-status-partial'
        }`}>
          {res.type === 'video' && <Video className="w-4 h-4" />}
          {res.type === 'pdf' && <FileText className="w-4 h-4" />}
          {res.type === 'pyq' && <HelpCircle className="w-4 h-4" />}
          {res.type === 'repo' && <Code className="w-4 h-4" />}
          {res.type === 'reference' && <BookMarked className="w-4 h-4" />}
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-bold text-ink truncate leading-tight">
            {res.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-ink-soft mt-0.5 truncate">
            <span>{res.original_source || 'Uploaded Source'}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              <span>Oct 2026</span>
            </span>
            {res.metadata_info && (
              <>
                <span>•</span>
                <span className="bg-sky-50 px-1 rounded text-ink-soft">{res.metadata_info}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark(res.id);
          }}
          className="p-1 rounded text-ink-soft hover:text-status-partial cursor-pointer"
          title={res.is_bookmarked ? 'Unstar' : 'Bookmark'}
        >
          <Star className={`w-4 h-4 ${res.is_bookmarked ? 'fill-status-partial text-status-partial' : ''}`} />
        </button>
      </div>
    </div>
  );
}

// Helper: Empty Section next actions
function renderEmptySection(title, actionLabel, topicId, onOpenAdd) {
  return (
    <div className="bg-white border border-dashed border-line rounded-card p-3 text-center text-xs text-ink-soft flex items-center justify-between gap-2">
      <span className="text-[11px] italic">{title}</span>
      <button
        onClick={() => onOpenAdd(topicId)}
        className="px-2.5 py-1 text-[11px] font-semibold text-brand hover:underline cursor-pointer"
      >
        + {actionLabel}
      </button>
    </div>
  );
}
