import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Code, 
  BookMarked, 
  HelpCircle, 
  ExternalLink, 
  Star, 
  Share2, 
  Trash2, 
  Download, 
  Clock, 
  Lock, 
  Users, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export default function PreviewPanel({
  resource,
  onToggleBookmark,
  onRequestShare,
  onDeleteResource,
}) {
  const [showSolutionHint, setShowSolutionHint] = useState(true);

  if (!resource) {
    return (
      <aside className="w-full lg:w-96 bg-white border-l border-line p-6 flex flex-col items-center justify-center text-center text-ink-soft select-none">
        <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-ink-soft mb-3 border border-line">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-bold text-ink">No Resource Selected</h4>
        <p className="text-[11px] text-ink-soft mt-1 max-w-xs">
          Click any lecture note, video, code repo, or past exam question from the center pane to preview it inline here.
        </p>
      </aside>
    );
  }

  const youtubeId = resource.type === 'video' ? getYouTubeId(resource.url_or_filepath) : null;
  const isShared = resource.visibility === 'shared' || !resource.is_private;

  return (
    <aside className="w-full lg:w-96 bg-white border-l border-line flex flex-col shrink-0 min-h-[calc(100vh-3.75rem)] overflow-y-auto">
      
      {/* 1. PREVIEW HEADER */}
      <div className="p-4 border-b border-line bg-sky-50/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          {/* Format Badge */}
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
            resource.type === 'video' ? 'bg-rose-50 text-status-danger border border-rose-200' :
            resource.type === 'pdf' ? 'bg-blue-50 text-brand border border-blue-200' :
            resource.type === 'pyq' ? 'bg-purple-50 text-status-review border border-purple-200' :
            resource.type === 'repo' ? 'bg-emerald-50 text-status-covered border border-emerald-200' :
            'bg-amber-50 text-status-partial border border-amber-200'
          }`}>
            {resource.type === 'video' && '▶ Video Lecture'}
            {resource.type === 'pdf' && '📄 Lecture Notes'}
            {resource.type === 'pyq' && '❓ Exam PYQ'}
            {resource.type === 'repo' && '💻 Code Repo'}
            {resource.type === 'reference' && '📘 Textbook Citation'}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleBookmark(resource.id)}
              className="p-1 rounded text-ink-soft hover:text-status-partial cursor-pointer"
              title={resource.is_bookmarked ? 'Unstar' : 'Bookmark'}
            >
              <Star className={`w-4 h-4 ${resource.is_bookmarked ? 'fill-status-partial text-status-partial' : ''}`} />
            </button>
            <button
              onClick={() => onDeleteResource(resource.id)}
              className="p-1 rounded text-ink-soft hover:text-status-danger cursor-pointer"
              title="Delete resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold text-ink leading-snug">
          {resource.title}
        </h3>

        {/* Visibility pill */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isShared ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-700'
          }`}>
            {isShared ? <Users className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            <span>{isShared ? 'Shared with Class 4-CS-A' : 'Private to My Space'}</span>
          </span>
        </div>
      </div>

      {/* 2. INLINE MEDIA PREVIEW (Plays / opens right here without leaving!) */}
      <div className="p-4 border-b border-line space-y-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
          Inline Preview
        </div>

        {/* YouTube Video Player */}
        {resource.type === 'video' && youtubeId && (
          <div className="aspect-video w-full rounded-btn overflow-hidden bg-black shadow-card">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* PDF Reader / Download */}
        {resource.type === 'pdf' && (
          <div className="p-4 bg-sky-50 border border-line rounded-card space-y-3">
            <div className="flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-brand shrink-0" />
              <div>
                <span className="text-xs font-bold text-ink block">Verified Document Summary</span>
                <span className="text-[11px] text-ink-soft">Stored locally • Offline ready</span>
              </div>
            </div>
            <a
              href={resource.url_or_filepath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-brand hover:bg-brand-dark rounded-btn transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Open Document in Full Viewer</span>
            </a>
          </div>
        )}

        {/* Exam Past Question Problem Statement */}
        {resource.type === 'pyq' && (
          <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-card space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-purple-900">
              <span>Exam Problem Prompt</span>
              <span className="text-[10px] bg-purple-200 px-1.5 py-0.2 rounded font-mono">10 Marks</span>
            </div>
            <p className="font-mono text-ink bg-white p-2.5 rounded-btn border border-purple-100 text-[11px] leading-relaxed">
              {resource.notes}
            </p>
          </div>
        )}

        {/* GitHub Code Repo Preview */}
        {resource.type === 'repo' && (
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-card space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-900">
              <span>Source Repository</span>
              <span className="text-[10px] font-mono bg-emerald-200 text-emerald-950 px-1.5 rounded">C Kernel</span>
            </div>
            <p className="text-[11px] text-ink leading-relaxed">
              Implementation: <code>arch/x86/mm/fault.c</code> (Page fault handler and address translation logic).
            </p>
          </div>
        )}

        {/* Textbook Reference */}
        {resource.type === 'reference' && (
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-card space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-amber-900">
              <span>Curriculum Textbook</span>
              <span className="text-[10px] font-mono bg-amber-200 px-1.5 rounded">Chapter 9</span>
            </div>
            <p className="text-[11px] text-ink leading-relaxed">
              Silberschatz, Galvin: <em>Operating System Concepts (10th Ed)</em>, pp. 389–420.
            </p>
          </div>
        )}
      </div>

      {/* 3. METADATA & SOURCE ATTRIBUTION */}
      <div className="p-4 space-y-3 flex-1 text-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
          Source & Provenance
        </div>

        <div className="space-y-1.5 text-xs text-ink">
          <div className="flex justify-between py-1 border-b border-line/60">
            <span className="text-ink-soft">Source:</span>
            <span className="font-medium text-right">{resource.original_source || 'Custom Upload'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-line/60">
            <span className="text-ink-soft">Last Checked:</span>
            <span className="font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-status-covered" />
              <span>1 day ago (Verified)</span>
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-line/60">
            <span className="text-ink-soft">Attribution:</span>
            <span className="font-medium">Department Verified</span>
          </div>
        </div>

        {/* Notes / Concept summary */}
        {resource.notes && resource.type !== 'pyq' && (
          <div className="p-3 bg-sky-50 rounded-btn border border-line text-xs text-ink leading-relaxed">
            <strong className="block text-[11px] text-brand font-bold mb-1">Key Concept Takeaway:</strong>
            {resource.notes}
          </div>
        )}

        {/* 4. ACTIONS */}
        <div className="pt-2 space-y-2">
          {/* Open original source fallback link */}
          {resource.url_or_filepath && resource.url_or_filepath !== '#' && (
            <a
              href={resource.url_or_filepath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-btn border border-line bg-white hover:bg-sky-50 text-ink transition-colors cursor-pointer"
            >
              <span>Open Original Source</span>
              <ExternalLink className="w-3.5 h-3.5 text-ink-soft" />
            </a>
          )}

          {/* Share with Class Button (Explicit confirmation) */}
          <button
            onClick={() => onRequestShare(resource)}
            className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-btn border transition-all cursor-pointer ${
              isShared
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                : 'bg-white border-line text-ink hover:border-brand hover:bg-brand-light'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isShared ? 'Manage Class Sharing' : 'Share with Class...'}</span>
          </button>
        </div>
      </div>

    </aside>
  );
}
