import React from 'react';
import { BookOpen, Search, Star, Plus, Trophy, User } from 'lucide-react';

export default function Header({
  onOpenSearch,
  bookmarkedOnly,
  setBookmarkedOnly,
  onOpenAddModal,
  onOpenCompetitorMatrix,
  currentSpace,
}) {
  return (
    <header className="bg-white border-b border-line sticky top-0 z-30 shadow-card">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-btn bg-brand flex items-center justify-center text-white shadow-xs font-bold text-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink text-base tracking-tight">
                Syllabus Hub
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-light text-brand px-2 py-0.5 rounded-full border border-blue-200/50">
                PR003
              </span>
            </div>
            <p className="text-[11px] text-ink-soft hidden sm:block">
              {currentSpace === 'private' ? '🔒 My Study Space (Private)' : '👥 Shared Class Library (CS-401)'}
            </p>
          </div>
        </div>

        {/* Instant Search Bar (Ctrl+K) */}
        <div className="flex-1 max-w-xl mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-sky-50 border border-line rounded-btn text-ink-soft hover:bg-white hover:border-brand transition-all cursor-pointer text-left shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-ink-soft" />
              <span>Search topics, notes, videos across syllabus...</span>
            </div>
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-ink-soft bg-white px-2 py-0.5 rounded border border-line">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Competitor Matrix (Track A) */}
          <button
            onClick={onOpenCompetitorMatrix}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-btn border border-line bg-white hover:bg-brand-light hover:border-brand text-ink transition-all cursor-pointer active:scale-[0.98]"
            title="Track A Competitor Matrix"
          >
            <Trophy className="w-3.5 h-3.5 text-status-partial" />
            <span>Track A Matrix</span>
          </button>

          {/* Bookmarks Toggle */}
          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-btn border transition-all cursor-pointer active:scale-[0.98] ${
              bookmarkedOnly
                ? 'bg-amber-50 text-status-partial border-amber-300 font-semibold'
                : 'bg-white text-ink border border-line hover:bg-brand-light hover:border-brand'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-status-partial text-status-partial' : 'text-ink-soft'}`} />
            <span className="hidden sm:inline">Saved</span>
          </button>

          {/* Add Resource */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-brand text-white font-medium px-4 py-2 rounded-btn transition duration-150 hover:bg-brand-dark active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 cursor-pointer text-xs shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Resource</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-line ml-1">
            <div className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold text-xs border border-brand/20">
              N
            </div>
            <div className="hidden xl:block text-left">
              <span className="block text-xs font-semibold text-ink leading-tight">Niranjan</span>
              <span className="block text-[10px] text-ink-soft leading-tight">Semester 4</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
