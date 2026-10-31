import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  HelpCircle, 
  Code, 
  BookMarked, 
  ExternalLink, 
  Star, 
  Trash2, 
  Download,
  Share2,
  Lock,
  Users,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export default function ResourceCard({
  resource,
  onToggleBookmark,
  onToggleVisibility,
  onDeleteResource,
}) {
  const [showAnswerHint, setShowAnswerHint] = useState(false);
  const youtubeId = resource.type === 'video' ? getYouTubeId(resource.url_or_filepath) : null;

  const getTypeBadge = (type) => {
    switch (type) {
      case 'video':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200/80">
            <Video className="w-3.5 h-3.5" />
            Lecture Video
          </span>
        );
      case 'pdf':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/80">
            <FileText className="w-3.5 h-3.5" />
            Lecture Notes / PDF
          </span>
        );
      case 'pyq':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200/80">
            <HelpCircle className="w-3.5 h-3.5" />
            University PYQ
          </span>
        );
      case 'repo':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/80">
            <Code className="w-3.5 h-3.5" />
            Code Repository
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/80">
            <BookMarked className="w-3.5 h-3.5" />
            Textbook Citation
          </span>
        );
    }
  };

  const isShared = resource.visibility === 'shared' || !resource.is_private;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all">
      <div className="p-5">
        
        {/* Top Badges & Card Controls */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {getTypeBadge(resource.type)}

            {/* Visibility Pill */}
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                isShared
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isShared ? <Users className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>{isShared ? 'Shared with Class' : 'Private'}</span>
            </span>

            {/* Metadata info */}
            {resource.metadata_info && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {resource.metadata_info}
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Share / Private toggle */}
            {onToggleVisibility && (
              <button
                onClick={() => onToggleVisibility(resource.id)}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                  isShared
                    ? 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                    : 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
                title={isShared ? 'Change to Private note' : 'Share with classmates'}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">{isShared ? 'Shared' : 'Share'}</span>
              </button>
            )}

            {/* Bookmark Star */}
            <button
              onClick={() => onToggleBookmark(resource.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50/50 transition-colors cursor-pointer"
              title={resource.is_bookmarked ? 'Remove bookmark' : 'Bookmark for revision'}
            >
              <Star
                className={`w-4 h-4 ${
                  resource.is_bookmarked ? 'fill-amber-400 text-amber-500' : ''
                }`}
              />
            </button>

            {/* Delete button */}
            <button
              onClick={() => onDeleteResource(resource.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
          {resource.title}
        </h3>

        {/* Source Attribution line */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3.5">
          <span className="font-semibold text-slate-700">Source:</span>
          <span>{resource.original_source || 'Uploaded Material'}</span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Checked Oct 2026</span>
          </span>
        </div>

        {/* Media Previews */}

        {/* 1. YouTube Inline Player */}
        {resource.type === 'video' && youtubeId && (
          <div className="mb-4 aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner ring-1 ring-black/10">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* 2. PDF Download & Preview Banner */}
        {resource.type === 'pdf' && (
          <div className="mb-4 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-blue-950 block">Verified PDF Lecture Summary</span>
                <span className="text-[11px] text-blue-700/90">Local verified file storage • Ready for offline study</span>
              </div>
            </div>
            <a
              href={resource.url_or_filepath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Open Document</span>
            </a>
          </div>
        )}

        {/* 3. Past Exam Question (PYQ) Box */}
        {resource.type === 'pyq' && (
          <div className="mb-4 p-4 bg-purple-50/70 border border-purple-200/80 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between text-purple-950 font-bold">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                Exam Problem Statement
              </span>
              <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                10 Marks Weightage
              </span>
            </div>
            <p className="font-mono text-slate-800 bg-white p-3 rounded-lg border border-purple-100 leading-relaxed">
              {resource.notes}
            </p>
          </div>
        )}

        {/* 4. Notes / Key Takeaways Box */}
        {resource.notes && resource.type !== 'pyq' && (
          <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3.5 leading-relaxed">
            <strong className="text-slate-900 block mb-1">Key Concept Takeaway:</strong>
            {resource.notes}
          </div>
        )}

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px]">
            {isShared ? '👥 Published to Class Library' : '🔒 Stored in Private Space'}
          </span>

          {resource.url_or_filepath && resource.url_or_filepath !== '#' && (
            <a
              href={resource.url_or_filepath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <span>Open Original Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
